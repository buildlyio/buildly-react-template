import {
	CLEAR_MILESTONES,
	CLEAR_MILESTONES_FAIL,
	CLEAR_MILESTONES_HEADINGS,
	CLEAR_MILESTONES_HEADINGS_FAIL,
	CLEAR_MILESTONES_HEADINGS_SUCCESS,
	CLEAR_MILESTONES_SUCCESS,
	CREATE_MILESTONE,
	CREATE_MILESTONE_FAIL,
	CREATE_MILESTONE_SUCCESS,
	DELETE_MILESTONE,
	DELETE_MILESTONE_FAIL, DELETE_MILESTONE_SUCCESS,
	GET_MILESTONES,
	GET_MILESTONES_FAIL,
	GET_MILESTONES_SUCCESS,
	GET_REPOSITORIES,
	GET_REPOSITORIES_FAIL,
	GET_REPOSITORIES_SUCCESS, UPDATE_MILESTONE, UPDATE_MILESTONE_SUCCESS
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
			};

		case CLEAR_MILESTONES_SUCCESS:
			return {
				...state,
				loading: false,
				loaded: true,
				error: null,
				milestones: []
			};

		case CLEAR_MILESTONES_HEADINGS:
			return {
				...state,
				loading: true,
				loaded: false,
				error: null
			};

		case CLEAR_MILESTONES_HEADINGS_SUCCESS:
			return {
				...state,
				loading: false,
				loaded: true,
				error: null,
				milestoneHeadings: []
			};

		case CREATE_MILESTONE:
			return {
				...state,
				loading: true,
				loaded: false,
				error: null
			};

		case CREATE_MILESTONE_SUCCESS:
			return {
				...state,
				loading: false,
				loaded: true,
				error: null
			};

		case DELETE_MILESTONE:
			return {
				...state,
				loading: true,
				loaded: false,
				error: null
			};

		case DELETE_MILESTONE_SUCCESS:
			const updatedMilestones = state.milestones.filter(
				({ number }) => number !== action.data.number
			);

			return {
				...state,
				loading: false,
				loaded: true,
				error: null,
				milestones: updatedMilestones,
				milestoneHeadings: [
					...new Set([
						...updatedMilestones.map(({ title }) => title)
					])
				]
			};

		case UPDATE_MILESTONE:
			return {
				...state,
				loading: true,
				loaded: false,
				error: null
			};

		case UPDATE_MILESTONE_SUCCESS:
			const updatedData = state.milestones.map((milestone) => {
				if (milestone.number === action.data.milestone.data.number) {
					return action.data.milestone.data;
				}

				return milestone;
			});

			return {
				...state,
				loading: false,
				loaded: true,
				error: null,
				milestones: updatedData,
				milestoneHeadings: [
					...new Set([
						...updatedData.map(({ title }) => title)
					])
				]
			};

		case GET_REPOSITORIES_FAIL:
		case GET_MILESTONES_FAIL:
		case CLEAR_MILESTONES_FAIL:
		case CLEAR_MILESTONES_HEADINGS_FAIL:
		case CREATE_MILESTONE_FAIL:
		case DELETE_MILESTONE_FAIL:
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
