import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useAddRecipientAddressMutation = (history, redirectTo, displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (recipientAddressData) => {
      const response = await httpService.makeRequest(
        'post',
        `${window.env.API_URL}shipment/recipient_address/`,
        recipientAddressData,
      );
      return response.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['recipientAddresses'],
        });
        displayAlert('success', 'Successfully added recipient address');
        if (history && redirectTo) {
          history.push(redirectTo);
        }
      },
      onError: (error, variables, context) => {
        displayAlert('error', `Recipient ${variables.name} might already exsist. Please cross check`);
      },
    },
  );
};
