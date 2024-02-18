import React, { memo, useContext, LegacyRef } from 'react';
// import { Handle, Position } from 'reactflow';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Handle, Position } from 'reactflow';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import { FlowDiagramContext } from '../../flow-diagram-context';

type NextPickerProps = {
  isSelected: boolean;
  sourceId: string;
};

export function NextPicker({ isSelected, sourceId }: NextPickerProps) {
  const { updateCreatingEdge } = useContext(FlowDiagramContext);

  const onCreateEdge = () => {
    updateCreatingEdge({ sourceId: sourceId || '' });
  };

  return (
    <Paper
      square
      elevation={3}
      sx={{
        opacity: !isSelected ? 0 : 1,
        // display: !isSelected ? 'none' : 'default',

        fontSize: '11px',
        width: !isSelected ? 0 : 'default',
        overflow: !isSelected ? 'hidden' : 'none',
      }}
    >
      <Box
        onClick={onCreateEdge}
        sx={{
          display: 'flex',
          position: 'relative',
          minWidth: '90px',
          cursor: 'pointer',
          ':hover': {
            background: 'rgb(250,250,250)',
          },
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

          {/* <Handle
            id="toolbar-next"
            position={Position.Bottom}
            type="source"
            isConnectableStart={true}
            isConnectableEnd={false}
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
          /> */}
        </Box>
        <Box sx={{ flexGrow: 1, padding: '2px 6px', textAlign: 'left' }}>
          Next
        </Box>
      </Box>
    </Paper>
  );
}
