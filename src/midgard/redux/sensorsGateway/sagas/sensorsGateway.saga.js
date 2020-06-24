import { put, takeLatest, all, call } from "redux-saga/effects";
import { httpService } from "../../../modules/http/http.service";
import { environment } from "environment";
import { routes } from "../../../routes/routesConstants";
import { showAlert } from "../../alert/actions/alert.actions";
import {
  GET_GATEWAYS,
  GATEWAY_SEARCH_SUCCESS,
  GATEWAY_SEARCH,
  GET_GATEWAYS_TYPE,
  ADD_GATEWAY,
  DELETE_GATEWAY,
  EDIT_GATEWAY,
  GET_GATEWAYS_SUCCESS,
  GET_GATEWAYS_FAILURE,
  GET_GATEWAYS_TYPE_SUCCESS,
  GET_GATEWAYS_TYPE_FAILURE,
  getGateways,
  DELETE_GATEWAY_FAILURE,
  EDIT_GATEWAY_SUCCESS,
  EDIT_GATEWAY_FAILURE,
  ADD_GATEWAY_FAILURE,
} from "../actions/sensorsGateway.actions";

const sensorApiEndPoint = "sensors/";

function* getGatewayList() {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${sensorApiEndPoint}gateway/`,
      null,
      true
    );
    yield [yield put({ type: GET_GATEWAYS_SUCCESS, data: data.data })];
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
        type: GET_GATEWAYS_FAILURE,
        error: error,
      }),
    ];
  }
}

function* getGatewayTypeList() {
  try {
    const data = yield call(
      httpService.makeRequest,
      "get",
      `${environment.API_URL}${sensorApiEndPoint}gateway_type/`,
      null,
      true
    );
    yield [
      yield put({
        type: GET_GATEWAYS_TYPE_SUCCESS,
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
        type: GET_GATEWAYS_TYPE_FAILURE,
        error: error,
      }),
    ];
  }
}

function* deleteGatewayItem(payload) {
  let { gatewayId } = payload;
  try {
    yield call(
      httpService.makeRequest,
      "delete",
      `${environment.API_URL}${sensorApiEndPoint}gateway/${gatewayId}/`,
      null,
      true
    );
    yield [
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Gateway deleted successfully!",
        })
      ),
      yield put(getGateways()),
    ];
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Error in deleting Gateway!",
        })
      ),
      yield put({
        type: DELETE_GATEWAY_FAILURE,
        error: error,
      }),
    ];
  }
}

function* editGateWayItem(action) {
  let { payload, history } = action;
  try {
    let data = yield call(
      httpService.makeRequest,
      "put",
      `${environment.API_URL}${sensorApiEndPoint}gateway/${payload.id}/`,
      payload,
      true
    );
    yield [
      yield put(getGateways()),
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Gateway successfully Edited!",
        })
      ),
      yield call(history.push, routes.SENSORS_GATEWAY),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Couldn't edit Gateway due to some error!",
        })
      ),
      yield put({
        type: EDIT_GATEWAY_FAILURE,
        error: error,
      }),
    ];
  }
}

function* addGateway(action) {
  let { history, payload } = action;
  try {
    let data = yield call(
      httpService.makeRequest,
      "post",
      `${environment.API_URL}${sensorApiEndPoint}gateway/`,
      payload,
      true
    );
    yield [
      yield put(
        showAlert({
          type: "success",
          open: true,
          message: "Successfully Added Gateway",
        })
      ),
      yield put(getGateways()),
      yield call(history.push, routes.SENSORS_GATEWAY),
    ];
  } catch (error) {
    console.log("error", error);
    yield [
      yield put(
        showAlert({
          type: "error",
          open: true,
          message: "Error in creating Gateway",
        })
      ),
      yield put({
        type: ADD_GATEWAY_FAILURE,
        error: error,
      }),
    ];
  }
}

function* searchGateway(payload) {
  try {
    if (!payload.searchItem) {
      yield put({ type: GATEWAY_SEARCH_SUCCESS, data: [] });
    } else {
      let data = payload.searchList.filter((item) => {
        return (
          item.name.includes(payload.searchItem.trim()) ||
          item.id.toString().includes(payload.searchItem) ||
          item.gateway_uuid.toString().includes(payload.searchItem)
        );
      });
      yield put({ type: GATEWAY_SEARCH_SUCCESS, data });
    }
  } catch (error) {
    // yield put({ type: UPDATE_USER_FAIL, error: "Updating user fields failed" });
  }
}

function* watchGetGateway() {
  yield takeLatest(GET_GATEWAYS, getGatewayList);
}

function* watchGatewaySearch() {
  yield takeLatest(GATEWAY_SEARCH, searchGateway);
}

function* watchGetGatewayType() {
  yield takeLatest(GET_GATEWAYS_TYPE, getGatewayTypeList);
}

function* watchAddGateway() {
  yield takeLatest(ADD_GATEWAY, addGateway);
}

function* watchDeleteGateway() {
  yield takeLatest(DELETE_GATEWAY, deleteGatewayItem);
}

function* watchEditGateway() {
  yield takeLatest(EDIT_GATEWAY, editGateWayItem);
}

export default function* sensorsGatewaySaga() {
  yield all([
    watchGatewaySearch(),
    watchGetGateway(),
    watchGetGatewayType(),
    watchAddGateway(),
    watchDeleteGateway(),
    watchEditGateway(),
  ]);
}
