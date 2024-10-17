import { httpService } from '@modules/http/http.service';

export const getTrackerOrderQuery = async (organization_uuid, displayAlert) => {
  try {
    const response = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}shipment/tracker_order/?organization_uuid=${organization_uuid}`,
    );
    return response.data;
  } catch (error) {
    displayAlert('error', "Couldn't load tracker orders due to some error!");
    return [];
  }
};
