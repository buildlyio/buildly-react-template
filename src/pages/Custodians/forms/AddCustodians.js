/* eslint-disable no-console */
/*
 * AddCustodians Component
 * -----------------------
 * This component provides a form for adding new custodians or editing existing ones.
 * It handles form state, validation, API integration, and complex address processing
 * using Google Maps API for place suggestions and geocoding.
 */
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
import { useTranslation } from 'react-i18next';

/**
 * AddCustodians Component
 *
 * @param {Object} props - Component props
 * @param {Object} props.history - Router history object for navigation
 * @param {Object} props.location - Router location object containing state data
 * @returns {JSX.Element} The rendered component
 */
const AddCustodians = ({ history, location }) => {
  // Modal visibility states
  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);

  // Form error tracking
  const [formError, setFormError] = useState({});

  // Alert display hook for notifications
  const { displayAlert } = useAlert();

  const { t } = useTranslation();

  // Configure Geocode service for address processing
  Geocode.setApiKey(window.env.GEO_CODE_API);
  Geocode.setLanguage('en');

  // Set up Google Places service for address autocompletion
  const {
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: window.env.MAP_API_KEY,
  });

  // Extract navigation data from location state
  const redirectTo = location.state && location.state.from;
  const {
    custodianTypesData, // Available custodian types for dropdown
    orgData, // Organization data for matching
  } = location.state || {};

  // Determine if this is an edit operation and extract existing data
  const editPage = location.state && location.state.type === 'edit';
  const editData = (editPage && location.state.data) || {};
  const contactData = editPage && location.state.contactData;

  // Company information fields
  const company = useInput(editData.name || '', { required: true });
  const abbrevation = useInput(editData.abbrevation || '');
  const custodianType = useInput(editData.custodian_type || '', { required: true });
  const glnNumber = useInput(editData.custodian_glns || '');

  // Contact person fields
  const firstName = useInput(contactData.first_name || '', { required: true });
  const lastName = useInput(contactData.last_name || '', { required: true });
  const email = useInput(contactData.email_address || '', { required: true });

  // Phone number with special handling
  const [number, setNumber] = useState(contactData.phone || '');
  const [numberFocus, setNumberFocus] = useState(false);

  // Address fields
  const country = useInput(contactData.country || '', { required: true });
  const state = useInput(contactData.state || '', { required: true });
  const [address1, setAddress1] = useState(contactData.address1 || '');
  const address_2 = useInput(contactData.address2 || '');
  const city = useInput(contactData.city || '', { required: true });
  const zip = useInput(contactData.postal_code || '', { required: true });

  // UI text based on mode (add/edit)
  const buttonText = editPage ? t('addCustodians.save') : t('addCustodians.addCustodian');
  const formTitle = editPage ? t('addCustodians.editCustodian') : t('addCustodians.addCustodian');

  // Current user's organization
  const organization = getUser().organization.organization_uuid;

  /**
   * Handles closing the form modal
   * Shows confirmation dialog if form data has changed
   */
  const closeFormModal = () => {
    // Check if any form data has been modified
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

    // If data changed, show confirmation dialog, otherwise close directly
    if (dataHasChanged) {
      setConfirmModal(true);
    } else {
      setFormModal(false);
      if (location && location.state) {
        history.push(redirectTo);
      }
    }
  };

  /**
   * Handles discarding form data and closing form
   * Called when user confirms they want to discard changes
   */
  const discardFormData = () => {
    setConfirmModal(false);
    setFormModal(false);
    if (location && location.state) {
      history.push(redirectTo);
    }
  };

  /**
   * Generates an acronym from a string
   * Used to auto-generate abbreviations from company names
   *
   * @param {string} str - Input string to create acronym from
   * @returns {string} Uppercase acronym
   */
  const acronym = (str) => {
    let abbr = '';
    // Split on whitespace and remove empty strings
    const words = _.without(_.split(str, /\s+/), '');

    // Take first letter of each word
    _.forEach(words, (word) => {
      abbr += word[0];
    });

    // Limit to 7 characters
    if (_.size(abbrevation) > 7) {
      abbr = _.join(_.slice(abbr, 0, 7), '');
    }

    return _.toUpper(abbr);
  };

  // Hook for adding a new custodian
  const { mutate: addCustodianMutation, isLoading: isAddingCustodian } = useAddCustodianMutation(organization, history, redirectTo, displayAlert, 'Custodian');

  // Hook for editing an existing custodian
  const { mutate: editCustodianMutation, isLoading: isEditingCustodian } = useEditCustodianMutation(organization, history, redirectTo, displayAlert, 'Custodian');

  /**
   * Handles form submission
   * Prepares and validates data before sending to the API
   *
   * @param {Event} event - Form submission event
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    // Prepare contact form data
    const contactFormValue = {
      country: country.value,
      state: state.value,
      address1,
      address2: address_2.value,
      city: city.value,
      postal_code: zip.value,
      // Include these fields only when editing
      ...(editPage && { contact_uuid: contactData.contact_uuid }),
      ...(editPage && { url: contactData.url }),
      ...(editPage && { id: contactData.id }),
      organization_uuid: organization,
      // Format phone with international prefix or set null if empty
      phone: !_.isEmpty(number) ? `+${number}` : null,
      first_name: firstName.value,
      last_name: lastName.value,
      // Convert email to lowercase or set null if empty
      email_address: !_.isEmpty(email.value) ? email.value.toLowerCase() : null,
    };

    // Find matching organization by comparing names with fuzzy matching
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

    // Prepare custodian form data
    const custodianFormValue = {
      abbrevation: _.toUpper(abbrevation.value),
      custodian_type: custodianType.value,
      name: company.value,
      custodian_glns: glnNumber.value,
      // Include these fields only when editing
      ...(editPage && { url: editData.url }),
      ...(editPage && { id: editData.id }),
      organization_uuid: organization,
      custody_org_uuid,
    };

    // Call appropriate mutation based on mode (add/edit)
    if (editPage) {
      editCustodianMutation([custodianFormValue, contactFormValue]);
    } else {
      addCustodianMutation([custodianFormValue, contactFormValue]);
    }
  };

  /**
   * Handles field validation on blur
   * Updates form error state based on validation results
   *
   * @param {Event} e - Blur event
   * @param {string} validation - Type of validation to perform
   * @param {Object} input - Input field state object
   * @param {string} parentId - Parent element ID (for select fields)
   */
  const handleBlur = (e, validation, input, parentId) => {
    const validateObj = validators(validation, input);
    const prevState = { ...formError };

    if (validateObj && validateObj.error) {
      // Update error state with validation error
      setFormError({
        ...prevState,
        [e.target.id || parentId]: validateObj,
      });
    } else {
      // Clear error state for this field
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
   * Determines if the submit button should be disabled
   * Based on required field completion and validation errors
   *
   * @returns {boolean} True if submit should be disabled
   */
  const submitDisabled = () => {
    // Check if required fields are missing
    if (
      !company.value
      || !custodianType.value
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

    // Check if any validation errors exist
    const errorKeys = Object.keys(formError);
    let errorExists = false;
    _.forEach(errorKeys, (key) => {
      if (formError[key].error) {
        errorExists = true;
      }
    });
    return errorExists;
  };

  /**
   * Handles address selection from autocomplete suggestions
   * Uses Google Geocoding API to extract address components
   *
   * @param {Object} address - Selected address object from Google Places API
   */
  const handleSelectAddress = (address) => {
    // Split address into components
    const addressDesc = address.description.split(', ');

    // First geocode to get coordinates
    Geocode.fromAddress(address.description)
      .then(({ results }) => {
        const { lat, lng } = results[0].geometry.location;

        // Reverse geocode from coordinates to get structured address data
        Geocode.fromLatLng(lat, lng)
          .then((response) => {
            const addressComponents = response.results[0].address_components;

            // Find locality component (city) using multiple possible types
            const localityTypes = [
              'administrative_area_level_3',
              'locality',
              'administrative_area_level_1',
              'administrative_area_level_2',
            ];
            const locality = localityTypes.reduce((result, type) => result || addressComponents.find((component) => component.types.includes(type))?.long_name, '');

            // Extract postal code
            const zipCode = addressComponents.find((component) => component.types.includes('postal_code'))?.long_name;

            // Process address line 1 by removing last two components and locality
            let filteredAddressDesc = addressDesc.slice(0, -2);
            filteredAddressDesc = filteredAddressDesc.filter((item) => item !== locality);

            // Update form fields with extracted address data
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
          {/* Loading indicator while API requests are in progress */}
          {(isAddingCustodian || isEditingCustodian) && (
            <Loader open={isAddingCustodian || isEditingCustodian} />
          )}

          {/* Main form */}
          <form className="custodianFormContainer" noValidate onSubmit={handleSubmit}>
            {/* Company information section */}
            <Grid container spacing={isDesktop() ? 2 : 0}>
              {/* Company name field */}
              <Grid className="custodianInputWithTooltip" item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="company"
                  label={t('addCustodians.companyName')}
                  name="company"
                  autoComplete="company"
                  error={formError.company && formError.company.error}
                  helperText={formError.company ? formError.company.message : ''}
                  onBlur={(e) => handleBlur(e, 'required', company)}
                  value={company.value}
                  onChange={(e) => {
                    company.setValue(e.target.value);
                    // Auto-generate abbreviation when company name changes
                    abbrevation.setValue(acronym(e.target.value));
                  }}
                />
              </Grid>

              {/* Abbreviation field */}
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
                  label={t('addCustodians.abbrevation')}
                  name="abbrevation"
                  autoComplete="abbrevation"
                  inputProps={{
                    maxLength: 7,
                    style: { textTransform: 'uppercase' },
                  }}
                  helperText={t('addCustodians.max7')}
                  {...abbrevation.bind}
                />
              </Grid>
            </Grid>

            {/* Custodian type and GLN section */}
            <Grid container spacing={isDesktop() ? 2 : 0}>
              {/* Custodian type dropdown */}
              <Grid className="custodianInputWithTooltip" item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="custodianType"
                  select
                  required
                  label={t('addCustodians.custodianType')}
                  error={formError.custodianType && formError.custodianType.error}
                  helperText={formError.custodianType ? formError.custodianType.message : ''}
                  onBlur={(e) => handleBlur(e, 'required', custodianType, 'custodianType')}
                  {...custodianType.bind}
                >
                  <MenuItem value="">{t('common.select')}</MenuItem>
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

              {/* GLN Number field (disabled) */}
              <Grid className="custodianInputWithTooltip" item xs={12} md={6}>
                <TextField
                  variant="filled"
                  margin="normal"
                  disabled
                  fullWidth
                  id="glnNumber"
                  label={t('addCustodians.glnNumber')}
                  name="glnNumber"
                  autoComplete="glnNumber"
                  {...glnNumber.bind}
                />
              </Grid>
            </Grid>

            {/* Contact information card */}
            <Card variant="outlined" className="custodianAddressContainer">
              <CardContent>
                <Typography variant="h6" gutterBottom mt={1} mb={isMobile() ? 0 : 1.65}>
                  {t('addCustodians.contactInfo')}
                </Typography>

                {/* Contact name fields */}
                <Grid container spacing={isDesktop() ? 2 : 0}>
                  {/* First name */}
                  <Grid className="custodianInputWithTooltip" item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="first_name"
                      label={t('addCustodians.firstName')}
                      name="first_name"
                      autoComplete="first_name"
                      error={formError.first_name && formError.first_name.error}
                      helperText={formError.first_name ? formError.first_name.message : ''}
                      onBlur={(e) => handleBlur(e, 'required', firstName)}
                      {...firstName.bind}
                    />
                  </Grid>

                  {/* Last name */}
                  <Grid className="custodianInputWithTooltip" item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="last_name"
                      label={t('addCustodians.lastName')}
                      name="last_name"
                      autoComplete="last_name"
                      error={formError.last_name && formError.last_name.error}
                      helperText={formError.last_name ? formError.last_name.message : ''}
                      onBlur={(e) => handleBlur(e, 'required', lastName)}
                      {...lastName.bind}
                    />
                  </Grid>
                </Grid>

                {/* Email field */}
                <Grid container mt={0} spacing={isDesktop() ? 2 : 0}>
                  <Grid className="custodianInputWithTooltip" item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label={t('addCustodians.email')}
                      name="email"
                      autoComplete="email"
                      error={formError.email && formError.email.error}
                      helperText={formError.email ? formError.email.message : ''}
                      onBlur={(e) => handleBlur(e, 'required', email)}
                      {...email.bind}
                    />
                  </Grid>
                </Grid>

                {/* Phone number with custom input component */}
                <Grid container mt={0} spacing={isDesktop() ? 2 : 0}>
                  <Grid className="custodianInputWithTooltip custodianRow" item xs={12}>
                    <Typography className="custodianPhoneLabel">{t('addCustodians.phoneNumber')}</Typography>
                    <PhoneInput
                      value={number}
                      onChange={(value) => setNumber(value)}
                      placeholder={t('addCustodians.phoneNumber')}
                      specialLabel={t('addCustodians.phone')}
                      inputClass={numberFocus ? 'custodianPhoneInputFocused' : 'custodianPhoneInput'}
                      containerClass={numberFocus ? 'custodianPhoneInputContainerFocused' : 'custodianPhoneInputContainer'}
                      buttonClass="custodianFlagDropdown"
                      country="us"
                      onFocus={() => setNumberFocus(true)}
                      onBlur={() => setNumberFocus(false)}
                    />
                  </Grid>
                </Grid>

                {/* Address section with autocomplete */}
                <Grid container mt={0} spacing={isDesktop() ? 2 : 0}>
                  <Grid className="custodianInputWithTooltip" item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="address_1"
                      label={t('addCustodians.address1')}
                      name="address_1"
                      autoComplete="address_1"
                      value={address1}
                      onChange={(e) => {
                        // Trigger places API suggestions as user types
                        getPlacePredictions({
                          input: e.target.value,
                        });
                        setAddress1(e.target.value);
                      }}
                    />
                  </Grid>

                  {/* Address autocomplete dropdown */}
                  <div className={!_.isEmpty(placePredictions) ? 'custodianAddressPredictions' : ''}>
                    {placePredictions && _.map(placePredictions, (value, index) => (
                      <MenuItem
                        className="custodianAddressPredictionsItem"
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

                {/* Address line 2 */}
                <Grid container mt={0} spacing={isDesktop() ? 2 : 0}>
                  <Grid className="custodianInputWithTooltip" item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="address_2"
                      label={t('addCustodians.address2')}
                      name="address_2"
                      autoComplete="address_2"
                      {...address_2.bind}
                    />
                  </Grid>
                </Grid>

                {/* City and state fields (disabled, populated by address selection) */}
                <Grid container mt={0} spacing={isDesktop() ? 2 : 0}>
                  <Grid className="custodianInputWithTooltip" item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="city"
                      label={t('addCustodians.city')}
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
                      label={t('addCustodians.state')}
                      name="state"
                      autoComplete="state"
                      disabled
                      {...state.bind}
                    />
                  </Grid>
                </Grid>

                {/* Country and ZIP fields (disabled, populated by address selection) */}
                <Grid container mt={0} spacing={isDesktop() ? 2 : 0}>
                  <Grid className="custodianInputWithTooltip" item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="country"
                      label={t('addCustodians.country')}
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
                      label={t('addCustodians.zip')}
                      name="zip"
                      autoComplete="zip"
                      disabled
                      {...zip.bind}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Form action buttons */}
            <Grid container spacing={2} justifyContent="center">
              {/* Submit button */}
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

              {/* Cancel button */}
              <Grid item xs={12} sm={4} className="custodianSubmit2">
                <Button
                  type="button"
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={discardFormData}
                  className="custodianSubmit"
                >
                  {t('addCustodians.cancel')}
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
