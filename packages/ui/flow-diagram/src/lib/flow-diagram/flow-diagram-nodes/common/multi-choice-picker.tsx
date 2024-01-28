import React, { memo, useContext, LegacyRef } from 'react';
// import { Handle, Position } from 'reactflow';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {
  NodeResizeControl,
  Handle,
  Position,
  useStore,
  useStoreApi,
} from 'reactflow';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import { INextMulti } from '@cqlab/cqflow-core';
import { createIdFromIndex } from '../../convert-nodes-and-edges';

export const alphabet = 'abcdefghijklmnopqrstuvwxyz';

type MultiChoicePickerProps = {
  isSelected: boolean;
  next?: INextMulti;
};

export function MultiChoicePicker({
  isSelected,
  next,
}: MultiChoicePickerProps) {
  const options = next?.options.map((opt, index) => {
    return (
      <Box
        sx={{
          display: 'flex',
          cursor: 'default',
          position: 'relative',
          minWidth: '60px',
          borderTop: '1px solid rgb(230,230,230)',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            margin: '1px',
            padding: '0 5px',
            background: '#FFFAEA',
            alignItems: 'center',
          }}
        >
          {/* icon */}
          <LocationSearchingIcon sx={{ fontSize: '14px', color: '#5E4A06' }} />

          <Handle
            id={createIdFromIndex(opt.id)}
            position={Position.Bottom}
            type="source"
            isConnectableStart={true}
            style={{
              // position: 'relative',
              // top: '-2px',
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: 0,
              border: 0,
              top: 0,
              right: 0,
              left: '12px',
              bottom: 0,
              opacity: 0,
            }}
          />
        </Box>
        <Box sx={{ flexGrow: 1, padding: '2px 6px', textAlign: 'left' }}>
          {alphabet[index]}
        </Box>
      </Box>
    );
  });

  return (
    <Paper
      square
      elevation={3}
      sx={{
        opacity: !isSelected ? 0 : 1,
        // display: !isSelected ? 'none' : 'default',
        width: !isSelected ? 0 : 'default',
        overflow: !isSelected ? 'hidden' : 'none',
        fontSize: '11px',
      }}
    >
      {options}
    </Paper>
  );
}
