import { ReactNode } from 'react';
import Box from '@mui/material/Box';

type LogicNodeStyledProps = {
  children: ReactNode;
};

export function LogicNodeStyled({ children }: LogicNodeStyledProps) {
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
          top: '-1px',
          height: '16px',
          width: '13px',
          borderBottom: 0,
          borderColor: 'divider',
        },

        '& li:after': {
          position: 'absolute',
          top: '0px',
          height: '10px',
          left: 0,
          width: '13px',
          content: "''",
          borderBottom: 1,
          borderColor: 'divider',
        },
        '& li:last-child:after': {
          top: '-3px',
          borderBottom: 1,
          height: '19px',
          borderColor: 'divider',
        },
      }}
    >
      {children}
    </Box>
  );
}
