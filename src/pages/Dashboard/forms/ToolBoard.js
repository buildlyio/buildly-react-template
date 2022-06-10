/* eslint-disable no-nested-ternary */
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
import { createBoard } from '@redux/product/actions/product.actions';
import { validators } from '@utils/validators';

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

const ToolBoard = ({
  dispatch,
  history,
  location,
  statuses,
  boards,
}) => {
  const classes = useStyles();
  const [featOrgList, setFeatOrgList] = useState([]);
  const [issueOrgList, setIssueOrgList] = useState([]);
  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);
  const product_uuid = location.state && location.state.product_uuid;
  const [featOrgID, setFeatOrgID] = useState('');
  const [issueOrgID, setIssueOrgID] = useState('');
  const [featBoardList, setFeatBoardList] = useState([]);
  const [featBoardID, setFeatBoardID] = useState('');

  const redirectTo = location.state && location.state.from;
  const [formError, setFormError] = useState({});

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    if (!_.isEmpty(boards)) {
      const last = boards[boards.length - 1];
      for (let i = 0; i < last.length; i += 1) {
        if (last[i].issue_tool_detail) {
          setIssueOrgList(last[i].issue_tool_detail);
        }
        if (last[i].feature_tool_detail) {
          setFeatOrgList(last[i].feature_tool_detail);
        }
      }
    }
  }, [boards]);

  const closeFormModal = () => {
    const dataHasChanged = (
      (!_.isEmpty(featOrgList)
      && !featOrgID)
    || (!_.isEmpty(issueOrgList)
    && !issueOrgID)
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

  const handleSubmit = (event) => {
    event.preventDefault();
    delete featOrgID.board_list;
    delete issueOrgID.board_list;
    const formData = {
      product_uuid,
      feature_tool_detail: {
        ...featOrgID,
        board_detail:
          {
            ...featBoardID,
          },
      },
      issue_tool_detail: {
        ...issueOrgID,
        board_detail:
            {},
      },
    };
    dispatch(createBoard(formData));
    history.push(redirectTo);
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
    if (
      (!_.isEmpty(featOrgList)
        && !featOrgID)
      || (!_.isEmpty(featBoardList)
      && !featBoardID)
      || (!_.isEmpty(issueOrgList)
      && !issueOrgID)
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
          title="Configure Project Board"
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
              {!_.isEmpty(featOrgList) && (
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  select
                  id="featOrgID"
                  label="Feature Organisation"
                  name="featOrgID"
                  autoComplete="featOrgID"
                  value={featOrgID}
                  onChange={(e) => {
                    const org = e.target.value;
                    setFeatOrgID(org);
                    setFeatBoardList(org.board_list);
                  }}
                >
                  {_.map(featOrgList, (org) => (
                    <MenuItem
                      key={`org-${org.org_id}-${org.org_name}`}
                      value={org}
                    >
                      {org.org_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              )}
              {!_.isEmpty(featBoardList) && (
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  select
                  id="boardID"
                  label="Feature Tool Board"
                  name="boardID"
                  value={featBoardID}
                  autoComplete="boardID"
                  onChange={(e) => {
                    const board = e.target.value;
                    setFeatBoardID(board);
                  }}
                >
                  {_.map(featBoardList, (board) => (
                    <MenuItem
                      key={`board-${board.board_id}-${board.board_name}`}
                      value={board}
                    >
                      {board.board_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              )}
              {!_.isEmpty(issueOrgList) && (
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  select
                  id="issueOrgID"
                  label="Issue Organisation"
                  name="issueOrgID"
                  autoComplete="issueOrgID"
                  value={issueOrgID}
                  onChange={(e) => {
                    const org = e.target.value;
                    setIssueOrgID(org);
                  }}
                >
                  {_.map(issueOrgList, (org) => (
                    <MenuItem
                      key={`org-${org.org_id}-${org.org_name}`}
                      value={org}
                    >
                      {org.org_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              )}
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
                  Configure Board
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
});

export default connect(mapStateToProps)(ToolBoard);
