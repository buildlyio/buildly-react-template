import {
  ADD_DATA,
  ADD_DATA_SUCCESS,
  ADD_DATA_FAIL,
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
      'https://sheet.best/api/sheets/fd4d0563-683c-4f3f-813c-526b5dc72606',
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

function* watchAddData() {
  yield takeLatest(ADD_DATA, addData);
}

export default function* googleSheetSaga() {
  yield all([watchAddData()]);
}
