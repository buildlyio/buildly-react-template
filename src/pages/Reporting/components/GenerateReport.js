/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import React, { useState, useRef, useEffect } from 'react';
import _ from 'lodash';
import { toJpeg, toPng } from 'html-to-image';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  List,
  ListItem,
  Typography,
  useTheme,
} from '@mui/material';
import '../ReportingStyles.css';
import Loader from '@components/Loader/Loader';
import FormModal from '@components/Modal/FormModal';
import GraphComponent from '@components/GraphComponent/GraphComponent';
import { getUser } from '@context/User.context';
import { getIcon, REPORT_TYPES } from '@utils/constants';
import { isDesktop } from '@utils/mediaQuery';
import ReportGraph from './ReportGraph';

const GenerateReport = ({
  open,
  setOpen,
  tableRef,
  mapRef,
  tempGraphRef,
  humGraphRef,
  shockGraphRef,
  lightGraphRef,
  batteryGraphRef,
  downloadCSV,
  downloadExcel,
  reportPDFDownloadMutation,
  selectedShipment,
  isReportPDFDownloading,
  data,
  setData,
}) => {
  const user = getUser();
  const theme = useTheme();
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [selectedFormats, setSelectedFormats] = useState({
    csv: false,
    excel: false,
    pdf: false,
  });
  const selectedReport = !_.isEmpty(selectedShipment) && !_.isEmpty(data) && _.find(data, (obj) => obj.shipment_name === selectedShipment.name);

  const discardFormData = () => {
    setSelectedFormats({
      csv: false,
      excel: false,
      pdf: false,
    });
    setConfirmModal(false);
    setOpen(false);
  };

  const closeFormModal = () => {
    if (selectedFormats.csv || selectedFormats.excel || selectedFormats.pdf) {
      setConfirmModal(true);
    } else {
      setConfirmModal(false);
    }
    setOpen(false);
  };

  const handleFormatChange = (event) => {
    setSelectedFormats({
      ...selectedFormats,
      [event.target.name]: event.target.checked,
    });
  };

  async function captureScreenshot(ref, width, height) {
    try {
      if (ref.current) {
        const dataUrl = await toPng(ref.current, {
          quality: 1,
          backgroundColor: theme.palette.background.default,
          useCORS: true,
        });
        return dataUrl;
      }
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
    return null;
  }

  const generatePdfReport = async (event) => {
    event.preventDefault();
    setLoading(true);
    const base64DataArray = [];
    try {
      const dataUrl1 = await captureScreenshot(tableRef);
      const dataUrl2 = await captureScreenshot(mapRef);
      const dataUrl3 = await captureScreenshot(tempGraphRef);
      const dataUrl4 = await captureScreenshot(humGraphRef);
      const dataUrl5 = await captureScreenshot(shockGraphRef);
      const dataUrl6 = await captureScreenshot(lightGraphRef);
      const dataUrl7 = await captureScreenshot(batteryGraphRef);
      if (dataUrl1) base64DataArray.push(dataUrl1);
      if (dataUrl2) base64DataArray.push(dataUrl2);
      if (dataUrl3) base64DataArray.push(dataUrl3);
      if (dataUrl4) base64DataArray.push(dataUrl4);
      if (dataUrl5) base64DataArray.push(dataUrl5);
      if (dataUrl6) base64DataArray.push(dataUrl6);
      if (dataUrl7) base64DataArray.push(dataUrl7);
    } catch (error) {
      console.log(error);
    }
    const apiData = {
      shipment_name: selectedShipment.name,
      user_email: user.email,
      images_data: base64DataArray,
    };
    reportPDFDownloadMutation(apiData);
    setSelectedFormats({
      csv: false,
      excel: false,
      pdf: false,
    });
    setLoading(false);
    setOpen(false);
  };

  const downloadFiles = async (event) => {
    event.preventDefault();
    if (selectedFormats.csv) {
      await downloadCSV();
    }
    if (selectedFormats.excel) {
      await downloadExcel();
    }
    if (selectedFormats.pdf && selectedReport.pdfUrl) {
      const link = document.createElement('a');
      link.href = selectedReport.pdfUrl;
      link.target = '_blank';
      link.download = `${selectedShipment.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setOpen(false);
    setSelectedFormats({
      csv: false,
      excel: false,
      pdf: false,
    });
  };

  return (
    <div>
      <FormModal
        open={open}
        handleClose={closeFormModal}
        title="Generate Insights Report"
        openConfirmModal={openConfirmModal}
        setConfirmModal={setConfirmModal}
        handleConfirmModal={discardFormData}
      >
        {isLoading && <Loader open={isLoading} />}
        <form className="generateReportFormContainer" noValidate>
          <Grid container spacing={isDesktop() ? 2 : 0}>
            <Grid className="itemInputWithTooltip" item xs={12}>
              <Typography fontSize={18} fontWeight="500">Choose option(s) for which you want to download:</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={isDesktop() ? 2 : 0}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormGroup>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={selectedFormats.csv}
                        onChange={handleFormatChange}
                        name="csv"
                      />
                    )}
                    label="CSV File"
                  />
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={selectedFormats.excel}
                        onChange={handleFormatChange}
                        name="excel"
                      />
                    )}
                    label="Excel File"
                  />
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={selectedFormats.pdf}
                        onChange={handleFormatChange}
                        name="pdf"
                        disabled={(_.isEmpty(selectedReport) || (!_.isEmpty(selectedReport) && !selectedReport.pdfUrl))}
                      />
                    )}
                    label={!_.isEmpty(selectedReport) ? 'PDF File' : 'PDF report (generate may take several minutes)'}
                  />
                </FormGroup>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={3}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="generateReportButton"
                disabled={isReportPDFDownloading || (!_.isEmpty(selectedReport) && selectedReport.pdfUrl)}
                onClick={generatePdfReport}
              >
                Generate PDF Report
              </Button>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="generateReportButton"
                onClick={downloadFiles}
                disabled={
                  !(selectedFormats.csv || selectedFormats.excel || selectedFormats.pdf)
                }
              >
                Download
              </Button>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                type="button"
                fullWidth
                variant="outlined"
                color="primary"
                className="generateReportButton"
                onClick={discardFormData}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormModal>
    </div>
  );
};

export default GenerateReport;
