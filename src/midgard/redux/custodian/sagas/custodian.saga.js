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
  EDIT_CUSTODY,
  UPDATE_CUSTODY,
  UPDATE_CUSTODY_FAILURE,
  EDIT_CUSTODY_FAILURE,
  ADD_CUSTODIAN_TYPE,
  ADD_CUSTODIAN_TYPE_SUCCESS,
  ADD_CUSTODIAN_TYPE_FAILURE,
  EDIT_CUSTODIAN_TYPE,
  EDIT_CUSTODIAN_TYPE_SUCCESS,
  EDIT_CUSTODIAN_TYPE_FAILURE,
  DELETE_CUSTODIAN_TYPE,
  DELETE_CUSTODIAN_TYPE_SUCCESS,
  DELETE_CUSTODIAN_TYPE_FAILURE,
} from "../actions/custodian.actions";
import { put, takeLatest, all, call } from "redux-saga/effects";
import { oauthService } from "../../../modules/oauth/oauth.service";
import { httpService } from "../../../modules/http/http.service";
import { environment } from "environments/environment";
import { routes } from "../../../routes/routesConstants";
import { showAlert } from "../../alert/actions/alert.actions";
import { searchFilter } from "../../../utils/utilMethods";

const custodiansApiEndPoint = "custodian/";

function* getCustodiansList(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${custodiansApiEndPoint}custodian/?organization_uuid=${payload.organization_uuid}`,
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
  let { custodianId, contactObjId, organization_uuid } = payload;
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
      yield put(getCustodians(organization_uuid)),
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
        organization_uuid: payload.organization_uuid,
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
          yield put(getCustodians(payload.organization_uuid)),
          yield put(getContact(payload.organization_uuid)),
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
        organization_uuid: payload.organization_uuid,
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
          yield put(getCustodians(payload.organization_uuid)),
          yield put(getContact(payload.organization_uuid)),
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

function* getContactInfo(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${custodiansApiEndPoint}contact/?organization_uuid=${payload.organization_uuid}`,
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

function* editCustody(action) {
  let { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      "put",
      `${environment.API_URL}${custodiansApiEndPoint}custody/${payload.id}`,
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
            message: "Successfully Edited Custody",
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
          message: "Couldn't Edit Custody due to some error!",
        })
      ),
      yield put({
        type: EDIT_CUSTODY_FAILURE,
        error: error,
      }),
    ];
  }
}

function* updateCustody(action) {
  let { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      "patch",
      `${environment.API_URL}${custodiansApiEndPoint}custody/${payload.id}/`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put(getCustody()),
        yield put(
          showAlert({
            type: "success",
            open: true,
            message: "Successfully Edited Custody",
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
          message: "Couldn't Edit Custody due to some error!",
        })
      ),
      yield put({
        type: UPDATE_CUSTODY_FAILURE,
        error: error,
      }),
    ];
  }
}

function* addCustodianType(action) {
  let { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      "post",
      `${environment.API_URL}${custodiansApiEndPoint}custodian_type/`,
      payload,
      true
    );
    if (data && data.data) {
      yield [
        yield put({
          type: ADD_CUSTODIAN_TYPE_SUCCESS,
          custodianType: data.data,
        }),
        yield put(
          showAlert({
            type: "success",
            open: true,
            message: "Successfully Added Custodian Type",
          })
        ),
      ];
    }
  } catch (error) {
    console.log(error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't Add Custodian Type due to some error!",
        })
      ),
      yield put({
        type: ADD_CUSTODIAN_TYPE_FAILURE,
        error: error,
      }),
    ];
  }
}

function* editCustodianType(action) {
  let { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      "put",
      `${environment.API_URL}${custodiansApiEndPoint}custodian_type/${payload.id}`,
      payload,
      true
    );
    if (data && data.data) {
      yield [
        yield put({
          type: EDIT_CUSTODIAN_TYPE_SUCCESS,
          custodianType: data.data,
        }),
        yield put(
          showAlert({
            type: "success",
            open: true,
            message: "Successfully Edited Custodian Type",
          })
        ),
      ];
    }
  } catch (error) {
    console.log(error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't Edit Custodian Type due to some error!",
        })
      ),
      yield put({
        type: EDIT_CUSTODIAN_TYPE_FAILURE,
        error: error,
      }),
    ];
  }
}

function* deleteCustodianType(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      "delete",
      `${environment.API_URL}${custodiansApiEndPoint}custodian_type/${payload.id}`,
      null,
      true
    );
    yield [
      yield put({
        type: DELETE_CUSTODIAN_TYPE_SUCCESS,
        custodianType: { id: payload.id },
      }),
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Successfully Deleted Custodian Type",
        })
      ),
    ];
  } catch (error) {
    console.log(error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't Delete Custodian Type due to some error!",
        })
      ),
      yield put({
        type: DELETE_CUSTODIAN_TYPE_FAILURE,
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

function* watchEditCustody() {
  yield takeLatest(EDIT_CUSTODY, editCustody);
}

function* watchUpdateCustody() {
  yield takeLatest(UPDATE_CUSTODY, updateCustody);
}

function* watchAddCustodianType() {
  yield takeLatest(ADD_CUSTODIAN_TYPE, addCustodianType);
}

function* watchEditCustodianType() {
  yield takeLatest(EDIT_CUSTODIAN_TYPE, editCustodianType);
}

function* watchDeleteCustodianType() {
  yield takeLatest(DELETE_CUSTODIAN_TYPE, deleteCustodianType);
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
    watchEditCustody(),
    watchUpdateCustody(),
    watchAddCustodianType(),
    watchEditCustodianType(),
    watchDeleteCustodianType(),
  ]);
}
