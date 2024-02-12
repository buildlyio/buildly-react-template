import { httpService } from '@modules/http/http.service';

export const getExportDataQuery = async (exportTable, exportType, displayAlert) => {
  let endPoint;
  switch (exportTable) {
    case 'item':
    case 'product':
      endPoint = 'shipment/file_export/';
      break;
    // case 'gateway':
    //   endPoint = 'sensors/file_export/';
    //   break;
    default:
      break;
  }
  try {
    const response = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}${endPoint}?model=${exportTable}&file_type=${exportType}`,
    );
    return response.data;
  } catch (error) {
    displayAlert('error', 'Error in exporting data');
    return [];
  }
};
