import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useSyncGatewayMutation = (
  organization,
  displayAlert,
) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (syncGatewayData) => {
      const response = await httpService.makeRequest(
        'post',
        `${window.env.API_URL}sensors/sync_trackers/`,
        syncGatewayData,
      );
      return response.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['gateways', organization],
        });
        displayAlert('success', 'Successfully synced trackers');
      },
      onError: () => {
        displayAlert('error', 'Error in syncing trackers');
      },
    },
  );
};
