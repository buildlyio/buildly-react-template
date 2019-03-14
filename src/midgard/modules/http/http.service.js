import { http } from 'midgard-core';
import { oauthService } from '../oauth/oauth.service';

export const httpService = {
  makeRequest,
  handleError,
};

/**
 * function to send a Http request to the API
 * @param {string} method - Http verb of the request (GET,POST,PUT,...)
 * @param {string} url - url endpoint to send request to e.g ‘contacts’
 * @param {any} body - data of the request
 * @param {booelan} useJwt - boolean to check if we want to use JWT or not
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
    'Authorization': `${tokenType} ${token}`,
    'Content-Type': contentType ? contentType : 'application/json'
  };
  const options = {
    method: method,
    data: body,
    headers: headers,
    returnPromise: true,
    responseType: responseType ? responseType : null
  };
  return http.request(url, options).then(
    (success) => success,
    (error) => this.handleError(error)
  );
}

/**
 * handles request errors
 * @param error - request error
 * @returns observable of the error
 */
function handleError(error) {
  if (error) {
    return throwError('Server error');
  }
}

