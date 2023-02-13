import { addAll, deleteOne, upsertOne } from '../../../redux/reducer.utils';
import PropTypes from 'prop-types';
import {
  CRUD_CREATE_COMMIT,
  CRUD_DELETE_COMMIT,
  CRUD_LOAD_DATA_COMMIT,
  CRUD_UPDATE_COMMIT,
} from './crud.actions';

export default function crudDataReducer(state = {}, action) {
  const newState = { ...state };
  switch (action.type) {
    case CRUD_LOAD_DATA_COMMIT:
      newState[action.endpoint] = addAll(state[action.endpoint], action);
      return newState;
    case CRUD_DELETE_COMMIT:
      newState[action.endpoint] = deleteOne(
        state[action.endpoint], action, action.idProp, action.dataProp,
      );
      return newState;
    case CRUD_CREATE_COMMIT:
      newState[action.endpoint] = upsertOne(
        state[action.endpoint], action, action.idProp, action.dataProp,
      );
      return newState;
    case CRUD_UPDATE_COMMIT:
      newState[action.endpoint] = upsertOne(
        state[action.endpoint], action, action.idProp, action.dataProp,
      );
      return newState;
    default:
      return state;
  }
}

crudDataReducer.propTypes = {
  state: PropTypes.objectOf(
    PropTypes.shape({
      data: PropTypes.any,
      loaded: PropTypes.bool,
      created: PropTypes.bool,
      updated: PropTypes.bool,
      deleted: PropTypes.bool,
    }),
  ),
};
