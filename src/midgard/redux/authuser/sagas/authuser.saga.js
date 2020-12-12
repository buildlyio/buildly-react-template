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
} from "midgard/redux/actions/authuser.actions";
import { put, takeLatest, all, call } from "redux-saga/effects";
import { oauthService } from "midgard/modules/oauth/oauth.service";
import { httpService } from "midgard/modules/http/http.service";
import { environment } from "environment";
import { showAlert } from "midgard/redux/alert/actions/alert.actions";
import { routes } from "midgard/routes/routesConstants";

function* logout() {
  try {
    yield call(oauthService.logout);
    yield [yield put({ type: LOGOUT_SUCCESS })];
  } catch (error) {
    console.log("error", error);
    yield put({ type: LOGOUT_FAIL });
  }
}

function* login(payload) {
  let { history } = payload;
  try {
    const token = yield call(
      oauthService.authenticateWithPasswordFlow,
      payload.credentials
    );
    yield call(oauthService.setAccessToken, token.data);
    const user = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}coreuser/me/`
    );
    yield call(oauthService.setOauthUser, user, payload);
    const coreuser = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}coreuser/`
    );
    yield call(oauthService.setCurrentCoreUser, coreuser, user);
    yield [
      yield put({ type: LOGIN_SUCCESS, user }),
      yield call(history.push, routes.DASHBOARD),
    ];
  } catch (error) {
    console.log("error", error);
    yield [
      yield put({ type: LOGIN_FAIL, error: "Invalid credentials given" }),
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Sign in failed",
        })
      ),
    ];
  }
}

function* getUserDetails() {
  try {
    const user = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}coreuser/me/`
    );
    yield put({ type: GET_USER_SUCCESS, user });
    if (user && user.data && user.data.organization) {
      yield put(getOrganization(user.data.organization.organization_uuid));
    }
  } catch (error) {
    yield [
      yield put({ type: GET_USER_FAIL, error: "Error loading user data" }),
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Error loading user data",
        })
      ),
    ];
  }
}

function* register(payload) {
  let { history } = payload;
  try {
    const user = yield call(
      httpService.makeRequest,
      "post",
      `${environment.API_URL}coreuser/`,
      payload.data
    );
    yield [
      yield put({ type: REGISTER_SUCCESS, user }),
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Registration was successful",
        })
      ),
      yield call(history.push, routes.LOGIN),
    ];
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Registration failed",
        })
      ),
      yield put({ type: REGISTER_FAIL, error: "Registration failed" }),
    ];
  }
}

function* sendPasswordResetLink(payload) {
  let { history } = payload;
  try {
    const response = yield call(
      httpService.makeRequest,
      "post",
      `${environment.API_URL}coreuser/reset_password/`,
      payload.data
    );
    if (response.data && response.data.count) {
      yield [
        yield put({ type: SEND_PASSWORD_RESET_LINK_SUCCESS, data: response.data }),
        yield put(
          showAlert({
            type: "success",
            open: true,
            message: response.data.detail,
          })
        ),
        // yield call(history.push, routes.LOGIN),
      ];
    } else {
      yield [
        yield put(
          showAlert({
            type: "error",
            open: true,
            message: "The email address entered does not exist",
          })
        ),
        yield put({
          type: SEND_PASSWORD_RESET_LINK_FAIL,
          error: "The email address entered does not exist",
        }),
      ];
    }
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Email could not be sent",
        })
      ),
      yield put({
        type: SEND_PASSWORD_RESET_LINK_FAIL,
        error: "Email could not be sent",
      }),
    ];
  }
}

function* validateResetPasswordToken(payload) {
  let { history } = payload;
  try {
    const data = yield call(
      httpService.makeRequest,
      "post",
      `${environment.API_URL}coreuser/reset_password_check/`,
      payload.data
    );
    if (data.data && data.data.success) {
      yield [
        yield put({ type: VALIDATE_RESET_PASSWORD_TOKEN_SUCCESS, data: data.data }),
        yield call(
          history.push,
          `${routes.RESET_PASSWORD}/${payload.data.uid}/${payload.data.token}/`
        ),
      ];
    } else {
      yield [
        yield put(
          showAlert({
            type: "error",
            open: true,
            message: "Invalid ID or token. Try sending resending the link to your email",
          })
        ),
        yield put({
          type: VALIDATE_RESET_PASSWORD_TOKEN_FAIL,
          error: "Invalid ID or token. Try sending resending the link to your email",
        }),
        yield call(history.push, routes.LOGIN),
      ];
    }
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Password reset failed",
        })
      ),
      yield put({
        type: VALIDATE_RESET_PASSWORD_TOKEN_FAIL,
        error: "Password reset failed",
      }),
    ];
  }
}

function* resetPassword(payload) {
  let { history } = payload;
  try {
    const data = yield call(
      httpService.makeRequest,
      "post",
      `${environment.API_URL}coreuser/reset_password_confirm/`,
      payload.data
    );
    console.log("data", data);
    yield [
      yield put({ type: RESET_PASSWORD_SUCCESS, data: data.data }),
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: data.data.detail,
        })
      ),
      yield call(history.push, routes.LOGIN),
    ];
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Password reset failed",
        })
      ),
      yield put({
        type: RESET_PASSWORD_FAIL,
        error: "Password reset failed",
      }),
    ];
  }
}

function* invite(payload) {
  try {
    const user = yield call(
      httpService.makeRequest,
      "post",
      `${environment.API_URL}coreuser/invite/`,
      payload.data
    );
    yield [
      yield put({ type: INVITE_SUCCESS, user }),
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Invitations sent successfully",
        })
      ),
    ];
  } catch (error) {
    yield put({
      type: INVITE_FAIL,
      error: "One or more email address is invalid",
    });
  }
}

function* updateUser(payload) {
  try {
    const user = yield call(
      httpService.makeRequest,
      "patch",
      `${environment.API_URL}coreuser/${payload.data.id}/`,
      payload.data
    );
    const data = yield call(
      httpService.makeRequest,
      "put",
      `${environment.API_URL}organization/${payload.data.organization_uuid}/`,
      { name: payload.data.organization_name }
    );
    yield [
      yield put({ type: UPDATE_USER_SUCCESS, user }),
      yield put({ type: GET_ORGANIZATION_SUCCESS, data }),
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Account details successfully updated",
        })
      ),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Unable to update user details",
        })
      ),
      yield put({
        type: UPDATE_USER_FAIL,
        error: "Unable to update user details",
      }),
    ];
  }
}

function* getOrganizationData(payload) {
  let { uuid } = payload;
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}organization/${uuid}/`,
      null,
      true
    );
    yield put({ type: GET_ORGANIZATION_SUCCESS, data });
  } catch (error) {
    yield put({ type: GET_ORGANIZATION_FAILURE, error });
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
  ]);
}
