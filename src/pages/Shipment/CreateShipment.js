/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import Geocode from 'react-geocode';
import _ from 'lodash';
import moment from 'moment-timezone';
import { routes } from '../../routes/routesConstants';
import MapComponent from '../../components/MapComponent/MapComponent';
import {
  Button,
  useTheme,
  useMediaQuery,
  Grid,
  TextField,
  Typography,
  Box,
  MenuItem,
  FormControl,
  FormLabel,
  Divider,
  Autocomplete,
  Chip,
  Checkbox,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  CheckBox as CheckBoxIcon,
  Thermostat as TempIcon,
  Opacity as HumidIcon,
  LocationOn as LocationIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import Loader from '../../components/Loader/Loader';
import { UserContext } from '../../context/User.context';
import { checkForGlobalAdmin } from '../../utils/utilMethods';
import DatePickerComponent from '../../components/DatePicker/DatePicker';
import TimePickerComponent from '../../components/TimePicker/TimePicker';
import { useInput } from '../../hooks/useInput';
import {
  getCustodians,
  getCustodianType,
  getContact,
} from '../../redux/custodian/actions/custodian.actions';
import {
  getItems,
  getItemType,
} from '../../redux/items/actions/items.actions';
import {
  getGateways,
  getGatewayType,
  getSensors,
  getSensorType,
  editGateway,
} from '../../redux/sensorsGateway/actions/sensorsGateway.actions';
import {
  getShipmentDetails,
  editShipment,
  addShipment,
  saveShipmentFormData,
} from '../../redux/shipment/actions/shipment.actions';
import {
  SENSOR_PLATFORM,
  TRANSPORT_MODE,
  CARRIER,
} from '../../utils/mock';
import { validators } from '../../utils/validators';
import {
  getAvailableGateways,
} from '../../pages/SensorsGateway/Constants';
import { getCustodianFormattedRow } from '../../pages/Custodians/CustodianConstants';
import AddCustodians from '../Custodians/forms/AddCustodians';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  dashboardHeading: {
    fontWeight: 'bold',
    marginBottom: '0.5em',
  },
  formTitle: {
    fontWeight: 'bold',
    marginTop: '1em',
    textAlign: 'center',
  },
  fieldset: {
    border: '1px solid #EBC645',
    padding: '2rem',
    borderRadius: '1rem',
    width: '80%',
    marginTop: '1rem',
  },
  legend: {
    fontSize: '0.8rem',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  submit: {
    borderRadius: '18px',
    fontSize: '14px',
  },
  addButton: {
    marginTop: '1rem',
    color: '#EBC645',
    background: '#3B3A3A',
    borderRadius: '0',
    padding: '1rem 0',
  },
  buttonContainer: {
    width: '80%',
    margin: theme.spacing(2, 0),
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
  inputWithTooltip: {
    display: 'flex',
    alignItems: 'center',
  },
  asterisk: {
    fontSize: '1.5rem',
    color: theme.palette.primary.main,
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  divider: {
    width: '100%',
    marginTop: '10px',
    borderWidth: '1px',
    borderColor: theme.palette.primary.main,
  },
  autoComplete: {
    marginTop: '0px',
    width: '100%',
  },
  envInput: {
    margin: '1rem 0 0 0',
    display: 'flex',
    alignItems: 'center',
  },
  flexContainer: {
    display: 'flex', justifyContent: 'space-around', flexDirection: 'row',
  },
  smallInput: {
    width: '20%',
    marginLeft: '16px',
    flex: '1',
  },
}));

const CreateShipment = (props) => {
  const {
    shipmentFormData,
    history,
    loading,
    dispatch,
    location,
    timezone,
    gatewayData,
    itemData,
    custodianData,
    contactInfo,
    gatewayTypeList,
    sensorData,
    shipmentData,
    custodyData,
    aggregateReportData,
  } = props;
  const classes = useStyles();
  const user = useContext(UserContext);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const editPage = location.state && location.state.type === 'edit';
  const editData = location.state && location.state.data;
  const copyData = (location.state
    && location.state.type === 'copy'
    && location.state.data) || {};

  // For non-admins the forms becomes view-only once the shipment status is no longer just planned
  const viewOnly = !checkForGlobalAdmin(user)
    && editPage
    && editData
    && editData.status
    && _.lowerCase(editData.status) !== 'planned';

  const today = new Date();
  const { organization } = useContext(UserContext);
  const { organization_uuid, name } = organization;

  const addCustodianPath = `${routes.CUSTODIANS}/add`;

  const [shipment_name, setShipmentName] = useState(
    (editData && editData.name) || '',
  );

  const org_name = useInput(
    name.replace(/[^A-Z0-9]/g, ''),
  );
  const purchase_order_number = useInput(
    (editData && editData.purchase_order_number) || '',
  );
  const [origin, setOrigin] = useState('');
  const [dest, setDestination] = useState('');

  const order_number = useInput(
    (editData && editData.order_number) || '',
  );
  const shipper_number = useInput(
    (editData && editData.shipper_number) || '',
  );
  const carrier = useInput(
    (editData && editData.carrier) || '',
  );
  const mode_type = useInput(
    (editData && editData.transport_mode) || '',
  );
  const [scheduled_departure, handleDepartureDateChange] = useState(
    (editData && editData.estimated_time_of_departure)
    || new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0),
  );
  const [scheduled_arrival, handleArrivalDateChange] = useState(
    (editData && editData.estimated_time_of_arrival)
    || new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0),
  );
  const min_excursion_temp = useInput(
    (editData && editData.min_excursion_temp) || '0',
  );
  const max_excursion_temp = useInput(
    (editData && editData.max_excursion_temp) || '100',
  );
  const min_excursion_humidity = useInput(
    (editData && editData.min_excursion_humidity) || '0',
  );
  const max_excursion_humidity = useInput(
    (editData && editData.max_excursion_humidity) || '100',
  );

  let latLongChanged = false;

  const [custodianList, setCustodianList] = useState([]);
  const [start_of_custody, setStartCustody] = useState(
    (editData && editData.start_of_custody) || '',
  );
  const [end_of_custody, setEndCustody] = useState(
    (editData && editData.end_of_custody) || '',
  );
  const [start_of_custody_location, setStartLocation] = useState(
    (editData && editData.start_of_custody_location) || '',
  );
  const [end_of_custody_location, setEndLocation] = useState(
    (editData && editData.end_of_custody_location) || '',
  );
  const [start_of_custody_address, setStartAddress] = useState(
    (editData && editData.start_of_custody_location) || '',
  );
  const [end_of_custody_address, setEndAddress] = useState(
    (editData && editData.end_of_custody_location) || '',
  );

  const [itemIds, setItemIds] = useState(
    (editData && editData.items) || [],
  );

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const [gatewayIds, setGatewayIds] = useState(
    (editData && editData.gateway_ids) || [],
  );
  const [platform_name, setPlatformName] = useState(
    (editData && editData.platform_name) || 'tive',
  );
  const [formError, setFormError] = useState({});

  const [gatewayOptions, setGatewayOptions] = useState([]);

  let formTitle;
  if (!editPage) {
    formTitle = 'Create Shipment';
  } else if (viewOnly) {
    formTitle = 'View Shipment';
  } else {
    formTitle = 'Edit Shipment';
  }

  useEffect(() => {
    if (!shipmentData) {
      const getUpdatedSensorData = !aggregateReportData;
      const getUpdatedCustody = !custodyData;
      dispatch(getShipmentDetails(
        organization_uuid,
        'Planned,Enroute',
        null,
        getUpdatedSensorData,
        getUpdatedCustody,
        'get',
      ));
    }
    if (!custodianData) {
      dispatch(getCustodians(organization_uuid));
      dispatch(getCustodianType());
      dispatch(getContact(organization_uuid));
    }
    if (!itemData) {
      dispatch(getItems(organization_uuid));
      dispatch(getItemType(organization_uuid));
    }
    if (!gatewayData) {
      dispatch(getGateways(organization_uuid));
      dispatch(getGatewayType());
    }
    if (!sensorData) {
      dispatch(getSensors(organization_uuid));
      dispatch(getSensorType());
    }
  }, []);

  useEffect(() => {
    if (editData && editData.start_of_custody_location) {
      getAddress(
        editData.start_of_custody_location,
        'start',
      );
    }
    if (editData && editData.end_of_custody_location) {
      getAddress(
        editData.end_of_custody_location,
        'end',
      );
    }
  }, [editData]);

  useEffect(() => {
    if (
      custodianData
      && contactInfo
      && custodianData.length
    ) {
      setCustodianList(getCustodianFormattedRow(
        custodianData,
        contactInfo,
        custodyData,
      ));
    }

    if (
      gatewayData
      && gatewayData.length
      && gatewayTypeList
      && gatewayTypeList.length
      && shipmentData
      && shipmentData.length
    ) {
      const opts = getAvailableGateways(
        gatewayData,
        platform_name
          ? _.lowerCase(platform_name)
          : 'tive',
        gatewayTypeList,
        shipmentData,
        null,
      );
      setGatewayOptions(opts);
    }
  }, [custodianData, contactInfo, gatewayData,
    itemData, platform_name, gatewayTypeList,
    shipmentData, start_of_custody]);

  const updateShipmentFormData = () => {
    const updateGateway = _.find(gatewayData, { gateway_uuid: gatewayIds[0] });
    const imei_number = updateGateway ? [updateGateway.imei_number] : [];
    setShipmentName(`${org_name.value}-${order_number.value}-${origin}-${dest}`);
    const shipmentFormValue = {
      ...copyData,
      name: shipment_name,
      purchase_order_number: purchase_order_number.value,
      order_number: order_number.value,
      shipper_number: shipper_number.value,
      carrier: carrier.value ? [carrier.value] : [],
      transport_mode: mode_type.value,
      status: (editData && editData.status) || 'Planned',
      estimated_time_of_arrival: scheduled_arrival,
      estimated_time_of_departure: scheduled_departure,
      ...(editData && { id: editData.id }),
      items: (editData && editData.items) || itemIds,
      gateway_ids: (editData && editData.gateway_ids) || gatewayIds,
      gateway_imei: (editData && editData.gateway_imei)
        || imei_number,
      organization_uuid,
      platform_name,
      max_excursion_temp: parseInt(max_excursion_temp.value, 10),
      min_excursion_temp: parseInt(min_excursion_temp.value, 10),
      max_excursion_humidity: parseInt(max_excursion_humidity.value, 10),
      min_excursion_humidity: parseInt(min_excursion_humidity.value, 10),
    };
    dispatch(saveShipmentFormData(shipmentFormValue));
  };

  const getLatLong = (address, pointer) => {
    if (pointer === 'start') {
      latLongChanged = true;
      setStartAddress(address);
    } else if (pointer === 'end') {
      latLongChanged = true;
      setEndAddress(address);
    }
    if (
      (pointer === 'start'
        && address !== start_of_custody_address
        && address !== '')
      || (pointer === 'end'
        && address !== end_of_custody_address
        && address !== '')
    ) {
      latLongChanged = true;
      Geocode.setApiKey(window.env.GEO_CODE_API);
      Geocode.setLanguage('en');
      Geocode.fromAddress(address).then(
        (response) => {
          const { lat, lng } = response.results[0].geometry.location;
          if (pointer === 'start') {
            setStartLocation(`${lat},${lng}`);
          } else if (pointer === 'end') {
            setEndLocation(`${lat},${lng}`);
          }
        },
        (error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        },
      );
    }
  };

  const getAddress = (latLong, pointer) => {
    Geocode.setApiKey(window.env.GEO_CODE_API);
    Geocode.setLanguage('en');
    const latlong = latLong.split(',');
    Geocode.fromLatLng(latlong[0], latlong[1]).then(
      (response) => {
        const { results } = response;
        const establishment = _.find(
          results,
          (item) => _.includes(item.types, 'establishment'),
        );
        const premise = _.find(
          results,
          (item) => _.includes(item.types, 'premise'),
        );
        const filteredResult = establishment || premise || results[0];
        if (pointer === 'start') {
          setStartAddress(filteredResult.formatted_address);
        } else if (pointer === 'end') {
          setEndAddress(filteredResult.formatted_address);
        }
      },
      (error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      },
    );
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
    updateShipmentFormData();
  };

  const onInputChange = (value, type, custody) => {
    switch (type) {
      case 'item':
        if (value.length > itemIds.length) {
          setItemIds([...itemIds, _.last(value).url]);
        } else if (value.length < itemIds.length) { setItemIds(value); }
        break;
      case 'custodian':
        if (value) {
          if (custodianList.length > 0) {
            let selectedCustodian = '';
            _.forEach(custodianList, (list) => {
              if (list.url === value) {
                selectedCustodian = list;
              }
            });
            if (custody === 'start') {
              setStartCustody(value);
              setOrigin(selectedCustodian.name.replace(/[^A-Z0-9]/g, ''));
              getLatLong(selectedCustodian.location, 'start');
            } else if (custody === 'end') {
              setEndCustody(value);
              setDestination(selectedCustodian.name.replace(/[^A-Z0-9]/g, ''));
              getLatLong(selectedCustodian.location, 'end');
            }
          }
        }
        break;
      case 'gateway':
        if (value.length > gatewayIds.length) {
          setGatewayIds([...gatewayIds, _.last(value).gateway_uuid]);
        } else if (value.length < gatewayIds.length) { setGatewayIds(value); }
        break;
      default:
        break;
    }
  };

  const submitDisabled = () => {
    const errorKeys = Object.keys(formError);
    if (!shipment_name || !mode_type.value || !order_number.value || !platform_name
      || !min_excursion_temp.value || !max_excursion_temp.value
      || !min_excursion_humidity.value || !max_excursion_humidity.value
      || !start_of_custody || !end_of_custody
      || (!itemIds.length || itemData === null)
      || (!gatewayIds.length || gatewayData === null)) {
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
   * Submit The form
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const updateGateway = _.find(gatewayData, { gateway_uuid: gatewayIds[0] });
    const imei_number = updateGateway ? [updateGateway.imei_number] : [];
    setShipmentName(`${org_name.value}-${order_number.value}-${origin}-${dest}`);
    const shipmentFormValue = {
      ...copyData,
      name: shipment_name,
      purchase_order_number: purchase_order_number.value,
      order_number: order_number.value,
      shipper_number: shipper_number.value,
      carrier: carrier.value ? [carrier.value] : [],
      transport_mode: mode_type.value,
      status: (editData && editData.status) || 'Planned',
      estimated_time_of_arrival: scheduled_arrival,
      estimated_time_of_departure: scheduled_departure,
      ...(editData && { id: editData.id }),
      items: (editData && editData.items) || itemIds,
      gateway_ids: (editData && editData.gateway_ids) || gatewayIds,
      gateway_imei: (editData && editData.gateway_imei)
        || imei_number,
      organization_uuid,
      platform_name,
      max_excursion_temp: parseInt(max_excursion_temp.value, 10),
      min_excursion_temp: parseInt(min_excursion_temp.value, 10),
      max_excursion_humidity: parseInt(max_excursion_humidity.value, 10),
      min_excursion_humidity: parseInt(min_excursion_humidity.value, 10),
    };
    const startCustodyForm = {
      // start_of_custody: new Date(),
      // end_of_custody: new Date(),
      custodian: [start_of_custody],
      start_of_custody_location: start_of_custody_location || null,
      end_of_custody_location: start_of_custody_location || null,
      has_current_custody: true,
      first_custody: true,
      last_custody: false,
      radius: organization.radius || 10,
      shipment_name,
    };
    const endCustodyForm = {
      // start_of_custody: new Date(),
      // end_of_custody: new Date(),
      custodian: [end_of_custody],
      start_of_custody_location: end_of_custody_location || null,
      end_of_custody_location: end_of_custody_location || null,
      has_current_custody: false,
      first_custody: false,
      last_custody: true,
      radius: organization.radius || 10,
      shipment_name,
    };

    const shipment_payload = {
      shipment: shipmentFormValue,
      start_custody: startCustodyForm,
      end_custody: endCustodyForm,
      gateway: updateGateway,
    };
    if (editPage && editData) {
      if (shipmentFormValue.gateway_ids.length > 0) {
        let gateway_status = null;
        let shipment_ids = [];

        let attachedGateway = null;
        attachedGateway = _.filter(
          gatewayData, (gateway) => gateway.gateway_uuid === shipmentFormValue.gateway_ids[0],
        );

        if (shipmentFormValue.status === 'Completed' || shipmentFormValue.status === 'Cancelled') {
          gateway_status = 'available';
        } else if (shipmentFormValue.status === 'Enroute' && shipmentFormValue.gateway_ids.length > 0) {
          gateway_status = 'assigned';
          shipment_ids = [shipmentFormValue.id];
        }

        if (gateway_status === null) {
          gateway_status = attachedGateway[0].gateway_status;
        }

        dispatch(
          editShipment(
            shipment_payload,
            history,
            `${routes.SHIPMENT}/edit/:${editData.id}`,
            organization_uuid,
            attachedGateway[0],
          ),
        );
        dispatch(
          editGateway({
            ...attachedGateway[0],
            gateway_status,
            shipment_ids,
          }),
        );
      } else {
        dispatch(
          editShipment(
            shipment_payload,
            history,
            `${routes.SHIPMENT}/edit/:${editData.id}`,
            organization_uuid,
            null,
          ),
        );
      }
    } else {
      dispatch(addShipment(shipment_payload, history, null, organization_uuid));
    }
  };

  return (
    <Box mt={5} mb={5}>
      {loading && <Loader open={loading} />}
      <Box mb={3} mt={2} display="flex" alignItems="center" justifyContent="space-between">
        <Typography
          className={classes.dashboardHeading}
          variant="h4"
        >
          {formTitle}
        </Typography>
      </Box>
      <form
        className={classes.form}
        noValidate
        onSubmit={handleSubmit}
      >
        <Box mb={2}>
          <Grid container spacing={2}>
            <FormControl
              component="fieldset"
              variant="outlined"
              color="primary"
              className={classes.fieldset}
            >
              <FormLabel
                component="legend"
                className={classes.legend}
              >
                Shipment details
              </FormLabel>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{ padding: '8px' }}
                >
                  <Grid container spacing={isDesktop ? 2 : 0}>
                    {/* <Grid item xs={12}>
                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        fullWidth
                        className={classes.submit}
                        disabled={show_start_custody}
                        onClick={() => setShowStartCustody(true)}
                      >
                        <AddIcon />
                        {' '}
                        Add Shipment Origin
                      </Button>
                    </Grid> */}
                    {/* { show_start_custody && ( */}
                    <Grid item xs={12} className={classes.inputWithTooltip}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        disabled={viewOnly}
                        select
                        id="start_of_custody"
                        label="Origin Company"
                        onBlur={(e) => handleBlur(e, 'required', start_of_custody, 'start_of_custody')}
                        value={start_of_custody}
                        onChange={(event) => onInputChange(event.target.value, 'custodian', 'start')}
                      >
                        <MenuItem value="">Select</MenuItem>
                        {custodianList
                    && _.map(
                      _.orderBy(custodianList, ['name'], ['asc']),
                      (item, index) => (
                        <MenuItem
                          key={`custodian${index}:${item.id}`}
                          value={item.url}
                        >
                          {item.name}
                        </MenuItem>
                      ),
                    )}
                      </TextField>
                      <span className={classes.asterisk}>*</span>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        disabled
                        id="start_of_custody_address"
                        label="Origin Address"
                        name="start_of_custody_address"
                        autoComplete="start_of_custody_address"
                        value={start_of_custody_address}
                        onChange={(e) => getLatLong(e.target.value, 'start')}
                        InputProps={{
                          endAdornment: <InputAdornment position="end"><LocationIcon style={{ color: '#fff' }} /></InputAdornment>,
                        }}
                      />
                      <MapComponent
                        isMarkerShown
                        googleMapURL={window.env.MAP_API_URL}
                        zoom={10}
                        loadingElement={
                          <div style={{ height: '100%' }} />
                  }
                        containerElement={
                          <div style={{ height: '200px', marginTop: '10px' }} />
                  }
                        mapElement={
                          <div style={{ height: '100%' }} />
                  }
                        markers={[
                          {
                            lat: start_of_custody_location
                      && parseFloat(start_of_custody_location.split(',')[0]),
                            lng: start_of_custody_location
                      && parseFloat(start_of_custody_location.split(',')[1]),
                            radius: organization.radius,
                          },
                        ]}
                        geofence={
                    editData
                    && editData.start_of_custody_location_geofence
                  }
                      />
                    </Grid>
                    {/* ) } */}
                  </Grid>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{ padding: '8px' }}
                >
                  <Grid container spacing={isDesktop ? 2 : 0}>
                    {/* <Grid item xs={12}>
                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        fullWidth
                        className={classes.submit}
                        required
                        disabled={show_end_custody}
                        onClick={() => setShowEndCustody(true)}
                      >
                        <AddIcon />
                        {' '}
                        Add Shipment Destination
                      </Button>
                    </Grid>
                    {show_end_custody && ( */}
                    <Grid item xs={12} className={classes.inputWithTooltip}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        disabled={viewOnly}
                        select
                        id="end_of_custody"
                        label="Destination Company"
                        onBlur={(e) => handleBlur(e, 'required', end_of_custody, 'end_of_custody')}
                        value={end_of_custody}
                        onChange={(event) => onInputChange(event.target.value, 'custodian', 'end')}
                      >
                        <MenuItem value="">Select</MenuItem>
                        {custodianList
                    && _.map(
                      _.orderBy(custodianList, ['name'], ['asc']),
                      (item, index) => (
                        <MenuItem
                          key={`custodian${index}:${item.id}`}
                          value={item.url}
                        >
                          {item.name}
                        </MenuItem>
                      ),
                    )}
                      </TextField>
                      <span className={classes.asterisk}>*</span>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        id="end_of_custody_address"
                        label="Destination Address"
                        name="end_of_custody_address"
                        disabled
                        autoComplete="end_of_custody_address"
                        value={end_of_custody_address}
                        onChange={(e) => getLatLong(e.target.value, 'end')}
                        InputProps={{
                          endAdornment: <InputAdornment position="end"><LocationIcon style={{ color: '#fff' }} /></InputAdornment>,
                        }}
                      />
                      <MapComponent
                        isMarkerShown
                        googleMapURL={window.env.MAP_API_URL}
                        zoom={10}
                        loadingElement={
                          <div style={{ height: '100%' }} />
                  }
                        containerElement={
                          <div style={{ height: '200px', marginTop: '10px' }} />
                  }
                        mapElement={
                          <div style={{ height: '100%' }} />
                  }
                        markers={[
                          {
                            lat: end_of_custody_location
                      && parseFloat(end_of_custody_location.split(',')[0]),
                            lng: end_of_custody_location
                      && parseFloat(end_of_custody_location.split(',')[1]),
                            radius: organization.radius,
                          },
                        ]}
                        geofence={
                    editData
                    && editData.end_of_custody_location_geofence
                  }
                      />
                    </Grid>
                    {/* ) } */}
                  </Grid>
                </Grid>
                <Divider
                  orientation="horizontal"
                  light
                  className={classes.divider}
                />
              </Grid>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{ padding: '8px' }}
                >
                  <Grid container spacing={isDesktop ? 2 : 0}>
                    <Grid
                      item
                      xs={12}
                      className={classes.inputWithTooltip}
                    >
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        id="mode_type"
                        select
                        label="Transportation type"
                        disabled={viewOnly}
                        onBlur={(e) => handleBlur(e, 'required', mode_type, 'mode_type')}
                        {...mode_type.bind}
                      >
                        <MenuItem value="">Select</MenuItem>
                        {TRANSPORT_MODE
                      && _.map(
                        _.orderBy(TRANSPORT_MODE, ['value'], ['asc']),
                        (item, index) => (
                          <MenuItem
                            key={`transportMode${index}:${item.value}`}
                            value={item.value}
                          >
                            {item.label}
                          </MenuItem>
                        ),
                      )}
                      </TextField>
                      <span className={classes.asterisk}>*</span>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      className={classes.inputWithTooltip}
                    >
                      <Autocomplete
                        multiple
                        id="items-outlined"
                        disabled={viewOnly}
                        disableCloseOnSelect
                        fullWidth
                        className={classes.autoComplete}
                        options={
                    (
                      itemData
                      && _.orderBy(
                        itemData,
                        ['name'],
                        ['asc'],
                      )
                    ) || []
                  }
                        getOptionLabel={(option) => (
                          option
                    && option.name
                        )}
                        isOptionEqualToValue={(option, value) => (
                          option.url === value
                        )}
                        value={itemIds}
                        onChange={(event, newValue) => onInputChange(newValue, 'item', null)}
                        renderTags={(value, getTagProps) => (
                          _.map(value, (option, index) => (
                            <Chip
                              variant="default"
                              key={`item-${index}:${option}`}
                              label={
                                !_.isEmpty(itemData) && _.find(itemData, { url: option })
                                  ? _.find(itemData, { url: option }).name
                                  : ''
                              }
                              {...getTagProps({ index })}
                            />
                          ))
                        )}
                        // eslint-disable-next-line no-shadow
                        renderOption={(props, option, { selected }) => (
                          <li {...props} key={`item-${option.id}-${option.name}`}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 8, color: '#fff' }}
                              checked={selected}
                            />
                            {option.name}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            disabled={viewOnly}
                            variant="outlined"
                            label="Product to be shipped"
                            placeholder="Select a product"
                          />
                        )}
                      />
                      <span className={classes.asterisk}>*</span>
                    </Grid>

                  </Grid>

                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{ padding: '8px' }}
                >
                  <Grid container spacing={isDesktop ? 2 : 0}>
                    <Grid item xs={6}>
                      <Grid
                        item
                        xs={12}
                        className={classes.inputWithTooltip}
                      >
                        <TextField
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          required
                          id="max_excursion_temp"
                          label="Temp warning: HIGH"
                          name="max_excursion_temp"
                          autoComplete="max_excursion_temp"
                          value={max_excursion_temp}
                          disabled={viewOnly}
                          onBlur={(e) => handleBlur(e, 'required', max_excursion_temp, 'max_excursion_temp')}
                          InputProps={{
                            endAdornment: <InputAdornment position="end"><TempIcon style={{ color: '#fff' }} /></InputAdornment>,
                          }}
                          {...max_excursion_temp.bind}
                        />
                        <span className={classes.asterisk}>*</span>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        className={classes.envInput}
                      >
                        <TextField
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          id="min_excursion_temp"
                          label="Temp warning: LOW"
                          required
                          name="min_excursion_temp"
                          autoComplete="min_excursion_temp"
                          value={min_excursion_temp}
                          disabled={viewOnly}
                          onBlur={(e) => handleBlur(e, 'required', min_excursion_temp, 'min_excursion_temp')}
                          InputProps={{
                            endAdornment: <InputAdornment position="end"><TempIcon style={{ color: '#fff' }} /></InputAdornment>,
                          }}
                          {...min_excursion_temp.bind}
                        />
                        <span className={classes.asterisk}>*</span>
                      </Grid>
                    </Grid>
                    <Grid item xs={6}>
                      <Grid
                        item
                        xs={12}
                        className={classes.inputWithTooltip}
                      >
                        <TextField
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          id="max_excursion_humidity"
                          label="Humidity warning: HIGH"
                          required
                          name="max_excursion_humidity"
                          autoComplete="max_excursion_humidity"
                          value={max_excursion_humidity}
                          disabled={viewOnly}
                          onBlur={(e) => handleBlur(e, 'required', max_excursion_humidity, 'max_excursion_humidity')}
                          InputProps={{
                            endAdornment: <InputAdornment position="end"><HumidIcon style={{ color: '#fff' }} /></InputAdornment>,
                          }}
                          {...max_excursion_humidity.bind}
                        />
                        <span className={classes.asterisk}>*</span>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        className={classes.envInput}
                      >
                        <TextField
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          required
                          id="min_excursion_humidity"
                          label="Humidity warning: LOW"
                          name="min_excursion_humidity"
                          autoComplete="min_excursion_humidity"
                          value={min_excursion_humidity}
                          disabled={viewOnly}
                          onBlur={(e) => handleBlur(e, 'required', min_excursion_humidity, 'min_excursion_humidity')}
                          InputProps={{
                            endAdornment: <InputAdornment position="end"><HumidIcon style={{ color: '#fff' }} /></InputAdornment>,
                          }}
                          {...min_excursion_humidity.bind}
                        />
                        <span className={classes.asterisk}>*</span>
                      </Grid>
                    </Grid>
                  </Grid>

                </Grid>
                <Grid item xs={10} sm={8} />
                {/* <Grid
                  item
                  xs={2}
                  sm={4}
                  display="flex"
                  alignItems="flex-end"
                  justifyContent="flex-end"
                >
                  <Button
                    variant="contained"
                    className={classes.addButton}
                    size="medium"
                    fullWidth
                    disableElevation
                  >
                    Save as Template
                  </Button>
                </Grid> */}
              </Grid>
            </FormControl>

            <FormControl
              component="fieldset"
              variant="outlined"
              color="primary"
              className={classes.fieldset}
            >
              <FormLabel
                component="legend"
                className={classes.legend}
              >
                Additional information
              </FormLabel>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} sx={{ padding: '8px' }}>
                  <Grid container spacing={isDesktop ? 2 : 0} display="flex" justifyItems="space-between" flexDirection="row">
                    <Grid item xs={2} sm={4}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        id="org_name"
                        name="org_name"
                        autoComplete="org_name"
                        disabled
                        onBlur={(e) => handleBlur(e, 'required', org_name, 'org_name')}
                        {...org_name.bind}
                      />

                    </Grid>
                    <Grid item xs={10} sm={8} className={classes.inputWithTooltip}>
                      <TextField
                        variant="outlined"
                        required
                        margin="normal"
                        fullWidth
                        id="order_number"
                        label="Order Number"
                        name="order_number"
                        autoComplete="order_number"
                        disabled={viewOnly}
                        onBlur={(e) => handleBlur(e, 'required', order_number, 'order_number')}
                        {...order_number.bind}
                      />
                      <span className={classes.asterisk}>*</span>
                    </Grid>

                  </Grid>

                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} sx={{ padding: '8px' }}>
                  <Grid container spacing={isDesktop ? 2 : 0}>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="purchase_order_number"
                        label="Purchase Order Number"
                        name="purchase_order_number"
                        autoComplete="purchase_order_number"
                        disabled={viewOnly}
                        {...purchase_order_number.bind}
                      />
                      <Grid item xs={12} display="flex" justifyContent="space-between">
                        <DatePickerComponent
                          label="Pick-up Date"
                          fullWidth
                          required
                          selectedDate={
                        moment(scheduled_departure).tz(timezone)
                          .format('MMMM DD, YYYY HH:mm:ss')
                      }
                          handleDateChange={handleDepartureDateChange}
                          disabled={viewOnly}
                        />
                        <TimePickerComponent
                          label="Pick-up Time"
                          fullWidth
                          required
                          selectedTime={
                        moment(scheduled_departure).tz(timezone)
                          .format('MMMM DD, YYYY HH:mm:ss')
                      }
                          handleTimeChange={handleDepartureDateChange}
                          disabled={viewOnly}
                        />
                      </Grid>

                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        id="carrier"
                        select
                        label="Carrier"
                        disabled={viewOnly}
                        onBlur={(e) => handleBlur(e, 'required', carrier, 'carrier')}
                        {...carrier.bind}
                      >
                        <MenuItem value="">Select</MenuItem>
                        {CARRIER
                      && _.map(
                        _.orderBy(CARRIER, ['value'], ['asc']),
                        (item, index) => (
                          <MenuItem
                            key={`carrier${index}:${item.value}`}
                            value={item.value}
                          >
                            {item.label}
                          </MenuItem>
                        ),
                      )}
                      </TextField>
                    </Grid>

                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ padding: '8px' }}>
                  <Grid
                    container
                    spacing={isDesktop ? 2 : 0}
                  >
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="shipper_number"
                        label="Shipper Number"
                        name="shipper_number"
                        autoComplete="shipper_number"
                        disabled={viewOnly}
                        {...shipper_number.bind}
                      />
                      <Grid item xs={12} display="flex" justifyContent="space-between">
                        <DatePickerComponent
                          label="Drop-off Date"
                          fullWidth
                          required
                          selectedDate={
                        moment(scheduled_arrival).tz(timezone)
                          .format('MMMM DD, YYYY HH:mm:ss')
                      }
                          handleDateChange={handleArrivalDateChange}
                          disabled={viewOnly}
                        />
                        <TimePickerComponent
                          label="Drop-off Time"
                          fullWidth
                          required
                          selectedTime={
                        moment(scheduled_arrival).tz(timezone)
                          .format('MMMM DD, YYYY HH:mm:ss')
                      }
                          handleTimeChange={handleArrivalDateChange}
                          disabled={viewOnly}
                        />
                      </Grid>
                      <Button
                        variant="contained"
                        fullWidth
                        className={classes.addButton}
                        size="large"
                        disableElevation
                        onClick={() => {
                          history.push(addCustodianPath, {
                            from: routes.CREATE_SHIPMENT,
                          });
                        }}
                      >
                        <AddIcon />
                        {' '}
                        Add Custodian
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </FormControl>

            <FormControl
              component="fieldset"
              variant="outlined"
              color="primary"
              className={classes.fieldset}
            >
              <FormLabel
                component="legend"
                className={classes.legend}
              >
                Gateway
              </FormLabel>
              <Grid container spacing={2}>
                <Grid item xs={6} className={classes.inputWithTooltip}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="platform_name"
                    select
                    label="Gateway Platform"
                    disabled={
                        viewOnly
                      }
                    value={platform_name}
                    onChange={(e) => setPlatformName(e.target.value)}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {SENSOR_PLATFORM
                      && _.map(
                        _.orderBy(SENSOR_PLATFORM, ['value'], ['asc']),
                        (item, index) => (
                          <MenuItem
                            key={`sensorPlatform${index}:${item.value}`}
                            value={item.value}
                          >
                            {item.label}
                          </MenuItem>
                        ),
                      )}
                  </TextField>
                  <span className={classes.asterisk}>*</span>
                </Grid>
                <Grid item xs={6} className={classes.inputWithTooltip}>
                  <Autocomplete
                    multiple
                    id="gateways-outlined"
                    fullWidth
                    disableCloseOnSelect
                    options={gatewayOptions}
                    getOptionLabel={(option) => (
                      option
                    && option.name
                    )}
                    isOptionEqualToValue={(option, value) => (
                      option.gateway_uuid === value
                    )}
                    filterSelectedOptions
                    value={gatewayIds}
                    onChange={(event, newValue) => onInputChange(newValue, 'gateway', null)}
                    renderTags={(value, getTagProps) => (
                      _.map(value, (option, index) => (
                        <Chip
                          variant="default"
                          label={
                            !_.isEmpty(gatewayData) && _.find(gatewayData, { gateway_uuid: option })
                              ? _.find(gatewayData, { gateway_uuid: option }).name
                              : ''
                          }
                          {...getTagProps({ index })}
                        />
                      ))
                    )}
                    // eslint-disable-next-line no-shadow
                    renderOption={(props, option, { selected }) => (
                      <li {...props} key={`gateway-${option.id}-${option.name}`}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8, color: '#fff' }}
                          checked={selected}
                        />
                        {option.name}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        disabled={viewOnly}
                        label="Gateway Label"
                        variant="outlined"
                        placeholder="Select a Gateway"
                      />
                    )}
                  />
                  <span className={classes.asterisk}>*</span>
                </Grid>
              </Grid>
            </FormControl>

            <Grid container spacing={2} marginTop="0.5rem">
              <Grid item xs={0} sm={5} />
              <Grid item xs={12} sm={4} className={classes.flexContainer}>
                <TextField
                  variant="outlined"
                  required
                  margin="normal"
                  id="org_name"
                  name="org_name"
                  autoComplete="org_name"
                  disabled
                  onBlur={(e) => handleBlur(e, 'required', org_name, 'org_name')}
                  {...org_name.bind}
                  style={{
                    width: '20%',
                  }}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  id="order_number"
                  label="ORDER #"
                  name="order_number"
                  autoComplete="order_number"
                  disabled
                  onBlur={(e) => handleBlur(e, 'required', order_number, 'order_number')}
                  {...order_number.bind}
                  style={{
                    flex: '2',
                    width: '20%',
                    marginLeft: '16px',
                  }}
                  className={classes.smallInput}
                />
                <TextField
                  variant="outlined"
                  required
                  margin="normal"
                  id="origin"
                  label="ORIG"
                  name="origin"
                  disabled
                  value={origin}
                  className={classes.smallInput}
                />
                <TextField
                  variant="outlined"
                  required
                  margin="normal"
                  id="dest"
                  label="DEST"
                  name="dest"
                  disabled
                  value={dest}
                  className={classes.smallInput}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            className={classes.buttonContainer}
          >
            <Grid item xs={12} sm={6}>
              <Button
                type="button"
                fullWidth
                variant="outlined"
                color="primary"
                className={classes.submit}
              >
                Cancel
              </Button>

            </Grid>
            <Grid item xs={12} sm={6}>
              {viewOnly ? (
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Done
                </Button>
              ) : (
                <div className={classes.loadingWrapper}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={loading || submitDisabled()}
                  >
                    Save Shipment
                  </Button>
                  {loading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                  )}
                </div>
              )}
            </Grid>
          </Grid>
        </Box>

      </form>
      <Route path={addCustodianPath} component={AddCustodians} />

    </Box>

  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.shipmentReducer,
  ...state.itemsReducer,
  ...state.custodianReducer,
  ...state.optionsReducer,
  ...state.sensorsGatewayReducer,
  loading: (
    state.shipmentReducer.loading
    || state.itemsReducer.loading
    || state.custodianReducer.loading
    || state.optionsReducer.loading
    || state.sensorsGatewayReducer.loading
  ),
});

export default connect(mapStateToProps)(CreateShipment);
