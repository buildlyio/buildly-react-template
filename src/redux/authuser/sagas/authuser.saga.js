import {
  put, takeLatest, all, call,
} from 'redux-saga/effects';
import { httpService } from '@modules/http/http.service';
import { oauthService } from '@modules/oauth/oauth.service';
import { environment } from '@environments/environment';
import { showAlert } from '@redux/alert/actions/alert.actions';
import { routes } from '@routes/routesConstants';
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
  INVITE_SUCCESS,
  GET_USER_SUCCESS,
  GET_USER,
  GET_USER_FAIL,
  GET_ORGANIZATION,
  GET_ORGANIZATION_FAILURE,
  GET_ORGANIZATION_SUCCESS,
  RESET_PASSWORD,
  RESET_PASSWORD_CONFIRM,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_CONFIRM_SUCCESS,
  RESET_PASSWORD_CONFIRM_FAILURE,
  RESET_PASSWORD_CHECK,
  RESET_PASSWORD_CHECK_SUCCESS,
  RESET_PASSWORD_CHECK_FAILURE,
  UPDATE_ORGANIZATION,
  UPDATE_ORGANIZATION_SUCCESS,
  UPDATE_ORGANIZATION_FAILURE,
} from '@redux/authuser/actions/authuser.actions';

function* logout() {
  try {
    yield call(oauthService.logout);
    yield put({ type: LOGOUT_SUCCESS });
  } catch (error) {
    yield put({ type: LOGOUT_FAIL });
  }
}

function* login(payload) {
  const { history } = payload;
  try {
    const token = yield call(
      oauthService.authenticateWithPasswordFlow,
      payload.credentials,
    );
    yield call(oauthService.setAccessToken, token.data);
    const user = yield call(
      httpService.makeRequest,
      'get',
      `${environment.API_URL}coreuser/me/`,
    );
    yield call(oauthService.setOauthUser, user, payload);
    const coreuser = yield call(
      httpService.makeRequest,
      'get',
      `${environment.API_URL}coreuser/`,
    );
    yield call(oauthService.setCurrentCoreUser, coreuser, user);
    yield [
      yield put({ type: LOGIN_SUCCESS, user }),
      yield call(history.push, routes.SHIPMENT),
    ];
  } catch (error) {
    yield [
      yield put({
        type: LOGIN_FAIL,
        error: 'Invalid credentials given',
      }),
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Sign in failed',
        }),
      ),
    ];
  }
}

function* getUserDetails() {
  try {
    const user = yield call(
      httpService.makeRequest,
      'get',
      `${environment.API_URL}coreuser/me/`,
    );
    yield put({ type: GET_USER_SUCCESS, user });
    if (user && user.data && user.data.organization) {
      yield put({
        type: GET_ORGANIZATION,
        uuid: user.data.organization.organization_uuid,
      });
    }
  } catch (error) {
    yield [
      yield put({
        type: GET_USER_FAIL,
        error: 'Error loading user data',
      }),
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error loading user data',
        }),
      ),
    ];
  }
}

function* register(payload) {
  const { history } = payload;
  try {
    const user = yield call(
      httpService.makeRequest,
      'post',
      `${environment.API_URL}coreuser/`,
      payload.data,
    );
    yield [
      yield put({ type: REGISTER_SUCCESS, user }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Registration was successful',
        }),
      ),
      yield call(history.push, routes.LOGIN),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Registration failed',
        }),
      ),
      yield put({
        type: REGISTER_FAIL,
        error: 'Registration failed',
      }),
    ];
  }
}

function* invite(payload) {
  try {
    const user = yield call(
      httpService.makeRequest,
      'post',
      `${environment.API_URL}coreuser/invite/`,
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
    const response = yield call(
      httpService.makeRequest,
      'patch',
      `${environment.API_URL}coreuser/${payload.data.id}/update_profile/`,
      payload.data,
    );
    const data = yield call(
      httpService.makeRequest,
      'patch',
      `${environment.API_URL}organization/${payload.data.organization_uuid}/`,
      { name: payload.data.organization_name },
    );
    const user = yield call(
      httpService.makeRequest,
      'get',
      `${environment.API_URL}coreuser/me/`,
    );
    yield call(oauthService.setOauthUser, user);
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

function* getOrganizationData(payload) {
  const { uuid } = payload;
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${environment.API_URL}organization/${uuid}/`,
      null,
      true,
    );
    yield put({ type: GET_ORGANIZATION_SUCCESS, data });
  } catch (error) {
    yield put({ type: GET_ORGANIZATION_FAILURE, error });
  }
}

function* resetPassword(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${environment.API_URL}coreuser/reset_password/`,
      payload.data,
    );
    if (data.data && data.data.count > 0) {
      yield [
        yield put({ type: RESET_PASSWORD_SUCCESS, data: data.data }),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: data.data.detail,
          }),
        ),
      ];
    } else {
      yield [
        yield put(
          showAlert({
            type: 'error',
            open: true,
            message: 'The email address entered does not exist',
          }),
        ),
        yield put({
          type: RESET_PASSWORD_FAILURE,
          error: 'The email address entered does not exist',
        }),
      ];
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Email could not be sent',
        }),
      ),
      yield put({
        type: RESET_PASSWORD_FAILURE,
        error: 'Email could not be sent',
      }),
    ];
  }
}

