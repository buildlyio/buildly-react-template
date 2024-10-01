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
import DatePickerComponent from '@components/DatePicker/DatePicker';
import Loader from '@components/Loader/Loader';
import MapComponent from '@components/MapComponent/MapComponent';
import FormModal from '@components/Modal/FormModal';
import { getUser } from '@context/User.context';
import { useInput } from '@hooks/useInput';
import { validators } from '@utils/validators';
import { isMobile, isDesktop } from '@utils/mediaQuery';
import { getCustodianFormattedRow, GATEWAY_STATUS } from '@utils/constants';
import { useAddGatewayMutation } from '@react-query/mutations/sensorGateways/addGatewayMutation';
import { useEditGatewayMutation } from '@react-query/mutations/sensorGateways/editGatewayMutation';
import useAlert from '@hooks/useAlert';
import { useStore } from '@zustand/timezone/timezoneStore';
import '../GatewayStyles.css';

const AddGateway = ({
  history,
  location,
  viewOnly,
}) => {
  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);

  const { displayAlert } = useAlert();
  const { data } = useStore();

  const redirectTo = location.state && location.state.from;
  const {
    gatewayTypesData, unitData, custodianData, contactInfo,
  } = location.state || {};

  const editPage = location.state && location.state.type === 'edit';
  const editData = (location.state && location.state.type === 'edit' && location.state.data) || {};

  const gateway_name = useInput(editData.name || '', {
    required: true,
  });
  const gateway_type = useInput(editData.gateway_type || '', {
    required: true,
  });
  const gateway_status = useInput(editData.gateway_status || '', {
    required: true,
  });
  const [activation_date, handleDateChange] = useState(
    editData.activation_date || moment(),
  );
  const sim_card_id = useInput(editData.sim_card_id || '');
  const battery_level = useInput(
    editData.last_known_battery_level || '',
  );
  const mac_address = useInput(editData.mac_address || '');
  const [custodianList, setCustodianList] = useState([]);
  const [custodian_uuid, setcustodian_uuid] = useState(
    (editData && editData.custodian_uuid) || '',
  );
  const [last_known_location, setLastLocation] = useState(
    (editData
      && editData.last_known_location
      && editData.last_known_location[0])
    || '',
  );

  const [formError, setFormError] = useState({});

  const buttonText = editPage ? 'Save' : 'Add Tracker';
  const formTitle = editPage ? 'Edit Tracker' : 'Add Tracker';

  const organization = getUser().organization.organization_uuid;

  useEffect(() => {
    if (!_.isEmpty(custodianData) && contactInfo) {
      setCustodianList(getCustodianFormattedRow(
        custodianData,
        contactInfo,
      ));
    }
  }, [custodianData, contactInfo]);

  const closeFormModal = () => {
    const dataHasChanged = (
      gateway_name.hasChanged()
      || gateway_type.hasChanged()
      || sim_card_id.hasChanged()
      || battery_level.hasChanged()
      || mac_address.hasChanged()
      || gateway_status.hasChanged()
      || (moment(activation_date).format('l') !== (moment(editData.activation_date || moment()).format('l')))
      || (last_known_location !== ((editData.last_known_location && editData.last_known_location[0]) || 'null, null'))
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

  const { mutate: addGatewayMutation, isLoading: isAddingGateway } = useAddGatewayMutation(organization, history, redirectTo, displayAlert);

  const { mutate: editGatewayMutation, isLoading: isEditingGateway } = useEditGatewayMutation(organization, history, redirectTo, displayAlert);

  const handleSubmit = (event) => {
    event.preventDefault();
    const gatewayFormValues = {
      name: gateway_name.value,
      sensors: '',
      sim_card_id: sim_card_id.value,
      gateway_type: gateway_type.value,
      shipment_ids: [],
      activation_date,
      last_known_battery_level: battery_level.value,
      ...(editPage && editData && { id: editData.id }),
      mac_address: mac_address.value,
      custodian_uuid: custodian_uuid || null,
      last_known_location: [
        last_known_location === '' ? 'null, null' : last_known_location,
      ],
      gateway_status: gateway_status.value,
      organization_uuid: organization,
    };
    if (editPage) {
      editGatewayMutation(gatewayFormValues);
    } else {
      addGatewayMutation(gatewayFormValues);
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
    if (!gateway_type.value || !gateway_name.value) {
      return true;
    }
    if (!_.isEmpty(editData.shipment_ids)) {
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

  const onInputChange = (e) => {
    const { value } = e.target;
    if (value) {
      setcustodian_uuid(value);
      if (custodianList.length > 0) {
        let selectedCustodian = '';
        _.forEach(custodianList, (list) => {
          if (list.uuid === value) {
            selectedCustodian = list;
          }
        });
      }
    } else {
      setcustodian_uuid(value);
    }
  };

  const setLastKnownLocation = (value) => {
    setLastLocation(value);
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
          {(isAddingGateway || isEditingGateway) && (
            <Loader open={isAddingGateway || isEditingGateway} />
          )}
          <form className="gatewayFormContainer" noValidate onSubmit={handleSubmit}>
            <Grid container spacing={isDesktop() ? 2 : 0}>
              <Grid className="gatewayInputWithTooltip" item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="gateway_name"
                  required
                  disabled={!!editData}
                  label="Tracker Name"
                  name="gateway_name"
                  autoComplete="gateway_name"
                  error={formError.gateway_name && formError.gateway_name.error}
                  helperText={formError.gateway_name ? formError.gateway_name.message : ''}
                  onBlur={(e) => handleBlur(e, 'required', gateway_name)}
                  {...gateway_name.bind}
                />
              </Grid>
            </Grid>
            <Card variant="outlined" className="gatewayCardItems">
              <CardContent>
                <Typography variant="h6" gutterBottom mt={1} mb={isMobile() ? 0 : 1.65}>
                  Tracker Info
                </Typography>
                <Grid container spacing={isDesktop() ? 2 : 0}>
                  <Grid className="gatewayInputWithTooltip" item xs={12} sm={6}>
                    <TextField
                      className="notranslate"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      required
                      disabled={!!editData}
                      id="gateway_type"
                      select
                      label={<span className="translate">Tracker Type</span>}
                      error={formError.gateway_type && formError.gateway_type.error}
                      helperText={formError.gateway_type ? formError.gateway_type.message : ''}
                      onBlur={(e) => handleBlur(e, 'required', gateway_type, 'gateway_type')}
                      {...gateway_type.bind}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {gatewayTypesData
                        && _.map(
                          gatewayTypesData,
                          (item, index) => (
                            <MenuItem
                              className="notranslate"
                              key={`gatewayType${index}:${item.id}`}
                              value={item.url}
                            >
                              {item.name}
                            </MenuItem>
                          ),
                        )}
                    </TextField>
                  </Grid>
                  <Grid className="gatewayInputWithTooltip" item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      required
                      id="gateway_status"
                      select
                      label="Tracker Status"
                      error={formError.gateway_status && formError.gateway_status.error}
                      helperText={formError.gateway_status ? formError.gateway_status.message : ''}
                      onBlur={(e) => handleBlur(
                        e,
                        'required',
                        gateway_status,
                        'gateway_status',
                      )}
                      {...gateway_status.bind}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {GATEWAY_STATUS
                        && _.map(
                          GATEWAY_STATUS,
                          (item, index) => (
                            <MenuItem
                              key={`gatewayStatus${index}:${item.value}`}
                              value={item.value}
                            >
                              {item.name}
                            </MenuItem>
                          ),
                        )}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePickerComponent
                      label="Activated"
                      selectedDate={
                        moment(activation_date)
                          .tz(data)
                      }
                      disabled={!!editData}
                      handleDateChange={handleDateChange}
                      dateFormat={
                        _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
                          ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
                          : ''
                      }
                    />
                  </Grid>
                  <Grid className="gatewayInputWithTooltip" item xs={12} sm={6} mt={isMobile() ? 0.75 : 0}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      disabled={!!editData}
                      id="sim_card_id"
                      label="IMEI"
                      name="sim_card_id"
                      autoComplete="sim_card_id"
                      {...sim_card_id.bind}
                    />
                  </Grid>
                  <Grid className="gatewayInputWithTooltip" item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      disabled={!!editData}
                      id="battery_level"
                      label="Battery(%)"
                      name="battery_level"
                      autoComplete="battery_level"
                      {...battery_level.bind}
                    />
                  </Grid>
                  <Grid className="gatewayInputWithTooltip" item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      disabled={!!editData}
                      id="mac_address"
                      label="Mac Address"
                      name="mac_address"
                      autoComplete="mac_address"
                      {...mac_address.bind}
                    />
                  </Grid>
                  <Grid className="gatewayInputWithTooltip" item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      id="shipper_uuid"
                      select
                      fullWidth
                      label="Shipper"
                      disabled={viewOnly}
                      error={formError.shipper_uuid && formError.shipper_uuid.error}
                      helperText={formError.shipper_uuid ? formError.shipper_uuid.message : ''}
                      onBlur={(e) => handleBlur(e, 'required', custodian_uuid, 'shipper_uuid')}
                      value={custodian_uuid}
                      onChange={onInputChange}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {custodianList
                        && _.map(
                          _.orderBy(
                            _.filter(custodianList, ['custodian_type', `${window.env.CUSTODIAN_URL}custodian_type/1/`]),
                            ['name'],
                            ['asc'],
                          ),
                          (item, index) => (
                            <MenuItem
                              key={`custodian${index}:${item.id}`}
                              value={item.custodian_uuid}
                            >
                              {item.name}
                            </MenuItem>
                          ),
                        )}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <div className="gatewayInputWithTooltip">
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        disabled={!!editData}
                        id="last_known_location"
                        label="Last Known Location"
                        name="last_known_location"
                        autoComplete="last_known_location"
                        value={last_known_location}
                      />
                    </div>
                    <MapComponent
                      isMarkerShown
                      zoom={8}
                      containerStyle={{
                        height: '200px',
                        marginTop: isMobile() ? '10px' : '30px',
                        marginBottom: '14px',
                      }}
                      markers={[
                        {
                          lat: last_known_location
                            && parseFloat(
                              last_known_location.split(',')[0],
                            ),
                          lng: last_known_location
                            && parseFloat(
                              last_known_location.split(',')[1],
                            ),
                          onMarkerDrag: setLastKnownLocation,
                          draggable: true,
                        },
                      ]}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={4} mt={-2}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className="gatewaySubmit"
                  disabled={isAddingGateway || isEditingGateway || submitDisabled()}
                >
                  {buttonText}
                </Button>
              </Grid>
              <Grid item xs={12} sm={4} mt={-2} className="gatewaySubmit2">
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
      )}
    </div>
  );
};

export default AddGateway;
