import React, { memo, useContext, LegacyRef } from 'react';
// import { Handle, Position } from 'reactflow';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Handle, Position } from 'reactflow';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import { FlowDiagramContext } from '../../flow-diagram-context';

type TrueFalsePickerProps = {
  sourceId: string;
  isSelected: boolean;
};

export function TrueFalsePicker({
  sourceId,
  isSelected,
}: TrueFalsePickerProps) {
  const { updateCreatingEdge } = useContext(FlowDiagramContext);

  const onSelectTrue = () => {
    updateCreatingEdge({
      sourceId: sourceId || '',
      index: 0,
    });
  };

  const onSelectFalse = () => {
    updateCreatingEdge({
      sourceId: sourceId || '',
      index: 1,
    });
  };

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
      <Box
        onClick={onSelectTrue}
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
            id="toolbar-onTrue"
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
          /> */}
        </Box>
        <Box sx={{ flexGrow: 1, padding: '2px 6px', textAlign: 'left' }}>
          On True
        </Box>
      </Box>
      <Box
        // onClick={clickOnTrue}
        onClick={onSelectFalse}
        sx={{
          display: 'flex',
          position: 'relative',
          // borderBottom: '1px solid rgb(200,200,200)',
          minWidth: '90px',
          borderTop: '1px solid rgb(230,230,230)',
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
            id="toolbar-onFalse"
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
          /> */}
        </Box>
        <Box sx={{ flexGrow: 1, padding: '2px 6px', textAlign: 'left' }}>
          On False
        </Box>
      </Box>
    </Paper>
  );
}