function* resetPasswordConfirm(payload) {
  const { history } = payload;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${environment.API_URL}coreuser/reset_password_confirm/`,
      payload.data,
    );
    yield [
      yield put({
        type: RESET_PASSWORD_CONFIRM_SUCCESS,
        data: data.data,
      }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: data.data.detail,
        }),
      ),
      yield call(history.push, routes.LOGIN),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Password reset failed',
        }),
      ),
      yield put({
        type: RESET_PASSWORD_CONFIRM_FAILURE,
        error: 'Password reset failed',
      }),
    ];
  }
}

function* resetPasswordCheck(payload) {
  const { history } = payload;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${environment.API_URL}coreuser/reset_password_check/`,
      payload.data,
    );
    if (data.data && data.data.success) {
      yield [
        yield put({
          type: RESET_PASSWORD_CHECK_SUCCESS,
          data: data.data,
        }),
        yield call(
          history.push,
          `${routes.RESET_PASSWORD_CONFIRM}/${payload.data.uid}/${payload.data.token}/`,
        ),
      ];
    } else {
      yield [
        yield put(
          showAlert({
            type: 'error',
            open: true,
            message: 'Invalid ID or token. Try resending the link to your email',
          }),
        ),
        yield put({
          type: RESET_PASSWORD_CHECK_FAILURE,
          error: 'Invalid ID or token. Try resending the link to your email',
        }),
        yield call(history.push, routes.LOGIN),
      ];
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Password reset failed',
        }),
      ),
      yield put({
        type: RESET_PASSWORD_CHECK_FAILURE,
        error: 'Password reset failed',
      }),
    ];
  }
}

function* updateOrganizationData(payload) {
  try {
    const org = yield call(
      httpService.makeRequest,
      'patch',
      `${environment.API_URL}organization/${payload.data.organization_uuid}/`,
      payload.data,
    );
    const user = yield call(
      httpService.makeRequest,
      'get',
      `${environment.API_URL}coreuser/me/`,
    );
    yield call(oauthService.setOauthUser, user);
    yield [
      yield put({ type: UPDATE_ORGANIZATION_SUCCESS, user, org }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Organization setting updated successfully',
        }),
      ),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: "Couldn't update Organization settings due to some error!",
        }),
      ),
      yield put({
        type: UPDATE_ORGANIZATION_FAILURE,
        error: "Couldn't update Organization settings due to some error!",
      }),
    ];
  }
}

function* watchResetPasswordCheck() {
  yield takeLatest(RESET_PASSWORD_CHECK, resetPasswordCheck);
}

function* watchResetPassword() {
  yield takeLatest(RESET_PASSWORD, resetPassword);
}

function* watchConfirmResetPassword() {
  yield takeLatest(RESET_PASSWORD_CONFIRM, resetPasswordConfirm);
}

function* watchLogout() {
  yield takeLatest(LOGOUT, logout);
}

function* watchLogin() {
  yield takeLatest(LOGIN, login);
}

function* watchRegister() {
  yield takeLatest(REGISTER, register);
}

function* watchUpdateUser() {
  yield takeLatest(UPDATE_USER, updateUser);
}

function* watchInvite() {
  yield takeLatest(INVITE, invite);
}

function* watchGetUser() {
  yield takeLatest(GET_USER, getUserDetails);
}

function* watchGetOrganization() {
  yield takeLatest(GET_ORGANIZATION, getOrganizationData);
}

function* watchUpdateOrganization() {
  yield takeLatest(UPDATE_ORGANIZATION, updateOrganizationData);
}

export default function* authSaga() {
  yield all([
    watchLogin(),
    watchLogout(),
    watchRegister(),
    watchUpdateUser(),
    watchInvite(),
    watchGetUser(),
    watchGetOrganization(),
    watchResetPassword(),
    watchConfirmResetPassword(),
    watchResetPasswordCheck(),
    watchUpdateOrganization(),
  ]);
}
