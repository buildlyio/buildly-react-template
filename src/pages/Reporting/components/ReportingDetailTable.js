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
  const tempDisplayUnit = tempUnit(_.find(unitOfMeasure, (unit) => _.isEqual(_.toLower(unit.unit_of_measure_for), 'temperature')));
  const tempMeasure = !_.isEmpty(unitOfMeasure) && _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'temperature')).unit_of_measure;
  const dateFormat = _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date'))
    ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'date')).unit_of_measure
    : '';
  const timeFormat = _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time'))
    ? _.find(unitOfMeasure, (unit) => (_.toLower(unit.unit_of_measure_for) === 'time')).unit_of_measure
    : '';

  // shipment thresholds
  const maxTempThreshold = selectedShipment && _.orderBy(selectedShipment.max_excursion_temp, ['set_at'], ['desc'])[0].value;
  const minTempThreshold = selectedShipment && _.orderBy(selectedShipment.min_excursion_temp, ['set_at'], ['desc'])[0].value;
  const maxHumThreshold = selectedShipment && _.orderBy(selectedShipment.max_excursion_humidity, ['set_at'], ['desc'])[0].value;
  const minHumThreshold = selectedShipment && _.orderBy(selectedShipment.min_excursion_humidity, ['set_at'], ['desc'])[0].value;
  const maxShockThreshold = selectedShipment && _.orderBy(selectedShipment.shock_threshold, ['set_at'], ['desc'])[0].value;
  const maxLightThreshold = selectedShipment && _.orderBy(selectedShipment.light_threshold, ['set_at'], ['desc'])[0].value;

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
      const transitAlerts = _.filter(sensorAlertData, (alert) => {
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
      const transitWithoutRecoveredAlerts = !_.isEmpty(transitAlerts) && _.filter(transitAlerts, (alert) => _.isEqual(alert.recovered_alert_id, null));
      const storageWithoutRecoveredAlerts = !_.isEmpty(storageAlerts) && _.filter(storageAlerts, (alert) => _.isEqual(alert.recovered_alert_id, null));
      let processedTransitAlerts = [];
      let processedStorageAlerts = [];
      _.forEach(transitWithoutRecoveredAlerts, (alert) => {
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
      _.forEach(storageWithoutRecoveredAlerts, (alert) => {
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
        const activationDate = moment(report.activation_date).unix();
        return (
          activationDate >= (moment(selectedShipment.actual_time_of_departure).unix())
          && activationDate <= (moment(selectedShipment.actual_time_of_arrival).unix())
        );
      });
      const storageReports = _.filter(sensorReportData, (report) => {
        const activationDate = moment(report.activation_date).unix();
        return (
          activationDate >= (moment(selectedShipment.actual_time_of_arrival).unix())
          && activationDate <= (moment(selectedShipment.actual_time_of_completion).unix())
        );
      });

      let transitReportMaxTempEntry = null;
      let transitReportMinTempEntry = null;
      let storageReportMaxTempEntry = null;
      let storageReportMinTempEntry = null;
      let transitReportMaxHumEntry = null;
      let transitReportMinHumEntry = null;
      let storageReportMaxHumEntry = null;
      let storageReportMinHumEntry = null;
      let reportMaxShockEntry = null;
      let reportMaxLightEntry = null;

      // Transit reports
      if (!_.isEmpty(transitReports)) {
        const transitHumEntries = _.map(transitReports, (tr) => tr.report_entry && tr.report_entry.report_humidity);
        const transitTempEntries = _.isEqual(_.toLower(tempMeasure), 'fahrenheit')
          ? _.map(transitReports, (tr) => tr.report_entry && tr.report_entry.report_temp_fah)
          : _.map(transitReports, (tr) => tr.report_entry && tr.report_entry.report_temp_cel);

        transitReportMaxTempEntry = _.max(transitTempEntries);
        transitReportMinTempEntry = _.min(transitTempEntries);
        transitReportMaxHumEntry = _.max(transitHumEntries);
        transitReportMinHumEntry = _.min(transitHumEntries);
      }

      // Storage reports
      if (!_.isEmpty(storageReports)) {
        const storageHumEntries = _.map(storageReports, (tr) => tr.report_entry && tr.report_entry.report_humidity);
        const storageTempEntries = _.isEqual(_.toLower(tempMeasure), 'fahrenheit')
          ? _.map(storageReports, (tr) => tr.report_entry && tr.report_entry.report_temp_fah)
          : _.map(storageReports, (tr) => tr.report_entry && tr.report_entry.report_temp_cel);

        storageReportMaxTempEntry = _.max(storageTempEntries);
        storageReportMinTempEntry = _.min(storageTempEntries);
        storageReportMaxHumEntry = _.max(storageHumEntries);
        storageReportMinHumEntry = _.min(storageHumEntries);
      }

      // Reports
      if (!_.isEmpty(sensorReportData)) {
        const reportShockEntries = _.map(sensorReportData, (tr) => tr.report_entry && tr.report_entry.report_shock);
        const reportLightEntries = _.map(sensorReportData, (tr) => tr.report_entry && tr.report_entry.report_light);
        reportMaxShockEntry = _.max(reportShockEntries);
        reportMaxLightEntry = _.max(reportLightEntries);

        if (reportMaxShockEntry) {
          reportMaxShockEntry = reportMaxShockEntry.toFixed(2);
        }
        if (reportMaxLightEntry) {
          reportMaxLightEntry = reportMaxLightEntry.toFixed(2);
        }
      }

      setMaxTransitTempEntry(transitReportMaxTempEntry);
      setMinTransitTempEntry(transitReportMinTempEntry);
      setMaxStorageTempEntry(storageReportMaxTempEntry);
      setMinStorageTempEntry(storageReportMinTempEntry);
      setMaxTransitHumEntry(transitReportMaxHumEntry);
      setMinTransitHumEntry(transitReportMinHumEntry);
      setMaxStorageHumEntry(storageReportMaxHumEntry);
      setMinStorageHumEntry(storageReportMinHumEntry);
      setMaxShockEntry(reportMaxShockEntry);
      setMaxLightEntry(reportMaxLightEntry);
    }
  }, [sensorReportData, selectedShipment]);

  useEffect(() => {
    if (selectedShipment && !_.isEmpty(itemData)) {
      const selectedItems = itemData.filter((obj) => selectedShipment.items.includes(obj.url));
      setItems(selectedItems);
    }
  }, [selectedShipment, itemData]);

  const displayTempValues = (temperature) => {
    let returnValue = `${temperature} ${tempDisplayUnit}`;
    if (_.gt(temperature, maxTempThreshold) || _.lt(temperature, minTempThreshold)) {
      const limitTemp = _.gt(temperature, maxTempThreshold) ? maxTempThreshold : minTempThreshold;
      const tempDifference = (temperature - limitTemp).toFixed(2);
      const sign = tempDifference > 0 ? '+' : '';
      returnValue = `${returnValue} (${sign}${tempDifference} ${tempDisplayUnit})`;
    }

    return returnValue;
  };

  const displayTextColor = (value, limitType) => {
    let returnClass = 'reportingGreenText';

    // Temp check
    if (_.isEqual(limitType, 'temp')) {
      if (value && _.gt(value, maxLightThreshold)) {
        returnClass = 'reportingRedText';
      }
      if (value && _.lt(value, minTempThreshold)) {
        returnClass = 'reportingInfoText';
      }
    }

    // Hum check
    if (_.isEqual(limitType, 'hum')) {
      if (value && _.gt(value, maxHumThreshold)) {
        returnClass = 'reportingRedText';
      }
      if (value && _.lt(value, minHumThreshold)) {
        returnClass = 'reportingInfoText';
      }
    }

    // shock check
    if (_.isEqual(limitType, 'shock')) {
      if (value && _.gt(value, maxShockThreshold)) {
        returnClass = 'reportingRedText';
      }
    }

    // light check
    if (_.isEqual(limitType, 'light')) {
      if (value && _.gt(value, maxLightThreshold)) {
        returnClass = 'reportingRedText';
      }
    }

    return returnClass;
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
      {_.includes(value, null) || _.includes(value, undefined)
        ? <span style={{ fontWeight: 400 }}>N/A</span>
        : <span style={{ fontWeight: spanClass ? 500 : 400 }} className={`${!!spanClass && spanClass} ${!!translateClass && translateClass}`}>{value}</span>}
    </Typography>
  );

  const displayThresholdData = (array, unit) => {
    const sortedArray = _.orderBy(array, ['set_at'], ['asc']);
    return sortedArray.map((item) => `${item.value} ${unit}`).join(', ');
  };

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
                <span className="notranslate" style={{ fontWeight: 400 }}>{selectedShipment.tracker}</span>
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
              {displayItemText('Maximum Temperature Threshold', `${displayThresholdData(selectedShipment.max_excursion_temp, tempDisplayUnit)}`)}
            </Grid>
            <Grid item xs={6} md={3} id="itemText">
              {displayItemText('Transit Time', dateDifference(selectedShipment.actual_time_of_departure, selectedShipment.actual_time_of_arrival))}
            </Grid>
            <Grid item xs={6} md={3} id="itemText">
              {displayItemText('Post-Transit/Storage Time', dateDifference(selectedShipment.actual_time_of_arrival, selectedShipment.actual_time_of_completion || selectedShipment.edit_date))}
            </Grid>
            <Grid item xs={6} md={3} id="itemText">
              {displayItemText('Minimum Temperature Threshold', `${displayThresholdData(selectedShipment.min_excursion_temp, tempDisplayUnit)}`)}
            </Grid>
          </Grid>
          <Grid container className="reportingDetailTableBody">
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {displayItemText('Transit Max. Temp.', displayTempValues(maxTransitTempEntry), displayTextColor(maxTransitTempEntry, 'temp'))}
            </Grid>
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {displayItemText('Transit Min. Temp.', displayTempValues(minTransitTempEntry), displayTextColor(minTransitTempEntry, 'temp'))}
            </Grid>
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {displayItemText('Post-Transit/Storage Max. Temp.', displayTempValues(maxStorageTempEntry), displayTextColor(maxStorageTempEntry, 'temp'))}
            </Grid>
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {displayItemText('Post-Transit/Storage Min. Temp.', displayTempValues(minStorageTempEntry), displayTextColor(minStorageTempEntry, 'temp'))}
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
              {displayItemText('Maximum Humidity Threshold', `${displayThresholdData(selectedShipment.max_excursion_humidity, '%')}`)}
            </Grid>
            {!isMobileDevice && <Grid item xs={0} sm={4} md={6} />}
            <Grid item xs={6} sm={4} md={3} id="itemText">
              {displayItemText('Minumum Humidity Threshold', `${displayThresholdData(selectedShipment.min_excursion_humidity, '%')}`)}
            </Grid>
          </Grid>
          <Grid container className="reportingDetailTableBody">
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {displayItemText('Transit Max.Hum.', `${maxTransitHumEntry}%`, displayTextColor(maxTransitHumEntry, 'hum'))}
            </Grid>
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {displayItemText('Transit Min. Hum.', `${minTransitHumEntry}%`, displayTextColor(minTransitHumEntry, 'hum'))}
            </Grid>
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {displayItemText('Post-Transit/Storage Max. Hum.', `${maxStorageHumEntry}%`, displayTextColor(maxStorageHumEntry, 'hum'))}
            </Grid>
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {displayItemText('Post-Transit/Storage Min. Hum.', `${minStorageHumEntry}%`, displayTextColor(minStorageHumEntry, 'hum'))}
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
              {displayItemText('Transit/Storage Shock Threshold', `${displayThresholdData(selectedShipment.shock_threshold, 'G')}`)}
            </Grid>
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {displayItemText('Transit/Storage Max. Shock', `${maxShockEntry} G`, displayTextColor(maxShockEntry, 'shock'))}
            </Grid>
            <Grid item xs={6} md={3} id="itemText">
              {displayItemText('Transit/Storage Light Threshold', `${displayThresholdData(selectedShipment.light_threshold, 'LUX')}`)}
            </Grid>
            <Grid item xs={6} md={3} id="itemText" fontWeight="700">
              {displayItemText('Transit/Storage Max. Light', `${maxLightEntry} LUX`, displayTextColor(maxLightEntry, 'light'))}
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
                    ? 9
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
