import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';

type UploadFlowDialogProps = {
  isOpen: boolean;
  onToggleOpen: () => void;
};

export function ChatGPTDialog({ isOpen, onToggleOpen }: UploadFlowDialogProps) {
  const [flowString, setFlowString] = useState('');

  const onFlowStringChange = (e: any) => {
    setFlowString(e.target.value);
  };

  const onCreateFlow = () => {
    // const flowDefinition = JSON.parse(flowString);

    axios
      .post('http://localhost:3003/api/flows/chat-gpt', {
        textInput: flowString,
      })
      .then((res) => {
        console.log(res.data);

        // onToggleOpen();
      });
  };

  return (
    <Dialog open={isOpen} fullWidth maxWidth="md" onClose={onToggleOpen}>
      <DialogTitle>Chat GPT Dialog</DialogTitle>
      <DialogContent
        sx={{
          padding: 0,
          borderTop: '1px solid rgb(230,230,230)',
          background: 'rgb(250,250,250)',
        }}
      >
        <Box sx={{ padding: '15px 15px 5px 15px' }}>Chat GPT Text</Box>
        <Box sx={{ padding: '0px 15px 15px 15px' }}>
          <TextField
            multiline
            minRows={8}
            fullWidth
            value={flowString}
            onChange={onFlowStringChange}
          />
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
