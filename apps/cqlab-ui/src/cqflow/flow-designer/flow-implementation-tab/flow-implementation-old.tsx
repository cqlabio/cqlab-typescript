import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { IFlowImplementation } from '@cqlab/cqflow-core';
import { FlowDesignerContext } from '../flow-designer-context';
import { useContext } from 'react';

export function FlowImplementationView() {
  const { flowImplementation } = useContext(FlowDesignerContext);

  if (!flowImplementation) {
    return <Box>Flow Implementation not found</Box>;
  }

  const labelStyle = {
    padding: '10px 0px 3px 0px',
    color: 'rgb(150,150,150)',
    textTransform: 'uppercase',
    fontSize: '13px',
  } as const;

  return (
    <Paper>
      <Box sx={{ padding: '10px', borderBottom: '1px solid rgb(230,230,230)' }}>
        Implementation
      </Box>
      <Box sx={{ padding: '5px 15px 15px 15px' }}>
        <Box sx={labelStyle}>Id</Box>
        <Box sx={{ padding: '0px 0px 3px 0px' }}>{flowImplementation.id}</Box>
        <Box sx={labelStyle}>Flow Type</Box>
        <Box sx={{ padding: '0px 0px 3px 0px' }}>{flowImplementation.type}</Box>
        <Box sx={labelStyle}>SDK</Box>
        <Box sx={{ padding: '0px 0px 3px 0px' }}>Typescript</Box>

        <Box sx={labelStyle}>Node Bindings</Box>
        <Box sx={{ padding: '0px 0px 3px 0px' }}>
          {Object.keys(flowImplementation.nodeBindings).map((bindingKey) => (
            <Box key={bindingKey}>{bindingKey}</Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
}
