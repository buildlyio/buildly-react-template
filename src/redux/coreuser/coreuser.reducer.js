import PropTypes from 'prop-types';
import { addAll, deleteOne, upsertOne } from '../reducer.utils';
import {
  CREATE_COREUSER_COMMIT,
  DELETE_COREUSER_COMMIT,
  LOAD_DATA_COREUSER_COMMIT,
  UPDATE_COREUSER_COMMIT,
} from './coreuser.actions';

const initialState = {
  data: [],
  loaded: false,
  created: false,
  updated: false,
  deleted: false,
};

export default function coreuserReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_DATA_COREUSER_COMMIT:
      return addAll(state, action);

    case CREATE_COREUSER_COMMIT:
      return upsertOne(state, action, 'id');

    case UPDATE_COREUSER_COMMIT:
      return upsertOne(state, action, 'id');

    case DELETE_COREUSER_COMMIT:
      return deleteOne(state, action, 'id');

    default:
      return state;
  }
}

coreuserReducer.propTypes = {
  state: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        user: PropTypes.shape({
          id: PropTypes.number,
          core_user_uuid: PropTypes.string,
          is_super_user: PropTypes.bool,
          username: PropTypes.string,
          first_name: PropTypes.string,
          last_name: PropTypes.string,
          email: PropTypes.string,
          is_staff: PropTypes.bool,
          groups: PropTypes.arrayOf(PropTypes.string),
          is_active: PropTypes.bool,
        }),
        core_user_uuid: PropTypes.string,
        title: PropTypes.string,
        name: PropTypes.string,
        contact_info: PropTypes.string,
        privacy_disclaimer_accepted: PropTypes.bool,
        filter: PropTypes.string,
        create_date: PropTypes.string,
        edit_date: PropTypes.string,
      }),
    ),
    loaded: PropTypes.bool,
    created: PropTypes.bool,
    updated: PropTypes.bool,
    deleted: PropTypes.bool,
  }),
};
