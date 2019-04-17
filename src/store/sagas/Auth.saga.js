import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  REGISTER,
  REGISTER_SUCCESS,
  REGISTER_FAIL
} from '../actions/Auth.actions';
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
    yield call(oauthService.setAccessToken, token.data);
    const user = yield call(httpService.makeRequest, 'get', `${environment.API_URL}oauthuser/`);
    yield call(oauthService.setOauthUser, user);
    yield [
      yield put({ type: LOGIN_SUCCESS, user })
    ];
  } catch(error) {
    yield put({ type: LOGIN_FAIL, error: 'Invalid credentials given' });
  }
}

function* register(payload) {
  try {
    const user = yield call(httpService.makeRequest, 'post', `${environment.API_URL}coreuser/`, payload.data);
    yield [
      yield put({ type: REGISTER_SUCCESS, user })
    ];
  } catch(error) {
    yield put({ type: REGISTER_FAIL, error: 'Registration failed' });
  }
}

function* watchLogout() {
  yield takeLatest(LOGOUT, logout)
}

function* watchLogin() {
  yield takeLatest(LOGIN, login)
}

function* watchRegister() {
  yield takeLatest(REGISTER, register)
}

export default function* authSaga() {
  yield all([
    watchLogin(),
    watchLogout(),
    watchRegister()
  ]);
}
