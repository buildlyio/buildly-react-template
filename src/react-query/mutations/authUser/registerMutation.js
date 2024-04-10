import { useMutation } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useRegisterMutation = (
  history,
  redirectTo,
  displayAlert,
) => useMutation(
  async (registerData) => {
    const response = await httpService.makeRequest(
      'post',
      `${window.env.API_URL}coreuser/`,
      registerData,
    );
    return response;
  },
  {
    onSuccess: async () => {
      displayAlert('success', 'Registration was successful');
      history.push(redirectTo);
    },
    onError: () => {
      displayAlert('error', 'Registration failed');
    },
  },
);
