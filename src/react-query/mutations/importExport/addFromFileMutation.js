import { useMutation } from 'react-query';
import { httpService } from '@modules/http/http.service';
import _ from 'lodash';

export const useAddFromFileMutation = (model, displayAlert) => useMutation(
  async (data) => {
    let endPoint;
    switch (model) {
      case 'item':
      case 'product':
        endPoint = 'shipment/file_upload/';
        break;
      // case 'gateway':
      //   endPoint = 'sensors/file_upload/';
      //   break;
      default:
        break;
    }
    const response = await httpService.makeRequest(
      'post',
      `${window.env.API_URL}${endPoint}`,
      data,
      null,
      'multipart/form-data',
    );
    return response.data;
  },
  {
    onSuccess: async (res) => {
      displayAlert('success', res.status);
    },
    onError: () => {
      displayAlert('error', `Couldn't import ${_.capitalize(model)} data due to some error!`);
    },
  },
);
