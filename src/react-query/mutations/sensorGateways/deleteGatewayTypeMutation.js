import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useDeleteGatewayTypeMutation = (displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (gatewayTypeId) => {
      await httpService.makeRequest(
        'delete',
        `${window.env.API_URL}sensors/gateway_type/${gatewayTypeId}`,
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['gatewayTypes'],
        });
        displayAlert('success', 'Tracker type deleted successfully!');
      },
      onError: () => {
        displayAlert('error', 'Error in deleting tracker type!');
      },
    },
  );
};
