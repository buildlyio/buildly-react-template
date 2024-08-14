import React, { useEffect, useState } from 'react';
import _, { isArray } from 'lodash';
import moment from 'moment-timezone';
import {
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { CloudDownload as DownloadIcon } from '@mui/icons-material';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { SENSOR_REPORT_COLUMNS } from '@utils/constants';
import '../ReportingStyles.css';

const SensorReport = ({
  sensorReport,
  shipmentName,
  selectedShipment,
  selectedMarker,
  unitOfMeasure,
  timezone,
  downloadCSV,
  downloadExcel,
}) => {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const sortedData = _.orderBy(
      sensorReport,
      (item) => moment(item.timestamp),
      ['desc'],
    );
    setRows(sortedData);
  }, [sensorReport]);

  useEffect(() => {
    if (selectedMarker) {
      const highlightIndex = _.findIndex(rows, {
        lat: selectedMarker.lat, lng: selectedMarker.lng,
      });
      setSelected([highlightIndex]);
    } else {
      setSelected([]);
    }
  }, [selectedMarker]);

  const customSort = (data, colIndex, order, meta) => {
    if (colIndex === 1) {
      return _.orderBy(
        data,
        (item) => moment(item.data[colIndex]),
        [order],
      );
    }
    return data.sort((a, b) => (a.data[colIndex].length < b.data[colIndex].length
      ? -1
      : 1
    ) * (order === 'desc' ? 1 : -1));
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid className="reportingSensorRoot" container spacing={2}>
      <Grid item xs={12}>
        <div className="reportingSensorTooltip">
          <Typography
            className="reportingSensorReportTitle"
            variant="h5"
          >
            {shipmentName ? (
              <>
                <span>Sensor Report - Shipment: </span>
                <span className="notranslate">{shipmentName}</span>
              </>
            ) : 'Sensor Report'}
          </Typography>
        </div>
        <DataTableWrapper
          noSpace
          hideAddButton
          filename="SensorReportData"
          rows={rows}
          columns={SENSOR_REPORT_COLUMNS(
            unitOfMeasure,
            selectedShipment,
          )}
          selectable={{
            rows: 'multiple',
            rowsHeader: false,
            rowsHideCheckboxes: true,
          }}
          selected={selected}
          customSort={customSort}
          extraOptions={{
            customToolbar: () => (
              <>
                <Typography variant="caption" className="reportingSensorTableTitle">
                  <span style={{ fontStyle: 'italic', fontWeight: '700' }}>bold/italic alerts</span>
                  {' '}
                  indicates alerts outside of selected transmission
                </Typography>
                <Tooltip title="Download Options" placement="bottom">
                  <IconButton className="reportingSensorTableExcelDownload" onClick={handleMenuOpen}>
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem
                    onClick={() => {
                      downloadCSV();
                      handleMenuClose();
                    }}
                  >
                    Download CSV
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      downloadExcel();
                      handleMenuClose();
                    }}
                  >
                    Download Excel
                  </MenuItem>
                </Menu>
              </>
            ),
          }}
          className="reportingSensorDataTable"
          shouldUseAllColumns
        />
      </Grid>
    </Grid>
  );
};

export default SensorReport;
