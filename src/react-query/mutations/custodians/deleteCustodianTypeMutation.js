import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useDeleteCustodianTypeMutation = (displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (custodianTypeId) => {
      await httpService.makeRequest(
        'delete',
        `${window.env.API_URL}custodian/custodian_type/${custodianTypeId}`,
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['custodianTypes'],
        });
        displayAlert('success', 'Custodian type deleted successfully!');
      },
      onError: () => {
        displayAlert('error', 'Error in deleting custodian type!');
      },
    },
  );
};
