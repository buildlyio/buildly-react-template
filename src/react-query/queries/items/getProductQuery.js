import { httpService } from '@modules/http/http.service';

export const getProductQuery = async (organization, displayAlert) => {
  try {
    const response = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}shipment/product?organization_uuid=${organization}`,
    );
    return response.data;
  } catch (error) {
    displayAlert('error', "Couldn't load products due to some error!");
    return [];
  }
};
