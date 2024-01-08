import { httpService } from '@modules/http/http.service';

export const getItemTypeQuery = async (organization, displayAlert) => {
  try {
    const response = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}shipment/item_type/?organization_uuid=${organization}`,
    );
    return response.data;
  } catch (error) {
    displayAlert('error', "Couldn't load item types due to some error!");
    return [];
  }
};
