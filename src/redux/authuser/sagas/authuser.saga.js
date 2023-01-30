import _ from 'lodash';
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
  SEND_PASSWORD_RESET_LINK,
  SEND_PASSWORD_RESET_LINK_SUCCESS,
  SEND_PASSWORD_RESET_LINK_FAIL,
  VALIDATE_RESET_PASSWORD_TOKEN,
  VALIDATE_RESET_PASSWORD_TOKEN_SUCCESS,
  VALIDATE_RESET_PASSWORD_TOKEN_FAIL,
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
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
  getOrganization,
  SOCIAL_LOGIN,
  SOCIAL_LOGIN_SUCCESS,
  SOCIAL_LOGIN_FAIL,
  LOAD_ORG_NAMES,
  LOAD_ORG_NAMES_SUCCESS,
  LOAD_ORG_NAMES_FAILURE,
  loadOrgNames,
  ADD_ORG_SOCIAL_USER,
  ADD_ORG_SOCIAL_USER_SUCCESS,
  ADD_ORG_SOCIAL_USER_FAIL,
  VERIFY_EMAIL,
  VERIFY_EMAIL_SUCCESS,
  VERIFY_EMAIL_FAIL,
  LOAD_STRIPE_PRODUCTS,
  LOAD_STRIPE_PRODUCTS_SUCCESS,
  LOAD_STRIPE_PRODUCTS_FAIL,
} from '@redux/authuser/actions/authuser.actions';
import {
  put, takeLatest, all, call,
} from 'redux-saga/effects';
import { oauthService } from '@modules/oauth/oauth.service';
import { httpService } from '@modules/http/http.service';
import { showAlert } from '@redux/alert/actions/alert.actions';
import { routes } from '@routes/routesConstants';
import { providers } from '@utils/socialLogin';

function* logout() {
  try {
    yield call(oauthService.logout);
    yield [yield put({ type: LOGOUT_SUCCESS })];
  } catch (error) {
    console.log('error', error);
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
      yield call(history.push, routes.DASHBOARD),
    ];
  } catch (error) {
    console.log('error', error);
    yield [
      yield put({ type: LOGIN_FAIL, error: 'Not approved or Invalid credentials given' }),
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Either your account is not approved or you provided invalid username/password.',
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
      yield put(getOrganization(user.data.organization.organization_uuid));
    }
  } catch (error) {
    yield [
      yield put({ type: GET_USER_FAIL, error: 'Error loading user data' }),
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
    yield put({ type: REGISTER_SUCCESS, user });
    if (user && user.data) {
      yield [
        yield call(history.push, routes.LOGIN),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Please verify the email address to access the platform.',
          }),
        ),
      ];
    }
  } catch (error) {
    console.log('error', error);
    const message = error && error.response && error.response.data
      ? _.map(error.response.data, (value) => `${value[0]}`)
      : 'Registration failed';

    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message,
        }),
      ),
      yield put({ type: REGISTER_FAIL, error: message }),
    ];
  }
}

function* sendPasswordResetLink(payload) {
  const { history } = payload;
  try {
    const response = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}coreuser/reset_password/`,
      payload.data,
    );
    if (response.data && response.data.count) {
      yield [
        yield put({
          type: SEND_PASSWORD_RESET_LINK_SUCCESS,
          data: response.data,
        }),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: response.data.detail,
          }),
        ),
        // yield call(history.push, routes.LOGIN),
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
          type: SEND_PASSWORD_RESET_LINK_FAIL,
          error: 'The email address entered does not exist',
        }),
      ];
    }
  } catch (error) {
    console.log('error', error);
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Password reset email could not be sent',
        }),
      ),
      yield put({
        type: SEND_PASSWORD_RESET_LINK_FAIL,
        error: 'Password reset email could not be sent',
      }),
    ];
  }
}

function* validateResetPasswordToken(payload) {
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
          type: VALIDATE_RESET_PASSWORD_TOKEN_SUCCESS,
          data: data.data,
        }),
        yield call(
          history.push,
          `${routes.RESET_PASSWORD}/${payload.data.uid}/${payload.data.token}/`,
        ),
      ];
    } else {
      yield [
        yield put(
          showAlert({
            type: 'error',
            open: true,
            message:
              'Invalid ID or token. Try sending resending the link to your email',
          }),
        ),
        yield put({
          type: VALIDATE_RESET_PASSWORD_TOKEN_FAIL,
          error:
            'Invalid ID or token. Try sending resending the link to your email',
        }),
        yield call(history.push, routes.LOGIN),
      ];
    }
  } catch (error) {
    console.log('error', error);
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Password reset failed',
        }),
      ),
      yield put({
        type: VALIDATE_RESET_PASSWORD_TOKEN_FAIL,
        error: 'Password reset failed',
      }),
    ];
  }
}

function* resetPassword(payload) {
  const { history } = payload;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}coreuser/reset_password_confirm/`,
      payload.data,
    );
    console.log('data', data);
    yield [
      yield put({ type: RESET_PASSWORD_SUCCESS, data: data.data }),
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
    console.log('error', error);
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Password reset failed',
        }),
      ),
      yield put({
        type: RESET_PASSWORD_FAIL,
        error: 'Password reset failed',
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
  const { data } = payload;
  try {
    const profile = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}coreuser/${data.id}/update_profile/`,
      data,
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

function* socialLogin(payload) {
  const { code, history, provider } = payload;
  let url;
  switch (provider) {
    case providers.github:
      url = `${window.env.API_URL}oauth/complete/github/?code=${code}`;
      break;

    default:
      break;
  }

  try {
    const token = yield call(httpService.makeRequest, 'get', url);
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
      yield put(loadOrgNames()),
      yield put({ type: SOCIAL_LOGIN_SUCCESS, user }),
    ];

    if (!user.data.email || !user.data.organization || !user.data.user_type) {
      yield call(history.push, routes.MISSING_DATA);
    } else {
      yield call(history.push, routes.DASHBOARD);
    }
  } catch (error) {
    yield [
      yield put({
        type: SOCIAL_LOGIN_FAIL,
        error: `Social Login via ${provider} failed`,
      }),
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: `Sign in using ${provider} failed`,
        }),
      ),
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
      null,
      true,
    );
    yield put({ type: GET_ORGANIZATION_SUCCESS, data });
  } catch (error) {
    yield put({ type: GET_ORGANIZATION_FAILURE, error });
  }
}

function* loadOrganizationNames() {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}organization/names/`,
    );
    yield put({ type: LOAD_ORG_NAMES_SUCCESS, orgNames: data.data });
  } catch (error) {
    yield put({ type: LOAD_ORG_NAMES_FAILURE, error });
  }
}

