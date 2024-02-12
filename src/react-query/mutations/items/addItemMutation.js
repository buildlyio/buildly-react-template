import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useAddItemMutation = (
  organization,
  history,
  redirectTo,
  displayAlert,
) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (itemData) => {
      const response = await httpService.makeRequest(
        'post',
        `${window.env.API_URL}shipment/item/`,
        itemData,
      );
      return response.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['items', organization],
        });
        displayAlert('success', 'Successfully added item');
        if (history && redirectTo) {
          history.push(redirectTo);
        }
      },
      onError: () => {
        displayAlert('error', 'Error in creating item');
      },
    },
  );
};
