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
  switch (action.type) {
    case GET_CUSTODIANS:
    case ADD_CUSTODIANS:
    case EDIT_CUSTODIANS:
    case UPDATE_CUSTODIAN:
    case DELETE_CUSTODIANS:
    case GET_CUSTODY:
    case ADD_CUSTODY:
    case EDIT_CUSTODY:
    case UPDATE_CUSTODY:
    case DELETE_CUSTODY:
    case GET_CUSTODIAN_TYPE:
    case ADD_CUSTODIAN_TYPE:
    case EDIT_CUSTODIAN_TYPE:
    case DELETE_CUSTODIAN_TYPE:
    case GET_CONTACT:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_CUSTODIANS_FAILURE:
    case ADD_CUSTODIANS_FAILURE:
    case EDIT_CUSTODIANS_FAILURE:
    case UPDATE_CUSTODIAN_FAILURE:
    case DELETE_CUSTODIANS_FAILURE:
    case GET_CUSTODY_FAILURE:
    case ADD_CUSTODY_FAILURE:
    case EDIT_CUSTODY_FAILURE:
    case UPDATE_CUSTODY_FAILURE:
    case DELETE_CUSTODY_FAILURE:
    case GET_CUSTODIAN_TYPE_FAILURE:
    case ADD_CUSTODIAN_TYPE_FAILURE:
    case EDIT_CUSTODIAN_TYPE_FAILURE:
    case DELETE_CUSTODIAN_TYPE_FAILURE:
    case GET_CONTACT_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_CUSTODIANS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        custodianData: action.data,
      };

    case ADD_CUSTODIANS_SUCCESS:
    case EDIT_CUSTODIANS_SUCCESS:
    case UPDATE_CUSTODIAN_SUCCESS: {
      const found = _.find(
        state.custodianData,
        { id: action.data.id },
      );
      const custodians = found
        ? _.map(state.custodianData, (custodian) => (
          custodian.id === action.data.id
            ? action.data
            : custodian
        ))
        : [...state.custodianData, action.data];
      return {
        ...state,
        loading: false,
        loaded: true,
        custodianData: custodians,
      };
    }

    case DELETE_CUSTODIANS_SUCCESS: {
      const { custodianData } = state;
      _.remove(custodianData, { id: action.data.id });

      return {
        ...state,
        loading: false,
        loaded: true,
        custodianData,
      };
    }

    case GET_CUSTODY_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        custodyData: action.data,
      };

    case ADD_CUSTODY_SUCCESS:
    case EDIT_CUSTODY_SUCCESS:
    case UPDATE_CUSTODY_SUCCESS: {
      const found = _.find(
        state.custodyData,
        { id: action.data.id },
      );
      const custodies = found
        ? _.map(state.custodyData, (custody) => (
          custody.id === action.data.id
            ? action.data
            : custody
        ))
        : [...state.custodianData, action.data];
      return {
        ...state,
        loading: false,
        loaded: true,
        custodyData: custodies,
      };
    }

    case DELETE_CUSTODY_SUCCESS: {
      const { custodyData } = state;
      _.remove(custodyData, { id: action.data.id });

      return {
        ...state,
        loading: false,
        loaded: true,
        custodyData,
      };
    }

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

    case ADD_CUSTODIAN_TYPE_SUCCESS:
    case EDIT_CUSTODIAN_TYPE_SUCCESS: {
      const found = _.find(
        state.custodianTypeList,
        { id: action.data.id },
      );
      const custodianTypes = found
        ? _.map(state.custodianTypeList, (custodianType) => (
          custodianType.id === action.data.id
            ? action.data
            : custodianType
        ))
        : [...state.custodianTypeList, action.data];

      return {
        ...state,
        loading: false,
        loaded: true,
        custodianTypeList: _.orderBy(
          custodianTypes,
          ['id'],
          'asc',
        ),
      };
    }
    case DELETE_CUSTODIAN_TYPE_SUCCESS: {
      const { custodianTypeList } = state;
      _.remove(
        custodianTypeList,
        { id: action.data.id },
      );
      return {
        ...state,
        loading: false,
        loaded: true,
        custodianTypeList: _.orderBy(
          custodianTypeList,
          ['id'],
          'asc',
        ),
      };
    }

    case GET_CONTACT_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        contactInfo: action.data,
      };

    default:
      return state;
  }
};
