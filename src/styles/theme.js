import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#3e5266",
      contrastText: "#eff7ff",
    },
    secondary: {
      main: "#5d758c",
      contrastText: "#eff7ff",
    },
  },
  typography: {
    button: {
      textTransform: "none"
    }
  }
});

export default responsiveFontSizes(theme);
