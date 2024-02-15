import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { useMockDataById } from '../data/queries-flow-implementation';
import { useFlowStore } from '../cqflow/flow-store';
import { CodeHighlighter } from '../common/code-highlighter';
// import { CodeHighlighter }
type MockDataDialogProps = {
  isOpen: boolean;
  onToggleOpen: () => void;
  mockDataId: string;
};

export function MockDataDialog({
  isOpen,
  onToggleOpen,
  mockDataId,
}: MockDataDialogProps) {
  const flowImplementationServerUrl = useFlowStore(
    (state) => state.flowImplementationServerUrl
  );

  const { data: mockData, error } = useMockDataById(
    flowImplementationServerUrl,
    mockDataId
  );

  return (
    <Dialog open={isOpen} fullWidth maxWidth="md" onClose={onToggleOpen}>
      <DialogTitle>Mock Data</DialogTitle>
      <DialogContent
        sx={{
          padding: 0,
          borderTop: '1px solid rgb(230,230,230)',
          background: 'rgb(250,250,250)',
          fontSize: '14px',
        }}
      >
        <CodeHighlighter
          language="JSON"
          code={JSON.stringify(mockData?.data, null, 2)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onToggleOpen} color="secondary">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
