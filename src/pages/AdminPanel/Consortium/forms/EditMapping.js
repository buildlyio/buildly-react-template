import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  useTheme,
  useMediaQuery,
  Grid,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import FormModal from '../../../../components/Modal/FormModal';
import { useInput } from '../../../../hooks/useInput';
import {
  editCustodian,
} from '../../../../redux/custodian/actions/custodian.actions';

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
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  formTitle: {
    fontWeight: 'bold',
    marginTop: '1em',
    textAlign: 'center',
  },
}));

const EditMapping = ({
  history,
  location,
  loading,
  dispatch,
  allOrgs,
}) => {
  const classes = useStyles();
  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [options, setOptions] = useState([]);

  const pageType = location.state && location.state.type;
  const pageData = location.state && location.state.data;
  const buttonText = pageType === 'edit'
    ? 'Save'
    : 'Set Mapping';
  const formTitle = pageType === 'edit'
    ? 'Edit Mapping'
    : 'Set Mapping';

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const custodyOrg = useInput((
    pageData && pageData.custody_org_uuid
  ) || '');

  useEffect(() => {
    if (allOrgs && pageData) {
      const opts = _.map(allOrgs, (org) => {
        const suggest = _.lowerCase(org.name) === _.lowerCase(pageData.name);
        return {
          value: org.organization_uuid,
          name: org.name,
          order: suggest ? 1 : 0,
        };
      });
      const orderedOpts = _.orderBy(
        opts,
        ['order', 'name'],
        ['desc', 'asc'],
      );

      setOptions(orderedOpts);
    }
  }, [allOrgs, pageData]);

  const closeFormModal = () => {
    if (custodyOrg.hasChanged()) {
      setConfirmModal(true);
    } else {
      setFormModal(false);
      if (location && location.state) {
        history.push(location.state.from);
      }
    }
  };

  const discardFormData = () => {
    setConfirmModal(false);
    setFormModal(false);
    if (location && location.state) {
      history.push(location.state.from);
    }
  };

  /**
   * Submit The form and add/edit custodian type
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const editData = {
      ...pageData,
      custody_org_uuid: custodyOrg.value || null,
      edit_date: new Date(),
    };
    dispatch(editCustodian(editData, null, history, location.state.from));

    setFormModal(false);
  };

  return (
    <div>
      {openFormModal && (
        <FormModal
          open={openFormModal}
          handleClose={closeFormModal}
          title={formTitle}
          titleClass={classes.formTitle}
          maxWidth="md"
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
                  fullWidth
                  disabled
                  id="name"
                  label="Custodian Name"
                  name="name"
                  value={(pageData && pageData.name) || ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  select
                  id="custodyOrg"
                  label="Custodian Organization"
                  name="custodyOrg"
                  autoComplete="custodyOrg"
                  {...custodyOrg.bind}
                >
                  <MenuItem value="">Select</MenuItem>
                  {options
                  && options.length > 0
                  && _.map(options, (option, index) => (
                    <MenuItem
                      key={`org-option-${index}`}
                      value={option.value}
                    >
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={6} sm={4}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={loading}
                  >
                    {buttonText}
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Button
                    type="button"
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={discardFormData}
                    className={classes.submit}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </FormModal>
      )}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
});

export default connect(mapStateToProps)(EditMapping);
