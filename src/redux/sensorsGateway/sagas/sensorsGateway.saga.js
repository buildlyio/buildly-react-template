import {
  put, takeLatest, all, call,
} from 'redux-saga/effects';
import _ from 'lodash';
import { httpService } from '../../../modules/http/http.service';
import { showAlert } from '../../alert/actions/alert.actions';
import {
  GET_GATEWAYS,
  GET_GATEWAYS_SUCCESS,
  GET_GATEWAYS_FAILURE,
  GET_NEW_GATEWAYS,
  GET_NEW_GATEWAYS_SUCCESS,
  GET_NEW_GATEWAYS_FAILURE,
  ADD_GATEWAY,
  ADD_GATEWAY_SUCCESS,
  ADD_GATEWAY_FAILURE,
  EDIT_GATEWAY,
  EDIT_GATEWAY_SUCCESS,
  EDIT_GATEWAY_FAILURE,
  DELETE_GATEWAY,
  DELETE_GATEWAY_SUCCESS,
  DELETE_GATEWAY_FAILURE,
  GET_GATEWAYS_TYPE,
  GET_GATEWAYS_TYPE_SUCCESS,
  GET_GATEWAYS_TYPE_FAILURE,
  ADD_GATEWAYS_TYPE,
  ADD_GATEWAYS_TYPE_SUCCESS,
  ADD_GATEWAYS_TYPE_FAILURE,
  EDIT_GATEWAYS_TYPE,
  EDIT_GATEWAYS_TYPE_SUCCESS,
  EDIT_GATEWAYS_TYPE_FAILURE,
  DELETE_GATEWAYS_TYPE,
  DELETE_GATEWAYS_TYPE_SUCCESS,
  DELETE_GATEWAYS_TYPE_FAILURE,
  GET_SENSORS,
  GET_SENSORS_SUCCESS,
  GET_SENSORS_FAILURE,
  ADD_SENSOR,
  ADD_SENSOR_SUCCESS,
  ADD_SENSOR_FAILURE,
  EDIT_SENSOR,
  EDIT_SENSOR_SUCCESS,
  EDIT_SENSOR_FAILURE,
  DELETE_SENSOR,
  DELETE_SENSOR_SUCCESS,
  DELETE_SENSOR_FAILURE,
  GET_SENSORS_TYPE,
  GET_SENSORS_TYPE_SUCCESS,
  GET_SENSORS_TYPE_FAILURE,
  ADD_SENSORS_TYPE,
  ADD_SENSORS_TYPE_SUCCESS,
  ADD_SENSORS_TYPE_FAILURE,
  EDIT_SENSORS_TYPE,
  EDIT_SENSORS_TYPE_SUCCESS,
  EDIT_SENSORS_TYPE_FAILURE,
  DELETE_SENSORS_TYPE,
  DELETE_SENSORS_TYPE_SUCCESS,
  DELETE_SENSORS_TYPE_FAILURE,
  GET_ALL_SENSOR_ALERTS,
  GET_ALL_SENSOR_ALERTS_SUCCESS,
  GET_ALL_SENSOR_ALERTS_FAILURE,
  GET_SENSOR_REPORTS,
  GET_SENSOR_REPORTS_SUCCESS,
  GET_SENSOR_REPORTS_FAILURE,
} from '../actions/sensorsGateway.actions';

const sensorApiEndPoint = 'sensors/';

function* getGatewayList(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${sensorApiEndPoint}gateway/?organization_uuid=${payload.organization_uuid}`,
    );
    yield put({ type: GET_GATEWAYS_SUCCESS, data: _.filter(data.data, (gateway) => !_.includes(gateway.name, 'ICLP')) });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t load gateways due to some error!',
        }),
      ),
      yield put({ type: GET_GATEWAYS_FAILURE, error }),
    ];
  }
}

function* getNewGateways(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${sensorApiEndPoint}gateway/create_gateway/`,
    );
    yield put({ type: GET_NEW_GATEWAYS_SUCCESS });
    window.location.reload();
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t load new gateways due to some error!',
        }),
      ),
      yield put({ type: GET_NEW_GATEWAYS_FAILURE, error }),
    ];
  }
}

function* addGateway(action) {
  const { history, payload, redirectTo } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${sensorApiEndPoint}gateway/`,
      payload,
    );
    yield [
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Successfully added gateway',
        }),
      ),
      yield put({ type: ADD_GATEWAY_SUCCESS, gateway: data.data }),
    ];
    if (history && redirectTo) {
      yield call(history.push, redirectTo);
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in creating gateway',
        }),
      ),
      yield put({ type: ADD_GATEWAY_FAILURE, error }),
    ];
  }
}

function* editGateWayItem(action) {
  const { payload, history, redirectTo } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}${sensorApiEndPoint}gateway/${payload.id}/`,
      payload,
    );
    yield [
      yield put({ type: EDIT_GATEWAY_SUCCESS, gateway: data.data }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Gateway successfully edited!',
        }),
      ),
    ];
    if (history && redirectTo) {
      yield call(history.push, redirectTo);
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t edit gateway due to some error!',
        }),
      ),
      yield put({ type: EDIT_GATEWAY_FAILURE, error }),
    ];
  }
}

