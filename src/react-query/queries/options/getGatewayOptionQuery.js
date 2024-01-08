import { httpService } from '@modules/http/http.service';

export const getGatewayOptionQuery = async () => {
  try {
    const response = await httpService.makeOptionsRequest(
      'options',
      `${window.env.API_URL}sensors/gateway/`,
      true,
    );
    const data = response.json();
    return data;
  } catch (error) {
    return [];
  }
};
