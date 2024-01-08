import { httpService } from '@modules/http/http.service';
import _ from 'lodash';

export const getGatewayQuery = async (organization, displayAlert) => {
  try {
    const response = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}sensors/gateway/?organization_uuid=${organization}`,
    );
    const data = _.filter(
      response.data,
      (gateway) => !_.includes(gateway.name, 'ICLP'),
    );
    return data;
  } catch (error) {
    displayAlert('error', "Couldn't load gateways due to some error!");
    return [];
  }
};
