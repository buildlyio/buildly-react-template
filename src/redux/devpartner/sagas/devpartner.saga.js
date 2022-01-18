import {
  put, takeLatest, all, call,
} from 'redux-saga/effects';
import { httpService } from '@modules/http/http.service';
import { showAlert } from '@redux/alert/actions/alert.actions';
import {
  ALL_DEV_TEAMS,
  ALL_DEV_TEAMS_SUCCESS,
  ALL_DEV_TEAMS_FAILURE,
  ALL_TIMESHEET_HOURS,
  ALL_TIMESHEET_HOURS_SUCCESS,
  ALL_TIMESHEET_HOURS_FAILURE,
  ALL_TIMESHEETS,
  ALL_TIMESHEETS_SUCCESS,
  ALL_TIMESHEETS_FAILURE,
  GET_DEV_TEAM,
  GET_DEV_TEAM_SUCCESS,
  GET_DEV_TEAM_FAILURE,
  GET_TIMESHEET_HOUR,
  GET_TIMESHEET_HOUR_SUCCESS,
  GET_TIMESHEET_HOUR_FAILURE,
  GET_TIMESHEET,
  GET_TIMESHEET_SUCCESS,
  GET_TIMESHEET_FAILURE,
  CREATE_DEV_TEAM,
  CREATE_DEV_TEAM_SUCCESS,
  CREATE_DEV_TEAM_FAILURE,
  CREATE_TIMESHEET_HOUR,
  CREATE_TIMESHEET_HOUR_SUCCESS,
  CREATE_TIMESHEET_HOUR_FAILURE,
  CREATE_TIMESHEET,
  CREATE_TIMESHEET_SUCCESS,
  CREATE_TIMESHEET_FAILURE,
  UPDATE_DEV_TEAM,
  UPDATE_DEV_TEAM_SUCCESS,
  UPDATE_DEV_TEAM_FAILURE,
  UPDATE_TIMESHEET_HOUR,
  UPDATE_TIMESHEET_HOUR_SUCCESS,
  UPDATE_TIMESHEET_HOUR_FAILURE,
  UPDATE_TIMESHEET,
  UPDATE_TIMESHEET_SUCCESS,
  UPDATE_TIMESHEET_FAILURE,
  DELETE_DEV_TEAM,
  DELETE_DEV_TEAM_SUCCESS,
  DELETE_DEV_TEAM_FAILURE,
  DELETE_TIMESHEET_HOUR,
  DELETE_TIMESHEET_HOUR_SUCCESS,
  DELETE_TIMESHEET_HOUR_FAILURE,
  DELETE_TIMESHEET,
  DELETE_TIMESHEET_SUCCESS,
  DELETE_TIMESHEET_FAILURE,
} from '../actions/devpartner.actions';

const devpartnerEndpoint = 'devpartner/';

function* allDevTeams(payload) {
  try {
    const devteams = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${devpartnerEndpoint}devteam/`,
    );
    yield put({ type: ALL_DEV_TEAMS_SUCCESS, data: devteams.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch all Dev Teams!',
        }),
      ),
      yield put({
        type: ALL_DEV_TEAMS_FAILURE,
        error,
      }),
    ];
  }
}

function* getDevTeam(payload) {
  try {
    const devteam = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${devpartnerEndpoint}devteam/?devteam_uuid=${payload.devteam_uuid}`,
    );
    yield put({ type: GET_DEV_TEAM_SUCCESS, data: devteam.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Dev Team!',
        }),
      ),
      yield put({
        type: GET_DEV_TEAM_FAILURE,
        error,
      }),
    ];
  }
}

