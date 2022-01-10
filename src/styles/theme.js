/* eslint-disable import/no-unresolved */
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const theme = createTheme(({
  palette: {
    mode: 'dark',
    primary: {
      main: '#09b79a',
      contrastText: '#fff',
      light: '#f5f5f9',
    },
    secondary: {
      dark: '#202020',
      main: '#3f3f3f',
      light: '#707070',
      contrastText: '#fff',
    },
    neutral: {
      main: '#F6F8FA',
      contrastText: '#000',
      dark: '#887C5E',
      light: '#646262',
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