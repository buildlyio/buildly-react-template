import { httpService } from '@modules/http/http.service';

export const getCustodianTypeQuery = async (displayAlert) => {
  try {
    const response = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}custodian/custodian_type/`,
    );
    return response.data;
  } catch (error) {
    displayAlert('error', "Couldn't load custodian types due to some error!");
    return [];
  }
};
