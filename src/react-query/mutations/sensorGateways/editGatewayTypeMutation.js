import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useEditGatewayTypeMutation = (history, redirectTo, displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (gatewayTypeData) => {
      const response = await httpService.makeRequest(
        'patch',
        `${window.env.API_URL}sensors/gateway_type/${gatewayTypeData.id}`,
        gatewayTypeData,
      );
      return response.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['gatewayTypes'],
        });
        displayAlert('success', 'Tracker type successfully edited!');
        if (history && redirectTo) {
          history.push(redirectTo);
        }
      },
      onError: () => {
        displayAlert('error', "Couldn't edit tracker type!");
      },
    },
  );
};
