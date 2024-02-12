import { httpService } from '@modules/http/http.service';
import _ from 'lodash';

export const getCustodyQuery = async (shipmentIds, displayAlert) => {
  try {
    const response = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}custodian/custody/?shipment_id=${shipmentIds}`,
    );
    return response.data;
  } catch (error) {
    displayAlert('error', "Couldn't load custodies due to some error!");
    return [];
  }
};
