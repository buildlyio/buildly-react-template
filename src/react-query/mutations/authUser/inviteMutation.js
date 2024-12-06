import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useInviteMutation = (discardFormData, displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (inviteData) => {
      const response = await httpService.makeRequest(
        'post',
        `${window.env.API_URL}coreuser/invite/`,
        inviteData,
      );
      return response;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['organizations'],
        });
        await queryClient.invalidateQueries({
          queryKey: ['coregroup'],
        });
        displayAlert('success', 'Invitations sent and organization created successfully');
        discardFormData();
      },
      onError: () => {
        displayAlert('error', "Couldn't send invite or error in creating organization");
      },
    },
  );
};
