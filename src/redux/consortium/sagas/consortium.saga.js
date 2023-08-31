import {
  put, takeLatest, all, call,
} from 'redux-saga/effects';
import { httpService } from '../../../modules/http/http.service';
import { showAlert } from '../../alert/actions/alert.actions';
import {
  GET_ALL_CONSORTIUMS,
  GET_ALL_CONSORTIUMS_SUCCESS,
  GET_ALL_CONSORTIUMS_FAILURE,
  GET_ORG_CONSORTIUMS,
  GET_ORG_CONSORTIUMS_SUCCESS,
  GET_ORG_CONSORTIUMS_FAILURE,
  CREATE_CONSORTIUM,
  CREATE_CONSORTIUM_SUCCESS,
  CREATE_CONSORTIUM_FAILURE,
  EDIT_CONSORTIUM,
  EDIT_CONSORTIUM_SUCCESS,
  EDIT_CONSORTIUM_FAILURE,
  DELETE_CONSORTIUM,
  DELETE_CONSORTIUM_SUCCESS,
  DELETE_CONSORTIUM_FAILURE,
} from '../actions/consortium.actions';

function* getAllConsortiums() {
  try {
    const response = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}consortium/`,
    );
    yield put({
      type: GET_ALL_CONSORTIUMS_SUCCESS,
      data: response.data,
    });
  } catch (error) {
    yield [
      yield put({
        type: GET_ALL_CONSORTIUMS_FAILURE,
        error: 'Couldn\'t load consortiums due to some error',
      }),
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t load consortiums due to some error',
        }),
      ),
    ];
  }
}

function* getOrgConsortiums(payload) {
  const { organization_uuid } = payload;
  try {
    const response = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}consortium/?organization_uuid=${organization_uuid}`,
    );
    yield put({
      type: GET_ORG_CONSORTIUMS_SUCCESS,
      data: response.data,
    });
  } catch (error) {
    yield [
      yield put({
        type: GET_ORG_CONSORTIUMS_FAILURE,
        error: 'Couldn\'t load org consortiums due to some error',
      }),
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t load org consortiums due to some error',
        }),
      ),
    ];
  }
}

function* createConsortium(payload) {
  try {
    const response = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}consortium/`,
      payload.data,
    );
    yield put({ type: CREATE_CONSORTIUM_SUCCESS, data: response.data });
  } catch (error) {
    yield [
      yield put({
        type: CREATE_CONSORTIUM_FAILURE,
        error: 'Couldn\'t create consortium due to some error',
      }),
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t create consortium due to some error',
        }),
      ),
    ];
  }
}

function* editConsortium(payload) {
  try {
    const response = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}consortium/${payload.data.consortium_uuid}/`,
      payload.data,
    );
    yield put({ type: EDIT_CONSORTIUM_SUCCESS, data: response.data });
  } catch (error) {
    yield [
      yield put({
        type: EDIT_CONSORTIUM_FAILURE,
        error: 'Couldn\'t edit consortium due to some error',
      }),
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t edit consortium due to some error',
        }),
      ),
    ];
  }
}

function* deleteConsortium(payload) {
  try {
    const response = yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}consortium/${payload.uuid}/`,
    );
    yield put({ type: DELETE_CONSORTIUM_SUCCESS, uuid: payload.uuid });
  } catch (error) {
    yield [
      yield put({
        type: DELETE_CONSORTIUM_FAILURE,
        error: 'Couldn\'t delete consortium due to some error',
      }),
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t delete consortium due to some error',
        }),
      ),
    ];
  }
}

function* watchGetAllConsortiums() {
  yield takeLatest(GET_ALL_CONSORTIUMS, getAllConsortiums);
}

function* watchGetOrgConsortiums() {
  yield takeLatest(GET_ORG_CONSORTIUMS, getOrgConsortiums);
}

function* watchCreateConsortium() {
  yield takeLatest(CREATE_CONSORTIUM, createConsortium);
}

function* watchEditConsortium() {
  yield takeLatest(EDIT_CONSORTIUM, editConsortium);
}

function* watchDeleteConsortium() {
  yield takeLatest(DELETE_CONSORTIUM, deleteConsortium);
}

export default function* consortiumSaga() {
  yield all([
    watchGetAllConsortiums(),
    watchGetOrgConsortiums(),
    watchCreateConsortium(),
    watchEditConsortium(),
    watchDeleteConsortium(),
  ]);
}
