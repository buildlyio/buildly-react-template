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

const AddShipper = ({
  open,
  setOpen,
  orgData,
  custodianTypesData,
}) => {
  const { displayAlert } = useAlert();
  const { data } = useStore();
  const organization = getUser().organization.organization_uuid;

  const [openConfirmModal, setConfirmModal] = useState(false);

  Geocode.setApiKey(window.env.GEO_CODE_API);
  Geocode.setLanguage('en');

  const {
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: window.env.MAP_API_KEY,
  });

  const company = useInput('', { required: true });
  const abbrevation = useInput('');
  const glnNumber = useInput('');
  const firstName = useInput('', { required: true });
  const lastName = useInput('', { required: true });
  const email = useInput('', { required: true });
  const country = useInput('', { required: true });
  const state = useInput('', { required: true });
  const [address1, setAddress1] = useState('');
  const address_2 = useInput('');
  const city = useInput('', { required: true });
  const zip = useInput('', { required: true });

  const [number, setNumber] = useState('');
  const [numberFocus, setNumberFocus] = useState(false);
  const [formError, setFormError] = useState({});

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

  const discardFormData = () => {
    setConfirmModal(false);
    setOpen(false);
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

  const { mutate: addCustodianMutation, isLoading: isAddingShipper } = useAddCustodianMutation(organization, null, null, displayAlert);

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
      phone: `+${number}`,
      first_name: firstName.value,
      last_name: lastName.value,
      email_address: email.value.toLowerCase(),
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
      || !firstName.value
      || !lastName.value
      || !email.value
      || _.isEmpty(number)
      || number.length < 11
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
    setAddress1(`${address.terms[0].value}`);
    address_2.setValue(`${address.terms[1].value}`);
    state.setValue(`${address.terms[address.terms.length - 2].value}`);
    country.setValue(`${address.terms[address.terms.length - 1].value}`);
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
            city.setValue(locality);
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
        title="Add Shipper"
        openConfirmModal={openConfirmModal}
        setConfirmModal={setConfirmModal}
        handleConfirmModal={discardFormData}
      >
        {isAddingShipper && <Loader open={isAddingShipper} />}
        <form className="gatewayFormContainer" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={isDesktop() ? 2 : 0}>
            <Grid className="gatewayInputWithTooltip" item xs={12} md={6}>
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
            <Grid className="gatewayInputWithTooltip" item xs={12} md={6}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="custodianType"
                disabled
                label="Custodian Type"
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
                label="GLN Number"
                name="glnNumber"
                autoComplete="glnNumber"
                {...glnNumber.bind}
              />
            </Grid>
          </Grid>
          <Card variant="outlined" className="gatewayAddressContainer">
            <CardContent>
              <Typography variant="h6" gutterBottom mt={1} mb={isMobile() ? 0 : 1.65}>
                Contact Info
              </Typography>
              <Grid container spacing={isDesktop() ? 2 : 0}>
                <Grid className="gatewayInputWithTooltip" item xs={12} md={6}>
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
                <Grid className="gatewayInputWithTooltip" item xs={12} md={6}>
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
                <Grid className="gatewayInputWithTooltip" item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
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
                  <Typography className="gatewayPhoneLabel">Phone Number *</Typography>
                  <PhoneInput
                    value={number}
                    onChange={(value) => setNumber(value)}
                    placeholder="Phone Number"
                    specialLabel="Phone"
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
                <div className={!_.isEmpty(placePredictions) ? 'gatewayAddressPredictions' : ''}>
                  {placePredictions && _.map(placePredictions, (value, index) => (
                    <MenuItem
                      className="gatewayAddressPredictionsItem notranslate"
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
                    label="Address Line 2"
                    name="address_2"
                    autoComplete="address_2"
                    disabled
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
                    label="City"
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
                    label="State/Province"
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
                    label="Country"
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
                className="gatewaySubmit"
                disabled={isAddingShipper || submitDisabled()}
              >
                Add Shipper
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
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormModal>
    </div>
  );
};

export default AddShipper;
