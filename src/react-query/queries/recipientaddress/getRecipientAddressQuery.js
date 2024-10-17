import { httpService } from '@modules/http/http.service';

export const getRecipientAddressQuery = async (organization_uuid, displayAlert) => {
  try {
    const response = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}shipment/recipient_address/?organization_uuid=${organization_uuid}`,
    );
    return response.data;
  } catch (error) {
    displayAlert('error', "Couldn't load recipient addresses due to some error!");
    return [];
  }
};
