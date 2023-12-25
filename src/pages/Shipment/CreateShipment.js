/* eslint-disable react-hooks/rules-of-hooks */
import React, {
  useCallback, useEffect, useState,
} from 'react';
import { connect } from 'react-redux';
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
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
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
import ConfirmModal from '../../components/Modal/ConfirmModal';
import DataTableWrapper from '../../components/DataTableWrapper/DataTableWrapper';
import DatePickerComponent from '../../components/DatePicker/DatePicker';
import Loader from '../../components/Loader/Loader';
import MapComponent from '../../components/MapComponent/MapComponent';
import { getUser } from '../../context/User.context';
import { useInput } from '../../hooks/useInput';
import {
  deleteCustody, getContact, getCustodianType, getCustodians, getCustody,
} from '../../redux/custodian/actions/custodian.actions';
import { getItemType, getItems, getUnitOfMeasure } from '../../redux/items/actions/items.actions';
import { getGatewayType, getGateways } from '../../redux/sensorsGateway/actions/sensorsGateway.actions';
import {
  addShipment,
  addShipmentTemplate,
  deleteShipmentTemplate,
  editShipment,
  editShipmentTemplate,
  getShipmentTemplates,
} from '../../redux/shipment/actions/shipment.actions';
import { routes } from '../../routes/routesConstants';
import {
  getCustodianFormattedRow,
  getItemFormattedRow,
  getTemplateFormattedRow,
  itemColumns,
  templateColumns,
} from '../../utils/constants';
import {
  ADMIN_SHIPMENT_STATUS,
  CREATE_SHIPMENT_STATUS,
  USER_SHIPMENT_STATUS,
  TIVE_GATEWAY_TIMES,
  UOM_TEMPERATURE_CHOICES,
} from '../../utils/mock';
import { checkForAdmin, checkForGlobalAdmin } from '../../utils/utilMethods';
import { validators } from '../../utils/validators';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: theme.breakpoints.values.lg,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  fieldset: {
    border: `1px solid ${theme.palette.background.light}`,
    padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  legend: {
    fontSize: theme.spacing(1.5),
  },
  innerAsterisk: {
    fontSize: theme.spacing(4),
    color: theme.palette.secondary.main,
    paddingTop: `${theme.spacing(3)} !important`,
  },
  outerAsterisk: {
    fontSize: theme.spacing(4),
    color: theme.palette.secondary.main,
    paddingLeft: `${theme.spacing(2)} !important`,
    paddingTop: `${theme.spacing(5)} !important`,
  },
  adjustSpacing: {
    marginRight: theme.spacing(6),
  },
  alertSettingText: {
    color: theme.palette.background.light,
  },
  highest: {
    fontWeight: 700,
    color: theme.palette.error.main,
  },
  lowest: {
    fontWeight: 700,
    color: theme.palette.info.main,
  },
  cancel: {
    marginTop: theme.spacing(0.5),
    marginLeft: theme.spacing(-4),
    fill: theme.palette.background.light,
  },
  attachedFiles: {
    border: `1px solid ${theme.palette.background.light}`,
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(0.5),
    height: '100%',
  },
  fileButton: {
    paddingTop: `${theme.spacing(5)} !important`,
    '& fieldset': {
      border: 0,
    },
  },
  gatewayDetails: {
    display: 'flex',
    justifyContent: 'end',
    marginRight: theme.spacing(1),
    padding: theme.spacing(5),
    paddingTop: theme.spacing(2),
  },
  finalName: {
    paddingTop: theme.spacing(5),
    color: theme.palette.background.light,
    '& div': {
      paddingLeft: `${theme.spacing(4)} !important`,
    },
  },
  finalNameDisplay: {
    backgroundColor: theme.palette.primary.light,
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
  actionButtons: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.background.dark,
  },
  saveTemplateModal: {
    '& .MuiPaper-root': {
      minWidth: '70%',
    },
  },
  modalActionButtons: {
    padding: theme.spacing(2),
    paddingTop: 0,
  },
  nameContainer: {
    margin: `${theme.spacing(4)} 0`,
    border: `1px solid ${theme.palette.background.light}`,
    borderRadius: theme.spacing(1),
  },
  nameHeader: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.light,
    borderBottom: `1px solid ${theme.palette.background.light}`,
  },
  nameData: {
    padding: theme.spacing(2),
  },
  DTTemplatetName: {
    textDecoration: 'underline',
    textDecorationColor: theme.palette.background.light,
    cursor: 'pointer',
  },
}));

