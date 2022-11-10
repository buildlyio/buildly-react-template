/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Route } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import {
  Grid, MenuItem, Tab, Tabs, TextField, Typography, Button, IconButton,
} from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import Loader from '@components/Loader/Loader';
import { routes } from '@routes/routesConstants';
import {
  getAllCredentials, getAllProducts, getBoard, updateProduct,
} from '@redux/product/actions/product.actions';
import { createBoard } from '@redux/product/actions/product.actions';
import {
  createFeature,
  deleteFeature,
  deleteIssue,
  getAllFeatures,
  getAllIssues,
  getAllStatuses,
  importTickets,
} from '@redux/release/actions/release.actions';
import List from '../components/List';
import Kanban from '../components/Kanban';
import NewFeatureForm from '../forms/NewFeatureForm';
import AddIssues from '../forms/AddIssues';
import IssueSuggestions from '../forms/IssueSuggestions';
import AddComments from '../forms/AddComments';
import ConfirmModal from '@components/Modal/ConfirmModal';
import ToolBoard from '../forms/ToolBoard';
import StatusBoard from '../forms/StatusBoard';
import DropColumn from '../forms/DropColumn';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
  product: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    '& .MuiInputBase-input': {
      paddingTop: theme.spacing(1.2),
      paddingBottom: theme.spacing(1.2),
    },
  },
  tabs: {
    '& .MuiTabs-root': {
      color: theme.palette.contrast.text,
      '& .Mui-selected': {
        color: theme.palette.secondary.main,
      },
      '& .MuiTabs-indicator': {
        backgroundColor: theme.palette.secondary.main,
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
  menuRight: {
    marginLeft: 'auto',
    display: 'flex',
  },
  importButton: {
    whiteSpace: 'nowrap',
    margin: theme.spacing(2, 0),
  },
  bar: {
    minWidth: '250px',
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

  const [product, setProduct] = useState((history && history.location && history.location.state
    && history.location.state.selected_product) || 0);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [prod, setProd] = useState('');
  const [status, setStatus] = useState('');
  const [productFeatures, setProductFeatures] = useState([]);
  const [productIssues, setProductIssues] = useState([]);
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [toDeleteItem, setDeleteItem] = useState({ id: 0, type: 'feat' });
  const [upgrade, setUpgrade] = useState(false);

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

  const addDropColumnPath = `${routes.DASHBOARD}/select-column`;

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
    dispatch(getAllProducts());
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

    if ((_.size(feats) >= 5) && user && user.organization
    && !user.organization.unlimited_free_plan) {
      setUpgrade(true);
    } else {
      setUpgrade(false);
    }

    setProductFeatures(_.orderBy(feats, 'create_date', 'desc'));
    setProductIssues(_.orderBy(iss, 'create_date', 'desc'));
  }, [product, features, issues]);

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
    if (prod?.feature_tool_detail == null) {
      if (featCred?.auth_detail?.tool_name !== 'GitHub') {
        const featData = {
          ...featCred?.auth_detail,
          product_uuid: product,
          board_id: prod?.feature_tool_detail?.board_detail?.board_id,
          drop_col_name: null,
        };
        if (featCred?.auth_detail) {
          dispatch(importTickets(featData));
        }
        const issueData = {
          ...issueCred?.auth_detail,
          product_uuid: product,
          board_id: prod?.feature_tool_detail?.board_detail?.board_id,
          drop_col_name: null,
        };
        if (featCred?.auth_detail?.tool_name !== 'GitHub' && issueCred?.auth_detail?.tool_name === 'GitHub') {
          issueData.is_repo_issue = true;
          issueData.repo_list = repoData;
        }
        if (issueCred?.auth_detail) {
          dispatch(importTickets(issueData));
        }
      } else if (featCred?.auth_detail?.tool_name === 'GitHub' && issueCred?.auth_detail?.tool_name === 'GitHub') {
        const featData = {
          ...featCred?.auth_detail,
          product_uuid: product,
          board_id: prod?.feature_tool_detail?.board_detail?.board_id,
          is_repo_issue: false,
          drop_col_name: null,
        };
        if (featCred?.auth_detail) {
          dispatch(importTickets(featData));
        }
      } else {
        const featData = {
          ...featCred?.auth_detail,
          product_uuid: product,
          board_id: prod?.feature_tool_detail?.board_detail?.board_id,
          is_repo_issue: false,
          drop_col_name: null,
        };
        if (featCred?.auth_detail) {
          dispatch(importTickets(featData));
        }
        const issueData = {
          ...issueCred?.auth_detail,
          product_uuid: product,
          board_id: prod?.feature_tool_detail?.board_detail?.board_id,
          is_repo_issue: true,
          repo_list: repoData,
          drop_col_name: null,
        };
        if (issueCred?.auth_detail) {
          dispatch(importTickets(issueData));
        }
      }
    } else {
      history.push(addDropColumnPath, {
        from: redirectTo || location.pathname,
        product_uuid: product,
      });
    }
  };

  const syncData = (e) => {
    e.preventDefault();
    const formData = {
      product_uuid: product,
      feature_tool_detail: {
        tool_name: featCred?.auth_detail?.tool_name,
        tool_type: featCred?.auth_detail?.tool_type,
        org_id: prod?.feature_tool_detail?.org_id,
        org_name: prod?.feature_tool_detail?.org_name,
        board_detail:
            {
              ...prod.feature_tool_detail.board_detail,
            },
      },
      issue_tool_detail: {
        tool_name: issueCred?.auth_detail?.tool_name,
        tool_type: issueCred?.auth_detail?.tool_type,
        org_id: prod?.issue_tool_detail?.org_id,
        org_name: prod?.issue_tool_detail?.org_name,
        board_detail: {},
      },
    };
    dispatch(createBoard(formData, false));
  };

  const createSuggestedFeature = (suggestion) => {
    const datetime = new Date();

    const formData = {
      create_date: datetime,
      edit_date: datetime,
      name: suggestion.suggested_feature,
      description: suggestion.suggested_feature,
      product_uuid: product,
      ...featCred?.auth_detail,
      feature_detail: {},
    };

    if (suggestion.suggested_issue) {
      formData.suggestions = [{
        name: suggestion.suggested_issue,
        description: suggestion.suggested_issue,
        ticket_type: suggestion.issue_repo_type,
      }];
    }

    dispatch(createFeature(formData));
    removeSuggestedFeature(suggestion);
  };

  const removeSuggestedFeature = (suggestion) => {
    const formData = {
      ...prod,
      product_info: {
        ...prod.product_info,
        suggestions: _.without(prod.product_info.suggestions, suggestion),
      },
    };

    dispatch(updateProduct(formData));
  };

  return (
    <div className={classes.root}>
      {loading && <Loader open={loading} />}
      <Grid container alignItems="center" mb={2}>
        <Grid item xs={4} md={3} lg={2}>
          <Typography component="div" variant="h4">
            Dashboard
          </Typography>
        </Grid>
        <div className={classes.menuRight}>
          {((!_.isEmpty(prod?.third_party_tool)) && (!_.isEmpty(status))
          && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => importTicket(e)}
                className={classes.importButton}
              >
                Import Tickets
              </Button>
              <IconButton
                aria-label="sync"
                color="inherit"
                size="large"
                onClick={(e) => syncData(e)}
              >
                <SyncIcon fontSize="large" className={classes.menuIcon} />
              </IconButton>
            </>
          ))}

          <Grid item lg={2} className={classes.bar}>
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
                  history.push(routes.NEW_PRODUCT, {
                    from: redirectTo || location.pathname,
                  });
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
        </div>
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
                  upgrade={upgrade}
                  productSuggestions={prod && prod.product_info && prod.product_info.suggestions}
                  createSuggestedFeature={createSuggestedFeature}
                  removeSuggestedFeature={removeSuggestedFeature}
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
                  upgrade={upgrade}
                  productSuggestions={prod && prod.product_info && prod.product_info.suggestions}
                  createSuggestedFeature={createSuggestedFeature}
                  removeSuggestedFeature={removeSuggestedFeature}
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
            <Route path={addDropColumnPath} component={DropColumn} />
          </>
        ))}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.productReducer,
  ...state.releaseReducer,
  loading: state.productReducer.loading || state.releaseReducer.loading,
  user: state.authReducer.data,
  boards: state.productReducer.boards,
  importLoaded: state.releaseReducer.importLoaded,
});

export default connect(mapStateToProps)(UserDashboard);
