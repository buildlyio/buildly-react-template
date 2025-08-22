import { useMutation } from '@tanstack/react-query';
import { httpService } from '@modules/http/http.service';
import { oauthService } from '@modules/oauth/oauth.service';

export const useLoginMutation = (
  navigate,
  redirectTo,
  displayAlert,
) => useMutation({
  mutationFn: async (loginData) => {
    try {
      // Step 1: Authenticate with OAuth
      const token = await oauthService.authenticateWithPasswordFlow(loginData);
      oauthService.setAccessToken(token.data);

      // Step 2: Get user info
      const user = await httpService.makeRequest(
        'get',
        `${window.env.API_URL}coreuser/me/`,
      );
      oauthService.setOauthUser(user, { loginData });

      // Step 3: Get core user data
      const coreuser = await httpService.makeRequest(
        'get',
        `${window.env.API_URL}coreuser/`,
      );
      oauthService.setCurrentCoreUser(coreuser, user);
      return user;
    } catch (error) {
      throw error;
    }
  },
  onSuccess: async (data) => {
    navigate(redirectTo);
  },
  onError: (error) => {
    let errorMessage = 'Sign in failed';

    if (error?.response?.status === 400) {
      errorMessage = 'Invalid username or password';
    } else if (error?.response?.status === 401) {
      errorMessage = 'Unauthorized access';
    } else if (error?.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error?.message) {
      errorMessage = `Sign in failed: ${error.message}`;
    }

    displayAlert('error', errorMessage);
  },
});
