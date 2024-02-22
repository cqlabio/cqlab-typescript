import { ReactNode, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

type SliderProps = {
  leftPanelContent: ReactNode;
  rightPanelContent: ReactNode;
  slideRight: boolean;
};

// any node can have
export function SliderPanel({
  leftPanelContent,
  rightPanelContent,
  slideRight,
}: SliderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        width: '200%',
        transform: !slideRight ? 'translateX(0%)' : 'translateX(-50%)',
        transition: 'transform ease-out 0.5s',
      }}
    >
      <Box
        sx={{
          width: '50%',
          height: '100%',
          maxHeight: '100%',
          overflowY: 'scroll',
        }}
      >
        {leftPanelContent}
      </Box>
      <Box
        sx={{
          width: '50%',
          height: '100%',
          maxHeight: '100%',
          overflowY: 'scroll',
        }}
      >
        {rightPanelContent}
      </Box>
    </Box>
  );
}
