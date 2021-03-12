import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ce2828',
      contrastText: '#fff',
    },
    secondary: {
      main: '#000',
      contrastText: '#fff',
    },
    common: {
      grey: '#aaa',
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
          padding: 0,
          backgroundColor: '#ecebeb',
        },
      },
    },
  },
});

export default responsiveFontSizes(theme);
