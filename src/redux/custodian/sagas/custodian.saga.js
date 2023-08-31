import {
  put, takeLatest, all, call,
} from 'redux-saga/effects';
import { httpService } from '../../../modules/http/http.service';
import { showAlert } from '../../alert/actions/alert.actions';
import {
  GET_CUSTODIANS,
  GET_CUSTODIANS_SUCCESS,
  GET_CUSTODIANS_FAILURE,
  ADD_CUSTODIANS,
  ADD_CUSTODIANS_SUCCESS,
  ADD_CUSTODIANS_FAILURE,
  EDIT_CUSTODIANS,
  EDIT_CUSTODIANS_SUCCESS,
  EDIT_CUSTODIANS_FAILURE,
  DELETE_CUSTODIANS,
  DELETE_CUSTODIANS_SUCCESS,
  DELETE_CUSTODIANS_FAILURE,
  getContact,
  GET_CUSTODY,
  GET_CUSTODY_SUCCESS,
  GET_CUSTODY_FAILURE,
  ADD_CUSTODY,
  ADD_CUSTODY_SUCCESS,
  ADD_CUSTODY_FAILURE,
  EDIT_CUSTODY,
  EDIT_CUSTODY_SUCCESS,
  EDIT_CUSTODY_FAILURE,
  DELETE_CUSTODY,
  DELETE_CUSTODY_SUCCESS,
  DELETE_CUSTODY_FAILURE,
  GET_CUSTODIAN_TYPE,
  GET_CUSTODIAN_TYPE_SUCCESS,
  GET_CUSTODIAN_TYPE_FAILURE,
  ADD_CUSTODIAN_TYPE,
  ADD_CUSTODIAN_TYPE_SUCCESS,
  ADD_CUSTODIAN_TYPE_FAILURE,
  EDIT_CUSTODIAN_TYPE,
  EDIT_CUSTODIAN_TYPE_SUCCESS,
  EDIT_CUSTODIAN_TYPE_FAILURE,
  DELETE_CUSTODIAN_TYPE,
  DELETE_CUSTODIAN_TYPE_SUCCESS,
  DELETE_CUSTODIAN_TYPE_FAILURE,
  GET_CONTACT,
  GET_CONTACT_SUCCESS,
  GET_CONTACT_FAILURE,
} from '../actions/custodian.actions';

const custodiansApiEndPoint = 'custodian/';

function* getCustodiansList(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${custodiansApiEndPoint}custodian/?organization_uuid=${payload.organization_uuid}`,
    );
    yield put({ type: GET_CUSTODIANS_SUCCESS, data: data.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t load custodians due to some error!',
        }),
      ),
      yield put({ type: GET_CUSTODIANS_FAILURE, error }),
    ];
  }
}

function* addCustodian(action) {
  const {
    custodian, contact, history, redirectTo,
  } = action;
  try {
    const contactData = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${custodiansApiEndPoint}contact/`,
      contact,
    );
    if (contactData && contactData.data) {
      const contactInfo = contactData.data.url;
      let custodianPayload = {
        ...custodian,
        contact_data: [contactInfo],
      };

      if (!custodian.custody_org_uuid) {
        const response = yield call(
          httpService.makeRequest,
          'post',
          `${window.env.API_URL}organization/`,
          { name: custodianPayload.name, organization_type: 1 },
        );
        if (response && response.data) {
          custodianPayload = {
            ...custodianPayload,
            custody_org_uuid: response.data.organization_uuid,
          };
        }
      }

      const data = yield call(
        httpService.makeRequest,
        'post',
        `${window.env.API_URL}${custodiansApiEndPoint}custodian/`,
        custodianPayload,
      );
      if (data && data.data) {
        yield [
          yield put({ type: ADD_CUSTODIANS_SUCCESS, data: data.data }),
          yield put(
            showAlert({
              type: 'success',
              open: true,
              message: 'Successfully added custodian. Please ensure your organization admin assigns an organization to this custodian',
            }),
          ),
          yield put(getContact(data.data.organization_uuid)),
        ];
        if (history && redirectTo) {
          yield call(history.push, redirectTo);
        }
      }
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in creating custodian',
        }),
      ),
      yield put({ type: ADD_CUSTODIANS_FAILURE, error }),
    ];
  }
}

