import * as React from 'react';
import { hot } from 'react-hot-loader';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom';
import {
  CssBaseline,
  StyledEngineProvider,
} from '@mui/material';
import Alert from '@components/Alert/Alert';
import { app, AppContext } from '@context/App.context';
import ContainerDashboard from '@layout/Container/Container';
import { oauthService } from '@modules/oauth/oauth.service';
import Login from '@pages/Login/Login';
import Register from '@pages/Register/Register';
import EmailForm from '@pages/ResetPassword/EmailForm';
import Verification from '@pages/ResetPassword/Verification';
import NewPasswordForm from '@pages/ResetPassword/NewPasswordForm';
import { PrivateRoute } from '@routes/Private.route';
import { routes } from '@routes/routesConstants';
import theme from '@styles/theme';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
} from '@mui/material/styles';
import './App.css';

const App = () => (
  <Router>
    <AppContext.Provider value={app}>
      <StyledEngineProvider injectFirst>
        <CssVarsProvider theme={theme} defaultMode="light">
          <div className="app">
            <CssBaseline />
            <Route
              exact
              path="/"
              render={() => (
                oauthService.hasValidAccessToken()
                  ? <Redirect to={routes.SHIPMENT} />
                  : <Redirect to={routes.LOGIN} />
              )}
            />
            <Route path={routes.LOGIN} component={Login} />
            <Route
              path={routes.REGISTER}
              component={Register}
            />
            <Route
              path={routes.RESET_PASSWORD}
              component={EmailForm}
            />
            <Route
              path={routes.VERIFICATION}
              component={Verification}
            />
            <Route
              path={routes.RESET_PASSWORD_CONFIRM}
              component={NewPasswordForm}
            />
            <PrivateRoute
              path={routes.APP}
              component={ContainerDashboard}
            />
          </div>
          <Alert />
        </CssVarsProvider>
      </StyledEngineProvider>
    </AppContext.Provider>
  </Router>
);

export default hot(module)(App);
