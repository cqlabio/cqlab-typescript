import { useState, useEffect, KeyboardEventHandler } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
// import { DataHook } from '@cqlabio/shared/types';

type CreateOptionProps = {
  buttonLabel: string;
  onCreateOption: (label: string) => void;
};

export function BranchChoiceCreateOption({
  buttonLabel,
  onCreateOption,
}: CreateOptionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [optionLabel, setOptionLabel] = useState('');

  useEffect(() => {
    if (isAdding) {
      setOptionLabel('');
    }
  }, [isAdding]);

  const toggleAdding = () => setIsAdding(!isAdding);

  const onInputChange = (e: any) => {
    setOptionLabel(e.target.value);
  };

  const handleCreateOption = () => {
    onCreateOption(optionLabel);
    toggleAdding();
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'Enter') {
      handleCreateOption();
    }
  };

  return (
    <Box>
      {isAdding ? (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              autoFocus
              value={optionLabel}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              margin="dense"
              fullWidth
              variant="standard"
              color="secondary"
              size="small"
            />
          </Box>
          <Box sx={{ paddingLeft: '10px' }}>
            <Button
              size="small"
              onClick={handleCreateOption}
              variant="contained"
            >
              Add
            </Button>
          </Box>
        </Box>
      ) : (
        <Button
          size="small"
          onClick={toggleAdding}
          variant="contained"
          sx={{ marginTop: '8px' }}
        >
          {buttonLabel}
        </Button>
      )}
    </Box>
  );
}
