import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useDeleteCustodyMutation = (displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (custodyTypeId) => {
      await httpService.makeRequest(
        'delete',
        `${window.env.API_URL}custodian/custody/${custodyTypeId}`,
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['custodies'],
        });
        displayAlert('success', 'Custody deleted successfully!');
      },
      onError: () => {
        displayAlert('error', 'Error in deleting custody!');
      },
    },
  );
};
