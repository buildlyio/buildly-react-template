import {
  GET_ITEMS,
  GET_ITEMS_SUCCESS,
  GET_ITEMS_FAILURE,
  ADD_ITEMS,
  ADD_ITEMS_SUCCESS,
  ADD_ITEMS_FAILURE,
  EDIT_ITEMS,
  EDIT_ITEMS_SUCCESS,
  EDIT_ITEMS_FAILURE,
  DELETE_ITEMS,
  DELETE_ITEMS_SUCCESS,
  GET_ITEMS_TYPE,
  GET_ITEMS_TYPE_SUCCESS,
  GET_ITEMS_TYPE_FAILURE,
  SEARCH,
  SEARCH_SUCCESS,
  DELETE_ITEMS_FAILURE,
  GET_UNITS_OF_MEASURE,
  GET_UNITS_OF_MEASURE_SUCCESS,
  GET_UNITS_OF_MEASURE_FAILURE,
} from "../actions/items.actions";

const initialState = {
  loading: false,
  loaded: false,
  itemData: null,
  error: null,
  itemTypeList: null,
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ITEMS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case GET_ITEMS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        itemData: action.data,
      };
    case GET_ITEMS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case ADD_ITEMS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case ADD_ITEMS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        itemData: action.data,
      };
    case ADD_ITEMS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case EDIT_ITEMS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case EDIT_ITEMS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        itemData: action.data,
        error: null,
      };

    case EDIT_ITEMS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case DELETE_ITEMS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case DELETE_ITEMS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        itemData: action.data,
      };
    case DELETE_ITEMS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case SEARCH:
      return {
        ...state,
        error: null,
      };
    case SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        searchedData: action.data,
      };
    case GET_ITEMS_TYPE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case GET_ITEMS_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        itemTypeList: action.data,
      };
    case GET_ITEMS_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case GET_UNITS_OF_MEASURE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case GET_UNITS_OF_MEASURE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        unitsOfMeasure: action.data,
      };
    case GET_UNITS_OF_MEASURE_FAILURE:
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
