import {
  put, takeLatest, all, call,
} from 'redux-saga/effects';
import { httpService } from '../../../modules/http/http.service';
import { oauthService } from '../../../modules/oauth/oauth.service';
import { showAlert } from '../../alert/actions/alert.actions';
import {
  LOGOUT_SUCCESS,
  UPDATE_USER,
  UPDATE_USER_FAIL,
  UPDATE_USER_SUCCESS,
  INVITE,
  INVITE_FAIL,
  INVITE_SUCCESS,
  GET_ORGANIZATION_SUCCESS,
} from '../actions/authuser.actions';

function* invite(payload) {
  try {
    const user = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}coreuser/invite/`,
      payload.data,
    );
    yield [
      yield put({ type: INVITE_SUCCESS, user }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Invitations sent successfully',
        }),
      ),
    ];
  } catch (error) {
    yield put({
      type: INVITE_FAIL,
      error: 'One or more email address is invalid',
    });
  }
}

function* updateUser(payload) {
  try {
    const { history } = payload;
    const response = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}coreuser/${payload.data.id}/update_profile/`,
      payload.data,
    );
    const data = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}organization/${payload.data.organization_uuid}/`,
      { name: payload.data.organization_name },
    );
    const user = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}coreuser/me/`,
    );
    yield call(oauthService.setOauthUser, user);
    const coreuser = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}coreuser/`,
    );
    yield call(oauthService.setCurrentCoreUser, coreuser, user);
    if (history) {
      const route = window.location.pathname;
      yield put({ type: LOGOUT_SUCCESS });
      history.push('/');
      history.push(route);
    } else {
      yield [
        yield put({ type: UPDATE_USER_SUCCESS, user }),
        yield put({ type: GET_ORGANIZATION_SUCCESS, data }),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Account details successfully updated',
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
          message: 'Unable to update user details',
        }),
      ),
      yield put({
        type: UPDATE_USER_FAIL,
        error: 'Unable to update user details',
      }),
    ];
  }
}

function* watchUpdateUser() {
  yield takeLatest(UPDATE_USER, updateUser);
}

function* watchInvite() {
  yield takeLatest(INVITE, invite);
}

export default function* authSaga() {
  yield all([
    watchUpdateUser(),
    watchInvite(),
  ]);
}
