import { httpService } from '@modules/http/http.service';

export const getOrganizationNameQuery = async () => {
  try {
    const response = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}organization/fetch_orgs/`,
    );
    return response.data;
  } catch (error) {
    return [];
  }
};
