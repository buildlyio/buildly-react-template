import { useMutation } from 'react-query';
import { httpService } from '@modules/http/http.service';
import { oauthService } from '@modules/oauth/oauth.service';

export const useUpdateGDPRDateTimeMutation = (displayAlert) => useMutation(
  async (gdprData) => {
    const response = await httpService.makeRequest(
      'patch',
      `${window.env.API_URL}coreuser/${gdprData.id}/`,
      gdprData,
    );
    const user = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}coreuser/me/`,
    );
    oauthService.setOauthUser(user);
    const coreuser = await httpService.makeRequest(
      'get',
      `${window.env.API_URL}coreuser/`,
    );
    oauthService.setCurrentCoreUser(coreuser, user);
    return response.data;
  },
  {
    onSuccess: async () => {
      displayAlert('success', 'GDPR cookie acceptance successfully updated!');
    },
    onError: () => {
      displayAlert('error', "Couldn't update GDPR cookie acceptance!");
    },
  },
);
