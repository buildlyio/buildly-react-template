import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import {
  useTheme,
  useMediaQuery,
  Grid,
  Button,
  Typography,
} from '@mui/material';
import FormModal from '@components/Modal/FormModal';
import Loader from '@components/Loader/Loader';
import {
  createIssue,
} from '@redux/release/actions/release.actions';

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
  noSuggestions: {
    width: '100%',
    padding: theme.spacing(4),
    textAlign: 'center',
  },
}));

const IssueSuggestions = ({
  history,
  location,
  dispatch,
  credentials,
  products,
  convertIssue,
  loading,
}) => {
  const classes = useStyles();
  const redirectTo = location.state && location.state.from;
  const editData = (
    location.state
    && (location.state.type === 'edit' || location.state.type === 'view')
    && location.state.data
  ) || {};
  const product_uuid = location.state && location.state.product_uuid;
  const showData = (
    location.state
    && location.state.type === 'show'
    && location.state.data
  ) || {};

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [product, setProduct] = useState('');

  useEffect(() => {
    const prod = _.find(products, { product_uuid });
    setProduct(prod);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const dateTime = new Date();
    const issueCred = _.find(
      credentials,
      { product_uuid, auth_detail: { tool_type: 'Issue' } },
    );

    const formData = {
      ...editData,
      edit_date: dateTime,
      feature_uuid: showData.feature_uuid,
      start_date: dateTime,
      end_date: dateTime,
      status: showData.status,
      tags: showData.tags,
      product_uuid,
      estimate: showData.total_estimate,
      complexity: Number(),
      repository: product.issue_tool_detail?.repository_list[0]?.name,
      create_date: dateTime,
      column_id: product.issue_tool_detail?.column_list[0]?.column_id,
      ...issueCred?.auth_detail,
      issue_detail: {},
    };

    const issueSuggestionsData = _.map(showData.issue_suggestion, (issue) => ({
      ...formData,
      name: issue.name,
      description: issue.description,
      issue_type: issue.ticket_type,
    }));

    dispatch(createIssue(issueSuggestionsData));
    history.push(redirectTo);
  };

  const closeFormModal = () => {
    setFormModal(false);
    if (location && location.state) {
      history.push(redirectTo);
    }
  };

  const discardFormData = () => {
    setConfirmModal(false);
    setFormModal(false);
    if (location && location.state) {
      history.push(redirectTo);
    }
  };

  return (
    <>
      {openFormModal && (
        <FormModal
          open={openFormModal}
          handleClose={closeFormModal}
          title="Issue Suggestions"
          titleClass={classes.formTitle}
          maxWidth="md"
          wantConfirm
          openConfirmModal={openConfirmModal}
          setConfirmModal={setConfirmModal}
          handleConfirmModal={discardFormData}
        >
          {loading && <Loader open={loading} />}
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Grid container rowGap={2}>
              {showData && _.isEmpty(showData.issue_suggestion) && (
                <Typography variant="body1" className={classes.noSuggestions}>
                  No suggested issues found
                </Typography>
              )}

              {showData && !_.isEmpty(showData.issue_suggestion)
              && _.map(showData.issue_suggestion, (issue, index) => (
                <Button
                  key={`${issue.name}-${index}`}
                  style={{ cursor: 'text' }}
                  fullWidth
                  variant="outlined"
                  color="secondary"
                >
                  {`${issue.name} (${issue.ticket_type} ticket)`}
                </Button>
              ))}
            </Grid>

            <Grid container spacing={isDesktop ? 3 : 0} justifyContent="center">
              {(showData && (
                <Grid item xs={12} sm={4}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={_.isEmpty(showData.issue_suggestion)}
                  >
                    Go with suggestions
                  </Button>
                </Grid>
              ))}

              <Grid item xs={12} sm={4}>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={(e) => convertIssue(showData, 'convert')}
                  className={classes.submit}
                >
                  Create own issue
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
  loading: state.productReducer.loading || state.releaseReducer.loading,
  products: state.productReducer.products,
  credentials: state.productReducer.credentials,
});

export default connect(mapStateToProps)(IssueSuggestions);
