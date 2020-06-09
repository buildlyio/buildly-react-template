import {
  ADD_CUSTODIANS,
  ADD_CUSTODIANS_SUCCESS,
  ADD_CUSTODIANS_FAILURE,
  GET_CUSTODIANS,
  GET_CUSTODIANS_FAILURE,
  GET_CUSTODIANS_SUCCESS,
  EDIT_CUSTODIANS,
  EDIT_CUSTODIANS_SUCCESS,
  EDIT_CUSTODIANS_FAILURE,
  DELETE_CUSTODIANS,
  DELETE_CUSTODIANS_FAILURE,
  DELETE_CUSTODIANS_SUCCESS,
  SEARCH,
  SEARCH_SUCCESS,
  searchCustodianSuccess,
  GET_CUSTODIAN_TYPE_SUCCESS,
  GET_CUSTODIAN_TYPE_FAILURE,
  GET_CUSTODIAN_TYPE,
  GET_CONTACT,
  GET_CONTACT_SUCCESS,
  GET_CONTACT_FAILURE,
} from "../actions/custodian.actions";
import { put, takeLatest, all, call } from "redux-saga/effects";
import { oauthService } from "../../../modules/oauth/oauth.service";
import { httpService } from "../../../modules/http/http.service";
import { environment } from "environment";
import { routes } from "../../../routes/routesConstants";
import { showAlert } from "../../alert/actions/alert.actions";

const custodainEnvironment = window.environment || {
  API_URL: "http://localhost:8083/",
  OAUTH_CLIENT_ID: "wkXLlC9h3k0jxIx7oLllxpFVU89Dxgi7O8FYZyfX",
  OAUTH_TOKEN_URL: "http://localhost:8080/oauth/token/",
  production: false,
};

function* getCustodians() {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${custodainEnvironment.API_URL}custodian/`,
      null,
      true
    );
    console.log("data", data);
    yield [yield put({ type: GET_CUSTODIANS_SUCCESS, data: data.data })];
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't load data due to some error!",
        })
      ),
      yield put({
        type: GET_CUSTODIANS_FAILURE,
        error: error,
      }),
    ];
  }
}

function* getCustodianType() {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${custodainEnvironment.API_URL}custodian_type/`,
      null,
      true
    );
    yield [
      yield put({
        type: GET_CUSTODIAN_TYPE_SUCCESS,
        data: data.data,
      }),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't load data due to some error!",
        })
      ),
      yield put({
        type: GET_CUSTODIAN_TYPE_FAILURE,
        error: error,
      }),
    ];
  }
}

function* deleteCustodian(payload) {
  let { custodianId } = payload;
  try {
    const response = yield call(
      httpService.makeRequest,
      "delete",
      `${custodainEnvironment.API_URL}custodian/${custodianId}/`,
      {},
      true
    );
    if (response) {
      const data = yield call(
        httpService.makeRequest,
        "get",
        `${custodainEnvironment.API_URL}custodian/`,
        null,
        true
      );
      yield [
        yield put({ type: DELETE_CUSTODIANS_SUCCESS, data: data.data }),
        yield put(
          showAlert({
            type: "success",
            open: true,
            message: "Custodian deleted successfully!",
          })
        ),
      ];
    }
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't delete Custodian!",
        })
      ),
      yield put({
        type: DELETE_CUSTODIANS_FAILURE,
        error: error,
      }),
    ];
  }
}

function* editCustodian(action) {
  let { payload, history } = action;
  try {
    yield call(
      httpService.makeRequest,
      "put",
      `${custodainEnvironment.API_URL}custodian/${payload.id}`,
      { payload },
      true
    );
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${custodainEnvironment.API_URL}custodian/`,
      null,
      true
    );
    yield [
      yield put({ type: EDIT_CUSTODIANS_SUCCESS, data: data.data }),
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Custodian edited successfully!",
        })
      ),
      yield call(history.push, routes.CUSTODIANS),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't edit Custodian!",
        })
      ),
      yield put({
        type: EDIT_CUSTODIANS_FAILURE,
        error: error,
      }),
    ];
  }
}

function* addCustodian(action) {
  let { history, payload } = action;
  try {
    yield call(
      httpService.makeRequest,
      "post",
      `${custodainEnvironment.API_URL}custodian/`,
      payload,
      true
    );
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${custodainEnvironment.API_URL}custodian/`,
      null,
      true
    );
    yield [
      yield put({ type: ADD_CUSTODIANS_SUCCESS, data: data.data }),
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Successfully Added Custodian",
        })
      ),
      yield call(history.push, routes.CUSTODIANS),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Custodian Not Created!",
        })
      ),
      yield put({
        type: ADD_CUSTODIANS_FAILURE,
        error: error,
      }),
    ];
  }
}

function* searchCustodian(payload) {
  let resultArr = [];
  try {
    resultArr = payload.searchList.filter((item) => {
      return item.name.includes(payload.searchItem);
    });

    yield [yield put({ type: SEARCH_SUCCESS, resultArr })];
  } catch (error) {
    // yield put({ type: UPDATE_USER_FAIL, error: "Updating user fields failed" });
  }
}

function* getContactInfo() {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${custodainEnvironment.API_URL}contact/`,
      null,
      true
    );
    yield [yield put({ type: GET_CONTACT_SUCCESS, data: data.data })];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't load contact info!",
        })
      ),
      yield put({
        type: GET_CONTACT_FAILURE,
        error: error,
      }),
    ];
  }
}

function* watchGetCustodian() {
  yield takeLatest(GET_CUSTODIANS, getCustodians);
}

function* watchSearchCustodian() {
  yield takeLatest(SEARCH, searchCustodian);
}

function* watchGetCustodianType() {
  yield takeLatest(GET_CUSTODIAN_TYPE, getCustodianType);
}

function* watchAddCustodian() {
  yield takeLatest(ADD_CUSTODIANS, addCustodian);
}

function* watchDeleteCustodian() {
  yield takeLatest(DELETE_CUSTODIANS, deleteCustodian);
}

function* watchEditCustodian() {
  yield takeLatest(EDIT_CUSTODIANS, editCustodian);
}

function* watchGetContact() {
  yield takeLatest(GET_CONTACT, getContactInfo);
}

export default function* custodianSaga() {
  yield all([
    watchSearchCustodian(),
    watchGetCustodian(),
    watchGetCustodianType(),
    watchAddCustodian(),
    watchDeleteCustodian(),
    watchEditCustodian(),
    watchGetContact(),
  ]);
}
