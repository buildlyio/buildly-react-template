import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useAddGatewayMutation = (
  organization,
  history,
  redirectTo,
  displayAlert,
) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (gatewayData) => {
      const response = await httpService.makeRequest(
        'post',
        `${window.env.API_URL}sensors/gateway/`,
        gatewayData,
      );
      return response.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['gateways', organization],
        });
        displayAlert('success', 'Successfully added tracker');
        if (history && redirectTo) {
          history.push(redirectTo);
        }
      },
      onError: () => {
        displayAlert('error', 'Error in creating tracker');
      },
    },
  );
};
