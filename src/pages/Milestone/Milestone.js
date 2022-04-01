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
  TextField,
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
  getRepositories, closeMilestones,
} from '@redux/milestone/actions/milestone.actions';
import { connect } from 'react-redux';
import { useInput } from '@hooks/useInput';

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

const Milestone = ({
  history, loading, repositories, dispatch, milestones, milestoneHeadings,
}) => {
  const classes = useStyles();

  const [owner, setOwner] = useState(window.env.GITHUB_OWNER);
  const ownerInput = useInput(owner || '', { required: true });

  const [milestoneState, setMilestoneState] = useState('open');
  const [deleteModalState, setDeleteModalState] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState(null);

  const [selectedRepositories, setSelectedRepositories] = useState([]);
  const [selectedMilestones, setSelectedMilestones] = useState([]);

  const [selectAllRepositories, setSelectAllRepositories] = useState(false);
  const [selectAllMilestones, setSelectAllMilestones] = useState(false);

  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const addMilestonePath = `${routes.MILESTONE}/add`;
  const editMilestonePath = `${routes.MILESTONE}/edit`;

  // to refresh the repositories on owner change
  useEffect(() => {
    setSelectedRepositories([]);

    dispatch(getRepositories({
      owner,
    }));
  }, [owner]);

  // to refresh the milestones if the selected-repositories/owner/milestone-state changes
  useEffect(() => {
    if(repositories.length && selectedRepositories.length) {
      dispatch(getMilestones({
        owner, selectedRepositories, milestoneState,
      }));
    } else {
      dispatch(clearMilestones());
      dispatch(clearMilestonesHeadings());

      setSelectedMilestones([]);
    }

    if(selectedRepositories.length === repositories.length && repositories.length) {
      setSelectAllRepositories(true);
    } else {
      setSelectAllRepositories(false);
    }
  }, [selectedRepositories, owner, milestoneState]);

  // to format the incoming milestones to be displayed onto the datatable
  useEffect(() => {
    const extractData = (string, term) => (string.includes(term)
      ? string.split(`\n> ${term}`).pop().split('\n')[0].trim()
      : null);

    let data = milestones.filter(({ title }) => selectedMilestones.includes(title));
    data = data.map(({
      url, title, state, description, due_on, number, id
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
      number,
      id
    }));

    const updatedHeadings = selectedMilestones
      .filter((heading) => milestoneHeadings.includes(heading));
    const difference = selectedMilestones.filter((heading) => !updatedHeadings.includes(heading));

    if (difference.length) {
      setSelectedMilestones(updatedHeadings);
    }

    setRows(data);

    if(selectedMilestones.length === milestoneHeadings.length && milestoneHeadings.length) {
      setSelectAllMilestones(true);
    } else {
      setSelectAllMilestones(false);
    }
  }, [selectedMilestones, milestones]);

  // handling the repositories select
  const selectedRepositoriesHandler = (event) => {
    const {
      target: { value },
    } = event;

    if (typeof value === 'object' && value.includes('select-all')) {
      if(selectedRepositories.length === repositories.length) {
        setSelectedRepositories([]);
      } else {
        setSelectedRepositories(repositories.map((name) => name));
      }
    } else {
      setSelectedRepositories(
        typeof value === 'string' ? value.split(',') : value,
      );
    }
  };

  // handling the milestones select
  const selectedMilestonesHandler = (event) => {
    const {
      target: { value },
    } = event;

    if (typeof value === 'object' && value.includes('select-all')) {
      if(selectedMilestones.length === milestoneHeadings.length) {
        setSelectedMilestones([]);
      } else {
        setSelectedMilestones(milestoneHeadings.map((name) => name));
      }
    } else {
      setSelectedMilestones(
        typeof value === 'string' ? value.split(',') : value,
      );
    }
  };

  // handling the refresh button click
  const refreshMilestones = () => {
    if (selectedRepositories.length) {
      dispatch(getMilestones({
        owner, selectedRepositories, milestoneState,
      }));
    } else {
      dispatch(clearMilestones());
      dispatch(clearMilestonesHeadings());

      setSelectedMilestones([]);
    }
  };

  // changing the page on add-milestone click
  const addMilestone = () => history.push(`${addMilestonePath}`, {
    type: 'add',
    from: routes.MILESTONE,
    data: null,
  });

  // changing the page on edit-milestone click
  const editMilestone = (milestone) => {
    history.push(`${editMilestonePath}/${milestone.number}`, {
      type: 'edit',
      from: routes.MILESTONE,
      data: milestone,
    });
  };

  // handling the milestone delete button click
  const deleteConfirmationHandler = (milestone) => {
    setCurrentMilestone(milestone);
    setDeleteModalState(true);
  };

  // handling the delete-milestone confirmation
  const deleteMilestoneHandler = () => {
    const { repository, number, id } = currentMilestone;

    dispatch(deleteMilestone({
      owner, repository, number, id
    }));

    setCurrentMilestone(null);
    setDeleteModalState(false);
    if(!selectedMilestones.length) {
      setSelectedRows([]);
    }
  };

  const closeMilestonesHandler = () => {
    let milestonesToBeClosed = selectedRows.map((rowNumber) => ({
      owner,
      repository: rows[rowNumber].repository,
      number: rows[rowNumber].number,
      data: {
        state: 'closed',
      }
    }));

    dispatch(closeMilestones(milestonesToBeClosed));

    setSelectedRows([]);
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <TextField
            id="Owner"
            label="Owner"
            variant="outlined"
            value={owner}
            fullWidth
            {...ownerInput.bind}
            onBlur={() => setOwner(ownerInput.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <FormControl sx={{ width: 1 }}>
            <InputLabel id="select-repositories">
              Repositories
            </InputLabel>
            <Select
              labelId="select-repositories"
              id="repositories"
              multiple
              value={selectedRepositories}
              onChange={selectedRepositoriesHandler}
              input={(
                <OutlinedInput
                  id="select-multiple-repositories"
                  label="Repositories"
                />
      )}
              renderValue={(selected) => (
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 0.5,
                  }}
                >
                  { selected.map((value) => (
                    <Chip key={value} label={value} />
                  )) }
                </Box>
              )}
            >
              <MenuItem key={null} value={null} disabled>
                { repositories.length ? 'Select Repositories' : 'No repositories available.' }
              </MenuItem>
              {
                repositories.length
                  && (
                  <MenuItem key="Select All" value="select-all">
                    <Checkbox checked={selectAllRepositories} />
                    Select All
                  </MenuItem>
                  )
              }
              { repositories.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={selectedRepositories.indexOf(name) > -1} />
                  { name }
                </MenuItem>
              )) }
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl sx={{ width: 1 }}>
            <InputLabel id="select-milestones">
              Milestone(s)
            </InputLabel>
            <Select
              labelId="select-milestones"
              id="milestones"
              multiple
              value={selectedMilestones}
              onChange={selectedMilestonesHandler}
              input={(
                <OutlinedInput
                  id="select-multiple-milestones"
                  label="Milestone(s)"
                />
      )}
              renderValue={(selected) => (
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 0.5,
                  }}
                >
                  { selected.map((value) => (
                    <Chip key={value} label={value} />
                  )) }
                </Box>
              )}
            >
              <MenuItem key={null} value={null} disabled>
                { milestoneHeadings.length ? 'Select Milestone(s)' : 'No milestones available.' }
              </MenuItem>
              {
                  milestoneHeadings.length
                  && (
                  <MenuItem key="Select All" value="select-all">
                    <Checkbox checked={selectAllMilestones} />
                    Select All
                  </MenuItem>
                  )
              }
              { milestoneHeadings.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={selectedMilestones.indexOf(name) > -1} />
                  { name }
                </MenuItem>
              )) }
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormGroup>
            <FormControlLabel
              control={(
                <Checkbox
                  onChange={(event) => {
                    setMilestoneState(
                      event.target.checked
                        ? 'closed'
                        : 'open',
                    );

                    setSelectedMilestones([]);
                  }}
                />
      )}
              label="Closed Milestones"
            />
          </FormGroup>
        </Grid>
        <Grid item xs={2}>
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={refreshMilestones}
          >
            Refresh
          </Button>
        </Grid>
      </Grid>
      <DataTableWrapper
        loading={loading}
        rows={rows || []}
        columns={milestoneConstants || []}
        hideAddButton={false}
        onAddButtonClick={addMilestone}
        hideAdditionalButton={!selectedRows.length}
        additionalButtonHeading="Close"
        addButtonHeading="Add Milestone"
        onAdditionalButtonClick={closeMilestonesHandler}
        tableHeader="Milestones"
        editAction={editMilestone}
        deleteAction={deleteConfirmationHandler}
        openDeleteModal={deleteModalState}
        setDeleteModal={setDeleteModalState}
        handleDeleteModal={deleteMilestoneHandler}
        deleteModalTitle="Are you sure you want to delete the milestone?"
        selectable={{
          rows: milestoneState === 'open' ? 'multiple' : 'none',
        }}
        onRowSelectChange={(selectedRows) => {
          setSelectedRows(selectedRows);
        }}
        selected={selectedRows}
      >
        <Route path={`${addMilestonePath}`} render={(props) => <MilestoneForm refresh={refreshMilestones} loading={loading} history={history} repositories={repositories} dispatch={dispatch} {...props} />}/>
        <Route path={`${editMilestonePath}/:id`} component={MilestoneForm} />
      </DataTableWrapper>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.milestoneReducer,
});

export default connect(mapStateToProps)(Milestone);
