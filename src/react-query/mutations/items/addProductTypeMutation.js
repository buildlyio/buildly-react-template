import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useAddProductTypeMutation = (organization, history, redirectTo, displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (productTypeData) => {
      const response = await httpService.makeRequest(
        'post',
        `${window.env.API_URL}shipment/product_type/`,
        productTypeData,
      );
      return response.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['productTypes', organization],
        });
        displayAlert('success', 'Successfully added product type');
        if (history && redirectTo) {
          history.push(redirectTo);
        }
      },
      onError: () => {
        displayAlert('error', 'Error in creating product type');
      },
    },
  );
};
