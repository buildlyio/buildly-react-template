import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#09b79a',
      contrastText: '#fff',
    },
    secondary: {
      dark: '#202020',
      main: '#3f3f3f',
      light: '#707070',
      contrastText: '#fff',
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
          backgroundColor: '#202020',
        },
      },
    },
  },
});

export default responsiveFontSizes(theme);
