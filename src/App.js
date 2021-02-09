import * as React from "react";
import "react-notifications/lib/notifications.css";
import { hot } from "react-hot-loader";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { PrivateRoute } from "./routes/Private.route";
import { oauthService } from "./modules/oauth/oauth.service";
import ContainerDashboard from "./layout/Container/Container";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./styles/theme";
import Alerts from "./components/Alerts/Alerts";
import { routes } from "./routes/routesConstants";

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div className="app">
          <CssBaseline />
          <Route
            exact
            path="/"
            render={() =>
              oauthService.hasValidAccessToken() ? (
                <Redirect to={routes.DASHBOARD} />
              ) : (
                  <Redirect to={routes.LOGIN} />
                )
            }
          />
          <Route path={routes.LOGIN} component={Login} />
          <Route path={routes.REGISTER} component={Register} />
          <Route path={routes.FORGOT_PASSWORD} component={ForgotPassword} />
          <Route path={routes.RESET_PASSWORD} component={ResetPassword} />
          <PrivateRoute path={routes.APP} component={ContainerDashboard} />
        </div>
        <Alerts />
      </ThemeProvider>
    </Router>
  );
}

export default hot(module)(App);
