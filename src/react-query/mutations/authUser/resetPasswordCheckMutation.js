import { useMutation } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useResetPasswordCheckMutation = (
  history,
  resetRedirectTo,
  loginRedirectTo,
  displayAlert,
) => useMutation(
  async (checkData) => {
    const response = await httpService.makeRequest(
      'post',
      `${window.env.API_URL}coreuser/reset_password_check/`,
      checkData,
    );
    if (response.data && response.data.success) {
      history.push(`${resetRedirectTo}/${response.data.uid}/${response.data.token}/`);
    } else {
      displayAlert('error', 'Invalid ID or token. Try resending the link to your email');
      history.push(loginRedirectTo);
    }
    return response.data;
  },
  {
    onError: () => {
      displayAlert('error', 'Password reset failed');
    },
  },
);
