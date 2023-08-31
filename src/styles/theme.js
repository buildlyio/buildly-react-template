import {
  createTheme,
  responsiveFontSizes,
} from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#FFFFFF',
      light: '#BEBEBA',
      dark: '#383636',
    },
    primary: {
      main: '#436B93',
      light: '#DEECF8',
      dark: '#284663',
      faded: '#B2BCCA',
    },
    secondary: {
      main: '#F0CE7F',
    },
    success: {
      main: '#009900',
    },
    info: {
      main: '#0099CC',
    },
    warning: {
      main: '#FFCC33',
    },
    error: {
      main: '#FF0033',
    },
    cluster: {
      main: '#ECDB54',
    },
  },
  typography: {
    fontFamily: 'Roboto',
    fontWeight: 400,
    color: '#000000 !important',
    button: {
      textTransform: 'none',
    },
    h1: {
      fontWeight: 700,
      fontSize: '57px',
    },
    h2: {
      fontWeight: 700,
      fontSize: '45px',
    },
    h3: {
      fontWeight: 700,
      fontSize: '36px',
    },
    h4: {
      fontWeight: 700,
      fontSize: '32px',
    },
    h5: {
      fontWeight: 700,
      fontSize: '28px',
    },
    h6: {
      fontWeight: 700,
      fontSize: '24px',
    },
    subtitle1: {
      fontSize: '22px',
    },
    subtitle2: {
      fontSize: '16px',
    },
    body1: {
      fontSize: '16px',
    },
    body2: {
      fontSize: '14px',
    },
    caption: {
      fontSize: '12px',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: '#FFFFFF',
          '&.Mui-selected': {
            color: '#F0CE7F',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#F0CE7F',
          },
        },
      },
    },
  },
});

export default responsiveFontSizes(theme);
