import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const theme = createTheme(({
  palette: {
    mode: 'light',
    contrast: {
      main: '#121212',
      text: '#fff',
    },
    primary: {
      main: '#f9943b', // orange
    },
    secondary: {
      main: '#2E29B2', // blue
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
  },
}));

export default responsiveFontSizes(theme);
