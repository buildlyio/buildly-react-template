import { httpService } from '@modules/http/http.service';

export const getCustodianQuery = async (organization, displayAlert) => {
  try {
    const response = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}custodian/custodian/?organization_uuid=${organization}`,
    );
    return response.data;
  } catch (error) {
    displayAlert('error', "Couldn't load custodians due to some error!");
    return [];
  }
};