function* editCustodian(action) {
  const {
    custodian, contact, history, redirectTo,
  } = action;
  try {
    if (contact) {
      const contactData = yield call(
        httpService.makeRequest,
        'patch',
        `${window.env.API_URL}${custodiansApiEndPoint}contact/${contact.id}/`,
        contact,
      );
    }

    const data = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}${custodiansApiEndPoint}custodian/${custodian.id}/`,
      custodian,
    );
    if (data && data.data) {
      yield [
        yield put({ type: EDIT_CUSTODIANS_SUCCESS, data: data.data }),
        yield put(getContact(data.data.organization_uuid)),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Custodian successfully edited!',
          }),
        ),
      ];
      if (history && redirectTo) {
        yield call(history.push, redirectTo);
      }
    }
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t edit custodian!',
        }),
      ),
      yield put({ type: EDIT_CUSTODIANS_FAILURE, error }),
    ];
  }
}

function* deleteCustodian(payload) {
  const { custodianId, contactId } = payload;
  try {
    yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${custodiansApiEndPoint}custodian/${custodianId}/`,
    );
    yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${custodiansApiEndPoint}contact/${contactId}/`,
    );
    yield [
      yield put({
        type: DELETE_CUSTODIANS_SUCCESS,
        data: { custodianId: payload.custodianId, contactId: payload.contactId },
      }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Custodian deleted successfully!',
        }),
      ),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in deleting custodian!',
        }),
      ),
      yield put({ type: DELETE_CUSTODIANS_FAILURE, error }),
    ];
  }
}

function* getCustodyList(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${custodiansApiEndPoint}custody/?shipment_id=${payload.shipmentIds}`,
    );
    yield put({ type: GET_CUSTODY_SUCCESS, data: data.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t load custodies due to some error!',
        }),
      ),
      yield put({ type: GET_CUSTODY_FAILURE, error }),
    ];
  }
}

function* addCustody(action) {
  const { payload } = action;
  try {
    const custodyResponse = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${custodiansApiEndPoint}custody/`,
      payload,
    );
    if (custodyResponse && custodyResponse.data) {
      yield [
        yield put({ type: ADD_CUSTODY_SUCCESS, data: custodyResponse.data }),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully added custody',
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
          message: 'Couldn\'t add custody due to some error!',
        }),
      ),
      yield put({ type: ADD_CUSTODY_FAILURE, error }),
    ];
  }
}

function* editCustody(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}${custodiansApiEndPoint}custody/${payload.id}/`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put({ type: EDIT_CUSTODY_SUCCESS, data: data.data }),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully edited custody',
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
          message: 'Couldn\'t edit custody due to some error!',
        }),
      ),
      yield put({ type: EDIT_CUSTODY_FAILURE, error }),
    ];
  }
}

function* deleteCustody(payload) {
  try {
    yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${custodiansApiEndPoint}custody/${payload.custodyId}/`,
    );
    yield [
      yield put({ type: DELETE_CUSTODY_SUCCESS, data: { id: payload.custodyId } }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Custody deleted successfully!',
        }),
      ),

    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Error in deleting Custody!',
        }),
      ),
      yield put({ type: DELETE_CUSTODY_FAILURE, error }),
    ];
  }
}

function* getCustodianType() {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${custodiansApiEndPoint}custodian_type/`,
    );
    yield put({
      type: GET_CUSTODIAN_TYPE_SUCCESS,
      data: data.data,
    });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t load custodian types due to some error!',
        }),
      ),
      yield put({ type: GET_CUSTODIAN_TYPE_FAILURE, error }),
    ];
  }
}

function* addCustodianType(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'post',
      `${window.env.API_URL}${custodiansApiEndPoint}custodian_type/`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put({
          type: ADD_CUSTODIAN_TYPE_SUCCESS,
          data: data.data,
        }),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully added custodian type',
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
          message: 'Couldn\'t add custodian type due to some error!',
        }),
      ),
      yield put({ type: ADD_CUSTODIAN_TYPE_FAILURE, error }),
    ];
  }
}

