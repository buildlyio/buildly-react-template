import { httpService } from '@modules/http/http.service';

export const getShipmentTemplatesQuery = async (organization, displayAlert) => {
  try {
    const response = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}shipment/shipment_template/?organization_uuid=${organization}`,
    );
    return response.data;
  } catch (error) {
    displayAlert('error', "Couldn't load shipment template(s) due to some error!");
    return [];
  }
};
