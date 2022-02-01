import { http } from 'midgard-core';
import { oauthService } from '@modules/oauth/oauth.service';

export const httpService = {
  makeRequest,
};

/**
 * function to send a Http request to the API
 * @param {string} method - Http verb of the request (GET,POST,PUT,...)
 * @param {string} url - url endpoint to send request to e.g ‘contacts’
 * @param {any} body - data of the request
 * @param {boolean} useJwt - boolean to check if we want to use JWT or not
 * @param {string} contentType - type of content to be requested
 * @param {string} responseType - the expected response type from the server
 * @param {boolean} useGitHub - boolean to check if this is a GitHub API call
 * @returns {Observable} - response of the request or error
 */
function makeRequest(method, url, body, useJwt, contentType, responseType, useGitHub = false) {
  let token;
  let tokenType;
  if (useJwt) {
    tokenType = 'JWT';
    token = oauthService.getJwtToken();
  } else if(useGitHub) {
    tokenType = 'token';
    token = window.env.GITHUB_TOKEN;
  }
  else {
    tokenType = 'Bearer';
    token = oauthService.getAccessToken();
  }
  let headers;
  if(useGitHub) {
    headers = {
      Authorization: `${tokenType} ${token}`,
      Accept: 'application/vnd.github.v3+json'
    };
  } else {
    headers = {
      Authorization: `${tokenType} ${token}`,
      // 'Content-Type': contentType || 'application/json', // Commenting to make it work for GCP
    };
  }
  const options = {
    method,
    data: body,
    headers,
    returnPromise: true,
    responseType: responseType || null,
  };
  return http.request(url, options);
}
