import { httpService } from '@modules/http/http.service';

export const getVersionNotesQuery = async (versionNumber, displayAlert) => {
  try {
    const response = await httpService.makeRequestWithoutHeaders(
      'get',
      `https://demo-notification.tpath.io/version_notes/?version_number=v${versionNumber}`,
    );
    return response.data;
  } catch (error) {
    displayAlert('error', "Couldn't load version notes due to some error!");
    return [];
  }
};
