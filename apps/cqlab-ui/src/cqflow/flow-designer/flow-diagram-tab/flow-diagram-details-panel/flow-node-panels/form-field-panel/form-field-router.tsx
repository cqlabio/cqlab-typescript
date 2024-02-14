import Box from '@mui/material/Box';
import {
  DefinitionNodeTypeEnum,
  FieldTypeEnum,
  IBaseNextNode,
  IFormFieldNode,
} from '@cqlab/cqflow-core';
import { NodeTypeWithDelete } from '../../common/node-type-with-delete';
import { PanelLabel } from '../../common/panel-label';
import { PanelNodeLabel } from '../../common/panel-node-label';
import { PanelNodeId } from '../../common/panel-node-id';
import { PanelWrapper } from '../../common/panel-wrapper';
import { LinkNextSection } from '../../common/link-next-section';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { ReactNode, useContext } from 'react';
import { FlowDesignerContext } from '../../../../flow-designer-context';
import { OptionField } from './option-field/option-field';
const fieldTypes = [
  {
    type: FieldTypeEnum.Text,
    label: 'Text',
  },
  {
    type: FieldTypeEnum.Number,
    label: 'Number',
  },
  {
    type: FieldTypeEnum.MultiOption,
    label: 'Multi-Option',
  },
];

type FormFieldRouterProps = {
  node: IFormFieldNode;
};

export function FormFieldRouter({ node }: FormFieldRouterProps) {
  const { doNodeUpdates } = useContext(FlowDesignerContext);

  const handleTypeChange = function (event: SelectChangeEvent) {
    const nextType = event.target.value as FieldTypeEnum;

    const baseProperties: IBaseNextNode = {
      nodeType: DefinitionNodeTypeEnum.FormField,
      bindId: node.bindId,
      id: node.id,
      label: node.label,
      position: node.position,
      next: node.next,
    };

    let nextNode: IFormFieldNode | null = null;

    if (nextType === FieldTypeEnum.Text) {
      nextNode = {
        ...baseProperties,
        nodeType: DefinitionNodeTypeEnum.FormField,
        fieldType: FieldTypeEnum.Text,
        field: {
          fieldType: FieldTypeEnum.Text,
        },
      };
    } else if (nextType === FieldTypeEnum.Number) {
      nextNode = {
        ...baseProperties,
        nodeType: DefinitionNodeTypeEnum.FormField,
        fieldType: FieldTypeEnum.Number,
        field: {
          fieldType: FieldTypeEnum.Number,
        },
      };
    } else if (nextType === FieldTypeEnum.MultiOption) {
      nextNode = {
        ...baseProperties,
        nodeType: DefinitionNodeTypeEnum.FormField,
        fieldType: FieldTypeEnum.MultiOption,
        field: {
          fieldType: FieldTypeEnum.MultiOption,
          options: [],
          min: 0,
          max: null,
        },
      };
    } else {
      throw new Error('Not expecting this field type: ' + nextType);
    }

    doNodeUpdates({
      op: 'update',
      node: nextNode,
    });
  };

  let component: ReactNode | null = null;

  if (node.fieldType === FieldTypeEnum.MultiOption) {
    component = <OptionField node={node} />;
  }

  return (
    <Box>
      <Select
        fullWidth
        value={node.fieldType}
        onChange={handleTypeChange}
        sx={{ minWidth: '100px', background: 'white', marginTop: '3px' }}
        size={'small'}
        // label="Choose Patient"
        displayEmpty
      >
        {fieldTypes.map((fieldType) => (
          <MenuItem key={fieldType.type} value={fieldType.type}>
            {fieldType.label}
          </MenuItem>
        ))}
      </Select>
      {component}
    </Box>
  );
}
