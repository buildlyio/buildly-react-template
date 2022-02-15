import _ from 'lodash';
import {
  ADD_DATA,
  ADD_DATA_SUCCESS,
  ADD_DATA_FAIL,
} from '@redux/googleSheet/actions/googleSheet.actions';
import {
  put, takeLatest, all, call,
} from 'redux-saga/effects';
import { httpService } from '@modules/http/http.service';
import { showAlert } from '@redux/alert/actions/alert.actions';
import { routes } from '@routes/routesConstants';

function* addData(payload) {
  const { data, history } = payload;
  try {
    const sheet = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.FEEDBACK_SHEET}`,
      data,
    );

    yield [
      yield put({ type: ADD_DATA_SUCCESS, form: sheet.data }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Feedback submitted sucessfully!',
        }),
      ),
    ];

    if (history) {
      history.push(routes.DASHBOARD);
    }
  } catch (error) {
    console.log('error', error);
    yield [
      yield put({
        type: ADD_DATA_FAIL,
        error: 'Error adding data to google sheet',
      }),
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error submitting form. Please try again',
        }),
      ),
    ];
  }
}

function* watchAddData() {
  yield takeLatest(ADD_DATA, addData);
}

export default function* googleSheetSaga() {
  yield all([
    watchAddData(),
  ]);
}
