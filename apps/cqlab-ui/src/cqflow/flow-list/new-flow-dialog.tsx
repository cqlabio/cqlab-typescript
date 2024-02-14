import { useState, useEffect, KeyboardEventHandler } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FlowDefinitionTypeEnum } from '@cqlab/cqflow-core';
import { useCreateFlowDefinitionMutation } from '../../data/queries';
import { validateFlowBindId } from '../../data//validation';

type NewFlowDialogProps = {
  isOpen: boolean;
  onToggleOpen: () => void;
};

export function NewFlowDialog({ isOpen, onToggleOpen }: NewFlowDialogProps) {
  const navigate = useNavigate();
  const { mutateAsync: createFlowDefinition } =
    useCreateFlowDefinitionMutation();

  const [nameError, setNameError] = useState('');

  const [id, setId] = useState('');

  const onIdChange = (e: any) => {
    if (nameError) {
      setNameError('');
    }
    setId(e.target.value);
  };

  const onCreateFlow = () => {
    if (!validateFlowBindId(id)) {
      setNameError(
        'Bind id must have lowercase letters, numbers, dashes only. For example: my-flow-1'
      );
      return;
    }

    createFlowDefinition({
      bindId: id,
      version: '0.0.1',
      type: FlowDefinitionTypeEnum.NonInteractive,
      nodes: {},
    }).then((res) => {
      navigate(`/flow/${res.data.id}`);
    });
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'Enter') {
      onCreateFlow();
    }
  };

  return (
    <Dialog open={isOpen} fullWidth maxWidth="md" onClose={onToggleOpen}>
      <DialogTitle>Create New Flow</DialogTitle>
      <DialogContent
        sx={{
          padding: 0,
          borderTop: '1px solid rgb(230,230,230)',
          background: 'rgb(250,250,250)',
        }}
      >
        <Box sx={{ padding: '15px 15px 5px 15px' }}>ID</Box>
        <Box sx={{ padding: '0px 15px 15px 15px' }}>
          <TextField
            fullWidth
            value={id}
            onChange={onIdChange}
            size="small"
            onKeyDown={handleKeyDown}
          />
          {nameError && (
            <Alert severity="error" sx={{ marginTop: '10px' }}>
              {nameError}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onToggleOpen} color="secondary">
          Cancel
        </Button>
        <Button onClick={onCreateFlow} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
