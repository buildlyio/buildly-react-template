import { useMutation, useQueryClient } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useAddTrackerOrderMutation = (history, redirectTo, displayAlert, setCart) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (trackerOrderData) => {
      const responses = await Promise.all(
        trackerOrderData.map((tod) => httpService.makeRequest(
          'post',
          `${window.env.API_URL}shipment/tracker_order/`,
          tod,
        )),
      );
      return responses.map((response) => response.data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['trackerOrders'],
        });
        setCart([]);
        displayAlert('success', 'Successfully added tracker order(s)');
        if (history && redirectTo) {
          history.push(redirectTo);
        }
      },
      onError: () => {
        displayAlert('error', 'Error in creating tracker order');
      },
    },
  );
};
