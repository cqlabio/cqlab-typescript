import Box from '@mui/material/Box';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

export function AutoResolvedLabel() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          color: 'rgb(120,120,120)',
          fontWeight: 300,
          fontSize: '13px',
        }}
      >
        Resolved using medical history or provided information
      </Box>
      <CheckCircleOutlineOutlinedIcon
        color="success"
        sx={{ fontSize: '16px', marginLeft: '6px' }}
      />
    </Box>
  );
}
