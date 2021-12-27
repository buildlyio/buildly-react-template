import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Route } from 'react-router-dom';
import {
  useTheme,
  MenuItem,
  TextField,
  Typography,
  Chip,
  Button,
  Box,
  useMediaQuery,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {
  AddRounded as AddRoundedIcon,
} from '@mui/icons-material';
import { routes } from '@routes/routesConstants';
import { deleteRequirement, deleteIssue } from '@redux/dashboard/actions/dashboard.actions';
import AddRequirements from '../forms/AddRequirements';
import AddIssues from '../forms/AddIssues';
import RequirementToIssue from '../forms/RequirementToIssue';
import ConfirmModal from '../forms/ConfirmModal';
import List from '../components/List';
import Kanban from '../components/Kanban';

const useStyles = makeStyles((theme) => ({
  section1: {
    position: 'fixed',
    padding: theme.spacing(1, 2),
    width: '75%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: theme.palette.secondary.contrastText,
    background: theme.palette.secondary.dark,
    // left: 0,
    flexWrap: 'wrap',
    top: '4rem',
    zIndex: '99',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      left: 0
    },
  },
  title: {
    margin: theme.spacing(2, 0),
  },
  product: {
    width: '20%',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.secondary.contrastText,
    },
    '& .MuiOutlinedInput-root:hover > .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgb(255, 255, 255, 0.23)',
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.secondary.contrastText,
    },
    '& .MuiSelect-icon': {
      color: theme.palette.secondary.contrastText,
    },
    '& .MuiInputBase-input': {
      color: theme.palette.secondary.contrastText,
    },
  },
  viewContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '12rem',
  },
  section2: {
    position: 'absolute',
    top: '12rem',
    // left: '0',
    width: '75%',
    padding: theme.spacing(0, 2),
    [theme.breakpoints.down('md')]: {
      width: '100%',
      left: 0
    },
    [theme.breakpoints.down('sm')]: {
      top: '17rem'
    },
  },
}));

const getView = (
  view,
  props,
  proj,
  setProj,
  projReqs,
  setProjReqs,
  projIssues,
  setProjIssues,
  setDeleteModal,
  setDeleteItem,
  addItem,
  editItem,
  convertIssue,
  deleteItem,
  openDeleteModal,
  handleDeleteModal,
) => {
  switch (view) {
    case 'list':
      return (
        <List
          {...props}
          proj={proj}
          setProj={setProj}
          projReqs={projReqs}
          setProjReqs={setProjReqs}
          projIssues={projIssues}
          setProjIssues={setProjIssues}
          setDeleteModal={setDeleteModal}
          setDeleteItem={setDeleteItem}
          addItem={addItem}
          editItem={editItem}
          convertIssue={convertIssue}
          deleteItem={deleteItem}
          openDeleteModal={openDeleteModal}
          handleDeleteModal={handleDeleteModal}
        />
      );
    case 'kanban':
      return (
        <Kanban
          {...props}
          proj={proj}
          setProj={setProj}
          projReqs={projReqs}
          setProjReqs={setProjReqs}
          projIssues={projIssues}
          setProjIssues={setProjIssues}
          setDeleteModal={setDeleteModal}
          setDeleteItem={setDeleteItem}
          addItem={addItem}
          editItem={editItem}
          convertIssue={convertIssue}
          deleteItem={deleteItem}
          openDeleteModal={openDeleteModal}
          handleDeleteModal={handleDeleteModal}
        />
      );

    default:
      return 'Unknown View Selection';
  }
};

