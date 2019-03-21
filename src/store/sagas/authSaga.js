import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL
} from '../actions/actionTypes';
import { put, takeLatest, all, call } from 'redux-saga/effects';
import { oauthService } from 'midgard/modules/oauth/oauth.service';
import { httpService } from 'midgard/modules/http/http.service';
import { environment } from 'environment';

function* logout() {
  try {
    yield call(oauthService.logout);
    yield [
      yield put({ type: LOGOUT_SUCCESS })
    ];
  } catch(error) {
    yield put({ type: LOGOUT_FAIL });
  }
}

function* login(payload) {
  try {
    const token = yield call(oauthService.authenticateWithPasswordFlow, payload.credentials);
    yield call(oauthService.setAccessToken, token);
    const user = yield call(httpService.makeRequest, 'get', `${environment.API_URL}oauthuser/`);
    yield call(oauthService.setOauthUser, user);
    yield [
      yield put({ type: LOGIN_SUCCESS, user })
    ];
  } catch(error) {
    yield put({ type: LOGIN_FAIL, error });
  }
}

function* watchLogout() {
  yield takeLatest(LOGOUT, logout)
}

function* watchLogin() {
  yield takeLatest(LOGIN, login)
}

export default function* authSaga() {
  yield all([
    watchLogin(),
    watchLogout(),
  ]);
}
