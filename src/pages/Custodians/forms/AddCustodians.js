import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  Button,
  TextField,
  Card,
  CircularProgress,
  CardContent,
  Typography,
  useTheme,
  Grid,
  MenuItem,
  useMediaQuery,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import CustomizedTooltips from '../../../components/ToolTip/ToolTip';
import FormModal from '../../../components/Modal/FormModal';
import { UserContext } from '../../../context/User.context';
import { useInput } from '../../../hooks/useInput';
import {
  addCustodians,
  editCustodian,
} from '../../../redux/custodian/actions/custodian.actions';
import { validators } from '../../../utils/validators';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
  },
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
  logo: {
    width: '100%',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  loadingWrapper: {
    position: 'relative',
  },
  addressContainer: {
    marginTop: theme.spacing(4),
  },
  formTitle: {
    fontWeight: 'bold',
    marginTop: '1em',
    textAlign: 'center',
  },
  inputWithTooltip: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const AddCustodians = ({
  dispatch,
  loading,
  history,
  location,
  custodianTypeList,
  custodianOptions,
  contactOptions,
  allOrgs,
  countries,
}) => {
  const classes = useStyles();
  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);

  const editPage = location.state && location.state.type === 'edit';
  const editData = (
    location.state
    && location.state.type === 'edit'
    && location.state.data
  ) || {};
  const redirectTo = location.state && location.state.from;
  const contactData = editPage && location.state.contactData;

  const company = useInput(editData.name || '', {
    required: true,
  });
  const alias = useInput(editData.custodian_alias || '');
  const custodianType = useInput(editData.custodian_type || '', {
    required: true,
  });
  const glnNumber = useInput(editData.custodian_glns || '');
  const city = useInput(contactData.city || '');
  const state = useInput(contactData.state || '', {
    required: true,
  });
  const country = useInput(contactData.country || '', {
    required: true,
  });
  const zip = useInput(contactData.postal_code || '');
  const address_1 = useInput(contactData.address1 || '', {
    required: true,
  });
  const address_2 = useInput(contactData.address2 || '');
  const [formError, setFormError] = useState({});

  const buttonText = editPage ? 'Save' : 'Add Custodian';
  const formTitle = editPage ? 'Edit Custodian' : 'Add Custodian';

  const [custodianMetaData, setCustodianMetaData] = useState({});
  const [contactMetaData, setProductMetaData] = useState({});
  const organization = useContext(UserContext).organization.organization_uuid;

  useEffect(() => {
    if (custodianOptions && custodianOptions.actions) {
      setCustodianMetaData(custodianOptions.actions.POST);
    }
    if (contactOptions && contactOptions.actions) {
      setProductMetaData(contactOptions.actions);
    }
  }, [contactOptions, custodianOptions]);

  const closeFormModal = () => {
    const dataHasChanged = (
      company.hasChanged()
      || custodianType.hasChanged()
      || city.hasChanged()
      || state.hasChanged()
      || country.hasChanged()
      || zip.hasChanged()
      || address_1.hasChanged()
      || address_2.hasChanged()
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

  /**
   * Submit The form and add/edit custodian
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const contact_obj = {
      country: country.value,
      state: state.value,
      address1: address_1.value,
      address2: address_2.value,
      city: city.value,
      postal_code: zip.value,
      ...(editPage && { contact_uuid: contactData.contact_uuid }),
      ...(editPage && { url: contactData.url }),
      ...(editPage && { id: contactData.id }),
      organization_uuid: organization,
    };
    const orgNames = allOrgs.map((org) => org.name);
    const custodianName = new RegExp(`.*${company.value.split('').join('.*').replace(/\s+/g, ' ').replace(/\d+/g, '')
      .replace(/\s/g, '')
      .trim()}.*`, 'i');
    const matchingOrgs = _.filter(orgNames, (org) => custodianName.test(org));
    let custody_org_uuid = null;
    if (matchingOrgs.length > 0) {
      custody_org_uuid = _.find(allOrgs, { name: matchingOrgs[0] }).organization_uuid;
    }
    const custodianFormValue = {
      custodian_alias: alias.value,
      custodian_type: custodianType.value,
      name: company.value,
      custodian_glns: glnNumber.value,
      contact_obj,
      ...(editPage && { url: editData.url }),
      ...(editPage && { id: editData.id }),
      organization_uuid: organization,
      custody_org_uuid: custody_org_uuid || null,
    };
    if (editPage) {
      dispatch(editCustodian(
        custodianFormValue,
        history,
        redirectTo,
      ));
    } else {
      dispatch(addCustodians(
        custodianFormValue,
        history,
        redirectTo,
      ));
    }
  };

  /**
   * Handle input field blur event
   * @param {Event} e Event
   * @param {String} validation validation type if any
   * @param {Object} input input field
   */

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
      !company.value
      || !custodianType.value
      || !address_1.value
      || !state.value
      || !country.value
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

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

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
              <Grid
                className={classes.inputWithTooltip}
                item
                xs={12}
                md={6}
                sm={6}
              >
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="company"
                  label="Company Name"
                  name="company"
                  autoComplete="company"
                  error={
                    formError.company
                    && formError.company.error
                  }
                  helperText={
                    formError.company
                      ? formError.company.message
                      : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', company)}
                  {...company.bind}
                />
                {custodianMetaData.name
                && custodianMetaData.name.help_text
                && (
                  <CustomizedTooltips
                    toolTipText={
                      custodianMetaData.name.help_text
                    }
                  />
                )}
              </Grid>
              <Grid
                className={classes.inputWithTooltip}
                item
                xs={12}
                md={6}
                sm={6}
              >
                <TextField
                  variant="filled"
                  margin="normal"
                  fullWidth
                  disabled
                  id="alias"
                  label="Alias"
                  name="alias"
                  autoComplete="alias"
                  {...alias.bind}
                />
                {custodianMetaData.alias
                && custodianMetaData.alias.help_text
                && (
                  <CustomizedTooltips
                    toolTipText={
                      custodianMetaData.alias.help_text
                    }
                  />
                )}
              </Grid>
            </Grid>
            <Grid container spacing={isDesktop ? 2 : 0}>
              <Grid
                className={classes.inputWithTooltip}
                item
                xs={12}
                md={6}
                sm={6}
              >
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="custodianType"
                  select
                  required
                  label="Custodian Type"
                  error={
                    formError.custodianType
                    && formError.custodianType.error
                  }
                  helperText={
                    formError.custodianType
                      ? formError.custodianType.message
                      : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', custodianType, 'custodianType')}
                  {...custodianType.bind}
                >
                  <MenuItem value="">Select</MenuItem>
                  {custodianTypeList
                    && _.map(
                      _.orderBy(
                        custodianTypeList,
                        ['name'],
                        ['asc'],
                      ),
                      (item, index) => (
                        <MenuItem
                          key={`custodianType${index}:${item.id}`}
                          value={item.url}
                        >
                          {item.name}
                        </MenuItem>
                      ),
                    )}
                </TextField>
                {custodianMetaData.custodian_type
                && custodianMetaData.custodian_type.help_text
                && (
                  <CustomizedTooltips
                    toolTipText={
                      custodianMetaData.custodian_type.help_text
                    }
                  />
                )}
              </Grid>
              <Grid
                className={classes.inputWithTooltip}
                item
                xs={12}
                md={6}
                sm={6}
              >
                <TextField
                  variant="filled"
                  margin="normal"
                  disabled
                  fullWidth
                  id="glnNumber"
                  label="GLN Number"
                  name="glnNumber"
                  autoComplete="glnNumber"
                  {...glnNumber.bind}
                />
              </Grid>
            </Grid>

            <Card variant="outlined" className={classes.addressContainer}>
              <CardContent>
                <Typography variant="h6">Contact Info</Typography>
                <Grid container spacing={isDesktop ? 2 : 0}>
                  <Grid
                    className={classes.inputWithTooltip}
                    item
                    xs={12}
                    md={6}
                  >
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="address_1"
                      label="Address Line 1"
                      name="address_1"
                      autoComplete="address_1"
                      error={
                        formError.address_1
                        && formError.address_1.error
                      }
                      helperText={
                        formError.address_1
                          ? formError.address_1.message
                          : ''
                      }
                      onBlur={(e) => handleBlur(e, 'required', address_1)}
                      {...address_1.bind}
                    />
                    {contactMetaData.address1
                    && contactMetaData.address1.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          contactMetaData.address1.help_text
                        }
                      />
                    )}
                  </Grid>
                  <Grid
                    className={classes.inputWithTooltip}
                    item
                    xs={12}
                    md={6}
                  >
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="address_2"
                      label="Address Line 2"
                      name="address_2"
                      autoComplete="address_2"
                      {...address_2.bind}
                    />
                    {contactMetaData.address2
                    && contactMetaData.address2.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          contactMetaData.address2.help_text
                        }
                      />
                    )}
                  </Grid>
                </Grid>
                <Grid container spacing={isDesktop ? 2 : 0}>
                  <Grid
                    className={classes.inputWithTooltip}
                    item
                    xs={12}
                    md={6}
                  >
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="city"
                      label="City"
                      name="city"
                      autoComplete="city"
                      error={formError.city && formError.city.error}
                      helperText={
                        formError.city
                          ? formError.city.message
                          : ''
                      }
                      onBlur={(e) => handleBlur(e, 'required', city)}
                      {...city.bind}
                    />
                    {contactMetaData.city
                    && contactMetaData.city.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          contactMetaData.city.help_text
                        }
                      />
                    )}
                  </Grid>
                  <Grid
                    className={classes.inputWithTooltip}
                    item
                    xs={12}
                    md={6}
                  >
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="zip"
                      label="Zip Code"
                      name="zip"
                      autoComplete="zip"
                      error={formError.zip && formError.zip.error}
                      helperText={
                        formError.zip
                          ? formError.zip.message
                          : ''
                      }
                      onBlur={(e) => handleBlur(e, 'required', zip)}
                      {...zip.bind}
                    />
                    {contactMetaData.postal_code
                    && contactMetaData.postal_code.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          contactMetaData.postal_code.help_text
                        }
                      />
                    )}
                  </Grid>
                </Grid>
                <Grid container spacing={isDesktop ? 2 : 0}>
                  <Grid
                    className={classes.inputWithTooltip}
                    item
                    xs={12}
                    md={6}
                  >
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="state"
                      select
                      required
                      label="State"
                      error={
                        formError.state
                        && formError.state.error
                      }
                      helperText={
                        formError.state
                          ? formError.state.message
                          : ''
                      }
                      onBlur={(e) => handleBlur(e, 'required', state, 'state')}
                      {...state.bind}
                      disabled={countries && !country.value}
                      placeholder={countries && !country.value
                        ? 'Select country for states options'
                        : ''}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {countries && country.value && _.map(
                        _.sortBy(_.find(countries, { country: country.value }).states),
                        (value, index) => (
                          <MenuItem
                            key={`custodianState${index}${value}`}
                            value={value}
                          >
                            {value}
                          </MenuItem>
                        ),
                      )}
                    </TextField>
                    {contactMetaData.state
                    && contactMetaData.state.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          contactMetaData.state.help_text
                        }
                      />
                    )}
                  </Grid>
                  <Grid
                    className={classes.inputWithTooltip}
                    item
                    xs={12}
                    md={6}
                  >
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="country"
                      select
                      required
                      label="Country"
                      error={
                        formError.country
                        && formError.country.error
                      }
                      helperText={
                        formError.country
                          ? formError.country.message
                          : ''
                      }
                      onBlur={(e) => handleBlur(e, 'required', country, 'country')}
                      {...country.bind}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {countries && _.map(
                        _.sortBy(_.map(countries, 'country')),
                        (value, index) => (
                          <MenuItem
                            key={`custodianCountry${index}${value}`}
                            value={value}
                          >
                            {value}
                          </MenuItem>
                        ),
                      )}
                    </TextField>
                    {contactMetaData.country
                    && contactMetaData.country.help_text
                    && (
                      <CustomizedTooltips
                        toolTipText={
                          contactMetaData.country.help_text
                        }
                      />
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Grid
              container
              spacing={isDesktop ? 3 : 0}
              justifyContent="center"
            >
              <Grid item xs={12} sm={4}>
                <div className={classes.loadingWrapper}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={loading || submitDisabled()}
                  >
                    {buttonText}
                  </Button>
                  {loading && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </div>
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
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.custodianReducer,
  ...state.authReducer,
  ...state.optionsReducer,
  ...state.shipmentReducer,
  loading: (
    state.custodianReducer.loading
    || state.authReducer.loading
    || state.optionsReducer.loading
    || state.shipmentReducer.loading
  ),
});

export default connect(mapStateToProps)(AddCustodians);
