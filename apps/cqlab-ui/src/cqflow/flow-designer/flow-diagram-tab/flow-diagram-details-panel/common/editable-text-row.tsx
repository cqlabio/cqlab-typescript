import { useState, KeyboardEventHandler } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/EditOutlined';
import CheckIcon from '@mui/icons-material/CheckOutlined';
import CancelIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Close';

type EditableTextRowProps = {
  value: string;
  onSaveValue: (label: string) => void;
  validator?: (label: string) => string | null;
  onDelete?: () => void;
  isMultiLine?: boolean;
  emptyDisplayValue?: string;
};

export function EditableTextRow({
  value,
  onSaveValue,
  validator,
  onDelete,
  isMultiLine,
  emptyDisplayValue,
}: EditableTextRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [optionLabel, setOptionLabel] = useState('');
  const [validationError, setValidationError] = useState('');

  const startEditing = () => {
    setOptionLabel(value);
    setIsEditing(true);
  };

  const onCancel = () => {
    setIsEditing(false);
    setValidationError('');
  };

  const onInputChange = (e: any) => {
    if (validationError) {
      setValidationError('');
    }
    setOptionLabel(e.target.value);
  };

  const handleUpdateText = () => {
    if (validator) {
      const errorMessage = validator(optionLabel);
      if (errorMessage) {
        setValidationError(errorMessage);
        return;
      }
    }
    onSaveValue(optionLabel);
    setIsEditing(false);
    setOptionLabel('');
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'Enter') {
      handleUpdateText();
    }
  };

  return (
    <Box>
      {isEditing ? (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              autoFocus
              value={optionLabel}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              multiline={isMultiLine}
              margin="dense"
              fullWidth
              variant={isMultiLine ? 'outlined' : 'standard'}
              color={isMultiLine ? 'primary' : 'secondary'}
              size="small"
            />
          </Box>

          <Box
            sx={{ paddingLeft: '10px', display: 'flex', alignItems: 'center' }}
          >
            {/* <Button size="small" onClick={handleUpdateText} variant="contained">
              Save
            </Button> */}

            <IconButton
              size="small"
              onClick={onCancel}
              sx={{ marginLeft: '5px', border: '1px solid rgb(220,220,220)' }}
            >
              <CancelIcon
                className="cancel-icon"
                sx={{
                  color: 'rgb(150,150,150)',
                  fontSize: '16px',
                  ':hover': {
                    color: 'red',
                  },
                }}
              />
            </IconButton>

            <IconButton
              size="small"
              onClick={handleUpdateText}
              sx={{
                marginLeft: '5px',
                border: '1px solid rgb(220,220,220)',
                ':hover': {
                  // background: '#BBDEFB'
                },
              }}
            >
              <CheckIcon color="success" sx={{ fontSize: '16px' }} />
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex' }}>
          {!value && emptyDisplayValue && (
            <Box sx={{ flexGrow: 1, fontStyle: 'italic', color: 'grey' }}>
              {emptyDisplayValue}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }}>{value}</Box>

          {onDelete && (
            <IconButton
              size="small"
              onClick={onDelete}
              sx={{ marginLeft: '5px', padding: '2px' }}
            >
              <RemoveIcon
                sx={{ color: 'rgb(180,180,180)', fontSize: '16px' }}
              />
            </IconButton>
          )}

          <IconButton
            size="small"
            onClick={startEditing}
            sx={{ marginLeft: '5px', padding: '2px' }}
          >
            <EditIcon sx={{ color: 'rgb(180,180,180)', fontSize: '16px' }} />
          </IconButton>
        </Box>
      )}
      {validationError && <Alert severity="error">{validationError}</Alert>}
    </Box>
  );
}
