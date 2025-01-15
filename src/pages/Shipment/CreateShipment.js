/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useEffect, useState } from 'react';
import Geocode from 'react-geocode';
import _ from 'lodash';
import moment from 'moment-timezone';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  BatteryFull as BatteryFullIcon,
  Battery80 as Battery80Icon,
  Battery50 as Battery50Icon,
  BoltOutlined as ShockIcon,
  DisabledByDefault as CancelIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Close as CloseIcon,
  LightModeOutlined as LightIcon,
  LocationOn as LocationIcon,
  Opacity as HumidityIcon,
  Thermostat as TemperatureIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import ConfirmModal from '@components/Modal/ConfirmModal';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import DatePickerComponent from '@components/DatePicker/DatePicker';
import Loader from '@components/Loader/Loader';
import MapComponent from '@components/MapComponent/MapComponent';
import { getUser } from '@context/User.context';
import { useInput } from '@hooks/useInput';
import { routes } from '@routes/routesConstants';
import {
  getCustodianFormattedRow,
  getItemFormattedRow,
  getTemplateFormattedRow,
  itemColumns,
  templateColumns,
} from '@utils/constants';
import {
  ADMIN_SHIPMENT_STATUS,
  CREATE_SHIPMENT_STATUS,
  USER_SHIPMENT_STATUS,
  TIVE_GATEWAY_TIMES,
  UOM_TEMPERATURE_CHOICES,
  INCOMPLETED_SHIPMENT_STATUS,
} from '@utils/mock';
import { checkForAdmin, checkForGlobalAdmin } from '@utils/utilMethods';
import { validators } from '@utils/validators';
import { useQuery } from 'react-query';
import { getShipmentTemplatesQuery } from '@react-query/queries/shipments/getShipmentTemplatesQuery';
import { getCustodianQuery } from '@react-query/queries/custodians/getCustodianQuery';
import { getCustodianTypeQuery } from '@react-query/queries/custodians/getCustodianTypeQuery';
import { getContactQuery } from '@react-query/queries/custodians/getContactQuery';
import { getUnitQuery } from '@react-query/queries/items/getUnitQuery';
import { getItemQuery } from '@react-query/queries/items/getItemQuery';
import { getItemTypeQuery } from '@react-query/queries/items/getItemTypeQuery';
import { getGatewayQuery } from '@react-query/queries/sensorGateways/getGatewayQuery';
import { getGatewayTypeQuery } from '@react-query/queries/sensorGateways/getGatewayTypeQuery';
import { getCustodyQuery } from '@react-query/queries/custodians/getCustodyQuery';
import { useDeleteCustodyMutation } from '@react-query/mutations/custodians/deleteCustodyMutation';
import { useAddShipmentTemplateMutation } from '@react-query/mutations/shipments/addShipmentTemplateMutation';
import { useEditShipmentTemplateMutation } from '@react-query/mutations/shipments/editShipmentTemplateMutation';
import { useDeleteShipmentTemplateMutation } from '@react-query/mutations/shipments/deleteShipmentTemplateMutation';
import { useAddShipmentMutation } from '@react-query/mutations/shipments/addShipmentMutation';
import { useEditShipmentMutation } from '@react-query/mutations/shipments/editShipmentMutation';
import useAlert from '@hooks/useAlert';
import { useStore } from '@zustand/timezone/timezoneStore';
import './ShipmentStyles.css';
import { isMobile } from '@utils/mediaQuery';

