import _ from 'lodash';
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
  DELETE_ITEMS_FAILURE,
  GET_ITEMS_TYPE,
  GET_ITEMS_TYPE_SUCCESS,
  GET_ITEMS_TYPE_FAILURE,
  ADD_ITEMS_TYPE,
  ADD_ITEMS_TYPE_SUCCESS,
  ADD_ITEMS_TYPE_FAILURE,
  EDIT_ITEMS_TYPE,
  EDIT_ITEMS_TYPE_SUCCESS,
  EDIT_ITEMS_TYPE_FAILURE,
  DELETE_ITEMS_TYPE,
  DELETE_ITEMS_TYPE_SUCCESS,
  DELETE_ITEMS_TYPE_FAILURE,
  GET_PRODUCTS,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FAILURE,
  ADD_PRODUCTS,
  ADD_PRODUCTS_SUCCESS,
  ADD_PRODUCTS_FAILURE,
  EDIT_PRODUCTS,
  EDIT_PRODUCTS_SUCCESS,
  EDIT_PRODUCTS_FAILURE,
  DELETE_PRODUCTS,
  DELETE_PRODUCTS_SUCCESS,
  DELETE_PRODUCTS_FAILURE,
  GET_PRODUCTS_TYPE,
  GET_PRODUCTS_TYPE_SUCCESS,
  GET_PRODUCTS_TYPE_FAILURE,
  ADD_PRODUCTS_TYPE,
  ADD_PRODUCTS_TYPE_SUCCESS,
  ADD_PRODUCTS_TYPE_FAILURE,
  EDIT_PRODUCTS_TYPE,
  EDIT_PRODUCTS_TYPE_SUCCESS,
  EDIT_PRODUCTS_TYPE_FAILURE,
  DELETE_PRODUCTS_TYPE,
  DELETE_PRODUCTS_TYPE_SUCCESS,
  DELETE_PRODUCTS_TYPE_FAILURE,
  GET_UNIT_OF_MEASURE,
  GET_UNIT_OF_MEASURE_SUCCESS,
  GET_UNIT_OF_MEASURE_FAILURE,
  ADD_UNIT_OF_MEASURE,
  ADD_UNIT_OF_MEASURE_SUCCESS,
  ADD_UNIT_OF_MEASURE_FAILURE,
  EDIT_UNIT_OF_MEASURE,
  EDIT_UNIT_OF_MEASURE_SUCCESS,
  EDIT_UNIT_OF_MEASURE_FAILURE,
  DELETE_UNIT_OF_MEASURE,
  DELETE_UNIT_OF_MEASURE_SUCCESS,
  DELETE_UNIT_OF_MEASURE_FAILURE,
  CREATE_DEFAULT_UNITS,
  CREATE_DEFAULT_UNITS_SUCCESS,
  CREATE_DEFAULT_UNITS_FAILURE,
} from '../actions/items.actions';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  itemData: [],
  itemTypeList: [],
  products: [],
  productType: [],
  unitOfMeasure: [],
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ITEMS:
    case ADD_ITEMS:
    case EDIT_ITEMS:
    case DELETE_ITEMS:
    case GET_ITEMS_TYPE:
    case ADD_ITEMS_TYPE:
    case EDIT_ITEMS_TYPE:
    case DELETE_ITEMS_TYPE:
    case GET_PRODUCTS:
    case ADD_PRODUCTS:
    case EDIT_PRODUCTS:
    case DELETE_PRODUCTS:
    case GET_PRODUCTS_TYPE:
    case ADD_PRODUCTS_TYPE:
    case EDIT_PRODUCTS_TYPE:
    case DELETE_PRODUCTS_TYPE:
    case GET_UNIT_OF_MEASURE:
    case ADD_UNIT_OF_MEASURE:
    case EDIT_UNIT_OF_MEASURE:
    case DELETE_UNIT_OF_MEASURE:
    case CREATE_DEFAULT_UNITS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_ITEMS_FAILURE:
    case ADD_ITEMS_FAILURE:
    case EDIT_ITEMS_FAILURE:
    case DELETE_ITEMS_FAILURE:
    case GET_ITEMS_TYPE_FAILURE:
    case ADD_ITEMS_TYPE_FAILURE:
    case EDIT_ITEMS_TYPE_FAILURE:
    case DELETE_ITEMS_TYPE_FAILURE:
    case GET_PRODUCTS_FAILURE:
    case ADD_PRODUCTS_FAILURE:
    case EDIT_PRODUCTS_FAILURE:
    case DELETE_PRODUCTS_FAILURE:
    case GET_PRODUCTS_TYPE_FAILURE:
    case ADD_PRODUCTS_TYPE_FAILURE:
    case EDIT_PRODUCTS_TYPE_FAILURE:
    case DELETE_PRODUCTS_TYPE_FAILURE:
    case GET_UNIT_OF_MEASURE_FAILURE:
    case ADD_UNIT_OF_MEASURE_FAILURE:
    case EDIT_UNIT_OF_MEASURE_FAILURE:
    case DELETE_UNIT_OF_MEASURE_FAILURE:
    case CREATE_DEFAULT_UNITS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_ITEMS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        itemData: action.data,
      };

    case ADD_ITEMS_SUCCESS:
    case EDIT_ITEMS_SUCCESS: {
      const found = _.find(
        state.itemData,
        { id: action.item.id },
      );
      const itemData = found
        ? _.map(state.itemData, (item) => (
          item.id === action.item.id
            ? action.item
            : item
        ))
        : [...state.itemData, action.item];
      return {
        ...state,
        loading: false,
        loaded: true,
        itemData,
      };
    }

    case DELETE_ITEMS_SUCCESS: {
      const itemData = _.filter(state.itemData, (item) => item.id !== action.id);

      return {
        ...state,
        loading: false,
        loaded: true,
        itemData,
      };
    }

    case GET_ITEMS_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        itemTypeList: action.data,
      };

    case ADD_ITEMS_TYPE_SUCCESS:
    case EDIT_ITEMS_TYPE_SUCCESS: {
      const found = _.find(
        state.itemTypeList,
        { id: action.itemType.id },
      );
      const itemTypeList = found
        ? _.map(state.itemTypeList, (itemType) => (
          itemType.id === action.itemType.id
            ? action.itemType
            : itemType
        ))
        : [...state.itemTypeList, action.itemType];
      return {
        ...state,
        loading: false,
        loaded: true,
        itemTypeList,
      };
    }

    case DELETE_ITEMS_TYPE_SUCCESS: {
      const itemTypeList = _.filter(state.itemTypeList, (itemType) => itemType.id !== action.id);

      return {
        ...state,
        loading: false,
        loaded: true,
        itemTypeList,
      };
    }

    case GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        products: action.data,
      };

    case ADD_PRODUCTS_SUCCESS:
    case EDIT_PRODUCTS_SUCCESS: {
      const found = _.find(
        state.products,
        { id: action.product.id },
      );
      const products = found
        ? _.map(state.products, (product) => (
          product.id === action.product.id
            ? action.product
            : product
        ))
        : [...state.products, action.product];
      return {
        ...state,
        loading: false,
        loaded: true,
        products,
      };
    }

    case DELETE_PRODUCTS_SUCCESS: {
      const products = _.filter(state.products, (product) => product.id !== action.id);

      return {
        ...state,
        loading: false,
        loaded: true,
        products,
      };
    }

    case GET_PRODUCTS_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        productType: action.data,
      };

    case ADD_PRODUCTS_TYPE_SUCCESS:
    case EDIT_PRODUCTS_TYPE_SUCCESS: {
      const found = _.find(
        state.productType,
        { id: action.productType.id },
      );
      const productType = found
        ? _.map(state.productType, (prodType) => (
          prodType.id === action.productType.id
            ? action.productType
            : prodType
        ))
        : [...state.productType, action.productType];
      return {
        ...state,
        loading: false,
        loaded: true,
        productType,
      };
    }

    case DELETE_PRODUCTS_TYPE_SUCCESS: {
      const productType = _.filter(state.productType, (prodType) => prodType.id !== action.id);

      return {
        ...state,
        loading: false,
        loaded: true,
        productType,
      };
    }

    case GET_UNIT_OF_MEASURE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        unitOfMeasure: action.data,
      };

    case ADD_UNIT_OF_MEASURE_SUCCESS:
    case EDIT_UNIT_OF_MEASURE_SUCCESS: {
      const found = _.find(
        state.unitOfMeasure,
        { id: action.unitOfMeasure.id },
      );
      const unitOfMeasure = found
        ? _.map(state.unitOfMeasure, (uom) => (
          uom.id === action.unitOfMeasure.id
            ? action.unitOfMeasure
            : uom
        ))
        : [...state.unitOfMeasure, action.unitOfMeasure];
      return {
        ...state,
        loading: false,
        loaded: true,
        unitOfMeasure,
      };
    }

    case DELETE_UNIT_OF_MEASURE_SUCCESS: {
      const unitOfMeasure = _.filter(state.unitOfMeasure, (uom) => uom.id !== action.id);

      return {
        ...state,
        loading: false,
        loaded: true,
        unitOfMeasure,
      };
    }

    case CREATE_DEFAULT_UNITS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        unitOfMeasure: action.units,
      };

    default:
      return state;
  }
};
