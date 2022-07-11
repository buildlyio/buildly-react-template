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
  Autocomplete,
  Chip,
} from '@mui/material';
import FormModal from '@components/Modal/FormModal';
import { useInput } from '@hooks/useInput';
import {
  getAllStatuses,
  createIssue,
  updateIssue,
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

  const [status, setStatus] = useState([]);
  const statusList = [];
  for (let i = 0; i < prodStatus?.length; i += 1) {
    statusList.push(prodStatus[i].name);
  }

  let colList;
  const colData = [];
  if (prodStatus) {
    colList = [...new Set(prodStatus
      .filter((element) => status.includes(element.name)))];
    for (let i = 0; i < colList?.length; i += 1) {
      colData.push({
        column_id: colList[i].status_tracking_id,
        column_name: colList[i].name,
      });
    }
  }

  const redirectTo = location.state && location.state.from;
  const [formError, setFormError] = useState({});

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    if (!status || _.isEmpty(status)) {
      dispatch(dispatch(getAllStatuses()));
    }
    // if (!credentials || _.isEmpty(credentials)) {
    //   dispatch(getAllCredentials());
    // }
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

  // Handle statuses list
  const onStatusChange = (value) => {
    switch (true) {
      case (value.length > status.length):
        setStatus([...status, _.last(value)]);
        break;

      case (value.length < status.length):
        setStatus(value);
        break;

      default:
        break;
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
        drop_col_name: {
          colData,
        },
      };
      if (featCred?.auth_detail) {
        dispatch(importTickets(featData));
      }
      const issueData = {
        ...issueCred?.auth_detail,
        product_uuid,
        board_id: product?.feature_tool_detail?.board_detail?.board_id,
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
        drop_col_name: {
          colData,
        },
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
        drop_col_name: {
          colData,
        },
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
      };
      if (issueCred?.auth_detail) {
        dispatch(importTickets(issueData));
      }
    }
    history.push(redirectTo);
  };

  const submitDisabled = () => {
    const errorKeys = Object.keys(formError);
    if (
      !status
    ) {
      return true;
    }
    let errorExists = false;
    _.forEach(errorKeys, (key) => {
      if (formError[key].error) {
        errorExists = true;
      }
    });
    return errorExists;
  };

  return (
    <>
      {openFormModal && (
        <FormModal
          open={openFormModal}
          handleClose={closeFormModal}
          title="Select columns to import tickets from"
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
                <Autocomplete
                  fullWidth
                  multiple
                  filterSelectedOptions
                  id="status"
                  options={statusList}
                  freeSolo
                  value={status}
                  onChange={(e, newValue) => onStatusChange(newValue)}
                  renderTags={(value, getStatusProps) => (
                    _.map(value, (option, index) => (
                      <Chip
                        variant="default"
                        label={option}
                        {...getStatusProps({ index })}
                      />
                    ))
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Select the list of Columns"
                      margin="normal"
                    />
                  )}
                />
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
                  disabled={submitDisabled()}
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
