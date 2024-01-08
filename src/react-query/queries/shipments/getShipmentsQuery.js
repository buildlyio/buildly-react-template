import { httpService } from '@modules/http/http.service';
import _ from 'lodash';

export const getShipmentsQuery = async (organization, status, displayAlert) => {
  try {
    let query_params = `?organization_uuid=${organization}`;
    const response = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}consortium/?organization_uuid=${organization}`,
    );
    const consortium_uuid = _.join(
      _.map(response.data, 'consortium_uuid'),
      ',',
    );
    if (consortium_uuid) {
      query_params = query_params.concat(`&consortium_uuid=${consortium_uuid}`);
    }
    if (status) {
      query_params = query_params.concat(`&status=${status}`);
    }
    const shipmentResponse = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}shipment/shipment/${query_params}`,
    );
    if (shipmentResponse && shipmentResponse.data) {
      const shipments = _.filter(
        shipmentResponse.data,
        (shipment) => _.toLower(shipment.platform_name) !== 'iclp',
      );
      return shipments;
    }
    return [];
  } catch (error) {
    displayAlert('error', "Couldn't load shipments due to some error!");
    return [];
  }
};
