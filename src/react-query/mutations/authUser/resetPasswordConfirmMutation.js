import { useMutation } from '@tanstack/react-query';
import { httpService } from '@modules/http/http.service';

export const useResetPasswordConfirmMutation = (
  navigate,
  redirectTo,
  displayAlert,
) => useMutation({
  mutationFn: async (resetConfirmData) => {
    const response = await httpService.makeRequest(
      'post',
      `${window.env.API_URL}coreuser/reset_password_confirm/`,
      resetConfirmData,
    );
    return response.data;
  },
  onSuccess: async (data) => {
    displayAlert('success', data.detail);
    navigate(redirectTo);
  },
  onError: () => {
    displayAlert('error', 'Password reset failed');
  },
});
