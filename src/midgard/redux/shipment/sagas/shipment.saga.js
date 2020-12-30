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
  filterShipmentData,
  GET_DASHBOARD_ITEMS,
  GET_DASHBOARD_ITEMS_SUCCESS,
  GET_DASHBOARD_ITEMS_FAILURE,
  getShipmentFlag,
} from "../actions/shipment.actions";
import { compareSort } from "../../../utils/utilMethods";
import configureStore from "../../store";

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
    console.log("data", data);
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
  try {
    yield call(
      httpService.makeRequest,
      "delete",
      `${environment.API_URL}${shipmentApiEndPoint}shipment/${payload.shipmentId}/`,
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
      yield put(getShipmentDetails(payload.organization_uuid)),
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
      // yield call(history.push, redirectTo),
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

function* filterShipment(payload) {
  let { filterObject, list } = payload;
  try {
    if (filterObject.type === "sort" && list.length > 0) {
      let sortedList = sortFilter(filterObject, list);
      if (
        filterObject.temp ||
        filterObject.humid ||
        filterObject.recall ||
        filterObject.delay
      ) {
        sortedList = alertFilter(filterObject, sortedList);
      }
      if (
        filterObject.completed ||
        filterObject.cancelled ||
        filterObject.enroute ||
        filterObject.planned
      ) {
        sortedList = statusFilter(filterObject, sortedList);
      }
      yield put({ type: FILTER_SHIPMENT_SUCCESS, data: sortedList });
    }
    if (filterObject.type === "search" && list.length > 0) {
      if (!filterObject.value) {
        yield put({ type: FILTER_SHIPMENT_SUCCESS, data: list });
      } else {
        let filteredData = searchFilter(filterObject, list);
        yield put({ type: FILTER_SHIPMENT_SUCCESS, data: filteredData });
      }
    }
    if (filterObject.type === "alert" && list.length > 0) {
      let filteredData = alertFilter(filterObject, list);
      if (
        filterObject.completed ||
        filterObject.cancelled ||
        filterObject.enroute ||
        filterObject.planned
      ) {
        filteredData = statusFilter(filterObject, filteredData);
      }
      if (
        filterObject.value &&
        (filterObject.value.includes("Asc") ||
          filterObject.value.includes("Desc"))
      ) {
        filteredData = sortFilter(filterObject, filteredData);
      }
      yield put({ type: FILTER_SHIPMENT_SUCCESS, data: filteredData });
    }
    if (filterObject.type === "status" && list.length > 0) {
      let statusFilteredData = statusFilter(filterObject, list);
      if (
        filterObject.temp ||
        filterObject.humid ||
        filterObject.recall ||
        filterObject.delay
      ) {
        statusFilteredData = alertFilter(filterObject, statusFilteredData);
      }
      if (
        filterObject.value &&
        (filterObject.value.includes("Asc") ||
          filterObject.value.includes("Desc"))
      ) {
        statusFilteredData = sortFilter(filterObject, statusFilteredData);
      }
      yield put({ type: FILTER_SHIPMENT_SUCCESS, data: statusFilteredData });
    }
  } catch (error) {
    // yield put({ type: UPDATE_USER_FAIL, error: "Updating user fields failed" });
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

const statusFilter = (filterObject, list) => {
  let { planned, cancelled, completed, enroute } = filterObject;
  let filter = [];
  let filteredList = [];
  if (
    (planned && cancelled && completed && enroute) ||
    (!planned && !cancelled && !completed && !enroute)
  ) {
    return list;
  }

  if (filterObject.planned) filter.push("planned");
  if (filterObject.cancelled) filter.push("cancelled");
  if (filterObject.completed) filter.push("completed");
  if (filterObject.enroute) filter.push("enroute");

  filteredList = list.filter((item) => {
    return item.status && filter.indexOf(item.status.toLowerCase()) !== -1;
  });
  return filteredList;
};

const searchFilter = (filterObject, list) => {
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
  return data;
};

const sortFilter = (filterObject, list) => {
  switch (filterObject.value) {
    case "valueAsc": {
      return list.sort((a, b) => {
        if (a.value === null || a.value === "") {
          return 1;
        } else if (b.value === null || b.value === "") {
          return -1;
        } else {
          return a.value - b.value;
        }
      });
    }
    case "valueDesc": {
      return list.sort((a, b) => {
        if (a.value === null || a.value === "") {
          return 1;
        } else if (b.value === null || b.value === "") {
          return -1;
        } else {
          return b.value - a.value;
        }
      });
    }
    case "dateAsc": {
      return list.sort((a, b) => {
        if (
          a.estimated_time_of_arrival === null ||
          a.estimated_time_of_arrival === ""
        ) {
          return 1;
        } else if (
          b.estimated_time_of_arrival === null ||
          b.estimated_time_of_arrival === ""
        ) {
          return -1;
        } else {
          return moment
            .utc(a.estimated_time_of_arrival)
            .diff(moment.utc(b.estimated_time_of_arrival));
        }
      });
    }
    case "dateDesc": {
      return list.sort((a, b) => {
        if (
          a.estimated_time_of_arrival === null ||
          a.estimated_time_of_arrival === ""
        ) {
          return 1;
        } else if (
          b.estimated_time_of_arrival === null ||
          b.estimated_time_of_arrival === ""
        ) {
          return -1;
        } else {
          return moment
            .utc(b.estimated_time_of_arrival)
            .diff(moment.utc(a.estimated_time_of_arrival));
        }
      });
    }
    case "nameAsc": {
      return list.sort((a, b) => {
        if (a.custodian_name === null || a.custodian_name === "") {
          return 1;
        } else if (b.custodian_name === null || b.custodian_name === "") {
          return -1;
        } else if (
          a.custodian_name.toUpperCase() < b.custodian_name.toUpperCase()
        )
          return -1;
        else if (
          a.custodian_name.toUpperCase() > b.custodian_name.toUpperCase()
        )
          return 1;
        else return 0;
      });
    }
    case "nameDesc": {
      return list.sort((a, b) => {
        if (a.custodian_name === null || a.custodian_name === "") {
          return 1;
        } else if (b.custodian_name === null || b.custodian_name === "") {
          return -1;
        } else if (
          a.custodian_name.toUpperCase() > b.custodian_name.toUpperCase()
        )
          return -1;
        else if (
          a.custodian_name.toUpperCase() < b.custodian_name.toUpperCase()
        )
          return 1;
        else return 0;
      });
    }
    default: {
      return list;
    }
  }
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

function* getDashboard() {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${shipmentApiEndPoint}dashboard/`,
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

function* watchGetDashboardItems() {
  yield takeLatest(GET_DASHBOARD_ITEMS, getDashboard);
}

export default function* shipmentSaga() {
  yield all([
    watchFilterShipment(),
    watchGetShipment(),
    watchAddShipment(),
    watchDeleteShipment(),
    watchEditShipment(),
    watchGetShipmentFlag(),
    watchGetDashboardItems(),
  ]);
}
