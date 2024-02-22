import { useContext } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { FlowDesignerContext } from '../flow-designer-context';
import { Allotment } from 'allotment';

import { FlowImplemtationDiagram } from './flow-implementation-diagram';
import { FlowImplementationPanel } from './flow-implementation-panel/flow-implementation-panel';
// import { FlowImplementationNotFound } from '../../../common/flow-implementation-not-found';
import { useFlowStore } from '../../flow-store';
import { FlowImplementationNotFound } from '../../../common/flow-implementation-not-found';

export function FlowImplementationView() {
  const flowImplementationServerUrl = useFlowStore(
    (state) => state.flowImplementationServerUrl
  );

  const { flowImplementation, flowDefinition } =
    useContext(FlowDesignerContext);

  if (!flowImplementation) {
    return (
      <FlowImplementationNotFound
        bindId={flowDefinition.bindId}
        flowImplementationServerUrl={flowImplementationServerUrl}
      />
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper
        square
        sx={{
          padding: '10px',
          borderTop: '1px solid rgb(230,230,230)',
          display: 'flex',
          zIndex: 1,
          fontSize: '14px',
        }}
      >
        <Box sx={{ color: 'rgb(130,130,130)' }}>Implementation:</Box>
        <Box sx={{ paddingLeft: '5px' }}>{flowImplementation?.type}</Box>

        <Box sx={{ paddingLeft: '25px', color: 'red' }}>Not Valid</Box>
      </Paper>

      <Allotment>
        <Allotment.Pane>
          <FlowImplemtationDiagram />
        </Allotment.Pane>

        <Allotment.Pane maxSize={700} minSize={200} preferredSize={400}>
          <FlowImplementationPanel />
        </Allotment.Pane>
      </Allotment>
    </Box>
  );
}
