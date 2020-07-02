import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#FBAE36",
      contrastText: "#fff",
    },
    secondary: {
      main: "#B46F04",
      contrastText: "#fff",
    },
  },
});

export default responsiveFontSizes(theme);
