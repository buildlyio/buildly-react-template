import { httpService } from '@modules/http/http.service';
import _ from 'lodash';

export const getSensorProcessedDataQuery = async (selectedShipment, displayAlert) => {
  try {
    const response = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}sensors/processed_report_display_data?shipment_id=${selectedShipment.partner_shipment_id}&shipment_enroute_datetime=${selectedShipment.actual_time_of_departure}&shipment_arrival_datetime=${selectedShipment.actual_time_of_arrival}&shipment_complete_datetime=${selectedShipment.actual_time_of_completion}`,
    );
    return response.data;
  } catch (error) {
    displayAlert('error', "Couldn't load sensor processed data due to some error!");
    return [];
  }
};
