import { httpService } from '@modules/http/http.service';

export const getItemOptionQuery = async () => {
  try {
    const response = await httpService.makeOptionsRequest(
      'options',
      `${window.env.API_URL}shipment/item/`,
      true,
    );
    const data = response.json();
    return data;
  } catch (error) {
    return [];
  }
};
