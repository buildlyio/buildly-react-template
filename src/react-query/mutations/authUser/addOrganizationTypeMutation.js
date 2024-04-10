import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useAddOrganizationTypeMutation = (history, redirectTo, displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (organizationTypeData) => {
      const response = await httpService.makeRequest(
        'post',
        `${window.env.API_URL}organization_type/`,
        organizationTypeData,
      );
      return response.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['organizationTypes'],
        });
        displayAlert('success', 'Successfully added organization type');
        if (history && redirectTo) {
          history.push(redirectTo);
        }
      },
      onError: () => {
        displayAlert('error', 'Error in creating organization type');
      },
    },
  );
};