const UserDashboard = (props) => {
  const {
    products,
    dispatch,
    requirements,
    issues,
    redirectTo,
    history,
  } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [view, setView] = useState('list');
  const [proj, setProj] = useState(0);
  const [projReqs, setProjReqs] = useState([]);
  const [projIssues, setProjIssues] = useState([]);
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [toDeleteItem, setDeleteItem] = useState({ id: 0, type: 'req' });
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const addReqPath = redirectTo
    ? `${redirectTo}/dashboard`
    : `${routes.DASHBOARD}/add-requirement`;

  const editReqPath = redirectTo
    ? `${redirectTo}/dashboard`
    : `${routes.DASHBOARD}/edit-requirement`;

  const addIssuePath = redirectTo
    ? `${redirectTo}/dashboard`
    : `${routes.DASHBOARD}/add-issue`;

  const editIssuePath = redirectTo
    ? `${redirectTo}/dashboard`
    : `${routes.DASHBOARD}/edit-issue`;

  const requirementToIssuePath = redirectTo
    ? `${redirectTo}/dashboard`
    : `${routes.DASHBOARD}/convert-issue`;

  useEffect(() => {
    const reqs = _.filter(
      requirements,
      { projectID: proj },
    );
    setProjReqs(_.orderBy(reqs, ['id']));
  }, [requirements]);

  useEffect(() => {
    const iss = _.filter(
      issues,
      { projectID: proj },
    );
    setProjIssues(_.orderBy(iss, ['id']));
  }, [issues]);

  const editItem = (item, type) => {
    let path;
    if (type === 'req') {
      path = `${editReqPath}/:${item.id}`;
    } else if (type === 'issue') {
      path = `${editIssuePath}/:${item.id}`;
    } else if (type === 'convert') {
      path = `${requirementToIssuePath}/:${item.id}`;
    }

    history.push(path, {
      type: 'edit',
      from: redirectTo || routes.DASHBOARD,
      data: item,
      projectID: proj,
    });
  };

  const addItem = (type) => {
    let path;
    let nextId;
    if (type === 'req') {
      path = addReqPath;
      nextId = (_.max(_.map(projReqs, 'id')) || 0) + 1;
    } else if (type === 'issue') {
      path = addIssuePath;
      nextId = (_.max(_.map(projIssues, 'id')) || 0) + 1;
    } else if (type === 'convert') {
      path = requirementToIssuePath;
      nextId = (_.max(_.map(projIssues, 'id')) || 0) + 1;
    }

    history.push(path, {
      from: redirectTo || routes.DASHBOARD,
      projectID: proj,
      nextId,
    });
  };

  const convertIssue = (item, type) => {
    let path;
    let nextId;
    if (type === 'convert') {
      path = requirementToIssuePath;
      nextId = (_.max(_.map(projIssues, 'id')) || 0) + 1;
    }

    history.push(path, {
      type: 'edit',
      from: redirectTo || routes.DASHBOARD,
      projectID: proj,
      nextId,
      data: item,
    });
  };

  const deleteItem = (item, type) => {
    setDeleteItem({ id: item.id, type });
    setDeleteModal(true);
  };

  const handleDeleteModal = () => {
    const { type } = toDeleteItem;
    const { id } = toDeleteItem;
    setDeleteModal(false);
    if (type === 'req') {
      dispatch(deleteRequirement(id));
    } else if (type === 'issue') {
      dispatch(deleteIssue(id));
    }
  };

  const handleNewProject = () => {
    history.push(routes.NEW_PROJECT);
  };

  return (
    <div>
      <div className={classes.section1}>
        {/* {!isDesktop && (
          <Box mb={2}> */}
        <Typography className={classes.title} variant="h3">
          Dashboard
        </Typography>
        <div
          className={classes.viewContainer}
        >
          <Chip label="List View" color={view === 'list' ? 'primary' : 'secondary'} onClick={(e) => setView('list')} />
          <Chip label="Kanban View" color={view === 'kanban' ? 'primary' : 'secondary'} onClick={(e) => setView('kanban')} />
        </div>
        <TextField
          variant="outlined"
          margin="normal"
          select
          id="product"
          color="primary"
          label="Select Project"
          className={classes.product}
          value={proj}
          onChange={(e) => {
            setProj(e.target.value);
            setProjReqs(_.filter(
              requirements,
              { projectID: e.target.value },
            ));
            setProjIssues(_.filter(
              issues,
              { projectID: e.target.value },
            ));
          }}
        >
          <MenuItem value={0}>Select</MenuItem>
          {products
            && products.length > 0
            && _.map(products, (proj) => (
              <MenuItem
                key={`product-${proj.id}`}
                value={proj.id}
              >
                {proj.name}
              </MenuItem>
            ))}
        </TextField>
        <Button
          aria-controls="new-project"
          aria-haspopup="true"
          color="primary"
          variant="contained"
          onClick={(e) => handleNewProject()}
          startIcon={<AddRoundedIcon />}
        >
          New Project
        </Button>
        {/* </Box>
      )} */}
      </div>
      <div className={classes.section2}>
        {getView(
          view,
          props,
          proj,
          setProj,
          projReqs,
          setProjReqs,
          projIssues,
          setProjIssues,
          setDeleteModal,
          setDeleteItem,
          addItem,
          editItem,
          convertIssue,
          deleteItem,
          openDeleteModal,
          handleDeleteModal,
        )}
      </div>

      <ConfirmModal
        open={openDeleteModal}
        setOpen={setDeleteModal}
        submitAction={handleDeleteModal}
        title="Are you sure you want to delete?"
        submitText="Delete"
      />
      <Route path={`${addReqPath}`} component={AddRequirements} />
      <Route path={`${editReqPath}`} component={AddRequirements} />
      <Route path={`${addIssuePath}`} component={AddIssues} />
      <Route path={`${editIssuePath}`} component={AddIssues} />
      <Route path={`${requirementToIssuePath}`} component={RequirementToIssue} />
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.dashboardReducer,
});

export default connect(mapStateToProps)(UserDashboard);
