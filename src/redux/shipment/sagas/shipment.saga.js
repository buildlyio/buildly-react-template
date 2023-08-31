import {
  put, takeLatest, all, call,
} from 'redux-saga/effects';
import Geocode from 'react-geocode';
import _ from 'lodash';
import { httpService } from '../../../modules/http/http.service';
import { showAlert } from '../../alert/actions/alert.actions';
import { addCustody, editCustody, getCustody } from '../../custodian/actions/custodian.actions';
import { editGateway, getAllSensorAlerts, getSensorReports } from '../../sensorsGateway/actions/sensorsGateway.actions';
import {
  GET_SHIPMENTS,
  GET_SHIPMENTS_SUCCESS,
  GET_SHIPMENTS_FAILURE,
  ADD_SHIPMENT,
  ADD_SHIPMENT_SUCCESS,
  ADD_SHIPMENT_FAILURE,
  EDIT_SHIPMENT,
  EDIT_SHIPMENT_SUCCESS,
  EDIT_SHIPMENT_FAILURE,
  DELETE_SHIPMENT,
  DELETE_SHIPMENT_SUCCESS,
  DELETE_SHIPMENT_FAILURE,
  GET_COUNTRIES_STATES,
  GET_COUNTRIES_STATES_SUCCESS,
  GET_COUNTRIES_STATES_FAILURE,
  GET_CURRENCIES,
  GET_CURRENCIES_SUCCESS,
  GET_CURRENCIES_FAILURE,
  GET_SHIPMENT_TEMPLATES,
  GET_SHIPMENT_TEMPLATES_SUCCESS,
  GET_SHIPMENT_TEMPLATES_FAILURE,
  ADD_SHIPMENT_TEMPLATE,
  ADD_SHIPMENT_TEMPLATE_SUCCESS,
  ADD_SHIPMENT_TEMPLATE_FAILURE,
  EDIT_SHIPMENT_TEMPLATE,
  EDIT_SHIPMENT_TEMPLATE_SUCCESS,
  EDIT_SHIPMENT_TEMPLATE_FAILURE,
  DELETE_SHIPMENT_TEMPLATE,
  DELETE_SHIPMENT_TEMPLATE_SUCCESS,
  DELETE_SHIPMENT_TEMPLATE_FAILURE,
} from '../actions/shipment.actions';

const shipmentApiEndPoint = 'shipment/';

function* getLocations(carrierLocations) {
  Geocode.setApiKey(window.env.GEO_CODE_API);
  Geocode.setLanguage('en');

  const reponses = yield all(_.map(carrierLocations, (loc) => (
    Geocode.fromAddress(loc)
  )));
  const locations = _.map(reponses, (res) => {
    const { lat, lng } = res.results[0].geometry.location;
    return `${lat},${lng}`;
  });

  return locations;
}

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

