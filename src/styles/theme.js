import {
  responsiveFontSizes,
} from '@mui/material';

import {
  experimental_extendTheme as extendTheme,
} from '@mui/material/styles';

const theme = extendTheme({
  cssVarPrefix: 'color',
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: '#FFFFFF',
          light: '#BEBEBA',
          light2: '#D3D4D5',
          dark: '#383636',
        },
        primary: {
          main: '#436B93',
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
      },
    },
  },
  typography: {
    fontFamily: 'IBM Plex Sans',
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
