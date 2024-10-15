import { useMutation } from 'react-query';
import { httpService } from '@modules/http/http.service';

export const useFetchNewGatewayMutation = (displayAlert) => useMutation(
  async (newGatewayData) => {
    const response = await httpService.makeRequest(
      'post',
      `${window.env.API_URL}sensors/fetch_new_trackers/`,
      newGatewayData,
    );
    return response.data;
  },
  {
    onSuccess: async (data) => {
      if (data.new_trackers && data.new_trackers.length > 0) {
        displayAlert('success', 'Successfully fetched new trackers');
      } else {
        displayAlert('info', 'No new trackers available to fetch');
      }
    },
    onError: () => {
      displayAlert('error', 'Error in fetching trackers');
    },
  },
);
