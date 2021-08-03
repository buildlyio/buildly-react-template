import {
  createTheme,
  responsiveFontSizes,
} from '@material-ui/core';

const theme = createTheme({
  palette: {
    type: 'dark',
    background: {
      default: '#605e5e',
    },
    primary: {
      main: '#EBC645',
      contrastText: '#3B3A3A',
    },
    secondary: {
      main: '#fff',
      contrastText: '#000',
    },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          backgroundImage: 'linear-gradient(45deg, #7C7A7A 30%, #3B3A3A 90%)',
          backgroundColor: 'transparent',
          padding: 0,
          minHeight: '100vh',
        },
        '.MuiTableRow-root.mui-row-selected': {
          backgroundColor: '#a48a30 !important',
        },
      },
    },
  },
});

export default responsiveFontSizes(theme);
