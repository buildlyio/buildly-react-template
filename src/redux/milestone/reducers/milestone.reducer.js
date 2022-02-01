// import {
//   ADD_DATA,
//   ADD_DATA_SUCCESS,
//   ADD_DATA_FAIL,
//   CHECK_FILLED,
//   CHECK_FILLED_SUCCESS,
//   CHECK_FILLED_FAIL,
// } from '../actions/googleSheet.actions';

import {
	CLEAR_MILESTONES,
	CLEAR_MILESTONES_FAIL,
	CLEAR_MILESTONES_HEADINGS,
	CLEAR_MILESTONES_HEADINGS_FAIL,
	CLEAR_MILESTONES_HEADINGS_SUCCESS,
	CLEAR_MILESTONES_SUCCESS,
	GET_MILESTONES,
	GET_MILESTONES_FAIL,
	GET_MILESTONES_SUCCESS,
	GET_REPOSITORIES,
	GET_REPOSITORIES_FAIL,
	GET_REPOSITORIES_SUCCESS
} from '@redux/milestone/actions/milestone.actions';

const initialState = {
	loading: false,
	loaded: false,
	error: null,
	repositories: [],
	milestones: [],
	milestoneHeadings: []
};

// Reducer
export default (state = initialState, action) => {
	switch (action.type) {
		case GET_REPOSITORIES:
			return {
				...state,
				loading: true,
				loaded: false,
				error: null,
			};

		case GET_REPOSITORIES_SUCCESS:
			return {
				...state,
				loading: false,
				loaded: true,
				error: null,
				repositories: action.data.map(({ name }) => name)
			};

		case GET_MILESTONES:
			return {
				...state,
				loading: true,
				loaded: false,
				error: null,
			};

		case GET_MILESTONES_SUCCESS:
			const { milestones } = action.data;

			return {
				...state,
				loading: false,
				loaded: true,
				error: null,
				milestones,
				milestoneHeadings: [
					...new Set([
						...milestones.map(({ title }) => title)
					])
				]
			};

		case CLEAR_MILESTONES:
			return {
				...state,
				loading: true,
				loaded: false,
				error: null
			}

		case CLEAR_MILESTONES_SUCCESS:
			return {
				...state,
				loading: false,
				loaded: true,
				error: null,
				milestones: []
			}

		case CLEAR_MILESTONES_HEADINGS:
			return {
				...state,
				loading: true,
				loaded: false,
				error: null
			}

		case CLEAR_MILESTONES_HEADINGS_SUCCESS:
			return {
				...state,
				loading: false,
				loaded: true,
				error: null,
				milestoneHeadings: []
			}

		case GET_REPOSITORIES_FAIL:
		case GET_MILESTONES_FAIL:
		case CLEAR_MILESTONES_FAIL:
		case CLEAR_MILESTONES_HEADINGS_FAIL:
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
