import { httpService } from '@modules/http/http.service';

export const getAllConsortiumQuery = async (displayAlert) => {
  try {
    const response = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}consortium/`,
    );
    return response.data;
  } catch (error) {
    displayAlert('error', "Couldn't load consortiums due to some error!");
    return [];
  }
};
