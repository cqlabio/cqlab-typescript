// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { NavBar } from './navbar';
// import styles from './app.module.css';

export function App() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Nunito',
        height: '100vh',
      }}
    >
      <NavBar />
      <Box sx={{ flexGrow: 1, background: 'rgb(250,250,250)' }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;

if (import.meta.vitest) {
  // add tests related to your file here
  // For more information please visit the Vitest docs site here: https://vitest.dev/guide/in-source.html

  const { it, expect, beforeEach } = import.meta.vitest;
  let render: typeof import('@testing-library/react').render;

  beforeEach(async () => {
    render = (await import('@testing-library/react')).render;
  });

  it('should render successfully', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('should have a greeting as the title', () => {
    const { getByText } = render(<App />);
    expect(getByText(/Welcome cqlab-ui/gi)).toBeTruthy();
  });
}
