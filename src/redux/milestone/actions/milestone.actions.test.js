import * as actions from './milestone.actions';

describe('milestone saga actions', () => {
	it('should create an action to fetch repositories', () => {
		const data = { owner: 'random-owner' };

		const expectedAction = {
			type: actions.GET_REPOSITORIES,
			data,
		};

		expect(actions.getRepositories(data)).toEqual(expectedAction);
	});

	it('should create an action to fetch milestones', () => {
		const data = {
			owner: 'random-owner',
			selectedRepositories: ['repo-1'],
			milestoneState: 'open'
		};

		const expectedAction = {
			type: actions.GET_MILESTONES,
			data,
		};

		expect(actions.getMilestones(data)).toEqual(expectedAction);
	});

	it('should create an action to clear milestones', () => {
		const expectedAction = {
			type: actions.CLEAR_MILESTONES
		};

		expect(actions.clearMilestones()).toEqual(expectedAction);
	});

	it('should create an action to clear milestone headings', () => {
		const expectedAction = {
			type: actions.CLEAR_MILESTONES_HEADINGS
		};

		expect(actions.clearMilestonesHeadings()).toEqual(expectedAction);
	});

	it('should create an action to create a milestone', () => {
		const data = {
			owner: 'random-owner',
			repositories: ['repo-1'],
			data: {
				title: 'random-title',
				description: 'random-description',
				due_on: '01-01-1970'
			}
		};

		const expectedAction = {
			type: actions.CREATE_MILESTONE,
			data,
		};

		expect(actions.createMilestone(data)).toEqual(expectedAction);
	});

	it('should create an action to delete a milestone', () => {
		const data = {
			owner: 'random-owner',
			repository: 'repo-1',
			number: 1
		};

		const expectedAction = {
			type: actions.DELETE_MILESTONE,
			data,
		};

		expect(actions.deleteMilestone(data)).toEqual(expectedAction);
	});

	it('should create an action to update a milestone', () => {
		const data = {
			owner: 'random-owner',
			repository: 'repo-1',
			data: {
				title: 'random-title',
				description: 'random-description',
				due_on: '01-01-1970'
			},
			number: 1
		};

		const expectedAction = {
			type: actions.UPDATE_MILESTONE,
			data,
		};

		expect(actions.updateMilestone(data)).toEqual(expectedAction);
	});
});