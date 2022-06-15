import {
  put, takeLatest, all, call, delay,
} from 'redux-saga/effects';
import _ from 'lodash';
import { httpService } from '@modules/http/http.service';
import { showAlert } from '@redux/alert/actions/alert.actions';
import {
  getAggregateReport,
  editGateway,
  getAllSensorAlerts,
  GET_ALL_SENSOR_ALERTS_SUCCESS,
  GET_AGGREGATE_REPORT_SUCCESS,
} from '@redux/sensorsGateway/actions/sensorsGateway.actions';
import {
  getCustody,
} from '@redux/custodian/actions/custodian.actions';
import { routes } from '@routes/routesConstants';
import {
  saveShipmentFormData,
  GET_SHIPMENTS,
  GET_SHIPMENTS_SUCCESS,
  GET_SHIPMENTS_FAILURE,
  getShipmentDetails,
  ADD_SHIPMENT,
  ADD_SHIPMENT_FAILURE,
  EDIT_SHIPMENT,
  EDIT_SHIPMENT_FAILURE,
  DELETE_SHIPMENT,
  DELETE_SHIPMENT_FAILURE,
  GET_DASHBOARD_ITEMS_SUCCESS,
  GET_DASHBOARD_ITEMS_FAILURE,
  ADD_PDF_IDENTIFIER,
  ADD_PDF_IDENTIFIER_SUCCESS,
  ADD_PDF_IDENTIFIER_FAILURE,
} from '../actions/shipment.actions';
import { GET_CUSTODY_SUCCESS } from '../../custodian/actions/custodian.actions';

const shipmentApiEndPoint = 'shipment/';

function* processShipments(payload, data) {
  let uuids = '';
  if (data instanceof Array) {
    const UUIDS = _.map(data, 'shipment_uuid');
    uuids = _.toString(_.without(UUIDS, null));
  } else {
    uuids = data.shipment_uuid;
  }

  if (payload.id && data.length > 0) {
    yield put(
      saveShipmentFormData(
        data.find((shipment) => shipment.id === payload.id),
      ),
    );
  } else if (typeof (data) === 'object' && data.length === undefined) {
    yield put(
      saveShipmentFormData(
        data,
      ),
    );
  }
  // Fetch updated custody
  const encodedUUIDs = encodeURIComponent(uuids);
  if (payload.getUpdatedCustody && encodedUUIDs) {
    yield [
      yield put(getCustody(encodedUUIDs)),
    ];
  } else {
    yield put({
      type: GET_CUSTODY_SUCCESS,
      data: [],
    });
  }

  // Fetch new aggregate reports
  const IDS = _.map(data, 'partner_shipment_id');
  const ids = _.toString(_.without(IDS, null));
  const encodedIds = encodeURIComponent(ids);
  if (payload.getUpdatedSensorData && encodedIds) {
    const chunks = _.chunk(_.without(IDS, null), 25);
    yield [
      yield all(chunks.map(
        (chunk) => put(getAggregateReport(encodeURIComponent(chunk))),
        delay(500),
      )),
      yield put(getAllSensorAlerts(encodedIds)),
    ];
  } else {
    yield [
      yield put({
        type: GET_AGGREGATE_REPORT_SUCCESS,
        data: [],
      }),
      yield put({
        type: GET_ALL_SENSOR_ALERTS_SUCCESS,
        data: [],
      }),
    ];
  }
}

function* getShipmentList(payload) {
  try {
    let query_params;
    if (payload.id) {
      query_params = `${payload.id}/`;
    } else {
      const response = yield call(
        httpService.makeRequest,
        'get',
        `${window.env.API_URL}consortium/?organization_uuid=${payload.organization_uuid}`,
      );
      const consortium_uuid = _.join(_.map(response.data, 'consortium_uuid'), ',');
      query_params = `?organization_uuid=${payload.organization_uuid}`;
      if (payload.status) {
        // eslint-disable-next-line no-param-reassign
        payload.status = encodeURIComponent(payload.status);
        query_params = query_params.concat(`&status=${payload.status}`);
      }
      if (consortium_uuid) {
        query_params = query_params.concat(`&consortium_uuid=${consortium_uuid}`);
      }
    }
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${shipmentApiEndPoint}shipment/${query_params}`,
    );
    if (data && data.data) {
      let shipment_data = data.data;
      if (data.data instanceof Array) {
        shipment_data = _.filter(data.data, (shipment) => _.lowerCase(shipment.platform_name) !== 'iclp');
      }
      yield put({
        type: GET_SHIPMENTS_SUCCESS,
        data: shipment_data,
        shipmentAction: payload.shipmentAction,
        status: payload.status ? payload.status : 'All',
      });
      // Splitting code to take care of once the response is back
      yield processShipments(payload, shipment_data);
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t load data due to some error!',
        }),
      ),
      yield put({
        type: GET_SHIPMENTS_FAILURE,
        error,
      }),
    ];
  }
}

function* addShipment(action) {
  const { history, payload, redirectTo } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${shipmentApiEndPoint}shipment/`,
      payload,
    );
    yield [
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Successfully Added Shipment',
        }),
      ),
      yield put(
        getShipmentDetails(
          payload.organization_uuid,
          'Planned,Enroute',
          null,
          true,
          true,
          'add',
        ),
      ),
    ];
    if (history && redirectTo) {
      yield call(history.push, redirectTo);
    } else if (history && !redirectTo) {
      yield call(history.push, `${routes.SHIPMENT}/edit/:${data.data.id}`, {
        type: 'edit',
        data: data.data,
        from: routes.SHIPMENT,
      });
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in creating Shipment',
        }),
      ),
      yield put({
        type: ADD_SHIPMENT_FAILURE,
        error,
      }),
    ];
  }
}

