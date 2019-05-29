import {
    LOAD_DATA_COREGROUP,
    LOAD_DATA_COREGROUP_FAIL,
    LOAD_DATA_COREGROUP_COMMIT,
    UPDATE_COREGROUP,
    UPDATE_COREGROUP_FAIL,
    UPDATE_COREGROUP_COMMIT,
    CREATE_COREGROUP,
    CREATE_COREGROUP_FAIL,
    CREATE_COREGROUP_COMMIT,
    DELETE_COREGROUP,
    DELETE_COREGROUP_FAIL,
    DELETE_COREGROUP_COMMIT
} from '../actions/coregroup.actions';

const initialState = {
  loading: false,
  loaded: false,
  data: [],
  error: null
}

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_DATA_COREGROUP:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null
      };

    case LOAD_DATA_COREGROUP_COMMIT:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.group.data
      };

    case LOAD_DATA_COREGROUP_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
      case UPDATE_COREGROUP:
          return {
              ...state,
              loading: true,
              loaded: false,
              error: null
          };

      case UPDATE_COREGROUP_COMMIT:
          return {
              ...state,
              loading: false,
              loaded: true,
              data: action.group
          };

      case UPDATE_COREGROUP_FAIL:
          return {
              ...state,
              loading: false,
              loaded: true,
              error: action.error
          };

      case CREATE_COREGROUP:
          return {
              ...state,
              loading: true,
              loaded: false,
              error: null
          };

      case CREATE_COREGROUP_COMMIT:
          return {
              ...state,
              loading: false,
              loaded: true,
              data: action.group
          };

      case CREATE_COREGROUP_FAIL:
          return {
              ...state,
              loading: false,
              loaded: true,
              error: action.error
          };

      case DELETE_COREGROUP:
          return {
              ...state,
              loading: true,
              loaded: false,
              error: null
          };

      case DELETE_COREGROUP_COMMIT:
          return {
              ...state,
              loading: false,
              loaded: true,
              data: state.data.filter(item => item['id'] !== action.data['id'])
          };

      case DELETE_COREGROUP_FAIL:
          return {
              ...state,
              loading: false,
              loaded: true,
              error: action.error
          };



    default:
      return state
  }
}
