/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-expressions */
import _ from 'lodash';
import {
  GET_CUSTODIANS,
  GET_CUSTODIANS_FAILURE,
  GET_CUSTODIANS_SUCCESS,
  ADD_CUSTODIANS,
  ADD_CUSTODIANS_SUCCESS,
  ADD_CUSTODIANS_FAILURE,
  EDIT_CUSTODIANS,
  EDIT_CUSTODIANS_SUCCESS,
  EDIT_CUSTODIANS_FAILURE,
  UPDATE_CUSTODIAN,
  UPDATE_CUSTODIAN_FAILURE,
  UPDATE_CUSTODIAN_SUCCESS,
  DELETE_CUSTODIANS,
  DELETE_CUSTODIANS_FAILURE,
  DELETE_CUSTODIANS_SUCCESS,
  GET_CUSTODY,
  GET_CUSTODY_SUCCESS,
  GET_CUSTODY_FAILURE,
  ADD_CUSTODY,
  ADD_CUSTODY_SUCCESS,
  ADD_CUSTODY_FAILURE,
  EDIT_CUSTODY,
  EDIT_CUSTODY_SUCCESS,
  EDIT_CUSTODY_FAILURE,
  UPDATE_CUSTODY,
  UPDATE_CUSTODY_SUCCESS,
  UPDATE_CUSTODY_FAILURE,
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

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  custodianData: null,
  custodianTypeList: null,
  contactInfo: null,
};

// Reducer
export default (state = initialState, action) => {
  let deletedType;
  let editedType = state.custodianTypeList;
  const typePresent = _.remove(
    editedType,
    { id: action.custodianType?.id },
  )[0];
  if (typePresent) {
    deletedType = editedType;
    editedType = [...editedType, action.custodianType];
  }

  switch (action.type) {
    case GET_CUSTODIANS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_CUSTODIANS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        custodianData: action.data,
      };

    case GET_CUSTODIANS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case ADD_CUSTODIANS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_CUSTODIANS_SUCCESS:
      const custodianData = state.custodianData || [];
      return {
        ...state,
        loading: false,
        loaded: true,
        custodianData: [...custodianData, action.data],
      };

    case ADD_CUSTODIANS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case EDIT_CUSTODIANS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case EDIT_CUSTODIANS_SUCCESS:
      const editCustodian = _.filter(state.custodianData, (data) => {
        data.id !== action.data.id;
      });

      return {
        ...state,
        loading: false,
        loaded: true,
        custodianData: [...editCustodian, action.data],
        error: null,
      };

    case EDIT_CUSTODIANS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case UPDATE_CUSTODIAN:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case UPDATE_CUSTODIAN_SUCCESS:
      const updatedCustodian = _.filter(state.custodianData, (data) => (
        data.id !== action.data.id
      ));

      return {
        ...state,
        loading: false,
        loaded: true,
        custodianData: [...updatedCustodian, action.data],
        error: null,
      };

    case UPDATE_CUSTODIAN_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case DELETE_CUSTODIANS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case DELETE_CUSTODIANS_SUCCESS:
      const deletedCustodian = _.filter(state.custodianData, (data) => (
        data.id !== action.id
      ));

      return {
        ...state,
        loading: false,
        loaded: true,
        custodianData: [...deletedCustodian, action.data],
      };

    case DELETE_CUSTODIANS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_CUSTODY:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_CUSTODY_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        custodyData: action.data,
      };

    case GET_CUSTODY_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case ADD_CUSTODY:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_CUSTODY_SUCCESS:
      const data = state.custodyData || [];
      return {
        ...state,
        loading: true,
        loaded: true,
        custodyData: [...data, action.data],
      };

    case ADD_CUSTODY_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case EDIT_CUSTODY:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case EDIT_CUSTODY_SUCCESS:
      const edited = _.filter(state.custodyData, (custody) => (
        custody.id !== action.data.id
      ));
      return {
        ...state,
        loading: false,
        loaded: true,
        custodyData: [...edited, action.data],
      };

    case EDIT_CUSTODY_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case UPDATE_CUSTODY:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case UPDATE_CUSTODY_SUCCESS:
      const updated = _.filter(state.custodyData, (custody) => (
        custody.id !== action.data.id
      ));

      return {
        ...state,
        loading: false,
        loaded: true,
        custodyData: [...updated, action.data],
      };

    case UPDATE_CUSTODY_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case DELETE_CUSTODY:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case DELETE_CUSTODY_SUCCESS:
      const deleted = _.filter(state.custodyData, (custody) => (
        custody.id !== action.id
      ));
      return {
        ...state,
        loading: false,
        loaded: true,
        custodyData: deleted,
      };

    case DELETE_CUSTODY_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_CUSTODIAN_TYPE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_CUSTODIAN_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        custodianTypeList: _.orderBy(
          action.data,
          ['id'],
          'asc',
        ),
      };

    case GET_CUSTODIAN_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case ADD_CUSTODIAN_TYPE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_CUSTODIAN_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        custodianTypeList: [
          ...state.custodianTypeList,
          action.custodianType,
        ],
      };

    case ADD_CUSTODIAN_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case EDIT_CUSTODIAN_TYPE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case EDIT_CUSTODIAN_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        custodianTypeList: editedType,
      };

    case EDIT_CUSTODIAN_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case DELETE_CUSTODIAN_TYPE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case DELETE_CUSTODIAN_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        custodianTypeList: deletedType,
      };

    case DELETE_CUSTODIAN_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_CONTACT:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_CONTACT_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        contactInfo: action.data,
      };

    case GET_CONTACT_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    default:
      return state;
  }
};
