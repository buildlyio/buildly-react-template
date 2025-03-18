import request from '@modules/http/main';

/**
 * authenticates with OAuth password flow
 * @param credentials - user credentials (username/password)
 * @param options - the app client id, the oauth token url and whether to return a promise
 */
const authenticateWithCredentials = (credentials, options) => {
  const { username, password } = credentials;
  const { clientId, tokenUrl, returnPromise } = options;
  const oauthData = new FormData();
  oauthData.set('grant_type', 'password');
  oauthData.set('username', username);
  oauthData.set('password', password);
  oauthData.set('client_id', clientId);

  const httpClientOptions = {
    method: 'POST',
    data: oauthData,
    returnPromise,
  };
  return request(tokenUrl, httpClientOptions);
};

export default authenticateWithCredentials;
