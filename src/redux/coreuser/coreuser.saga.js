import {
  put, takeLatest, all, call,
} from 'redux-saga/effects';
import { httpService } from '@modules/http/http.service';
import {
  LOAD_DATA_COREUSER,
  LOAD_DATA_COREUSER_COMMIT,
  LOAD_DATA_COREUSER_FAIL,
  CREATE_COREUSER,
  CREATE_COREUSER_COMMIT,
  CREATE_COREUSER_FAIL,
  DELETE_COREUSER,
  DELETE_COREUSER_COMMIT,
  DELETE_COREUSER_FAIL,
  UPDATE_COREUSER,
  UPDATE_COREUSER_COMMIT,
  UPDATE_COREUSER_FAIL,
} from './coreuser.actions';

const endpoint = `${window.env.API_URL}coreuser/`;

function* loadCoreUsers() {
  try {
    const res = yield call(
      httpService.makeRequest,
      'get',
      endpoint,
    );
    yield put({ type: LOAD_DATA_COREUSER_COMMIT, data: res.data });
  } catch (error) {
    yield put({ type: LOAD_DATA_COREUSER_FAIL, error });
  }
}

function* createCoreUser(action) {
  try {
    const res = yield call(
      httpService.makeRequest,
      'post',
      endpoint,
      action.data,
    );
    yield put({ type: CREATE_COREUSER_COMMIT, data: res.data });
  } catch (error) {
    yield put({ type: CREATE_COREUSER_FAIL, error });
  }
}

function* updateCoreUser(action) {
  try {
    const res = yield call(
      httpService.makeRequest,
      'patch',
      `${endpoint}${action.data.id}/`,
      action.data,
      true,
    );
    yield put({ type: UPDATE_COREUSER_COMMIT, data: res.data });
  } catch (error) {
    yield put({ type: UPDATE_COREUSER_FAIL, error });
  }
}

function* deleteCoreUser(action) {
  try {
    const res = yield call(
      httpService.makeRequest,
      'delete',
      `${endpoint}${action.data.id}/`,
      {},
      true,
    );
    yield put({ type: DELETE_COREUSER_COMMIT, data: res.data });
  } catch (error) {
    yield put({ type: DELETE_COREUSER_FAIL, error });
  }
}

function* watchLoadCoreUsers() {
  yield takeLatest(LOAD_DATA_COREUSER, loadCoreUsers);
}

function* watchCreateCoreUser() {
  yield takeLatest(CREATE_COREUSER, createCoreUser);
}

function* watchUpdateCoreUser() {
  yield takeLatest(UPDATE_COREUSER, updateCoreUser);
}

function* watchDeleteCoreUser() {
  yield takeLatest(DELETE_COREUSER, deleteCoreUser);
}

export default function* coreuserSaga() {
  yield all([
    watchLoadCoreUsers(),
    watchCreateCoreUser(),
    watchUpdateCoreUser(),
    watchDeleteCoreUser(),
  ]);
}
