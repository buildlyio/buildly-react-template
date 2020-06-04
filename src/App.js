import * as React from "react";
import "./styles.scss";
import "react-notifications/lib/notifications.css";
import { hot } from "react-hot-loader";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { PrivateRoute } from "./midgard/routes/Private.route";
import { oauthService } from "./midgard/modules/oauth/oauth.service";
import { app, AppContext } from "./midgard/context/App.context";
import Dashboard from "./midgard/layout/Container/Container";
import Login from "./midgard/pages/Login/Login";
import Register from "./midgard/pages/Register/Register";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./styles/theme";
import Alerts from "./midgard/components/Alerts/Alerts";

function App() {
  return (
    <Router>
      <AppContext.Provider value={app}>
        <ThemeProvider theme={theme}>
          <div className="app">
            <CssBaseline />
            <Route
              exact
              path="/"
              render={() =>
                oauthService.hasValidAccessToken() ? (
                  <Redirect to="/app/dashboard" />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <PrivateRoute path="/app" component={Dashboard} />
          </div>
          <Alerts />
        </ThemeProvider>
      </AppContext.Provider>
    </Router>
  );
}

export default hot(module)(App);
