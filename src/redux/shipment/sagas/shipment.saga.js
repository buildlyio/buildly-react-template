import {
  put, takeLatest, all, call,
} from 'redux-saga/effects';
import _ from 'lodash';
import { httpService } from '@modules/http/http.service';
import { environment } from '@environments/environment';
import { showAlert } from '@redux/alert/actions/alert.actions';
import {
  getAggregateReport,
  getSensorReportAlerts,
} from '@redux/sensorsGateway/actions/sensorsGateway.actions';
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
  GET_SHIPMENT_FLAG,
  GET_SHIPMENT_FLAG_FAILURE,
  GET_SHIPMENT_FLAG_SUCCESS,
  getShipmentFlag,
  ADD_SHIPMENT_FLAG,
  ADD_SHIPMENT_FLAG_SUCCESS,
  ADD_SHIPMENT_FLAG_FAILURE,
  EDIT_SHIPMENT_FLAG,
  EDIT_SHIPMENT_FLAG_SUCCESS,
  EDIT_SHIPMENT_FLAG_FAILURE,
  DELETE_SHIPMENT_FLAG,
  DELETE_SHIPMENT_FLAG_SUCCESS,
  DELETE_SHIPMENT_FLAG_FAILURE,
  GET_DASHBOARD_ITEMS,
  GET_DASHBOARD_ITEMS_SUCCESS,
  GET_DASHBOARD_ITEMS_FAILURE,
  EMAIL_ALERTS,
  ADD_PDF_IDENTIFIER,
  ADD_PDF_IDENTIFIER_SUCCESS,
  ADD_PDF_IDENTIFIER_FAILURE,
} from '../actions/shipment.actions';

const shipmentApiEndPoint = 'shipment/';

function* getShipmentList(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${environment.API_URL}${shipmentApiEndPoint}shipment/?organization_uuid=${payload.organization_uuid}`,
      null,
      true,
    );
    if (data && data.data) {
      yield [
        yield put(getShipmentFlag(payload.organization_uuid)),
        yield put({ type: GET_SHIPMENTS_SUCCESS, data: data.data }),
      ];
      if (payload.id) {
        yield put(
          saveShipmentFormData(
            data.data.find((shipment) => shipment.id === payload.id),
          ),
        );
      }

      const ids = _.toString(
        _.map(data.data, 'partner_shipment_id'),
      );
      const encodedIds = encodeURIComponent(ids);
      if (payload.getAggregateReport) {
        yield put(getAggregateReport(encodedIds));
      }
      if (payload.getReportAlerts) {
        yield put(getSensorReportAlerts(encodedIds));
      }
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
      `${environment.API_URL}${shipmentApiEndPoint}shipment/`,
      payload,
      true,
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
        getShipmentDetails(payload.organization_uuid, data.data.id),
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
  const { payload, history, redirectTo } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'put',
      `${environment.API_URL}${shipmentApiEndPoint}shipment/${payload.id}/`,
      payload,
      true,
    );
    yield [
      yield put(
        getShipmentDetails(payload.organization_uuid, payload.id),
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
      `${environment.API_URL}${shipmentApiEndPoint}shipment/${shipmentId}/`,
      null,
      true,
    );
    yield [
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Shipment deleted successfully!',
        }),
      ),
      yield put(getShipmentDetails(organization_uuid)),
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

function* getShipmentFlagList(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${environment.API_URL}${shipmentApiEndPoint}shipment_flag/?organization_uuid=${payload.organization_uuid}`,
      null,
      true,
    );
    const sortedData = _.orderBy(data.data, ['name'], ['asc']);
    yield put({
      type: GET_SHIPMENT_FLAG_SUCCESS,
      data: sortedData,
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
        type: GET_SHIPMENT_FLAG_FAILURE,
        error,
      }),
    ];
  }
}

function* addShipmentFlag(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${environment.API_URL}${shipmentApiEndPoint}shipment_flag/`,
      payload,
      true,
    );
    if (data && data.data) {
      yield [
        yield put({
          type: ADD_SHIPMENT_FLAG_SUCCESS,
          shipmentFlag: data.data,
        }),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Added Shipment Flag',
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
          message: 'Couldn\'t Add Shipment Flag due to some error!',
        }),
      ),
      yield put({
        type: ADD_SHIPMENT_FLAG_FAILURE,
        error,
      }),
    ];
  }
}

function* editShipmentFlag(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'put',
      `${environment.API_URL}${shipmentApiEndPoint}shipment_flag/${payload.id}`,
      payload,
      true,
    );
    if (data && data.data) {
      yield [
        yield put({
          type: EDIT_SHIPMENT_FLAG_SUCCESS,
          shipmentFlag: data.data,
        }),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully Edited Shipment Flag',
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
          message: 'Couldn\'t Edit Shipment Flag due to some error!',
        }),
      ),
      yield put({
        type: EDIT_SHIPMENT_FLAG_FAILURE,
        error,
      }),
    ];
  }
}

function* deleteShipmentFlag(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'delete',
      `${environment.API_URL}${shipmentApiEndPoint}shipment_flag/${payload.id}`,
      null,
      true,
    );
    yield [
      yield put({
        type: DELETE_SHIPMENT_FLAG_SUCCESS,
        shipmentFlag: { id: payload.id },
      }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Successfully Deleted Shipment Flag',
        }),
      ),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t Delete Shipment Flag due to some error!',
        }),
      ),
      yield put({
        type: DELETE_SHIPMENT_FLAG_FAILURE,
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
      `${environment.API_URL}${shipmentApiEndPoint}dashboard/?organization_uuid=${payload.organization_uuid}`,
      null,
      true,
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

function* sendEmailAlerts(payload) {
  try {
    const alerts = yield call(
      httpService.makeRequest,
      'post',
      `${environment.API_URL}coreuser/alert/`,
      payload.alerts,
    );
    yield put(
      showAlert({
        type: 'info',
        open: true,
        message: 'Email alerts sent successfully',
      }),
    );
  } catch (error) {
    yield put(
      showAlert({
        type: 'error',
        open: true,
        message: 'Couldn\'t send email alerts due to some error!',
      }),
    );
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
    const response = yield call(
      httpService.makeRequest,
      'post',
      `${environment.API_URL}${shipmentApiEndPoint}upload_file/`,
      data,
      true,
    );
    const uploaded_pdf = payload.uploaded_pdf
      ? [...payload.uploaded_pdf, filename]
      : [filename];
    const uploaded_pdf_link = payload.uploaded_pdf_link
      ? [...payload.uploaded_pdf_link, response.data['aws url']]
      : [response.data['aws url']];
    const unique_identifier = identifier || payload.unique_identifier;
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
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Successfully Added PDF and Unique Identifer',
        }),
      ),
    ];
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

function* watchGetShipmentFlag() {
  yield takeLatest(GET_SHIPMENT_FLAG, getShipmentFlagList);
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

function* watchGetDashboardItems() {
  yield takeLatest(GET_DASHBOARD_ITEMS, getDashboard);
}

function* watchEmailAlerts() {
  yield takeLatest(EMAIL_ALERTS, sendEmailAlerts);
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
    watchGetShipmentFlag(),
    watchAddShipmentFlag(),
    watchEditShipmentFlag(),
    watchDeleteShipmentFlag(),
    watchGetDashboardItems(),
    watchEmailAlerts(),
    watchPdfIdentifier(),
  ]);
}
