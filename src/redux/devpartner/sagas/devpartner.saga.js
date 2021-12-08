import {
  put, takeLatest, all, call,
} from 'redux-saga/effects';
import { httpService } from '@modules/http/http.service';
import { showAlert } from '@redux/alert/actions/alert.actions';
import {
  GET_DEVTEAMS,
  GET_DEVTEAMS_SUCCESS,
  GET_DEVTEAMS_FAILURE,
  ADD_DEVTEAM,
  ADD_DEVTEAM_FAILURE,
  UPDATE_DEVTEAM,
  UPDATE_DEVTEAM_FAILURE,
  DELETE_DEVTEAM,
  DELETE_DEVTEAM_FAILURE,
  GET_TIMESHEETS,
  GET_TIMESHEETS_SUCCESS,
  GET_TIMESHEETS_FAILURE,
  ADD_TIMESHEET,
  ADD_TIMESHEET_FAILURE,
  UPDATE_TIMESHEET,
  UPDATE_TIMESHEET_FAILURE,
  DELETE_TIMESHEET,
  DELETE_TIMESHEET_FAILURE,
  GET_TIMESHEET_HOURS,
  GET_TIMESHEET_HOURS_SUCCESS,
  GET_TIMESHEET_HOURS_FAILURE,
  ADD_TIMESHEET_HOUR,
  ADD_TIMESHEET_HOUR_FAILURE,
  UPDATE_TIMESHEET_HOUR,
  UPDATE_TIMESHEET_HOUR_FAILURE,
  DELETE_TIMESHEET_HOUR,
  DELETE_TIMESHEET_HOUR_FAILURE,
} from '../actions/devpartner.actions';

const devPartnerEndpoint = 'devpartner/';

function* getDevTeams(payload) {
  try {
    let query_params = '';
    if (payload.organization_uuid) {
      query_params = `organization_uuid=${payload.organization_uuid}/`;
    } else if (payload.dev_team_uuid) {
      query_params = query_params.concat(`dev_team_uuid=${payload.dev_team_uuid}`);
    }
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${devPartnerEndpoint}devteam/?${query_params}`,
    );
    yield put({ type: GET_DEVTEAMS_SUCCESS, data: data.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Dev Teams!',
        }),
      ),
      yield put({
        type: GET_DEVTEAMS_FAILURE,
        error,
      }),
    ];
  }
}

function* addDevTeam(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${devPartnerEndpoint}devteam/`,
      payload,
    );

    if (data && data.data) {
      yield [
        yield put(getDevTeams(data.data.dev_team_uuid)),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Added Dev team',
          }),
        ),

      ];
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t Add Dev Team due to some error!',
        }),
      ),
      yield put({
        type: ADD_DEVTEAM_FAILURE,
        error,
      }),
    ];
  }
}

function* updateDevTeam(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}${devPartnerEndpoint}devteam/${payload.dev_team_uuid}/`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put(getDevTeams(payload.dev_team_uuid)),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Edited Dev team',
          }),
        ),
      ];
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t Edit Dev_team due to some error!',
        }),
      ),
      yield put({
        type: UPDATE_DEVTEAM_FAILURE,
        error,
      }),
    ];
  }
}

function* deleteDevTeam(payload) {
  try {
    yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${devPartnerEndpoint}devteam/${payload.dev_team_uuid}/`,
    );
    yield [
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Dev team deleted successfully!',
        }),
      ),
      yield put(getDevTeams(payload.organization_uuid)),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in deleting dev team!',
        }),
      ),
      yield put({
        type: DELETE_DEVTEAM_FAILURE,
        error,
      }),
    ];
  }
}

function* getTimesheets(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${devPartnerEndpoint}timesheet/?project_uuid=${payload.project_uuid}`,
    );
    yield put({ type: GET_TIMESHEETS_SUCCESS, data: data.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Timesheets!',
        }),
      ),
      yield put({
        type: GET_TIMESHEETS_FAILURE,
        error,
      }),
    ];
  }
}

function* addTimesheet(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${devPartnerEndpoint}timesheet/`,
      payload,
    );

    if (data && data.data) {
      yield [
        yield put(getTimesheets(data.data.timesheet_uuid)),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Added Timesheet',
          }),
        ),

      ];
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t Add Timesheet due to some error!',
        }),
      ),
      yield put({
        type: ADD_TIMESHEET_FAILURE,
        error,
      }),
    ];
  }
}

