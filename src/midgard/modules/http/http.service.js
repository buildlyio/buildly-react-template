import { http } from "midgard-core";
import { oauthService } from "midgard/modules/oauth/oauth.service";

export const httpService = {
  makeRequest,
  makeOptionsRequest,
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
function makeRequest(method, url, body, useJwt, contentType, responseType, requestHeader) {
  let token;
  let tokenType;
  if (useJwt) {
    tokenType = "JWT";
    token = oauthService.getJwtToken();
  } else {
    tokenType = "Bearer";
    token = oauthService.getAccessToken();
  }
  let headers = {
    Authorization: `${tokenType} ${token}`,
    "Content-Type": contentType ? contentType : "application/json",
  };
  if (requestHeader) {
    headers = {
      ...headers,
      requestHeader,
    };
  }
  const options = {
    method: method,
    data: body,
    headers: headers,
    returnPromise: true,
    responseType: responseType ? responseType : null,
  };
  return http.request(url, options);
}

function makeOptionsRequest(method, url, useJwt) {
  let token;
  let tokenType;
  if (useJwt) {
    tokenType = "JWT";
    token = oauthService.getJwtToken();
  }
  const headers = {
    Authorization: `${tokenType} ${token}`,
    // "Content-Type": "application/json",
  };
  let body = {
    jwt_iss: "Buildly",
  };
  const options = {
    method: method,
    // body: JSON.stringify(body),
    headers: headers,
    returnPromise: true,
  };
  return fetch(url, options);
}
