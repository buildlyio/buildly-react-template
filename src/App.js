import * as React from 'react';
import 'react-notifications/lib/notifications.css';
import { hot } from 'react-hot-loader';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { PrivateRoute } from './routes/Private.route';
import { oauthService } from './modules/oauth/oauth.service';
import ContainerDashboard from './layout/Container/Container';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import RegisterConfirmation from './pages/RegisterConfirmation/registerConfirmation'; /* test */
import theme from './styles/theme';
import Alert from './components/Alert/Alert';
import { routes } from './routes/routesConstants';

const App = () => (
  <Router>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <div className="app">
          <CssBaseline />
          <Route
            exact
            path="/"
            render={() => (oauthService.hasValidAccessToken() ? (
              <Redirect to={routes.DASHBOARD} />
            ) : (
              <Redirect to={routes.LOGIN} />
            ))}
          />
          <Route path={routes.LOGIN} component={Login} />
          <Route path={routes.REGISTER} component={Register} />
          <Route path={routes.FORGOT_PASSWORD} component={ForgotPassword} />
          <Route path={routes.RESET_PASSWORD} component={ResetPassword} />
          <Route path={routes.REGISTER_CONFIRMATION} component={RegisterConfirmation} /> {/* test */}
          <PrivateRoute path={routes.APP} component={ContainerDashboard} />
        </div>
        <Alert />
      </ThemeProvider>
    </StyledEngineProvider>
  </Router>
);

export default hot(module)(App);
