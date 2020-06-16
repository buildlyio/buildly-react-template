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
  getOrganization,
} from "../actions/authuser.actions";
import { put, takeLatest, all, call } from "redux-saga/effects";
import { oauthService } from "../../../modules/oauth/oauth.service";
import { httpService } from "../../../modules/http/http.service";
import { environment } from "environment";
import { showAlert } from "../../alert/actions/alert.actions";
import { routes } from "../../../routes/routesConstants";

function* logout() {
  try {
    yield call(oauthService.logout);
    yield [
      yield put({ type: LOGOUT_SUCCESS }),
      yield put({ type: GET_ORGANIZATION_SUCCESS, data: null }),
    ];
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
    const coreUser = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}coreuser/`
    );
    yield call(oauthService.setCurrentCoreUser, coreUser, user);
    if (user && user.data && user.data.organization) {
      yield put(getOrganization(user.data.organization.organization_uuid));
    }
    yield [
      // yield put({ type: LOGIN_SUCCESS, user }),
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
          message: "Login Failed!",
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
  } catch (error) {
    yield [
      yield put({ type: GET_USER_FAIL, error: "Error in loading user data" }),
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Error in loading user data",
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
          message: "Successfully Registered",
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
          message: "Registration Failed!",
        })
      ),
      yield put({ type: REGISTER_FAIL, error: "Registration failed" }),
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
    yield [yield put({ type: INVITE_SUCCESS, user })];
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
      "put",
      `${environment.API_URL}coreuser/${payload.data.id}/`,
      payload.data
    );
    yield call(
      httpService.makeRequest,
      "put",
      `${environment.API_URL}organization/${payload.data.organization_uuid}/`,
      { name: payload.data.organization_name }
    );
    yield [
      yield put({ type: UPDATE_USER_SUCCESS, user }),
      yield put(getOrganization()),
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Successfully Updated Details",
        })
      ),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Failed to update Details",
        })
      ),
      yield put({
        type: UPDATE_USER_FAIL,
        error: "Updating user fields failed",
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
    watchRegister(),
    watchUpdateUser(),
    watchInvite(),
    watchGetUser(),
    watchGetOrganization(),
  ]);
}
