import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

export function NavBar() {
  return (
    <Paper
      square
      sx={{
        // height: '30px',
        // background: '#FFFAEA',
        // color: '#5E4A06',
        // color: "secondary.main",
        // padding: '12px 15px',
        borderBottom: '1px solid rgba(230,230,230,0.7)',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        background: 'white',
      }}
    >
      <Box sx={{ display: 'flex', padding: '11px 15px', alignItems: 'center' }}>
        <Box
          sx={{
            fontSize: '20px',
            fontFamily: 'Red Hat Display',
            fontWeight: 400,
          }}
        >
          <Box
            component="span"
            sx={{ color: 'secondary.main', position: 'relative', left: '2px' }}
          >
            C
          </Box>
          <Box component="span" sx={{ color: 'secondary.main' }}>
            Q
          </Box>
          Lab -
        </Box>
        <Box
          sx={{
            marginLeft: '5px',
            // color: '#866E1E'
            color: 'rgb(100,100,100)',
            fontSize: '12px',
            textTransform: 'uppercase',
          }}
        >
          Demo Applications
        </Box>
      </Box>
    </Paper>
  );
}
