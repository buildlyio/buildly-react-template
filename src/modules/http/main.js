import { Observable } from 'rxjs';
import axios from 'axios';
import axiosCancel from 'axios-cancel';

// adds cancel prototype method
axiosCancel(axios);

// accepted methods by the client
const ACCEPTED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

/**
 * sends a http request
 * @param url - the url of the request
 * @param options - object that contains the method, payload and headers
 */
const request = (url, options) => {
  const {
    method,
    data,
    headers,
    returnPromise,
    responseType,
  } = options;
  // validate if a path is specified
  if (!url) {
    throw new Error('No path has been provided');
  }
  if (options && typeof options === 'object') { // validate if options are provided
    // validate if the method is valid
    if (ACCEPTED_METHODS.indexOf(method.toUpperCase()) === -1) {
      throw new Error(`Invalid method, method must be ${ACCEPTED_METHODS.join(', ')}`);
    }
  }
  let result;
  // create sample request id
  const requestId = `${Math.random()}-xhr-id`;
  // XHR complete pointer
  let completed = false;
  // config object to be sent to the request
  const config = {
    url,
    data,
    method,
    headers,
    responseType,
    requestId,
  };
  if (returnPromise) {
    result = axios.request(config);
  } else {
    result = Observable.create((observer) => {
      axios.request(config)
        .then((response) => {
          observer.next(response);
          completed = true;
          observer.complete();
        }).catch((error) => {
          observer.error(error);
          completed = true;
        });
      // teardown function to be called when ww call unsubscribe() on the observable
      return () => {
        if (completed === false) {
          // cancel XHR
          axios.cancel(requestId);
          completed = true;
        }
      };
    });
  }
  return result;
};

export default request;
