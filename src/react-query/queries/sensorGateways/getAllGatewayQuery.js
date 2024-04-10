import { httpService } from '@modules/http/http.service';
import _ from 'lodash';

export const getAllGatewayQuery = async (displayAlert) => {
  try {
    const response = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}sensors/gateway/`,
    );
    const data = _.filter(
      response.data,
      (gateway) => !_.includes(gateway.name, 'ICLP'),
    );
    return data;
  } catch (error) {
    displayAlert('error', "Couldn't load all trackers due to some error!");
    return [];
  }
};