function* addShipment(action) {
  const { history, payload, redirectTo } = action;
  const {
    start_custody, end_custody, files, carriers, updateGateway,
  } = payload;

  try {
    let shipmentPayload = payload.shipment;
    let uploadFile = null;

    if (!_.isEmpty(files)) {
      const responses = yield all(_.map(files, (file) => {
        uploadFile = new FormData();
        uploadFile.append('file', file, file.name);

        return call(
          httpService.makeRequest,
          'post',
          `${window.env.API_URL}${shipmentApiEndPoint}upload_file/`,
          uploadFile,
        );
      }));

      shipmentPayload = {
        ...shipmentPayload,
        uploaded_pdf: _.map(files, 'name'),
        uploaded_pdf_link: _.map(_.flatMap(_.map(responses, 'data')), 'aws url'),
      };
    }

    const data = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${shipmentApiEndPoint}shipment/`,
      shipmentPayload,
    );
    if (start_custody && data.data) {
      yield put(addCustody({
        ...start_custody,
        shipment_id: data.data.shipment_uuid,
        shipment: data.data.id,
      }));
    }
    if (end_custody && data.data) {
      yield put(addCustody({
        ...end_custody,
        shipment_id: data.data.shipment_uuid,
        shipment: data.data.id,
      }));
    }
    if (!_.isEmpty(carriers) && data.data) {
      const locations = yield getLocations(_.map(carriers, 'location'));

      yield all(_.map(carriers, (carrier, index) => (
        put(addCustody({
          ...carrier,
          start_of_custody_location: locations[index],
          end_of_custody_location: locations[index],
          shipment_id: data.data.shipment_uuid,
          shipment: data.data.id,
        }))
      )));
    }
    if (updateGateway && data.data) {
      yield call(
        httpService.makeRequest,
        'patch',
        `${window.env.API_URL}${shipmentApiEndPoint}shipment/${data.data.id}`,
        {
          ...shipmentPayload,
          gateway_ids: [updateGateway.gateway_uuid],
          gateway_imei: [_.toString(updateGateway.imei_number)],
        },
      );
      yield put(editGateway({
        ...updateGateway,
        gateway_status: 'assigned',
        shipment_ids: [data.data.partner_shipment_id],
      }));
    }

    yield [
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Successfully added shipment',
        }),
      ),
      yield put({ type: ADD_SHIPMENT_SUCCESS, shipment: data.data }),
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
          message: 'Error in creating shipment',
        }),
      ),
      yield put({ type: ADD_SHIPMENT_FAILURE, error }),
    ];
  }
}

function* editShipment(action) {
  const { history, payload, redirectTo } = action;
  const {
    start_custody, end_custody, files, carriers, updateGateway, deleteFiles,
  } = payload;

  try {
    let shipmentPayload = payload.shipment;
    let uploadFile = null;

    if (!_.isEmpty(files)) {
      const responses = yield all(_.map(files, (file) => {
        uploadFile = new FormData();
        uploadFile.append('file', file, file.name);

        return call(
          httpService.makeRequest,
          'post',
          `${window.env.API_URL}${shipmentApiEndPoint}upload_file/`,
          uploadFile,
        );
      }));

      shipmentPayload = {
        ...shipmentPayload,
        uploaded_pdf: shipmentPayload.uploaded_pdf
          ? [...shipmentPayload.uploaded_pdf, ..._.map(files, 'name')]
          : _.map(files, 'name'),
        uploaded_pdf_link: shipmentPayload.uploaded_pdf_link
          ? [...shipmentPayload.uploaded_pdf_link, ..._.map(_.flatMap(_.map(responses, 'data')), 'aws url')]
          : _.map(_.flatMap(_.map(responses, 'data')), 'aws url'),
      };
    }

    if (!_.isEmpty(deleteFiles)) {
      const responses = yield all(_.map(deleteFiles, (file) => (
        call(
          httpService.makeRequest,
          'post',
          `${window.env.API_URL}${shipmentApiEndPoint}delete_file/`,
          { filename: file },
        )
      )));
    }

    if (!_.isEmpty(updateGateway)) {
      shipmentPayload = {
        ...shipmentPayload,
        gateway_ids: [updateGateway.gateway_uuid],
        gateway_imei: [_.toString(updateGateway.imei_number)],
      };
    }

    const data = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}${shipmentApiEndPoint}shipment/${shipmentPayload.id}`,
      shipmentPayload,
    );

    if (updateGateway && data.data) {
      let gateway_status = '';
      let shipment_ids = [];
      switch (data.data.status) {
        case 'Completed':
        case 'Cancelled':
          gateway_status = 'unavailable';
          shipment_ids = [];
          break;

        case 'Planned':
        case 'Enroute':
          gateway_status = 'assigned';
          shipment_ids = [data.data.partner_shipment_id];
          break;

        default:
          break;
      }

      yield put(editGateway({
        ...updateGateway,
        gateway_status,
        shipment_ids,
      }));
    }
    if (start_custody && data.data) {
      if (start_custody.id) {
        yield put(editCustody(start_custody));
      } else {
        yield put(addCustody({
          ...start_custody,
          shipment_id: data.data.shipment_uuid,
          shipment: data.data.id,
        }));
      }
    }
    if (end_custody && data.data) {
      if (end_custody.id) {
        yield put(editCustody(end_custody));
      } else {
        yield put(addCustody({
          ...end_custody,
          shipment_id: data.data.shipment_uuid,
          shipment: data.data.id,
        }));
      }
    }
    if (!_.isEmpty(carriers) && data.data) {
      const locations = yield getLocations(_.map(carriers, 'location'));

      yield all(_.map(carriers, (carrier, index) => {
        if (carrier.id) {
          return put(editCustody({
            ...carrier,
            start_of_custody_location: locations[index],
            end_of_custody_location: locations[index],
          }));
        }
        return put(addCustody({
          ...carrier,
          start_of_custody_location: locations[index],
          end_of_custody_location: locations[index],
          shipment_id: data.data.shipment_uuid,
          shipment: data.data.id,
        }));
      }));
    }

    yield [
      yield put({ type: EDIT_SHIPMENT_SUCCESS, shipment: data.data }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Shipment successfully edited!',
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
          message: 'Error in updating Shipment!',
        }),
      ),
      yield put({ type: EDIT_SHIPMENT_FAILURE, error }),
    ];
  }
}

