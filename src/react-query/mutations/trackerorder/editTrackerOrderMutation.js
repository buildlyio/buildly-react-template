import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useEditTrackerOrderMutation = (org_uuid, displayAlert) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (trackerOrderData) => {
      const responses = await httpService.makeRequest(
        'patch',
        `${window.env.API_URL}shipment/tracker_order/${trackerOrderData.id}`,
        trackerOrderData,
      );
      return responses.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['trackerOrders', org_uuid],
        });
        displayAlert('success', 'Tracker Order sucessfully edited!');
      },
      onError: () => {
        displayAlert('error', 'Error in editing tracker order');
      },
    },
  );
};
