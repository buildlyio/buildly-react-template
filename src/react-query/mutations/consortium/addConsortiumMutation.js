import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useAddConsortiumMutation = (history, redirectTo, displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (consortiumData) => {
      const response = await httpService.makeRequest(
        'post',
        `${window.env.API_URL}consortium/`,
        consortiumData,
      );
      return response.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['consortiums'],
        });
        displayAlert('success', 'Successfully added consortium');
        if (history && redirectTo) {
          history.push(redirectTo);
        }
      },
      onError: () => {
        displayAlert('error', 'Error in creating consortium');
      },
    },
  );
};
