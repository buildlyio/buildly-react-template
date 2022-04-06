import PropTypes from 'prop-types';
import { addAll, deleteOne, upsertOne } from '../../reducer.utils';
import {
  CREATE_COREGROUP_COMMIT,
  DELETE_COREGROUP_COMMIT,
  LOAD_DATA_COREGROUP_COMMIT,
  UPDATE_COREGROUP_COMMIT,
} from '../actions/coregroup.actions';

const initialState = {
  data: [],
  loaded: false,
  created: false,
  updated: false,
  deleted: false,
};

export default function coregroupReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_DATA_COREGROUP_COMMIT:
      return addAll(state, action);

    case CREATE_COREGROUP_COMMIT:
      return upsertOne(state, action, 'id');

    case UPDATE_COREGROUP_COMMIT:
      return upsertOne(state, action, 'id');

    case DELETE_COREGROUP_COMMIT:
      return deleteOne(state, action, 'id');

    default:
      return state;
  }
}

coregroupReducer.propTypes = {
  state: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        is_global: PropTypes.bool,
        permissions: PropTypes.shape({
          create: PropTypes.string,
          update: PropTypes.string,
          delete: PropTypes.string,
          read: PropTypes.string,
        }),
      }),
    ),
    loaded: PropTypes.bool,
    created: PropTypes.bool,
    updated: PropTypes.bool,
    deleted: PropTypes.bool,
  }),
};
