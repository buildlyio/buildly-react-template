import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useDeleteConsortiumMutation = (displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (consortiumId) => {
      await httpService.makeRequest(
        'delete',
        `${window.env.API_URL}consortium/${consortiumId}`,
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['consortiums'],
        });
        displayAlert('success', 'Consortium deleted successfully!');
      },
      onError: () => {
        displayAlert('error', 'Error in deleting consortium!');
      },
    },
  );
};
