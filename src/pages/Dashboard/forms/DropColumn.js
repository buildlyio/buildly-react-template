import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import {
  useTheme,
  useMediaQuery,
  Grid,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import FormModal from '@components/Modal/FormModal';
import { useInput } from '@hooks/useInput';
import {
  getAllStatuses,
  importTickets,
} from '@redux/decision/actions/decision.actions';
import { getAllCredentials } from '@redux/product/actions/product.actions';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      width: '70%',
      margin: 'auto',
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    borderRadius: '18px',
  },
  formTitle: {
    fontWeight: 'bold',
    marginTop: '1em',
    textAlign: 'center',
  },
}));

const DropColumn = ({
  dispatch,
  history,
  location,
  statuses,
  credentials,
  products,
}) => {
  const classes = useStyles();
  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);
  const product_uuid = location.state && location.state.product_uuid;
  const [product, setProduct] = useState('');
  const [prodStatus, setProdStatus] = useState('');
  const [statusID, setStatusID] = useState(null);
  const [status, setStatus] = useState('');

  const redirectTo = location.state && location.state.from;
  const [formError, setFormError] = useState({});

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    if (!status || _.isEmpty(status)) {
      dispatch(dispatch(getAllStatuses()));
    }
    dispatch(getAllCredentials());
  }, []);

  useEffect(() => {
    const prd = _.find(products, { product_uuid });
    setProduct(prd);
  }, [products]);

  useEffect(() => {
    const sta = _.filter(statuses, { product_uuid });
    setProdStatus(sta);
  }, [product]);

  const closeFormModal = () => {
    const dataHasChanged = (
      (!_.isEmpty(status))
    );

    if (dataHasChanged) {
      setConfirmModal(true);
    } else {
      setFormModal(false);
      if (location && location.state) {
        history.push(redirectTo);
      }
    }
  };

  const discardFormData = () => {
    setConfirmModal(false);
    setFormModal(false);
    if (location && location.state) {
      history.push(redirectTo);
    }
  };

  const featCred = _.find(
    credentials,
    { product_uuid, auth_detail: { tool_type: 'Feature' } },
  );
  const issueCred = _.find(
    credentials,
    { product_uuid, auth_detail: { tool_type: 'Issue' } },
  );
  const repoData = [];
  for (let i = 0; i < product?.issue_tool_detail?.repository_list?.length; i += 1) {
    repoData.push(product.issue_tool_detail.repository_list[i].name);
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    if (featCred?.auth_detail?.tool_name !== 'GitHub') {
      const featData = {
        ...featCred?.auth_detail,
        product_uuid,
        board_id: product?.feature_tool_detail?.board_detail?.board_id,
        drop_col_name: statusID,
      };
      if (featCred?.auth_detail) {
        dispatch(importTickets(featData));
      }
      const issueData = {
        ...issueCred?.auth_detail,
        product_uuid,
        board_id: product?.feature_tool_detail?.board_detail?.board_id,
        drop_col_name: statusID,
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
        product_uuid,
        board_id: product?.feature_tool_detail?.board_detail?.board_id,
        is_repo_issue: false,
        drop_col_name: statusID,
      };
      if (featCred?.auth_detail) {
        dispatch(importTickets(featData));
      }
    } else {
      const featData = {
        ...featCred?.auth_detail,
        product_uuid,
        board_id: product?.feature_tool_detail?.board_detail?.board_id,
        is_repo_issue: false,
        drop_col_name: statusID,
      };
      if (featCred?.auth_detail) {
        dispatch(importTickets(featData));
      }
      const issueData = {
        ...issueCred?.auth_detail,
        product_uuid,
        board_id: product?.feature_tool_detail?.board_detail?.board_id,
        is_repo_issue: true,
        repo_list: repoData,
        drop_col_name: statusID,
      };
      if (issueCred?.auth_detail) {
        dispatch(importTickets(issueData));
      }
    }
    history.push(redirectTo);
  };

  return (
    <>
      {openFormModal && (
        <FormModal
          open={openFormModal}
          handleClose={closeFormModal}
          title="Select column to drop"
          titleClass={classes.formTitle}
          maxWidth="md"
          wantConfirm
          openConfirmModal={openConfirmModal}
          setConfirmModal={setConfirmModal}
          handleConfirmModal={discardFormData}
        >
          <form
            className={classes.form}
            noValidate
            onSubmit={handleSubmit}
          >
            <Grid container spacing={isDesktop ? 2 : 0}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  // required
                  fullWidth
                  select
                  id="status"
                  label="Select Column"
                  name="status"
                  autoComplete="status"
                  value={status}
                  onChange={(e) => {
                    const stat = e.target.value;
                    setStatus(stat);
                    setStatusID({ column_name: stat.name, column_id: stat.status_tracking_id });
                  }}
                >
                  {_.map(prodStatus, (sts) => (
                    <MenuItem
                      key={`status-${sts.status_uuid}-${sts.name}`}
                      value={sts}
                    >
                      {sts.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={isDesktop ? 3 : 0}
              justifyContent="center"
            >
              <Grid item xs={12} sm={4}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  // disabled={submitDisabled()}
                >
                  Submit
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={discardFormData}
                  className={classes.submit}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </FormModal>
      )}
    </>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  statuses: state.decisionReducer.statuses,
  features: state.decisionReducer.features,
  products: state.productReducer.products,
  credentials: state.productReducer.credentials,
});

export default connect(mapStateToProps)(DropColumn);
