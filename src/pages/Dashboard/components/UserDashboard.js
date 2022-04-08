/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Route } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import {
  MenuItem,
  TextField,
  Typography,
  Button,
  Grid,
  Tabs,
  Tab,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Loader from '@components/Loader/Loader';
import { routes } from '@routes/routesConstants';
import { getAllProducts } from '@redux/product/actions/product.actions';
import {
  getAllFeatures,
  getAllIssues,
  getAllStatuses,
  deleteFeature,
  deleteIssue,
} from '@redux/decision/actions/decision.actions';
import { getAllCredentials } from '@redux/product/actions/product.actions';
import List from '../components/List';
import Kanban from '../components/Kanban';
import AddFeatures from '../forms/AddFeatures';
import AddIssues from '../forms/AddIssues';
import ConfirmModal from '@components/Modal/ConfirmModal';

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

  const featureToIssuePath = redirectTo
    ? _.includes(location.pathname, 'list')
      ? `${redirectTo}/dashboard/list`
      : `${redirectTo}/dashboard/kanban`
    : `${routes.DASHBOARD}/convert-issue`;

  useEffect(() => {
    dispatch(getAllProducts());
    if (!features || _.isEmpty(features)) {
      dispatch(getAllFeatures());
    }
    if (!issues || _.isEmpty(issues)) {
      dispatch(getAllIssues());
    }
    if (!statuses || _.isEmpty(statuses)) {
      dispatch(getAllStatuses());
    }
    if (!credentials || _.isEmpty(credentials)) {
      dispatch(getAllCredentials());
    }
  }, []);

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

  const editItem = (item, type) => {
    let path;
    if (type === 'feat') {
      path = `${editFeatPath}/:${item.feature_uuid}`;
    } else if (type === 'issue') {
      path = `${editIssuePath}/:${item.issue_uuid}`;
    }

    history.push(path, {
      type: 'edit',
      from: redirectTo || location.pathname,
      data: item,
      product_uuid: product,
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

  return (
    <div>
      {loading && <Loader open={loading} />}
      <Grid container alignItems="center" mb={2}>
        <Grid item xs={8}>
          <Typography component="div" variant="h3">
            Dashboard
          </Typography>
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
            {products && !_.isEmpty(products)
              && _.map(products, (prd) => (
                <MenuItem
                  key={`product-${prd.product_uuid}`}
                  value={prd.product_uuid}
                >
                  {prd.name}
                </MenuItem>
              ))}
          </TextField>
        </Grid>
      </Grid>
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
            convertIssue={convertIssue}
            deleteItem={deleteItem}
          />
        )}
      />
      <Route
        path={routes.DASHBOARD_KANBAN}
        render={(prps) => (
          <Kanban
            {...prps}
            statuses={statuses}
            product={product}
            productFeatures={productFeatures}
            productIssues={productIssues}
            addItem={addItem}
            editItem={editItem}
            convertIssue={convertIssue}
            deleteItem={deleteItem}
          />
        )}
      />
      <Route path={addFeatPath} component={AddFeatures} />
      <Route path={editFeatPath} component={AddFeatures} />
      <Route path={addIssuePath} component={AddIssues} />
      <Route path={editIssuePath} component={AddIssues} />
      <Route path={featureToIssuePath} component={AddIssues} />
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.productReducer,
  ...state.decisionReducer,
  loading: state.productReducer.loading && state.decisionReducer.loading,
});

export default connect(mapStateToProps)(UserDashboard);