function* editCustodianType(action) {
  const { payload } = action;
  try {
    const data = yield call(
      httpService.makeRequest,
      'patch',
      `${window.env.API_URL}${custodiansApiEndPoint}custodian_type/${payload.id}`,
      payload,
    );
    if (data && data.data) {
      yield [
        yield put({
          type: EDIT_CUSTODIAN_TYPE_SUCCESS,
          data: data.data,
        }),
        yield put(
          showAlert({
            type: 'success',
            open: true,
            message: 'Successfully edited custodian type',
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
          message: 'Couldn\'t edit custodian type due to some error!',
        }),
      ),
      yield put({ type: EDIT_CUSTODIAN_TYPE_FAILURE, error }),
    ];
  }
}

function* deleteCustodianType(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'delete',
      `${window.env.API_URL}${custodiansApiEndPoint}custodian_type/${payload.id}`,
    );
    yield [
      yield put({
        type: DELETE_CUSTODIAN_TYPE_SUCCESS,
        data: { id: payload.id },
      }),
      yield put(
        showAlert({
          type: 'success',
          open: true,
          message: 'Successfully deleted custodian type',
        }),
      ),
    ];
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t delete custodian type due to some error!',
        }),
      ),
      yield put({ type: DELETE_CUSTODIAN_TYPE_FAILURE, error }),
    ];
  }
}

function* getContactInfo(payload) {
  try {
    const data = yield call(
      httpService.makeRequest,
      'get',
      `${window.env.API_URL}${custodiansApiEndPoint}contact/?organization_uuid=${payload.organization_uuid}`,
    );
    yield put({ type: GET_CONTACT_SUCCESS, data: data.data });
  } catch (error) {
    yield [
      yield put(
        showAlert({
          type: 'error',
          open: true,
          message: 'Couldn\'t load contact info!',
        }),
      ),
      yield put({ type: GET_CONTACT_FAILURE, error }),
    ];
  }
}

function* watchGetCustodian() {
  yield takeLatest(GET_CUSTODIANS, getCustodiansList);
}
function* watchAddCustodian() {
  yield takeLatest(ADD_CUSTODIANS, addCustodian);
}

function* watchEditCustodian() {
  yield takeLatest(EDIT_CUSTODIANS, editCustodian);
}

function* watchDeleteCustodian() {
  yield takeLatest(DELETE_CUSTODIANS, deleteCustodian);
}

function* watchGetCustody() {
  yield takeLatest(GET_CUSTODY, getCustodyList);
}

function* watchAddCustody() {
  yield takeLatest(ADD_CUSTODY, addCustody);
}

function* watchEditCustody() {
  yield takeLatest(EDIT_CUSTODY, editCustody);
}

function* watchDeleteCustody() {
  yield takeLatest(DELETE_CUSTODY, deleteCustody);
}

function* watchGetCustodianType() {
  yield takeLatest(GET_CUSTODIAN_TYPE, getCustodianType);
}

function* watchAddCustodianType() {
  yield takeLatest(ADD_CUSTODIAN_TYPE, addCustodianType);
}

function* watchEditCustodianType() {
  yield takeLatest(EDIT_CUSTODIAN_TYPE, editCustodianType);
}

function* watchDeleteCustodianType() {
  yield takeLatest(DELETE_CUSTODIAN_TYPE, deleteCustodianType);
}

function* watchGetContact() {
  yield takeLatest(GET_CONTACT, getContactInfo);
}

export default function* custodianSaga() {
  yield all([
    watchGetCustodian(),
    watchAddCustodian(),
    watchEditCustodian(),
    watchDeleteCustodian(),
    watchGetCustody(),
    watchAddCustody(),
    watchEditCustody(),
    watchDeleteCustody(),
    watchGetCustodianType(),
    watchAddCustodianType(),
    watchEditCustodianType(),
    watchDeleteCustodianType(),
    watchGetContact(),
  ]);
}
