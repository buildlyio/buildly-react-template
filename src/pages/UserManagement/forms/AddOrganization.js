import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useQuery } from 'react-query';
import { useTimezoneSelect, allTimezones } from 'react-timezone-select';
import FormModal from '@components/Modal/FormModal';
import Loader from '@components/Loader/Loader';
import { getUser } from '@context/User.context';
import {
  Button,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import {
  BoltOutlined as ShockIcon,
  LightModeOutlined as LightIcon,
  Opacity as HumidityIcon,
  Thermostat as TemperatureIcon,
} from '@mui/icons-material';
import { isDesktop } from '@utils/mediaQuery';
import { validators } from '@utils/validators';
import {
  DATE_DISPLAY_CHOICES,
  LANGUAGES,
  TIME_DISPLAY_CHOICES,
  TIVE_GATEWAY_TIMES,
  UOM_DISTANCE_CHOICES,
  UOM_TEMPERATURE_CHOICES,
  UOM_WEIGHT_CHOICES,
} from '@utils/mock';
import useAlert from '@hooks/useAlert';
import { useInput } from '@hooks/useInput';
import '../UserManagementStyles.css';
import { getCoreuserQuery } from '@react-query/queries/coreuser/getCoreuserQuery';
import { getAllOrganizationQuery } from '@react-query/queries/authUser/getAllOrganizationQuery';
import { getOrganizationTypeQuery } from 'react-query/queries/authUser/getOrganizationTypeQuery';
import { getCountriesQuery } from '@react-query/queries/shipments/getCountriesQuery';
import { getCurrenciesQuery } from '@react-query/queries/shipments/getCurrenciesQuery';
import { getUnitQuery } from '@react-query/queries/items/getUnitQuery';
import { useInviteMutation } from '@react-query/mutations/authUser/inviteMutation';

const AddOrganization = ({
  open,
  setOpen,
}) => {
  const { displayAlert } = useAlert();
  const organization = getUser().organization.organization_uuid;

  const [openConfirmModal, setConfirmModal] = useState(false);
  const [emailData, setEmailData] = useState([]);
  const [orgData, setOrgData] = useState([]);
  const [orgAbbData, setOrgAbbData] = useState([]);
  const [adminEmails, setAdminEmails] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [formError, setFormError] = useState({});

  const organization_name = useInput('', { required: true });
  const orgType = useInput('', { required: true });
  const organization_abbrevation = useInput('', { required: true });
  const radius = useInput(3);
  const defaultMaxTemperature = useInput(100);
  const defaultMinTemperature = useInput(0);
  const defaultMaxHumidity = useInput(100);
  const defaultMinHumidity = useInput(0);
  const defaultShock = useInput(4);
  const defaultLight = useInput(5);
  const defaultTransmissionInterval = useInput(20);
  const defaultMeasurementInterval = useInput(20);
  const country = useInput('United States');
  const currency = useInput('USD');
  const dateFormat = useInput('MMM DD, YYYY');
  const timeFormat = useInput('hh:mm:ss A');
  const distance = useInput('Miles');
  const temp = useInput('Fahrenheit');
  const weight = useInput('Pounds');
  const timezone = useInput('America/Los_Angeles');
  const language = useInput('English');
  const supressTempAlerts = useInput(true);
  const supressHumidityAlerts = useInput(true);
  const supressShockAlerts = useInput(true);
  const supressLightAlerts = useInput(true);

  const { options: tzOptions } = useTimezoneSelect({ labelStyle: 'original', timezones: allTimezones });

  const { data: coreuserData, isLoading: isLoadingCoreuser } = useQuery(
    ['users'],
    () => getCoreuserQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: organizations, isLoading: isLoadingOrganizations } = useQuery(
    ['organizations'],
    () => getAllOrganizationQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: organizationTypesData, isLoading: isLoadingOrganizationTypes } = useQuery(
    ['organizationTypes'],
    () => getOrganizationTypeQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: countriesData, isLoading: isLoadingCountries } = useQuery(
    ['countries'],
    () => getCountriesQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: currenciesData, isLoading: isLoadingCurrencies } = useQuery(
    ['currencies'],
    () => getCurrenciesQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: unitData, isLoading: isLoadingUnits } = useQuery(
    ['unit', organization],
    () => getUnitQuery(organization, displayAlert),
    { refetchOnWindowFocus: false },
  );

  useEffect(() => {
    if (distance.value === 'Kilometers') {
      radius.setValue(5);
    } else {
      radius.setValue(3);
    }
  }, [distance.value]);

  useEffect(() => {
    if (coreuserData) {
      const edata = coreuserData.map((item) => item.email);
      setEmailData(edata);
    }
  }, [coreuserData]);

  useEffect(() => {
    if (organizations) {
      const odata = organizations.map((item) => item.name);
      const oadata = organizations.map((item) => item.name.replace(/[^A-Z0-9]/g, ''));
      setOrgData(odata);
      setOrgAbbData(oadata);
    }
  }, [organizations]);

  useEffect(() => {
    if (!_.isEmpty(countriesData)) {
      setCountryList(_.sortBy(_.without(_.uniq(_.map(countriesData, 'country')), [''])));
    }
  }, [countriesData]);

  useEffect(() => {
    if (!_.isEmpty(currenciesData)) {
      setCurrencyList(_.sortBy(_.without(_.uniq(_.map(currenciesData, 'currency')), [''])));
    }
  }, [currenciesData]);

  const discardFormData = () => {
    setAdminEmails([]);
    organization_name.clear();
    radius.reset();
    orgType.reset();
    organization_abbrevation.clear();
    defaultMaxTemperature.reset();
    defaultMinTemperature.reset();
    defaultMaxHumidity.reset();
    defaultMinHumidity.reset();
    defaultShock.reset();
    defaultLight.reset();
    defaultTransmissionInterval.reset();
    defaultMeasurementInterval.reset();
    country.reset();
    currency.reset();
    dateFormat.reset();
    timeFormat.reset();
    distance.reset();
    temp.reset();
    weight.reset();
    timezone.reset();
    language.reset();
    supressTempAlerts.reset();
    supressHumidityAlerts.reset();
    supressShockAlerts.reset();
    supressLightAlerts.reset();
    setFormError({});
    setConfirmModal(false);
    setOpen(false);
  };

  const closeFormModal = () => {
    const dataHasChanged = !_.isEmpty(adminEmails)
      || organization_name.hasChanged()
      || radius.hasChanged()
      || orgType.hasChanged()
      || organization_abbrevation.hasChanged()
      || defaultMaxTemperature.hasChanged()
      || defaultMinTemperature.hasChanged()
      || defaultMaxHumidity.hasChanged()
      || defaultMinHumidity.hasChanged()
      || defaultShock.hasChanged()
      || defaultLight.hasChanged()
      || defaultTransmissionInterval.hasChanged()
      || defaultMeasurementInterval.hasChanged()
      || country.hasChanged()
      || currency.hasChanged()
      || dateFormat.hasChanged()
      || timeFormat.hasChanged()
      || distance.hasChanged()
      || temp.hasChanged()
      || weight.hasChanged()
      || timezone.hasChanged()
      || language.hasChanged()
      || supressTempAlerts.hasChanged()
      || supressHumidityAlerts.hasChanged()
      || supressShockAlerts.hasChanged()
      || supressLightAlerts.hasChanged();
    if (dataHasChanged) {
      setConfirmModal(true);
    } else {
      setOpen(false);
    }
  };

  const handleBlur = (e, validation, input, extras, extraData) => {
    let validateObj;
    if (extras) {
      validateObj = validators(validation, { value: input, required: true, extra: extraData });
    } else {
      validateObj = validators(validation, input);
    }
    const prevState = { ...formError };
    if (validateObj && validateObj.error) {
      setFormError({
        ...prevState,
        [e.target.id]: validateObj,
      });
    } else {
      setFormError({
        ...prevState,
        [e.target.id]: {
          error: false,
          message: '',
        },
      });
    }
  };

  const handleInputChange = (e) => {
    const emails = e.target.value.split(',').map((email) => email.trim());
    setAdminEmails(emails);
  };

  const submitDisabled = () => {
    const errorKeys = Object.keys(formError);
    if (_.isEmpty(adminEmails) || !organization_name.value || !organization_abbrevation.value || !orgType.value) {
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

  const { mutate: inviteMutation, isLoading: isInviting } = useInviteMutation(discardFormData, displayAlert);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!_.isEmpty(adminEmails)
      || organization_name.hasChanged()
      || radius.hasChanged()
      || orgType.hasChanged()
      || organization_abbrevation.hasChanged()
      || defaultMaxTemperature.hasChanged()
      || defaultMinTemperature.hasChanged()
      || defaultMaxHumidity.hasChanged()
      || defaultMinHumidity.hasChanged()
      || defaultShock.hasChanged()
      || defaultLight.hasChanged()
      || defaultTransmissionInterval.hasChanged()
      || defaultMeasurementInterval.hasChanged()
      || country.hasChanged()
      || currency.hasChanged()
      || dateFormat.hasChanged()
      || timeFormat.hasChanged()
      || distance.hasChanged()
      || temp.hasChanged()
      || weight.hasChanged()
      || timezone.hasChanged()
      || language.hasChanged()
      || supressTempAlerts.hasChanged()
      || supressHumidityAlerts.hasChanged()
      || supressShockAlerts.hasChanged()
      || supressLightAlerts.hasChanged()
    ) {
      const data = {
        emails: adminEmails,
        org_data: {
          name: organization_name.value,
          alerts_to_suppress: _.without([
            !supressTempAlerts.value ? 'temperature' : '',
            !supressHumidityAlerts.value ? 'humidity' : '',
            !supressShockAlerts.value ? 'shock' : '',
            !supressLightAlerts.value ? 'light' : '',
          ], ''),
          radius: radius.value || 0,
          organization_type: orgType.value,
          abbrevation: _.toUpper(organization_abbrevation.value),
          default_max_temperature: _.toNumber(defaultMaxTemperature.value),
          default_min_temperature: _.toNumber(defaultMinTemperature.value),
          default_max_humidity: _.toNumber(defaultMaxHumidity.value),
          default_min_humidity: _.toNumber(defaultMinHumidity.value),
          default_shock: _.toNumber(defaultShock.value),
          default_light: _.toNumber(defaultLight.value),
          default_transmission_interval: _.toNumber(defaultTransmissionInterval.value),
          default_measurement_interval: _.toNumber(defaultMeasurementInterval.value),
        },
        user_role: 'Admins',
        country: country.value,
        currency: currency.value,
        date_format: dateFormat.value,
        time_format: timeFormat.value,
        distance: distance.value,
        temperature: temp.value,
        weight: weight.value,
        org_timezone: timezone.value,
        org_language: language.value,
      };
      inviteMutation(data);
    }
  };

  return (
    <div>
      <FormModal
        open={open}
        handleClose={closeFormModal}
        title="Add Organization"
        openConfirmModal={openConfirmModal}
        setConfirmModal={setConfirmModal}
        handleConfirmModal={discardFormData}
      >
        {(isLoadingOrganizationTypes
          || isLoadingCoreuser
          || isLoadingOrganizations
          || isLoadingCountries
          || isLoadingCurrencies
          || isLoadingUnits
          || isInviting)
          && (
            <Loader open={isLoadingOrganizationTypes
              || isLoadingCoreuser
              || isLoadingOrganizations
              || isLoadingCountries
              || isLoadingCurrencies
              || isLoadingUnits
              || isInviting}
            />
          )}
        <form
          className="addOrganizationFormContainer"
          noValidate
          onSubmit={handleSubmit}
        >
          <Grid container spacing={isDesktop() ? 2 : 0}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="admin_email"
                label="Administrator Emails"
                name="admin_email"
                autoComplete="admin_email"
                error={formError.admin_email && formError.admin_email.error}
                helperText={
                  formError.admin_email ? formError.admin_email.message : ''
                }
                onBlur={(e) => handleBlur(e, 'duplicateEmail', adminEmails, true, emailData)}
                onChange={handleInputChange}
                value={adminEmails.toString()}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                required
                id="organization_name"
                label="Organization Name"
                error={formError.organization_name && formError.organization_name.error}
                helperText={
                  formError.organization_name ? formError.organization_name.message : ''
                }
                onBlur={(e) => handleBlur(e, 'duplicateOrgName', organization_name, true, orgData)}
                value={organization_name.value}
                onChange={(e) => {
                  organization_name.setValue(e.target.value);
                  organization_abbrevation.setValue(e.target.value.replace(/[^A-Z0-9]/g, ''));
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                required
                select
                id="org-type"
                name="org-type"
                label="Organization Type"
                autoComplete="orgType"
                {...orgType.bind}
              >
                <MenuItem value="">Select</MenuItem>
                {_.map(organizationTypesData, (type) => (
                  <MenuItem
                    key={`orgType-${type.id}`}
                    value={type.id}
                  >
                    {_.capitalize(type.name)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                required
                id="organization_abbrevation"
                label="Organization Abbreviation"
                name="organization_abbrevation"
                autoComplete="organization_abbrevation"
                error={
                  formError.organization_abbrevation
                  && formError.organization_abbrevation.error
                }
                helperText={
                  formError.organization_abbrevation
                    ? formError.organization_abbrevation.message
                    : ''
                }
                inputProps={{
                  maxLength: 7,
                  style: { textTransform: 'uppercase' },
                }}
                onBlur={(e) => handleBlur(e, 'duplicateOrgAbb', organization_abbrevation, true, orgAbbData)}
                {...organization_abbrevation.bind}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                id="radius"
                fullWidth
                label={`Radius for Geofence (${_.toLower(distance.value)})`}
                name="radius"
                autoComplete="radius"
                {...radius.bind}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                type="number"
                className="addOrganizationNumberInput"
                id="default-max-temperature"
                name="default-max-temperature"
                label="Default Maximum Temperature for Excursion"
                autoComplete="default-max-temperature"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><TemperatureIcon /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="start">
                      {
                        _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'temperature'))
                          && _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'temperature')).unit_of_measure === UOM_TEMPERATURE_CHOICES[0]
                          ? <span>&#8457;</span>
                          : <span>&#8451;</span>
                      }
                    </InputAdornment>
                  ),
                }}
                {...defaultMaxTemperature.bind}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                type="number"
                className="addOrganizationNumberInput"
                id="default-min-temperature"
                name="default-min-temperature"
                label="Default Minimum Temperature for Excursion"
                autoComplete="default-min-temperature"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><TemperatureIcon /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="start">
                      {
                        _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'temperature'))
                          && _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'temperature')).unit_of_measure === UOM_TEMPERATURE_CHOICES[0]
                          ? <span>&#8457;</span>
                          : <span>&#8451;</span>
                      }
                    </InputAdornment>
                  ),
                }}
                {...defaultMinTemperature.bind}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                type="number"
                className="addOrganizationNumberInput"
                id="default-max-humidity"
                name="default-max-humidity"
                label="Default Maximum Humidity for Excursion"
                autoComplete="default-max-humidity"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><HumidityIcon /></InputAdornment>,
                  endAdornment: <InputAdornment position="start">%</InputAdornment>,
                }}
                {...defaultMaxHumidity.bind}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                type="number"
                className="addOrganizationNumberInput"
                id="default-min-humidity"
                name="default-min-humidity"
                label="Default Minimum Humidity for Excursion"
                autoComplete="default-min-humidity"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><HumidityIcon /></InputAdornment>,
                  endAdornment: <InputAdornment position="start">%</InputAdornment>,
                }}
                {...defaultMinHumidity.bind}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                type="number"
                className="addOrganizationNumberInput"
                id="default-shock"
                name="default-shock"
                label="Default Shock Threshold"
                autoComplete="default-shock"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><ShockIcon /></InputAdornment>,
                  endAdornment: <InputAdornment position="start">G</InputAdornment>,
                }}
                {...defaultShock.bind}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                type="number"
                className="addOrganizationNumberInput"
                id="default-light"
                name="default-light"
                label="Default Light Threshold"
                autoComplete="default-light"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LightIcon /></InputAdornment>,
                  endAdornment: <InputAdornment position="start">lumens</InputAdornment>,
                }}
                {...defaultLight.bind}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                select
                placeholder="Select..."
                id="default-transmission-interval"
                name="default-transmission-interval"
                label="Default Sensor Data Transmission Interval"
                autoComplete="default-transmission-interval"
                InputLabelProps={{ shrink: true }}
                SelectProps={{ displayEmpty: true }}
                value={defaultTransmissionInterval.value}
                onChange={(e) => {
                  defaultTransmissionInterval.setValue(e.target.value);
                  defaultMeasurementInterval.setValue(e.target.value);
                }}
              >
                <MenuItem value="">Select</MenuItem>
                {!_.isEmpty(TIVE_GATEWAY_TIMES)
                  && _.map(TIVE_GATEWAY_TIMES, (time, index) => (
                    <MenuItem key={`${time.value}-${index}`} value={time.value}>
                      {time.label}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                select
                placeholder="Select..."
                id="default-measurement-interval"
                name="default-measurement-interval"
                label="Default Sensor Data Measurement Interval"
                autoComplete="default-measurement-interval"
                InputLabelProps={{ shrink: true }}
                SelectProps={{ displayEmpty: true }}
                {...defaultMeasurementInterval.bind}
              >
                <MenuItem value="">Select</MenuItem>
                {!_.isEmpty(TIVE_GATEWAY_TIMES) && _.map(
                  _.filter(TIVE_GATEWAY_TIMES, (t) => t.value <= defaultTransmissionInterval.value),
                  (time, index) => (
                    <MenuItem key={`${time.value}-${index}`} value={time.value}>
                      {time.label}
                    </MenuItem>
                  ),
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                select
                id="country"
                name="country"
                label="Default Country"
                autoComplete="country"
                value={country.value}
                onChange={(e) => {
                  const curr = _.find(currenciesData, {
                    country: _.find(countriesData, { country: e.target.value })
                      ? _.find(countriesData, { country: e.target.value }).iso3
                      : '',
                  });
                  currency.setValue(curr ? curr.currency : '');
                  country.setValue(e.target.value);
                }}
              >
                <MenuItem value="">Select</MenuItem>
                {countryList && _.map(countryList, (cntry, index) => (
                  <MenuItem
                    key={`country-${index}-${cntry}`}
                    value={cntry}
                  >
                    {cntry}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                select
                id="currency"
                name="currency"
                label="Default Currency"
                autoComplete="currency"
                {...currency.bind}
              >
                <MenuItem value="">Select</MenuItem>
                {currencyList && _.map(currencyList, (curr, index) => (
                  <MenuItem
                    key={`currency-${index}-${curr}`}
                    value={curr}
                  >
                    {curr}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                select
                id="date-format"
                name="date-format"
                label="Default Date Format"
                autoComplete="date-format"
                {...dateFormat.bind}
              >
                <MenuItem value="">Select</MenuItem>
                {_.map(DATE_DISPLAY_CHOICES, (date, index) => (
                  <MenuItem
                    key={`date-${index}-${date.label}`}
                    value={date.value}
                  >
                    {date.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                select
                id="time-format"
                name="time-format"
                label="Default Time Format"
                autoComplete="time-format"
                {...timeFormat.bind}
              >
                <MenuItem value="">Select</MenuItem>
                {_.map(TIME_DISPLAY_CHOICES, (time, index) => (
                  <MenuItem
                    key={`time-${index}-${time.label}`}
                    value={time.value}
                  >
                    {time.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                select
                id="distance"
                name="distance"
                label="Default Unit of Measure for Distance"
                autoComplete="distance"
                {...distance.bind}
              >
                <MenuItem value="">Select</MenuItem>
                {_.map(UOM_DISTANCE_CHOICES, (dist, index) => (
                  <MenuItem
                    key={`distance-${index}-${dist}`}
                    value={dist}
                  >
                    {dist}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                select
                id="temp"
                name="temp"
                label="Default Unit of Measure for Temperature"
                autoComplete="temp"
                {...temp.bind}
              >
                <MenuItem value="">Select</MenuItem>
                {_.map(UOM_TEMPERATURE_CHOICES, (tmp, index) => (
                  <MenuItem
                    key={`temperature-${index}-${tmp}`}
                    value={tmp}
                  >
                    {tmp}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                select
                id="weight"
                name="weight"
                label="Default Unit of Measure for Weight"
                autoComplete="weight"
                {...weight.bind}
              >
                <MenuItem value="">Select</MenuItem>
                {_.map(UOM_WEIGHT_CHOICES, (wgt, index) => (
                  <MenuItem
                    key={`weight-${index}-${wgt}`}
                    value={wgt}
                  >
                    {wgt}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                select
                id="timezone"
                name="timezone"
                label="Default Time Zone"
                autoComplete="timezone"
                value={timezone.value}
                onChange={(e) => {
                  timezone.setValue(e.target.value);
                }}
              >
                {_.map(tzOptions, (tzOption, index) => (
                  <MenuItem key={`${tzOption.value}-${index}`} value={tzOption.value}>
                    {tzOption.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                select
                id="language"
                name="language"
                label="Default Language"
                autoComplete="language"
                value={language.value}
                onChange={(e) => {
                  language.setValue(e.target.value);
                }}
              >
                {_.map(LANGUAGES, (item, index) => (
                  <MenuItem key={`${item.value}-${index}`} value={item.label}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={700}>Alert Settings:</Typography>
            </Grid>
            <Grid item xs={6} alignSelf="center">
              <FormControlLabel
                labelPlacement="end"
                label={(
                  <div className="addOrganizationIconContainer">
                    <TemperatureIcon className="addOrganizationIcons" />
                    Temperature Alerts
                  </div>
                )}
                control={(
                  <Switch
                    checked={supressTempAlerts.value}
                    color="primary"
                    onChange={(e) => supressTempAlerts.setValue(e.target.checked)}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} alignSelf="center">
              <FormControlLabel
                labelPlacement="end"
                label={(
                  <div className="addOrganizationIconContainer">
                    <HumidityIcon className="addOrganizationIcons" />
                    Humidity Alerts
                  </div>
                )}
                control={<Switch checked={supressHumidityAlerts.value} color="primary" onChange={(e) => supressHumidityAlerts.setValue(e.target.checked)} />}
              />
            </Grid>
            <Grid item xs={6} alignSelf="center">
              <FormControlLabel
                labelPlacement="end"
                label={(
                  <div className="adminPanelOrgIconContainer">
                    <ShockIcon className="adminPanelOrgIcons" />
                    Shock Alerts
                  </div>
                )}
                control={<Switch checked={supressShockAlerts.value} color="primary" onChange={(e) => supressShockAlerts.setValue(e.target.checked)} />}
              />
            </Grid>
            <Grid item xs={6} alignSelf="center">
              <FormControlLabel
                labelPlacement="end"
                label={(
                  <div className="adminPanelOrgIconContainer">
                    <LightIcon className="adminPanelOrgIcons" />
                    Light Alerts
                  </div>
                )}
                control={<Switch checked={supressLightAlerts.value} color="primary" onChange={(e) => supressLightAlerts.setValue(e.target.checked)} />}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="addOrganizationSubmit"
                disabled={submitDisabled()}
              >
                Register & Send
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormModal>
    </div>
  );
};

export default AddOrganization;
