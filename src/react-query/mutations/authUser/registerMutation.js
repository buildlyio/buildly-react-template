import { useMutation } from '@tanstack/react-query';
import { httpService } from '@modules/http/http.service';

export const useRegisterMutation = (
  navigate,
  redirectTo,
  displayAlert,
) => useMutation({
  mutationFn: async (registerData) => {
    const response = await httpService.makeRequest(
      'post',
      `${window.env.API_URL}coreuser/`,
      registerData,
    );
    return response;
  },
  onSuccess: async () => {
    displayAlert('success', 'Registration was successful');
    navigate(redirectTo);
  },
  onError: () => {
    displayAlert('error', 'Registration failed');
  },
});
