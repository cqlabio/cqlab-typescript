import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import debounce from 'lodash/debounce';
import Box from '@mui/material/Box';
import compact from 'lodash/compact';
import Button from '@mui/material/Button';
import { useUpdateFlowDefinitionMutation } from '../../../../data/queries';
import { FlowDesignerContext } from '../../flow-designer-context';
// import MonacoEditor from 'react-monaco-editor';

import Editor, { DiffEditor, useMonaco, OnMount } from '@monaco-editor/react';
import monacoRoot, {
  MarkerSeverity,
  Uri,
} from 'monaco-editor/esm/vs/editor/editor.api';

import { shallow } from 'zustand/shallow';
import { flowDefinitionSchema, IFlowDefinition } from '@cqlab/cqflow-core';
import Ajv, { ValidateFunction, ErrorObject } from 'ajv';
import jsonMap from 'json-source-map';

interface JsonPointerRow {
  line: number;
  column: number;
  pos: number;
}

// https://github.com/epoberezkin/json-source-map
interface LocalJsonPointer {
  // This key properties are only present if parent data is an object (rather than array).
  key?: JsonPointerRow;
  keyEnd?: JsonPointerRow;
  value: JsonPointerRow;
  valueEnd: JsonPointerRow;
}

interface LocalMapResult {
  data: any;
  pointers: Record<string, LocalJsonPointer>;
}

interface LocalMarkerData {
  code?:
    | string
    | {
        value: string;
        target: Uri;
      };
  severity: MarkerSeverity;
  message: string;
  source?: string;
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

type LocalMarkerDataOrNull = LocalMarkerData | null;

export function FlowJsonViewer() {
  const monacoInstance = useMonaco();
  const [isEditing, setIsEditing] = useState(false);

  const { flowDefinition } = useContext(FlowDesignerContext);
  const { mutate: updateFlowDefinition } = useUpdateFlowDefinitionMutation();

  const [code, setCode] = useState<string | null>(
    JSON.stringify(flowDefinition, null, 2)
  );

  const [monacoEditor, setMonacoEditor] =
    useState<monacoRoot.editor.IStandaloneCodeEditor | null>(null);

  const validate = useRef<ValidateFunction>();

  const validateDefintion = useCallback(
    (flowDefStr: string) => {
      if (!validate.current || !monacoEditor || !monacoInstance) return;

      const model = monacoEditor.getModel();
      if (!model) {
        return;
      }

      let flowDefinition: IFlowDefinition | null = null;
      try {
        flowDefinition = JSON.parse(flowDefStr);
      } catch (err) {
        if (err) {
          console.error(err);
          return;
        }
      }

      if (!flowDefinition) return;

      const valid = validate.current(flowDefinition);

      if (valid) {
        monacoInstance.editor.setModelMarkers(model, 'owner', []);
      } else if (!valid && validate.current.errors) {
        const mapResult = jsonMap.parse(flowDefStr) as LocalMapResult;

        const nextErrors: LocalMarkerDataOrNull[] = validate.current.errors.map(
          (error) => {
            const foundPointer = mapResult.pointers[error.instancePath];

            if (!foundPointer) {
              return null;
            }

            const val: LocalMarkerData = {
              severity: MarkerSeverity.Error,
              message: error.message || 'Unknown error',
              startLineNumber: foundPointer.key?.line
                ? foundPointer.key.line + 1
                : foundPointer.value.line + 1,
              startColumn: foundPointer.key?.column
                ? foundPointer.key.column
                : foundPointer.valueEnd.column,
              endLineNumber: foundPointer.valueEnd.line + 1,
              endColumn: foundPointer.valueEnd.column,
              code: '1',
            };

            return val;
          }
        );

        monacoInstance.editor.setModelMarkers(
          model,
          'owner',
          compact(nextErrors)
        );
      }
    },
    [monacoInstance, monacoEditor]
  );

  useEffect(() => {
    const ajv = new Ajv({
      discriminator: true,
      allErrors: true,
    });
    validate.current = ajv.compile(flowDefinitionSchema);
  }, []);

  const doValidateDebounce = useMemo(
    () =>
      debounce((flowDefStr: string) => {
        validateDefintion(flowDefStr);
      }, 300),
    [validateDefintion]
  );

  useEffect(() => {
    if (code && monacoEditor) {
      doValidateDebounce(code);
    }
  }, [code, monacoEditor, doValidateDebounce]);

  const toggleEdit = () => setIsEditing(!isEditing);

  const onChange = (newValue: string | undefined) => {
    setCode(newValue || null);
    if (newValue) {
      doValidateDebounce(newValue);
    }
  };

  const onSave = () => {
    try {
      const parsed = JSON.parse(code || '');
      const nextDef = {
        // Make sure we only really allow node editing, can probably give better UX here
        // Perhaps only display nodes
        ...flowDefinition,
        nodes: {
          ...parsed.nodes,
        },
      };

      updateFlowDefinition(nextDef);
    } catch (err: any) {
      alert('Invalid JSON: ' + err.message);
      return;
    }
  };

  const onReset = () => {
    setCode(JSON.stringify(flowDefinition, null, 2));
  };

  const onCancel = () => {
    onReset();
    toggleEdit();
  };

  const monOptions = {
    readOnly: !isEditing,
    renderValidationDecorations: 'on',
  } as const;

  const onEditorMount: OnMount = (editor, monacoInstance) => {
    setMonacoEditor(editor);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ padding: '7px' }}>
        {isEditing ? (
          <>
            <Button onClick={onSave} size="small" variant="contained">
              Update
            </Button>
            <Button
              sx={{ marginLeft: '5px' }}
              onClick={onCancel}
              size="small"
              variant="contained"
              color="secondary"
            >
              Cancel
            </Button>
            <Button onClick={onReset} size="small">
              Reset
            </Button>
          </>
        ) : (
          <Button onClick={toggleEdit} size="small" variant="contained">
            Edit
          </Button>
        )}
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Editor
          width="800"
          height="100%"
          language="json"
          // defaultPath={modelUri.toString()}
          // model={modelUri}
          value={code || undefined}
          onChange={onChange}
          options={monOptions}
          onMount={onEditorMount}
        />
      </Box>
    </Box>
  );
}

// <Box sx={{ height: '100%', overflowY: 'scroll', maxHeight: '500px' }}>
//   <pre>{JSON.stringify(flowDefinition, null, 2)}</pre>
// </Box>
