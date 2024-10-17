import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useEditRecipientAddressMutation = (history, redirectTo, displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (recipientAddressData) => {
      const response = await httpService.makeRequest(
        'patch',
        `${window.env.API_URL}shipment/recipient_address/${recipientAddressData.id}`,
        recipientAddressData,
      );
      return response.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['recipientAddresses'],
        });
        displayAlert('success', 'Recipient address successfully edited!');
        if (history && redirectTo) {
          history.push(redirectTo);
        }
      },
      onError: () => {
        displayAlert('error', "Couldn't edit recipient dddress!");
      },
    },
  );
};
