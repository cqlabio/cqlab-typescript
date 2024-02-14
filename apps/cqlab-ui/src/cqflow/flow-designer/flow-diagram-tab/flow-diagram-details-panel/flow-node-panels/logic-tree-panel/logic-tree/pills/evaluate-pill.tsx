import Box from '@mui/material/Box';

type EvaluatePillProps = {
  onClick?: () => void;
};

export function EvaluatePill({ onClick }: EvaluatePillProps) {
  return (
    <Box
      component="span"
      onClick={onClick}
      sx={{
        display: 'flex',
        height: '16px',
        borderRadius: '4px',
        alignItems: 'center',
        border: '1px solid rgb(230,230,230)',
        padding: '0 2px',
        margin: '0',
        minWidth: '24px',
        fontSize: '11px',
        cursor: onClick ? 'pointer' : 'auto',
        textAlign: 'center',
        justifyContent: 'space-around',
        color: '#1565C0',
        ':hover': {
          background: 'rgb(245,245,245)',
        },
      }}
    >
      EVAL
    </Box>
  );
}
