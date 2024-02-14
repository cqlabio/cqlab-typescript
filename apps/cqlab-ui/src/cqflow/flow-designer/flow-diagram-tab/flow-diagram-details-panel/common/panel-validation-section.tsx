import { useContext } from 'react';
import Alert from '@mui/material/Alert';
import { PanelLabel } from './panel-label';
import { validateDefinitionForNode } from '../../../../../data/do-validation';
import { useFlowStore } from '../../../../flow-store';
import { FlowDesignerContext } from '../../../flow-designer-context';

type PanelValidationSectionProps = {
  nodeId: string;
};

export function PanelValidationSection({
  nodeId,
}: PanelValidationSectionProps) {
  const { flowDefinition } = useContext(FlowDesignerContext);

  // const validationResult = useFlowStore((state) => {
  //   return validateDefinitionForNode(
  //     flowDefinition,
  //     state.flowImplementation,
  //     nodeId
  //   );
  // });

  return (
    <>
      <PanelLabel label="Validation" />
      {/* {validationResult.isValid ? (
        <Alert sx={{ marginTop: '3px' }} severity="success">
          Configuration complete
        </Alert>
      ) : (
        <Alert sx={{ marginTop: '3px' }} severity="error">
          {validationResult.message}
        </Alert>
      )} */}
    </>
  );
}
