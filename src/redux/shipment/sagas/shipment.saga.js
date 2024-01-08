import {
  put, takeLatest, all, call,
} from 'redux-saga/effects';
import _ from 'lodash';
import { httpService } from '../../../modules/http/http.service';
import { showAlert } from '../../alert/actions/alert.actions';
import { getCustody } from '../../custodian/actions/custodian.actions';
import {
  getAllSensorAlerts, getSensorReports,
} from '../../sensorsGateway/actions/sensorsGateway.actions';
import {
  GET_SHIPMENTS,
  GET_SHIPMENTS_SUCCESS,
  GET_SHIPMENTS_FAILURE,
} from '../actions/shipment.actions';

const shipmentApiEndPoint = 'shipment/';

function* getShipmentList(payload) {
  const {
    organization_uuid, status, fetchRelatedData, fetchSensorReports,
  } = payload;
  try {
    let query_params = `?organization_uuid=${organization_uuid}`;

    const response = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}consortium/?organization_uuid=${organization_uuid}`,
    );
    const consortium_uuid = _.join(_.map(response.data, 'consortium_uuid'), ',');
    if (consortium_uuid) {
      query_params = query_params.concat(`&consortium_uuid=${consortium_uuid}`);
    }
    if (status) {
      query_params = query_params.concat(`&status=${status}`);
    }

    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${shipmentApiEndPoint}shipment/${query_params}`,
    );
    if (data && data.data) {
      const shipments = _.filter(data.data, (shipment) => _.toLower(shipment.platform_name) !== 'iclp');
      const uuids = _.toString(_.without(_.map(shipments, 'shipment_uuid'), null));
      const partnerIds = _.toString(_.without(_.map(shipments, 'partner_shipment_id'), null));
      const encodedUUIDs = encodeURIComponent(uuids);
      const encodedPartnerIds = encodeURIComponent(partnerIds);

      if (encodedUUIDs && fetchRelatedData) {
        yield put(getCustody(encodedUUIDs));
      }
      if (encodedPartnerIds && fetchRelatedData) {
        yield put(getAllSensorAlerts(encodedPartnerIds));
      }
      if (encodedPartnerIds && fetchSensorReports) {
        yield put(getSensorReports(encodedPartnerIds));
      }

      yield put({ type: GET_SHIPMENTS_SUCCESS, data: shipments });
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t load shipments due to some error!',
        }),
      ),
      yield put({ type: GET_SHIPMENTS_FAILURE, error }),
    ];
  }
}

function* watchGetShipment() {
  yield takeLatest(GET_SHIPMENTS, getShipmentList);
}

export default function* shipmentSaga() {
  yield all([
    watchGetShipment(),
  ]);
}