const CreateShipment = ({
  dispatch,
  loading,
  templates,
  custodianData,
  contactInfo,
  timezone,
  unitOfMeasure,
  itemData,
  itemTypeList,
  custodianTypeList,
  gatewayData,
  gatewayTypeList,
  history,
  location,
  custodyData,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  const user = getUser();
  const organization = user && user.organization;
  const isAdmin = checkForAdmin(user) || checkForGlobalAdmin(user);

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

  const [custodianList, setCustodianList] = useState([]);
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
    || moment().startOf('day').hour(12).minute(0),
  );
  const [arrivalDateTime, setArrivalDateTime] = useState(
    (!_.isEmpty(editData) && editData.estimated_time_of_arrival)
    || moment().startOf('day').hour(12).minute(0),
  );
  const status = useInput((!_.isEmpty(editData) && editData.status) || 'Planned');
  const cannotEdit = !_.isEmpty(editData) && _.includes(_.map(ADMIN_SHIPMENT_STATUS, 'value'), editData.status);

  const [items, setItems] = useState((!_.isEmpty(editData) && editData.items) || []);
  const [itemRows, setItemRows] = useState([]);

  const min_excursion_temp = useInput(
    (!_.isEmpty(editData) && editData.min_excursion_temp)
    || (organization && organization.default_min_temperature)
    || 0,
  );
  const max_excursion_temp = useInput(
    (!_.isEmpty(editData) && editData.max_excursion_temp)
    || (organization && organization.default_max_temperature)
    || 100,
  );
  const min_excursion_humidity = useInput(
    (!_.isEmpty(editData) && editData.min_excursion_humidity)
    || (organization && organization.default_min_humidity)
    || 0,
  );
  const max_excursion_humidity = useInput(
    (!_.isEmpty(editData) && editData.max_excursion_humidity)
    || (organization && organization.default_max_humidity)
    || 100,
  );
  const shock_threshold = useInput(
    (!_.isEmpty(editData) && editData.shock_threshold)
    || (organization && organization.default_shock)
    || 4,
  );
  const light_threshold = useInput(
    (!_.isEmpty(editData) && editData.light_threshold)
    || (organization && organization.default_light)
    || 5,
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
  const [additionalCustodians, setAdditionalCustocations] = useState([]);

  const gatewayType = useInput((!_.isEmpty(editData) && editData.platform_name) || 'tive');
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

  useEffect(() => {
    if (organization) {
      dispatch(getShipmentTemplates(organization.organization_uuid));
      dispatch(getCustodians(organization.organization_uuid));
      dispatch(getCustodianType());
      dispatch(getContact(organization.organization_uuid));
      dispatch(getUnitOfMeasure(organization.organization_uuid));
      dispatch(getItems(organization.organization_uuid));
      dispatch(getItemType(organization.organization_uuid));
      dispatch(getGateways(organization.organization_uuid));
      dispatch(getGatewayType());
    }

    if (!_.isEmpty(editData)) {
      const encodedUUID = encodeURIComponent(editData.shipment_uuid);
      dispatch(getCustody(encodedUUID));
    }
  }, []);

  useEffect(() => {
    if (!_.isEmpty(editData)) {
      const origin = _.find(custodianList, { name: editData.origin });
      const destination = _.find(custodianList, { name: editData.destination });
      const carriers = _.map(editData.carriers, (carrier) => (
        _.find(custodianList, { name: carrier }) || carrier
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
        setAdditionalCustocations(carriers);
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
  }, [editData, custodianList, gatewayTypeList, gatewayData]);

  useEffect(() => {
    if (!_.isEmpty(custodianData) && !_.isEmpty(contactInfo)) {
      setCustodianList(getCustodianFormattedRow(custodianData, contactInfo, custodianTypeList));
    }
  }, [custodianData, contactInfo, custodianTypeList]);

  useEffect(() => {
    if (!_.isEmpty(itemData)) {
      let selectedRows = [];
      _.forEach(itemData, (item) => {
        if (_.includes(items, item.url)) {
          selectedRows = [...selectedRows, item];
        }
      });

      const rows = getItemFormattedRow(selectedRows, itemTypeList, unitOfMeasure);
      setItemRows(rows);
    }
  }, [itemData, itemTypeList, unitOfMeasure, items]);

  useEffect(() => {
    const custodian = _.find(custodianData, { url: originCustodian });
    const gt = _.find(gatewayTypeList, { name: gatewayType.value });

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
      handleTemplateChange(_.find(templates, { name: saveAsName }) || '');
    } else if (template) {
      handleTemplateChange(_.find(templates, { id: template.id }) || '');
    }
  }, [templates]);

  useEffect(() => {
    setTemplateRows(getTemplateFormattedRow(templates, custodianData, itemData));
  }, [templates, custodianData, itemData]);

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
      || shipmentName.hasChanged()
      || purchaseOrderNumber.hasChanged()
      || billOfLading.hasChanged()
      || !_.isEmpty(files)
      || note.hasChanged()
      || !_.isEqual(additionalCustodians, _.map(editData.carriers, (carrier) => (
        _.find(custodianList, { name: carrier }) || carrier
      )))
      || gatewayType.hasChanged()
      || !_.isEqual(editData.transmission_time, transmissionInterval.value)
      || !_.isEqual(editData.measurement_time, measurementInterval.value)
      || (
        _.find(custodianList, { name: editData.origin })
        && !_.isEqual(originCustodian, _.find(custodianList, { name: editData.origin }).url)
      ) || (
        _.find(custodianList, { name: editData.destination })
        && !_.isEqual(destinationCustodian, _.find(custodianList, {
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
          const selectedCustodian = _.find(custodianList, { url: value });
          const storage = _.isEqual(selectedCustodian.type, 'Warehouse');
          if (custody === 'start') {
            setOriginCustodian(value);
            setOriginAbb(getAbbreviation(selectedCustodian.abbrevation));
            setStartingAddress(selectedCustodian.location);
            getLatLong(selectedCustodian.location, 'start');
          } else if (custody === 'end') {
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
    ) || (!template && (!originCustodian || !destinationCustodian || _.isEmpty(items)))
  );

  const handleTemplateChange = (value) => {
    if (!_.isEqual(value, 'all')) {
      setTemplate(value);
      setTemplateName('');
      if (value) {
        const oCustodian = _.find(custodianList, { url: value.origin_custodian });
        const dCustodian = _.find(custodianList, { url: value.destination_custodian });
        const storage = _.isEqual(oCustodian, dCustodian) && _.isEqual(dCustodian.type, 'Warehouse');

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
      }
    } else {
      setSaveAsName('');
      setShowTemplateDT(true);
    }
  };

  const saveAsTemplate = () => {
    const tmplt = _.find(templates, { name: saveAsName }) || {};
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
      organization_uuid: organization.organization_uuid,
    };

    if (_.isEmpty(tmplt)) {
      dispatch(addShipmentTemplate(templateFormValue));
      setShowTemplateDT(false);
    } else {
      setConfirmReplace(true);
    }
  };

  const saveTemplateName = () => {
    const exists = _.find(templates, { name: templateName });
    if (exists) {
      setConfirmReplace(true);
    } else {
      const tmp = { ...template, name: templateName };
      dispatch(editShipmentTemplate(tmp));
      setTemplateName('');
      setTemplate(tmp);
    }
  };

  const replaceTemplate = () => {
    const tmplt = (templateName && _.find(templates, { name: templateName }))
    || (saveAsName && _.find(templates, { name: saveAsName }))
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
      organization_uuid: organization.organization_uuid,
    };

    if (template && (
      !_.isEqual(template.name, templateName) && !_.isEqual(template.name, saveAsName)
    )) {
      dispatch(deleteShipmentTemplate(template.id, false));
    }

    dispatch(editShipmentTemplate(newTemplate));
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
      && !shipmentName.hasChanged()
      && !purchaseOrderNumber.hasChanged()
      && !billOfLading.hasChanged()
      && _.isEmpty(files)
      && !note.hasChanged()
      && _.isEqual(additionalCustodians, _.map(editData.carriers, (carrier) => (
        _.find(custodianList, { name: carrier }) || carrier
      )))
      && _.isEqual(editData.transmission_time, transmissionInterval.value)
      && _.isEqual(editData.measurement_time, measurementInterval.value)
      && (!_.isEmpty(editData.gateway_imei)
        || (_.isEmpty(editData.gateway_imei) && (!gateway.value || !gatewayType.value))
      ) && (
        _.find(custodianList, { name: editData.origin })
        && _.isEqual(originCustodian, _.find(custodianList, { name: editData.origin }).url)
      ) && (
        _.find(custodianList, { name: editData.destination })
        && _.isEqual(destinationCustodian, _.find(custodianList, {
          name: editData.destination,
        }).url)
      ) && _.isEqual(attachedFiles, editData.uploaded_pdf)
    ))
  );

  const handleSubmit = (event, draft) => {
    event.preventDefault();
    const shipName = `${organization.abbrevation}-${shipmentName.value}-${originAbb}-${destinationAbb}`;
    const UOMDISTANCE = _.find(unitOfMeasure, (unit) => (
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

    const shipmentFormValue = {
      ...editData,
      name: shipName,
      purchase_order_number: purchaseOrderNumber.value,
      order_number: shipmentName.value,
      status: status.value,
      estimated_time_of_arrival: arrivalDateTime,
      estimated_time_of_departure: departureDateTime,
      items,
      organization_uuid: organization.organization_uuid,
      platform_name: gatewayType.value,
      max_excursion_temp: parseInt(max_excursion_temp.value, 10),
      min_excursion_temp: parseInt(min_excursion_temp.value, 10),
      max_excursion_humidity: parseInt(max_excursion_humidity.value, 10),
      min_excursion_humidity: parseInt(min_excursion_humidity.value, 10),
      shock_threshold: parseInt(shock_threshold.value, 10),
      light_threshold: parseInt(light_threshold.value, 10),
      note: note.value,
      transmission_time: parseInt(transmissionInterval.value, 10),
      measurement_time: parseInt(measurementInterval.value, 10),
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
      _.forEach(removeCustodies, (cust) => dispatch(deleteCustody(cust.id)));
    }

    let savePayload = {
      shipment: shipmentFormValue,
      start_custody: startCustodyForm,
      end_custody: endCustodyForm,
      files,
      carriers,
      fujitsuVerification: organization.enable_fujitsu_verification,
    };

    if (!draft && (
      (_.isEqual('available', updateGateway.gateway_status) && _.isEqual([], updateGateway.shipment_ids))
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
      dispatch(addShipment(savePayload, history, routes.SHIPMENT));
    } else {
      dispatch(editShipment(savePayload, history, routes.SHIPMENT));
    }
  };

  return (
    <Box mt={5} mb={5} className={classes.root}>
      {loading && <Loader open={loading} />}
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={8}>
          <Typography className={classes.dashboardHeading} variant="h5">
            {formTitle}
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <TextField
            variant="outlined"
            id="template"
            select
            fullWidth
            placeholder="Select..."
            label="Templates"
            value={template}
            onChange={(e) => handleTemplateChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            SelectProps={{ displayEmpty: true }}
            disabled={cannotEdit}
          >
            <MenuItem value="">Select</MenuItem>
            {!_.isEmpty(templates) && _.map(templates, (tmp) => (
              <MenuItem key={tmp.template_uuid} value={tmp}>
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
        <Grid container className={classes.nameContainer}>
          <Grid item xs={8} className={classes.nameHeader}>
            <Typography variant="body1" fontWeight={800}>
              Template name
            </Typography>
          </Grid>
          <Grid item xs={4} className={classes.nameHeader}>
            <Typography variant="body1" fontWeight={800}>
              Actions
            </Typography>
          </Grid>

          <Grid item xs={8} className={classes.nameData}>
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
          <Grid item xs={4} className={classes.nameData}>
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
                  style={{ padding: `${theme.spacing(1.75)} ${theme.spacing(5)}` }}
                  disabled={cannotEdit}
                  onClick={(e) => setTemplateName('')}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  variant="contained"
                  style={{
                    padding: `${theme.spacing(1.75)} ${theme.spacing(5)}`,
                    marginLeft: theme.spacing(2),
                  }}
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

      <form className={classes.form} noValidate>
        <Box mt={2}>
          <FormControl fullWidth component="fieldset" variant="outlined" className={classes.fieldset}>
            <FormLabel component="legend" className={classes.legend}>
              Shipment Details
            </FormLabel>

            <Grid container spacing={isDesktop ? 4 : 0}>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <TextField
                      variant="outlined"
                      id="origin-custodian"
                      select
                      fullWidth
                      placeholder="Select..."
                      label="Origin Custodian"
                      onBlur={(e) => handleBlur(e, 'required', originCustodian, 'origin-custodian')}
                      value={originCustodian}
                      onChange={(e) => onInputChange(e.target.value, 'custodian', 'start')}
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{ displayEmpty: true }}
                      disabled={cannotEdit}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {!_.isEmpty(custodianList) && _.map(custodianList, (cust) => (
                        <MenuItem key={cust.custodian_uuid} value={cust.url}>
                          {cust.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={3}>
                    <TextField
                      variant="outlined"
                      id="origin-custodian-abbreviation"
                      label="ID"
                      disabled
                      value={originAbb}
                    />
                  </Grid>
                  <Grid item xs={1} className={classes.innerAsterisk}>*</Grid>

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
                  <Grid item xs={1} className={classes.innerAsterisk}>*</Grid>

                  <Grid item xs={11}>
                    <MapComponent
                      isMarkerShown
                      googleMapURL={window.env.MAP_API_URL}
                      zoom={10}
                      loadingElement={<div style={{ height: '100%' }} />}
                      containerElement={<div style={{ height: '300px', marginTop: '10px' }} />}
                      mapElement={<div style={{ height: '100%' }} />}
                      markers={[
                        {
                          lat: startingLocation && _.includes(startingLocation, ',') && parseFloat(startingLocation.split(',')[0]),
                          lng: startingLocation && _.includes(startingLocation, ',') && parseFloat(startingLocation.split(',')[1]),
                          radius: (organization && organization.radius) || 0,
                        },
                      ]}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <TextField
                      variant="outlined"
                      id="destination-custodian"
                      select
                      fullWidth
                      placeholder="Select..."
                      label="Destination Custodian"
                      onBlur={(e) => handleBlur(e, 'required', destinationCustodian, 'destination-custodian')}
                      value={destinationCustodian}
                      onChange={(e) => onInputChange(e.target.value, 'custodian', 'end')}
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{ displayEmpty: true }}
                      disabled={cannotEdit}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {!_.isEmpty(custodianList) && _.map(custodianList, (cust) => (
                        <MenuItem key={cust.custodian_uuid} value={cust.url}>
                          {cust.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={3}>
                    <TextField
                      variant="outlined"
                      id="destination-custodian-abbreviation"
                      label="ID"
                      disabled
                      value={destinationAbb}
                    />
                  </Grid>
                  <Grid item xs={1} className={classes.innerAsterisk}>*</Grid>

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
                  <Grid item xs={1} className={classes.innerAsterisk}>*</Grid>

                  <Grid item xs={11}>
                    <MapComponent
                      isMarkerShown
                      googleMapURL={window.env.MAP_API_URL}
                      zoom={10}
                      loadingElement={<div style={{ height: '100%' }} />}
                      containerElement={<div style={{ height: '300px', marginTop: '10px' }} />}
                      mapElement={<div style={{ height: '100%' }} />}
                      markers={[
                        {
                          lat: endingLocation && _.includes(endingLocation, ',') && parseFloat(endingLocation.split(',')[0]),
                          lng: endingLocation && _.includes(endingLocation, ',') && parseFloat(endingLocation.split(',')[1]),
                          radius: (organization && organization.radius) || 0,
                        },
                      ]}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={5.5} className={classes.adjustSpacing}>
                <DatePickerComponent
                  label="Shipment start"
                  selectedDate={moment(departureDateTime).tz(timezone)}
                  disabled={cannotEdit}
                  hasTime
                  handleDateChange={(value) => {
                    setDepartureDateTime(value);
                    setArrivalDateTime(value);
                  }}
                  dateFormat={
                    _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
                      ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
                      : ''
                  }
                  timeFormat={
                    _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
                      ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
                      : ''
                  }
                />
              </Grid>

              <Grid item xs={12} sm={5.5}>
                <DatePickerComponent
                  label="Shipment end"
                  selectedDate={moment(arrivalDateTime).tz(timezone)}
                  disabled={cannotEdit}
                  hasTime
                  handleDateChange={setArrivalDateTime}
                  dateFormat={
                    _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
                      ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
                      : ''
                  }
                  timeFormat={
                    _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
                      ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
                      : ''
                  }
                />
              </Grid>

              <Grid item xs={11} sm={5.5}>
                <TextField
                  variant="outlined"
                  id="status"
                  select
                  fullWidth
                  placeholder="Select..."
                  label="Shipment Status"
                  onBlur={(e) => handleBlur(e, 'required', status, 'status')}
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{ displayEmpty: true }}
                  {...status.bind}
                  disabled={cannotEdit && !isAdmin}
                >
                  <MenuItem value="">Select</MenuItem>
                  {_.isEmpty(editData) && _.map(CREATE_SHIPMENT_STATUS, (st, idx) => (
                    <MenuItem key={`${idx}-${st.label}`} value={st.value}>
                      {st.label}
                    </MenuItem>
                  ))}
                  {!cannotEdit && !isAdmin && _.map(USER_SHIPMENT_STATUS, (st, idx) => (
                    <MenuItem key={`${idx}-${st.label}`} value={st.value}>
                      {st.label}
                    </MenuItem>
                  ))}
                  {((cannotEdit && isAdmin) || (!_.isEmpty(editData) && !cannotEdit && isAdmin))
                  && _.map([...CREATE_SHIPMENT_STATUS, ...ADMIN_SHIPMENT_STATUS], (st, idx) => (
                    <MenuItem key={`${idx}-${st.label}`} value={st.value}>
                      {st.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={1} className={classes.outerAsterisk}>*</Grid>

              <Grid item xs={11.5}>
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
                    <li {...props}>
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
                      variant="outlined"
                      label="Items to be shipped"
                      placeholder="Select..."
                    />
                  )}
                />
              </Grid>
              <Grid item xs={0.5} className={classes.outerAsterisk}>*</Grid>

              {!_.isEmpty(itemRows) && (
                <Grid item xs={11.5} pt={0}>
                  <DataTableWrapper
                    hideAddButton
                    noOptionsIcon
                    noSpace
                    loading={loading}
                    rows={itemRows}
                    columns={itemColumns(
                      _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'currency'))
                        ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'currency')).unit_of_measure
                        : '',
                    )}
                  />
                </Grid>
              )}

              <Grid item xs={12} sm={5.75} lg={3.83}>
                <div className={classes.fieldset}>
                  <Typography variant="body1" component="div" fontWeight={700}>
                    TEMPERATURE
                  </Typography>

                  <Typography mt={2} className={classes.alertSettingText}>
                    <span className={classes.highest}>HIGHEST</span>
                    {' safe temperature'}
                  </Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    disabled={cannotEdit}
                    type="number"
                    className={classes.numberInput}
                    id="max_excursion_temp"
                    name="max_excursion_temp"
                    autoComplete="max_excursion_temp"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><TemperatureIcon /></InputAdornment>,
                      endAdornment: (
                        <InputAdornment position="start">
                          {
                            _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'temperature'))
                            && _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'temperature')).unit_of_measure === UOM_TEMPERATURE_CHOICES[0]
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

                  <Typography mt={3} className={classes.alertSettingText}>
                    <span className={classes.lowest}>LOWEST</span>
                    {' safe temperature'}
                  </Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    disabled={cannotEdit}
                    type="number"
                    className={classes.numberInput}
                    id="min_excursion_temp"
                    name="min_excursion_temp"
                    autoComplete="min_excursion_temp"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><TemperatureIcon /></InputAdornment>,
                      endAdornment: (
                        <InputAdornment position="start">
                          {
                            _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'temperature'))
                            && _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'temperature')).unit_of_measure === UOM_TEMPERATURE_CHOICES[0]
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
                <div className={classes.fieldset}>
                  <Typography variant="body1" component="div" fontWeight={700}>
                    HUMIDITY
                  </Typography>

                  <Typography mt={2} className={classes.alertSettingText}>
                    <span className={classes.highest}>HIGHEST</span>
                    {' safe humidity'}
                  </Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    disabled={cannotEdit}
                    type="number"
                    className={classes.numberInput}
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

                  <Typography mt={3} className={classes.alertSettingText}>
                    <span className={classes.lowest}>LOWEST</span>
                    {' safe humidity'}
                  </Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    disabled={cannotEdit}
                    type="number"
                    className={classes.numberInput}
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
                <div className={classes.fieldset}>
                  <Typography variant="body1" component="div" fontWeight={700}>
                    SHOCK & LIGHT
                  </Typography>

                  <Typography mt={2} className={classes.alertSettingText}>
                    <span className={classes.highest}>MAX</span>
                    {' shock'}
                  </Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    disabled={cannotEdit}
                    type="number"
                    className={classes.numberInput}
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

                  <Typography mt={3} className={classes.alertSettingText}>
                    <span className={classes.highest}>MAX</span>
                    {' light'}
                  </Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    disabled={cannotEdit}
                    type="number"
                    className={classes.numberInput}
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

              <Grid item xs={11.5} textAlign="end">
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  disabled={loading || saveTemplateDisabled() || cannotEdit}
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

          <FormControl fullWidth component="fieldset" variant="outlined" className={classes.fieldset}>
            <FormLabel component="legend" className={classes.legend}>
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

              <Grid item xs={9.5}>
                <TextField
                  variant="outlined"
                  fullWidth
                  disabled={cannotEdit}
                  id="shipment-name"
                  name="shipment-name"
                  label="Shipment Name"
                  autoComplete="shipment-name"
                  onBlur={(e) => handleBlur(e, 'required', shipmentName, 'shipment-name')}
                  {...shipmentName.bind}
                />
              </Grid>
              <Grid item xs={0.5} className={classes.outerAsterisk}>*</Grid>

              <Grid item xs={5.75}>
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

              <Grid item xs={5.75}>
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

              <Grid item xs={10}>
                <FormControl fullWidth component="fieldset" variant="outlined" className={classes.attachedFiles}>
                  <FormLabel component="legend" className={classes.legend}>
                    Attached Files
                  </FormLabel>

                  <Stack direction="row" spacing={1}>
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
              <Grid item xs={1.5} className={classes.fileButton}>
                <TextField
                  variant="outlined"
                  fullWidth
                  type="file"
                  id="attach-files"
                  name="attach-files"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ multiple: true }}
                  onChange={fileChange}
                />
              </Grid>

              <Grid item xs={12}>
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
                    <Grid item xs={11.5}>
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

                    <Grid item xs={0.5}>
                      <Button
                        type="button"
                        disabled={cannotEdit}
                        onClick={(e) => {
                          note.setValue('');
                          setShowNote(false);
                        }}
                      >
                        <CancelIcon fontSize="large" className={classes.cancel} />
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </Grid>

              {!_.isEmpty(additionalCustodians)
              && _.map(additionalCustodians, (addCust, index) => (
                <Grid item xs={12} key={`${index}-${addCust.custodian_uuid}`}>
                  <Grid container spacing={4}>
                    <Grid item xs={5.5}>
                      <TextField
                        id={`add-cust-${addCust.custodian_uuid}`}
                        select
                        fullWidth
                        disabled={cannotEdit}
                        placeholder="Select..."
                        label={`Custodian ${index + 1}`}
                        value={addCust}
                        onChange={(e) => {
                          const newList = _.map(
                            additionalCustodians,
                            (cust, idx) => (idx === index ? e.target.value : cust),
                          );
                          setAdditionalCustocations(newList);
                        }}
                        InputLabelProps={{ shrink: true }}
                        SelectProps={{ displayEmpty: true }}
                      >
                        <MenuItem value="">Select</MenuItem>
                        {!_.isEmpty(custodianList)
                        && _.map(_.without(
                          custodianList,
                          _.find(custodianList, { url: originCustodian }),
                          ..._.without(additionalCustodians, addCust),
                          _.find(custodianList, { url: destinationCustodian }),
                        ), (cust) => (
                          <MenuItem key={cust.custodian_uuid} value={cust}>
                            {cust.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={2.5}>
                      <TextField
                        variant="outlined"
                        id={`add-cust-abb-${addCust.custodian_uuid}`}
                        label="ID"
                        fullWidth
                        disabled
                        value={addCust.abbrevation}
                      />
                    </Grid>

                    <Grid item xs={3.5}>
                      <TextField
                        variant="outlined"
                        id={`add-cust-type-${addCust.custodian_uuid}`}
                        label="Custodian Type"
                        fullWidth
                        disabled
                        value={addCust.type}
                      />
                    </Grid>

                    <Grid item xs={0.5}>
                      <Button
                        type="button"
                        disabled={cannotEdit}
                        onClick={(e) => {
                          const newList = _.filter(
                            additionalCustodians,
                            (cust, idx) => (idx !== index),
                          );
                          setAdditionalCustocations(newList);
                        }}
                      >
                        <CancelIcon fontSize="large" className={classes.cancel} />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              ))}

              <Grid item xs={11.5}>
                {showAddCustodian && (
                  <TextField
                    variant="outlined"
                    id="additional-custodian"
                    select
                    fullWidth
                    disabled={cannotEdit}
                    placeholder="Select..."
                    label="Add carriers/warehouses"
                    onChange={(e) => {
                      setAdditionalCustocations([...additionalCustodians, e.target.value]);
                      setShowAddCustodian(false);
                    }}
                    InputLabelProps={{ shrink: true }}
                    SelectProps={{ displayEmpty: true }}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {!_.isEmpty(custodianList)
                    && _.map(_.without(
                      custodianList,
                      _.find(custodianList, { url: originCustodian }),
                      ...additionalCustodians,
                      _.find(custodianList, { url: destinationCustodian }),
                    ), (cust) => (
                      <MenuItem key={cust.custodian_uuid} value={cust}>
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

          <FormControl fullWidth component="fieldset" variant="outlined" className={classes.fieldset}>
            <FormLabel component="legend" className={classes.legend}>
              Tracker
            </FormLabel>

            <Grid container spacing={isDesktop ? 4 : 0}>
              <Grid item xs={5.5}>
                <TextField
                  id="gateway-type"
                  select
                  fullWidth
                  placeholder="Select..."
                  label="Tracker platform"
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
                  {!_.isEmpty(gatewayTypeList) && _.map(gatewayTypeList, (gtype) => (
                    <MenuItem key={gtype.id} value={gtype.name}>
                      {_.upperFirst(gtype.name)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={0.5} className={classes.outerAsterisk}>*</Grid>

              <Grid item xs={5.75}>
                <TextField
                  id="gateway"
                  select
                  fullWidth
                  placeholder="Select..."
                  label="Tracker identifier"
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
                    <MenuItem key={avgt.gateway_uuid} value={avgt}>
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
              <Grid item xs={11.5} className={classes.gatewayDetails}>
                <Typography variant="body1" component="div">
                  Battery Level:
                </Typography>
                {gateway.value.last_known_battery_level
                && _.gte(_.toNumber(gateway.value.last_known_battery_level), 90) && (
                  <BatteryFullIcon htmlColor={theme.palette.success.main} />
                )}
                {gateway.value.last_known_battery_level
                && _.lt(_.toNumber(gateway.value.last_known_battery_level), 90)
                && _.gte(_.toNumber(gateway.value.last_known_battery_level), 60) && (
                  <Battery80Icon htmlColor={theme.palette.warning.main} />
                )}
                {gateway.value.last_known_battery_level
                && _.lt(_.toNumber(gateway.value.last_known_battery_level), 60) && (
                  <Battery50Icon htmlColor={theme.palette.error.main} />
                )}
                {!gateway.value.last_known_battery_level && (
                  <BatteryFullIcon />
                )}
                <Typography variant="body1" component="div">
                  {gateway.value.last_known_battery_level ? `${gateway.value.last_known_battery_level}%` : 'N/A'}
                </Typography>
              </Grid>
            )}
            {gateway && gateway.value && (
              <Grid item xs={12}>
                <Grid container spacing={4}>
                  <Grid item xs={6} />
                  <Grid item xs={2.75}>
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
                  <Grid item xs={2.75}>
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
                        _.filter(TIVE_GATEWAY_TIMES, (t) => t.value <= transmissionInterval.value),
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
            )}
          </FormControl>

          <Grid container spacing={2} className={classes.finalName}>
            <Grid item xs={3}>
              <Typography>ID</Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography>SHIPMENT NAME</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>ORIGIN</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>DEST</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                id="org-id-final"
                fullWidth
                disabled
                className={classes.finalNameDisplay}
                value={organization && organization.abbrevation}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                variant="outlined"
                id="shipment-name-final"
                fullWidth
                disabled
                className={classes.finalNameDisplay}
                value={shipmentName.value}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                variant="outlined"
                id="origin-final"
                fullWidth
                disabled
                className={classes.finalNameDisplay}
                value={originAbb}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                variant="outlined"
                id="dest-final"
                fullWidth
                disabled
                className={classes.finalNameDisplay}
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
            <Grid item xs={5.5} mt={5}>
              <Button type="button" variant="outlined" fullWidth onClick={(e) => history.push(routes.SHIPMENT)} className={classes.actionButtons}>
                Cancel
              </Button>
            </Grid>

            <Grid item xs={5.5} mt={5}>
              {!gateway.value && (
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading || submitDisabled() || cannotEdit}
                  onClick={(e) => handleSubmit(e, true)}
                  className={classes.actionButtons}
                >
                  Save as Draft
                </Button>
              )}
              {gateway.value && (
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading || submitDisabled()}
                  onClick={(e) => handleSubmit(e, false)}
                  className={classes.actionButtons}
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
          className={classes.saveTemplateModal}
        >
          {loading && <Loader open={loading} />}
          <DialogTitle id="save-template-title">
            {!saveAsName && 'All Templates'}
            {saveAsName && 'Save template as...'}
            <IconButton
              aria-label="save-template-close"
              className={classes.closeButton}
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
              loading={loading}
              rows={templateRows}
              columns={[
                {
                  name: 'name',
                  label: 'Template Name',
                  options: {
                    sort: true,
                    sortThirdClickReset: true,
                    filter: true,
                    setCellProps: () => ({ style: { textDecoration: !saveAsName && 'underline', textDecoractionColor: !saveAsName && theme.palette.background.light } }),
                  },
                },
                ...templateColumns(
                  timezone,
                  _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
                    ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
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
                    handleTemplateChange(_.find(templates, { name: rowData[0] }) || '');
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
              <Grid container spacing={2} className={classes.modalActionButtons}>
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
          dispatch(deleteShipmentTemplate(template.id));
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

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.shipmentReducer,
  ...state.custodianReducer,
  ...state.optionsReducer,
  ...state.itemsReducer,
  ...state.sensorsGatewayReducer,
  loading: (
    state.shipmentReducer.loading
    || state.custodianReducer.loading
    || state.optionsReducer.loading
    || state.itemsReducer.loading
    || state.sensorsGatewayReducer.loading
    || state.authReducer.loading
  ),
});

export default connect(mapStateToProps)(CreateShipment);
