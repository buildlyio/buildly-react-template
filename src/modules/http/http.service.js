import { http } from 'midgard-core';
import _ from 'lodash';
import { oauthService } from '@modules/oauth/oauth.service';

export const httpService = {
  makeRequest,
  sendDirectServiceRequest,
};

/**
 * function to send a Http request to the API
 * @param {string} method - Http verb of the request (GET,POST,PUT,...)
 * @param {string} url - url endpoint to send request to e.g ‘contacts’
 * @param {any} body - data of the request
 * @param {boolean} useJwt - boolean to check if we want to use JWT or not
 * @param {string} contentType - type of content to be requested
 * @param {string} responseType - the expected response type from the server
 * @returns {Observable} - response of the request or error
 */
function makeRequest(method, url, body, useJwt, contentType, responseType) {
  let token;
  let tokenType;
  if (useJwt) {
    tokenType = 'JWT';
    token = oauthService.getJwtToken();
  } else {
    tokenType = 'Bearer';
    token = oauthService.getAccessToken();
  }
  const headers = {
    Authorization: `${tokenType} ${token}`,
    // 'Content-Type': contentType || 'application/json', // Commenting to make it work for GCP
  };
  if (_.includes(['post', 'put', 'delete'], _.toLower(method))) {
    headers['Content-Type'] = contentType || 'application/json';
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

function sendDirectServiceRequest(url, method, body, service) {
  let authHeader = 'Bearer ';
  let apiUrl = '';
  if (service.toLowerCase() === 'product') {
    authHeader += `${window.env.PRODUCT_SERVICE_TOKEN}`;
    apiUrl = `${window.env.PRODUCT_SERVICE_URL}${url}`;
  } else if (service.toLowerCase() === 'release') {
    authHeader += `${window.env.RELEASE_SERVICE_TOKEN}`;
    apiUrl = `${window.env.RELEASE_SERVICE_URL}${url}`;
  } else {
    return new Promise(null);
  }
  const headers = {
    Authorization: `${authHeader}`,
  };
  headers['Content-Type'] = 'application/json';
  const options = {
    method,
    data: body,
    headers,
    returnPromise: true,
    responseType: null,
  };
  return http.request(apiUrl, options);
}
