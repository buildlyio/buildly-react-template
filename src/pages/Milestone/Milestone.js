import React, { useEffect, useState } from 'react';
import {
	Box, Button,
	Checkbox,
	Chip,
	FormControl, FormControlLabel, FormGroup,
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

const Milestone = () => {
	const classes = useStyles();
	const headers = {
		Authorization: window.env.GITHUB_TOKEN,
		Accept: 'application/vnd.github.v3+json'
	};

	const owner = 'buildly-release-management';
	const [milestoneState, setMilestoneState] = useState('open');

	const [repositories, setRepositories] = useState([]);
	const [selectedRepositories, setSelectedRepositories] = useState([]);
	const [milestones, setMilestones] = useState([]);
	const [milestoneHeadings, setMilestoneHeadings] = useState([]);
	const [selectedMilestones, setSelectedMilestones] = useState([]);

	const [rows, setRows] = useState([]);

	useEffect(() => {
		fetch(`https://api.github.com/orgs/${ owner }/repos`, {
			headers
		})
			.then((response) => response.json())
			.then((data) => setRepositories(data.map(({ name }) => name)));
	}, [owner]);

	useEffect(() => {
		if (selectedRepositories.length) {
			setMilestones([]);

			selectedRepositories.map((repository) =>
				fetch(
					`https://api.github.com/repos/${ owner }/${ repository }/milestones?state=${ milestoneState }`,
					{
						headers
					}
				)
					.then((response) => response.json())
					.then((data) => setMilestones((previousMilestones) => {
						const oldMilestones = previousMilestones.filter(
							(milestone) =>
								milestone.state === milestoneState
						);
						const oldHeadings = oldMilestones.map(
							(milestone) => milestone.title
						);

						setMilestoneHeadings([
							...new Set([
								...oldHeadings,
								...data.map(({ title }) => title)
							])
						]);

						return [...oldMilestones, ...data];
					})));
		} else {
			setMilestones([]);
			setMilestoneHeadings([]);
			setSelectedMilestones([]);
		}
	}, [selectedRepositories, owner, milestoneState]);

	useEffect(() => {
		const extractData = (string, term) => string.includes(term)
			? string.split(`\n> ${ term }`).pop().split('\n')[0].trim()
			: null;

		let data = milestones.filter(({ title }) => selectedMilestones.includes(title));
		data = data.map(({
							 url, title, state, description, due_on, id
						 }) => ({
			repository: url.split('/')[5],
			milestone: title,
			state: state.charAt(0).toUpperCase() + state.slice(1),
			description: description.split('\n>')[0].trim(),
			info: extractData(description, 'info'),
			start_date: extractData(description, 'startdate'),
			due_date: due_on,
			burndown_date: extractData(description, 'burndowndate'),
			capacity: extractData(description, 'capacity'),
			ed: extractData(description, 'ed'),
			id
		}));
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
						onClick={ () => console.log('should refresh') }
					>
						Refresh
					</Button>
				</Grid>
			</Grid>
			<DataTableWrapper
				loading={ false }
				rows={ rows || [] }
				columns={ milestoneConstants || [] }
				hideAddButton={ true }
				tableHeader='Milestones'
				editAction={ (data) => console.log(data) }
				deleteAction={ (data) => console.log(data) }
			/>
		</div>
	);
};

export default Milestone;