import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
// import { TypeBackground } from '@mui/material/styles/createPalette';

// export const WORKSPACE_FONT = 'Nunito';
export const WORKSPACE_FONT = 'Red Hat Display';
declare module '@mui/material/styles' {
  interface Palette {
    cqbackground?: Palette['primary'];
  }
  interface PaletteOptions {
    cqbackground?: PaletteOptions['primary'];
  }
}

// Create a theme instance.
const theme = createTheme({
  typography: {
    // fontFamily: 'Open Sans',
    fontFamily: WORKSPACE_FONT,
  },

  palette: {
    text: {
      secondary: 'rgb(80,80,80)',
    },
    primary: {
      main: '#FFC400',
      light: '#FFFAEA',
      // main: '#D84315'
    },
    secondary: {
      // main: "#19857b",
      main: '#D12733',
      // main: '#0D58A6'
    },
    error: {
      main: red.A400,
    },
    background: {
      default: 'rgb(235,235,235)',
      paper: 'rgb(255,255,255)',
    },
    cqbackground: {
      light: 'rgb(255,255,255)',
      main: 'rgb(250,250,250)',
      dark: 'rgb(225,225,225)',
    },
    divider: 'rgba(60, 60, 60, .2)',
  },
});

export default theme;
