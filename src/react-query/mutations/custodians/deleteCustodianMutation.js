import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useDeleteCustodianMutation = (organization, displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (dataArray) => {
      const [custodianId, contactId] = dataArray;
      await httpService.makeRequest(
        'delete',
        `${window.env.API_URL}custodian/custodian/${custodianId}`,
      );
      await httpService.makeRequest(
        'delete',
        `${window.env.API_URL}custodian/contact/${contactId}`,
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['custodians', organization],
        });
        await queryClient.invalidateQueries({
          queryKey: ['contact', organization],
        });
        displayAlert('success', 'Custodian deleted successfully!');
      },
      onError: () => {
        displayAlert('error', 'Error in deleting custodian!');
      },
    },
  );
};
