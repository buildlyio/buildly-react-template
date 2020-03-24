import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  REGISTER,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  UPDATE_USER,
  UPDATE_USER_FAIL,
  UPDATE_USER_SUCCESS,
  INVITE,
  INVITE_FAIL,
  INVITE_SUCCESS
} from '../actions/authuser.actions';
import { put, takeLatest, all, call } from 'redux-saga/effects';
import { oauthService } from '../../../modules/oauth/oauth.service';
import { httpService } from '../../../modules/http/http.service';
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
    const user = yield call(httpService.makeRequest, 'get', `${environment.API_URL}coreuser/me/`);
    yield call(oauthService.setOauthUser, user, payload);
    const coreUser = yield call(httpService.makeRequest, 'get', `${environment.API_URL}coreuser/`);
    yield call(oauthService.setCurrentCoreUser, coreUser, user);
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


function* invite(payload) {
    try {
        const user = yield call(httpService.makeRequest, 'post', `${environment.API_URL}coreuser/invite/`, payload.data);
        yield [
            yield put({ type: INVITE_SUCCESS, user })
        ];
    } catch(error) {
        yield put({ type: INVITE_FAIL, error: 'One or more email address is invalid' });
    }
}


function* updateUser(payload) {
    try {
        const user = yield call(httpService.makeRequest, 'put', `${environment.API_URL}coreuser/${payload.data.id}/`, payload.data);
        yield [
            yield put({ type: UPDATE_USER_SUCCESS, user })
        ];
    } catch(error) {
        yield put({ type: UPDATE_USER_FAIL, error: 'Updating user fields failed' });
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

function* watchUpdateUser() {
    yield takeLatest(UPDATE_USER, updateUser)
}

function* watchInvite() {
    yield takeLatest(INVITE, invite)
}

export default function* authSaga() {
  yield all([
    watchLogin(),
    watchLogout(),
    watchRegister(),
    watchUpdateUser(),
    watchInvite()
  ]);
}
