import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import parse from 'html-react-parser';
import makeStyles from '@mui/styles/makeStyles';
import {
  Card, CardContent, Typography,
} from '@mui/material';
import Loader from '@components/Loader/Loader';
import FormModal from '@components/Modal/FormModal';

const useStyles = makeStyles((theme) => ({
  formTitle: {
    fontWeight: 'bold',
    marginTop: '1em',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      width: '70%',
      margin: 'auto',
    },
  },
  card: {
    marginBottom: theme.spacing(2),
  },
}));

const ShowRelatedIssues = ({
  location, history, loading, issues,
}) => {
  const classes = useStyles();
  const redirectTo = location.state && location.state.from;
  const feature_uuid = location.state && location.state.feature_uuid;

  const [openFormModal, setFormModal] = useState(true);
  const [relatedIssues, setRelatedIssues] = useState([]);

  useEffect(() => {
    setRelatedIssues(_.filter(issues, { feature_uuid }));
  }, [issues]);

  const handleClose = () => {
    setFormModal(false);
    history.push(redirectTo);
  };

  return (
    <>
      {openFormModal && (
        <FormModal
          open={openFormModal}
          handleClose={handleClose}
          title="Related Issues"
          titleClass={classes.formTitle}
          maxWidth="md"
          className={classes.form}
        >
          {loading && <Loader open={loading} />}

          {_.isEmpty(relatedIssues) && (
            <Typography variant="body1" component="div">
              No related issues found.
            </Typography>
          )}

          {!_.isEmpty(relatedIssues) && _.map(relatedIssues, (issue) => (
            <Card key={`issue-${issue.issue_uuid}`} className={classes.card}>
              <CardContent>
                <Typography variant="h6">
                  {issue.name}
                </Typography>

                <Typography variant="body1">
                  {parse(issue.description)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </FormModal>
      )}
    </>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  loading: state.releaseReducer.loading,
  issues: state.releaseReducer.issues,
});

export default connect(mapStateToProps)(ShowRelatedIssues);
