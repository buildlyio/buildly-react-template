/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import _ from 'lodash';
import { makeStyles } from '@mui/styles';
import {
  Button, Grid, MenuItem, Tab, Tabs, TextField, Typography,
} from '@mui/material';
import Loader from '@components/Loader/Loader';
import { routes } from '@routes/routesConstants';
import Tabular from './components/Tabular';
import {
  clearProductRelatedProductData, getAllCredentials, getAllProducts, getBoard, updateProduct,
} from '@redux/product/actions/product.actions';
import {
  clearProductRelatedReleaseData,
  createFeature,
  deleteFeature,
  deleteIssue,
  getAllFeatures,
  getAllIssues,
  getAllStatuses,
} from '@redux/release/actions/release.actions';
import NewFeatureForm from './forms/NewFeatureForm';
import AddIssues from './forms/AddIssues';
import AddComments from './forms/AddComments';
import ConfirmModal from '@components/Modal/ConfirmModal';
import IssueSuggestions from './forms/IssueSuggestions';
import IgnoreColumns from './forms/IgnoreColumns';
import ToolBoard from './forms/ToolBoard';
import StatusBoard from './forms/StatusBoard';

const useStyles = makeStyles((theme) => ({
  firstTimeMessage: {
    textAlign: 'center',
    padding: '25% 10%',
  },
  firstTimeButton: {
    marginTop: theme.spacing(2),
  },
  dashboardRoot: {
    marginTop: theme.spacing(2),
  },
  menuRight: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  selectedProduct: {
    width: theme.spacing(31.25),
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    '& .MuiInputBase-input': {
      paddingTop: theme.spacing(1.2),
      paddingBottom: theme.spacing(1.2),
    },
  },
  viewTabs: {
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
  configBoard: {
    margin: '10%',
    textAlign: 'center',
  },
  configBoardButton: {
    marginTop: theme.spacing(1),
  },
}));

const Dashboard = ({
  history,
  loading,
  loaded,
  user,
  dispatch,
  products,
  features,
  credentials,
  statuses,
  boards,
}) => {
  const classes = useStyles();
  const [route, setRoute] = useState(routes.DASHBOARD);
  const subNav = [
    { label: 'Tabular', value: 'tabular' },
    { label: 'Kanban', value: 'kanban' },
  ];
  const viewPath = (
    subNav.find((item) => location.pathname.endsWith(item.value)) || subNav[0]
  ).value;
  const [view, setView] = useState(viewPath);
  const [selectedProduct, setSelectedProduct] = useState((history && history.location
    && history.location.state && history.location.state.selected_product) || 0);
  const [product, setProduct] = useState(null);
  const [upgrade, setUpgrade] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteItemID, setDeleteItemID] = useState({ id: 0, type: 'feat' });
  const [featCred, setFeatCred] = useState(null);
  const [issueCred, setIssueCred] = useState(null);

  const addFeatPath = `${routes.DASHBOARD}/add-feature/`;
  const editFeatPath = `${routes.DASHBOARD}/edit-feature/`;
  const viewFeatPath = `${routes.DASHBOARD}/view-feature/`;
  const addIssuePath = `${routes.DASHBOARD}/add-issue/`;
  const editIssuePath = `${routes.DASHBOARD}/edit-issue/`;
  const addCommentPath = `${routes.DASHBOARD}/add-comment`;
  const issueSuggestionsPath = `${routes.DASHBOARD}/issue-suggestions`;
  const featureToIssuePath = `${routes.DASHBOARD}/convert-issue`;
  const ignoreColumnsPath = `${routes.DASHBOARD}/ignore-columns`;

  // this will be triggered whenever the content switcher is clicked to change the view
  useEffect(() => {
    history.push(`/app/dashboard/${view || location.state}`);
  }, [view]);

  useEffect(() => {
    if (loaded && !user.survey_status) {
      if (user.user_type === 'Developer') {
        setRoute(routes.DEVELOPER_FORM);
      }
      if (user.user_type === 'Product Team') {
        setRoute(routes.NEW_PRODUCT);
      }
    }
    dispatch(getAllProducts(user.organization.organization_uuid));
  }, [user]);

  useEffect(() => {
    if (selectedProduct && !!selectedProduct) {
      dispatch(getAllStatuses(selectedProduct));
      dispatch(getAllFeatures(selectedProduct));
      dispatch(getAllIssues(selectedProduct));
      dispatch(getAllCredentials(selectedProduct));
      dispatch(getBoard(selectedProduct));
    } else {
      dispatch(clearProductRelatedProductData());
      dispatch(clearProductRelatedReleaseData());
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedProduct && !!selectedProduct && (_.size(features) >= 5)
    && user && user.organization && !user.organization.unlimited_free_plan) {
      setUpgrade(true);
    } else {
      setUpgrade(false);
    }
  }, [selectedProduct, features]);

  useEffect(() => {
    setFeatCred(_.find(credentials, { auth_detail: { tool_type: 'Feature' } }));
    setIssueCred(_.find(credentials, { auth_detail: { tool_type: 'Issue' } }));
  }, [credentials]);

  useEffect(() => {
    if (selectedProduct && !!selectedProduct) {
      setProduct(_.find(products, { product_uuid: selectedProduct }));
    }
  }, [selectedProduct, products]);

  const addItem = (type) => {
    let path;
    if (type === 'feat') {
      path = addFeatPath;
    } else if (type === 'issue') {
      path = addIssuePath;
    }

    history.push(path, {
      from: location.pathname,
      product_uuid: selectedProduct,
    });
  };

  const editItem = (item, type, viewOnly = false) => {
    let path;
    if (type === 'feat') {
      path = `${viewOnly ? viewFeatPath : editFeatPath}:${item.feature_uuid}`;
    } else if (type === 'issue') {
      path = `${editIssuePath}:${item.issue_uuid}`;
    }

    history.push(path, {
      type: viewOnly ? 'view' : 'edit',
      from: location.pathname,
      data: item,
      product_uuid: selectedProduct,
    });
  };

  const deleteItem = (item, type) => {
    const deleteID = type === 'feat'
      ? item.feature_uuid
      : item.issue_uuid;

    setDeleteItemID({ id: deleteID, type });
    setOpenDeleteModal(true);
  };

  const handleDeleteModal = () => {
    const { id, type } = deleteItemID;

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

    setOpenDeleteModal(false);
  };

  const commentItem = () => {
    history.push(addCommentPath, {
      from: location.pathname,
      product_uuid: selectedProduct,
    });
  };

  const issueSuggestions = (item) => {
    history.push(issueSuggestionsPath, {
      type: 'show',
      from: location.pathname,
      product_uuid: selectedProduct,
      data: item,
    });
  };

  const convertIssue = (item, type) => {
    let path;
    if (type === 'convert') {
      path = featureToIssuePath;
    }

    history.push(path, {
      type: 'convert',
      from: location.pathname,
      product_uuid: selectedProduct,
      data: item,
    });
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
      ...product,
      product_info: {
        ...product.product_info,
        suggestions: _.without(product.product_info.suggestions, suggestion),
      },
    };

    dispatch(updateProduct(formData));
  };

  const configureBoard = () => {
    history.push(`${routes.DASHBOARD}/tool-board`, {
      from: location.pathname,
      product_uuid: selectedProduct,
    });
  };

  const configureStatus = () => {
    history.push(`${routes.DASHBOARD}/tool-status`, {
      from: location.pathname,
      product_uuid: selectedProduct,
    });
  };

  return (
    <>
      {loading && <Loader open={loading} />}

      {loaded && user && !user.survey_status && (
        <div className={classes.firstTimeMessage}>
          <Typography variant="h6" component="h6">
            Thanks for registering. To get you started we want to take your through a new product
            wizard. This will help you get oriented with the system, and create your first product
            with Inisights!
          </Typography>

          <Button
            variant="contained"
            type="button"
            className={classes.firstTimeButton}
            onClick={(e) => history.push(route)}
          >
            Let's get started!
          </Button>
        </div>
      )}

      {loaded && user && user.survey_status && _.isEmpty(statuses) && !!selectedProduct
      && !_.isEmpty(product) && !_.isEmpty(product.third_party_tool) && (
        <Grid item xs={4} className={classes.configBoard}>
          <Typography component="div" variant="h4" align="center">
            Configure Project Board
          </Typography>

          <Typography variant="subtitle1" align="center">
            Add a configuration to get started
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={configureBoard}
            className={classes.configBoardButton}
          >
            Add Configuration
          </Button>
        </Grid>
      )}

      {loaded && user && user.survey_status && _.isEmpty(statuses) && !!selectedProduct
      && !_.isEmpty(product) && _.isEmpty(product.third_party_tool) && (
        <Grid item xs={4} className={classes.configBoard}>
          <Typography component="div" variant="h4" align="center">
            Configure Project Board
          </Typography>

          <Typography variant="subtitle1" align="center">
            Add a configuration to get started
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={configureStatus}
            className={classes.configBoardButton}
          >
            Add Configuration
          </Button>
        </Grid>
      )}

      {loaded && user && user.survey_status && (
        <div className={classes.dashboardRoot}>
          <Grid container mb={2} alignItems="center">
            <Grid item md={4}>
              <Typography variant="h4">
                Dashboard
              </Typography>
            </Grid>

            <Grid item md={8} className={classes.menuRight}>
              <TextField
                variant="outlined"
                margin="normal"
                select
                id="selected-product"
                color="primary"
                label="Product Options"
                className={classes.selectedProduct}
                value={selectedProduct}
                onChange={(e) => {
                  if (e.target.value === -1) {
                    history.push(routes.NEW_PRODUCT, {
                      from: routes.DASHBOARD_TABULAR,
                    });
                  } else {
                    setSelectedProduct(e.target.value);
                  }
                }}
              >
                <MenuItem value={0}>Select</MenuItem>
                <MenuItem value={-1}>Create New Product</MenuItem>
                {products && !_.isEmpty(products)
                && _.map(products, (prod) => (
                  <MenuItem
                    key={`product-${prod.product_uuid}`}
                    value={prod.product_uuid}
                  >
                    {prod.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Grid mb={3} container justifyContent="center">
            <Grid item className={classes.viewTabs}>
              <Tabs value={view} onChange={(event, vw) => setView(vw)}>
                {subNav.map((itemProps, index) => (
                  <Tab {...itemProps} key={`tab${index}:${itemProps.value}`} />
                ))}
              </Tabs>
            </Grid>
          </Grid>

          <ConfirmModal
            open={openDeleteModal}
            setOpen={setOpenDeleteModal}
            submitAction={handleDeleteModal}
            title="Are you sure you want to delete?"
            submitText="Delete"
          />

          <Route
            path={routes.DASHBOARD_TABULAR}
            render={(prps) => (
              <Tabular
                {...prps}
                selectedProduct={selectedProduct}
                addItem={addItem}
                editItem={editItem}
                deleteItem={deleteItem}
                commentItem={commentItem}
                issueSuggestions={issueSuggestions}
                upgrade={upgrade}
                suggestedFeatures={
                  product && product.product_info && product.product_info.suggestions
                }
                createSuggestedFeature={createSuggestedFeature}
                removeSuggestedFeature={removeSuggestedFeature}
              />
            )}
          />
          <Route path={addFeatPath} component={NewFeatureForm} />
          <Route path={editFeatPath} component={NewFeatureForm} />
          <Route path={viewFeatPath} component={NewFeatureForm} />
          <Route path={addIssuePath} component={AddIssues} />
          <Route path={editIssuePath} component={AddIssues} />
          <Route path={addCommentPath} component={AddComments} />
          <Route path={featureToIssuePath} component={AddIssues} />
          <Route path={ignoreColumnsPath} component={IgnoreColumns} />
          <Route path={`${routes.DASHBOARD}/tool-status`} component={StatusBoard} />
          <Route
            path={issueSuggestionsPath}
            render={(renderProps) => (
              <IssueSuggestions {...renderProps} convertIssue={convertIssue} />
            )}
          />
          <Route
            path={`${routes.DASHBOARD}/tool-board`}
            render={(prps) => <ToolBoard {...prps} boards={boards} />}
          />
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  loading: state.authReducer.loading || state.productReducer.loading
    || state.releaseReducer.loading,
  loaded: state.authReducer.loaded || state.productReducer.loaded || state.releaseReducer.loaded,
  user: state.authReducer.data,
  products: state.productReducer.products,
  features: state.releaseReducer.features,
  credentials: state.productReducer.credentials,
  statuses: state.releaseReducer.statuses,
  boards: state.productReducer.boards,
});

export default connect(mapStateToProps)(Dashboard);