function* deleteGatewayItem(payload) {
  try {
    yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${sensorApiEndPoint}gateway/${payload.id}/`,
    );
    yield [
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Gateway deleted successfully!',
        }),
      ),
      yield put({ type: DELETE_GATEWAY_SUCCESS, id: payload.id }),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in deleting gateway!',
        }),
      ),
      yield put({ type: DELETE_GATEWAY_FAILURE, error }),
    ];
  }
}

function* getGatewayTypeList() {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${sensorApiEndPoint}gateway_type/`,
    );
    yield put({
      type: GET_GATEWAYS_TYPE_SUCCESS,
      data: _.filter(data.data, (gatewayType) => _.toLower(gatewayType.name) !== 'iclp'),
    });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t load gateway types due to some error!',
        }),
      ),
      yield put({ type: GET_GATEWAYS_TYPE_FAILURE, error }),
    ];
  }
}

function* addGatewayType(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${sensorApiEndPoint}gateway_type/`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put({ type: ADD_GATEWAYS_TYPE_SUCCESS, gatewayType: data.data }),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully added gateway type',
          }),
        ),
      ];
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t add gateway type due to some error!',
        }),
      ),
      yield put({ type: ADD_GATEWAYS_TYPE_FAILURE, error }),
    ];
  }
}

function* editGatewayType(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}${sensorApiEndPoint}gateway_type/${payload.id}`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put({ type: EDIT_GATEWAYS_TYPE_SUCCESS, gatewayType: data.data }),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully edited gateway type',
          }),
        ),
      ];
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t edit gateway type due to some error!',
        }),
      ),
      yield put({ type: EDIT_GATEWAYS_TYPE_FAILURE, error }),
    ];
  }
}

function* deleteGatewayType(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${sensorApiEndPoint}gateway_type/${payload.id}`,
    );
    yield [
      yield put({ type: DELETE_GATEWAYS_TYPE_SUCCESS, id: payload.id }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Successfully deleted gateway type',
        }),
      ),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t delete gateway type due to some error!',
        }),
      ),
      yield put({ type: DELETE_GATEWAYS_TYPE_FAILURE, error }),
    ];
  }
}

function* getSensorAlerts(payload) {
  try {
    const response = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${sensorApiEndPoint}sensor_report_alert/?shipment_ids=${payload.partnerShipmentIds}`,
    );
    yield put({ type: GET_ALL_SENSOR_ALERTS_SUCCESS, alerts: response.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t load sensor alerts due to some error!',
        }),
      ),
      yield put({ type: GET_ALL_SENSOR_ALERTS_FAILURE, error }),
    ];
  }
}

function* getSensorReportList(payload) {
  try {
    const response = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${sensorApiEndPoint}sensor_report/?shipment_id=${payload.partnerShipmentIds}`,
    );
    yield put({ type: GET_SENSOR_REPORTS_SUCCESS, reports: response.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t load sensor reports due to some error!',
        }),
      ),
      yield put({ type: GET_SENSOR_REPORTS_FAILURE, error }),
    ];
  }
}

function* watchGetGateway() {
  yield takeLatest(GET_GATEWAYS, getGatewayList);
}

function* watchGetNewGateways() {
  yield takeLatest(GET_NEW_GATEWAYS, getNewGateways);
}

function* watchAddGateway() {
  yield takeLatest(ADD_GATEWAY, addGateway);
}

function* watchEditGateway() {
  yield takeLatest(EDIT_GATEWAY, editGateWayItem);
}

function* watchDeleteGateway() {
  yield takeLatest(DELETE_GATEWAY, deleteGatewayItem);
}

function* watchGetGatewayType() {
  yield takeLatest(GET_GATEWAYS_TYPE, getGatewayTypeList);
}

function* watchAddGatewayType() {
  yield takeLatest(ADD_GATEWAYS_TYPE, addGatewayType);
}

function* watchEditGatewayType() {
  yield takeLatest(EDIT_GATEWAYS_TYPE, editGatewayType);
}

function* watchDeleteGatewayType() {
  yield takeLatest(DELETE_GATEWAYS_TYPE, deleteGatewayType);
}

function* watchGetAllSensorAlerts() {
  yield takeLatest(GET_ALL_SENSOR_ALERTS, getSensorAlerts);
}

function* watchGetSensorReportList() {
  yield takeLatest(GET_SENSOR_REPORTS, getSensorReportList);
}

export default function* sensorsGatewaySaga() {
  yield all([
    watchGetGateway(),
    watchGetNewGateways(),
    watchAddGateway(),
    watchDeleteGateway(),
    watchEditGateway(),
    watchGetGatewayType(),
    watchAddGatewayType(),
    watchEditGatewayType(),
    watchDeleteGatewayType(),
    watchGetAllSensorAlerts(),
    watchGetSensorReportList(),
  ]);
}
