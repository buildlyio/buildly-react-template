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
    DELETE_COREGROUP_COMMIT
} from '../actions/coregroup.actions';
import { put, takeLatest, all, call } from 'redux-saga/effects';
import { httpService } from '../../../modules/http/http.service';
import { environment } from 'environment';


function* loadCoreGroups() {
    try {
        const group = yield call(httpService.makeRequest, 'get', `${environment.API_URL}coregroups/`);
        yield [
            yield put({ type: LOAD_DATA_COREGROUP_COMMIT, group })
        ];
    } catch(error) {
        yield put({ type: LOAD_DATA_COREGROUP_FAIL, error: 'getting core groups failed' });
    }
}

function* deleteCoreGroups(data) {
    try {
        const group = yield call(httpService.makeRequest, 'delete', `${environment.API_URL}coregroups/${data.data.id}`);
        yield [
            yield put({ type: DELETE_COREGROUP_COMMIT, data:data.data, group })
        ];
    } catch(error) {
        yield put({ type: DELETE_COREGROUP_FAIL, error: 'failed deleting group' });
    }
}


function* updateCoreGroups(data) {
    try {
        const group = yield call(httpService.makeRequest, 'put', `${environment.API_URL}coregroups/${data.data.id}/`, data.data);
        yield [
            yield put({ type: UPDATE_COREGROUP_COMMIT, data:data.data })
        ];
    } catch(error) {
        yield put({ type: UPDATE_COREGROUP_FAIL, error: 'failed to update group' });
    }
}

function* watchLoadCoreGroups() {
    yield takeLatest(LOAD_DATA_COREGROUP, loadCoreGroups)
}


function* watchDeleteCoreGroups() {
    yield takeLatest(DELETE_COREGROUP, deleteCoreGroups)
}

function* watchUpdateCoreGroups() {
    yield takeLatest(UPDATE_COREGROUP, updateCoreGroups)
}
export default function* coreGroupSaga() {
  yield all([
      watchLoadCoreGroups(),
      watchDeleteCoreGroups(),
      watchUpdateCoreGroups()
  ]);
}
