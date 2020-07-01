import { put, takeLatest, all, call } from "redux-saga/effects";
import { oauthService } from "../../../modules/oauth/oauth.service";
import { httpService } from "../../../modules/http/http.service";
import { environment } from "environment";
import { routes } from "../../../routes/routesConstants";
import { showAlert } from "../../alert/actions/alert.actions";
import moment from "moment";
import {
  FILTER_SHIPMENT,
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
  FILTER_SHIPMENT_SUCCESS,
} from "../actions/shipment.actions";

const shipmentApiEndPoint = "shipment/";

function* getShipmentList() {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${shipmentApiEndPoint}shipment/`,
      null,
      true
    );
    yield [yield put({ type: GET_SHIPMENTS_SUCCESS, data: data.data })];
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
        type: GET_SHIPMENTS_FAILURE,
        error: error,
      }),
    ];
  }
}

function* deleteShipment(payload) {
  let { shipmentId } = payload;
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
      yield put(getShipmentDetails()),
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
      yield put(getShipmentDetails()),
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Shipment successfully Edited!",
        })
      ),
      yield call(history.push, redirectTo),
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
    console.log("Data", data);
    yield [
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Successfully Added Shipment",
        })
      ),
      yield put(saveShipmentFormData(data.data)),
      yield put(getShipmentDetails()),
      yield call(history.push, redirectTo),
    ];
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

function* filterShipment(payload) {
  let { filterObject, list } = payload;
  try {
    if (filterObject.type === "sort" && list.length > 0) {
      switch (filterObject.value) {
        case "valueAsc": {
          let sortedList = list.sort((a, b) => {
            return a.value - b.value;
          });
          yield put({ type: FILTER_SHIPMENT_SUCCESS, data: sortedList });
          break;
        }
        case "valueDesc": {
          let sortedList = list.sort((a, b) => {
            return b.value - a.value;
          });
          yield put({ type: FILTER_SHIPMENT_SUCCESS, data: sortedList });
          break;
        }
        case "dateAsc": {
          let sortedList = list.sort((a, b) => {
            return moment
              .utc(a.estimated_time_of_arrival)
              .diff(moment.utc(b.estimated_time_of_arrival));
          });
          yield put({ type: FILTER_SHIPMENT_SUCCESS, data: sortedList });
          break;
        }
        case "dateDesc": {
          let sortedList = list.sort((a, b) => {
            return moment
              .utc(b.estimated_time_of_arrival)
              .diff(moment.utc(a.estimated_time_of_arrival));
          });
          yield put({ type: FILTER_SHIPMENT_SUCCESS, data: sortedList });
          break;
        }
        case "nameAsc": {
          let sortedList = list.sort((a, b) => {
            if (a.custodian_name.toUpperCase() < b.custodian_name.toUpperCase())
              return -1;
            else if (
              a.custodian_name.toUpperCase() > b.custodian_name.toUpperCase()
            )
              return 1;
            else return 0;
          });
          yield put({ type: FILTER_SHIPMENT_SUCCESS, data: sortedList });
          break;
        }
        case "nameDesc": {
          let sortedList = list.sort((a, b) => {
            if (a.custodian_name.toUpperCase() > b.custodian_name.toUpperCase())
              return -1;
            else if (
              a.custodian_name.toUpperCase() < b.custodian_name.toUpperCase()
            )
              return 1;
            else return 0;
          });
          yield put({ type: FILTER_SHIPMENT_SUCCESS, data: sortedList });
          break;
        }
        default: {
          yield put({ type: FILTER_SHIPMENT_SUCCESS, data: list });
          break;
        }
      }
    }
    if (filterObject.type === "search" && list.length > 0) {
      if (!filterObject.value) {
        yield put({ type: FILTER_SHIPMENT_SUCCESS, data: [] });
      } else {
        let data = list.filter((item) => {
          let itemKeys = Object.keys(item);
          let foundItem = "";
          itemKeys.forEach((key) => {
            if (
              filterObject.searchFields.includes(key) &&
              item[key] &&
              item[key].toString().includes(filterObject.value)
            ) {
              foundItem = { ...item };
            }
          });
          return foundItem && foundItem.id === item.id;
        });
        yield put({ type: FILTER_SHIPMENT_SUCCESS, data });
      }
    }
    // if (!payload.searchItem) {
    //   yield put({ type: SEARCH_SUCCESS, data: [] });
    // } else {
    //   let data = payload.searchList.filter((item) => {
    //     return (
    //       item.name.includes(payload.searchItem.trim()) ||
    //       item.id.toString().includes(payload.searchItem)
    //     );
    //   });
    //   yield put({ type: SEARCH_SUCCESS, data });
    // }
  } catch (error) {
    // yield put({ type: UPDATE_USER_FAIL, error: "Updating user fields failed" });
  }
}

function* getShipmentFlagList() {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${shipmentApiEndPoint}shipment_flag/`,
      null,
      true
    );
    yield [yield put({ type: GET_SHIPMENT_FLAG_SUCCESS, data: data.data })];
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

function* watchGetShipment() {
  yield takeLatest(GET_SHIPMENTS, getShipmentList);
}

function* watchFilterShipment() {
  yield takeLatest(FILTER_SHIPMENT, filterShipment);
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

export default function* shipmentSaga() {
  yield all([
    watchFilterShipment(),
    watchGetShipment(),
    watchAddShipment(),
    watchDeleteShipment(),
    watchEditShipment(),
    watchGetShipmentFlag(),
  ]);
}
