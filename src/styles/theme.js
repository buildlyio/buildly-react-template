import {
  createTheme,
  responsiveFontSizes,
} from '@mui/material';

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
    root: {
      color: '#fff !important',
    },
    button: {
      textTransform: 'none',
    },
    h4: {
      color: 'rgba(255, 255, 255, 1) !important',
    },
    h5: {
      color: 'rgba(255, 255, 255, 1) !important',
    },
    body2: {
      color: 'rgba(255, 255, 255, 1) !important',
    },
    body1: {
      color: 'rgba(255, 255, 255, 1) !important',
    },
    caption: {
      color: 'rgba(255, 255, 255, 1) !important',
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
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'linear-gradient(45deg, #7C7A7A 30%, #3B3A3A 90%)',
          backgroundColor: 'transparent',
          padding: 0,
          minHeight: '100vh',
          color: '#fff',
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-disabled': {
            color: 'rgba(255, 255, 255, 0.5)',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
        icon: {
          color: '#fff',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
        input: {
          '&.Mui-disabled': {
            color: 'rgba(255, 255, 255, 0.5)',
            WebkitTextFillColor: 'unset !important',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#fff',
            },
          },
        },
        input: {
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px #266799 inset',
            WebkitTextFillColor: '#fff',
            caretColor: '#fff',
            borderRadius: 'inherit',
          },
        },
        notchedOutline: {
          borderColor: 'rgba(255, 255, 255, 0.23) !important',
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          '& .css-1pnmrwp-MuiTypography-root': {
            color: 'rgba(255, 255, 255, 1) !important',
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        markLabel: {
          color: 'rgba(255, 255, 255, 0.7)',
          '&.MuiSlider-markLabelActive': {
            color: '#fff',
          },
        },
        thumb: {
          width: '12px',
          height: '12px',
        },
        track: {
          width: '2px',
          border: 'none',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: '12px',
          color: '#fff',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-selected': {
            color: '#fff',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#fff',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#424242',
          color: '#fff',
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: '#fff',
          borderBottom: '1px solid rgba(81, 81, 81, 1)',
          '& .tss-bd2lw8-MUIDataTableHeadCell-sortActive': {
            color: '#fff',
          },
          '& .MuiTableSortLabel-icon': {
            color: '#fff !important',
          },
          '& .css-1h34uk6-MuiButtonBase-root-MuiRadio-root': {
            color: '#fff !important',
          },
          '& .MuiButton-root:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
        head: {
          backgroundColor: '#424242 !important',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          backgroundColor: '#424242',
          '&.mui-row-selected': {
            backgroundColor: '#887C5E !important',
          },
          '&.MuiTableRow-hover:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '.MuiTableRow-root:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08) !important',
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          color: '#fff',
          '& .MuiTablePagination-selectIcon': {
            color: '#fff',
          },
          '& .MuiButtonBase-root': {
            color: '#fff',
            '&.Mui-disabled': {
              color: 'rgba(255, 255, 255, 0.3)',
            },
          },
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          padding: '24px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '8px 24px !important',
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-active': {
            color: '#fff',
          },
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: 'rgba(255, 255, 255, 0.5)',
        },
      },
    },
    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderColor: '#757575',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginTop: '16px',
          marginBottom: '8px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          '&.Mui-disabled': {
            color: 'rgba(255, 255, 255, 0.3)',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
          },
        },
        '& .Mui-disabled': {
          color: 'rgba(255, 255, 255, 0.3) !important',
          backgroundColor: 'rgba(255, 255, 255, 0.12) !important',
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        noOptions: {
          color: 'rgba(255, 255, 255, 0.6) !important',
        },
        li: {
          color: '#fff',
        },
        '&.popper': {
          color: '#fff !important',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        button: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 255, 255, 0.16)',
          },
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          color: '#fff',
          backgroundColor: 'transparent',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#616161 !important',
        },
        labelMedium: {
          color: '#fff',
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        expandIconWrapper: {
          '& >.MuiSvgIcon-root': {
            color: '#fff',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '.MuiSvgIcon-root': {
            color: '#fff !important',
          },
        },
      },
    },
  },
});

export default responsiveFontSizes(theme);
