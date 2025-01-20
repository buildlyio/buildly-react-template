/* eslint-disable no-alert */
import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useEditUnitMutation = (organization, displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (unitData) => {
      const response = await httpService.makeRequest(
        'patch',
        `${window.env.API_URL}shipment/unit_of_measure/${unitData.id}`,
        unitData,
      );
      return response.data;
    },
    {
      onSuccess: async (data) => {
        if (data.unit_of_measure_for === 'Language' || data.unit_of_measure_for === 'Country') {
          alert('Detected map change. So need to reload the website. It might take a little while for this.');
          window.location.reload();
          return;
        }
        await queryClient.invalidateQueries({
          queryKey: ['unit', organization],
        });
        displayAlert('success', 'Unit of measure successfully edited!');
      },
      onError: () => {
        displayAlert('error', "Couldn't edit unit of measure!");
      },
    },
  );
};
