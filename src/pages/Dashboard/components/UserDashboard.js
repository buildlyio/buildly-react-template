/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Route } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import {
  Grid, MenuItem, Tab, Tabs, TextField, Typography, Button,
} from '@mui/material';
import Loader from '@components/Loader/Loader';
import { routes } from '@routes/routesConstants';
import { getAllCredentials, getAllProducts, getBoard } from '@redux/product/actions/product.actions';
import {
  deleteFeature,
  deleteIssue,
  getAllFeatures,
  getAllIssues,
  getAllStatuses,
  importTickets,
} from '@redux/decision/actions/decision.actions';
import List from '../components/List';
import Kanban from '../components/Kanban';
import AddFeatures from '../forms/AddFeatures';
import NewFeatureForm from '../forms/NewFeatureForm';
import AddIssues from '../forms/AddIssues';
import IssueSuggestions from '../forms/IssueSuggestions';
import AddComments from '../forms/AddComments';
import ConfirmModal from '@components/Modal/ConfirmModal';
import ToolBoard from '../forms/ToolBoard';
import StatusBoard from '../forms/StatusBoard';

const useStyles = makeStyles((theme) => ({
  product: {
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
  tabs: {
    '& .MuiTabs-root': {
      color: theme.palette.secondary.contrastText,
      '& .Mui-selected': {
        color: theme.palette.primary.main,
      },
      '& .MuiTabs-indicator': {
        backgroundColor: theme.palette.secondary.light,
      },
    },
  },
  board: {
    margin: '10%',
    textAlign: 'center',
  },
  boardButton: {
    marginTop: theme.spacing(1),
  },
}));

const UserDashboard = (props) => {
  const {
    products,
    loading,
    dispatch,
    features,
    issues,
    statuses,
    credentials,
    redirectTo,
    history,
    loaded,
    user,
    boards,
    importLoaded,
  } = props;

  const classes = useStyles();
  const subNav = [
    { label: 'List', value: 'list' },
    { label: 'Kanban', value: 'kanban' },
  ];
  const viewPath = (
    subNav.find((item) => location.pathname.endsWith(item.value)) || subNav[0]
  ).value;
  const [view, setView] = useState(viewPath);

  const [product, setProduct] = useState(0);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [prod, setProd] = useState('');
  const [status, setStatus] = useState('');
  const [productFeatures, setProductFeatures] = useState([]);
  const [productIssues, setProductIssues] = useState([]);
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [toDeleteItem, setDeleteItem] = useState({ id: 0, type: 'feat' });

  const addFeatPath = redirectTo
    ? _.includes(location.pathname, 'list')
      ? `${redirectTo}/dashboard/list`
      : `${redirectTo}/dashboard/kanban`
    : `${routes.DASHBOARD}/add-feature`;

  const editFeatPath = redirectTo
    ? _.includes(location.pathname, 'list')
      ? `${redirectTo}/dashboard/list`
      : `${redirectTo}/dashboard/kanban`
    : `${routes.DASHBOARD}/edit-feature`;

  const viewFeatPath = redirectTo
    ? _.includes(location.pathname, 'list')
      ? `${redirectTo}/dashboard/list`
      : `${redirectTo}/dashboard/kanban`
    : `${routes.DASHBOARD}/view-feature`;

  const addIssuePath = redirectTo
    ? _.includes(location.pathname, 'list')
      ? `${redirectTo}/dashboard/list`
      : `${redirectTo}/dashboard/kanban`
    : `${routes.DASHBOARD}/add-issue`;

  const editIssuePath = redirectTo
    ? _.includes(location.pathname, 'list')
      ? `${redirectTo}/dashboard/list`
      : `${redirectTo}/dashboard/kanban`
    : `${routes.DASHBOARD}/edit-issue`;

  const issueSuggestionsPath = redirectTo
    ? _.includes(location.pathname, 'list')
      ? `${redirectTo}/dashboard/list`
      : `${redirectTo}/dashboard/kanban`
    : `${routes.DASHBOARD}/issue-suggestions`;

  const featureToIssuePath = redirectTo
    ? _.includes(location.pathname, 'list')
      ? `${redirectTo}/dashboard/list`
      : `${redirectTo}/dashboard/kanban`
    : `${routes.DASHBOARD}/convert-issue`;

  const addCommentPath = redirectTo
    ? _.includes(location.pathname, 'list')
      ? `${redirectTo}/dashboard/list`
      : `${redirectTo}/dashboard/kanban`
    : `${routes.DASHBOARD}/add-comment`;

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAllStatuses());
    dispatch(getAllFeatures());
    dispatch(getAllIssues());
    if (!credentials || _.isEmpty(credentials)) {
      dispatch(getAllCredentials());
    }
  }, []);

  useEffect(() => {
    dispatch(getAllFeatures());
    dispatch(getAllIssues());
  }, [importLoaded]);

  useEffect(() => {
    const currentProd = _.filter(products,
      { organization_uuid: user.organization.organization_uuid });
    setCurrentProducts(currentProd);
  }, [products]);

  useEffect(() => {
    if (product) {
      dispatch(getBoard(product));
    }
    const prd = _.find(products, { product_uuid: product });
    setProd(prd);
    const sta = _.filter(statuses, { product_uuid: product });
    setStatus(sta);
  }, [statuses, product]);

  // this will be triggered whenever the content switcher is clicked to change the view
  useEffect(() => {
    history.push(`/app/dashboard/${view || location.state}`);
  }, [view]);

  useEffect(() => {
    const feats = _.filter(
      features,
      { product_uuid: product },
    );
    const iss = _.filter(
      issues,
      { product_uuid: product },
    );

    setProductFeatures(_.orderBy(feats, 'create_date', 'desc'));
    setProductIssues(_.orderBy(iss, 'create_date', 'desc'));
  }, [product, JSON.stringify(features), JSON.stringify(issues)]);

  const viewTabClicked = (event, vw) => {
    setView(vw);
  };

  const editItem = (item, type, viewOnly = false) => {
    let path;
    if (type === 'feat') {
      path = `${viewOnly ? viewFeatPath : editFeatPath}/:${item.feature_uuid}`;
    } else if (type === 'issue') {
      path = `${editIssuePath}/:${item.issue_uuid}`;
    }

    history.push(path, {
      type: viewOnly ? 'view' : 'edit',
      from: redirectTo || location.pathname,
      data: item,
      product_uuid: product,
      viewOnly,
    });
  };

  const addItem = (type) => {
    let path;
    if (type === 'feat') {
      path = addFeatPath;
    } else if (type === 'issue') {
      path = addIssuePath;
    }

    history.push(path, {
      from: redirectTo || location.pathname,
      product_uuid: product,
    });
  };

  const commentItem = () => {
    history.push(addCommentPath, {
      from: redirectTo || location.pathname,
      product_uuid: product,
    });
  };

  const configureBoard = () => {
    history.push(`${routes.DASHBOARD}/tool-board`, {
      from: redirectTo || location.pathname,
      product_uuid: product,
    });
  };

  const configureStatus = () => {
    history.push(`${routes.DASHBOARD}/tool-status`, {
      from: redirectTo || location.pathname,
      product_uuid: product,
    });
  };

  const convertIssue = (item, type) => {
    let path;
    if (type === 'convert') {
      path = featureToIssuePath;
    }

    history.push(path, {
      type: 'convert',
      from: redirectTo || location.pathname,
      product_uuid: product,
      data: item,
    });
  };

  const issueSuggestions = (item, type) => {
    let path;
    if (type === 'show') {
      path = issueSuggestionsPath;
    }

    history.push(path, {
      type: 'show',
      from: redirectTo || location.pathname,
      product_uuid: product,
      data: item,
    });
  };

  const deleteItem = (item, type) => {
    const deleteID = type === 'feat'
      ? item.feature_uuid
      : item.issue_uuid;

    setDeleteItem({ id: deleteID, type });
    setDeleteModal(true);
  };

  const featCred = _.find(
    credentials,
    { product_uuid: product, auth_detail: { tool_type: 'Feature' } },
  );
  const issueCred = _.find(
    credentials,
    { product_uuid: product, auth_detail: { tool_type: 'Issue' } },
  );
  const handleDeleteModal = () => {
    const { id, type } = toDeleteItem;
    setDeleteModal(false);
    if (type === 'feat') {
      const deleteCred = {
        ...featCred?.auth_detail,
        feature_uuid: id,
      };
      dispatch(deleteFeature(deleteCred));
    } else if (type === 'issue') {
      const deleteCreds = {
        ...issueCred?.auth_detail,
        issue_uuid: id,
      };
      dispatch(deleteIssue(deleteCreds));
    }
  };

  const repoData = [];
  for (let i = 0; i < prod?.issue_tool_detail?.repository_list?.length; i += 1) {
    repoData.push(prod.issue_tool_detail.repository_list[i].name);
  }

  const importTicket = (e) => {
    e.preventDefault();
    if (featCred?.auth_detail?.tool_name !== 'GitHub') {
      const featData = {
        ...featCred?.auth_detail,
        product_uuid: product,
        board_id: prod?.feature_tool_detail?.board_detail?.board_id,
      };
      dispatch(importTickets(featData));
      const issueData = {
        ...issueCred?.auth_detail,
        product_uuid: product,
        board_id: prod?.feature_tool_detail?.board_detail?.board_id,
      };
      if (featCred?.auth_detail?.tool_name !== 'GitHub' && issueCred?.auth_detail?.tool_name === 'GitHub') {
        issueData.is_repo_issue = true;
        issueData.repo_list = repoData;
      }
      dispatch(importTickets(issueData));
    } else if (featCred?.auth_detail?.tool_name === 'GitHub' && issueCred?.auth_detail?.tool_name === 'GitHub') {
      const featData = {
        ...featCred?.auth_detail,
        product_uuid: product,
        board_id: prod?.feature_tool_detail?.board_detail?.board_id,
        is_repo_issue: false,
      };
      dispatch(importTickets(featData));
    } else {
      const featData = {
        ...featCred?.auth_detail,
        product_uuid: product,
        board_id: prod?.feature_tool_detail?.board_detail?.board_id,
        is_repo_issue: false,
      };
      dispatch(importTickets(featData));
      const issueData = {
        ...issueCred?.auth_detail,
        product_uuid: product,
        board_id: prod?.feature_tool_detail?.board_detail?.board_id,
        is_repo_issue: true,
        repo_list: repoData,
      };
      dispatch(importTickets(issueData));
    }
  };

  return (
    <div>
      <Grid container alignItems="center" mb={2}>
        <Grid item xs={4}>
          <Typography component="div" variant="h3">
            Dashboard
          </Typography>
        </Grid>
        <Grid item xs={4}>
          {(prod?.third_party_tool
        && (
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => importTicket(e)}
          >
            Import Tickets
          </Button>
        )
           )}
        </Grid>
        <Grid item xs={4}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            select
            id="product"
            color="primary"
            label="Product Options"
            className={classes.product}
            value={product}
            onChange={(e) => {
              if (e.target.value === -1) {
                history.push(routes.NEW_PRODUCT);
              } else {
                setProduct(e.target.value);
              }
            }}
          >
            <MenuItem value={0}>Select</MenuItem>
            <MenuItem value={-1}>Create New Product</MenuItem>
            {currentProducts && !_.isEmpty(currentProducts)
              && _.flatMap(_.map(currentProducts, (prd) => (
                <MenuItem
                  key={`product-${prd.product_uuid}`}
                  value={prd.product_uuid}
                >
                  {prd.name}
                </MenuItem>
              )))}
          </TextField>
        </Grid>
      </Grid>
      {((_.isEmpty(status)) && product !== 0
        ? (!_.isEmpty(prod) && (!_.isEmpty(prod.third_party_tool)))
          ? (
            <>
              <Grid item xs={4} className={classes.board}>
                <Typography component="div" variant="h4" align="center">
                  Configure Project Board
                </Typography>
                <Typography variant="subtitle1" align="center">
                  Add a configuration to get started
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => configureBoard()}
                  className={classes.boardButton}
                >
                  Add Configuration
                </Button>
              </Grid>
              <Route
                path={`${routes.DASHBOARD}/tool-board`}
                render={(prps) => (
                  <ToolBoard
                    {...prps}
                    boards={boards}
                  />
                )}
              />
            </>
          )
          : (
            <>
              <Grid item xs={4} className={classes.board}>
                <Typography component="div" variant="h4" align="center">
                  Configure Project Board
                </Typography>
                <Typography variant="subtitle1" align="center">
                  Add a configuration to get started
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => configureStatus()}
                  className={classes.boardButton}
                >
                  Add Configuration
                </Button>
              </Grid>
              <Route
                path={`${routes.DASHBOARD}/tool-status`}
                render={(prps) => (
                  <StatusBoard
                    {...prps}
                  />
                )}
              />
            </>
          )
        : (
          <>
            {!loaded && <Loader open={!loaded} /> }
            <Grid mb={3} container justifyContent="center">
              <Grid item className={classes.tabs}>
                <Tabs value={view} onChange={viewTabClicked}>
                  {subNav.map((itemProps, index) => (
                    <Tab {...itemProps} key={`tab${index}:${itemProps.value}`} />
                  ))}
                </Tabs>
              </Grid>
            </Grid>
            <ConfirmModal
              open={openDeleteModal}
              setOpen={setDeleteModal}
              submitAction={handleDeleteModal}
              title="Are you sure you want to delete?"
              submitText="Delete"
            />
            <Route
              path={routes.DASHBOARD_LIST}
              render={(prps) => (
                <List
                  {...prps}
                  product={product}
                  productFeatures={productFeatures}
                  productIssues={productIssues}
                  addItem={addItem}
                  editItem={editItem}
                  deleteItem={deleteItem}
                  commentItem={commentItem}
                  issueSuggestions={issueSuggestions}
                />
              )}
            />
            <Route
              path={routes.DASHBOARD_KANBAN}
              render={(prps) => (
                <Kanban
                  {...prps}
                  credentials={credentials}
                  product={product}
                  productFeatures={productFeatures}
                  productIssues={productIssues}
                  addItem={addItem}
                  editItem={editItem}
                  issueSuggestions={issueSuggestions}
                  deleteItem={deleteItem}
                  commentItem={commentItem}
                  dispatch={dispatch}
                />
              )}
            />
            <Route
              path={addFeatPath}
              render={(prps) => (
                <NewFeatureForm
                  {...prps}
                  productFeatures={productFeatures}
                />
              )}
            />
            <Route
              path={editFeatPath}
              render={(prps) => (
                <NewFeatureForm
                  {...prps}
                  productFeatures={productFeatures}
                />
              )}
            />
            <Route
              path={viewFeatPath}
              render={(prps) => (
                <NewFeatureForm
                  {...prps}
                />
              )}
            />
            <Route path={addIssuePath} component={AddIssues} />
            <Route path={editIssuePath} component={AddIssues} />
            <Route
              path={issueSuggestionsPath}
              render={(prps) => (
                <IssueSuggestions
                  {...prps}
                  convertIssue={convertIssue}
                />
              )}
            />
            <Route path={featureToIssuePath} component={AddIssues} />
            <Route path={addCommentPath} component={AddComments} />
          </>
        ))}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.productReducer,
  ...state.decisionReducer,
  loading: state.productReducer.loading && state.decisionReducer.loading,
  loaded: state.productReducer.loaded && state.decisionReducer.loaded,
  user: state.authReducer.data,
  boards: state.productReducer.boards,
  importLoaded: state.decisionReducer.importLoaded,
});

export default connect(mapStateToProps)(UserDashboard);
