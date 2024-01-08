import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import {
  Button,
  Checkbox,
  Grid,
  MenuItem,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  InputAdornment,
} from '@mui/material';
import {
  BoltOutlined as ShockIcon,
  LightModeOutlined as LightIcon,
  Opacity as HumidityIcon,
  Thermostat as TemperatureIcon,
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import Loader from '../../../../components/Loader/Loader';
import { useInput } from '../../../../hooks/useInput';
import {
  DATE_DISPLAY_CHOICES,
  TIME_DISPLAY_CHOICES,
  TIVE_GATEWAY_TIMES,
  UOM_DISTANCE_CHOICES,
  UOM_TEMPERATURE_CHOICES,
  UOM_WEIGHT_CHOICES,
} from '../../../../utils/mock';
import { uomDistanceUpdate } from '../../../../utils/utilMethods';
import { getUser } from '../../../../context/User.context';
import { useQuery } from 'react-query';
import { getOrganizationTypeQuery } from '../../../../react-query/queries/authUser/getOrganizationTypeQuery';
import { getCountriesQuery } from '../../../../react-query/queries/shipments/getCountriesQuery';
import { getCurrenciesQuery } from '../../../../react-query/queries/shipments/getCurrenciesQuery';
import { getUnitQuery } from '../../../../react-query/queries/items/getUnitQuery';
import { useUpdateOrganizationMutation } from '../../../../react-query/mutations/authUser/updateOrganizationMutation';
import { useEditUnitMutation } from '../../../../react-query/mutations/items/editUnitMutation';
import useAlert from '@hooks/useAlert';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: theme.spacing(0.25, 0, 0.25, 0.25),
  },
  checkbox: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    marginLeft: `${theme.spacing(2)}px !important`,
    fontSize: '0.9rem',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(2),
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
  numberInput: {
    '& input::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    '& input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    '& input[type="number"]': {
      '-moz-appearance': 'textfield',
    },
  },
}));

