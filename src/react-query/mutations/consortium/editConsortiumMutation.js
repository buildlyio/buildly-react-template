import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useEditConsortiumMutation = (history, redirectTo, displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (consortiumData) => {
      const response = await httpService.makeRequest(
        'patch',
        `${window.env.API_URL}consortium/${consortiumData.consortium_uuid}/`,
        consortiumData,
      );
      return response.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['consortiums'],
        });
        displayAlert('success', 'Successfully edited consortium');
        if (history && redirectTo) {
          history.push(redirectTo);
        }
      },
      onError: () => {
        displayAlert('error', 'Error in editing consortium');
      },
    },
  );
};
