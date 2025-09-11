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
import { getCustodianFormattedRow, GATEWAY_STATUS } from '@utils/constants';
import { useAddCustodianMutation } from '@react-query/mutations/custodians/addCustodianMutation';
import useAlert from '@hooks/useAlert';
import { useStore } from '@zustand/timezone/timezoneStore';
import '../GatewayStyles.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import Geocode from 'react-geocode';
import { useTranslation } from 'react-i18next';

/**
 * AddShipper Component
 * This component renders a form to add a new shipper with details like company name, contact info, and address.
 * It uses various hooks, utilities, and APIs to handle form state, validation, and submission.
 */
const AddShipper = ({
  open, // Boolean to control the visibility of the modal
  setOpen, // Function to toggle the modal visibility
  orgData, // Array of organization data
  custodianTypesData, // Array of custodian types data
}) => {
  const { t } = useTranslation();
  const { displayAlert } = useAlert(); // Hook to display alerts
  const { data } = useStore(); // Zustand store for timezone data
  const organization = getUser().organization.organization_uuid; // Fetch the current user's organization UUID

  const [openConfirmModal, setConfirmModal] = useState(false); // State to control confirmation modal visibility

  // Configure Geocode API
  Geocode.setApiKey(window.env.GEO_CODE_API);
  Geocode.setLanguage('en');

  // Configure Google Places Autocomplete Service
  const {
    placePredictions, // List of address predictions
    getPlacePredictions, // Function to fetch address predictions
    isPlacePredictionsLoading, // Loading state for predictions
  } = usePlacesService({
    apiKey: window.env.MAP_API_KEY,
  });

  // Form state hooks
  const company = useInput('', { required: true }); // Company name input
  const abbrevation = useInput(''); // Abbreviation input
  const glnNumber = useInput(''); // GLN number input
  const firstName = useInput('', { required: true }); // First name input
  const lastName = useInput('', { required: true }); // Last name input
  const email = useInput(''); // Email input
  const country = useInput('', { required: true }); // Country input
  const state = useInput('', { required: true }); // State input
  const [address1, setAddress1] = useState(''); // Address line 1 state
  const address_2 = useInput(''); // Address line 2 input
  const city = useInput('', { required: true }); // City input
  const zip = useInput('', { required: true }); // ZIP code input

  const [number, setNumber] = useState(''); // Phone number state
  const [numberFocus, setNumberFocus] = useState(false); // State to track phone input focus
  const [formError, setFormError] = useState({}); // State to track form validation errors

  /**
   * Close the form modal.
   * If form data has changed, show a confirmation modal; otherwise, close the modal directly.
   */
  const closeFormModal = () => {
    const dataHasChanged = (
      company.hasChanged()
      || firstName.hasChanged()
      || lastName.hasChanged()
      || email.hasChanged()
      || !_.isEmpty(number)
      || city.hasChanged()
      || state.hasChanged()
      || zip.hasChanged()
      || !_.isEqual(address1, '')
      || address_2.hasChanged()
    );
    if (dataHasChanged) {
      setConfirmModal(true);
    } else {
      setOpen(false);
    }
  };

  /**
   * Discard form data and close the modal.
   */
  const discardFormData = () => {
    setConfirmModal(false);
    setOpen(false);
  };

  /**
   * Generate an acronym from a string.
   * @param {string} str - The input string.
   * @returns {string} - The generated acronym.
   */
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

  // Mutation hook to add a new custodian
  const { mutate: addCustodianMutation, isLoading: isAddingShipper } = useAddCustodianMutation(organization, null, null, displayAlert, 'Shipper');

  /**
   * Handle form submission.
   * Validates and submits the form data to add a new shipper.
   * @param {Event} event - The form submission event.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const contactFormValue = {
      country: country.value,
      state: state.value,
      address1,
      address2: address_2.value,
      city: city.value,
      postal_code: zip.value,
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

    const shipperCustodian = custodianTypesData.find((item) => item.name === 'Shipper');

    const custodianFormValue = {
      abbrevation: _.toUpper(abbrevation.value),
      custodian_type: shipperCustodian.url,
      name: company.value,
      custodian_glns: glnNumber.value,
      organization_uuid: organization,
      custody_org_uuid,
    };
    addCustodianMutation([custodianFormValue, contactFormValue]);
  };

  /**
   * Handle input blur event for validation.
   * Updates the form error state based on validation results.
   * @param {Event} e - The blur event.
   * @param {string} validation - The validation type.
   * @param {object} input - The input state object.
   * @param {string} parentId - The parent ID for nested inputs.
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

  /**
   * Check if the submit button should be disabled.
   * Returns true if required fields are empty or there are validation errors.
   * @returns {boolean} - Whether the submit button should be disabled.
   */
  const submitDisabled = () => {
    const errorKeys = Object.keys(formError);
    if (
      !company.value
      || !firstName.value
      || !lastName.value
      || !email.value
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

  /**
   * Handle address selection from Google Places predictions.
   * Updates the address fields based on the selected address.
   * @param {object} address - The selected address object.
   */
  const handleSelectAddress = (address) => {
    const addressDesc = address.description.split(', ');
    Geocode.fromAddress(address.description)
      .then(({ results }) => {
        const { lat, lng } = results[0].geometry.location;
        Geocode.fromLatLng(lat, lng)
          .then((response) => {
            const addressComponents = response.results[0].address_components;
            const localityTypes = [
              'administrative_area_level_3',
              'locality',
              'administrative_area_level_1',
              'administrative_area_level_2',
            ];
            const locality = localityTypes.reduce((result, type) => result || addressComponents.find((component) => component.types.includes(type))?.long_name, '');
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
      <FormModal
        open={open}
        handleClose={closeFormModal}
        title={t('addShipper.addShipper')}
        openConfirmModal={openConfirmModal}
        setConfirmModal={setConfirmModal}
        handleConfirmModal={discardFormData}
      >
        {isAddingShipper && <Loader open={isAddingShipper} />}
        <form className="gatewayFormContainer" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={isDesktop() ? 2 : 0}>
            <Grid className="gatewayInputWithTooltip" item xs={12} md={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="company"
                label={t('addShipper.companyName')}
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
              className="gatewayInputWithTooltip"
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
                label={t('addShipper.abbreviation')}
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
            <Grid className="gatewayInputWithTooltip" item xs={12} md={6}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="custodianType"
                disabled
                label={t('addShipper.custodianType')}
                value="Shipper"
              />
            </Grid>
            <Grid className="gatewayInputWithTooltip" item xs={12} md={6}>
              <TextField
                variant="filled"
                margin="normal"
                disabled
                fullWidth
                id="glnNumber"
                label={t('addShipper.glnNumber')}
                name="glnNumber"
                autoComplete="glnNumber"
                {...glnNumber.bind}
              />
            </Grid>
          </Grid>
          <Card variant="outlined" className="gatewayAddressContainer">
            <CardContent>
              <Typography variant="h6" gutterBottom mt={1} mb={isMobile() ? 0 : 1.65}>
                {t('addShipper.contactInfo')}
              </Typography>
              <Grid container spacing={isDesktop() ? 2 : 0}>
                <Grid className="gatewayInputWithTooltip" item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="first_name"
                    label={t('addShipper.firstName')}
                    name="first_name"
                    autoComplete="first_name"
                    error={formError.first_name && formError.first_name.error}
                    helperText={formError.first_name ? formError.first_name.message : ''}
                    onBlur={(e) => handleBlur(e, 'required', firstName)}
                    {...firstName.bind}
                  />
                </Grid>
                <Grid className="gatewayInputWithTooltip" item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="last_name"
                    label={t('addShipper.lastName')}
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
                <Grid className="gatewayInputWithTooltip" item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label={t('addShipper.email')}
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
                <Grid className="gatewayInputWithTooltip gatewayRow" item xs={12}>
                  <Typography className="gatewayPhoneLabel">{t('addShipper.phoneNumber')}</Typography>
                  <PhoneInput
                    value={number}
                    onChange={(value) => setNumber(value)}
                    placeholder={t('addShipper.phoneNumber')}
                    specialLabel={t('addShipper.phone')}
                    inputClass={numberFocus ? 'gatewayPhoneInputFocused' : 'gatewayPhoneInput'}
                    containerClass={numberFocus ? 'gatewayPhoneInputContainerFocused' : 'gatewayPhoneInputContainer'}
                    buttonClass="gatewayFlagDropdown"
                    country="us"
                    onFocus={() => setNumberFocus(true)}
                    onBlur={() => setNumberFocus(false)}
                  />
                </Grid>
              </Grid>
              <Grid container mt={0} spacing={isDesktop() ? 2 : 0}>
                <Grid className="gatewayInputWithTooltip" item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="address_1"
                    label={t('addShipper.addressLine1')}
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
                <div className={!_.isEmpty(placePredictions) ? 'gatewayAddressPredictions' : ''}>
                  {placePredictions && _.map(placePredictions, (value, index) => (
                    <MenuItem
                      className="gatewayAddressPredictionsItem"
                      key={`gatewayState${index}${value}`}
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
                <Grid className="gatewayInputWithTooltip" item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="address_2"
                    label={t('addShipper.addressLine2')}
                    name="address_2"
                    autoComplete="address_2"
                    {...address_2.bind}
                  />
                </Grid>
              </Grid>
              <Grid container mt={0} spacing={isDesktop() ? 2 : 0}>
                <Grid className="gatewayInputWithTooltip" item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="city"
                    label={t('addShipper.city')}
                    name="city"
                    autoComplete="city"
                    disabled
                    {...city.bind}
                  />
                </Grid>
                <Grid className="gatewayInputWithTooltip" item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="state"
                    label={t('addShipper.state')}
                    name="state"
                    autoComplete="state"
                    disabled
                    {...state.bind}
                  />
                </Grid>
              </Grid>
              <Grid container mt={0} spacing={isDesktop() ? 2 : 0}>
                <Grid className="gatewayInputWithTooltip" item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="country"
                    label={t('addShipper.country')}
                    name="country"
                    autoComplete="country"
                    disabled
                    {...country.bind}
                  />
                </Grid>
                <Grid className="gatewayInputWithTooltip" item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="zip"
                    label={t('addShipper.zip')}
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
                className="gatewaySubmit"
                disabled={isAddingShipper || submitDisabled()}
              >
                {t('addShipper.addShipper')}
              </Button>
            </Grid>
            <Grid item xs={12} sm={4} className="gatewaySubmit2">
              <Button
                type="button"
                fullWidth
                variant="outlined"
                color="primary"
                onClick={discardFormData}
                className="gatewaySubmit"
              >
                {t('common.cancel')}
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormModal>
    </div>
  );
};

export default AddShipper;
