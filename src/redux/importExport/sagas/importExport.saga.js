import {
  put, takeLatest, all, call,
} from 'redux-saga/effects';
import _ from 'lodash';
import { httpService } from '@modules/http/http.service';
import { showAlert } from '@redux/alert/actions/alert.actions';
import {
  ADD_FROM_FILE,
  ADD_FROM_FILE_SUCCESS,
  ADD_FROM_FILE_FAILURE,
  GET_API_RESPONSE,
  GET_API_RESPONSE_SUCCESS,
  GET_API_RESPONSE_FAILURE,
  GET_EXPORT_DATA,
  GET_EXPORT_DATA_SUCCESS,
  GET_EXPORT_DATA_FAILURE,
  ADD_API_SETUP,
  ADD_API_SETUP_SUCCESS,
  ADD_API_SETUP_FAILURE,
} from '../actions/importExport.actions';

function* addFromFile(payload) {
  let endPoint;
  switch (payload.model) {
    case 'item':
    case 'product':
      endPoint = 'shipment/file_upload/';
      break;

      // case 'sensor':
      // case 'gateway':
      //   endPoint = 'sensors/file_upload/';
      //   break;

    default:
      break;
  }

  try {
    const response = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${endPoint}`,
      payload.formData,
      null,
      'multipart/form-data',
    );
    if (response && response.data.status) {
      yield [
        yield put({
          type: ADD_FROM_FILE_SUCCESS,
        }),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: response.data.status,
          }),
        ),
      ];
    }
  } catch (error) {
    yield [
      yield put({
        type: ADD_FROM_FILE_FAILURE,
      }),
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: `Couldn't import ${_.capitalize(payload.model)} Data due to some error!`,
        }),
      ),
    ];
  }
}

function* getApiResponse(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      payload.url,
      null,
      null,
      null,
      null,
      payload.header,
    );
    yield put({ type: GET_API_RESPONSE_SUCCESS, res: data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t get api response due to some error!',
        }),
      ),
      yield put({
        type: GET_API_RESPONSE_FAILURE,
        error,
      }),
    ];
  }
}

function* getExportData(payload) {
  let endPoint;
  switch (payload.model) {
    case 'item':
    case 'product':
      endPoint = 'shipment/file_export/';
      break;

      // case 'sensor':
      // case 'gateway':
      //   endPoint = 'sensors/file_export/';
      //   break;

    default:
      break;
  }

  try {
    const response = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${endPoint}?model=${payload.model}&file_type=${payload.fileType}`,
    );
    yield put({
      type: GET_EXPORT_DATA_SUCCESS,
      data: response.data,
    });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t export data due to some error!',
        }),
      ),
      yield put({
        type: GET_EXPORT_DATA_FAILURE,
        error,
      }),
    ];
  }
}

function* addApiSetup(action) {
  const { payload } = action;
  let endPoint;
  switch (payload.table_name) {
    case 'item':
    case 'product':
      endPoint = 'shipment/third_party_api_import/';
      break;

    case 'sensor':
    case 'gateway':
      endPoint = 'sensors/third_party_api_import/';
      break;

    default:
      break;
  }

  try {
    const response = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${endPoint}`,
      payload,
    );
    yield [
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: response.data.status,
        }),
      ),
      yield put({ type: ADD_API_SETUP_SUCCESS }),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t setup API due to some error!',
        }),
      ),
      yield put({
        type: ADD_API_SETUP_FAILURE,
        error,
      }),
    ];
  }
}

function* watchAddFromFile() {
  yield takeLatest(ADD_FROM_FILE, addFromFile);
}

function* watchGetApiResponse() {
  yield takeLatest(GET_API_RESPONSE, getApiResponse);
}

function* watchGetExportData() {
  yield takeLatest(GET_EXPORT_DATA, getExportData);
}

function* watchAddApiSetup() {
  yield takeLatest(ADD_API_SETUP, addApiSetup);
}

export default function* importExportSaga() {
  yield all([
    watchAddFromFile(),
    watchGetApiResponse(),
    watchGetExportData(),
    watchAddApiSetup(),
  ]);
}
