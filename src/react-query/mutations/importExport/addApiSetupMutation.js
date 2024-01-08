import { useMutation } from 'react-query';
import { httpService } from '@modules/http/http.service';
import _ from 'lodash';

export const useAddApiSetupMutation = (displayAlert) => useMutation(
  async (data) => {
    let endPoint;
    switch (data.table_name) {
      case 'item':
      case 'product':
        endPoint = 'shipment/third_party_api_import/';
        break;
      case 'gateway':
        endPoint = 'sensors/third_party_api_import/';
        break;
      default:
        break;
    }
    const response = await httpService.makeRequest(
      'post',
      `${window.env.API_URL}${endPoint}`,
      data,
    );
    return response.data;
  },
  {
    onSuccess: async (res) => {
      displayAlert('success', res.status);
    },
    onError: () => {
      displayAlert('error', "Couldn't setup API due to some error!");
    },
  },
);
