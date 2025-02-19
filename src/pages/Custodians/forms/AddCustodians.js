/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import Loader from '@components/Loader/Loader';
import FormModal from '@components/Modal/FormModal';
import { getUser } from '@context/User.context';
import { useInput } from '@hooks/useInput';
import { validators } from '@utils/validators';
import { isMobile, isDesktop, isDesktop2 } from '@utils/mediaQuery';
import { useAddCustodianMutation } from '@react-query/mutations/custodians/addCustodianMutation';
import { useEditCustodianMutation } from '@react-query/mutations/custodians/editCustodianMutation';
import useAlert from '@hooks/useAlert';
import '../CustodianStyles.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import Geocode from 'react-geocode';

const AddCustodians = ({ history, location }) => {
  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);

  const { displayAlert } = useAlert();

  Geocode.setApiKey(window.env.GEO_CODE_API);
  Geocode.setLanguage('en');

  const {
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: window.env.MAP_API_KEY,
  });

  const redirectTo = location.state && location.state.from;
  const {
    custodianTypesData, orgData,
  } = location.state || {};

  const editPage = location.state && location.state.type === 'edit';
  const editData = (editPage && location.state.data) || {};
  const contactData = editPage && location.state.contactData;

  const company = useInput(editData.name || '', { required: true });
  const abbrevation = useInput(editData.abbrevation || '');
  const custodianType = useInput(editData.custodian_type || '', { required: true });
  const glnNumber = useInput(editData.custodian_glns || '');
  const firstName = useInput(contactData.first_name || '', { required: true });
  const lastName = useInput(contactData.last_name || '', { required: true });
  const email = useInput(contactData.email_address || '');
  const [number, setNumber] = useState(contactData.phone || '');
  const [numberFocus, setNumberFocus] = useState(false);
  const country = useInput(contactData.country || '', { required: true });
  const state = useInput(contactData.state || '', { required: true });
  const [address1, setAddress1] = useState(contactData.address1 || '');
  const address_2 = useInput(contactData.address2 || '');
  const city = useInput(contactData.city || '', { required: true });
  const zip = useInput(contactData.postal_code || '', { required: true });

  const [formError, setFormError] = useState({});

  const buttonText = editPage ? 'Save' : 'Add Custodian';
  const formTitle = editPage ? 'Edit Custodian' : 'Add Custodian';

  const organization = getUser().organization.organization_uuid;

  const closeFormModal = () => {
    const dataHasChanged = (
      company.hasChanged()
      || custodianType.hasChanged()
      || firstName.hasChanged()
      || lastName.hasChanged()
      || email.hasChanged()
      || (!_.isEmpty(number) && !_.isEqual(number, contactData.phone))
      || city.hasChanged()
      || state.hasChanged()
      || zip.hasChanged()
      || !_.isEqual(address1, '')
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const contactFormValue = {
      country: country.value,
      state: state.value,
      address1,
      address2: address_2.value,
      city: city.value,
      postal_code: zip.value,
      ...(editPage && { contact_uuid: contactData.contact_uuid }),
      ...(editPage && { url: contactData.url }),
      ...(editPage && { id: contactData.id }),
      organization_uuid: organization,
      phone: !_.isEmpty(number) ? `+${number}` : null,
      first_name: firstName.value,
      last_name: lastName.value,
      email_address: !_.isEmpty(email.value) ? email.value.toLowerCase() : null,
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
      || !firstName.value
      || !lastName.value
      || (!_.isEmpty(number) && number.length < 11)
      || _.isEqual(address1, '')
      || !state.value
      || !country.value
      || !city.value
      || !zip.value
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

  const handleSelectAddress = (address) => {
    const addressDesc = address.description.split(', ');
    Geocode.fromAddress(address.description)
      .then(({ results }) => {
        const { lat, lng } = results[0].geometry.location;
        Geocode.fromLatLng(lat, lng)
          .then((response) => {
            const addressComponents = response.results[0].address_components;
            let locality = addressComponents.find((component) => component.types.includes('administrative_area_level_3'))?.long_name;
            if (!locality) {
              locality = addressComponents.find((component) => component.types.includes('locality'))?.long_name;
            }
            const zipCode = addressComponents.find((component) => component.types.includes('postal_code'))?.long_name;
            let filteredAddressDesc = addressDesc.slice(0, -2);
            filteredAddressDesc = filteredAddressDesc.filter((item) => item !== locality);
            setAddress1(filteredAddressDesc.join(', '));
            city.setValue(locality);
            state.setValue(addressDesc[_.size(addressDesc) - 2]);
            country.setValue(addressDesc[_.size(addressDesc) - 1]);
            zip.setValue(zipCode);
          })
          .catch(console.error);
      })
      .catch(console.error);
  };

  return (
    <div>
      {openFormModal && (
        <FormModal
          open={openFormModal}
          handleClose={closeFormModal}
          title={formTitle}
          openConfirmModal={openConfirmModal}
          setConfirmModal={setConfirmModal}
          handleConfirmModal={discardFormData}
        >
          {(isAddingCustodian || isEditingCustodian) && (
            <Loader open={isAddingCustodian || isEditingCustodian} />
          )}
          <form className="custodianFormContainer" noValidate onSubmit={handleSubmit}>
            <Grid container spacing={isDesktop() ? 2 : 0}>
              <Grid className="custodianInputWithTooltip" item xs={12} md={6}>
                <TextField
                  className="notranslate"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="company"
                  label={<span className="translate">Company Name</span>}
                  name="company"
                  autoComplete="company"
                  error={formError.company && formError.company.error}
                  helperText={formError.company ? formError.company.message : ''}
                  onBlur={(e) => handleBlur(e, 'required', company)}
                  value={company.value}
                  onChange={(e) => {
                    company.setValue(e.target.value);
                    abbrevation.setValue(acronym(e.target.value));
                  }}
                />
              </Grid>
              <Grid
                className="custodianInputWithTooltip"
                item
                xs={12}
                md={6}
                style={{ paddingTop: isDesktop2() ? 39 : 10 }}
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
            <Grid container spacing={isDesktop() ? 2 : 0}>
              <Grid className="custodianInputWithTooltip" item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="custodianType"
                  select
                  required
                  label="Custodian Type"
                  error={formError.custodianType && formError.custodianType.error}
                  helperText={formError.custodianType ? formError.custodianType.message : ''}
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
              <Grid className="custodianInputWithTooltip" item xs={12} md={6}>
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
            <Card variant="outlined" className="custodianAddressContainer">
              <CardContent>
                <Typography variant="h6" gutterBottom mt={1} mb={isMobile() ? 0 : 1.65}>
                  Contact Info
                </Typography>
                <Grid container spacing={isDesktop() ? 2 : 0}>
                  <Grid className="custodianInputWithTooltip" item xs={12} md={6}>
                    <TextField
                      className="notranslate"
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="first_name"
                      label={<span className="translate">First Name</span>}
                      name="first_name"
                      autoComplete="first_name"
                      error={formError.first_name && formError.first_name.error}
                      helperText={formError.first_name ? formError.first_name.message : ''}
                      onBlur={(e) => handleBlur(e, 'required', firstName)}
                      {...firstName.bind}
                    />
                  </Grid>
                  <Grid className="custodianInputWithTooltip" item xs={12} md={6}>
                    <TextField
                      className="notranslate"
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="last_name"
                      label={<span className="translate">Last Name</span>}
                      name="last_name"
                      autoComplete="last_name"
                      error={formError.last_name && formError.last_name.error}
                      helperText={formError.last_name ? formError.last_name.message : ''}
                      onBlur={(e) => handleBlur(e, 'required', lastName)}
                      {...lastName.bind}
                    />
                  </Grid>
                </Grid>
                <Grid container mt={0} spacing={isDesktop() ? 2 : 0}>
                  <Grid className="custodianInputWithTooltip" item xs={12}>
                    <TextField
                      className="notranslate"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="email"
                      label={<span className="translate">Email</span>}
                      name="email"
                      autoComplete="email"
                      error={formError.email && formError.email.error}
                      helperText={formError.email ? formError.email.message : ''}
                      onBlur={(e) => handleBlur(e, 'required', email)}
                      {...email.bind}
                    />
                  </Grid>
                </Grid>
                <Grid container mt={0} spacing={isDesktop() ? 2 : 0}>
                  <Grid className="custodianInputWithTooltip custodianRow" item xs={12}>
                    <Typography className="custodianPhoneLabel">Phone Number</Typography>
                    <PhoneInput
                      value={number}
                      onChange={(value) => setNumber(value)}
                      placeholder="Phone Number"
                      specialLabel="Phone"
                      inputClass={numberFocus ? 'custodianPhoneInputFocused' : 'custodianPhoneInput'}
                      containerClass={numberFocus ? 'custodianPhoneInputContainerFocused' : 'custodianPhoneInputContainer'}
                      buttonClass="custodianFlagDropdown"
                      country="us"
                      onFocus={() => setNumberFocus(true)}
                      onBlur={() => setNumberFocus(false)}
                    />
                  </Grid>
                </Grid>
                <Grid container mt={0} spacing={isDesktop() ? 2 : 0}>
                  <Grid className="custodianInputWithTooltip" item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="address_1"
                      label="Address Line 1"
                      name="address_1"
                      autoComplete="address_1"
                      value={address1}
                      onChange={(e) => {
                        getPlacePredictions({
                          input: e.target.value,
                        });
                        setAddress1(e.target.value);
                      }}
                    />
                  </Grid>
                  <div className={!_.isEmpty(placePredictions) ? 'custodianAddressPredictions' : ''}>
                    {placePredictions && _.map(placePredictions, (value, index) => (
                      <MenuItem
                        className="custodianAddressPredictionsItem notranslate"
                        key={`custodianState${index}${value}`}
                        value={value.description}
                        onClick={() => {
                          handleSelectAddress(value);
                          getPlacePredictions({ input: '' });
                        }}
                      >
                        {value.description}
                      </MenuItem>
                    ))}
                  </div>
                </Grid>
                <Grid container mt={0} spacing={isDesktop() ? 2 : 0}>
                  <Grid className="custodianInputWithTooltip" item xs={12}>
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
                  </Grid>
                </Grid>
                <Grid container mt={0} spacing={isDesktop() ? 2 : 0}>
                  <Grid className="custodianInputWithTooltip" item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="city"
                      label="City"
                      name="city"
                      autoComplete="city"
                      disabled
                      {...city.bind}
                    />
                  </Grid>
                  <Grid className="custodianInputWithTooltip" item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="state"
                      label="State/Province"
                      name="state"
                      autoComplete="state"
                      disabled
                      {...state.bind}
                    />
                  </Grid>
                </Grid>
                <Grid container mt={0} spacing={isDesktop() ? 2 : 0}>
                  <Grid className="custodianInputWithTooltip" item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="country"
                      label="Country"
                      name="country"
                      autoComplete="country"
                      disabled
                      {...country.bind}
                    />
                  </Grid>
                  <Grid className="custodianInputWithTooltip" item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="zip"
                      label="ZIP/Postal Code"
                      name="zip"
                      autoComplete="zip"
                      disabled
                      {...zip.bind}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className="custodianSubmit"
                  disabled={isAddingCustodian || isEditingCustodian || submitDisabled()}
                >
                  {buttonText}
                </Button>
              </Grid>
              <Grid item xs={12} sm={4} className="custodianSubmit2">
                <Button
                  type="button"
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={discardFormData}
                  className="custodianSubmit"
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
