import { httpService } from '@modules/http/http.service';

export const getProductTypeQuery = async (organization, displayAlert) => {
  try {
    const response = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}shipment/product_type/?organization_uuid=${organization}`,
    );
    return response.data;
  } catch (error) {
    displayAlert('error', "Couldn't load product types due to some error!");
    return [];
  }
};
