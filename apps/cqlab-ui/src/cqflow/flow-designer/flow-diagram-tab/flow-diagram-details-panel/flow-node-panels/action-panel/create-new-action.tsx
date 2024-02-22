import { useState, useEffect, KeyboardEventHandler } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
// import { DataHook } from '@cqlabio/shared/types';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { ActionEnum } from '@cqlab/cqflow-core';

type CreateOptionProps = {
  onCreateAction: (actionType: ActionEnum, label: string) => void;
};

export function CreateNewAction({ onCreateAction }: CreateOptionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [optionLabel, setOptionLabel] = useState('');
  const [actionType, setActionType] = useState<ActionEnum>(ActionEnum.Order);

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
    onCreateAction(actionType, optionLabel);
    toggleAdding();
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'Enter') {
      handleCreateOption();
    }
  };

  const handleTypeChange = function (event: SelectChangeEvent) {
    const nextType = event.target.value as ActionEnum;
    setActionType(nextType);
  };

  const onCancel = () => {
    toggleAdding();
  };

  const actionTypes = Object.keys(ActionEnum);

  return (
    <Box>
      {isAdding ? (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ paddingRight: '10px' }}>
              <Select
                fullWidth
                value={actionType}
                onChange={handleTypeChange}
                sx={{
                  minWidth: '100px',
                  background: 'white',
                  marginTop: '3px',
                }}
                size={'small'}
                // label="Choose Patient"
                displayEmpty
              >
                {actionTypes.map((actionType) => (
                  <MenuItem key={actionType} value={actionType}>
                    {actionType}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <TextField
                autoFocus
                value={optionLabel}
                onChange={onInputChange}
                onKeyDown={handleKeyDown}
                margin="dense"
                fullWidth
                // variant="standard"
                // color="secondary"
                size="small"
              />
            </Box>
          </Box>
          <Box sx={{ paddingTop: '5px', textAlign: 'right' }}>
            <Button
              sx={{ marginRight: '5px' }}
              onClick={onCancel}
              variant="outlined"
              color="secondary"
            >
              Cancel
            </Button>
            <Button onClick={handleCreateOption} variant="contained">
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
          New Action
        </Button>
      )}
    </Box>
  );
}
