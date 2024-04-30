import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useDeleteOrganizationTypeMutation = (displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (organizationTypeId) => {
      await httpService.makeRequest(
        'delete',
        `${window.env.API_URL}organization_type/${organizationTypeId}`,
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['organizationTypes'],
        });
        displayAlert('success', 'Organization type deleted successfully!');
      },
      onError: () => {
        displayAlert('error', 'Error in deleting organization type!');
      },
    },
  );
};
