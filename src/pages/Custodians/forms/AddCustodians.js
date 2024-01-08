import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  useTheme,
  Grid,
  MenuItem,
  useMediaQuery,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import Loader from '../../../components/Loader/Loader';
import FormModal from '../../../components/Modal/FormModal';
import { getUser } from '../../../context/User.context';
import { useInput } from '../../../hooks/useInput';
import { validators } from '../../../utils/validators';
import { useAddCustodianMutation } from '../../../react-query/mutations/custodians/addCustodianMutation';
import { useEditCustodianMutation } from '../../../react-query/mutations/custodians/editCustodianMutation';
import useAlert from '@hooks/useAlert';

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
  history,
  location,
}) => {
  const classes = useStyles();
  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);

  const { displayAlert } = useAlert();

  const redirectTo = location.state && location.state.from;
  const {
    custodianTypesData, countriesData, unitData, orgData,
  } = location.state || {};

  const editPage = location.state && location.state.type === 'edit';
  const editData = (location.state && location.state.type === 'edit' && location.state.data) || {};
  const contactData = editPage && location.state.contactData;

  const company = useInput(editData.name || '', {
    required: true,
  });
  const abbrevation = useInput(editData.abbrevation || '');
  const custodianType = useInput(editData.custodian_type || '', {
    required: true,
  });
  const glnNumber = useInput(editData.custodian_glns || '');
  const country = useInput(contactData.country || '', {
    required: true,
  });
  const state = useInput(contactData.state || '', {
    required: true,
  });
  const address_1 = useInput(contactData.address1 || '', {
    required: true,
  });
  const address_2 = useInput(contactData.address2 || '');
  const city = useInput(contactData.city || '', {
    required: true,
  });
  const zip = useInput(contactData.postal_code || '', {
    required: true,
  });

  const [formError, setFormError] = useState({});

  const buttonText = editPage ? 'Save' : 'Add Custodian';
  const formTitle = editPage ? 'Edit Custodian' : 'Add Custodian';

  const organization = getUser().organization.organization_uuid;
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    const defaultCountry = !_.isEmpty(unitData) && _.find(
      unitData,
      (unit) => _.toLower(unit.unit_of_measure_for) === 'country',
    ).unit_of_measure;
    if (!country.value && defaultCountry && !_.isEmpty(countriesData)) {
      const found = _.find(countriesData, { country: defaultCountry });
      if (found) {
        country.setValue(found.iso3);
      }
    }
  }, [unitData, countriesData]);

  const closeFormModal = () => {
    const dataHasChanged = company.hasChanged() || custodianType.hasChanged() || city.hasChanged() || state.hasChanged() || zip.hasChanged() || address_1.hasChanged() || address_2.hasChanged();
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

  const acronym = (str) => {
    let abbr = '';
    const words = _.without(_.split(str, /\s+/), '');
    _.forEach(words, (word) => {
      abbr += word[0];
    });
    if (_.size(abbrevation) > 7) {
      abbr = _.join(_.slice(abbr, 0, 7), '');
    }
    return _.toUpper(abbr);
  };

  const { mutate: addCustodianMutation, isLoading: isAddingCustodian } = useAddCustodianMutation(organization, history, redirectTo, displayAlert);

  const { mutate: editCustodianMutation, isLoading: isEditingCustodian } = useEditCustodianMutation(organization, history, redirectTo, displayAlert);

  /**
   * Submit The form and add/edit custodian
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const contactFormValue = {
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

    const orgNames = _.map(orgData, 'name');
    const custodianName = new RegExp(
      `.*${company.value
        .split('')
        .join('.*')
        .replace(/\s+/g, ' ')
        .replace(/\d+/g, '')
        .replace(/\s/g, '')
        .trim()}.*`,
      'i',
    );
    const matchingOrgs = _.filter(orgNames, (org) => custodianName.test(org));
    let custody_org_uuid = null;
    if (!_.isEmpty(matchingOrgs)) {
      custody_org_uuid = _.find(orgData, {
        name: matchingOrgs[0],
      }).organization_uuid;
    }

    const custodianFormValue = {
      abbrevation: _.toUpper(abbrevation.value),
      custodian_type: custodianType.value,
      name: company.value,
      custodian_glns: glnNumber.value,
      ...(editPage && { url: editData.url }),
      ...(editPage && { id: editData.id }),
      organization_uuid: organization,
      custody_org_uuid,
    };
    if (editPage) {
      editCustodianMutation([custodianFormValue, contactFormValue]);
    } else {
      addCustodianMutation([custodianFormValue, contactFormValue]);
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
      !company.value || !custodianType.value || !address_1.value || !state.value || !country.value || !city.value || !zip.value
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
          {(isAddingCustodian || isEditingCustodian) && (
            <Loader open={isAddingCustodian || isEditingCustodian} />
          )}
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
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
                  error={formError.company && formError.company.error}
                  helperText={
                    formError.company ? formError.company.message : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', company)}
                  value={company.value}
                  onChange={(e) => {
                    company.setValue(e.target.value);
                    abbrevation.setValue(acronym(e.target.value));
                  }}
                />
              </Grid>
              <Grid
                className={classes.inputWithTooltip}
                item
                xs={12}
                md={6}
                sm={6}
                style={{ paddingTop: theme.spacing(5) }}
              >
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="abbrevation"
                  label="Abbrevation"
                  name="abbrevation"
                  autoComplete="abbrevation"
                  inputProps={{
                    maxLength: 7,
                    style: { textTransform: 'uppercase' },
                  }}
                  helperText="Maximum of 7 charcters"
                  {...abbrevation.bind}
                />
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
                    formError.custodianType && formError.custodianType.error
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
                  {custodianTypesData && _.map(_.orderBy(custodianTypesData, ['name'], ['asc']),
                    (item, index) => (
                      <MenuItem
                        key={`custodianType${index}:${item.id}`}
                        value={item.url}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                </TextField>
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
                      fullWidth
                      id="country"
                      select
                      required
                      label="Country"
                      error={formError.country && formError.country.error}
                      helperText={
                        formError.country ? formError.country.message : ''
                      }
                      onBlur={(e) => handleBlur(e, 'required', country, 'country')}
                      value={country.value}
                      onChange={(e) => {
                        country.setValue(e.target.value);
                        state.setValue('');
                        address_1.setValue('');
                        address_2.setValue('');
                        city.setValue('');
                        zip.setValue('');
                      }}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {countriesData && _.map(_.sortBy(_.map(countriesData, (c) => _.pick(c, 'country', 'iso3'))),
                        (value, index) => (
                          <MenuItem
                            key={`custodianCountry${index}${value.country}`}
                            value={value.iso3}
                          >
                            {value.country}
                          </MenuItem>
                        ))}
                    </TextField>
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
                      label="State/Province"
                      error={formError.state && formError.state.error}
                      helperText={
                        formError.state ? formError.state.message : ''
                      }
                      onBlur={(e) => handleBlur(e, 'required', state, 'state')}
                      {...state.bind}
                      disabled={countriesData && !country.value}
                      placeholder={
                        countriesData && !country.value
                          ? 'Select country for states options'
                          : ''
                      }
                    >
                      <MenuItem value="">Select</MenuItem>
                      {countriesData && country.value && _.map(_.sortBy(_.find(countriesData, { iso3: country.value }).states),
                        (value, index) => (
                          <MenuItem
                            key={`custodianState${index}${value}`}
                            value={value.state_code}
                          >
                            {value.name}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>
                </Grid>
                <Grid container spacing={isDesktop ? 2 : 0}>
                  <Grid className={classes.inputWithTooltip} item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="address_1"
                      label="Address Line 1"
                      name="address_1"
                      autoComplete="address_1"
                      disabled={!country.value || !state.value}
                      error={formError.address_1 && formError.address_1.error}
                      helperText={
                        formError.address_1 ? formError.address_1.message : ''
                      }
                      onBlur={(e) => handleBlur(e, 'required', address_1)}
                      {...address_1.bind}
                    />
                  </Grid>
                  <Grid className={classes.inputWithTooltip} item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="address_2"
                      label="Address Line 2"
                      name="address_2"
                      autoComplete="address_2"
                      disabled={!country.value || !state.value}
                      {...address_2.bind}
                    />
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
                      disabled={!country.value || !state.value}
                      error={formError.city && formError.city.error}
                      helperText={formError.city ? formError.city.message : ''}
                      onBlur={(e) => handleBlur(e, 'required', city)}
                      {...city.bind}
                    />
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
                      label="ZIP/Postal Code"
                      name="zip"
                      autoComplete="zip"
                      disabled={!country.value || !state.value}
                      error={formError.zip && formError.zip.error}
                      helperText={formError.zip ? formError.zip.message : ''}
                      onBlur={(e) => handleBlur(e, 'required', zip)}
                      {...zip.bind}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Grid container spacing={isDesktop ? 3 : 0} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={
                    isAddingCustodian || isEditingCustodian || submitDisabled()
                  }
                >
                  {buttonText}
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
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
          </form>
        </FormModal>
      )}
    </div>
  );
};

export default AddCustodians;
