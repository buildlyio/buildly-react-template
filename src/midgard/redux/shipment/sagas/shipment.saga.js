import { put, takeLatest, all, call } from "redux-saga/effects";
import { httpService } from "../../../modules/http/http.service";
import { environment } from "environments/environment";
import { showAlert } from "../../alert/actions/alert.actions";
import {
  ADD_SHIPMENT,
  DELETE_SHIPMENT,
  EDIT_SHIPMENT,
  GET_SHIPMENTS_SUCCESS,
  GET_SHIPMENTS_FAILURE,
  getShipmentDetails,
  ADD_SHIPMENT_FAILURE,
  EDIT_SHIPMENT_FAILURE,
  DELETE_SHIPMENT_FAILURE,
  GET_SHIPMENTS,
  saveShipmentFormData,
  GET_SHIPMENT_FLAG,
  GET_SHIPMENT_FLAG_FAILURE,
  GET_SHIPMENT_FLAG_SUCCESS,
  GET_DASHBOARD_ITEMS,
  GET_DASHBOARD_ITEMS_SUCCESS,
  GET_DASHBOARD_ITEMS_FAILURE,
  getShipmentFlag,
  EMAIL_ALERTS,
  ADD_SHIPMENT_FLAG,
  ADD_SHIPMENT_FLAG_SUCCESS,
  ADD_SHIPMENT_FLAG_FAILURE,
  EDIT_SHIPMENT_FLAG,
  EDIT_SHIPMENT_FLAG_SUCCESS,
  EDIT_SHIPMENT_FLAG_FAILURE,
  DELETE_SHIPMENT_FLAG,
  DELETE_SHIPMENT_FLAG_SUCCESS,
  DELETE_SHIPMENT_FLAG_FAILURE,
} from "../actions/shipment.actions";
import { compareSort } from "../../../utils/utilMethods";
import { routes } from "../../../routes/routesConstants";

const shipmentApiEndPoint = "shipment/";

function* getShipmentList(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${shipmentApiEndPoint}shipment/?organization_uuid=${payload.organization_uuid}`,
      null,
      true
    );
    if (data && data.data) {
      yield put(getShipmentFlag(payload.organization_uuid));
    }
    yield [yield put({ type: GET_SHIPMENTS_SUCCESS, data: data.data })];
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
        type: GET_SHIPMENTS_FAILURE,
        error: error,
      }),
    ];
  }
}

function* deleteShipment(payload) {
  let { shipmentId,organization_uuid } = payload;
  try {
    yield call(
      httpService.makeRequest,
      "delete",
      `${environment.API_URL}${shipmentApiEndPoint}shipment/${shipmentId}/`,
      null,
      true
    );
    yield [
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Shipment deleted successfully!",
        })
      ),
      yield put(getShipmentDetails(organization_uuid)),
    ];
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Error in deleting Shipment!",
        })
      ),
      yield put({
        type: DELETE_SHIPMENT_FAILURE,
        error: error,
      }),
    ];
  }
}

function* editShipment(action) {
  let { payload, history, redirectTo } = action;
  try {
    let data = yield call(
      httpService.makeRequest,
      "put",
      `${environment.API_URL}${shipmentApiEndPoint}shipment/${payload.id}/`,
      payload,
      true
    );

    yield [
      yield put(saveShipmentFormData(data.data)),
      yield put(getShipmentDetails(payload.organization_uuid)),
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Shipment successfully Edited!",
        })
      ),
      yield call(history.push, redirectTo, {
        type: "edit",
        data: data.data,
        from: routes.SHIPMENT,
      }),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Error in Updating Shipment!",
        })
      ),
      yield put({
        type: EDIT_SHIPMENT_FAILURE,
        error: error,
      }),
    ];
  }
}

function* addShipment(action) {
  let { history, payload, redirectTo } = action;
  try {
    let data = yield call(
      httpService.makeRequest,
      "post",
      `${environment.API_URL}${shipmentApiEndPoint}shipment/`,
      payload,
      true
    );
    yield [
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Successfully Added Shipment",
        })
      ),
      yield put(saveShipmentFormData(data.data)),
      yield put(getShipmentDetails(payload.organization_uuid)),
    ];
    if (redirectTo) {
      yield call(history.push, redirectTo);
    }
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Error in creating Shipment",
        })
      ),
      yield put({
        type: ADD_SHIPMENT_FAILURE,
        error: error,
      }),
    ];
  }
}

const alertFilter = (filterObject, list) => {
  let { temp, humid, recall, delay } = filterObject;
  let filter = [];
  let filteredList = [];
  if (
    (temp && humid && recall && delay) ||
    (!temp && !humid && !recall && !delay)
  ) {
    return list;
  }

  if (filterObject.temp) filter.push("temperature");
  if (filterObject.humid) filter.push("humidity");
  if (filterObject.delay) filter.push("delay");
  if (filterObject.recall) filter.push("recall");

  list.forEach((shipment) => {
    let flags = [];
    if (shipment.flag_list) {
      shipment.flag_list.forEach((flag) => {
        flags.push(flag.name.toLowerCase());
      });
    }
    if (flags.length > 0 && filter.every((val) => flags.includes(val)))
      filteredList.push(shipment);
  });

  // filteredList = list.filter((item) => {
  //   return (
  //     item.shipment_flag &&
  //     filter.indexOf(item.shipment_flag.toLowerCase()) !== -1
  //   );
  // });
  return filteredList;
};

function* getShipmentFlagList(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${shipmentApiEndPoint}shipment_flag/?organization_uuid=${payload.organization_uuid}`,
      null,
      true
    );
    let sortedData = data.data.sort(compareSort("name"));

    yield [yield put({ type: GET_SHIPMENT_FLAG_SUCCESS, data: sortedData })];
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
        type: GET_SHIPMENT_FLAG_FAILURE,
        error: error,
      }),
    ];
  }
}