function* updateTimesheet(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}${devPartnerEndpoint}timesheet/${payload.timesheet_uuid}/`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put(getTimesheets(payload.timesheet_uuid)),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Edited Timesheet',
          }),
        ),
      ];
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t Edit Timesheet due to some error!',
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
  try {
    yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${devPartnerEndpoint}timesheet/${payload.timesheet_uuid}/`,
    );
    yield [
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Timesheet deleted successfully!',
        }),
      ),
      yield put(getTimesheets(payload.project_uuid)),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in deleting timesheet!',
        }),
      ),
      yield put({
        type: DELETE_TIMESHEET_FAILURE,
        error,
      }),
    ];
  }
}

function* getTimesheet_hours(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${devPartnerEndpoint}timesheet_hour/?project_uuid=${payload.project_uuid}`,
    );
    yield put({ type: GET_TIMESHEET_HOURS_SUCCESS, data: data.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t fetch Timesheet_hours!',
        }),
      ),
      yield put({
        type: GET_TIMESHEET_HOURS_FAILURE,
        error,
      }),
    ];
  }
}

function* addTimesheet_hour(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${devPartnerEndpoint}timesheet_hour/`,
      payload,
    );

    if (data && data.data) {
      yield [
        yield put(getTimesheet_hours(data.data.timesheet_hour_uuid)),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Added Timesheet_hour',
          }),
        ),

      ];
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t Add Timesheet_hour due to some error!',
        }),
      ),
      yield put({
        type: ADD_TIMESHEET_HOUR_FAILURE,
        error,
      }),
    ];
  }
}

function* updateTimesheet_hour(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}${devPartnerEndpoint}timesheet_hour/${payload.timesheet_hour_uuid}/`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put(getTimesheet_hours(payload.timesheet_hour_uuid)),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Edited Timesheet_hour',
          }),
        ),
      ];
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t Edit Timesheet_hour due to some error!',
        }),
      ),
      yield put({
        type: UPDATE_TIMESHEET_HOUR_FAILURE,
        error,
      }),
    ];
  }
}

function* deleteTimesheet_hour(payload) {
  try {
    yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${devPartnerEndpoint}timesheet_hour/${payload.timesheet_hour_uuid}/`,
    );
    yield [
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Timesheet_hour deleted successfully!',
        }),
      ),
      yield put(getTimesheet_hours(payload.project_uuid)),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in deleting timesheet_hour!',
        }),
      ),
      yield put({
        type: DELETE_TIMESHEET_HOUR_FAILURE,
        error,
      }),
    ];
  }
}

// Watchers
function* watchGetDevTeams() {
  yield takeLatest(GET_DEVTEAMS, getDevTeams);
}

function* watchAddDevTeam() {
  yield takeLatest(ADD_DEVTEAM, addDevTeam);
}

function* watchUpdateDevTeam() {
  yield takeLatest(UPDATE_DEVTEAM, updateDevTeam);
}

function* watchDeleteDevTeam() {
  yield takeLatest(DELETE_DEVTEAM, deleteDevTeam);
}

function* watchGetTimesheets() {
  yield takeLatest(GET_TIMESHEETS, getTimesheets);
}

function* watchAddTimesheet() {
  yield takeLatest(ADD_TIMESHEET, addTimesheet);
}

function* watchUpdateTimesheet() {
  yield takeLatest(UPDATE_TIMESHEET, updateTimesheet);
}

function* watchDeleteTimesheet() {
  yield takeLatest(DELETE_TIMESHEET, deleteTimesheet);
}

function* watchGetTimesheet_hours() {
  yield takeLatest(GET_TIMESHEET_HOURS, getTimesheet_hours);
}

function* watchAddTimesheet_hour() {
  yield takeLatest(ADD_TIMESHEET_HOUR, addTimesheet_hour);
}

function* watchUpdateTimesheet_hour() {
  yield takeLatest(UPDATE_TIMESHEET_HOUR, updateTimesheet_hour);
}

function* watchDeleteTimesheet_hour() {
  yield takeLatest(DELETE_TIMESHEET_HOUR, deleteTimesheet_hour);
}

export default function* devPartnerSaga() {
  yield all([
    watchGetDevTeams(),
    watchAddDevTeam(),
    watchUpdateDevTeam(),
    watchDeleteDevTeam(),
    watchGetTimesheets(),
    watchAddTimesheet(),
    watchUpdateTimesheet(),
    watchDeleteTimesheet(),
    watchGetTimesheet_hours(),
    watchAddTimesheet_hour(),
    watchUpdateTimesheet_hour(),
    watchDeleteTimesheet_hour(),
  ]);
}
