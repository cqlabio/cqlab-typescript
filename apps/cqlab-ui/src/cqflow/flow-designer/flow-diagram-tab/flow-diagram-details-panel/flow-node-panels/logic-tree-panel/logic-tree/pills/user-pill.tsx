import Box from '@mui/material/Box';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';

type UserChoicePillProps = {
  onClick?: () => void;
};

export function UserPill({ onClick }: UserChoicePillProps) {
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
        padding: '0 ',
        margin: '0',
        minWidth: '24px',
        cursor: onClick ? 'pointer' : 'auto',
        textAlign: 'center',
        justifyContent: 'space-around',
      }}
    >
      <PersonOutlinedIcon sx={{ fontSize: '14px', color: '#7B1FA2' }} />
    </Box>
  );
}
