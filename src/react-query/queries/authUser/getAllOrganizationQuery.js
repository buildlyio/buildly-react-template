import { httpService } from '@modules/http/http.service';

export const getAllOrganizationQuery = async (displayAlert) => {
  try {
    const response = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}organization/`,
    );
    return response.data;
  } catch (error) {
    displayAlert('error', "Couldn't load organizations due to some error!");
    return [];
  }
};
