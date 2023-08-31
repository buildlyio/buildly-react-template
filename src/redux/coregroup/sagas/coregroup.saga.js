import {
  put, takeLatest, all, call,
} from 'redux-saga/effects';
import { httpService } from '../../../modules/http/http.service';
import {
  LOAD_DATA_COREGROUP,
  LOAD_DATA_COREGROUP_FAIL,
  LOAD_DATA_COREGROUP_COMMIT,
  UPDATE_COREGROUP,
  UPDATE_COREGROUP_FAIL,
  UPDATE_COREGROUP_COMMIT,
  CREATE_COREGROUP,
  CREATE_COREGROUP_FAIL,
  CREATE_COREGROUP_COMMIT,
  DELETE_COREGROUP,
  DELETE_COREGROUP_FAIL,
  DELETE_COREGROUP_COMMIT,
} from '../actions/coregroup.actions';

function* loadCoregroups() {
  try {
    const group = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}coregroups/`,
    );
    yield put({
      type: LOAD_DATA_COREGROUP_COMMIT,
      data: group.data,
    });
  } catch (error) {
    yield put({ type: LOAD_DATA_COREGROUP_FAIL, error });
  }
}

function* deleteCoregroups(data) {
  try {
    const group = yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}coregroups/${data.data.id}`,
    );
    yield put({
      type: DELETE_COREGROUP_COMMIT,
      data: data.data,
      group,
    });
  } catch (error) {
    yield put({
      type: DELETE_COREGROUP_FAIL,
      error: 'failed deleting group',
    });
  }
}

function* updateCoregroups(data) {
  try {
    const group = yield call(
      httpService.makeRequest,
      'put',
      `${window.env.API_URL}coregroups/${data.data.id}/`,
      data.data,
    );
    yield put({
      type: UPDATE_COREGROUP_COMMIT,
      data: data.data,
    });
  } catch (error) {
    yield put({
      type: UPDATE_COREGROUP_FAIL,
      error: 'failed to update group',
    });
  }
}

function* createCoregroups(data) {
  try {
    const group = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}coregroups/`,
      data.data,
    );
    yield put({
      type: CREATE_COREGROUP_COMMIT,
      data: group.data,
    });
  } catch (error) {
    yield put({
      type: CREATE_COREGROUP_FAIL,
      error: 'failed to create group',
    });
  }
}

function* watchCreateCoregroups() {
  yield takeLatest(CREATE_COREGROUP, createCoregroups);
}

function* watchLoadCoregroups() {
  yield takeLatest(LOAD_DATA_COREGROUP, loadCoregroups);
}

function* watchDeleteCoregroups() {
  yield takeLatest(DELETE_COREGROUP, deleteCoregroups);
}

function* watchUpdateCoregroups() {
  yield takeLatest(UPDATE_COREGROUP, updateCoregroups);
}

export default function* coregroupSaga() {
  yield all([
    watchLoadCoregroups(),
    watchDeleteCoregroups(),
    watchUpdateCoregroups(),
    watchCreateCoregroups(),
  ]);
}
