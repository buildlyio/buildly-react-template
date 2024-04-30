import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useEditOrganizationTypeMutation = (history, redirectTo, displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (organizationTypeData) => {
      const response = await httpService.makeRequest(
        'patch',
        `${window.env.API_URL}organization_type/${organizationTypeData.id}/`,
        organizationTypeData,
      );
      return response.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['organizationTypes'],
        });
        displayAlert('success', 'Organization type successfully edited!');
        if (history && redirectTo) {
          history.push(redirectTo);
        }
      },
      onError: () => {
        displayAlert('error', "Couldn't edit organization type!");
      },
    },
  );
};
