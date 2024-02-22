import Box from '@mui/material/Box';
import { useContext } from 'react';
import { FlowDesignerContext } from '../../flow-designer-context';
import { PanelLabel } from '../../flow-diagram-tab/flow-diagram-details-panel/common/panel-label';

export function RootImplementationPanel() {
  const { flowImplementation } = useContext(FlowDesignerContext);

  const props = Object.keys(flowImplementation?.nodeBindings || {}).map(
    (bindingKey) => {
      const binding = flowImplementation?.nodeBindings[bindingKey];
      return (
        <Box>
          {bindingKey}: {binding?.nodeType}{' '}
        </Box>
      );
    }
  );

  return (
    <Box sx={{ padding: '0 10px' }}>
      <PanelLabel label="Node Bindings" />
      {props}
    </Box>
  );
}
