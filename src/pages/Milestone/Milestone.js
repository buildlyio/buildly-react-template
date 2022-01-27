import React, { createRef, useEffect, useRef, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { milestoneConstants } from '@pages/Milestone/MilestoneConstants';
import {
	Box,
	Button, Checkbox,
	Chip,
	FormControl, FormControlLabel, FormGroup,
	Grid,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select,
	TextField
} from '@mui/material';
import DatePickerComponent from '@components/DatePicker/DatePicker';

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(5),
		paddingTop: 0,
	},
	link: {
		color: theme.palette.primary.main,
		textDecoration: 'none',
		'& :hover': {
			textDecoration: 'underline',
		},
	},
}));

const Milestone = () => {
	const classes = useStyles();
	const stateItems = ['open', 'closed'];
	const [owner, setOwner] = useState('buildly-release-management');
	const [repositories, setRepositories] = useState([]);
	const [selectedRepositories, setSelectedRepositories] = useState([]);
	const [milestones, setMilestones] = useState([]);
	const [milestoneHeadings, setMilestoneHeadings] = useState([]);
	const [selectedMilestones, setSelectedMilestones] = useState([]);

	// temporary static data
	const tempData = [];
	for(let i = 1; i <= 10; i++) {
		const today = new Date();

		tempData.push({
			repository: `Repository ${i}`,
			milestone: `Milestone ${i}`,
			state: stateItems[Math.floor(Math.random() * stateItems.length)],
			description: `Description ${i}`,
			info: `Info ${i}`,
			start_date: today,
			due_date: today,
			burndown_date: today,
			capacity: `Capacity ${i}`,
			ed: `ED ${i}`,
			key: i
		});
	}
	const [data, setData] = useState(tempData);
	const rowsData = useRef({});
	const headers = {
		'Authorization': 'token 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',
		'Accept': 'application/vnd.github.v3+json'
	};

	useEffect(() => {
		fetch(`https://api.github.com/orgs/buildly-release-management/repos`, {
			headers
		})
			.then((response) => response.json())
			.then((data) => setRepositories(data.map(({ name }) => name)));
	}, [setRepositories, owner]);

	useEffect(() => {
		setMilestones([]);
		setMilestoneHeadings([]);

		if(selectedRepositories.length) {
			selectedRepositories.map((repository) => fetch(`https://api.github.com/repos/${owner}/${repository}/milestones`, {
				headers
			})
				.then((response) => response.json())
				.then((data) => {
					setMilestones((previousMilestones) => [
						...previousMilestones,
						...data
					]);
					const updatedMilestoneHeadings = [
						...new Set([
							...milestoneHeadings,
							...data.map(({ title }) => title)
						])
					];
					setMilestoneHeadings(updatedMilestoneHeadings);
				}));

			console.log(milestones);
		}
	}, [selectedRepositories, owner, setMilestones, setMilestoneHeadings]);

	const rowFiller = (data) => data.map(({ repository, milestone, state, description, info, start_date, due_date, burndown_date, capacity, ed }, index) => {
		// more refs left to be added
		rowsData.current[`row_${index}`] = {
			start_date: createRef(),
			due_date: createRef(),
			burndown_date: createRef(),
			info: createRef(),
		};

		return {
			repository,
			milestone,
			state: <FormControl>
				<InputLabel id={`state-${index}`}>State</InputLabel>
				<Select
					labelId={`state-${index}`}
					id={`state-label-${index}`}
					value={state}
					label="State"
					onChange={(event) => modifyData(index, 'state', event.target.value)}
				>
					<MenuItem value={'open'}>Open</MenuItem>
					<MenuItem value={'closed'}>Closed</MenuItem>
				</Select>
			</FormControl>,
			description: <TextField id={`description-${index}`} label="Description" variant="outlined" value={description} onChange={(event) => modifyData(index, 'description', event.target.value)}/>,
			info: <TextField id={`info-${index}`} label="Info" variant="outlined" value={info} onChange={(event) => modifyData(index, 'info', event.target.value)} inputRef={rowsData.current[`row_${index}`].info} />,
			start_date: <DatePickerComponent label="Start Date" handleDateChange={(date) => modifyData(index, 'start_date', date)} selectedDate={start_date} inputRef={rowsData.current[`row_${index}`].start_date} />,
			due_date: <DatePickerComponent label="Due Date" handleDateChange={(date) => modifyData(index, 'due_date', date)} selectedDate={due_date} inputRef={rowsData.current[`row_${index}`].due_date} />,
			burndown_date: <DatePickerComponent label="Burndown Date" handleDateChange={(date) => modifyData(index, 'burndown_date', date)} selectedDate={burndown_date} inputRef={rowsData.current[`row_${index}`].burndown_date} />,
			capacity: <TextField id={`capacity-${index}`} label="Capacity" variant="outlined" value={capacity} onChange={(event) => modifyData(index, 'capacity', event.target.value)} />,
			ed: <TextField id={`ed-${index}`} label="ED" variant="outlined" value={ed} onChange={(event) => modifyData(index, 'ed', event.target.value)} />,
			actions: <Button type="button" variant="contained" color="primary" onClick={() => console.log(rowsData.current[`row_${index}`])}>Copy/Update</Button>,
			key: index
		};
	});

	const [rows, setRows] = useState(rowFiller(data));

	const modifyData = (index, key, value) => {
		const newData = [...data];
		newData[index][key] = value;
		setData(newData);
		setRows(rowFiller(newData));
	};

	const selectedRepositoriesHandler = (event) => {
		const {
			target: { value },
		} = event;
		setSelectedRepositories(
			typeof value === 'string' ? value.split(',') : value,
		);
	};

	const selectedMilestonesHandler = (event) => {
		const {
			target: { value },
		} = event;
		setSelectedMilestones(
			typeof value === 'string' ? value.split(',') : value,
		);
	};

	const loading = false;

	return (
		<div className={classes.root}>
			<Grid container spacing={2}>
				<Grid item xs={2}>
					<TextField id={'Owner'} label="Owner" variant="outlined" value={owner} fullWidth />
				</Grid>
				<Grid item xs={3}>
					<FormControl sx={{ width: 1 }}>
						<InputLabel id="select-repositories">Repositories</InputLabel>
						<Select
							labelId="select-repositories"
							id="repositories"
							multiple
							value={selectedRepositories}
							onChange={selectedRepositoriesHandler}
							input={<OutlinedInput id="select-multiple-repositories" label="Repositories" />}
							renderValue={(selected) => (
								<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
									{selected.map((value) => (
										<Chip key={value} label={value} />
									))}
								</Box>
							)}
						>
							{repositories.map((name) => (
								<MenuItem
									key={name}
									value={name}
								>
									{name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={3}>
					<FormControl sx={{ width: 1 }}>
						<InputLabel id="select-milestones">Milestone(s)</InputLabel>
						<Select
							labelId="select-milestones"
							id="milestones"
							multiple
							value={selectedMilestones}
							onChange={selectedMilestonesHandler}
							input={<OutlinedInput id="select-multiple-milestones" label="Milestone(s)" />}
							renderValue={(selected) => (
								<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
									{selected.map((value) => (
										<Chip key={value} label={value} />
									))}
								</Box>
							)}
						>
							{milestoneHeadings.map((name) => (
								<MenuItem
									key={name}
									value={name}
								>
									{name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={2}>
					<FormGroup>
						<FormControlLabel control={<Checkbox />} label="Closed Milestones" /> // doesn't work yet
					</FormGroup>
				</Grid>
				<Grid item xs={2}>
					<TextField id={'Owner'} label="Owner" variant="outlined" value={owner} fullWidth /> // TODO: To be changed to a refresh button
				</Grid>
			</Grid>
			<DataTableWrapper
				loading={loading}
				rows={rows || []}
				columns={milestoneConstants || []}
				hideAddButton={true}
				tableHeader="Milestones"
			>
			</DataTableWrapper>
		</div>
	);
};

export default Milestone;