const CreateShipment = ({ history, location }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  const user = getUser();
  const organization = user && user.organization;
  const organizationUuid = organization && organization.organization_uuid;
  const userLanguage = user.user_language;
  const isAdmin = checkForAdmin(user) || checkForGlobalAdmin(user);
  const mapLanguage = user.map_language;
  const mapRegion = user.map_region;

  const { displayAlert } = useAlert();
  const { data } = useStore();

  const editData = (location.state && location.state.ship) || {};
  const formTitle = location.state && location.state.ship ? 'Update Shipment' : 'Create Shipment';

  const [template, setTemplate] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [templateRows, setTemplateRows] = useState([]);
  const [saveAsName, setSaveAsName] = useState('');
  const [confirmReplace, setConfirmReplace] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showTemplateDT, setShowTemplateDT] = useState(false);

  const [confirmLeave, setConfirmLeave] = useState(false);
  const [triggerExit, setTriggerExit] = useState({ onOk: false, path: '' });

  const [originList, setOriginList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const [carrierList, setCarrierList] = useState([]);
  const [originCustodian, setOriginCustodian] = useState('');
  const [originAbb, setOriginAbb] = useState('');
  const [startingAddress, setStartingAddress] = useState('');
  const [startingLocation, setStartingLocation] = useState('');

  const [destinationCustodian, setDestinationCustodian] = useState('');
  const [destinationAbb, setDestinationAbb] = useState('');
  const [endingAddress, setEndingAddress] = useState('');
  const [endingLocation, setEndingLocation] = useState('');

  const [departureDateTime, setDepartureDateTime] = useState(
    (!_.isEmpty(editData) && editData.estimated_time_of_departure)
    || moment(),
  );
  const [arrivalDateTime, setArrivalDateTime] = useState(
    (!_.isEmpty(editData) && editData.estimated_time_of_arrival)
    || moment().add(1, 'day'),
  );
  const [actualDepartureDateTime, setActualDepartureDateTime] = useState(
    (!_.isEmpty(editData) && editData.actual_time_of_departure)
    || null,
  );
  const [actualArrivalDateTime, setActualArrivalDateTime] = useState(
    (!_.isEmpty(editData) && editData.actual_time_of_arrival)
    || null,
  );
  const status = useInput((!_.isEmpty(editData) && editData.status) || 'Planned');
  const cannotEdit = !_.isEmpty(editData) && _.includes(_.map(ADMIN_SHIPMENT_STATUS, 'value'), editData.status);

  const [items, setItems] = useState((!_.isEmpty(editData) && editData.items) || []);
  const [itemRows, setItemRows] = useState([]);

  const minExcursionTempData = !_.isEmpty(editData)
    ? _.orderBy(editData.min_excursion_temp, 'set_at', 'desc')[0].value
    : undefined;
  const maxExcursionTempData = !_.isEmpty(editData)
    ? _.orderBy(editData.max_excursion_temp, 'set_at', 'desc')[0].value
    : undefined;
  const minExcursionHumData = !_.isEmpty(editData)
    ? _.orderBy(editData.min_excursion_humidity, 'set_at', 'desc')[0].value
    : undefined;
  const maxExcursionHumData = !_.isEmpty(editData)
    ? _.orderBy(editData.max_excursion_humidity, 'set_at', 'desc')[0].value
    : undefined;
  const shockThresholdData = !_.isEmpty(editData)
    ? _.orderBy(editData.shock_threshold, 'set_at', 'desc')[0].value
    : undefined;
  const lightThresholdData = !_.isEmpty(editData)
    ? _.orderBy(editData.light_threshold, 'set_at', 'desc')[0].value
    : undefined;
  const min_excursion_temp = useInput(
    minExcursionTempData !== undefined && minExcursionTempData !== null
      ? minExcursionTempData
      : organization && organization.default_min_temperature !== undefined && organization.default_min_temperature !== null
        ? organization.default_min_temperature
        : 0,
  );
  const max_excursion_temp = useInput(
    maxExcursionTempData !== undefined && maxExcursionTempData !== null
      ? maxExcursionTempData
      : organization && organization.default_max_temperature !== undefined && organization.default_max_temperature !== null
        ? organization.default_max_temperature
        : 100,
  );
  const min_excursion_humidity = useInput(
    minExcursionHumData !== undefined && minExcursionHumData !== null
      ? minExcursionHumData
      : organization && organization.default_min_humidity !== undefined && organization.default_min_humidity !== null
        ? organization.default_min_humidity
        : 0,
  );
  const max_excursion_humidity = useInput(
    maxExcursionHumData !== undefined && maxExcursionHumData !== null
      ? maxExcursionHumData
      : organization && organization.default_max_humidity !== undefined && organization.default_max_humidity !== null
        ? organization.default_max_humidity
        : 100,
  );
  const shock_threshold = useInput(
    shockThresholdData !== undefined && shockThresholdData !== null
      ? shockThresholdData
      : organization && organization.default_shock !== undefined && organization.default_shock !== null
        ? organization.default_shock
        : 4,
  );
  const light_threshold = useInput(
    lightThresholdData !== undefined && lightThresholdData !== null
      ? lightThresholdData
      : organization && organization.default_light !== undefined && organization.default_light !== null
        ? organization.default_light
        : 5,
  );

  const supressTempAlerts = useInput(
    (!_.isEmpty(editData) && !_.includes(editData.alerts_to_suppress, 'temperature'))
    || (_.isEmpty(editData) && template && !_.includes(template.alerts_to_suppress, 'temperature'))
    || (_.isEmpty(editData) && organization && !_.includes(organization.alerts_to_suppress, 'temperature')),
  );
  const supressHumidityAlerts = useInput(
    (!_.isEmpty(editData) && !_.includes(editData.alerts_to_suppress, 'humidity'))
    || (_.isEmpty(editData) && template && !_.includes(template.alerts_to_suppress, 'humidity'))
    || (_.isEmpty(editData) && organization && !_.includes(organization.alerts_to_suppress, 'humidity')),
  );
  const supressShockAlerts = useInput(
    (!_.isEmpty(editData) && !_.includes(editData.alerts_to_suppress, 'shock'))
    || (_.isEmpty(editData) && template && !_.includes(template.alerts_to_suppress, 'shock'))
    || (_.isEmpty(editData) && organization && !_.includes(organization.alerts_to_suppress, 'shock')),
  );
  const supressLightAlerts = useInput(
    (!_.isEmpty(editData) && !_.includes(editData.alerts_to_suppress, 'light'))
    || (_.isEmpty(editData) && template && !_.includes(template.alerts_to_suppress, 'light'))
    || (_.isEmpty(editData) && organization && !_.includes(organization.alerts_to_suppress, 'light')),
  );

  const shipmentName = useInput((!_.isEmpty(editData) && editData.order_number) || '');
  const purchaseOrderNumber = useInput((!_.isEmpty(editData) && editData.purchase_order_number) || '');
  const billOfLading = useInput((!_.isEmpty(editData) && editData.bill_of_lading) || '');
  const [files, setFiles] = useState([]);
  const [attachedFiles, setAttachedFiles] = useState(
    (!_.isEmpty(editData) && editData.uploaded_pdf) || [],
  );
  const [showNote, setShowNote] = useState(!_.isEmpty(editData) && !!editData.note);
  const [showAddCustodian, setShowAddCustodian] = useState(false);
  const note = useInput((!_.isEmpty(editData) && editData.note) || '');
  const [additionalCustodians, setAdditionalCustodians] = useState([]);

  const gatewayType = useInput((!_.isEmpty(editData) && editData.platform_name) || 'Tive');
  const [availableGateways, setAvailableGateways] = useState([]);
  const gateway = useInput('');
  const transmissionInterval = useInput(
    (!_.isEmpty(editData) && editData.transmission_time)
    || (organization && organization.default_transmission_interval)
    || 20,
  );
  const measurementInterval = useInput(
    (!_.isEmpty(editData) && editData.measurement_time)
    || (organization && organization.default_measurement_interval)
    || 20,
  );

  const [formError, setFormError] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  let formEdited = false;

  const uncheckedIcon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const { data: shipmentTemplateData, isLoading: isLoadingShipmentTemplates } = useQuery(
    ['shipmentTemplates', organizationUuid],
    () => getShipmentTemplatesQuery(organizationUuid, displayAlert),
    { enabled: !_.isEmpty(organizationUuid), refetchOnWindowFocus: false },
  );

  const { data: custodianData, isLoading: isLoadingCustodians } = useQuery(
    ['custodians', organizationUuid],
    () => getCustodianQuery(organizationUuid, displayAlert),
    { enabled: !_.isEmpty(organizationUuid), refetchOnWindowFocus: false },
  );

  const { data: custodianTypesData, isLoading: isLoadingCustodianTypes } = useQuery(
    ['custodianTypes'],
    () => getCustodianTypeQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: contactInfo, isLoading: isLoadingContact } = useQuery(
    ['contact', organizationUuid],
    () => getContactQuery(organizationUuid, displayAlert),
    { enabled: !_.isEmpty(organizationUuid), refetchOnWindowFocus: false },
  );

  const { data: unitData, isLoading: isLoadingUnits } = useQuery(
    ['unit', organizationUuid],
    () => getUnitQuery(organizationUuid, displayAlert),
    { enabled: !_.isEmpty(organizationUuid), refetchOnWindowFocus: false },
  );

  const { data: itemData, isLoading: isLoadingItems } = useQuery(
    ['items', organizationUuid],
    () => getItemQuery(organizationUuid, displayAlert),
    { enabled: !_.isEmpty(organizationUuid), refetchOnWindowFocus: false },
  );

  const { data: itemTypesData, isLoading: isLoadingItemTypes } = useQuery(
    ['itemTypes', organizationUuid],
    () => getItemTypeQuery(organizationUuid, displayAlert),
    { enabled: !_.isEmpty(organizationUuid), refetchOnWindowFocus: false },
  );

  const { data: gatewayData, isLoading: isLoadingGateways } = useQuery(
    ['gateways', organizationUuid],
    () => getGatewayQuery(organizationUuid, displayAlert, null),
    { enabled: !_.isEmpty(organizationUuid), refetchOnWindowFocus: false },
  );

  const { data: gatewayTypesData, isLoading: isLoadingGatewayTypes } = useQuery(
    ['gatewayTypes'],
    () => getGatewayTypeQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: custodyData, isLoading: isLoadingCustodies } = useQuery(
    ['custodies'],
    () => getCustodyQuery(encodeURIComponent(editData.shipment_uuid), displayAlert),
    { enabled: !_.isEmpty(editData), refetchOnWindowFocus: false },
  );

  const { mutate: deleteCustodyMutation, isLoading: isDeletingCustody } = useDeleteCustodyMutation(displayAlert);

  const { mutate: addShipmentTemplateMutation, isLoading: isAddingShipmentTemplate } = useAddShipmentTemplateMutation(organizationUuid, displayAlert);

  const { mutate: editShipmentTemplateMutation, isLoading: isEditingShipmentTemplate } = useEditShipmentTemplateMutation(organizationUuid, displayAlert);

  const { mutate: deleteShipmentTemplateMutation, isLoading: isDeletingShipmentTemplate } = useDeleteShipmentTemplateMutation(organizationUuid, displayAlert);

  const { mutate: addShipmentMutation, isLoading: isAddingShipment } = useAddShipmentMutation(organizationUuid, history, routes.SHIPMENT, displayAlert);

  const { mutate: editShipmentMutation, isLoading: isEditingShipment } = useEditShipmentMutation(organizationUuid, history, routes.SHIPMENT, displayAlert);

  useEffect(() => {
    if (!_.isEmpty(editData)) {
      const origin = _.find(originList, { name: editData.origin });
      const destination = _.find(destinationList, { name: editData.destination });
      const carriers = _.map(editData.carriers, (carrier) => (
        _.find(carrierList, { name: carrier }) || carrier
      ));

      // Set origin and destination custodians
      if (origin) {
        setOriginCustodian(origin.url);
        setOriginAbb(getAbbreviation(origin.abbrevation));
        setStartingAddress(origin.location);
        getLatLong(origin.location, 'start');
      }

      if (destination) {
        setDestinationCustodian(destination.url);
        setDestinationAbb(getAbbreviation(destination.abbrevation));
        setEndingAddress(destination.location);
        getLatLong(destination.location, 'end');
      }

      if (carriers) {
        setAdditionalCustodians(carriers);
      }

      if (!_.isEmpty(editData.gateway_imei)) {
        const gateways = _.filter(gatewayData, {
          imei_number: _.toNumber(editData.gateway_imei[0]),
        });
        gateway.setValue(_.find(gateways, {
          imei_number: _.toNumber(editData.gateway_imei[0]),
        }));
        setAvailableGateways(gateways);
      }
    }
  }, [editData, originList, destinationList, carrierList, gatewayTypesData, gatewayData]);

  useEffect(() => {
    if (!_.isEmpty(custodianData) && !_.isEmpty(contactInfo)) {
      const custodianList = getCustodianFormattedRow(custodianData, contactInfo, custodianTypesData);
      setOriginList(_.filter(custodianList, (cl) => _.isEqual(_.toLower(cl.type), 'shipper')));
      setDestinationList(_.filter(custodianList, (cl) => _.includes(['receiver', 'warehouse'], _.toLower(cl.type))));
      setCarrierList(_.filter(custodianList, (cl) => !_.includes(['shipper', 'receiver', 'warehouse'], _.toLower(cl.type))));
    }
  }, [custodianData, contactInfo, custodianTypesData]);

  useEffect(() => {
    if (!_.isEmpty(itemData)) {
      let selectedRows = [];
      _.forEach(itemData, (item) => {
        if (_.includes(items, item.url)) {
          selectedRows = [...selectedRows, item];
        }
      });

      const rows = getItemFormattedRow(selectedRows, itemTypesData, unitData);
      setItemRows(rows);
    }
  }, [itemData, itemTypesData, unitData, items]);

  useEffect(() => {
    const custodian = _.find(custodianData, { url: originCustodian });
    const gt = _.find(gatewayTypesData, { name: gatewayType.value });

    if (custodian && gt) {
      const gateways = !_.isEmpty(editData) && !_.isEmpty(editData.gateway_imei)
        ? _.filter(gatewayData, {
          imei_number: _.toNumber(editData.gateway_imei[0]),
        })
        : _.filter(gatewayData, {
          custodian_uuid: custodian.custodian_uuid,
          gateway_type: gt.url,
          gateway_status: 'available',
        });
      setAvailableGateways(gateways);
    }
  }, [gatewayData, gatewayType.value, originCustodian]);

  useEffect(() => {
    if (saveAsName) {
      handleTemplateChange(_.find(shipmentTemplateData, { name: saveAsName }) || '');
    } else if (template) {
      handleTemplateChange(_.find(shipmentTemplateData, { id: template.id }) || '');
    }
  }, [shipmentTemplateData]);

  useEffect(() => {
    setTemplateRows(getTemplateFormattedRow(shipmentTemplateData, custodianData, itemData));
  }, [shipmentTemplateData, custodianData, itemData]);

  formEdited = (
    !!(_.isEmpty(editData) && (
      originCustodian || destinationCustodian || !_.isEmpty(items) || shipmentName.value
    )) || !!(!_.isEmpty(editData) && (
      !_.isEqual(
        moment(editData.estimated_time_of_departure).toISOString(),
        moment(departureDateTime).toISOString(),
      ) || !_.isEqual(
        moment(editData.estimated_time_of_arrival).toISOString(),
        moment(arrivalDateTime).toISOString(),
      ) || status.hasChanged()
      || !_.isEqual(editData.items, items)
      || min_excursion_temp.hasChanged()
      || max_excursion_temp.hasChanged()
      || min_excursion_humidity.hasChanged()
      || max_excursion_humidity.hasChanged()
      || shock_threshold.hasChanged()
      || light_threshold.hasChanged()
      || supressTempAlerts.hasChanged()
      || supressHumidityAlerts.hasChanged()
      || supressShockAlerts.hasChanged()
      || supressLightAlerts.hasChanged()
      || shipmentName.hasChanged()
      || purchaseOrderNumber.hasChanged()
      || billOfLading.hasChanged()
      || !_.isEmpty(files)
      || note.hasChanged()
      || !_.isEqual(additionalCustodians, _.map(editData.carriers, (carrier) => (
        _.find(carrierList, { name: carrier }) || carrier
      )))
      || gatewayType.hasChanged()
      || !_.isEqual(editData.transmission_time, transmissionInterval.value)
      || !_.isEqual(editData.measurement_time, measurementInterval.value)
      || (
        _.find(originList, { name: editData.origin })
        && !_.isEqual(originCustodian, _.find(originList, { name: editData.origin }).url)
      ) || (
        _.find(destinationList, { name: editData.destination })
        && !_.isEqual(destinationCustodian, _.find(destinationList, {
          name: editData.destination,
        }).url)
      ) || (editData.uploaded_pdf && !_.isEqual(attachedFiles, editData.uploaded_pdf))
    ))
  );

  const handleGoToIntendedPage = useCallback(
    (loc) => history.push(loc),
    [history],
  );

  useEffect(() => {
    if (triggerExit.onOk) {
      handleGoToIntendedPage(triggerExit.path);
    }

    const unblock = history.block((loc) => {
      let trgObj = { ...triggerExit, path: loc.pathname };
      if ((loc.pathname !== routes.CREATE_SHIPMENT) && formEdited && !formSubmitted) {
        setConfirmLeave(true);
      } else {
        trgObj = { ...trgObj, onOk: true };
      }

      setTriggerExit(trgObj);
      if (triggerExit.onOk) {
        return true;
      }
      return false;
    });

    return () => {
      unblock();
    };
  }, [handleGoToIntendedPage, history, triggerExit.onOk, triggerExit.path,
    formEdited, formSubmitted]);

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

  const getAbbreviation = (name) => name.replace(/[^A-Z0-9]/g, '');

  const getLatLong = (address, position) => {
    Geocode.setApiKey(window.env.GEO_CODE_API);
    Geocode.setLanguage('en');
    Geocode.fromAddress(address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        switch (position) {
          case 'start':
            setStartingLocation(`${lat},${lng}`);
            break;
          case 'end':
            setEndingLocation(`${lat},${lng}`);
            break;
          default:
            break;
        }
      },
      (error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      },
    );
  };

  const onInputChange = (value, type, custody) => {
    switch (type) {
      case 'custodian':
        if (value) {
          let selectedCustodian = '';
          if (custody === 'start') {
            selectedCustodian = _.find(originList, { url: value });
            setOriginCustodian(value);
            setOriginAbb(getAbbreviation(selectedCustodian.abbrevation));
            setStartingAddress(selectedCustodian.location);
            getLatLong(selectedCustodian.location, 'start');
          } else if (custody === 'end') {
            selectedCustodian = _.find(destinationList, { url: value });
            setDestinationCustodian(value);
            setDestinationAbb(getAbbreviation(selectedCustodian.abbrevation));
            setEndingAddress(selectedCustodian.location);
            getLatLong(selectedCustodian.location, 'end');
          }
        }
        break;

      case 'item':
        if (_.size(value) > _.size(items)) {
          setItems([...items, _.last(value).url]);
        } else {
          setItems(value);
        }
        break;

      default:
        break;
    }
  };

  const saveTemplateDisabled = () => (
    (!!template
      && originCustodian === template.origin_custodian
      && destinationCustodian === template.destination_custodian
      && _.isEqual(items, template.items)
      && status.value === template.status
      && min_excursion_temp.value === template.min_excursion_temp
      && max_excursion_temp.value === template.max_excursion_temp
      && min_excursion_humidity.value === template.min_excursion_humidity
      && max_excursion_humidity.value === template.max_excursion_humidity
      && shock_threshold.value === template.shock_threshold
      && light_threshold.value === template.light_threshold
      && supressTempAlerts.value === !_.includes(template.alerts_to_suppress, 'temperature')
      && supressHumidityAlerts.value === !_.includes(template.alerts_to_suppress, 'humidity')
      && supressShockAlerts.value === !_.includes(template.alerts_to_suppress, 'shock')
      && supressLightAlerts.value === !_.includes(template.alerts_to_suppress, 'light')
    ) || (!template && (!originCustodian || !destinationCustodian || _.isEmpty(items)))
  );

  const handleTemplateChange = (value) => {
    if (!_.isEqual(value, 'all')) {
      setTemplate(value);
      setTemplateName('');
      if (value) {
        const oCustodian = _.find(originList, { url: value.origin_custodian });
        const dCustodian = _.find(destinationList, { url: value.destination_custodian });

        onInputChange(value.origin_custodian, 'custodian', 'start');
        onInputChange(value.destination_custodian, 'custodian', 'end');
        setItems(value.items);
        status.setValue(value.status);
        min_excursion_temp.setValue(value.min_excursion_temp);
        max_excursion_temp.setValue(value.max_excursion_temp);
        min_excursion_humidity.setValue(value.min_excursion_humidity);
        max_excursion_humidity.setValue(value.max_excursion_humidity);
        shock_threshold.setValue(value.shock_threshold);
        light_threshold.setValue(value.light_threshold);
        supressTempAlerts.setValue(!_.includes(value.alerts_to_suppress, 'temperature'));
        supressHumidityAlerts.setValue(!_.includes(value.alerts_to_suppress, 'humidity'));
        supressShockAlerts.setValue(!_.includes(value.alerts_to_suppress, 'shock'));
        supressLightAlerts.setValue(!_.includes(value.alerts_to_suppress, 'light'));
      }
    } else {
      setSaveAsName('');
      setShowTemplateDT(true);
    }
  };

  const saveAsTemplate = () => {
    const tmplt = _.find(shipmentTemplateData, { name: saveAsName }) || {};
    const templateFormValue = {
      ...tmplt,
      name: saveAsName,
      origin_custodian: originCustodian,
      destination_custodian: destinationCustodian,
      items,
      status: status.value,
      max_excursion_temp: parseInt(max_excursion_temp.value, 10),
      min_excursion_temp: parseInt(min_excursion_temp.value, 10),
      max_excursion_humidity: parseInt(max_excursion_humidity.value, 10),
      min_excursion_humidity: parseInt(min_excursion_humidity.value, 10),
      shock_threshold: shock_threshold.value,
      light_threshold: light_threshold.value,
      alerts_to_suppress: _.without([
        !supressTempAlerts.value ? 'temperature' : '',
        !supressHumidityAlerts.value ? 'humidity' : '',
        !supressShockAlerts.value ? 'shock' : '',
        !supressLightAlerts.value ? 'light' : '',
      ], ''),
      organization_uuid: organizationUuid,
    };
    if (_.isEmpty(tmplt)) {
      addShipmentTemplateMutation(templateFormValue);
      setShowTemplateDT(false);
    } else {
      setConfirmReplace(true);
    }
  };

  const saveTemplateName = () => {
    const exists = _.find(shipmentTemplateData, { name: templateName });
    if (exists) {
      setConfirmReplace(true);
    } else {
      const tmp = { ...template, name: templateName };
      editShipmentTemplateMutation(tmp);
      setTemplateName('');
      setTemplate(tmp);
    }
  };

  const replaceTemplate = () => {
    const tmplt = (templateName && _.find(shipmentTemplateData, { name: templateName }))
      || (saveAsName && _.find(shipmentTemplateData, { name: saveAsName }))
      || {};
    const newTemplate = {
      ...tmplt,
      name: templateName || saveAsName,
      origin_custodian: originCustodian,
      destination_custodian: destinationCustodian,
      items,
      status: status.value,
      max_excursion_temp: parseInt(max_excursion_temp.value, 10),
      min_excursion_temp: parseInt(min_excursion_temp.value, 10),
      max_excursion_humidity: parseInt(max_excursion_humidity.value, 10),
      min_excursion_humidity: parseInt(min_excursion_humidity.value, 10),
      shock_threshold: shock_threshold.value,
      light_threshold: light_threshold.value,
      alerts_to_suppress: _.without([
        !supressTempAlerts.value ? 'temperature' : '',
        !supressHumidityAlerts.value ? 'humidity' : '',
        !supressShockAlerts.value ? 'shock' : '',
        !supressLightAlerts.value ? 'light' : '',
      ], ''),
      organization_uuid: organizationUuid,
    };

    if (template && (
      !_.isEqual(template.name, templateName) && !_.isEqual(template.name, saveAsName)
    )) {
      deleteShipmentTemplateMutation(template.id);
    }
    editShipmentTemplateMutation(newTemplate);
    setConfirmReplace(false);
    setTemplateName('');
    setTemplate(newTemplate);
    if (saveAsName) {
      setSaveAsName('');
      setShowTemplateDT(false);
    }
  };

  const fileChange = (event) => {
    const maxAllowedSize = 2 * 1024 * 1024;
    let error = false;

    _.forEach(event.target.files, (attachedFile) => {
      if (attachedFile) {
        switch (true) {
          case (attachedFile.type !== 'application/pdf'):
            error = error || true;
            // eslint-disable-next-line no-alert
            alert('Only PDF files are allowed for upload.');
            break;

          case (attachedFile.size > maxAllowedSize):
            error = error || true;
            // eslint-disable-next-line no-alert
            alert('File size is more that 2MB. Please upload another file.');
            break;

          default:
            break;
        }
      }
    });
    if (!error) {
      setFiles([...files, ...event.target.files]);
    }
  };

  const submitDisabled = () => (
    (_.isEmpty(editData) && (
      !originCustodian
      || !destinationCustodian
      || _.isEmpty(items)
      || !shipmentName.value
    )) || (!_.isEmpty(editData) && (
      _.isEqual(editData.estimated_time_of_departure, departureDateTime)
      && _.isEqual(editData.estimated_time_of_arrival, arrivalDateTime)
      && !status.hasChanged()
      && _.isEqual(editData.items, items)
      && !min_excursion_temp.hasChanged()
      && !max_excursion_temp.hasChanged()
      && !min_excursion_humidity.hasChanged()
      && !max_excursion_humidity.hasChanged()
      && !shock_threshold.hasChanged()
      && !light_threshold.hasChanged()
      && !supressTempAlerts.hasChanged()
      && !supressHumidityAlerts.hasChanged()
      && !supressShockAlerts.hasChanged()
      && !supressLightAlerts.hasChanged()
      && !shipmentName.hasChanged()
      && !purchaseOrderNumber.hasChanged()
      && !billOfLading.hasChanged()
      && _.isEmpty(files)
      && !note.hasChanged()
      && _.isEqual(additionalCustodians, _.map(editData.carriers, (carrier) => (
        _.find(carrierList, { name: carrier }) || carrier
      )))
      && _.isEqual(editData.transmission_time, transmissionInterval.value)
      && _.isEqual(editData.measurement_time, measurementInterval.value)
      && (!_.isEmpty(editData.gateway_imei)
        || (_.isEmpty(editData.gateway_imei) && (!gateway.value || !gatewayType.value))
      ) && (
        _.find(originList, { name: editData.origin })
        && _.isEqual(originCustodian, _.find(originList, { name: editData.origin }).url)
      ) && (
        _.find(destinationList, { name: editData.destination })
        && _.isEqual(destinationCustodian, _.find(destinationList, {
          name: editData.destination,
        }).url)
      ) && _.isEqual(attachedFiles, editData.uploaded_pdf)
    ))
  );

  const handleSubmit = (event, draft) => {
    event.preventDefault();
    const shipName = `${organization.abbrevation}-${shipmentName.value}-${originAbb}-${destinationAbb}`;
    const UOMDISTANCE = _.find(unitData, (unit) => (
      _.toLower(unit.unit_of_measure_for) === 'distance'
    ));
    const uom_distance = UOMDISTANCE ? UOMDISTANCE.unit_of_measure : '';
    const startCustody = (
      !_.isEmpty(editData) && _.find(custodyData, (custody) => custody.first_custody)
    ) || {};
    const endCustody = (
      !_.isEmpty(editData) && _.find(custodyData, (custody) => custody.last_custody)
    ) || {};
    const updateGateway = gateway.value;
    const setAt = moment().valueOf();

    const shipmentFormValue = {
      ...editData,
      name: shipName,
      purchase_order_number: purchaseOrderNumber.value,
      order_number: shipmentName.value,
      status: status.value,
      estimated_time_of_arrival: arrivalDateTime,
      estimated_time_of_departure: departureDateTime,
      items,
      organization_uuid: organizationUuid,
      platform_name: gatewayType.value,
      max_excursion_temp: [
        { value: parseInt(max_excursion_temp.value, 10), set_at: setAt },
      ],
      min_excursion_temp: [
        { value: parseInt(min_excursion_temp.value, 10), set_at: setAt },
      ],
      max_excursion_humidity: [
        { value: parseInt(max_excursion_humidity.value, 10), set_at: setAt },
      ],
      min_excursion_humidity: [
        { value: parseInt(min_excursion_humidity.value, 10), set_at: setAt },
      ],
      shock_threshold: [
        { value: parseInt(shock_threshold.value, 10), set_at: setAt },
      ],
      light_threshold: [
        { value: parseInt(light_threshold.value, 10), set_at: setAt },
      ],
      alerts_to_suppress: _.without([
        !supressTempAlerts.value ? 'temperature' : '',
        !supressHumidityAlerts.value ? 'humidity' : '',
        !supressShockAlerts.value ? 'shock' : '',
        !supressLightAlerts.value ? 'light' : '',
      ], ''),
      note: note.value,
      transmission_time: parseInt(transmissionInterval.value, 10),
      measurement_time: parseInt(measurementInterval.value, 10),
      start_location: startingLocation,
      end_location: endingLocation,
    };
    const startCustodyForm = {
      ...startCustody,
      custodian: [originCustodian],
      location: startingLocation,
      has_current_custody: true,
      first_custody: true,
      last_custody: false,
      radius: organization.radius || 10,
      shipment_name: shipName,
      load_id: '1',
      unit_of_measure: uom_distance,
    };
    const endCustodyForm = {
      ...endCustody,
      custodian: [destinationCustodian],
      location: endingLocation,
      has_current_custody: false,
      first_custody: false,
      last_custody: true,
      radius: organization.radius || 10,
      shipment_name: shipName,
      load_id: `${_.size(additionalCustodians) + 2}`,
      unit_of_measure: uom_distance,
    };
    const carriers = _.map(additionalCustodians, (addCust, index) => ({
      ...((
        !_.isEmpty(editData) && _.find(_.filter(custodyData, { first_custody: false, last_custody: false }), { load_id: `${index + 2}` })
      ) || {}),
      custodian: [addCust.url],
      location: addCust.location,
      has_current_custody: false,
      first_custody: false,
      last_custody: false,
      radius: organization.radius || 10,
      shipment_name: shipName,
      load_id: `${index + 2}`,
      unit_of_measure: uom_distance,
    }));

    if (_.size(editData.carriers) > _.size(additionalCustodians)) {
      const carrierCustodies = _.without(_.map(carriers, 'custody_uuid'), ['', null, undefined]);
      const removeCustodies = _.filter(custodyData, (cust) => (
        !_.includes(carrierCustodies, cust.custody_uuid)
        && !cust.first_custody && !cust.last_custody
      ));
      _.forEach(removeCustodies, (cust) => deleteCustodyMutation(cust.id));
    }

    let savePayload = {
      shipment: shipmentFormValue,
      start_custody: startCustodyForm,
      end_custody: endCustodyForm,
      files,
      carriers,
      fujitsuVerification: organization.enable_fujitsu_verification,
      isWarehouse: !!(_.find(destinationList, { url: destinationCustodian }) && (_.toLower(_.find(destinationList, { url: destinationCustodian }).type) === 'warehouse')),
    };

    if (!draft && (
      (_.isEqual('available', updateGateway.gateway_status) && (!updateGateway.shipment_ids || _.isEqual([], updateGateway.shipment_ids)))
      || status.hasChanged()
      || _.includes(_.map(ADMIN_SHIPMENT_STATUS, 'value'), status.value)
    )) {
      savePayload = { ...savePayload, updateGateway };
    }

    if (!_.isEqual(editData.uploaded_pdf, attachedFiles)) {
      let pdfs = [];
      let links = [];
      let deleteFiles = [];

      _.forEach(editData.uploaded_pdf, (f, index) => {
        const found = _.includes(attachedFiles, f);
        if (found) {
          pdfs = [...pdfs, f];
          links = [...links, editData.uploaded_pdf_link[index]];
        } else {
          deleteFiles = [...deleteFiles, f];
        }
      });

      savePayload = {
        ...savePayload,
        shipment: {
          ...shipmentFormValue,
          uploaded_pdf: pdfs,
          uploaded_pdf_link: links,
        },
        deleteFiles,
      };
    }

    setFormSubmitted(true);

    if (_.isEmpty(editData)) {
      addShipmentMutation(savePayload);
    } else {
      savePayload = {
        ...savePayload,
        shipment: {
          ...savePayload.shipment,
          min_excursion_temp: min_excursion_temp.hasChanged() ? [...editData.min_excursion_temp, ...savePayload.shipment.min_excursion_temp] : editData.min_excursion_temp,
          max_excursion_temp: max_excursion_temp.hasChanged() ? [...editData.max_excursion_temp, ...savePayload.shipment.max_excursion_temp] : editData.max_excursion_temp,
          min_excursion_humidity: min_excursion_humidity.hasChanged() ? [...editData.min_excursion_humidity, ...savePayload.shipment.min_excursion_humidity] : editData.min_excursion_humidity,
          max_excursion_humidity: max_excursion_humidity.hasChanged() ? [...editData.max_excursion_humidity, ...savePayload.shipment.max_excursion_humidity] : editData.max_excursion_humidity,
          shock_threshold: shock_threshold.hasChanged() ? [...editData.shock_threshold, ...savePayload.shipment.shock_threshold] : editData.shock_threshold,
          light_threshold: light_threshold.hasChanged() ? [...editData.light_threshold, ...savePayload.shipment.light_threshold] : editData.light_threshold,
        },
      };
      editShipmentMutation(savePayload);
    }
  };

  return (
    <Box mt={5} mb={5} className="createShipmentRoot">
      {(isLoadingShipmentTemplates
        || isLoadingCustodians
        || isLoadingCustodianTypes
        || isLoadingContact
        || isLoadingUnits
        || isLoadingItems
        || isLoadingItemTypes
        || isLoadingGateways
        || isLoadingGatewayTypes
        || isLoadingCustodies
        || isAddingShipmentTemplate
        || isEditingShipmentTemplate
        || isDeletingShipmentTemplate
        || isAddingShipment
        || isEditingShipment
        || isDeletingCustody)
        && (
          <Loader open={isLoadingShipmentTemplates
            || isLoadingCustodians
            || isLoadingCustodianTypes
            || isLoadingContact
            || isLoadingUnits
            || isLoadingItems
            || isLoadingItemTypes
            || isLoadingGateways
            || isLoadingGatewayTypes
            || isLoadingCustodies
            || isAddingShipmentTemplate
            || isEditingShipmentTemplate
            || isDeletingShipmentTemplate
            || isAddingShipment
            || isEditingShipment
            || isDeletingCustody}
          />
        )}
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={8}>
          <Typography variant="h5">
            {formTitle}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <TextField
            className="notranslate"
            variant="outlined"
            id="template"
            select
            fullWidth
            placeholder="Select..."
            label={<span className="translate">Templates</span>}
            value={template}
            onChange={(e) => handleTemplateChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            SelectProps={{ displayEmpty: true }}
            disabled={cannotEdit}
          >
            <MenuItem value="">Select</MenuItem>
            {!_.isEmpty(shipmentTemplateData) && _.map(shipmentTemplateData, (tmp) => (
              <MenuItem key={tmp.template_uuid} value={tmp} className="notranslate">
                {tmp.name}
              </MenuItem>
            ))}
            <MenuItem value="all">
              <Typography style={{ color: theme.palette.primary.main, textDecoration: 'underline' }}>
                See all templates...
              </Typography>
            </MenuItem>
          </TextField>
        </Grid>
      </Grid>
      {!!template && (
        <Grid container className="createShipmentNameContainer">
          <Grid item xs={6} md={8} className="createShipmentNameHeader">
            <Typography variant="body1" fontWeight={800}>
              Template name
            </Typography>
          </Grid>
          <Grid item xs={6} md={4} className="createShipmentNameHeader">
            <Typography variant="body1" fontWeight={800}>
              Actions
            </Typography>
          </Grid>
          <Grid item xs={6} md={8} className="createShipmentNameData">
            {!templateName && (
              <Typography component="div" style={{ padding: `${theme.spacing(1)} 0` }}>
                {template.name}
              </Typography>
            )}
            {templateName && (
              <TextField
                variant="outlined"
                id="template-name"
                fullWidth
                placeholder="32 characters maximum"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                helperText="There is a 32-character limit on template names"
                inputProps={{ maxLength: 32 }}
                disabled={cannotEdit}
              />
            )}
          </Grid>
          <Grid item xs={6} md={4} className="createShipmentNameData">
            {!templateName && (
              <div>
                <IconButton
                  style={{
                    border: `1px solid ${theme.palette.primary.main}`,
                    borderRadius: theme.spacing(1),
                  }}
                  disabled={cannotEdit}
                  onClick={(e) => setTemplateName(template.name)}
                >
                  <EditIcon htmlColor={theme.palette.primary.main} />
                </IconButton>
                <IconButton
                  style={{
                    border: `1px solid ${theme.palette.primary.main}`,
                    borderRadius: theme.spacing(1),
                    marginLeft: theme.spacing(2),
                  }}
                  disabled={cannotEdit}
                  onClick={(e) => setConfirmDelete(true)}
                >
                  <DeleteIcon htmlColor={theme.palette.primary.main} />
                </IconButton>
              </div>
            )}
            {templateName && (
              <div>
                <Button
                  type="button"
                  variant="outlined"
                  disabled={cannotEdit}
                  onClick={(e) => setTemplateName('')}
                  className="createShipmentActionButtons2"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  style={{ padding: `${theme.spacing(1.75)} ${theme.spacing(5)}` }}
                  disabled={_.isEqual(template.name, templateName) || cannotEdit}
                  onClick={saveTemplateName}
                >
                  Save
                </Button>
              </div>
            )}
          </Grid>
        </Grid>
      )}
      <form className="createShipmentForm" noValidate>
        <Box mt={2}>
          <FormControl fullWidth component="fieldset" variant="outlined" className="createShipmentFieldset">
            <FormLabel component="legend" className="createShipmentLegend">
              Shipment Details
            </FormLabel>
            <Grid container spacing={isDesktop ? 4 : 0}>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <TextField
                      className="notranslate"
                      variant="outlined"
                      id="origin-custodian"
                      select
                      fullWidth
                      placeholder="Select..."
                      label={(
                        <span className="translate">Origin Custodian</span>
                      )}
                      onBlur={(e) => handleBlur(e, 'required', originCustodian, 'origin-custodian')}
                      value={originCustodian}
                      onChange={(e) => onInputChange(e.target.value, 'custodian', 'start')}
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{ displayEmpty: true }}
                      disabled={cannotEdit}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {!_.isEmpty(originList) && _.map(originList, (cust) => (
                        <MenuItem className="notranslate" key={cust.custodian_uuid} value={cust.url}>
                          {cust.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      variant="outlined"
                      id="origin-custodian-abbreviation"
                      label="ABBV."
                      disabled
                      value={originAbb}
                    />
                  </Grid>
                  <Grid item xs={1} className="createShipmentInnerAsterisk">*</Grid>
                  <Grid item xs={11}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      disabled
                      id="starting-address"
                      label="Starting Address"
                      name="starting-address"
                      autoComplete="starting-address"
                      value={startingAddress}
                      InputProps={{
                        endAdornment: <InputAdornment position="end"><LocationIcon /></InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={1} className="createShipmentInnerAsterisk">*</Grid>
                  <Grid item xs={11}>
                    <MapComponent
                      isMarkerShown
                      zoom={10}
                      containerStyle={{ height: '300px', marginTop: '10px' }}
                      markers={[
                        {
                          lat: startingLocation && _.includes(startingLocation, ',') && parseFloat(startingLocation.split(',')[0]),
                          lng: startingLocation && _.includes(startingLocation, ',') && parseFloat(startingLocation.split(',')[1]),
                          radius: (organization && organization.radius) || 0,
                        },
                      ]}
                      unitOfMeasure={unitData}
                      mapLanguage={mapLanguage}
                      mapRegion={mapRegion}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2} mt={isMobile() ? 1.5 : -2}>
                  <Grid item xs={8}>
                    <TextField
                      className="notranslate"
                      variant="outlined"
                      id="destination-custodian"
                      select
                      fullWidth
                      placeholder="Select..."
                      label={(
                        <span className="translate">Destination Custodian</span>
                      )}
                      onBlur={(e) => handleBlur(e, 'required', destinationCustodian, 'destination-custodian')}
                      value={destinationCustodian}
                      onChange={(e) => onInputChange(e.target.value, 'custodian', 'end')}
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{ displayEmpty: true }}
                      disabled={cannotEdit}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {!_.isEmpty(destinationList) && _.map(destinationList, (cust) => (
                        <MenuItem className="notranslate" key={cust.custodian_uuid} value={cust.url}>
                          {cust.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      variant="outlined"
                      id="destination-custodian-abbreviation"
                      label="ABBV."
                      disabled
                      value={destinationAbb}
                    />
                  </Grid>
                  <Grid item xs={1} className="createShipmentInnerAsterisk">*</Grid>
                  <Grid item xs={11}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      disabled
                      id="ending-address"
                      label="Ending Address"
                      name="ending-address"
                      autoComplete="ending-address"
                      value={endingAddress}
                      InputProps={{
                        endAdornment: <InputAdornment position="end"><LocationIcon /></InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={1} className="createShipmentInnerAsterisk">*</Grid>
                  <Grid item xs={11}>
                    <MapComponent
                      isMarkerShown
                      zoom={10}
                      containerStyle={{ height: '300px', marginTop: '10px' }}
                      markers={[
                        {
                          lat: endingLocation && _.includes(endingLocation, ',') && parseFloat(endingLocation.split(',')[0]),
                          lng: endingLocation && _.includes(endingLocation, ',') && parseFloat(endingLocation.split(',')[1]),
                          radius: (organization && organization.radius) || 0,
                        },
                      ]}
                      unitOfMeasure={unitData}
                      mapLanguage={mapLanguage}
                      mapRegion={mapRegion}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={11} sm={5.5} mt={isMobile() ? 1.5 : -2.5} className="createShipmentAdjustSpacing">
                <DatePickerComponent
                  label="Estimated Shipment Start"
                  selectedDate={moment(departureDateTime).tz(data)}
                  disabled={cannotEdit}
                  hasTime
                  handleDateChange={(value) => {
                    setDepartureDateTime(value);
                    setArrivalDateTime(value);
                  }}
                  dateFormat={
                    _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
                      ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
                      : ''
                  }
                  timeFormat={
                    _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
                      ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
                      : ''
                  }
                />
              </Grid>
              <Grid item xs={11} sm={5.5} mt={isMobile() ? 0 : -2.5} className={isMobile() ? 'createShipmentAdjustSpacing' : ''}>
                <DatePickerComponent
                  label="Estimated Shipment End"
                  selectedDate={moment(arrivalDateTime).tz(data)}
                  disabled={cannotEdit}
                  hasTime
                  handleDateChange={setArrivalDateTime}
                  dateFormat={
                    _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
                      ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
                      : ''
                  }
                  timeFormat={
                    _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
                      ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
                      : ''
                  }
                />
              </Grid>
              <Grid item xs={11} sm={5.5} mt={isMobile() ? 1.5 : -2.5} className="createShipmentAdjustSpacing">
                {actualDepartureDateTime && (
                  <DatePickerComponent
                    label="Actual Shipment Start"
                    selectedDate={moment(actualDepartureDateTime).tz(data)}
                    disabled
                    hasTime
                    dateFormat={
                      _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
                        ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
                        : ''
                    }
                    timeFormat={
                      _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
                        ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
                        : ''
                    }
                  />
                )}
              </Grid>
              <Grid item xs={11} sm={5.5} mt={isMobile() ? 0 : -2.5} className={isMobile() ? 'createShipmentAdjustSpacing' : ''}>
                {actualArrivalDateTime && (
                  <DatePickerComponent
                    label="Actual Shipment Arrival"
                    selectedDate={moment(actualArrivalDateTime).tz(data)}
                    disabled
                    hasTime
                    dateFormat={
                      _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
                        ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
                        : ''
                    }
                    timeFormat={
                      _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
                        ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
                        : ''
                    }
                  />
                )}
              </Grid>
              <Grid item xs={11} sm={5.5} mt={isMobile() ? 2 : 0}>
                <TextField
                  className={_.lowerCase(userLanguage) !== 'english' ? 'translate' : 'notranslate'}
                  variant="outlined"
                  id="status"
                  select
                  fullWidth
                  placeholder="Select..."
                  label={(
                    <span className="translate">Shipment Status</span>
                  )}
                  onBlur={(e) => handleBlur(e, 'required', status, 'status')}
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{ displayEmpty: true }}
                  {...status.bind}
                  disabled={cannotEdit && !isAdmin}
                >
                  <MenuItem value="">Select</MenuItem>
                  {_.isEmpty(editData) && _.map(CREATE_SHIPMENT_STATUS, (st, idx) => (
                    <MenuItem className={_.lowerCase(userLanguage) !== 'english' ? 'translate' : 'notranslate'} key={`${idx}-${st.label}`} value={st.value}>
                      {st.label}
                    </MenuItem>
                  ))}
                  {!_.isEmpty(editData) && !cannotEdit && !isAdmin && _.map(USER_SHIPMENT_STATUS, (st, idx) => (
                    <MenuItem className={_.lowerCase(userLanguage) !== 'english' ? 'translate' : 'notranslate'} key={`${idx}-${st.label}`} value={st.value}>
                      {st.label}
                    </MenuItem>
                  ))}
                  {!_.isEmpty(editData) && ((cannotEdit && !isAdmin) || (!cannotEdit && isAdmin))
                    && _.map([...CREATE_SHIPMENT_STATUS, ...ADMIN_SHIPMENT_STATUS], (st, idx) => (
                      <MenuItem className={_.lowerCase(userLanguage) !== 'english' ? 'translate' : 'notranslate'} key={`${idx}-${st.label}`} value={st.value}>
                        {st.label}
                      </MenuItem>
                    ))}
                  {!_.isEmpty(editData) && cannotEdit && isAdmin && _.map([...ADMIN_SHIPMENT_STATUS], (st, idx) => (
                    <MenuItem className={_.lowerCase(userLanguage) !== 'english' ? 'translate' : 'notranslate'} key={`${idx}-${st.label}`} value={st.value}>
                      {st.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={1} className="createShipmentOuterAsterisk" mt={isMobile() ? -1.75 : 0}>*</Grid>
              <Grid item xs={11} sm={11.5} mt={isMobile() ? 2 : 0} mb={isMobile() ? 2 : 0}>
                <Autocomplete
                  multiple
                  id="items-multiple"
                  disabled={cannotEdit}
                  disableCloseOnSelect
                  filterSelectedOptions
                  options={_.orderBy(itemData, ['name'], ['asc'])}
                  getOptionLabel={(option) => option && option.name}
                  isOptionEqualToValue={(option, value) => (
                    !value || (value && (option.url === value))
                  )}
                  value={items}
                  onChange={(event, newValue) => onInputChange(newValue, 'item', null)}
                  renderTags={(value, getTagProps) => (
                    _.map(value, (option, index) => (
                      <Chip
                        variant="default"
                        label={
                          !_.isEmpty(itemData) && _.find(itemData, { url: option })
                            ? _.find(itemData, { url: option }).name
                            : ''
                        }
                        {...getTagProps({ index })}
                      />
                    ))
                  )}
                  renderOption={(props, option, { selected }) => (
                    <li {...props} className="notranslate">
                      <Checkbox
                        icon={uncheckedIcon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.name}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="notranslate"
                      variant="outlined"
                      label={(
                        <span className="translate">Items to be shipped</span>
                      )}
                      placeholder="Select..."
                    />
                  )}
                />
              </Grid>
              <Grid item xs={1} sm={0.5} className="createShipmentOuterAsterisk" mt={isMobile() ? -2 : 0}>*</Grid>
              {!_.isEmpty(itemRows) && (
                <Grid item xs={11.5} pt={0}>
                  <DataTableWrapper
                    hideAddButton
                    noOptionsIcon
                    noSpace
                    rows={itemRows}
                    columns={itemColumns(
                      _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'currency'))
                        ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'currency')).unit_of_measure
                        : '',
                    )}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={5.75} lg={3.83} mt={isMobile() ? 2.5 : 0}>
                <div className="createShipmentFieldset">
                  <Grid container alignItems="center">
                    <Grid item xs={10}>
                      <Typography variant="body1" fontWeight={700}>TEMPERATURE</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title="Temperature Alerts" placement="bottom">
                        <FormControlLabel
                          control={(
                            <Switch
                              color="primary"
                              checked={supressTempAlerts.value}
                              onChange={(e) => supressTempAlerts.setValue(e.target.checked)}
                            />
                          )}
                        />
                      </Tooltip>
                    </Grid>
                  </Grid>
                  <Typography mt={2} mb={0.95} className="createShipmentAlertSettingText">
                    <span className="createShipmentHighest">HIGHEST</span>
                    {' safe temperature'}
                  </Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    disabled={cannotEdit || !supressTempAlerts.value}
                    type="number"
                    className="createShipmentNumberInput"
                    id="max_excursion_temp"
                    name="max_excursion_temp"
                    autoComplete="max_excursion_temp"
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
                    onBlur={(e) => handleBlur(e, 'required', max_excursion_temp, 'max_excursion_temp')}
                    value={max_excursion_temp.value}
                    onChange={(e) => max_excursion_temp.setValue(_.toString(e.target.value))}
                  />
                  <Typography mt={3} mb={0.95} className="createShipmentAlertSettingText">
                    <span className="createShipmentLowest">LOWEST</span>
                    {' safe temperature'}
                  </Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    disabled={cannotEdit || !supressTempAlerts.value}
                    type="number"
                    className="createShipmentNumberInput"
                    id="min_excursion_temp"
                    name="min_excursion_temp"
                    autoComplete="min_excursion_temp"
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
                    onBlur={(e) => handleBlur(e, 'required', min_excursion_temp, 'min_excursion_temp')}
                    value={min_excursion_temp.value}
                    onChange={(e) => min_excursion_temp.setValue(_.toString(e.target.value))}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={5.75} lg={3.83}>
                <div className="createShipmentFieldset">
                  <Grid container alignItems="center">
                    <Grid item xs={10}>
                      <Typography variant="body1" fontWeight={700}>HUMIDITY</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title="Humidity Alerts" placement="bottom">
                        <FormControlLabel
                          control={(
                            <Switch
                              color="primary"
                              checked={supressHumidityAlerts.value}
                              onChange={(e) => supressHumidityAlerts.setValue(e.target.checked)}
                            />
                          )}
                        />
                      </Tooltip>
                    </Grid>
                  </Grid>
                  <Typography mt={2} mb={0.95} className="createShipmentAlertSettingText">
                    <span className="createShipmentHighest">HIGHEST</span>
                    {' safe humidity'}
                  </Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    disabled={cannotEdit || !supressHumidityAlerts.value}
                    type="number"
                    className="createShipmentNumberInput"
                    id="max_excursion_humidity"
                    name="max_excursion_humidity"
                    autoComplete="max_excursion_humidity"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><HumidityIcon /></InputAdornment>,
                      endAdornment: <InputAdornment position="start">%</InputAdornment>,
                    }}
                    onBlur={(e) => handleBlur(e, 'required', max_excursion_humidity, 'max_excursion_humidity')}
                    value={max_excursion_humidity.value}
                    onChange={(e) => max_excursion_humidity.setValue(_.toString(e.target.value))}
                  />
                  <Typography mt={3} mb={0.95} className="createShipmentAlertSettingText">
                    <span className="createShipmentLowest">LOWEST</span>
                    {' safe humidity'}
                  </Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    disabled={cannotEdit || !supressHumidityAlerts.value}
                    type="number"
                    className="createShipmentNumberInput"
                    id="min_excursion_humidity"
                    name="min_excursion_humidity"
                    autoComplete="min_excursion_humidity"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><HumidityIcon /></InputAdornment>,
                      endAdornment: <InputAdornment position="start">%</InputAdornment>,
                    }}
                    onBlur={(e) => handleBlur(e, 'required', min_excursion_humidity, 'min_excursion_humidity')}
                    value={min_excursion_humidity.value}
                    onChange={(e) => min_excursion_humidity.setValue(_.toString(e.target.value))}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={5.75} lg={3.83}>
                <div className="createShipmentFieldset">
                  <Typography variant="body1" component="div" fontWeight={700}>
                    SHOCK & LIGHT
                  </Typography>
                  <Grid container alignItems="center" mt={2}>
                    <Grid item xs={10}>
                      <Typography className="createShipmentAlertSettingText">
                        <span className="createShipmentHighest">MAX</span>
                        {' shock'}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title="Shock Alerts" placement="bottom">
                        <FormControlLabel
                          control={(
                            <Switch
                              color="primary"
                              checked={supressShockAlerts.value}
                              onChange={(e) => supressShockAlerts.setValue(e.target.checked)}
                            />
                          )}
                        />
                      </Tooltip>
                    </Grid>
                  </Grid>
                  <TextField
                    variant="outlined"
                    fullWidth
                    disabled={cannotEdit || !supressShockAlerts.value}
                    type="number"
                    className="createShipmentNumberInput"
                    id="shock_threshold"
                    name="shock_threshold"
                    autoComplete="shock_threshold"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><ShockIcon /></InputAdornment>,
                      endAdornment: <InputAdornment position="start">G</InputAdornment>,
                    }}
                    onBlur={(e) => handleBlur(e, 'required', shock_threshold, 'shock_threshold')}
                    value={shock_threshold.value}
                    onChange={(e) => shock_threshold.setValue(_.toString(e.target.value))}
                  />
                  <Grid container alignItems="center" mt={3}>
                    <Grid item xs={10}>
                      <Typography className="createShipmentAlertSettingText">
                        <span className="createShipmentHighest">MAX</span>
                        {' light'}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title="Light Alerts" placement="bottom">
                        <FormControlLabel
                          control={(
                            <Switch
                              color="primary"
                              checked={supressLightAlerts.value}
                              onChange={(e) => supressLightAlerts.setValue(e.target.checked)}
                            />
                          )}
                        />
                      </Tooltip>
                    </Grid>
                  </Grid>
                  <TextField
                    variant="outlined"
                    fullWidth
                    disabled={cannotEdit || !supressLightAlerts.value}
                    type="number"
                    className="createShipmentNumberInput"
                    id="light_threshold"
                    name="light_threshold"
                    autoComplete="light_threshold"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><LightIcon /></InputAdornment>,
                      endAdornment: <InputAdornment position="start">lumens</InputAdornment>,
                    }}
                    onBlur={(e) => handleBlur(e, 'required', light_threshold, 'light_threshold')}
                    value={light_threshold.value}
                    onChange={(e) => light_threshold.setValue(_.toString(e.target.value))}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={11.5} textAlign="end">
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  disabled={isLoadingShipmentTemplates
                    || isAddingShipmentTemplate
                    || isEditingShipmentTemplate
                    || isDeletingShipmentTemplate
                    || saveTemplateDisabled()
                    || cannotEdit}
                  onClick={(e) => {
                    const name = !!_.find(itemRows, { url: items[0] })
                      && `${originAbb}-${destinationAbb}-${_.find(itemRows, { url: items[0] }).name}`;
                    setSaveAsName(name);
                    setShowTemplateDT(true);
                  }}
                >
                  Save as Template
                </Button>
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth component="fieldset" variant="outlined" className="createShipmentFieldset">
            <FormLabel component="legend" className="createShipmentLegend">
              Order Information
            </FormLabel>
            <Grid container spacing={isDesktop ? 4 : 0}>
              <Grid item xs={2}>
                <TextField
                  variant="outlined"
                  fullWidth
                  disabled
                  id="org-abbreviation"
                  name="org-abbreviation"
                  autoComplete="org-abbreviation"
                  value={organization && organization.abbrevation}
                />
              </Grid>
              <Grid item xs={8.5} sm={9.5} ml={isMobile() ? 2 : 0}>
                <TextField
                  className="notranslate"
                  variant="outlined"
                  fullWidth
                  disabled={cannotEdit}
                  id="shipment-name"
                  name="shipment-name"
                  label={(
                    <span className="translate">Shipment Name</span>
                  )}
                  autoComplete="shipment-name"
                  onBlur={(e) => handleBlur(e, 'required', shipmentName, 'shipment-name')}
                  {...shipmentName.bind}
                />
              </Grid>
              <Grid item xs={0.5} className="createShipmentOuterAsterisk" mt={isMobile() ? -4 : 0}>*</Grid>
              <Grid item xs={5.25} sm={5.75} mt={isMobile() ? 2 : 0}>
                <TextField
                  variant="outlined"
                  fullWidth
                  disabled={cannotEdit}
                  id="purchase-order-number"
                  name="purchase-order-number"
                  label="Purchase Order Number"
                  autoComplete="purchase-order-number"
                  {...purchaseOrderNumber.bind}
                />
              </Grid>
              <Grid item xs={5.25} sm={5.75} mt={isMobile() ? 2 : 0} ml={isMobile() ? 2 : 0}>
                <TextField
                  variant="outlined"
                  fullWidth
                  disabled={cannotEdit}
                  id="bill-of-lading"
                  name="bill-of-lading"
                  label="Bill Of Lading"
                  autoComplete="bill-of-lading"
                  {...billOfLading.bind}
                />
              </Grid>
              <Grid item xs={8} md={9} lg={9.6} mt={isMobile() ? 1 : 0}>
                <FormControl style={{ height: 64 }} fullWidth component="fieldset" variant="outlined" className="createShipmentAttachedFiles">
                  <FormLabel component="legend" className="createShipmentLegend">
                    Attached Files
                  </FormLabel>
                  <Stack direction="row" spacing={1} mt={-1}>
                    {!_.isEmpty(files) && _.map(files, (file, idx) => (
                      <Chip
                        key={`${file.name}-${idx}`}
                        variant="outlined"
                        label={file.name}
                        onDelete={(e) => setFiles(_.filter(files, (f, index) => (index !== idx)))}
                      />
                    ))}
                    {!_.isEmpty(attachedFiles) && _.map(attachedFiles, (pdf, idx) => (
                      <Chip
                        key={`${pdf}-${idx}`}
                        variant="outlined"
                        label={pdf}
                        onDelete={(e) => setAttachedFiles(_.filter(attachedFiles, (f, index) => (
                          index !== idx
                        )))}
                      />
                    ))}
                  </Stack>
                </FormControl>
              </Grid>
              <Grid item xs={3.5} md={2.5} lg={2} className="createShipmentFileButton" mt={isMobile() ? -3 : 0}>
                <TextField
                  variant="outlined"
                  fullWidth
                  type="file"
                  id="attach-files"
                  name="attach-files"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ multiple: true }}
                  onChange={fileChange}
                  style={{ width: '128px', overflow: 'hidden' }}
                />
              </Grid>
              <Grid item xs={12} mt={isMobile() ? 2 : 0}>
                {!showNote && (
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    disabled={cannotEdit}
                    onClick={(e) => setShowNote(true)}
                  >
                    + Add a note
                  </Button>
                )}
                {showNote && (
                  <Grid container spacing={2}>
                    <Grid item xs={10} sm={11.5}>
                      <TextField
                        variant="outlined"
                        multiline
                        fullWidth
                        disabled={cannotEdit}
                        maxRows={4}
                        id="note"
                        name="note"
                        label="Note"
                        autoComplete="note"
                        {...note.bind}
                      />
                    </Grid>
                    <Grid item xs={1} sm={0.5}>
                      <Button
                        type="button"
                        disabled={cannotEdit}
                        onClick={(e) => {
                          note.setValue('');
                          setShowNote(false);
                        }}
                      >
                        <CancelIcon fontSize="large" className="createShipmentCancel" />
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </Grid>
              {!_.isEmpty(additionalCustodians)
                && _.map(additionalCustodians, (addCust, index) => (
                  <Grid item xs={12} key={`${index}-${addCust.custodian_uuid}`}>
                    <Grid container spacing={4} mt={0}>
                      <Grid item xs={6} sm={5} lg={5.5}>
                        <TextField
                          className="notranslate"
                          id={`add-cust-${addCust.custodian_uuid}`}
                          select
                          fullWidth
                          disabled={cannotEdit}
                          placeholder="Select..."
                          label={(
                            <span className="translate">{`Custodian ${index + 1}`}</span>
                          )}
                          value={addCust}
                          onChange={(e) => {
                            const newList = _.map(
                              additionalCustodians,
                              (cust, idx) => (idx === index ? e.target.value : cust),
                            );
                            setAdditionalCustodians(newList);
                          }}
                          InputLabelProps={{ shrink: true }}
                          SelectProps={{ displayEmpty: true }}
                        >
                          <MenuItem value="">Select</MenuItem>
                          {!_.isEmpty(carrierList)
                            && _.map(_.without(
                              carrierList,
                              _.find(carrierList, { url: originCustodian }),
                              ..._.without(additionalCustodians, addCust),
                              _.find(carrierList, { url: destinationCustodian }),
                            ), (cust) => (
                              <MenuItem className="notranslate" key={cust.custodian_uuid} value={cust}>
                                {cust.name}
                              </MenuItem>
                            ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={6} sm={2.5}>
                        <TextField
                          variant="outlined"
                          id={`add-cust-abb-${addCust.custodian_uuid}`}
                          label="ID"
                          fullWidth
                          disabled
                          value={addCust.abbrevation}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3.5}>
                        <TextField
                          variant="outlined"
                          id={`add-cust-type-${addCust.custodian_uuid}`}
                          label="Custodian Type"
                          fullWidth
                          disabled
                          value={addCust.type}
                        />
                      </Grid>
                      <Grid item xs={6} sm={0.5}>
                        <Button
                          type="button"
                          disabled={cannotEdit}
                          onClick={(e) => {
                            const newList = _.filter(
                              additionalCustodians,
                              (cust, idx) => (idx !== index),
                            );
                            setAdditionalCustodians(newList);
                          }}
                        >
                          <CancelIcon fontSize="large" className="createShipmentCancel" />
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              <Grid item xs={11.5} mt={isMobile() ? 2 : 0}>
                {showAddCustodian && (
                  <TextField
                    className="notranslate"
                    variant="outlined"
                    id="additional-custodian"
                    select
                    fullWidth
                    disabled={cannotEdit}
                    placeholder="Select..."
                    label={(
                      <span className="translate">Add carriers/warehouses</span>
                    )}
                    onChange={(e) => {
                      setAdditionalCustodians([...additionalCustodians, e.target.value]);
                      setShowAddCustodian(false);
                    }}
                    InputLabelProps={{ shrink: true }}
                    SelectProps={{ displayEmpty: true }}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {!_.isEmpty(carrierList)
                      && _.map(_.without(
                        carrierList,
                        _.find(carrierList, { url: originCustodian }),
                        ...additionalCustodians,
                        _.find(carrierList, { url: destinationCustodian }),
                      ), (cust) => (
                        <MenuItem className="notranslate" key={cust.custodian_uuid} value={cust}>
                          {cust.name}
                        </MenuItem>
                      ))}
                  </TextField>
                )}
                {!showAddCustodian && (
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    disabled={cannotEdit}
                    onClick={(e) => setShowAddCustodian(true)}
                  >
                    + Add carriers/warehouses
                  </Button>
                )}
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth component="fieldset" variant="outlined" className="createShipmentFieldset">
            <FormLabel component="legend" className="createShipmentLegend">
              Tracker
            </FormLabel>
            <Grid container spacing={isDesktop ? 4 : 0}>
              <Grid item xs={5} sm={5.5}>
                <TextField
                  className="notranslate"
                  id="gateway-type"
                  select
                  fullWidth
                  placeholder="Select..."
                  label={<span className="translate">Tracker platform</span>}
                  onBlur={(e) => handleBlur(e, 'required', gatewayType, 'gateway-type')}
                  disabled={
                    (!_.isEmpty(editData)
                      && !_.isEmpty(editData.gateway_imei)
                      && !!_.find(gatewayData, { imei_number: _.toNumber(editData.gateway_imei[0]) }))
                    || cannotEdit
                  }
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{ displayEmpty: true }}
                  {...gatewayType.bind}
                >
                  <MenuItem value="">Select</MenuItem>
                  {!_.isEmpty(gatewayTypesData) && _.map(gatewayTypesData, (gtype) => (
                    <MenuItem className="notranslate" key={gtype.id} value={gtype.name}>
                      {_.upperFirst(gtype.name)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={1} sm={0.5} className="createShipmentOuterAsterisk" mt={isMobile() ? -3.5 : 0}>*</Grid>
              <Grid item xs={5} sm={5.75} ml={isMobile() ? 2 : 0}>
                <TextField
                  className="notranslate"
                  id="gateway"
                  select
                  fullWidth
                  placeholder="Select..."
                  label={<span className="translate">Tracker identifier</span>}
                  onBlur={(e) => handleBlur(e, 'required', gateway, 'gateway')}
                  disabled={
                    (!_.isEmpty(editData)
                      && !_.isEmpty(editData.gateway_imei)
                      && !!_.find(gatewayData, { imei_number: _.toNumber(editData.gateway_imei[0]) }))
                    || cannotEdit
                  }
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{ displayEmpty: true }}
                  {...gateway.bind}
                >
                  <MenuItem value="">Select</MenuItem>
                  {!_.isEmpty(availableGateways) && _.map(availableGateways, (avgt) => (
                    <MenuItem key={avgt.gateway_uuid} value={avgt} className="notranslate">
                      {avgt.name}
                    </MenuItem>
                  ))}
                </TextField>
                <Typography variant="caption" component="div" fontStyle="italic" color={theme.palette.background.light} mt={1}>
                  Note: If no trackers appear in the drop down list, please verify that the
                  tracker is Available and associated to the origin custodian.
                </Typography>
              </Grid>
            </Grid>
            {gateway && gateway.value && (
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <Typography variant="body1" component="div">
                    Transmission/Measurement interval setting general guidance (may vary depending upon battery level, type, and conditions):
                  </Typography>
                  <Typography>
                    <ul className="createShipmentGuidanceList">
                      <li>5 minutes = &lt;1 week</li>
                      <li>10 minutes = &lt;2 weeks</li>
                      <li>20 minutes = &lt;3 weeks</li>
                      <li>30 minutes = &lt;1 month</li>
                      <li>1 hour = &lt;2 months</li>
                      <li>2 hours = &lt;3 months</li>
                      <li>6 hours = &lt;4 months</li>
                      <li>12 hours = &lt;6 months</li>
                    </ul>
                  </Typography>
                  <Typography variant="caption" component="div" fontStyle="italic" color={theme.palette.background.light}>
                    Note: numbers above based on 100% battery charge, non-lithium battery, in 0C-10C (32F-50F) temperature environment.
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Grid item xs={12} className="createShipmentGatewayDetails">
                    <Typography variant="body1" component="div">
                      Battery Level:
                    </Typography>
                    {gateway.value.last_known_battery_level
                      && _.gte(_.toNumber(gateway.value.last_known_battery_level), 90)
                      && (
                        <BatteryFullIcon htmlColor={theme.palette.success.main} />
                      )}
                    {gateway.value.last_known_battery_level
                      && _.lt(_.toNumber(gateway.value.last_known_battery_level), 90)
                      && _.gte(_.toNumber(gateway.value.last_known_battery_level), 60)
                      && (
                        <Battery80Icon htmlColor={theme.palette.warning.main} />
                      )}
                    {gateway.value.last_known_battery_level
                      && _.lt(_.toNumber(gateway.value.last_known_battery_level), 60)
                      && (
                        <Battery50Icon htmlColor={theme.palette.error.main} />
                      )}
                    {!gateway.value.last_known_battery_level && (
                      <BatteryFullIcon />
                    )}
                    <Typography variant="body1" component="div">
                      {gateway.value.last_known_battery_level ? `${gateway.value.last_known_battery_level}%` : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={11}>
                    <Grid container spacing={4}>
                      <Grid item xs={6}>
                        <TextField
                          id="transmission-interval"
                          select
                          fullWidth
                          disabled={cannotEdit}
                          placeholder="Select..."
                          label="Transmission interval"
                          onBlur={(e) => handleBlur(e, 'required', transmissionInterval, 'transmission-interval')}
                          InputLabelProps={{ shrink: true }}
                          SelectProps={{ displayEmpty: true }}
                          value={transmissionInterval.value}
                          onChange={(e) => {
                            transmissionInterval.setValue(e.target.value);
                            measurementInterval.setValue(e.target.value);
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
                      <Grid item xs={6}>
                        <TextField
                          id="measurement-interval"
                          select
                          fullWidth
                          disabled={cannotEdit}
                          placeholder="Select..."
                          label="Measurement interval"
                          onBlur={(e) => handleBlur(e, 'required', measurementInterval, 'measurement-interval')}
                          InputLabelProps={{ shrink: true }}
                          SelectProps={{ displayEmpty: true }}
                          {...measurementInterval.bind}
                        >
                          <MenuItem value="">Select</MenuItem>
                          {!_.isEmpty(TIVE_GATEWAY_TIMES) && _.map(
                            _.filter(TIVE_GATEWAY_TIMES, (t) => (_.includes(gatewayType.value, 'ProofTracker') ? t.value === transmissionInterval.value : t.value <= transmissionInterval.value)),
                            (time, index) => (
                              <MenuItem key={`${time.value}-${index}`} value={time.value}>
                                {time.label}
                              </MenuItem>
                            ),
                          )}
                        </TextField>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </FormControl>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Typography className="createShipmentFinalName">ID</Typography>
              <TextField
                variant="outlined"
                id="org-id-final"
                fullWidth
                disabled
                className="createShipmentFinalNameDisplay"
                value={organization && organization.abbrevation}
              />
            </Grid>
            <Grid item xs={6} sm={5}>
              <Typography className="createShipmentFinalName">SHIPMENT NAME</Typography>
              <TextField
                variant="outlined"
                id="shipment-name-final"
                fullWidth
                disabled
                className="createShipmentFinalNameDisplay noTranslate"
                value={shipmentName.value}
              />
            </Grid>
            <Grid item xs={6} sm={2} mt={isMobile() ? -3 : 0}>
              <Typography className="createShipmentFinalName">ORIGIN</Typography>
              <TextField
                variant="outlined"
                id="origin-final"
                fullWidth
                disabled
                className="createShipmentFinalNameDisplay"
                value={originAbb}
              />
            </Grid>
            <Grid item xs={6} sm={2} mt={isMobile() ? -3 : 0}>
              <Typography className="createShipmentFinalName">DEST</Typography>
              <TextField
                variant="outlined"
                id="dest-final"
                fullWidth
                disabled
                className="createShipmentFinalNameDisplay"
                value={destinationAbb}
              />
            </Grid>
          </Grid>
          <Grid container spacing={4}>
            <Grid item xs={12} mt={1}>
              <Typography variant="caption" component="div" textAlign="center" fontStyle="italic" color={theme.palette.background.light}>
                This is your automated shipment number.
                It is automatically generated from the form above.
              </Typography>
            </Grid>
            <Grid item xs={0.5} />
            <Grid item xs={5.5} mt={5} ml={isMobile() ? -1.5 : 0}>
              <Button
                type="button"
                variant="outlined"
                fullWidth
                onClick={(e) => history.push(routes.SHIPMENT)}
                className="createShipmentActionButtons"
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={5.5} mt={5}>
              {!gateway.value && (
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isAddingShipment
                    || isEditingShipment
                    || isDeletingCustody
                    || submitDisabled()}
                  onClick={(e) => handleSubmit(e, true)}
                  className="createShipmentActionButtons"
                >
                  Save as Draft
                </Button>
              )}
              {gateway.value && (
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isAddingShipment
                    || isEditingShipment
                    || isDeletingCustody
                    || submitDisabled()}
                  onClick={(e) => handleSubmit(e, false)}
                  className="createShipmentActionButtons"
                >
                  {_.isEmpty(editData) ? 'Create a shipment' : 'Update shipment'}
                </Button>
              )}
            </Grid>
            <Grid item xs={0.5} />
          </Grid>
          <Grid container spacing={4}>
            <Grid item xs={12} mt={2}>
              <Typography variant="caption" component="div" textAlign="center" fontStyle="italic" color={theme.palette.background.light}>
                You must fill out all required fields to create an active shipment
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </form>
      <div>
        <Dialog
          open={showTemplateDT}
          onClose={(e) => setShowTemplateDT(false)}
          aria-labelledby="save-template-title"
          aria-describedby="save-template-description"
          className="createShipmentSaveTemplateModal"
        >
          {(isAddingShipmentTemplate
            || isEditingShipmentTemplate
            || isDeletingShipmentTemplate)
            && (
              <Loader open={isAddingShipmentTemplate
                || isEditingShipmentTemplate
                || isDeletingShipmentTemplate}
              />
            )}
          <DialogTitle id="save-template-title">
            {!saveAsName && 'All Templates'}
            {saveAsName && 'Save template as...'}
            <IconButton
              aria-label="save-template-close"
              className="createShipmentCloseButton"
              onClick={(e) => setShowTemplateDT(false)}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DataTableWrapper
              hideAddButton
              noOptionsIcon
              noSpace
              rows={templateRows}
              columns={[
                {
                  name: 'name',
                  label: 'Template Name',
                  options: {
                    sort: true,
                    sortThirdClickReset: true,
                    filter: true,
                    setCellProps: () => ({
                      style: { textDecoration: !saveAsName && 'underline', textDecoractionColor: !saveAsName && theme.palette.background.light },
                      className: 'notranslate',
                    }),
                  },
                },
                ...templateColumns(
                  data,
                  _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
                    ? _.find(unitData, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
                    : '',
                ),
              ]}
              extraOptions={{
                rowHover: true,
                onRowClick: (rowData) => {
                  if (saveAsName) {
                    setSaveAsName(rowData[0]);
                    setConfirmReplace(true);
                  } else {
                    handleTemplateChange(_.find(shipmentTemplateData, { name: rowData[0] }) || '');
                    setShowTemplateDT(false);
                  }
                },
                setRowProps: (row, dataIndex, rowIndex) => ({
                  style: { cursor: 'pointer' },
                }),
              }}
            />
          </DialogContent>
          {saveAsName && (
            <DialogActions>
              <Grid container spacing={2} className="createShipmentModalActionButtons">
                <Grid item xs={6}>
                  <TextField
                    variant="outlined"
                    id="template-name"
                    fullWidth
                    label="Template Name"
                    placeholder="32 characters maximum"
                    value={saveAsName}
                    onChange={(e) => setSaveAsName(e.target.value)}
                    helperText="There is a 32-character limit on template names"
                    inputProps={{ maxLength: 32 }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    style={{ height: '72.4%' }}
                    onClick={(e) => setShowTemplateDT(false)}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ height: '72.4%' }}
                    onClick={saveAsTemplate}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </DialogActions>
          )}
        </Dialog>
      </div>
      <ConfirmModal
        open={confirmReplace}
        setOpen={setConfirmReplace}
        submitAction={replaceTemplate}
        title={`"${templateName || saveAsName}" already exists. Do you want to replace it?`}
        msg1="A template with the same name already exists."
        msg2="Replacing it will overwrite its current contents."
        submitText={templateName || saveAsName ? 'Replace template' : 'Rename template'}
      />
      <ConfirmModal
        open={confirmDelete}
        setOpen={setConfirmDelete}
        submitAction={(e) => {
          deleteShipmentTemplateMutation(template.id);
          setConfirmDelete(false);
        }}
        title={`Are you sure you want to delete the template "${template.name}"?`}
        msg1="This action cannot be undone."
        submitText="Delete template"
      />
      <ConfirmModal
        open={confirmLeave}
        setOpen={setConfirmLeave}
        submitAction={(e) => {
          setTriggerExit((obj) => ({ ...obj, onOk: true }));
          setConfirmLeave(false);
        }}
        title="Your changes are unsaved and will be discarded. Are you sure you want to leave?"
        submitText="Yes"
      />
    </Box>
  );
};

export default CreateShipment;
