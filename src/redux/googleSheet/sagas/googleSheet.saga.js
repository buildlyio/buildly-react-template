import _ from 'lodash';
import {
  ADD_DATA,
  ADD_DATA_SUCCESS,
  ADD_DATA_FAIL,
  CHECK_FILLED,
  CHECK_FILLED_SUCCESS,
  CHECK_FILLED_FAIL,
} from '@redux/googleSheet/actions/googleSheet.actions';
import { put, takeLatest, all, call } from 'redux-saga/effects';
import { httpService } from '@modules/http/http.service';
import { showAlert } from '@redux/alert/actions/alert.actions';

function* addData(payload) {
  const { data } = payload;
  try {
    const sheet = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.FEEDBACK_SHEET}`,
      data
    );

    yield [
      yield put({ type: ADD_DATA_SUCCESS, form: sheet.data }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Feedback submitted sucessfully!',
        })
      ),
    ];
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
        })
      ),
    ];
  }
}

function* checkFilled(payload) {
  const { name } = payload;
  try {
    const sheet = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.FEEDBACK_SHEET}`
    );
    const entry = _.find(sheet.data, { Name: name });
    yield put({ type: CHECK_FILLED_SUCCESS, filled: Boolean(entry) });
  } catch (error) {
    console.log('error', error);
    yield put({
      type: CHECK_FILLED_FAIL,
      error: 'Error checking data from google sheet',
    });
  }
}

function* watchAddData() {
  yield takeLatest(ADD_DATA, addData);
}

function* watchCheckFilled() {
  yield takeLatest(CHECK_FILLED, checkFilled);
}

export default function* googleSheetSaga() {
  yield all([watchAddData(), watchCheckFilled()]);
}
