import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const theme = createTheme(({
  palette: {
    mode: 'dark',
    primary: {
      main: '#08b293',
      dark: '#067f69',
      light: '#0be5bd',
      contrastText: '#fff',
    },
    secondary: {
      dark: '#191919',
      main: '#4c4c4c',
      light: '#7f7f7f',
      contrastText: '#fff',
    },
    neutral: {
      main: '#F6F8FA',
      dark: '#887C5E',
      light: '#646262',
      contrastText: '#000',
    },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          padding: 0,
          backgroundColor: '#202020',
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          color: '#000',
          backgroundColor: 'transparent',
        },
      },
    },
  },
}));

export default responsiveFontSizes(theme);