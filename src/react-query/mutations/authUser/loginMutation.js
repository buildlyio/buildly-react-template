import { useMutation } from 'react-query';
import { httpService } from '@modules/http/http.service';
import { oauthService } from '@modules/oauth/oauth.service';

export const useLoginMutation = (
  history,
  redirectTo,
  displayAlert,
) => useMutation(
  async (loginData) => {
    const token = await oauthService.authenticateWithPasswordFlow(loginData);
    oauthService.setAccessToken(token.data);
    const user = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}coreuser/me/`,
    );
    oauthService.setOauthUser(user, { loginData });
    const coreuser = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}coreuser/`,
    );
    oauthService.setCurrentCoreUser(coreuser, user);
    return user;
  },
  {
    onSuccess: async (data) => {
      history.push(redirectTo);
    },
  },
  {
    onError: () => {
      displayAlert('error', 'Sign in failed');
    },
  },
);
