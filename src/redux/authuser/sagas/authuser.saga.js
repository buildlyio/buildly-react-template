import {
  put, takeLatest, all, call,
} from 'redux-saga/effects';
import { httpService } from '@modules/http/http.service';
import { oauthService } from '@modules/oauth/oauth.service';
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
  LOAD_ALL_ORGS,
  LOAD_ALL_ORGS_SUCCESS,
  LOAD_ALL_ORGS_FAILURE,
  LOAD_ORG_NAMES,
  LOAD_ORG_NAMES_SUCCESS,
  LOAD_ORG_NAMES_FAILURE,
  GET_ORG_TYPES,
  GET_ORG_TYPES_SUCCESS,
  GET_ORG_TYPES_FAILURE,
  ADD_ORG_TYPE,
  ADD_ORG_TYPE_SUCCESS,
  ADD_ORG_TYPE_FAILURE,
  EDIT_ORG_TYPE,
  EDIT_ORG_TYPE_SUCCESS,
  EDIT_ORG_TYPE_FAILURE,
  DELETE_ORG_TYPE,
  DELETE_ORG_TYPE_SUCCESS,
  DELETE_ORG_TYPE_FAILURE,
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
      `${window.env.API_URL}coreuser/me/`,
    );
    yield call(oauthService.setOauthUser, user, payload);
    const coreuser = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}coreuser/`,
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
      `${window.env.API_URL}coreuser/me/`,
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
      `${window.env.API_URL}coreuser/`,
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
      `${window.env.API_URL}organization/${uuid}/`,
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
      `${window.env.API_URL}coreuser/reset_password/`,
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
      `${window.env.API_URL}coreuser/reset_password_confirm/`,
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
      `${window.env.API_URL}coreuser/reset_password_check/`,
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
      `${window.env.API_URL}organization/${payload.data.organization_uuid}/`,
      payload.data,
    );
    const user = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}coreuser/me/`,
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

function* loadAllOrganizations() {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}organization/`,
    );
    yield put({ type: LOAD_ALL_ORGS_SUCCESS, allOrgs: data.data });
  } catch (error) {
    yield put({ type: LOAD_ALL_ORGS_FAILURE, error });
  }
}

function* loadOrganizationNames() {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}organization/fetch_orgs/`,
    );
    yield put({ type: LOAD_ORG_NAMES_SUCCESS, orgNames: data.data });
  } catch (error) {
    yield put({ type: LOAD_ORG_NAMES_FAILURE, error });
  }
}

function* getOrgTypes() {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}organization_type/`,
    );
    yield put({ type: GET_ORG_TYPES_SUCCESS, orgTypes: data.data });
  } catch (error) {
    yield put({ type: GET_ORG_TYPES_FAILURE, error });
  }
}

function* addOrgType(payload) {
  const { data } = payload;
  try {
    const response = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}organization_type/`,
      data,
    );
    yield put({ type: ADD_ORG_TYPE_SUCCESS, orgType: response.data });
  } catch (error) {
    yield put({ type: ADD_ORG_TYPE_FAILURE, error });
  }
}

function* editOrgType(payload) {
  const { data } = payload;
  try {
    const response = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}organization_type/${data.id}/`,
      data,
    );
    yield put({ type: EDIT_ORG_TYPE_SUCCESS, orgType: response.data });
  } catch (error) {
    yield put({ type: EDIT_ORG_TYPE_FAILURE, error });
  }
}

function* deleteOrgType(payload) {
  const { id } = payload;
  try {
    const response = yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}organization_type/${id}`,
    );
    yield put({ type: DELETE_ORG_TYPE_SUCCESS, id });
  } catch (error) {
    yield put({ type: DELETE_ORG_TYPE_FAILURE, error });
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

function* watchLoadAllOrganizations() {
  yield takeLatest(LOAD_ALL_ORGS, loadAllOrganizations);
}

function* watchLoadOrganizationNames() {
  yield takeLatest(LOAD_ORG_NAMES, loadOrganizationNames);
}

function* watchGetOrgTypes() {
  yield takeLatest(GET_ORG_TYPES, getOrgTypes);
}

function* watchAddOrgType() {
  yield takeLatest(ADD_ORG_TYPE, addOrgType);
}

function* watchEditOrgType() {
  yield takeLatest(EDIT_ORG_TYPE, editOrgType);
}

function* watchDeleteOrgType() {
  yield takeLatest(DELETE_ORG_TYPE, deleteOrgType);
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
    watchLoadAllOrganizations(),
    watchLoadOrganizationNames(),
    watchGetOrgTypes(),
    watchAddOrgType(),
    watchEditOrgType(),
    watchDeleteOrgType(),
  ]);
}
