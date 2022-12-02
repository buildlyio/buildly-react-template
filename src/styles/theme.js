import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const theme = createTheme(({
  palette: {
    contrast: {
      main: '#121212',
      text: '#fff',
    },
    primary: {
      main: '#F9943B', // orange
    },
    secondary: {
      main: '#0C5595', // blue
      dark: '#162944', // dark blue
    },
    neutral: {
      main: '#DCDCE0',
      text: '#000',
    },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
    h1: {
      color: '#162944',
    },
    h2: {
      color: '#162944',
    },
    h3: {
      color: '#162944',
    },
    h4: {
      color: '#162944',
    },
    h5: {
      color: '#162944',
    },
    h6: {
      color: '#162944',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          padding: 0,
          backgroundColor: '#DCDCE0',
          color: '#000',
          '&#fc_frame, #fc_frame.fc-widget-normal': {
            bottom: '100px !important',
          },
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
    MuiMenu: {
      styleOverrides: {
        list: {
          paddingTop: 0,
          paddingBottom: 0,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '+.MuiDivider-root': {
            marginTop: 0,
            marginBottom: 0,
          },
        },
      },
    },
  },
}));

export default responsiveFontSizes(theme);
