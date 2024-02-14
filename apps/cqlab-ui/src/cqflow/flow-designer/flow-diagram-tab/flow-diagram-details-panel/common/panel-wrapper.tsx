import Box from '@mui/material/Box';
import { ReactNode } from 'react';

type PanelWrapperProps = {
  label: string;
  children: ReactNode;
};

export function PanelWrapper({ label, children }: PanelWrapperProps) {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '7px',
          borderBottom: '1px solid rgb(230,230,230)',
          // background: 'rgb(250,250,250)',
        }}
      >
        <Box
          sx={{
            color: 'rgb(60,60,60)',
            textTransform: 'uppercase',
            fontSize: '12px',
            fontWeight: 'bold',
            fontFamily: 'Red Hat Display',
          }}
        >
          Selected:
        </Box>
        <Box sx={{ color: 'secondary.main', marginLeft: '5px' }}>{label}</Box>
      </Box>
      <Box sx={{ padding: '0px 15px 15px 15px' }}>{children}</Box>
    </Box>
  );
}
