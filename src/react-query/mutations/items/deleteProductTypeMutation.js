import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useDeleteProductTypeMutation = (organization, displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (productTypeId) => {
      await httpService.makeRequest(
        'delete',
        `${window.env.API_URL}shipment/product_type/${productTypeId}`,
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['productTypes', organization],
        });
        displayAlert('success', 'Product type deleted successfully!');
      },
      onError: () => {
        displayAlert('error', 'Error in deleting product type!');
      },
    },
  );
};