function* editShipment(action) {
  const {
    payload, history, redirectTo, gateway,
  } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'put',
      `${window.env.API_URL}${shipmentApiEndPoint}shipment/${payload.id}/`,
      payload,
    );
    if (payload.gateway_ids.length > 0 && gateway && (!payload.status) in ['Completed', 'Cancelled']) {
      yield [
        yield put(
          editGateway(
            gateway,
          ),
        ),
      ];
    }
    yield [
      yield put(
        getShipmentDetails(
          payload.organization_uuid,
          'Planned,Enroute,Completed,Cancelled',
          null,
          false,
          true,
          'edit',
        ),
      ),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Shipment successfully Edited!',
        }),
      ),
    ];
    if (history && redirectTo) {
      yield call(history.push, redirectTo, {
        type: 'edit',
        data: data.data,
        from: routes.SHIPMENT,
      });
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in Updating Shipment!',
        }),
      ),
      yield put({
        type: EDIT_SHIPMENT_FAILURE,
        error,
      }),
    ];
  }
}

function* deleteShipment(payload) {
  const { shipmentId, organization_uuid } = payload;
  try {
    yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${shipmentApiEndPoint}shipment/${shipmentId}/`,
    );
    yield [
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Shipment deleted successfully!',
        }),
      ),
      yield put(getShipmentDetails(
        organization_uuid,
        'Planned,Enroute,Completed,Cancelled',
        null,
        true,
        true,
        'delete',
      )),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in deleting Shipment!',
        }),
      ),
      yield put({
        type: DELETE_SHIPMENT_FAILURE,
        error,
      }),
    ];
  }
}

function* getDashboard(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${shipmentApiEndPoint}dashboard/?organization_uuid=${payload.organization_uuid}`,
    );
    yield put({
      type: GET_DASHBOARD_ITEMS_SUCCESS,
      data: data.data,
    });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t load data due to some error!',
        }),
      ),
      yield put({
        type: GET_DASHBOARD_ITEMS_FAILURE,
        error,
      }),
    ];
  }
}

function* pdfIdentifier(action) {
  const {
    data,
    filename,
    identifier,
    payload,
    history,
    redirectTo,
    organization_uuid,
  } = action;
  try {
    let { uploaded_pdf, uploaded_pdf_link } = payload;
    if (data && filename) {
      const response = yield call(
        httpService.makeRequest,
        'post',
        `${window.env.API_URL}${shipmentApiEndPoint}upload_file/`,
        data,
      );
      uploaded_pdf = payload.uploaded_pdf
        ? [...payload.uploaded_pdf, filename]
        : [filename];
      uploaded_pdf_link = payload.uploaded_pdf_link
        ? [...payload.uploaded_pdf_link, response.data['aws url']]
        : [response.data['aws url']];
    }

    const unique_identifier = identifier;
    yield [
      yield put({
        type: ADD_PDF_IDENTIFIER_SUCCESS,
        uploaded_pdf,
        uploaded_pdf_link,
        unique_identifier,
      }),
      yield put({
        type: EDIT_SHIPMENT,
        payload: {
          ...payload,
          uploaded_pdf,
          uploaded_pdf_link,
          unique_identifier,
        },
        history,
        redirectTo,
        organization_uuid,
      }),
    ];
    if (data && filename && identifier) {
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Successfully Added PDF and Unique Identifer',
        }),
      );
    }
    if (data && filename && !identifier) {
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Successfully Added PDF',
        }),
      );
    }
    if (!data && !filename && identifier) {
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Successfully Added Unique Identifer',
        }),
      );
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t Upload Bill due to some error!',
        }),
      ),
      yield put({
        type: ADD_PDF_IDENTIFIER_FAILURE,
        error,
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

function* watchEditShipment() {
  yield takeLatest(EDIT_SHIPMENT, editShipment);
}

function* watchDeleteShipment() {
  yield takeLatest(DELETE_SHIPMENT, deleteShipment);
}

function* watchPdfIdentifier() {
  yield takeLatest(ADD_PDF_IDENTIFIER, pdfIdentifier);
}

export default function* shipmentSaga() {
  yield all([
    watchGetShipment(),
    watchAddShipment(),
    watchDeleteShipment(),
    watchEditShipment(),
    watchPdfIdentifier(),
  ]);
}
