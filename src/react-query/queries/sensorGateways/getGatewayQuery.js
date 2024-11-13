import { httpService } from '@modules/http/http.service';
import _ from 'lodash';

export const getGatewayQuery = async (organization, displayAlert, is_new) => {
  try {
    const response = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}sensors/gateway/?organization_uuid=${organization}`,
      { is_new },
    );
    const data = _.filter(
      response.data,
      (gateway) => !_.includes(gateway.name, 'ICLP'),
    );
    return data;
  } catch (error) {
    displayAlert('error', "Couldn't load trackers due to some error!");
    return [];
  }
};
