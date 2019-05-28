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
import { put, takeLatest, all, call } from 'redux-saga/effects';
import { httpService } from 'midgard/modules/http/http.service';
import { environment } from 'environment';

function* loadCoreUsers() {
    try {
        const res = yield call(httpService.makeRequest, 'get', `${environment.API_URL}coreuser/`);
        yield [
            yield put({ type: LOAD_DATA_COREUSER_COMMIT, data: res.data })
        ];
    } catch(error) {
        yield put({ type: LOAD_DATA_COREUSER_FAIL, error: 'Could not load users' });
    }
}

function* createCoreUser(action) {
  try {
    const res = yield call(httpService.makeRequest, 'post', `${environment.API_URL}coreuser/`, action.data);
    yield [
      yield put({ type: CREATE_COREUSER_COMMIT, data: res.data })
    ];
  } catch(error) {
    yield put({ type: CREATE_COREUSER_FAIL, error: 'Could not create user' });
  }
}

function* updateCoreUser() {
  try {
    const res = yield call(httpService.makeRequest, 'patch', `${environment.API_URL}coreuser/${action.data.id}/`, action.data, true);
    yield [
      yield put({ type: UPDATE_COREUSER_COMMIT, data: res.data})
    ];
  } catch(error) {
    yield put({ type: UPDATE_COREUSER_FAIL, error: 'Could not update user' });
  }
}

function* deleteCoreUser() {
  try {
    const res = yield call(httpService.makeRequest, 'delete', `${environment.API_URL}coreuser/${action.data.id}/`, {}, true);
    yield [
      yield put({ type: DELETE_COREUSER_COMMIT, data: res.data})
    ];
  } catch(error) {
    yield put({ type: DELETE_COREUSER_FAIL, error: 'delete user failed' });
  }
}

function* watchLoadCoreUsers() {
    yield takeLatest(LOAD_DATA_COREUSER, loadCoreUsers)
}

function* watchCreateCoreUser() {
  yield takeLatest(CREATE_COREUSER, createCoreUser)
}

function* watchUpdateCoreUser() {
  yield takeLatest(UPDATE_COREUSER, updateCoreUser)
}

function* watchDeleteCoreUser() {
  yield takeLatest(DELETE_COREUSER, deleteCoreUser)
}

export default function* coreUserSaga() {
  yield all([
    watchLoadCoreUsers(),
    watchCreateCoreUser(),
    watchUpdateCoreUser(),
    watchDeleteCoreUser()
  ]);
}
