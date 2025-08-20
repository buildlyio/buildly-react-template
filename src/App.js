import * as React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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
import versionChecker from '@utils/versionChecker';
import {
  CssVarsProvider,
} from '@mui/material/styles';

const App = () => {
  React.useEffect(() => {
    // Start version checking when app mounts
    versionChecker.start();
    
    // Cleanup on unmount
    return () => {
      versionChecker.stop();
    };
  }, []);

  return (
    <Router>
      <AppContext.Provider value={app}>
        <StyledEngineProvider injectFirst>
          <CssVarsProvider theme={theme} defaultMode="light">
            <div className="app">
              <CssBaseline />
              <Routes>
                <Route
                  path="/"
                  element={
                    oauthService.hasValidAccessToken()
                      ? <Navigate to={routes.DASHBOARD} replace />
                      : <Navigate to={routes.LOGIN} replace />
                  }
                />
                <Route path={routes.LOGIN} element={<Login />} />
                <Route path={routes.REGISTER} element={<Register />} />
                <Route path={routes.RESET_PASSWORD} element={<EmailForm />} />
                <Route path={routes.VERIFICATION} element={<Verification />} />
                <Route path={routes.RESET_PASSWORD_CONFIRM} element={<NewPasswordForm />} />
                <Route
                  path={`${routes.APP}/*`}
                  element={<PrivateRoute><ContainerDashboard /></PrivateRoute>}
                />
              </Routes>
            </div>
            <Alert />
          </CssVarsProvider>
        </StyledEngineProvider>
      </AppContext.Provider>
    </Router>
  );
};

export default App;