function* addOrgSocialUser(payload) {
  const { data, existingOrg, history } = payload;
  try {
    const user = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}coreuser/update_org/${data.id}/`,
      data,
    );
    yield call(oauthService.setOauthUser, user, payload);
    const coreuser = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}coreuser/`,
    );
    yield call(oauthService.setCurrentCoreUser, coreuser, user);
    yield put({ type: ADD_ORG_SOCIAL_USER_SUCCESS, user });

    if (existingOrg) {
      yield [
        yield put({ type: LOGOUT }),
        yield call(history.push, '/'),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: `Added to Org ${_.capitalize(
              user.data.organization.name,
            )}. You need to be approved by Org Admin to access the platform.`,
          }),
        ),
      ];
    } else if (!existingOrg && data.organization_name !== 'default organization') {
      yield [
        yield call(history.push, routes.DASHBOARD),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: `Created new Org ${_.capitalize(
              user.data.organization.name,
            )} with you as Admin.`,
          }),
        ),
      ];
    }
  } catch (error) {
    console.log('error', error);

    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Unable to update user details',
        }),
      ),
      yield put({
        type: ADD_ORG_SOCIAL_USER_FAIL,
        error: 'Unable to update user details. Please try again.',
      }),
    ];
  }
}

function* verifyEmail(payload) {
  const { history, data } = payload;
  try {
    const user = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}coreuser/verify_email/`,
      data,
    );
    if (user && user.data && user.data.success) {
      yield put({ type: VERIFY_EMAIL_SUCCESS });
      yield call(history.push, routes.LOGIN);
    }
  } catch (error) {
    yield put({ type: VERIFY_EMAIL_FAIL, error });
  }
}

function* loadStripeProducts() {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}subscription/stripe_products/`,
    );
    yield put({ type: LOAD_STRIPE_PRODUCTS_SUCCESS, stripeProducts: data.data });
  } catch (error) {
    yield put({ type: LOAD_STRIPE_PRODUCTS_FAIL, error });
  }
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

function* watchSendResetPasswordLink() {
  yield takeLatest(SEND_PASSWORD_RESET_LINK, sendPasswordResetLink);
}

function* watchValidateResetPasswordToken() {
  yield takeLatest(VALIDATE_RESET_PASSWORD_TOKEN, validateResetPasswordToken);
}

function* watchResetPassword() {
  yield takeLatest(RESET_PASSWORD, resetPassword);
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

function* watchSocialLogin() {
  yield takeLatest(SOCIAL_LOGIN, socialLogin);
}

function* watchLoadOrganizationNames() {
  yield takeLatest(LOAD_ORG_NAMES, loadOrganizationNames);
}

function* watchAddOrgSocialUser() {
  yield takeLatest(ADD_ORG_SOCIAL_USER, addOrgSocialUser);
}

function* watchVerifyEmail() {
  yield takeLatest(VERIFY_EMAIL, verifyEmail);
}

function* watchLoadStripeProducts() {
  yield takeLatest(LOAD_STRIPE_PRODUCTS, loadStripeProducts);
}

export default function* authSaga() {
  yield all([
    watchLogin(),
    watchLogout(),
    watchSendResetPasswordLink(),
    watchValidateResetPasswordToken(),
    watchResetPassword(),
    watchRegister(),
    watchUpdateUser(),
    watchInvite(),
    watchGetUser(),
    watchGetOrganization(),
    watchSocialLogin(),
    watchLoadOrganizationNames(),
    watchAddOrgSocialUser(),
    watchVerifyEmail(),
    watchLoadStripeProducts(),
  ]);
}
