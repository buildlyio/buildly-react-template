import React, { useState, useEffect } from 'react';
import Geocode from 'react-geocode';
import _ from 'lodash';
import moment from 'moment-timezone';
import {
  makeStyles,
  TextField,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  MenuItem,
} from '@material-ui/core';
import DatePickerComponent from '@components/DatePicker/DatePicker';
import { MapComponent } from '@components/MapComponent/MapComponent';
import CustomizedTooltips from '@components/ToolTip/ToolTip';
import { useInput } from '@hooks/useInput';
import { getFormattedRow } from '@pages/Custodians/CustodianConstants';
import {
  addCustody,
  editCustody,
} from '@redux/custodian/actions/custodian.actions';
import { validators } from '@utils/validators';

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    textAlign: 'center',
    justifyContent: 'center',
    margin: theme.spacing(3, 0),
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
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      width: '70%',
      margin: 'auto',
    },
  },
  submit: {
    borderRadius: '18px',
    fontSize: 11,
  },
  inputWithTooltip: {
    display: 'flex',
    alignItems: 'center',
  },
}));

// eslint-disable-next-line import/no-mutable-exports
export let checkIfCustodianInfoEdited;

const AddCustodyForm = ({
  custodianData,
  loading,
  dispatch,
  shipmentFormData,
  contactInfo,
  editItem,
  setOpenModal,
  custodyOptions,
  viewOnly,
  organizationData,
  rows,
  timezone,
}) => {
  const classes = useStyles();
  let latLongChanged = false;

  const [custodianURL, setCustodianURL] = useState(
    (editItem && editItem.custodian_data && editItem.custodian_data.url) || '',
  );
  const [custodianList, setCustodianList] = useState([]);
  const [start_of_custody, handleStartChange] = useState(
    (editItem && editItem.start_of_custody) || new Date(),
  );
  const [end_of_custody, handleEndChange] = useState(
    (editItem && editItem.end_of_custody) || new Date(),
  );
  const [start_of_custody_location, setStartLocation] = useState(
    (editItem && editItem.start_of_custody_location) || '',
  );
  const [end_of_custody_location, setEndLocation] = useState(
    (editItem && editItem.end_of_custody_location) || '',
  );
  const [start_of_custody_address, setStartAddress] = useState(
    (editItem && editItem.start_of_custody_location) || '',
  );
  const [end_of_custody_address, setEndAddress] = useState(
    (editItem && editItem.end_of_custody_location) || '',
  );

  const load_id = useInput((editItem && editItem.load_id) || rows.length + 1);

  const shipment = useInput(
    shipmentFormData && shipmentFormData.shipment_uuid,
    '',
    { required: true },
  );
  const shipment_name = useInput(shipmentFormData && shipmentFormData.name, '');
  const has_current_custody = useInput(
    (editItem && editItem.has_current_custody) || false,
  );
  const first_custody = useInput((editItem && editItem.first_custody) || false);
  const last_custody = useInput((editItem && editItem.last_custody) || false);
  const [formError, setFormError] = useState({});

  const [custodyMetaData, setCustodyMetaData] = useState({});

  useEffect(() => {
    if (custodyOptions && custodyOptions.actions) {
      setCustodyMetaData(custodyOptions.actions.POST);
    }
  }, [custodyOptions]);

  useEffect(() => {
    if (
      custodianData
      && contactInfo
      && custodianData.length
    ) {
      setCustodianList(getFormattedRow(
        custodianData,
        contactInfo,
      ));
    }
  }, [custodianData, contactInfo]);

  useEffect(() => {
    if (editItem && editItem.start_of_custody_location) {
      getAddress(
        editItem.start_of_custody_location,
        'start',
      );
    }
    if (editItem && editItem.end_of_custody_location) {
      getAddress(
        editItem.end_of_custody_location,
        'end',
      );
    }
  }, [editItem]);

  const submitDisabled = () => !custodianURL;

  const onInputChange = (e) => {
    const { value } = e.target;
    if (value) {
      setCustodianURL(value);
      if (custodianList.length > 0) {
        let selectedCustodian = '';
        _.forEach(custodianList, (list) => {
          if (list.url === value) {
            selectedCustodian = list;
          }
        });
        getLatLong(selectedCustodian.location, 'start');
        getLatLong(selectedCustodian.location, 'end');
      }
    } else {
      setCustodianURL(value);
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

  /**
   * Submit The form and add/edit custodian
   * @param {Event} event the default submit event
   */
  const onAddCustodyClick = (event) => {
    event.preventDefault();
    const custodyFormValues = {
      start_of_custody,
      end_of_custody,
      custodian: [custodianURL],
      start_of_custody_location: start_of_custody_location || null,
      end_of_custody_location: end_of_custody_location || null,
      shipment_id: shipment.value,
      has_current_custody: has_current_custody.value,
      first_custody: first_custody.value,
      last_custody: last_custody.value,
      radius: organizationData.radius,
      load_id: load_id.value,
      ...(editItem !== null && { id: editItem.id }),
      shipment_name: shipment_name.value,
      shipment: shipmentFormData.id,
    };
    if (editItem !== null) {
      dispatch(editCustody(custodyFormValues));
    } else {
      dispatch(addCustody(custodyFormValues));
    }
    checkIfCustodianInfoEdited = () => false;
    setOpenModal();
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

  checkIfCustodianInfoEdited = () => (
    custodianURL !== (
      (editItem && editItem.custodian_data && editItem.custodian_data.url)
      || '')
    || load_id.hasChanged()
    || (editItem && (start_of_custody !== editItem.start_of_custody))
    || (editItem && (end_of_custody !== editItem.end_of_custody))
    || latLongChanged
    || has_current_custody.hasChanged()
    || first_custody.hasChanged()
    || last_custody.hasChanged()
  );

  return (
    <Box mb={5} mt={3}>
      <form noValidate onSubmit={onAddCustodyClick}>
        <Card variant="outlined" className={classes.form}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid className={classes.inputWithTooltip} item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                  disabled
                  id="shipment"
                  label="Shipment ID"
                  name="shipment"
                  autoComplete="shipment"
                  error={
                    formError.shipment
                    && formError.shipment.error
                  }
                  helperText={
                    formError.shipment
                      ? formError.shipment.message
                      : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', shipment)}
                  {...shipment.bind}
                />
                {custodyMetaData.shipment_id
                && custodyMetaData.shipment_id.help_text
                && (
                  <CustomizedTooltips
                    toolTipText={
                      custodyMetaData.shipment_id.help_text
                    }
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  disabled
                  id="shipment_name"
                  label="Shipment name"
                  name="shipment_name"
                  autoComplete="shipment_name"
                  {...shipment_name.bind}
                />
              </Grid>
              <Grid className={classes.inputWithTooltip} item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="custodianURL"
                  select
                  required
                  label="Custodian"
                  disabled={viewOnly}
                  error={
                    formError.custodianURL
                    && formError.custodianURL.error
                  }
                  helperText={
                    formError.custodianURL
                      ? formError.custodianURL.message
                      : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', custodianURL, 'custodianURL')}
                  value={custodianURL}
                  onChange={onInputChange}
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
                {custodyMetaData.custodian
                && custodyMetaData.custodian.help_text
                && (
                  <CustomizedTooltips
                    toolTipText={
                      custodyMetaData.custodian.help_text
                    }
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  disabled={viewOnly}
                  id="load_id"
                  label="Custody Order"
                  name="load_id"
                  autoComplete="load_id"
                  error={
                    formError.load_id
                    && formError.load_id.error
                  }
                  helperText={
                    formError.load_id
                      ? formError.load_id.message
                      : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', load_id)}
                  {...load_id.bind}
                />
              </Grid>
              <Grid item xs={12}>
                <DatePickerComponent
                  label="Start of Custody"
                  selectedDate={
                    moment(start_of_custody).tz(timezone)
                      .format('MMMM DD, YYYY HH:mm:ss')
                  }
                  hasTime
                  disabled={viewOnly}
                  helpText={
                    custodyMetaData.start_of_custody
                    && custodyMetaData.start_of_custody.help_text
                      ? custodyMetaData.start_of_custody.help_text
                      : ''
                  }
                  handleDateChange={handleStartChange}
                />
              </Grid>
              <Grid item xs={12}>
                <DatePickerComponent
                  label="End of Custody"
                  selectedDate={
                    moment(end_of_custody).tz(timezone)
                      .format('MMMM DD, YYYY HH:mm:ss')
                  }
                  hasTime
                  handleDateChange={handleEndChange}
                  disabled={viewOnly}
                  helpText={
                    custodyMetaData.end_of_custody
                    && custodyMetaData.end_of_custody.help_text
                      ? custodyMetaData.end_of_custody.help_text
                      : ''
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  disabled={viewOnly}
                  id="start_of_custody_address"
                  label="Start of Custody location"
                  name="start_of_custody_address"
                  autoComplete="start_of_custody_address"
                  value={start_of_custody_address}
                  onChange={(e) => getLatLong(e.target.value, 'start')}
                />
                <MapComponent
                  isMarkerShown
                  googleMapURL={window.env.MAP_API_URL}
                  zoom={10}
                  loadingElement={
                    <div style={{ height: '100%' }} />
                  }
                  containerElement={
                    <div style={{ height: '200px' }} />
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
                      radius: organizationData.radius,
                    },
                  ]}
                  geofence={
                    editItem
                    && editItem.start_of_custody_location_geofence
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  disabled={viewOnly}
                  id="end_of_custody_address"
                  label="End of Custody location"
                  name="end_of_custody_address"
                  autoComplete="end_of_custody_address"
                  value={end_of_custody_address}
                  onChange={(e) => getLatLong(e.target.value, 'end')}
                />
                <MapComponent
                  isMarkerShown
                  googleMapURL={window.env.MAP_API_URL}
                  zoom={10}
                  loadingElement={
                    <div style={{ height: '100%' }} />
                  }
                  containerElement={
                    <div style={{ height: '200px' }} />
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
                      radius: organizationData.radius,
                    },
                  ]}
                  geofence={
                    editItem
                    && editItem.end_of_custody_location_geofence
                  }
                />
              </Grid>
              <Grid
                className={classes.inputWithTooltip}
                item
                xs={12}
                sm={6}
              >
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  disabled={viewOnly}
                  select
                  id="has_current_custody"
                  label="Has current Custody?"
                  {...has_current_custody.bind}
                >
                  <MenuItem value>YES</MenuItem>
                  <MenuItem value={false}>NO</MenuItem>
                </TextField>
                {custodyMetaData.has_current_custody
                && custodyMetaData.has_current_custody.help_text
                && (
                  <CustomizedTooltips
                    toolTipText={
                      custodyMetaData.has_current_custody.help_text
                    }
                  />
                )}
              </Grid>
              <Grid
                className={classes.inputWithTooltip}
                item
                xs={12}
                sm={6}
              >
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  disabled={viewOnly}
                  select
                  id="first_custody"
                  label="Is first Custody?"
                  {...first_custody.bind}
                >
                  <MenuItem value>YES</MenuItem>
                  <MenuItem value={false}>NO</MenuItem>
                </TextField>
                {custodyMetaData.first_custody
                && custodyMetaData.first_custody.help_text
                && (
                  <CustomizedTooltips
                    toolTipText={
                      custodyMetaData.first_custody.help_text
                    }
                  />
                )}
              </Grid>
              <Grid
                className={classes.inputWithTooltip}
                item
                xs={12}
                sm={6}
              >
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  disabled={viewOnly}
                  select
                  id="last_custody"
                  label="Is last Custody?"
                  {...last_custody.bind}
                >
                  <MenuItem value>YES</MenuItem>
                  <MenuItem value={false}>NO</MenuItem>
                </TextField>
                {custodyMetaData.last_custody
                && custodyMetaData.last_custody.help_text
                && (
                  <CustomizedTooltips
                    toolTipText={
                      custodyMetaData.last_custody.help_text
                    }
                  />
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Grid
          container
          spacing={3}
          className={classes.buttonContainer}
        >
          <Grid item xs={6}>
            {viewOnly ? (
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={setOpenModal}
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
                  {editItem ? 'Save' : 'Add Custody'}
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
      </form>
    </Box>
  );
};

export default AddCustodyForm;