function* createDevTeam(payload) {
  try {
    const devteam = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${devpartnerEndpoint}devteam/`,
      payload.data,
    );
    yield put({ type: CREATE_DEV_TEAM_SUCCESS, data: devteam.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t create Dev Team!',
        }),
      ),
      yield put({
        type: CREATE_DEV_TEAM_FAILURE,
        error,
      }),
    ];
  }
}

function* updateDevTeam(payload) {
  try {
    const devteam = yield call(
      httpService.makeRequest,
      'put',
      `${window.env.API_URL}${devpartnerEndpoint}devteam/${payload.data.devteam_uuid}`,
      payload.data,
    );
    yield put({ type: UPDATE_DEV_TEAM_SUCCESS, data: devteam.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t update Dev Team!',
        }),
      ),
      yield put({
        type: UPDATE_DEV_TEAM_FAILURE,
        error,
      }),
    ];
  }
}

function* deleteDevTeam(payload) {
  const { devteam_uuid } = payload;
  try {
    const devteam = yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${devpartnerEndpoint}devteam/${devteam_uuid}`,
    );
    yield put({ type: DELETE_DEV_TEAM_SUCCESS, devteam_uuid });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t delete Dev Team!',
        }),
      ),
      yield put({
        type: DELETE_DEV_TEAM_FAILURE,
        error,
      }),
    ];
  }
}

function* allTimesheetHours(payload) {
  try {
    const hours = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${devpartnerEndpoint}timesheet_hour/`,
    );
    yield put({ type: ALL_TIMESHEET_HOURS_SUCCESS, data: hours.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch all Timesheet Hours!',
        }),
      ),
      yield put({
        type: ALL_TIMESHEET_HOURS_FAILURE,
        error,
      }),
    ];
  }
}

function* getTimesheetHour(payload) {
  try {
    const hour = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${devpartnerEndpoint}timesheet_hour/?timesheethour_uuid=${payload.timesheethour_uuid}`,
    );
    yield put({ type: GET_TIMESHEET_HOUR_SUCCESS, data: hour.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Timesheet Hour!',
        }),
      ),
      yield put({
        type: GET_TIMESHEET_HOUR_FAILURE,
        error,
      }),
    ];
  }
}

function* createTimesheetHour(payload) {
  try {
    const hour = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${devpartnerEndpoint}timesheet_hour/`,
      payload.data,
    );
    yield put({ type: CREATE_TIMESHEET_HOUR_SUCCESS, data: hour.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t create Timesheet Hour!',
        }),
      ),
      yield put({
        type: CREATE_TIMESHEET_HOUR_FAILURE,
        error,
      }),
    ];
  }
}

function* updateTimesheetHour(payload) {
  try {
    const hour = yield call(
      httpService.makeRequest,
      'put',
      `${window.env.API_URL}${devpartnerEndpoint}timesheet_hour/${payload.data.timesheethour_uuid}`,
      payload.data,
    );
    yield put({ type: UPDATE_TIMESHEET_HOUR_SUCCESS, data: hour.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t update Timesheet Hour!',
        }),
      ),
      yield put({
        type: UPDATE_TIMESHEET_HOUR_FAILURE,
        error,
      }),
    ];
  }
}

function* deleteTimesheetHour(payload) {
  const { timesheethour_uuid } = payload;
  try {
    const hour = yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${devpartnerEndpoint}timesheet_hour/${timesheethour_uuid}`,
    );
    yield put({ type: DELETE_TIMESHEET_HOUR_SUCCESS, timesheethour_uuid });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t delete Timesheet Hour!',
        }),
      ),
      yield put({
        type: DELETE_TIMESHEET_HOUR_FAILURE,
        error,
      }),
    ];
  }
}

function* allTimesheets(payload) {
  try {
    const sheets = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${devpartnerEndpoint}timesheet/`,
    );
    yield put({ type: ALL_TIMESHEETS_SUCCESS, data: sheets.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch all Timesheets!',
        }),
      ),
      yield put({
        type: ALL_TIMESHEETS_FAILURE,
        error,
      }),
    ];
  }
}

function* getTimesheet(payload) {
  try {
    const sheet = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${devpartnerEndpoint}timesheet/?timesheet_uuid=${payload.timesheet_uuid}`,
    );
    yield put({ type: GET_TIMESHEET_SUCCESS, data: sheet.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Timesheet!',
        }),
      ),
      yield put({
        type: GET_TIMESHEET_FAILURE,
        error,
      }),
    ];
  }
}