function* deleteShipment(payload) {
  try {
    yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${shipmentApiEndPoint}shipment/${payload.id}/`,
    );
    yield [
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Shipment deleted successfully!',
        }),
      ),
      yield put({ type: DELETE_SHIPMENT_SUCCESS, id: payload.id }),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in deleting shipment!',
        }),
      ),
      yield put({ type: DELETE_SHIPMENT_FAILURE, error }),
    ];
  }
}

function* getCountries() {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      'https://countriesnow.space/api/v0.1/countries/states',
    );
    if (data && data.data && data.data.data) {
      let countries = [];
      _.forEach(data.data.data, (country) => {
        if (!_.includes(
          ['cuba', 'iran', 'north korea', 'russia', 'syria', 'venezuela'],
          _.toLower(country.name),
        )) {
          countries = [
            ...countries,
            {
              country: country.name,
              iso3: country.iso3,
              states: _.sortBy(_.without(_.uniq(country.states), [''])),
            },
          ];
        }
      });
      countries = _.uniqBy(countries, 'country');
      yield put({ type: GET_COUNTRIES_STATES_SUCCESS, countries });
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t load countries and related states due to some error!',
        }),
      ),
      yield put({ type: GET_COUNTRIES_STATES_FAILURE, error }),
    ];
  }
}

function* getCurrencies() {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      'https://countriesnow.space/api/v0.1/countries/currency',
    );
    if (data && data.data && data.data.data) {
      const currencies = _.uniqBy(_.map(
        data.data.data, (curr) => ({ country: curr.iso3, currency: curr.currency }),
      ), 'country');
      yield put({ type: GET_CURRENCIES_SUCCESS, currencies });
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t load currencies due to some error!',
        }),
      ),
      yield put({ type: GET_CURRENCIES_FAILURE, error }),
    ];
  }
}

function* getShipmentTemplates(payload) {
  const { organization_uuid } = payload;
  try {
    const response = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${shipmentApiEndPoint}shipment_template/?organization_uuid=${organization_uuid}`,
    );
    yield put({ type: GET_SHIPMENT_TEMPLATES_SUCCESS, data: response.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t load shipment template(s) due to some error!',
        }),
      ),
      yield put({ type: GET_SHIPMENT_TEMPLATES_FAILURE, error }),
    ];
  }
}

function* addShipmentTemplate(action) {
  const { payload } = action;
  try {
    const response = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${shipmentApiEndPoint}shipment_template/`,
      payload,
    );

    yield [
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: `Successfully added template ${response.data.name}`,
        }),
      ),
      yield put({ type: ADD_SHIPMENT_TEMPLATE_SUCCESS, template: response.data }),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in creating shipment template',
        }),
      ),
      yield put({ type: ADD_SHIPMENT_TEMPLATE_FAILURE, error }),
    ];
  }
}

function* editShipmentTemplate(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}${shipmentApiEndPoint}shipment_template/${payload.id}/`,
      payload,
    );

    yield [
      yield put({ type: EDIT_SHIPMENT_TEMPLATE_SUCCESS, template: data.data }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: `Successfully edited template ${data.data.name}`,
        }),
      ),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in updating shipment template!',
        }),
      ),
      yield put({ type: EDIT_SHIPMENT_TEMPLATE_FAILURE, error }),
    ];
  }
}

function* deleteShipmentTemplate(action) {
  const { id, showMessage } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${shipmentApiEndPoint}shipment_template/${id}/`,
    );

    yield put({ type: DELETE_SHIPMENT_TEMPLATE_SUCCESS, id });
    if (showMessage) {
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Successfully deleted template',
        }),
      );
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in deleting shipment template!',
        }),
      ),
      yield put({ type: DELETE_SHIPMENT_TEMPLATE_FAILURE, error }),
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

function* watchGetCountries() {
  yield takeLatest(GET_COUNTRIES_STATES, getCountries);
}

function* watchGetCurrencies() {
  yield takeLatest(GET_CURRENCIES, getCurrencies);
}

function* watchGetShipmentTemplates() {
  yield takeLatest(GET_SHIPMENT_TEMPLATES, getShipmentTemplates);
}

function* watchAddShipmentTemplate() {
  yield takeLatest(ADD_SHIPMENT_TEMPLATE, addShipmentTemplate);
}

function* watchEditShipmentTemplate() {
  yield takeLatest(EDIT_SHIPMENT_TEMPLATE, editShipmentTemplate);
}

function* watchDeleteShipmentTemplate() {
  yield takeLatest(DELETE_SHIPMENT_TEMPLATE, deleteShipmentTemplate);
}

export default function* shipmentSaga() {
  yield all([
    watchGetShipment(),
    watchAddShipment(),
    watchDeleteShipment(),
    watchEditShipment(),
    watchGetCountries(),
    watchGetCurrencies(),
    watchGetShipmentTemplates(),
    watchAddShipmentTemplate(),
    watchEditShipmentTemplate(),
    watchDeleteShipmentTemplate(),
  ]);
}
