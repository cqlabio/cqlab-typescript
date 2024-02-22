import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';

type DisplaySchemaProps = {
  schmea: any;
};

export function DisplaySchema({ schmea }: DisplaySchemaProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [schmea]);

  if (!schmea) {
    return <Box sx={{ color: 'rgb(130,130,130)' }}>None</Box>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex' }}>
        <Box
          onClick={() => setIsOpen(!isOpen)}
          sx={{
            textTransform: 'uppercase',
            fontSize: '13px',
            cursor: 'pointer',

            border: '1px solid rgb(230,230,230)',
            padding: '7px 12px',
            borderRadius: '5px',

            ':hover': {
              backgroundColor: 'rgb(245,245,245)',
            },
          }}
        >
          View Schema
        </Box>
      </Box>

      {isOpen && (
        <Box
          component="pre"
          sx={{
            fontSize: '13px',
            background: 'rgb(245,245,245)',
            padding: '5px',
          }}
        >
          {JSON.stringify(schmea, null, 2)}
        </Box>
      )}
    </Box>
  );
}
