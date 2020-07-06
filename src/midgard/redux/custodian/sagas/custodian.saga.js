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
  getContact,
  getCustodians,
  GET_CUSTODY_SUCCESS,
  GET_CUSTODY_FAILURE,
  getCustody,
  ADD_CUSTODY_FAILURE,
  GET_CUSTODY,
  ADD_CUSTODY,
} from "../actions/custodian.actions";
import { put, takeLatest, all, call } from "redux-saga/effects";
import { oauthService } from "../../../modules/oauth/oauth.service";
import { httpService } from "../../../modules/http/http.service";
import { environment } from "environment";
import { routes } from "../../../routes/routesConstants";
import { showAlert } from "../../alert/actions/alert.actions";
import { searchFilter } from "../../../utils/utilMethods";

const custodiansApiEndPoint = "custodian/";

function* getCustodiansList() {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${custodiansApiEndPoint}custodian/`,
      null,
      true
    );
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
      `${environment.API_URL}${custodiansApiEndPoint}custodian_type/`,
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
  let { custodianId, contactObjId } = payload;
  try {
    yield call(
      httpService.makeRequest,
      "delete",
      `${environment.API_URL}${custodiansApiEndPoint}custodian/${custodianId}/`,
      null,
      true
    );
    yield call(
      httpService.makeRequest,
      "delete",
      `${environment.API_URL}custodian/contact/${contactObjId}/`,
      null,
      true
    );
    yield [
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Custodian deleted successfully!",
        })
      ),
      yield put(getCustodians()),
    ];
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Error in deleting CUstodian!",
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
  let { payload, history, redirectTo } = action;
  try {
    let contactData = yield call(
      httpService.makeRequest,
      "put",
      `${environment.API_URL}${custodiansApiEndPoint}contact/${payload.contact_obj.id}/`,
      payload.contact_obj,
      true
    );
    if (contactData && contactData.data) {
      let contactInfo = contactData.data.url;
      let custodianPayload = {
        name: payload.name,
        custodian_type: payload.custodian_type,
        contact_data: [contactInfo],
        id: payload.id,
      };
      let data = yield call(
        httpService.makeRequest,
        "put",
        `${environment.API_URL}${custodiansApiEndPoint}custodian/${payload.id}/`,
        custodianPayload,
        true
      );
      if (data && data.data) {
        yield [
          yield put(getCustodians()),
          yield put(getContact()),
          yield put(
            showAlert({
              type: "success",
              open: true,
              message: "Custodian successfully Edited!",
            })
          ),
          yield call(history.push, redirectTo),
        ];
      }
    }
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
  let { history, payload, redirectTo } = action;
  try {
    let contactData = yield call(
      httpService.makeRequest,
      "post",
      `${environment.API_URL}${custodiansApiEndPoint}contact/`,
      payload.contact_obj,
      true
    );
    if (contactData && contactData.data) {
      let contactInfo = contactData.data.url;
      let custodianPayload = {
        name: payload.name,
        custodian_type: payload.custodian_type,
        contact_data: [contactInfo],
      };
      let data = yield call(
        httpService.makeRequest,
        "post",
        `${environment.API_URL}${custodiansApiEndPoint}custodian/`,
        custodianPayload,
        true
      );
      if (data && data.data) {
        yield [
          yield put(
            showAlert({
              type: "success",
              open: true,
              message: "Successfully Added Custodian",
            })
          ),
          yield put(getCustodians()),
          yield put(getContact()),
          yield call(history.push, redirectTo),
        ];
      }
    }
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Error in creating custodian",
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
  try {
    let filteredData = searchFilter(payload);
    yield put({ type: SEARCH_SUCCESS, data: filteredData });
  } catch (error) {
    // yield put({ type: UPDATE_USER_FAIL, error: "Updating user fields failed" });
  }
}

function* getContactInfo() {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${custodiansApiEndPoint}contact/`,
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

function* getCustodyList() {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${custodiansApiEndPoint}custody/`,
      null,
      true
    );
    yield [yield put({ type: GET_CUSTODY_SUCCESS, data: data.data })];
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
        type: GET_CUSTODY_FAILURE,
        error: error,
      }),
    ];
  }
}

function* addCustody(action) {
  let { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      "post",
      `${environment.API_URL}${custodiansApiEndPoint}custody/`,
      payload,
      true
    );
    if (data && data.data) {
      yield [
        yield put(getCustody()),
        yield put(
          showAlert({
            type: "success",
            open: true,
            message: "Successfully Added Custody",
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
          message: "Couldn't Add Custody due to some error!",
        })
      ),
      yield put({
        type: ADD_CUSTODY_FAILURE,
        error: error,
      }),
    ];
  }
}

function* watchGetCustodian() {
  yield takeLatest(GET_CUSTODIANS, getCustodiansList);
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

function* watchGetCustody() {
  yield takeLatest(GET_CUSTODY, getCustodyList);
}

function* watchAddCustody() {
  yield takeLatest(ADD_CUSTODY, addCustody);
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
    watchGetCustody(),
    watchAddCustody(),
  ]);
}
