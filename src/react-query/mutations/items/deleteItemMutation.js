import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useDeleteItemMutation = (organization, displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (itemId) => {
      await httpService.makeRequest(
        'delete',
        `${window.env.API_URL}shipment/item/${itemId}`,
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['items', organization],
        });
        displayAlert('success', 'Item deleted successfully!');
      },
      onError: () => {
        displayAlert('error', 'Error in deleting item!');
      },
    },
  );
};
