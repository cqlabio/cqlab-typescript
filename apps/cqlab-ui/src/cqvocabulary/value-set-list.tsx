import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useVocabularyValueSets } from '../data/queries-flow-implementation';
import { NavLink } from 'react-router-dom';
import { useFlowStore } from '../cqflow/flow-store';

export function ValueSetList() {
  const flowImplementationServerUrl = useFlowStore(
    (state) => state.flowImplementationServerUrl
  );

  const { data: valueSets, error } = useVocabularyValueSets(
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
          Value Sets
        </Box>

        {valueSets?.map((valueSet) => (
          <Box
            key={valueSet.id}
            sx={{
              padding: '7px 10px',
              borderBottom: '1px solid rgb(230,230,230)',
              a: {
                textDecoration: 'none',
                color: 'inherit',
                fontSize: '15px',
                ':hover': {
                  color: 'secondary.main',
                },
              },
            }}
          >
            <NavLink to={`/vocabulary/value-sets/${valueSet.id}`}>
              {valueSet.label}
            </NavLink>
          </Box>
        ))}
      </Paper>
    </Box>
  );
}