const OrganizationSettings = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  const organizationData = getUser().organization;
  const organization = getUser().organization.organization_uuid;

  const { displayAlert } = useAlert();

  const { data: organizationTypesData, isLoading: isLoadingOrganizationTypes } = useQuery(
    ['organizationTypes'],
    () => getOrganizationTypeQuery(displayAlert),
  );

  const { data: countriesData, isLoading: isLoadingCountries } = useQuery(
    ['countries'],
    () => getCountriesQuery(displayAlert),
  );

  const { data: currenciesData, isLoading: isLoadingCurrencies } = useQuery(
    ['currencies'],
    () => getCurrenciesQuery(displayAlert),
  );

  const { data: unitData, isLoading: isLoadingUnits } = useQuery(
    ['unit', organization],
    () => getUnitQuery(organization, displayAlert),
  );

  const allowImportExport = useInput(
    (organizationData
      && organizationData.allow_import_export) || false,
  );
  const radius = useInput(
    (organizationData && organizationData.radius) || 0,
  );
  const orgType = useInput(
    (organizationData
      && organizationData.organization_type) || '',
  );
  const orgAbb = useInput((organizationData && organizationData.abbrevation) || '');
  const defaultMaxTemperature = useInput(
    (organizationData && organizationData.default_max_temperature) || 100,
  );
  const defaultMinTemperature = useInput(
    (organizationData && organizationData.default_min_temperature) || 0,
  );
  const defaultMaxHumidity = useInput(
    (organizationData && organizationData.default_max_humidity) || 100,
  );
  const defaultMinHumidity = useInput(
    (organizationData && organizationData.default_min_humidity) || 0,
  );
  const defaultShock = useInput((organizationData && organizationData.default_shock) || 4);
  const defaultLight = useInput((organizationData && organizationData.default_light) || 5);
  const defaultTransmissionInterval = useInput(
    (organizationData && organizationData.default_transmission_interval) || 20,
  );
  const defaultMeasurementInterval = useInput(
    (organizationData && organizationData.default_measurement_interval) || 20,
  );
  const country = useInput(
    _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'country'))
      ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'country')).unit_of_measure
      : 'United States',
  );
  const currency = useInput(
    _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'currency'))
      ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'currency')).unit_of_measure
      : 'USD',
  );
  const dateFormat = useInput(
    _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
      ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
      : 'MMM DD, YYYY',
  );
  const timeFormat = useInput(
    _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
      ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
      : 'hh:mm:ss A',
  );
  const distance = useInput(
    _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'distance'))
      ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'distance')).unit_of_measure
      : 'Miles',
  );
  const temp = useInput(
    _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'temperature'))
      ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'temperature')).unit_of_measure
      : 'Fahrenheit',
  );
  const weight = useInput(
    _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'weight'))
      ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'weight')).unit_of_measure
      : 'Pounds',
  );
  const [countryList, setCountryList] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);

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

  const resetValues = () => {
    allowImportExport.reset();
    radius.reset();
    orgType.reset();
    orgAbb.reset();
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
  };

  // Check if any changes done to be saved
  const submitDisabled = () => (
    allowImportExport.hasChanged()
    || radius.hasChanged()
    || orgType.hasChanged()
    || orgAbb.hasChanged()
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
  );

  const { mutate: updateOrganizationMutation, isLoading: isUpdatingOrganization } = useUpdateOrganizationMutation(displayAlert);

  const { mutate: editUnitMutation, isLoading: isEditingUnit } = useEditUnitMutation(organization, displayAlert);

  /**
   * Submit The form and add/edit custodian type
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    if (allowImportExport.hasChanged()
      || radius.hasChanged()
      || orgType.hasChanged()
      || orgAbb.hasChanged()
      || distance.hasChanged()
      || defaultMaxTemperature.hasChanged()
      || defaultMinTemperature.hasChanged()
      || defaultMaxHumidity.hasChanged()
      || defaultMinHumidity.hasChanged()
      || defaultShock.hasChanged()
      || defaultLight.hasChanged()
      || defaultTransmissionInterval.hasChanged()
      || defaultMeasurementInterval.hasChanged()
    ) {
      let data = {
        ...organizationData,
        edit_date: new Date(),
        allow_import_export: allowImportExport.value,
        radius: radius.value || 0,
        organization_type: orgType.value,
        abbrevation: _.toUpper(orgAbb.value),
        default_max_temperature: defaultMaxTemperature.value,
        default_min_temperature: defaultMinTemperature.value,
        default_max_humidity: defaultMaxHumidity.value,
        default_min_humidity: defaultMinHumidity.value,
        default_shock: defaultShock.value,
        default_light: defaultLight.value,
        default_transmission_interval: defaultTransmissionInterval.value,
        default_measurement_interval: defaultMeasurementInterval.value,
      };
      if (distance.hasChanged()) {
        data = { ...data, radius: uomDistanceUpdate(distance.value, radius.value) };
      }
      updateOrganizationMutation(data);
    }
    _.forEach(unitData, (unit) => {
      let uom = unit;
      switch (_.toLower(unit.unit_of_measure_for)) {
        case 'country':
          if (country.hasChanged()) {
            uom = { ...uom, unit_of_measure: country.value };
            editUnitMutation(uom);
          }
          break;
        case 'currency':
          if (currency.hasChanged()) {
            uom = { ...uom, unit_of_measure: currency.value };
            editUnitMutation(uom);
          }
          break;
        case 'date':
          if (dateFormat.hasChanged()) {
            uom = { ...uom, unit_of_measure: dateFormat.value };
            editUnitMutation(uom);
          }
          break;
        case 'time':
          if (timeFormat.hasChanged()) {
            uom = { ...uom, unit_of_measure: timeFormat.value };
            editUnitMutation(uom);
          }
          break;
        case 'distance':
          if (distance.hasChanged()) {
            uom = { ...uom, unit_of_measure: distance.value };
            editUnitMutation(uom);
          }
          break;
        case 'temperature':
          if (temp.hasChanged()) {
            uom = { ...uom, unit_of_measure: temp.value };
            editUnitMutation(uom);
          }
          break;
        case 'weight':
          if (weight.hasChanged()) {
            uom = { ...uom, unit_of_measure: weight.value };
            editUnitMutation(uom);
          }
          break;
        default:
          break;
      }
    });
  };

  return (
    <Grid className={classes.root} container spacing={2}>
      {(isLoadingOrganizationTypes
        || isLoadingCountries
        || isLoadingCurrencies
        || isLoadingUnits
        || isUpdatingOrganization
        || isEditingUnit)
        && (
          <Loader open={isLoadingOrganizationTypes
            || isLoadingCountries
            || isLoadingCurrencies
            || isLoadingUnits
            || isUpdatingOrganization
            || isEditingUnit}
          />
        )}
      <form
        className={classes.form}
        noValidate
        onSubmit={handleSubmit}
      >
        {/* <Grid item xs={12}>
          <div className={classes.checkbox}>
            <Checkbox
              checked={allowImportExport.value}
              onClick={(e) => allowImportExport.setValue(e.target.checked)}
            />
            <Typography className={classes.label}>
              Allow Import Export for this Organization?
            </Typography>
          </div>
        </Grid> */}
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
        <Grid container spacing={isDesktop ? 2 : 0}>
          <Grid item xs={12} md={6}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
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
              id="org-abb"
              name="org-abb"
              label="Organization Abbrevation"
              autoComplete="orgAbb"
              inputProps={{
                maxLength: 7,
                style: { textTransform: 'uppercase' },
              }}
              {...orgAbb.bind}
            />
          </Grid>
        </Grid>
        <Grid container spacing={isDesktop ? 2 : 0}>
          <Grid item xs={12} md={6}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              type="number"
              className={classes.numberInput}
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
              className={classes.numberInput}
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
        </Grid>
        <Grid container spacing={isDesktop ? 2 : 0}>
          <Grid item xs={12} md={6}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              type="number"
              className={classes.numberInput}
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
              className={classes.numberInput}
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
        </Grid>
        <Grid container spacing={isDesktop ? 2 : 0}>
          <Grid item xs={12} md={6}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              type="number"
              className={classes.numberInput}
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
              className={classes.numberInput}
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
        </Grid>
        <Grid container spacing={isDesktop ? 2 : 0}>
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
        </Grid>
        <Grid container spacing={isDesktop ? 2 : 0}>
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
        </Grid>
        <Grid container spacing={isDesktop ? 2 : 0}>
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
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={6} sm={4}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={isLoadingOrganizationTypes
                || isLoadingCountries
                || isLoadingCurrencies
                || isLoadingUnits
                || isUpdatingOrganization
                || isEditingUnit
                || !submitDisabled()}
            >
              Save
            </Button>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => resetValues()}
              className={classes.submit}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

export default OrganizationSettings;
