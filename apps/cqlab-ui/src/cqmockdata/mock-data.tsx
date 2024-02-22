import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useMockData } from '../data/queries-flow-implementation';
import { NavLink } from 'react-router-dom';
import { MockDataDialog } from './mock-data-dialog';
import { FlowImplementationNotFound } from '../common/flow-implementation-not-found';
import { useFlowStore } from '../cqflow/flow-store';

const textMockData = [
  {
    id: '1',
    label: 'Name',
  },
];

export function MockData() {
  const flowImplementationServerUrl = useFlowStore(
    (state) => state.flowImplementationServerUrl
  );

  const { data: mockData, error } = useMockData(flowImplementationServerUrl);

  const [selectedMockData, setSelectedMockData] = useState<string | null>(null);

  if (!flowImplementationServerUrl) {
    return (
      <FlowImplementationNotFound
        flowImplementationServerUrl={flowImplementationServerUrl}
      />
    );
  }

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
          Mock Data
        </Box>

        {mockData?.map((mockData) => (
          <Box
            key={mockData.id}
            sx={{
              padding: '7px 10px',
              borderBottom: '1px solid rgb(230,230,230)',
            }}
          >
            <Box
              onClick={() => setSelectedMockData(mockData.id)}
              sx={{
                cursor: 'pointer',
                ':hover': {
                  color: 'secondary.main',
                },
              }}
            >
              {mockData.label}
            </Box>
          </Box>
        ))}
      </Paper>
      <MockDataDialog
        isOpen={!!selectedMockData}
        onToggleOpen={() => setSelectedMockData(null)}
        mockDataId={selectedMockData || ''}
      />
    </Box>
  );
}