function* getDashboard(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${shipmentApiEndPoint}dashboard/?organization_uuid=${payload.organization_uuid}`,
      null,
      true
    );
    yield [yield put({ type: GET_DASHBOARD_ITEMS_SUCCESS, data: data.data })];
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
        type: GET_DASHBOARD_ITEMS_FAILURE,
        error: error,
      }),
    ];
  }
}

function* sendEmailAlerts(payload) {
  try {
    const alerts = yield call(
      httpService.makeRequest,
      "post",
      `${environment.API_URL}coreuser/alert/`,
      payload.alerts
    );
    yield put(
      showAlert({
        type: "info",
        open: true,
        message: "Email alerts sent successfully",
      })
    );
  } catch (error) {
    console.log("error", error);
    yield put(
      showAlert({
        type: "error",
        open: true,
        message: "Couldn't send email alerts due to some error!",
      })
    );
  }
}

function* addShipmentFlag(action) {
  let { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      "post",
      `${environment.API_URL}${shipmentApiEndPoint}shipment_flag/`,
      payload,
      true
    );
    if (data && data.data) {
      yield [
        yield put({ 
          type: ADD_SHIPMENT_FLAG_SUCCESS,
          shipmentFlag: data.data,
        }),
        yield put(
          showAlert({
            type: "success",
            open: true,
            message: "Successfully Added Shipment Flag",
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
          message: "Couldn't Add Shipment Flag due to some error!",
        })
      ),
      yield put({
        type: ADD_SHIPMENT_FLAG_FAILURE,
        error: error,
      }),
    ];
  }
}

function* editShipmentFlag(action) {
  let { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      "put",
      `${environment.API_URL}${shipmentApiEndPoint}shipment_flag/${payload.id}`,
      payload,
      true
    );
    if (data && data.data) {
      yield [
        yield put({ 
          type: EDIT_SHIPMENT_FLAG_SUCCESS,
          shipmentFlag: data.data,
        }),
        yield put(
          showAlert({
            type: "success",
            open: true,
            message: "Successfully Edited Shipment Flag",
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
          message: "Couldn't Edit Shipment Flag due to some error!",
        })
      ),
      yield put({
        type: EDIT_SHIPMENT_FLAG_FAILURE,
        error: error,
      }),
    ];
  }
}

function* deleteShipmentFlag(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      "delete",
      `${environment.API_URL}${shipmentApiEndPoint}shipment_flag/${payload.id}`,
      null,
      true
    );
    yield [
      yield put({ 
        type: DELETE_SHIPMENT_FLAG_SUCCESS,
        shipmentFlag: { id: payload.id },
      }),
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Successfully Deleted Shipment Flag",
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
          message: "Couldn't Delete Shipment Flag due to some error!",
        })
      ),
      yield put({
        type: DELETE_SHIPMENT_FLAG_FAILURE,
        error: error,
      }),
    ];
  }
}

function* watchGetShipment() {
  yield takeLatest(GET_SHIPMENTS, getShipmentList);
}

function* watchAddShipment() {
  yield takeLatest(ADD_SHIPMENT, addShipment);
}

function* watchDeleteShipment() {
  yield takeLatest(DELETE_SHIPMENT, deleteShipment);
}

function* watchEditShipment() {
  yield takeLatest(EDIT_SHIPMENT, editShipment);
}

function* watchGetShipmentFlag() {
  yield takeLatest(GET_SHIPMENT_FLAG, getShipmentFlagList);
}

function* watchGetDashboardItems() {
  yield takeLatest(GET_DASHBOARD_ITEMS, getDashboard);
}

function* watchEmailAlerts() {
  yield takeLatest(EMAIL_ALERTS, sendEmailAlerts);
}

function* watchAddShipmentFlag() {
  yield takeLatest(ADD_SHIPMENT_FLAG, addShipmentFlag);
}

function* watchEditShipmentFlag() {
  yield takeLatest(EDIT_SHIPMENT_FLAG, editShipmentFlag);
}

function* watchDeleteShipmentFlag() {
  yield takeLatest(DELETE_SHIPMENT_FLAG, deleteShipmentFlag);
}

export default function* shipmentSaga() {
  yield all([
    watchGetShipment(),
    watchAddShipment(),
    watchDeleteShipment(),
    watchEditShipment(),
    watchGetShipmentFlag(),
    watchGetDashboardItems(),
    watchEmailAlerts(),
    watchAddShipmentFlag(),
    watchEditShipmentFlag(),
    watchDeleteShipmentFlag(),
  ]);
}
