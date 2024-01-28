// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
// import NxWelcome from './nx-welcome';
import Box from '@mui/material/Box';

// import { Route, Routes, Link } from 'react-router-dom';
import { NavBar } from './navbar';
import CssBaseline from '@mui/material/CssBaseline';
import { PriorAuthDemo } from '../prior-auth-demo/prior-auth-demo';

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Nunito',
          height: '100vh',
        }}
      >
        <NavBar />

        <PriorAuthDemo />
      </Box>
    </ThemeProvider>
  );
}

export default App;
