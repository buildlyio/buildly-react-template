import { responsiveFontSizes } from '@mui/material';
import { experimental_extendTheme as extendTheme } from '@mui/material/styles';

const theme = extendTheme({
  cssVarPrefix: 'color',
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: '#FFFFFF',
          light: '#BEBEBA',
          light2: '#D3D4D5',
          light3: '#E5E4E2',
          light4: '#0000000A',
          light5: '#E7E9EC',
          light6: '#FFD8D8D8',
          light7: '#B0C6E3',
          dark: '#383636',
          dark2: '#00000080',
          dark3: '#78787833',
          dark4: '#78787866',
          dark5: '#00000099',
          black: '#000000',
          black2: '#FF000000',
        },
        primary: {
          main: '#436B93',
          light: '#DEECF8',
          dark: '#284663',
          dark2: '#2D55FF66',
          dark3: '#328899',
          faded: '#B2BCCA',
        },
        secondary: {
          main: '#F0CE7F',
        },
        success: {
          main: '#009900',
          light: '#4ACF48',
        },
        info: {
          main: '#0099CC',
          light: '#84C2E2',
        },
        warning: {
          dark: '#FFFFC000',
          main: '#FFCC33',
        },
        error: {
          main: '#FF0033',
          light: '#FFC7CE',
        },
        cluster: {
          main: '#ECDB54',
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
    body3: {
      fontSize: '18px',
      fontWeight: 500,
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
