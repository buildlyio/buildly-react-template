import * as React from "react";
import "react-notifications/lib/notifications.css";
import { hot } from "react-hot-loader";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { PrivateRoute } from "./midgard/routes/Private.route";
import { oauthService } from "./midgard/modules/oauth/oauth.service";
import { app, AppContext } from "./midgard/context/App.context";
import ContainerDashboard from "./midgard/layout/Container/Container";
import Login from "./midgard/pages/Login/Login";
import Register from "./midgard/pages/Register/Register";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./styles/theme";
import Alerts from "./midgard/components/Alerts/Alerts";
import { routes } from "./midgard/routes/routesConstants";
import EmailForm from "./midgard/pages/ResetPassword/EmailForm";
import NewPasswordForm from "./midgard/pages/ResetPassword/NewPasswordForm";

function App() {
  return (
    <Router>
      <AppContext.Provider value={app}>
        <ThemeProvider theme={theme}>
          <div className="app">
            <CssBaseline />
            {/* <Route
              exact
              path="/"
              render={() =>
                oauthService.hasValidAccessToken() ? (
                  <Redirect to={routes.DASHBOARD} />
                ) : (
                  <Redirect to={routes.LOGIN} />
                )
              }
            /> */}
            <Route
              exact
              path="/"
              render={() =>
                oauthService.hasValidAccessToken() ? (
                  <Redirect to={routes.SHIPMENT} />
                ) : (
                  <Redirect to={routes.LOGIN} />
                )
              }
            />
            <Route path={routes.LOGIN} component={Login} />
            <Route path={routes.REGISTER} component={Register} />
            <Route path={routes.RESET_PASSWORD} component={EmailForm} />
            <Route
              path={routes.RESET_PASSWORD_CONFIRM}
              component={NewPasswordForm}
            />
            <PrivateRoute path={routes.APP} component={ContainerDashboard} />
          </div>
          <Alerts />
        </ThemeProvider>
      </AppContext.Provider>
    </Router>
  );
}

export default hot(module)(App);
