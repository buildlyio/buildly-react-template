/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, forwardRef } from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';
import { Grid, Typography } from '@mui/material';
import { getUser } from '@context/User.context';
import { getIconWithCount, tempUnit } from '@utils/constants';
import { dateDifference, formatDate } from '@utils/utilMethods';
import { isMobile } from '@utils/mediaQuery';
import '../ReportingStyles.css';

const ReportingDetailTable = forwardRef((props, ref) => {
  const {
    selectedShipment,
    allGatewayData,
    timeZone,
    sensorAlertData,
    theme,
    unitOfMeasure,
    sensorReportData,
    itemData,
    itemTypesData,
    sensorProcessedData,
  } = props;
  const userLanguage = getUser().user_language;
  const dateFormat = _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
    ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
    : '';
  const timeFormat = _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
    ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
    : '';

  const [trackerActivationDate, setTrackerActivationDate] = useState();
  const [updatedTransitAlerts, setUpdatedTransitAlerts] = useState([]);
  const [updatedStorageAlerts, setUpdatedStorageAlerts] = useState([]);
  const [originCustodianName, setOriginCustodianName] = useState();
  const [originCustodianLocation, setOriginCustodianLocation] = useState();
  const [destinationCustodianName, setDestinationCustodianName] = useState();
  const [destinationCustodianLocation, setDestinationCustodianLocation] = useState();
  const [maxTransitTempEntry, setMaxTransitTempEntry] = useState();
  const [minTransitTempEntry, setMinTransitTempEntry] = useState();
  const [maxStorageTempEntry, setMaxStorageTempEntry] = useState();
  const [minStorageTempEntry, setMinStorageTempEntry] = useState();
  const [maxTransitHumEntry, setMaxTransitHumEntry] = useState();
  const [minTransitHumEntry, setMinTransitHumEntry] = useState();
  const [maxStorageHumEntry, setMaxStorageHumEntry] = useState();
  const [minStorageHumEntry, setMinStorageHumEntry] = useState();
  const [maxShockEntry, setMaxShockEntry] = useState();
  const [maxLightEntry, setMaxLightEntry] = useState();
  const [intermediateCustodians, setIntermediateCustodians] = useState();
  const [items, setItems] = useState();
  const isMobileDevice = isMobile();

  useEffect(() => {
    if (!_.isEmpty(selectedShipment)) {
      const selectedTracker = _.find(allGatewayData, (item) => item.name === selectedShipment.tracker);
      const trackerActiveDate = formatDate(((selectedTracker && selectedTracker.activation_date) || selectedShipment.create_date), timeZone, `${dateFormat} ${timeFormat} z`);
      const origin = _.filter(selectedShipment.custody_info, (item) => item.first_custody === true)[0].custodian_name;
      const originCustodianUrl = _.filter(selectedShipment.custody_info, (item) => item.first_custody === true)[0].custodian_data.contact_data[0];
      const originLoc = _.filter(selectedShipment.contact_info, (item) => item.url === originCustodianUrl)[0];
      const destination = _.filter(selectedShipment.custody_info, (item) => item.last_custody === true)[0].custodian_name;
      const destinationCustodianUrl = _.filter(selectedShipment.custody_info, (item) => item.last_custody === true)[0].custodian_data.contact_data[0];
      const destinationLoc = _.filter(selectedShipment.contact_info, (item) => item.url === destinationCustodianUrl)[0];
      const custodians = _.chain(selectedShipment.custody_info)
        .filter((item) => item.first_custody !== true && item.last_custody !== true)
        .sortBy('load_id')
        .value();
      setTrackerActivationDate(trackerActiveDate);
      setOriginCustodianName(origin);
      setOriginCustodianLocation(originLoc);
      setDestinationCustodianName(destination);
      setDestinationCustodianLocation(destinationLoc);
      setIntermediateCustodians(custodians);
    }
  }, [selectedShipment]);

  useEffect(() => {
    if (!_.isEmpty(sensorAlertData) && !_.isEmpty(selectedShipment)) {
      const transitAlerts = selectedShipment && _.filter(sensorAlertData, (alert) => {
        const createDate = moment(alert.create_date).unix();
        return (
          createDate >= (moment(selectedShipment.actual_time_of_departure).unix())
          && createDate <= (moment(selectedShipment.actual_time_of_arrival).unix())
        );
      });
      const storageAlerts = _.filter(sensorAlertData, (alert) => {
        const createDate = moment(alert.create_date).unix();
        return !(
          createDate >= (moment(selectedShipment.actual_time_of_departure).unix())
          && createDate <= (moment(selectedShipment.actual_time_of_arrival).unix())
        );
      });
      let processedTransitAlerts = [];
      let processedStorageAlerts = [];
      _.forEach(transitAlerts, (alert) => {
        let color = '';
        let title = '';
        if (_.includes(alert.alert_type, 'max') || _.includes(alert.alert_type, 'shock') || _.includes(alert.alert_type, 'light')) {
          color = theme.palette.error.main;
          title = `Maximum ${_.capitalize(alert.parameter_type)} Excursion`;
        }
        if (_.includes(alert.alert_type, 'min')) {
          color = theme.palette.info.main;
          title = `Minimum ${_.capitalize(alert.parameter_type)} Excursion`;
        }
        const alertObj = { id: alert.parameter_type, color, title };
        const objFound = _.find(processedTransitAlerts, (obj) => obj.title === alertObj.title);
        if (!_.isEmpty(objFound)) {
          objFound.count += 1;
        } else {
          alertObj.count = 1;
          processedTransitAlerts = [...processedTransitAlerts, alertObj];
        }
      });
      _.forEach(storageAlerts, (alert) => {
        let color = '';
        let title = '';
        if (_.includes(alert.alert_type, 'max') || _.includes(alert.alert_type, 'shock') || _.includes(alert.alert_type, 'light')) {
          color = theme.palette.error.main;
          title = `Maximum ${_.capitalize(alert.parameter_type)} Excursion`;
        }
        if (_.includes(alert.alert_type, 'min')) {
          color = theme.palette.info.main;
          title = `Minimum ${_.capitalize(alert.parameter_type)} Excursion`;
        }
        const alertObj = { id: alert.parameter_type, color, title };
        const objFound = _.find(processedStorageAlerts, (obj) => obj.title === alertObj.title);
        if (!_.isEmpty(objFound)) {
          objFound.count += 1;
          _.remove(processedStorageAlerts, (obj) => obj.title === objFound.title);
          processedStorageAlerts = [...processedStorageAlerts, objFound];
        } else {
          alertObj.count = 1;
          processedStorageAlerts = [...processedStorageAlerts, alertObj];
        }
      });
      setUpdatedTransitAlerts(processedTransitAlerts);
      setUpdatedStorageAlerts(processedStorageAlerts);
    }
  }, [sensorAlertData, selectedShipment]);

  useEffect(() => {
    if (!_.isEmpty(sensorReportData) && !_.isEmpty(selectedShipment)) {
      const transitReports = _.filter(sensorReportData, (report) => {
        const createDate = moment(report.create_date).unix();
        return (
          createDate >= (moment(selectedShipment.actual_time_of_departure).unix())
          && createDate <= (moment(selectedShipment.actual_time_of_arrival).unix())
        );
      });
      const storageReports = _.filter(sensorReportData, (report) => {
        const createDate = moment(report.create_date).unix();
        return !(
          createDate >= (moment(selectedShipment.actual_time_of_departure).unix())
          && createDate <= (moment(selectedShipment.actual_time_of_arrival).unix())
        );
      });
      const transitReportMaxTempEntry = transitReports && transitReports
        .filter((entry) => entry.report_entry && entry.report_entry.report_temp_fah != null)
        .reduce((max, entry) => (entry.report_entry.report_temp_fah > max.report_entry.report_temp_fah ? entry : max), transitReports[0]);
      const transitReportMinTempEntry = transitReports && transitReports
        .filter((entry) => entry.report_entry && entry.report_entry.report_temp_fah != null)
        .reduce((min, entry) => (entry.report_entry.report_temp_fah < min.report_entry.report_temp_fah ? entry : min), transitReports[0]);
      const storageReportMaxTempEntry = storageReports && storageReports
        .filter((entry) => entry.report_entry && entry.report_entry.report_temp_fah != null)
        .reduce((max, entry) => (entry.report_entry.report_temp_fah > max.report_entry.report_temp_fah ? entry : max), storageReports[0]);
      const storageReportMinTempEntry = storageReports && storageReports
        .filter((entry) => entry.report_entry && entry.report_entry.report_temp_fah != null)
        .reduce((min, entry) => (entry.report_entry.report_temp_fah < min.report_entry.report_temp_fah ? entry : min), storageReports[0]);
      const transitReportMaxHumEntry = transitReports && transitReports
        .filter((entry) => entry.report_entry && entry.report_entry.report_humidity != null)
        .reduce((max, entry) => (entry.report_entry.report_humidity > max.report_entry.report_humidity ? entry : max), transitReports[0]);
      const transitReportMinHumEntry = transitReports && transitReports
        .filter((entry) => entry.report_entry && entry.report_entry.report_humidity != null)
        .reduce((min, entry) => (entry.report_entry.report_humidity < min.report_entry.report_humidity ? entry : min), transitReports[0]);
      const storageReportMaxHumEntry = storageReports && storageReports
        .filter((entry) => entry.report_entry && entry.report_entry.report_humidity != null)
        .reduce((max, entry) => (entry.report_entry.report_humidity > max.report_entry.report_humidity ? entry : max), storageReports[0]);
      const storageReportMinHumEntry = storageReports && storageReports
        .filter((entry) => entry.report_entry && entry.report_entry.report_humidity != null)
        .reduce((min, entry) => (entry.report_entry.report_humidity < min.report_entry.report_humidity ? entry : min), storageReports[0]);
      const reportMaxShockEntry = sensorReportData
        .filter((entry) => entry.report_entry && entry.report_entry_report_shock !== null)
        .reduce((max, entry) => (entry.report_entry.report_shock > max.report_entry.report_shock ? entry : max), sensorReportData[0]);
      const reportMaxLightEntry = sensorReportData
        .filter((entry) => entry.report_entry && entry.report_entry.report_light)
        .reduce((max, entry) => (entry.report_entry.report_light > max.report_entry.report_light ? entry : max), sensorReportData[0]);
    }
  }, [sensorReportData, selectedShipment]);

  useEffect(() => {
    if (selectedShipment && !_.isEmpty(itemData)) {
      const selectedItems = itemData.filter((obj) => selectedShipment.items.includes(obj.url));
      setItems(selectedItems);
    }
  }, [selectedShipment, itemData]);

  const displayTempValues = (temperature) => {
    const isFahrenheit = _.isEqual(_.toLower(_.find(unitOfMeasure, (unit) => _.isEqual(_.toLower(unit.unit_of_measure_for), 'temperature')).unit_of_measure), 'fahrenheit');
    const maxTemp = isFahrenheit
      ? temperature.report_entry.report_temp_fah
      : temperature.report_entry.report_temp_cel;
    const tempDifference = isFahrenheit
      ? (temperature.report_entry.report_temp_fah - _.orderBy(selectedShipment.max_excursion_temp, ['set_at'], ['desc'])[0].value).toFixed(2)
      : (temperature.report_entry.report_temp_cel - _.orderBy(selectedShipment.max_excursion_temp, ['set_at'], ['desc'])[0].value).toFixed(2);
    const sign = tempDifference > 0 ? '+' : '';
    const unitTemp = tempUnit(_.find(unitOfMeasure, (unit) => _.isEqual(_.toLower(unit.unit_of_measure_for), 'temperature')));
    return `${maxTemp} ${unitTemp} (${sign}${tempDifference} ${unitTemp})`;
  };

  const convertSecondsToFormattedTime = (title, value, spanClass) => {
    let seconds = value;
    const days = Math.floor(seconds / (24 * 3600));
    seconds %= (24 * 3600);
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    const transitTimestamp1 = moment(selectedShipment.actual_time_of_departure);
    const transitTimestamp2 = moment(selectedShipment.actual_time_of_arrival);
    const transitPercentage = (value / ((transitTimestamp2 - transitTimestamp1) / 1000)) * 100;
    const storageTimestamp2 = moment(selectedShipment.actual_time_of_completion || selectedShipment.edit_date);
    const storagePercentage = (value / ((storageTimestamp2 - transitTimestamp2) / 1000)) * 100;

    return (
      <Typography fontWeight={700}>
        {`${title}: `}
        <span style={{ fontWeight: 500 }} className={spanClass}>
          {`${days} days, ${hours} hrs., ${minutes} min. `}
          {_.includes(title, 'Storage')
            ? `(${value ? storagePercentage.toFixed(2) : 0}% of Post-Transit/Storage)`
            : `(${value ? transitPercentage.toFixed(2) : 0}% of Transit)`}
        </span>
      </Typography>
    );
  };

  const displayItemText = (title, value, spanClass, translateClass) => (
    <Typography fontWeight={700}>
      {`${title}: `}
      {value && <span style={{ fontWeight: spanClass ? 500 : 400 }} className={`${!!spanClass && spanClass} ${!!translateClass && translateClass}`}>{value}</span>}
    </Typography>
  );

  return (
    <div ref={ref}>
      {!_.isEmpty(selectedShipment) && (
        <Grid container className="reportingDetailTableContainer">
          <Grid container className="reportingDetailTableHeader">
            <Grid item xs={6} sm={4} md={3} id="itemText">
              {displayItemText('Shipment Name', selectedShipment.name, null, 'notranslate')}
            </Grid>
            {!isMobileDevice && <Grid item sm={4} md={6} />}
            <Grid item xs={6} sm={4} md={3} id="itemText">
              <Typography fontWeight={700}>
                Tracker ID:
                {' '}
                <span style={{ fontWeight: 400 }}>{selectedShipment.tracker}</span>
                {' T: '}
                <span style={{ fontWeight: 400 }}>{`${selectedShipment.transmission_time} Min.`}</span>
                {' M: '}
                <span style={{ fontWeight: 400 }}>{`${selectedShipment.measurement_time} Min.`}</span>
              </Typography>
              {displayItemText('Activated', trackerActivationDate)}
            </Grid>
          </Grid>
          <Grid container className="reportingDetailTableBody">
            <Grid item xs={6} md={3} id="itemText">
              {displayItemText('Shipment Status', selectedShipment.status, null, _.lowerCase(userLanguage) !== 'english' ? 'translate' : 'notranslate')}
            </Grid>
            <Grid item xs={6} md={3} id="itemText">
              {displayItemText('Pre-Transit Excursions', 'None')}
            </Grid>
            <Grid item xs={6} md={3} display="flex" flexWrap="wrap" id="itemText">
              <Typography fontWeight={700} marginRight={1}>
                Transit Excursions:
              </Typography>
              <span style={{ fontWeight: 400, display: 'flex', flexWrap: 'wrap' }}>
                {!_.isEmpty(updatedTransitAlerts)
                  ? _.map(updatedTransitAlerts, (item, idx) => (
                    <span key={`icon-${idx}-${item.id}`} style={{ display: 'flex' }}>
                      {getIconWithCount(item)}
                      {_.isEqual(idx, _.size(updatedTransitAlerts) - 1) ? ' ' : ', '}
                    </span>
                  ))
                  : 'None'}
              </span>
            </Grid>
            <Grid item xs={6} md={3} display="flex" flexWrap="wrap" id="itemText">
              <Typography fontWeight={700} marginRight={1}>
                Post-Transit/Storage Excursions:
              </Typography>
              <span style={{ fontWeight: 400, display: 'flex', flexWrap: 'wrap' }}>
                {!_.isEmpty(updatedStorageAlerts)
                  ? _.map(updatedStorageAlerts, (item, idx) => (
                    <span key={`icon-${idx}-${item.id}`} style={{ display: 'flex' }}>
                      {getIconWithCount(item)}
                      {_.isEqual(idx, _.size(updatedStorageAlerts) - 1) ? ' ' : ', '}
                    </span>
                  ))
                  : 'None'}
              </span>
            </Grid>
          </Grid>
          <Grid container className="reportingDetailTableBody">
            <Grid item xs={6} sm={4} md={3} id="itemText">
              {displayItemText('Shipment Origin Custodian', originCustodianName, null, 'notranslate')}
            </Grid>
            {!isMobileDevice && <Grid item sm={4} md={6} />}
            <Grid item xs={6} sm={4} md={3} id="itemText" fontWeight="700">
              {!_.isEmpty(originCustodianLocation) ? displayItemText('Shipment Origin Location', `${originCustodianLocation.address1}, ${originCustodianLocation.city}, ${originCustodianLocation.state}, ${originCustodianLocation.country}, ${originCustodianLocation.postal_code}`) : 'Shipment Origin Location'}
            </Grid>
          </Grid>
          <Grid container className="reportingDetailTableBody">
            <Grid item xs={6} sm={4} md={3} id="itemText">
              {displayItemText('Shipment Destination Custodian', destinationCustodianName, null, 'notranslate')}
            </Grid>
            {!isMobileDevice && <Grid item sm={4} md={6} />}
            <Grid item xs={6} sm={4} md={3} id="itemText" fontWeight="700">
              {!_.isEmpty(destinationCustodianLocation) ? displayItemText('Shipment Destination/Last Location', `${destinationCustodianLocation.address1}, ${destinationCustodianLocation.city}, ${destinationCustodianLocation.state}, ${destinationCustodianLocation.country}, ${destinationCustodianLocation.postal_code}`) : 'Shipment Destination/Last Location'}
            </Grid>
          </Grid>
          <Grid container className="reportingDetailTableBody">
            <Grid item xs={6} md={3} id="itemText">
              {displayItemText('Departure Timestamp', `${formatDate((selectedShipment.actual_time_of_departure || selectedShipment.estimated_time_of_departure), timeZone, `${dateFormat} ${timeFormat} z`)} ${selectedShipment.actual_time_of_departure ? '(Actual)' : '(Estimated)'}`)}
            </Grid>
            <Grid item xs={6} md={3} id="itemText">
              {displayItemText('Arrival/Last Location Timestamp', `${formatDate((selectedShipment.actual_time_of_arrival || selectedShipment.estimated_time_of_arrival), timeZone, `${dateFormat} ${timeFormat} z`)} ${selectedShipment.actual_time_of_arrival ? '(Actual)' : '(Estimated)'}`)}
            </Grid>
            <Grid item xs={6} md={3} id="itemText">
              {displayItemText('Shipment End Timestamp', formatDate((selectedShipment.actual_time_of_completion || selectedShipment.edit_date), timeZone, `${dateFormat} ${timeFormat} z`))}
            </Grid>
            <Grid item xs={6} md={3} id="itemText">
              {displayItemText('Shipment Total Timestamp', dateDifference(selectedShipment.create_date, selectedShipment.actual_time_of_completion || selectedShipment.edit_date))}
            </Grid>
          </Grid>
          <Grid container className="reportingDetailTableBody">
            <Grid item xs={6} md={3} id="itemText">
              {displayItemText('Maximum Temperature Threshold', `${_.orderBy(selectedShipment.max_excursion_temp, ['set_at'], ['desc'])[0].value}${tempUnit(_.find(unitOfMeasure, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'temperature'))))}`)}
            </Grid>
            <Grid item xs={6} md={3} id="itemText">
              {displayItemText('Transit Time', dateDifference(selectedShipment.actual_time_of_departure, selectedShipment.actual_time_of_arrival))}
            </Grid>
            <Grid item xs={6} md={3} id="itemText">
              {displayItemText('Post-Transit/Storage Time', dateDifference(selectedShipment.actual_time_of_arrival, selectedShipment.actual_time_of_completion || selectedShipment.edit_date))}
            </Grid>
            <Grid item xs={6} md={3} id="itemText">
              {displayItemText('Minimum Temperature Threshold', `${_.orderBy(selectedShipment.min_excursion_temp, ['set_at'], ['desc'])[0].value}${tempUnit(_.find(unitOfMeasure, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'temperature'))))}`)}
            </Grid>
          </Grid>
          <Grid container className="reportingDetailTableBody">
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {!_.isEmpty(maxTransitTempEntry) ? displayItemText('Transit Max. Temp.', displayTempValues(maxTransitTempEntry), 'reportingRedText') : 'Transit Max. Temp.: NA'}
            </Grid>
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {!_.isEmpty(minTransitTempEntry) ? displayItemText('Transit Min. Temp.', `${_.isEqual(_.toLower(_.find(unitOfMeasure, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'temperature'))).unit_of_measure), 'fahrenheit') ? minTransitTempEntry.report_entry.report_temp_fah : minTransitTempEntry.report_entry.report_temp_cel}${tempUnit(_.find(unitOfMeasure, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'temperature'))))}`, 'reportingGreenText') : 'Transit Min. Temp.: NA'}
            </Grid>
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {!_.isEmpty(maxStorageTempEntry) ? displayItemText('Post-Transit/Storage Max. Temp.', displayTempValues(maxStorageTempEntry), 'reportingRedText') : 'Post-Transit/Storage Max. Temp.: NA'}
            </Grid>
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {!_.isEmpty(minStorageTempEntry) ? displayItemText('Post-Transit/Storage Min. Temp.', `${_.isEqual(_.toLower(_.find(unitOfMeasure, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'temperature'))).unit_of_measure), 'fahrenheit') ? minStorageTempEntry.report_entry.report_temp_fah : minStorageTempEntry.report_entry.report_temp_cel}${tempUnit(_.find(unitOfMeasure, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'temperature'))))}`, 'reportingGreenText') : 'Post-Transit/Storage Min. Temp.: NA'}
            </Grid>
          </Grid>
          <Grid container className="reportingDetailTableBody">
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {!_.isEmpty(sensorProcessedData) ? convertSecondsToFormattedTime('Transit Time within Temp. Range', sensorProcessedData.transit_within_temperature, 'reportingGreenText') : 'Transit Time within Temp. Range: NA'}
            </Grid>
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {!_.isEmpty(sensorProcessedData) ? convertSecondsToFormattedTime('Transit Time outside Temp. Range', sensorProcessedData.transit_outside_temperature, 'reportingRedText') : 'Transit Time outside Temp. Range: NA'}
            </Grid>
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {!_.isEmpty(sensorProcessedData) ? convertSecondsToFormattedTime('Post-Transit/Storage Time within Temp. Range', sensorProcessedData.post_within_temperature, 'reportingGreenText') : 'Post-Transit/Storage Time within Temp. Range: NA'}
            </Grid>
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {!_.isEmpty(sensorProcessedData) ? convertSecondsToFormattedTime('Post-Transit/Storage Time outside Temp. Range', sensorProcessedData.post_outside_temperature, 'reportingRedText') : 'Post-Transit/Storage Time outside Temp. Range: NA'}
            </Grid>
          </Grid>
          <Grid container className="reportingDetailTableBody">
            <Grid item xs={6} sm={4} md={3} id="itemText">
              {displayItemText('Maximum Humidity Threshold', `${_.orderBy(selectedShipment.max_excursion_humidity, ['set_at'], ['desc'])[0].value}%`)}
            </Grid>
            {!isMobileDevice && <Grid item xs={0} sm={4} md={6} />}
            <Grid item xs={6} sm={4} md={3} id="itemText">
              {displayItemText('Minumum Humidity Threshold', `${_.orderBy(selectedShipment.min_excursion_humidity, ['set_at'], ['desc'])[0].value}%`)}
            </Grid>
          </Grid>
          <Grid container className="reportingDetailTableBody">
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {!_.isEmpty(maxTransitHumEntry) ? displayItemText('Transit Max.Hum.', `${maxTransitHumEntry.report_entry.report_humidity}%`, 'reportingRedText') : 'Transit Max.Hum.: NA'}
            </Grid>
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {!_.isEmpty(minTransitHumEntry) ? displayItemText('Transit Min. Hum.', `${minTransitHumEntry.report_entry.report_humidity}%`, 'reportingGreenText') : 'Transit Min. Hum.: NA'}
            </Grid>
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {!_.isEmpty(maxStorageHumEntry) ? displayItemText('Post-Transit/Storage Max. Hum.', `${maxStorageHumEntry.report_entry.report_humidity}%`, 'reportingRedText') : 'Post-Transit/Storage Max. Hum.: NA'}
            </Grid>
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {!_.isEmpty(minStorageHumEntry) ? displayItemText('Post-Transit/Storage Min. Hum.', `${minStorageHumEntry.report_entry.report_humidity}%`, 'reportingGreenText') : 'Post-Transit/Storage Min. Hum.: NA'}
            </Grid>
          </Grid>
          <Grid container className="reportingDetailTableBody">
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {!_.isEmpty(sensorProcessedData) ? convertSecondsToFormattedTime('Transit Time within Hum. Range', sensorProcessedData.transit_within_humidity, 'reportingGreenText') : 'Transit Time within Hum. Range: NA'}
            </Grid>
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {!_.isEmpty(sensorProcessedData) ? convertSecondsToFormattedTime('Transit Time outside Hum. Range', sensorProcessedData.transit_outside_humidity, 'reportingRedText') : 'Transit Time outside Hum. Range: NA'}
            </Grid>
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {!_.isEmpty(sensorProcessedData) ? convertSecondsToFormattedTime('Post-Transit/Storage Time within Hum. Range', sensorProcessedData.post_within_humidity, 'reportingGreenText') : 'Post-Transit/Storage Time within Hum. Range: NA'}
            </Grid>
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {!_.isEmpty(sensorProcessedData) ? convertSecondsToFormattedTime('Post-Transit/Storage Time outside Hum. Range', sensorProcessedData.post_outside_humidity, 'reportingRedText') : 'Post-Transit/Storage Time outside Hum. Range: NA'}
            </Grid>
          </Grid>
          <Grid container className="reportingDetailTableBody">
            <Grid item xs={6} md={3} id="itemText">
              {displayItemText('Transit/Storage Shock Threshold', `${_.orderBy(selectedShipment.shock_threshold, ['set_at'], ['desc'])[0].value.toFixed(2)} G`)}
            </Grid>
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {!_.isEmpty(maxShockEntry) ? displayItemText('Transit/Storage Max. Shock', `${maxShockEntry.report_entry.report_shock.toFixed(2)} G`, 'reportingRedText') : 'Transit/Storage Max. Shock: NA'}
            </Grid>
            <Grid item xs={6} md={3} id="itemText">
              {displayItemText('Transit/Storage Light Threshold', `${_.orderBy(selectedShipment.light_threshold, ['set_at'], ['desc'])[0].value.toFixed(2)} LUX`)}
            </Grid>
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {!_.isEmpty(maxLightEntry) ? displayItemText('Transit/Storage Max. Light', `${maxLightEntry.report_entry.report_light.toFixed(2)} LUX`, 'reportingRedText') : 'Transit/Storage Max. Light: NA'}
            </Grid>
          </Grid>
          {!_.isEmpty(intermediateCustodians) && (
            <Grid container className="reportingDetailTableBody">
              {_.map(intermediateCustodians, (item, index) => {
                const { custodian_name, custodian_data: { custodian_type } } = item;
                let custodianRole;
                if (_.includes(custodian_type, '1')) {
                  custodianRole = 'Shipper';
                } else if (_.includes(custodian_type, '2')) {
                  custodianRole = 'Logistics Provider';
                } else if (_.includes(custodian_type, '3')) {
                  custodianRole = 'Warehouse';
                } else if (_.includes(custodian_type, '4')) {
                  custodianRole = 'Receiver';
                }
                return (
                  <Grid key={`${item}-${index}`} item xs={6} md={3} id="itemText">
                    {displayItemText(`Intermediate Custodian ${index + 1} (${custodianRole})`, custodian_name, null, 'notranslate')}
                  </Grid>
                );
              })}
              {!isMobileDevice && (
                <Grid
                  item
                  xs={0}
                  md={_.size(intermediateCustodians) % 4 === 1
                    ? 8
                    : _.size(intermediateCustodians) % 4 === 2
                      ? 6
                      : _.size(intermediateCustodians) % 4 === 3
                        ? 3
                        : 0}
                />
              )}
            </Grid>
          )}
          {!_.isEmpty(items) && !_.isEmpty(itemTypesData) && (
            _.map(items, (item, index) => (
              <Grid key={`${item}-${index}`} container className="reportingDetailTableBody">
                <Grid item xs={6} md={3} id="itemText">
                  {displayItemText('Item Name', item.name, null, 'notranslate')}
                </Grid>
                <Grid item xs={6} md={3} id="itemText">
                  {displayItemText('# of Units', item.number_of_units)}
                </Grid>
                <Grid item xs={6} md={3} id="itemText">
                  {displayItemText('Item Type', itemTypesData.filter((it) => it.url === item.item_type)[0].name)}
                </Grid>
                <Grid item xs={6} md={3} id="itemText">
                  {displayItemText('Gross Weight', `${item.gross_weight} Pounds`)}
                </Grid>
              </Grid>
            ))
          )}
        </Grid>
      )}
      {_.isEmpty(selectedShipment) && (
        <Typography
          variant="h6"
          align="left"
          margin={2}
          marginBottom={3}
        >
          Select a shipment to view reporting data
        </Typography>
      )}
    </div>
  );
});

export default ReportingDetailTable;
