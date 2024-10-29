import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';
import {
  Button,
  TextField,
  Grid,
  MenuItem,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import Loader from '@components/Loader/Loader';
import FormModal from '@components/Modal/FormModal';
import { getUser } from '@context/User.context';
import { useInput } from '@hooks/useInput';
import { validators } from '@utils/validators';
import { isMobile, isDesktop } from '@utils/mediaQuery';
import { getCustodianFormattedRow, GATEWAY_STATUS } from '@utils/constants';
import { useAddCustodianMutation } from '@react-query/mutations/custodians/addCustodianMutation';
import useAlert from '@hooks/useAlert';
import { useStore } from '@zustand/timezone/timezoneStore';
import '../GatewayStyles.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const AddShipper = ({
  open,
  setOpen,
  unitData,
  countriesData,
  orgData,
  custodianTypesData,
}) => {
  const { displayAlert } = useAlert();
  const { data } = useStore();
  const organization = getUser().organization.organization_uuid;

  const [openConfirmModal, setConfirmModal] = useState(false);

  const company = useInput('', { required: true });
  const abbrevation = useInput('');
  const glnNumber = useInput('');
  const firstName = useInput('', { required: true });
  const lastName = useInput('', { required: true });
  const email = useInput('', { required: true });
  const country = useInput('', { required: true });
  const state = useInput('', { required: true });
  const address_1 = useInput('', { required: true });
  const address_2 = useInput('');
  const city = useInput('', { required: true });
  const zip = useInput('', { required: true });

  const [number, setNumber] = useState('');
  const [numberFocus, setNumberFocus] = useState(false);
  const [formError, setFormError] = useState({});

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
    const dataHasChanged = (
      company.hasChanged()
      || firstName.hasChanged()
      || lastName.hasChanged()
      || email.hasChanged()
      || !_.isEmpty(number)
      || city.hasChanged()
      || state.hasChanged()
      || zip.hasChanged()
      || address_1.hasChanged()
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
      address1: address_1.value,
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
      || !address_1.value
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
              style={{ paddingTop: isDesktop() ? 39 : 10 }}
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
            <Grid className="gatewayInputWithTooltip gatewayInputWithTooltip4" item xs={12} md={6}>
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
              <Grid container spacing={isDesktop() ? 2 : 0}>
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
              <Grid container spacing={isDesktop() ? 2 : 0}>
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
              <Grid container spacing={isDesktop() ? 2 : 0}>
                <Grid className="gatewayInputWithTooltip" item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="country"
                    select
                    required
                    label="Country"
                    error={formError.country && formError.country.error}
                    helperText={formError.country ? formError.country.message : ''}
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
                <Grid className="gatewayInputWithTooltip" item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="state"
                    select
                    required
                    label="State/Province"
                    error={formError.state && formError.state.error}
                    helperText={formError.state ? formError.state.message : ''}
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
              <Grid container spacing={isDesktop() ? 2 : 0}>
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
                    disabled={!country.value || !state.value}
                    error={formError.address_1 && formError.address_1.error}
                    helperText={formError.address_1 ? formError.address_1.message : ''}
                    onBlur={(e) => handleBlur(e, 'required', address_1)}
                    {...address_1.bind}
                  />
                </Grid>
                <Grid className="gatewayInputWithTooltip gatewayInputWithTooltip3" item xs={12}>
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
              <Grid container spacing={isDesktop() ? 2 : 0}>
                <Grid className="gatewayInputWithTooltip" item xs={12} md={6}>
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
                <Grid className="gatewayInputWithTooltip gatewayInputWithTooltip2" item xs={12} md={6}>
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
