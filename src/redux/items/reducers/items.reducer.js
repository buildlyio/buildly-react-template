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
  CREATE_DEFAULT_UNITS_FAILURE,
} from '../actions/items.actions';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  itemData: null,
  itemTypeList: null,
  products: null,
  productType: null,
  unitOfMeasure: null,
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

    case ADD_ITEMS_TYPE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_ITEMS_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        itemTypeList: [
          ...state.itemTypeList, action.itemType,
        ],
      };

    case ADD_ITEMS_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case EDIT_ITEMS_TYPE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case EDIT_ITEMS_TYPE_SUCCESS: {
      const itemTypes = _.map(state.itemTypeList, (it) => (
        action.itemType && (it.id === action.itemType.id)
          ? action.itemType
          : it
      ));

      return {
        ...state,
        loading: false,
        loaded: true,
        itemTypeList: itemTypes,
      };
    }

    case EDIT_ITEMS_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case DELETE_ITEMS_TYPE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case DELETE_ITEMS_TYPE_SUCCESS: {
      const itemTypes = _.filter(state.itemTypeList, (it) => (
        action.itemType && (it.id !== action.itemType.id)
      ));

      return {
        ...state,
        loading: false,
        loaded: true,
        itemTypeList: itemTypes,
      };
    }

    case DELETE_ITEMS_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_PRODUCTS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        products: action.data,
      };

    case GET_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case ADD_PRODUCTS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        products: [
          ...state.products, action.product,
        ],
      };

    case ADD_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case EDIT_PRODUCTS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case EDIT_PRODUCTS_SUCCESS: {
      const products = _.map(state.products, (prod) => (
        action.product && (prod.id === action.product.id)
          ? action.product
          : prod
      ));

      return {
        ...state,
        loading: false,
        loaded: true,
        products,
      };
    }

    case EDIT_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case DELETE_PRODUCTS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case DELETE_PRODUCTS_SUCCESS: {
      const products = _.filter(state.products, (prod) => (
        action.product && (prod.id !== action.product.id)
      ));

      return {
        ...state,
        loading: false,
        loaded: true,
        products,
      };
    }

    case DELETE_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_PRODUCTS_TYPE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_PRODUCTS_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        productType: action.data,
      };

    case GET_PRODUCTS_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case ADD_PRODUCTS_TYPE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_PRODUCTS_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        productType: [
          ...state.productType, action.productType,
        ],
      };

    case ADD_PRODUCTS_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case EDIT_PRODUCTS_TYPE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case EDIT_PRODUCTS_TYPE_SUCCESS: {
      const productTypes = _.map(state.productType, (pt) => (
        action.productType && (pt.id === action.productType.id)
          ? action.productType
          : pt
      ));

      return {
        ...state,
        loading: false,
        loaded: true,
        productType: productTypes,
      };
    }

    case EDIT_PRODUCTS_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case DELETE_PRODUCTS_TYPE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case DELETE_PRODUCTS_TYPE_SUCCESS: {
      const productTypes = _.filter(state.productType, (pt) => (
        action.productType && (pt.id !== action.productType.id)
      ));

      return {
        ...state,
        loading: false,
        loaded: true,
        productType: productTypes,
      };
    }

    case DELETE_PRODUCTS_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_UNIT_OF_MEASURE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_UNIT_OF_MEASURE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        unitOfMeasure: action.data,
      };

    case GET_UNIT_OF_MEASURE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case ADD_UNIT_OF_MEASURE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_UNIT_OF_MEASURE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        unitOfMeasure: [
          ...state.unitOfMeasure, action.unitOfMeasure,
        ],
      };

    case ADD_UNIT_OF_MEASURE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case EDIT_UNIT_OF_MEASURE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case EDIT_UNIT_OF_MEASURE_SUCCESS: {
      const uoms = _.map(state.unitOfMeasure, (uom) => (
        action.unitOfMeasure && (uom.id === action.unitOfMeasure.id)
          ? action.unitOfMeasure
          : uom
      ));

      return {
        ...state,
        loading: false,
        loaded: true,
        unitOfMeasure: uoms,
      };
    }

    case EDIT_UNIT_OF_MEASURE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case DELETE_UNIT_OF_MEASURE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case DELETE_UNIT_OF_MEASURE_SUCCESS: {
      const uoms = _.filter(state.unitOfMeasure, (uom) => (
        action.unitOfMeasure && (uom.id !== action.unitOfMeasure.id)
      ));

      return {
        ...state,
        loading: false,
        loaded: true,
        unitOfMeasure: uoms,
      };
    }

    case DELETE_UNIT_OF_MEASURE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case CREATE_DEFAULT_UNITS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case CREATE_DEFAULT_UNITS_FAILURE:
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
