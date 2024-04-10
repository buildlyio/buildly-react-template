import { httpService } from '@modules/http/http.service';
import _ from 'lodash';

export const getGatewayTypeQuery = async (displayAlert) => {
  try {
    const response = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}sensors/gateway_type`,
    );
    const data = _.filter(
      response.data,
      (gatewayType) => _.toLower(gatewayType.name) !== 'iclp',
    );
    return data;
  } catch (error) {
    displayAlert('error', "Couldn't load tracker types due to some error!");
    return [];
  }
};
