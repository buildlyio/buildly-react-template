import { httpService } from '@modules/http/http.service';

export const getOrganizationTypeQuery = async () => {
  try {
    const response = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}organization_type/`,
    );
    return response.data;
  } catch (error) {
    return [];
  }
};
