import { httpService } from '@modules/http/http.service';

export const getContactQuery = async (organization, displayAlert) => {
  try {
    const response = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}custodian/contact/?organization_uuid=${organization}`,
    );
    return response.data;
  } catch (error) {
    displayAlert('error', "Couldn't load contact info due to some error!");
    return [];
  }
};
