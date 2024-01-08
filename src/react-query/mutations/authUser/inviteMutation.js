import { useMutation } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useInviteMutation = (displayAlert) => useMutation(
  async (inviteData) => {
    const response = await httpService.makeRequest(
      'post',
      `${window.env.API_URL}coreuser/invite/`,
      inviteData,
    );
    return response;
  },
  {
    onSuccess: () => {
      displayAlert('success', 'Invitations sent successfully');
    },
  },
  {
    onError: () => {
      displayAlert('error', 'One or more email address is invalid');
    },
  },
);
