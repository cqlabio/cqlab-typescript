import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import orderBy from 'lodash/orderBy';
import { useVocabularyValueSet } from '../data/queries-flow-implementation';
import { useParams, NavLink } from 'react-router-dom';
import { CodeListPanel } from './code-list-panel';
import { useFlowStore } from '../cqflow/flow-store';

export function ValueSetDetails() {
  const { valueSetId } = useParams();

  const flowImplementationServerUrl = useFlowStore(
    (state) => state.flowImplementationServerUrl
  );

  const { data: codes, error } = useVocabularyValueSet(
    flowImplementationServerUrl,
    valueSetId as string
  );

  return (
    <Box sx={{ padding: '30px 40px' }}>
      <Box
        sx={{
          paddingBottom: '8px',
          a: {
            textDecoration: 'none',
            // color: 'secondary.main',
            color: 'black',
            fontWeight: 'bold',
          },
        }}
      >
        <NavLink to={`/vocabulary/value-sets`}>{'<'} Back</NavLink>
      </Box>
      <Paper>
        <Box
          sx={{
            padding: '12px',
            borderBottom: '1px solid rgb(230,230,230)',
            color: 'rgb(100,100,100)',
            fontSize: '13px',
          }}
        >
          VALUE SET:{' '}
          <span style={{ color: 'black', fontSize: '16px' }}>{valueSetId}</span>
        </Box>

        <CodeListPanel codes={codes || []} />
      </Paper>
    </Box>
  );
}
