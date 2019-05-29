import {
    CREATE_COREGROUP_COMMIT,
    DELETE_COREGROUP_COMMIT,
    LOAD_DATA_COREGROUP_COMMIT, UPDATE_COREGROUP_COMMIT
} from '../actions/coregroup.actions';
import {addAll, deleteOne, upsertOne} from '../../reducer.utils';
import {CoreGroup} from '../coregroup.model';

export interface CoreGroupState {
    data: CoreGroup[];
    loaded: false;
    created: false;
    updated: false;
    deleted: false;
}
const initialState: CoreGroupState = {
    data: [],
    loaded: false,
    created: false,
    updated: false,
    deleted: false
};

export default function coreGroupReducer(state = initialState, action) {
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
