import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useVocabularyCodes } from '../data/queries-flow-implementation';
import { NavLink } from 'react-router-dom';
import { CodeListPanel } from './code-list-panel';
import { useFlowStore } from '../cqflow/flow-store';

export function CodeList() {
  const flowImplementationServerUrl = useFlowStore(
    (state) => state.flowImplementationServerUrl
  );

  const { data: codes, error } = useVocabularyCodes(
    flowImplementationServerUrl
  );

  return (
    <Box>
      <Paper sx={{ margin: '40px' }}>
        <Box
          sx={{
            padding: '12px',
            borderBottom: '1px solid rgb(230,230,230)',
            textTransform: 'uppercase',
            fontSize: '14px',
            color: 'rgb(30,30,30)',
            fontWeight: 'bold',
          }}
        >
          All Codes
        </Box>
        <CodeListPanel codes={codes || []} />
      </Paper>
    </Box>
  );
}
