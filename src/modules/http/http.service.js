import { http } from 'midgard-core';
import { oauthService } from '../oauth/oauth.service';

/**
 * function to send a Http request to the API
 * @param {string} method - Http verb of the request (GET,POST,PUT,...)
 * @param {string} url - url endpoint to send request to e.g ‘contacts’
 * @param {any=} body - data of the request
 * @param {boolean=} useJwt - boolean to check if we want to use JWT or not
 * @param {string=} contentType - type of content to be requested
 * @param {string=} responseType - the expected response type from the server
 * @returns response of the request or error
 */
function makeRequest(method, url, body, useJwt, contentType, responseType, requestHeader) {
  let token;
  let tokenType;
  if (useJwt) {
    tokenType = 'JWT';
    token = oauthService.getJwtToken();
  } else {
    tokenType = 'Bearer';
    token = oauthService.getAccessToken();
  }
  let headers = {
    Authorization: `${tokenType} ${token}`,
    // 'Content-Type': contentType || 'application/json', // Commenting to make it work for GCP
  };
  if (method !== 'GET' && method !== 'get' && method !== 'OPTIONS' && method !== 'options') {
    headers['Content-Type'] = 'application/json';
  }
  if (requestHeader) {
    headers = {
      ...headers,
      requestHeader,
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

function makeOptionsRequest(method, url, useJwt) {
  let token;
  let tokenType;
  if (useJwt) {
    tokenType = 'JWT';
    token = oauthService.getJwtToken();
  }
  const headers = {
    Authorization: `${tokenType} ${token}`,
  };
  const body = {
    jwt_iss: 'Buildly',
  };
  const options = {
    method,
    headers,
    returnPromise: true,
  };
  return fetch(url, options);
}

function makeRequestWithoutHeaders(method, url, body) {
  const options = {
    method,
    data: body,
    headers: null,
    returnPromise: true,
    responseType: null,
  };
  return http.request(url, options);
}

export const httpService = {
  makeRequest,
  makeOptionsRequest,
  makeRequestWithoutHeaders,
};
