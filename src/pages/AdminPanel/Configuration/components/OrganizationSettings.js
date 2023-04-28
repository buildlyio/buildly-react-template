import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  Grid,
  Checkbox,
  TextField,
  Typography,
  Button,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import Loader from '../../../../components/Loader/Loader';
import {
  updateOrganization,
} from '../../../../redux/authuser/actions/authuser.actions';
import { editUnitOfMeasure, getUnitOfMeasure } from '@redux/items/actions/items.actions';
import {
  DATE_DISPLAY_CHOICES,
  TIME_DISPLAY_CHOICES,
  UOM_DISTANCE_CHOICES,
  UOM_TEMPERATURE_CHOICES,
  UOM_WEIGHT_CHOICES,
} from '@utils/mock';
import { useInput } from '@hooks/useInput';
import { getCountries, getCurrencies } from '@redux/shipment/actions/shipment.actions';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.common.darkGrey2,
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
  loadingWrapper: {
    position: 'relative',
  },
  formTitle: {
    fontWeight: 'bold',
    marginTop: '1em',
    textAlign: 'center',
  },
}));

const OrganizationSettings = ({
  dispatch,
  loading,
  organizationData,
  orgTypes,
  unitOfMeasure,
  countries,
  currencies,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

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
  const country = useInput(
    _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'country'))
      ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'country')).unit_of_measure
      : 'United States',
  );
  const currency = useInput(
    _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'currency'))
      ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'currency')).unit_of_measure
      : 'USD',
  );
  const dateFormat = useInput(
    _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
      ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
      : 'MMM DD, YYYY',
  );
  const timeFormat = useInput(
    _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
      ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
      : 'hh:mm:ss A',
  );
  const distance = useInput(
    _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'distance'))
      ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'distance')).unit_of_measure
      : 'Miles',
  );
  const temp = useInput(
    _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'temperature'))
      ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'temperature')).unit_of_measure
      : 'Fahrenheit',
  );
  const weight = useInput(
    _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'weight'))
      ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'weight')).unit_of_measure
      : 'Pounds',
  );
  const [countryList, setCountryList] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);

  useEffect(() => {
    if (!countries) {
      dispatch(getCountries());
    }
    if (!currencies) {
      dispatch(getCurrencies());
    }
  }, []);

  useEffect(() => {
    if (!_.isEmpty(countries)) {
      setCountryList(_.sortBy(_.without(_.uniq(_.map(countries, 'country')), [''])));
    }
  }, [countries]);

  useEffect(() => {
    if (!_.isEmpty(currencies)) {
      setCurrencyList(_.sortBy(_.without(_.uniq(_.map(currencies, 'currency')), [''])));
    }
  }, [currencies]);

  useEffect(() => {
    if (organizationData && !unitOfMeasure) {
      dispatch(getUnitOfMeasure(organizationData.organization_uuid));
    }
  }, [organizationData]);

  useEffect(() => {
    if (organizationData && unitOfMeasure) {
      resetValues();
    }
  }, [organizationData, unitOfMeasure]);

  const resetValues = () => {
    allowImportExport.reset();
    radius.reset();
    orgType.reset();
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
    || country.hasChanged()
    || currency.hasChanged()
    || dateFormat.hasChanged()
    || timeFormat.hasChanged()
    || distance.hasChanged()
    || temp.hasChanged()
    || weight.hasChanged()
  );

  /**
   * Submit The form and add/edit custodian type
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    if (allowImportExport.hasChanged() || radius.hasChanged() || orgType.hasChanged()) {
      const data = {
        ...organizationData,
        edit_date: new Date(),
        allow_import_export: allowImportExport.value,
        radius: radius.value || 0,
        organization_type: orgType.value,
      };
      dispatch(updateOrganization(data));
    }

    _.forEach(unitOfMeasure, (unit) => {
      let uom = unit;
      switch (_.toLower(unit.unit_of_measure_for)) {
        case 'country':
          if (country.hasChanged()) {
            uom = { ...uom, unit_of_measure: country.value };
            dispatch(editUnitOfMeasure(uom));
          }
          break;

        case 'currency':
          if (currency.hasChanged()) {
            uom = { ...uom, unit_of_measure: currency.value };
            dispatch(editUnitOfMeasure(uom));
          }
          break;

        case 'date':
          if (dateFormat.hasChanged()) {
            uom = { ...uom, unit_of_measure: dateFormat.value };
            dispatch(editUnitOfMeasure(uom));
          }
          break;

        case 'time':
          if (timeFormat.hasChanged()) {
            uom = { ...uom, unit_of_measure: timeFormat.value };
            dispatch(editUnitOfMeasure(uom));
          }
          break;

        case 'distance':
          if (distance.hasChanged()) {
            uom = { ...uom, unit_of_measure: distance.value };
            dispatch(editUnitOfMeasure(uom));
          }
          break;

        case 'temperature':
          if (temp.hasChanged()) {
            uom = { ...uom, unit_of_measure: temp.value };
            dispatch(editUnitOfMeasure(uom));
          }
          break;

        case 'weight':
          if (weight.hasChanged()) {
            uom = { ...uom, unit_of_measure: weight.value };
            dispatch(editUnitOfMeasure(uom));
          }
          break;

        default:
          break;
      }
    });
  };

  return (
    <Grid className={classes.root} container spacing={2}>
      {loading && <Loader open={loading} />}
      <form
        className={classes.form}
        noValidate
        onSubmit={handleSubmit}
      >
        <Grid item xs={12}>
          <div className={classes.checkbox}>
            <Checkbox
              checked={allowImportExport.value}
              onClick={(e) => allowImportExport.setValue(e.target.checked)}
            />
            <Typography className={classes.label}>
              Allow Import Export for this Organization?
            </Typography>
          </div>
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
        <Grid item xs={12}>
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
            {_.map(orgTypes, (type) => (
              <MenuItem
                key={`orgType-${type.id}`}
                value={type.id}
              >
                {_.capitalize(type.name)}
              </MenuItem>
            ))}
          </TextField>
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
                const curr = _.find(currencies, {
                  country: _.find(countries, { country: e.target.value })
                    ? _.find(countries, { country: e.target.value }).iso3
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
            <div className={classes.loadingWrapper}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={loading || !submitDisabled()}
              >
                Save
              </Button>
            </div>
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

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
  ...state.itemsReducer,
  ...state.shipmentReducer,
  loading: state.authReducer.loading || state.itemsReducer.loading || state.shipmentReducer.loading,
});

export default connect(mapStateToProps)(OrganizationSettings);
