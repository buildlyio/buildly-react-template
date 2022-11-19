import * as React from 'react';
import 'react-notifications/lib/notifications.css';
import './App.css';
import { hot } from 'react-hot-loader';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider, CssBaseline } from '@mui/material';
import Alerts from './components/Alerts/Alerts';
import ContainerDashboard from './layout/Container/Container';
import { oauthService } from './modules/oauth/oauth.service';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import Help from './pages/Help/Help';
import TicketStatus from './pages/TicketStatus/TicketStatus';
import { routes } from './routes/routesConstants';
import { PrivateRoute } from './routes/Private.route';
import theme from './styles/theme';
import MissingData from '@pages/MissingData/MissingData';
import Home from '@pages/Home/Home';
import VerifyEmail from '@pages/VerifyEmail/VerifyEmail';

const App = () => (
  <Router>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <div className="app">
          <CssBaseline />
          <Route
            exact
            path="/"
            // eslint-disable-next-line no-nested-ternary
            render={() => (oauthService.hasValidAccessToken() ? (
              <Redirect to={routes.DASHBOARD} />
            ) : (
              window.env.PRODUCTION ? <Home /> : <Redirect to={routes.LOGIN} />
            ))}
          />
          <Route exact path={`${routes.VERIFY_EMAIL}/:token`} component={VerifyEmail} />
          <Route path={routes.LOGIN} component={Login} />
          <Route path={routes.REGISTER} component={Register} />
          <Route path={routes.MISSING_DATA} component={MissingData} />
          <Route path={routes.FORGOT_PASSWORD} component={ForgotPassword} />
          <Route path={routes.RESET_PASSWORD} component={ResetPassword} />
          <Route path={routes.HELP} component={Help} />
          <Route path={routes.TICKET_STATUS} component={TicketStatus} />
          <PrivateRoute path={routes.APP} component={ContainerDashboard} />
        </div>
        <Alerts />
      </ThemeProvider>
    </StyledEngineProvider>
  </Router>
);

export default hot(module)(App);
