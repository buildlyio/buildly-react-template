import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useEditCustodianMutation = (
  organization,
  history,
  redirectTo,
  displayAlert,
) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (arrayData) => {
      const [custodianData, contactData] = arrayData;
      if (contactData) {
        await httpService.makeRequest(
          'patch',
          `${window.env.API_URL}custodian/contact/${contactData.id}`,
          contactData,
        );
      }
      const custodianResponse = await httpService.makeRequest(
        'patch',
        `${window.env.API_URL}custodian/custodian/${custodianData.id}`,
        custodianData,
      );
      return custodianResponse;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['custodians', organization],
        });
        await queryClient.invalidateQueries({
          queryKey: ['contact', organization],
        });
        displayAlert('success', 'Custodian successfully edited!');
        if (history && redirectTo) {
          history.push(redirectTo);
        }
      },
      onError: () => {
        displayAlert('error', "Couldn't edit custodian!");
      },
    },
  );
};
