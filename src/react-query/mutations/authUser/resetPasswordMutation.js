import { useMutation } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useResetPasswordMutation = (
  displayAlert,
) => useMutation(
  async (resetData) => {
    const response = await httpService.makeRequest(
      'post',
      `${window.env.API_URL}coreuser/reset_password/`,
      resetData,
    );
    return response.data;
  },
  {
    onSuccess: async (data) => {
      if (data && data.count > 0) {
        displayAlert('success', data.detail);
      } else {
        displayAlert('error', 'The email address entered does not exist');
      }
    },
    onError: () => {
      displayAlert('error', 'Email could not be sent');
    },
  },
);
