import { useMutation } from 'react-query';
import { httpService } from '@modules/http/http.service';
import { oauthService } from '@modules/oauth/oauth.service';

export const useUpdateUserMutation = (
  history,
  displayAlert,
) => useMutation(
  async (updateUserData) => {
    await httpService.makeRequest(
      'patch',
      `${window.env.API_URL}coreuser/${updateUserData.id}/update_profile/`,
      updateUserData,
    );
    await httpService.makeRequest(
      'patch',
      `${window.env.API_URL}organization/${updateUserData.organization_uuid}/`,
      { name: updateUserData.organization_name },
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
    return updateUserData;
  },
  {
    onSuccess: (data) => {
      if (history) {
        if (data.user_language) {
          // eslint-disable-next-line no-alert
          alert('Detected language change. So need to reload the website. It might take a little while for this.');
          window.location.reload();
        }
        const route = window.location.pathname;
        history.push('/');
        history.push(route);
      } else {
        displayAlert('success', 'Account details successfully updated');
      }
    },
  },
  {
    onError: () => {
      displayAlert('error', 'Unable to update user details');
    },
  },
);
