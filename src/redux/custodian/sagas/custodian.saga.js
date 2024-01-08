import {
  put, takeLatest, all, call,
} from 'redux-saga/effects';
import { httpService } from '../../../modules/http/http.service';
import { showAlert } from '../../alert/actions/alert.actions';
import {
  GET_CUSTODY,
  GET_CUSTODY_SUCCESS,
  GET_CUSTODY_FAILURE,
} from '../actions/custodian.actions';

const custodiansApiEndPoint = 'custodian/';

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

function* watchGetCustody() {
  yield takeLatest(GET_CUSTODY, getCustodyList);
}

export default function* custodianSaga() {
  yield all([
    watchGetCustody(),
  ]);
}
