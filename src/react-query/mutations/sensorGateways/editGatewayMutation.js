import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useEditGatewayMutation = (
  organization,
  history,
  redirectTo,
  displayAlert,
) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (gatewayData) => {
      const response = await httpService.makeRequest(
        'patch',
        `${window.env.API_URL}sensors/gateway/${gatewayData.id}`,
        gatewayData,
      );
      return response.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['gateways', organization],
        });
        displayAlert('success', 'Gateway successfully edited!');
        if (history && redirectTo) {
          history.push(redirectTo);
        }
      },
      onError: () => {
        displayAlert('error', "Couldn't edit gateway due to some error!");
      },
    },
  );
};
