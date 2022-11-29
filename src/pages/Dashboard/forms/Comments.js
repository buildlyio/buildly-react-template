import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment-timezone';
import makeStyles from '@mui/styles/makeStyles';
import {
  Button, Card, CardContent, Grid, TextField, Typography, useMediaQuery, useTheme,
} from '@mui/material';
import FormModal from '@components/Modal/FormModal';
import Loader from '@components/Loader/Loader';
import { useInput } from '@hooks/useInput';
import { validators } from '@utils/validators';
import { createComment } from '@redux/release/actions/release.actions';

const useStyles = makeStyles((theme) => ({
  formTitle: {
    fontWeight: 'bold',
    marginTop: '1em',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(5),
    [theme.breakpoints.up('sm')]: {
      width: '70%',
      margin: 'auto',
      marginTop: theme.spacing(5),
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    borderRadius: '18px',
  },
  commentCard: {
    width: '100%',
    marginTop: theme.spacing(3),
    boxShadow: '0px 0px 16px 1px rgba(0,0,0,0.2)',
    [theme.breakpoints.up('sm')]: {
      width: '70%',
      margin: 'auto',
      marginTop: theme.spacing(3),
    },
  },
  fromNow: {
    textAlign: 'end',
  },
}));

const Comments = ({
  location, history, loading, credentials, dispatch, comments,
}) => {
  const classes = useStyles();
  const redirectTo = location.state && location.state.from;
  const { feature, issue } = location && location.state;

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);
  const commentText = useInput('');
  const [formError, setFormError] = useState({});

  const closeFormModal = () => {
    if (commentText.value) {
      setConfirmModal(true);
    } else {
      setFormModal(false);
      history.push(redirectTo);
    }
  };

  const discardFormData = () => {
    setConfirmModal(false);
    setFormModal(false);
    history.push(redirectTo);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const featCred = _.find(credentials, (cred) => (_.toLower(cred.auth_detail.tool_type) === 'feature'));
    const issueCred = _.find(credentials, (cred) => (_.toLower(cred.auth_detail.tool_type) === 'issue'));
    const authDetail = !_.isEmpty(feature) ? featCred?.auth_detail : issueCred?.auth_detail;

    const commentData = {
      ...authDetail,
      comment: commentText.value,
      product_uuid: feature?.product_uuid || issue?.product_uuid,
      feature: feature?.feature_uuid,
      issue: issue?.issue_uuid,
      card_number: feature?.feature_tracker_id || issue?.issue_number,
      repository: issue?.repository,
    };

    dispatch(createComment(commentData));
  };

  const handleBlur = (e, validation, input, parentId) => {
    const validateObj = validators(validation, input);
    const prevState = { ...formError };
    if (validateObj && validateObj.error) {
      setFormError({
        ...prevState,
        [e.target.id || parentId]: validateObj,
      });
    } else {
      setFormError({
        ...prevState,
        [e.target.id || parentId]: {
          error: false,
          message: '',
        },
      });
    }
  };

  const submitDisabled = () => {
    const errorKeys = Object.keys(formError);
    if (!commentText.value) {
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
          title="Comments"
          titleClass={classes.formTitle}
          maxWidth="md"
          wantConfirm
          openConfirmModal={openConfirmModal}
          setConfirmModal={setConfirmModal}
          handleConfirmModal={discardFormData}
        >
          {loading && <Loader open={loading} />}

          {!_.isEmpty(comments) && _.map(comments, (comment, index) => (
            <Card key={comment.comment_uuid} className={classes.commentCard}>
              <CardContent>
                <Typography variant="body1">
                  {comment.comment}
                </Typography>

                <Typography variant="caption" component="p" className={classes.fromNow}>
                  {moment(comment.create_date).fromNow()}
                </Typography>
              </CardContent>
            </Card>
          ))}

          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Grid container spacing={isDesktop ? 2 : 0}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="commentText"
                  placeholder="Leave a comment"
                  name="commentText"
                  autoComplete="commentText"
                  onBlur={(e) => handleBlur(e, 'required', commentText)}
                  {...commentText.bind}
                />
              </Grid>
            </Grid>

            <Grid container spacing={isDesktop ? 3 : 0} justifyContent="right">
              <Grid item xs={12} sm={4}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={submitDisabled()}
                >
                  Comment
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
  credentials: state.productReducer.credentials,
  comments: state.releaseReducer.comments,
});

export default connect(mapStateToProps)(Comments);
