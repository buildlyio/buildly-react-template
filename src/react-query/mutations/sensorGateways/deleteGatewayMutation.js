import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useDeleteGatewayMutation = (organization, displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (gatewayId) => {
      await httpService.makeRequest(
        'delete',
        `${window.env.API_URL}sensors/gateway/${gatewayId}`,
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['gateways', organization],
        });
        displayAlert('success', 'Tracker deleted successfully!');
      },
      onError: () => {
        displayAlert('error', 'Error in deleting Tracker!');
      },
    },
  );
};
