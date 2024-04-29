import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useAddGatewayTypeMutation = (history, redirectTo, displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (gatewayTypeData) => {
      const response = await httpService.makeRequest(
        'post',
        `${window.env.API_URL}sensors/gateway_type/`,
        gatewayTypeData,
      );
      return response.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['gatewayTypes'],
        });
        displayAlert('success', 'Successfully added tracker type');
        if (history && redirectTo) {
          history.push(redirectTo);
        }
      },
      onError: () => {
        displayAlert('error', 'Error in creating tracker type');
      },
    },
  );
};
