import { httpService } from '@modules/http/http.service';

export const getApiResponseQuery = async (url, header, displayAlert) => {
  try {
    const response = await httpService.makeRequest(
      'get',
      url,
      null,
      null,
      null,
      null,
      header,
    );
    return response;
  } catch (error) {
    displayAlert('error', "Couldn't get api response due to some error!");
    return [];
  }
};