function* createTimesheet(payload) {
  try {
    const sheet = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${devpartnerEndpoint}timesheet/`,
      payload.data,
    );
    yield put({ type: CREATE_TIMESHEET_SUCCESS, data: sheet.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t create Dev Team!',
        }),
      ),
      yield put({
        type: CREATE_TIMESHEET_FAILURE,
        error,
      }),
    ];
  }
}

function* updateTimesheet(payload) {
  try {
    const sheet = yield call(
      httpService.makeRequest,
      'put',
      `${window.env.API_URL}${devpartnerEndpoint}timesheet/${payload.data.timesheet_uuid}`,
      payload.data,
    );
    yield put({ type: UPDATE_TIMESHEET_SUCCESS, data: sheet.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t update Dev Team!',
        }),
      ),
      yield put({
        type: UPDATE_TIMESHEET_FAILURE,
        error,
      }),
    ];
  }
}

function* deleteTimesheet(payload) {
  const { timesheet_uuid } = payload;
  try {
    const sheet = yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${devpartnerEndpoint}timesheet/${timesheet_uuid}`,
    );
    yield put({ type: DELETE_TIMESHEET_SUCCESS, timesheet_uuid });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t delete Dev Team!',
        }),
      ),
      yield put({
        type: DELETE_TIMESHEET_FAILURE,
        error,
      }),
    ];
  }
}

// Watchers
function* watchGetAllDevTeams() {
  yield takeLatest(ALL_DEV_TEAMS, allDevTeams);
}

function* watchGetDevTeam() {
  yield takeLatest(GET_DEV_TEAM, getDevTeam);
}

function* watchCreateDevTeam() {
  yield takeLatest(CREATE_DEV_TEAM, createDevTeam);
}

function* watchUpdateDevTeam() {
  yield takeLatest(UPDATE_DEV_TEAM, updateDevTeam);
}

function* watchDeleteDevTeam() {
  yield takeLatest(DELETE_DEV_TEAM, deleteDevTeam);
}

function* watchGetAllTimesheetHours() {
  yield takeLatest(ALL_TIMESHEET_HOURS, allTimesheetHours);
}

function* watchGetTimesheetHour() {
  yield takeLatest(GET_TIMESHEET_HOUR, getTimesheetHour);
}

function* watchCreateTimesheetHour() {
  yield takeLatest(CREATE_TIMESHEET_HOUR, createTimesheetHour);
}

function* watchUpdateTimesheetHour() {
  yield takeLatest(UPDATE_TIMESHEET_HOUR, updateTimesheetHour);
}

function* watchDeleteTimesheetHour() {
  yield takeLatest(DELETE_TIMESHEET_HOUR, deleteTimesheetHour);
}

function* watchGetAllTimesheets() {
  yield takeLatest(ALL_TIMESHEETS, allTimesheets);
}

function* watchGetTimesheet() {
  yield takeLatest(GET_TIMESHEET, getTimesheet);
}

function* watchCreateTimesheet() {
  yield takeLatest(CREATE_TIMESHEET, createTimesheet);
}

function* watchUpdateTimesheet() {
  yield takeLatest(UPDATE_TIMESHEET, updateTimesheet);
}

function* watchDeleteTimesheet() {
  yield takeLatest(DELETE_TIMESHEET, deleteTimesheet);
}

export default function* devpartnerSaga() {
  yield all([
    watchGetAllDevTeams(),
    watchGetAllTimesheetHours(),
    watchGetAllTimesheets(),
    watchGetDevTeam(),
    watchGetTimesheetHour(),
    watchGetTimesheet(),
    watchCreateDevTeam(),
    watchCreateTimesheetHour(),
    watchCreateTimesheet(),
    watchUpdateDevTeam(),
    watchUpdateTimesheetHour(),
    watchUpdateTimesheet(),
    watchDeleteDevTeam(),
    watchDeleteTimesheetHour(),
    watchDeleteTimesheet(),
  ]);
}
