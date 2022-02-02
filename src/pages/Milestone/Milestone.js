import React, { useEffect, useState } from 'react';
import {
	Box,
	Button,
	Checkbox,
	Chip,
	FormControl,
	FormControlLabel,
	FormGroup,
	Grid,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select,
	TextField
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { milestoneConstants } from '@pages/Milestone/MilestoneConstants';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { routes } from '@routes/routesConstants';
import { Route } from 'react-router-dom';
import MilestoneForm from '@pages/Milestone/components/MilestoneForm';
import {
	clearMilestones,
	clearMilestonesHeadings, deleteMilestone,
	getMilestones,
	getRepositories
} from '@redux/milestone/actions/milestone.actions';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(5),
		paddingTop: 0
	},
	link: {
		color: theme.palette.primary.main,
		textDecoration: 'none',
		'& :hover': {
			textDecoration: 'underline'
		}
	}
}));

const Milestone = ({ history, loading, repositories, dispatch, milestones, milestoneHeadings }) => {
	const classes = useStyles();

	const owner = 'buildly-release-management';
	const [milestoneState, setMilestoneState] = useState('open');
	const [deleteModalState, setDeleteModalState] = useState(false);
	const [currentMilestone, setCurrentMilestone] = useState(null);

	const [selectedRepositories, setSelectedRepositories] = useState([]);
	const [selectedMilestones, setSelectedMilestones] = useState([]);

	const [rows, setRows] = useState([]);

	const addMilestonePath = `${ routes.MILESTONE }/add`;
	const editMilestonePath = `${ routes.MILESTONE }/edit`;

	useEffect(() => {
		dispatch(getRepositories({
			owner
		}));
	}, [owner]);

	useEffect(() => {
		if (selectedRepositories.length) {
			dispatch(getMilestones({
				owner, selectedRepositories, milestoneState
			}));
		} else {
			dispatch(clearMilestones());
			dispatch(clearMilestonesHeadings());

			setSelectedMilestones([]);
		}
	}, [selectedRepositories, owner, milestoneState]);

	useEffect(() => {
		const extractData = (string, term) => string.includes(term)
			? string.split(`\n> ${ term }`).pop().split('\n')[0].trim()
			: null;

		let data = milestones.filter(({ title }) => selectedMilestones.includes(title));
		data = data.map(({
							 url, title, state, description, due_on, number
						 }) => ({
			repository: url.split('/')[5],
			milestone: title,
			state,
			description: description.split('\n>')[0].trim(),
			info: extractData(description, 'info'),
			start_date: extractData(description, 'startdate'),
			due_date: due_on,
			burndown_date: extractData(description, 'burndowndate'),
			capacity: extractData(description, 'capacity'),
			ed: extractData(description, 'ed'),
			number
		}));

		const updatedHeadings = selectedMilestones.filter((heading) => milestoneHeadings.includes(heading));
		const difference = selectedMilestones.filter((heading) => !updatedHeadings.includes(heading));

		if(difference.length) {
			setSelectedMilestones(updatedHeadings);
		}

		setRows(data);
	}, [selectedMilestones, milestones]);

	const selectedRepositoriesHandler = (event) => {
		const {
			target: { value }
		} = event;
		setSelectedRepositories(
			typeof value === 'string' ? value.split(',') : value
		);
	};

	const selectedMilestonesHandler = (event) => {
		const {
			target: { value }
		} = event;
		setSelectedMilestones(
			typeof value === 'string' ? value.split(',') : value
		);
	};

	const refreshMilestones = () => {
		if (selectedRepositories.length) {
			dispatch(getMilestones({
				owner, selectedRepositories, milestoneState
			}));
		} else {
			dispatch(clearMilestones());
			dispatch(clearMilestonesHeadings());

			setSelectedMilestones([]);
		}
	};

	const addMilestone = () => history.push(`${ addMilestonePath }`, {
		type: 'add',
		from: routes.MILESTONE,
		data: null,
	});

	const editMilestone = (milestone) => {
		history.push(`${ editMilestonePath }/${ milestone.number }`, {
			type: 'edit',
			from: routes.MILESTONE,
			data: milestone,
		});
	};

	const deleteConfirmationHandler = (milestone) => {
		setCurrentMilestone(milestone);
		setDeleteModalState(true);
	};

	const deleteMilestoneHandler = () => {
		const { repository, number } = currentMilestone;

		dispatch(deleteMilestone({
			owner, repository, number
		}));

		setCurrentMilestone(null);
		setDeleteModalState(false);
	};

	return (
		<div className={ classes.root }>
			<Grid container spacing={ 2 }>
				<Grid item xs={ 2 }>
					<TextField
						id={ 'Owner' }
						label='Owner'
						variant='outlined'
						value={ owner }
						fullWidth
					/>
				</Grid>
				<Grid item xs={ 3 }>
					<FormControl sx={ { width: 1 } }>
						<InputLabel id='select-repositories'>
							Repositories
						</InputLabel>
						<Select
							labelId='select-repositories'
							id='repositories'
							multiple
							value={ selectedRepositories }
							onChange={ selectedRepositoriesHandler }
							input={
								<OutlinedInput
									id='select-multiple-repositories'
									label='Repositories'
								/>
							}
							renderValue={ (selected) => (
								<Box
									sx={ {
										display: 'flex',
										flexWrap: 'wrap',
										gap: 0.5
									} }
								>
									{ selected.map((value) => (
										<Chip key={ value } label={ value } />
									)) }
								</Box>
							) }
						>
							<MenuItem key={ null } value={ null } disabled>
								{ repositories.length ? 'Select Repositories' : 'No repositories available.' }
							</MenuItem>
							{ repositories.map((name) => (
								<MenuItem key={ name } value={ name }>
									{ name }
								</MenuItem>
							)) }
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={ 3 }>
					<FormControl sx={ { width: 1 } }>
						<InputLabel id='select-milestones'>
							Milestone(s)
						</InputLabel>
						<Select
							labelId='select-milestones'
							id='milestones'
							multiple
							value={ selectedMilestones }
							onChange={ selectedMilestonesHandler }
							input={
								<OutlinedInput
									id='select-multiple-milestones'
									label='Milestone(s)'
								/>
							}
							renderValue={ (selected) => (
								<Box
									sx={ {
										display: 'flex',
										flexWrap: 'wrap',
										gap: 0.5
									} }
								>
									{ selected.map((value) => (
										<Chip key={ value } label={ value } />
									)) }
								</Box>
							) }
						>
							<MenuItem key={ null } value={ null } disabled>
								{ milestoneHeadings.length ? 'Select Milestone(s)' : 'No milestones available.' }
							</MenuItem>
							{ milestoneHeadings.map((name) => (
								<MenuItem key={ name } value={ name }>
									{ name }
								</MenuItem>
							)) }
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={ 2 }>
					<FormGroup>
						<FormControlLabel
							control={
								<Checkbox
									onChange={ (event) => {
										setMilestoneState(
											event.target.checked
												? 'closed'
												: 'open'
										);

										setSelectedMilestones([]);
									} }
								/>
							}
							label='Closed Milestones'
						/>
					</FormGroup>
				</Grid>
				<Grid item xs={ 2 }>
					<Button
						type='button'
						variant='contained'
						color='primary'
						onClick={ refreshMilestones }
					>
						Refresh
					</Button>
				</Grid>
			</Grid>
			<DataTableWrapper
				loading={ loading }
				rows={ rows || [] }
				columns={ milestoneConstants || [] }
				hideAddButton={ false }
				onAddButtonClick={ addMilestone }
				addButtonHeading={ 'Add' }
				tableHeader='Milestones'
				editAction={ editMilestone }
				deleteAction={ deleteConfirmationHandler }
				openDeleteModal={ deleteModalState }
				setDeleteModal={ setDeleteModalState }
				handleDeleteModal={ deleteMilestoneHandler }
				deleteModalTitle={ 'Are you sure you want to delete the milestone?' }
			>
				<Route path={ `${ addMilestonePath }` } component={ MilestoneForm } />
				<Route path={ `${ editMilestonePath }/:id` } component={ MilestoneForm } />
			</DataTableWrapper>
		</div>
	);
};

const mapStateToProps = (state, ownProps) => ({
	...ownProps,
	...state.milestoneReducer,
});

export default connect(mapStateToProps)(Milestone);