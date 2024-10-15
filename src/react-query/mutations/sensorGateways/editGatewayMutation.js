/* eslint-disable no-else-return */
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
      if (Array.isArray(gatewayData)) {
        const responses = await Promise.all(
          gatewayData.map((gateway) => httpService.makeRequest(
            'patch',
            `${window.env.API_URL}sensors/gateway/${gateway.id}`,
            gateway,
          )),
        );
        return responses.map((response) => response.data);
      } else if (typeof gatewayData === 'object' && gatewayData !== null) {
        const response = await httpService.makeRequest(
          'patch',
          `${window.env.API_URL}sensors/gateway/${gatewayData.id}`,
          gatewayData,
        );
        return response.data;
      } else {
        throw new Error('Invalid gateway data format');
      }
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['gateways', organization],
        });
        displayAlert('success', 'Tracker(s) successfully edited!');
        if (history && redirectTo) {
          history.push(redirectTo);
        }
      },
      onError: () => {
        displayAlert('error', "Couldn't edit tracker(s) due to some error!");
      },
    },
  );
};
