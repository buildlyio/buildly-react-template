import {
  put, takeLatest, all, call,
} from 'redux-saga/effects';
import _ from 'lodash';
import { httpService } from '../../../modules/http/http.service';
import { showAlert } from '../../alert/actions/alert.actions';
import {
  GET_ALL_SENSOR_ALERTS,
  GET_ALL_SENSOR_ALERTS_SUCCESS,
  GET_ALL_SENSOR_ALERTS_FAILURE,
  GET_SENSOR_REPORTS,
  GET_SENSOR_REPORTS_SUCCESS,
  GET_SENSOR_REPORTS_FAILURE,
} from '../actions/sensorsGateway.actions';

const sensorApiEndPoint = 'sensors/';

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

function* watchGetAllSensorAlerts() {
  yield takeLatest(GET_ALL_SENSOR_ALERTS, getSensorAlerts);
}

function* watchGetSensorReportList() {
  yield takeLatest(GET_SENSOR_REPORTS, getSensorReportList);
}

export default function* sensorsGatewaySaga() {
  yield all([
    watchGetAllSensorAlerts(),
    watchGetSensorReportList(),
  ]);
}
