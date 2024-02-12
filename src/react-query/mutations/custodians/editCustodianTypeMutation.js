import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useEditCustodianTypeMutation = (history, redirectTo, displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (custodianTypeData) => {
      const response = await httpService.makeRequest(
        'patch',
        `${window.env.API_URL}custodian/custodian_type/${custodianTypeData.id}`,
        custodianTypeData,
      );
      return response.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['custodianTypes'],
        });
        displayAlert('success', 'Custodian type successfully edited!');
        if (history && redirectTo) {
          history.push(redirectTo);
        }
      },
      onError: () => {
        displayAlert('error', "Couldn't edit custodian type!");
      },
    },
  );
};
