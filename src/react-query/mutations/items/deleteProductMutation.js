import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useDeleteProductMutation = (organization, displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (productId) => {
      await httpService.makeRequest(
        'delete',
        `${window.env.API_URL}shipment/product/${productId}`,
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['products', organization],
        });
        displayAlert('success', 'Product deleted successfully!');
      },
      onError: () => {
        displayAlert('error', 'Error in deleting product!');
      },
    },
  );
};
