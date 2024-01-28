import { ReactNode } from 'react';
import Box from '@mui/material/Box';

type LogicNodeStyledProps = {
  children: ReactNode;
};

export default function LogicNodeStyleWrapper({
  children,
}: LogicNodeStyledProps) {
  return (
    <Box
      component="ul"
      sx={{
        padding: 0,
        margin: 0,
        listStyleType: 'none',
        '& li': {
          position: 'relative',
          paddingBottom: '0px',
          marginLeft: '15px',
          paddingLeft: '15px',
        },
        '& li:before': {
          position: 'absolute',
          height: '100%',
          left: 0,
          width: 0,
          content: "''",
          borderBottom: 1,
          borderLeft: 1,
          borderColor: 'divider',
        },
        '& li:last-child:before': {
          height: '11px',
          width: '13px',
          borderBottom: 0,
          borderColor: 'divider',
        },

        '& li:after': {
          position: 'absolute',
          top: '0px',
          height: '12px',
          left: 0,
          width: '13px',
          content: "''",
          borderBottom: 1,
          borderColor: 'divider',
        },
        '& li:last-child:after': {
          borderBottom: 1,
          borderColor: 'divider',
        },
      }}
    >
      {children}
    </Box>
  );
}
