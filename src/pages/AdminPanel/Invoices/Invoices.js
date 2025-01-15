/* eslint-disable no-plusplus */
/* eslint-disable new-cap */
/* eslint-disable no-console */
/* eslint-disable no-confusing-arrow */
import React, { useEffect, useState, useRef } from 'react';
import { Route } from 'react-router-dom';
import { useQuery } from 'react-query';
import _, { update } from 'lodash';
import moment from 'moment-timezone';
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Login as LoginIcon,
  Check as CheckIcon,
  Edit as EditIcon,
  AttachMoney as DollarIcon,
} from '@mui/icons-material';
import { getUser } from '@context/User.context';
import './InvoicesStyles.css';
import OrganizationSelector from '@components/OrganizationSelector/OrganizationSelector';
import { MONTHS } from '@utils/mock';
import { useInput } from '@hooks/useInput';
import useAlert from '@hooks/useAlert';
import { getAllOrganizationQuery } from '@react-query/queries/authUser/getAllOrganizationQuery';
import Loader from '@components/Loader/Loader';
import { checkForGlobalAdmin } from '@utils/utilMethods';
import { useWhatsappChargesMutation } from '@react-query/mutations/notifications/whatsappChargesMutation';
import { getTrackerOrderQuery } from '@react-query/queries/trackerorder/getTrackerOrderQuery';
import { useEditTrackerOrderMutation } from '@react-query/mutations/trackerorder/editTrackerOrderMutation';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Invoices = () => {
  const user = getUser();
  const org_uuid = user.organization.organization_uuid;
  const isSuperAdmin = checkForGlobalAdmin(user);
  const [organization, setOrganization] = useState(user.organization.name);
  const [mainMenuOpen, setMainMenuOpen] = useState(false);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [selectedMonthFirstDate, setSelectedMonthFirstDate] = useState();
  const [nextMonthFirstDate, setNextMonthFirstDate] = useState();
  const [ordersData, setOrdersData] = useState([]);
  const [isEditing, setIsEditing] = useState({
    field: null,
    index: null,
  });
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [formData, setFormData] = useState({
    shippingCost: '',
  });
  const [selectYear, setSelectYear] = useState('');
  const [selectMonth, setSelectMonth] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  const invoicesDetailsRef = useRef();

  const { displayAlert } = useAlert();

  const { data: orgData, isLoading: isLoadingOrgs } = useQuery(
    ['organizations'],
    () => getAllOrganizationQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: trackerOrderData, isLoading: isLoadingTrackerOrder } = useQuery(
    ['trackerOrders', org_uuid],
    () => getTrackerOrderQuery(org_uuid, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: whatsappChargesData, mutate: whatsappChargesMutation, isLoading: isWhatsappChargesLoading } = useWhatsappChargesMutation(displayAlert);

  const { mutate: editTrackerOrderMutation, isLoading: isTrackerOrderEditing } = useEditTrackerOrderMutation(org_uuid, displayAlert);

  useEffect(() => {
    const creationDate = moment(_.find(orgData, { name: organization })?.create_date);
    const currentYear = moment().year();
    const years = [];
    for (let year = creationDate.year(); year <= currentYear; year++) {
      years.push(year);
    }
    setAvailableYears(years);
  }, [organization, orgData]);

  useEffect(() => {
    if (selectYear) {
      const creationDate = moment(_.find(orgData, { name: organization })?.create_date);
      const currentYear = moment().year();
      const currentMonth = moment().month();
      const isCreationYear = parseInt(selectYear, 10) === creationDate.year();
      const isCurrentYear = parseInt(selectYear, 10) === currentYear;
      const months = [];

      MONTHS.forEach((mth, index) => {
        if (isCreationYear && !isCurrentYear && index >= creationDate.month()) {
          months.push(mth);
        } else if (isCreationYear && isCurrentYear && index >= creationDate.month() && index <= currentMonth) {
          months.push(mth);
        } else if (!isCreationYear && isCurrentYear && index <= currentMonth) {
          months.push(mth);
        } else if (!isCreationYear && !isCurrentYear) {
          months.push(mth);
        }
      });
      setAvailableMonths(months);
    } else {
      setAvailableMonths([]);
    }
  }, [selectYear, organization, orgData]);

  useEffect(() => {
    if (!_.isEmpty(trackerOrderData) && !_.isEmpty(selectedMonthFirstDate) && !_.isEmpty(nextMonthFirstDate)) {
      const filteredOrders = trackerOrderData.filter((order) => {
        const orderDate = moment(order.order_date);
        const startDate = moment(selectedMonthFirstDate);
        const endDate = moment(nextMonthFirstDate);
        return orderDate.isBetween(startDate, endDate, undefined, '[)');
      });
      setOrdersData(filteredOrders);
    }
  }, [trackerOrderData, selectedMonthFirstDate, nextMonthFirstDate]);

  useEffect(() => {
    let cost = 0;
    if (!_.isEmpty(whatsappChargesData)) {
      cost += (whatsappChargesData.total_whatsapp_messages * window.env.WHATSAPP_MSG_COST);
    }
    if (!_.isEmpty(ordersData)) {
      ordersData.forEach((item) => {
        cost += item.shipping_cost;
      });
    }
    setTotalCost(cost.toFixed(2));
  }, [whatsappChargesData, ordersData]);

  const handleOrganizationChange = (e) => {
    const organization_name = e.target ? e.target.value : e;
    if (!_.isEqual(organization, organization_name)) {
      setOrganization(organization_name);
    }
    setMainMenuOpen(false);
    setSubmenuAnchorEl(null);
  };

  const handleYearChange = (event) => {
    setSelectYear(event.target.value ? (parseInt(event.target.value, 10).toString()) : '');
    setSelectMonth('');
  };

  const handleMonthChange = (event) => {
    setSelectMonth(event.target.value);
  };

  const captureScreenshot = async (ref) => {
    if (ref.current) {
      try {
        const canvas = await html2canvas(ref.current, {
          useCORS: true,
        });
        return canvas.toDataURL('image/png');
      } catch (error) {
        console.error('Error capturing screenshot:', error);
      }
    }
    return null;
  };

  const generatePdfInvoice = async (event) => {
    event.preventDefault();
    setGeneratingPdf(true);
    const base64DataArray = [];
    try {
      const dataUrl = await captureScreenshot(invoicesDetailsRef);
      if (dataUrl) {
        const pdf = new jsPDF();
        const padding = 5;
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth() - 10;
        const pdfHeight = pdfWidth - ((imgProps.height * pdfWidth) / imgProps.width);
        pdf.addImage(dataUrl, 'PNG', padding, padding, pdfWidth, pdfHeight);
        pdf.save(`${_.toLower(organization)}_${_.toLower(selectMonth)}_invoice.pdf`);
      }
      setGeneratingPdf(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = () => {
    const adminOrgs = JSON.parse(localStorage.getItem('adminOrgs'));
    const { organization_uuid } = isSuperAdmin
      ? _.filter(orgData, (org) => _.isEqual(org.name, organization))[0]
      : _.filter(adminOrgs, (org) => _.isEqual(org.name, organization))[0];
    const year = moment().year();
    const firstDateOfSelectedMonth = moment(`${year}-${selectMonth}-01`).startOf('month').format('YYYY-MM-DD');
    const firstDateOfNextMonth = moment(`${year}-${selectMonth}-01`).add(1, 'month').startOf('month').format('YYYY-MM-DD');
    const chargesData = {
      organization_uuid,
      start_date: `${firstDateOfSelectedMonth}T00:00:00.000000Z`,
      end_date: `${firstDateOfNextMonth}T00:00:00.000000Z`,
    };
    setSelectedMonthFirstDate(`${firstDateOfSelectedMonth}T00:00:00.000000Z`);
    setNextMonthFirstDate(`${firstDateOfNextMonth}T00:00:00.000000Z`);
    whatsappChargesMutation(chargesData);
  };

  const handleEditClick = (field, index, id) => {
    if (isEditing.field === field && isEditing.index === index) {
      const updatedData = {
        id,
      };
      if (isEditing.field === 'shippingCost') {
        updatedData.shipping_cost = formData[field] ? parseInt(formData[field], 10) : 0;
      }
      editTrackerOrderMutation(updatedData);
      setIsEditing({ field: null, index: null });
      setFormData({
        shippingCost: '',
      });
    } else {
      setIsEditing({ field, index });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      {(isLoadingOrgs
        || isLoadingTrackerOrder
        || isWhatsappChargesLoading
        || isTrackerOrderEditing
        || generatingPdf)
        && (
          <Loader open={isLoadingOrgs
            || isLoadingTrackerOrder
            || isWhatsappChargesLoading
            || isTrackerOrderEditing
            || generatingPdf}
          />
        )}
      <Grid container>
        <Grid item xs={12} sm={4} className="invoiceContainer">
          <Typography className="invoiceHeading" variant="h4">
            Monthly Invoice
          </Typography>
          <Tooltip placement="bottom" title="Download PDF">
            <LoginIcon className="invoiceDownloadIcon" onClick={generatePdfInvoice} />
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={8} className="invoiceContainer invoiceContainer2">
          <OrganizationSelector
            handleOrganizationChange={handleOrganizationChange}
            selectedOrg={organization}
            mainMenuOpen={mainMenuOpen}
            setMainMenuOpen={setMainMenuOpen}
            submenuAnchorEl={submenuAnchorEl}
            setSubmenuAnchorEl={setSubmenuAnchorEl}
          />
          <TextField
            className={_.isEmpty(selectYear) ? 'invoiceMonths' : 'invoiceMonthsValue'}
            variant="outlined"
            id="year"
            select
            value={selectYear}
            onChange={handleYearChange}
            label="Year"
            disabled={!organization}
          >
            <MenuItem value="">Select Year</MenuItem>
            {availableYears.map((item, index) => (
              <MenuItem key={`year${index}`} value={item}>{item}</MenuItem>
            ))}
          </TextField>
          <TextField
            className={_.isEmpty(selectMonth) ? 'invoiceMonths' : 'invoiceMonthsValue'}
            variant="outlined"
            id="month"
            select
            label="Month"
            value={selectMonth}
            onChange={handleMonthChange}
            disabled={!selectYear}
          >
            <MenuItem value="">Select Month</MenuItem>
            {availableMonths.map((item, index) => (
              <MenuItem key={`month${index}`} value={item.value}>{item.label}</MenuItem>
            ))}
          </TextField>
          <Button
            type="button"
            variant="contained"
            color="primary"
            style={{ marginLeft: '20px', marginTop: '4px', height: '38px' }}
            disabled={!selectMonth || !selectYear}
            onClick={handleSubmit}
          >
            OK
          </Button>
        </Grid>
      </Grid>
      {!_.isEmpty(whatsappChargesData)
        ? (
          <Grid container className="invoiceDetailsContainer" ref={invoicesDetailsRef}>
            <Typography className="invoiceDetailsHeader">Charges & Shipments</Typography>
            <Grid item xs={12} sm={5.98} className="invoiceChargesContainer">
              <Grid container>
                <Grid item xs={7}>
                  <Typography className="invoiceChargesTitle">{`Email Alerts: ${whatsappChargesData.total_alerts_count}`}</Typography>
                  {!_.isEmpty(whatsappChargesData.detailed_email_messages) && whatsappChargesData.detailed_email_messages.map((item, index) => (
                    <Typography key={index} className="invoiceMsgText">{`${item.user} - ${item.message_count}`}</Typography>
                  ))}
                </Grid>
                <Grid item xs={5}>
                  <Typography className="invoiceChargesTitle">{`Whatsapp Alerts: ${whatsappChargesData.total_whatsapp_messages}`}</Typography>
                  {!_.isEmpty(whatsappChargesData.detailed_whatsapp_messages) && whatsappChargesData.detailed_whatsapp_messages.map((item, index) => (
                    <Typography key={index} className="invoiceMsgText">{`${item.user} - ${item.message_count}`}</Typography>
                  ))}
                </Grid>
              </Grid>
              <div className="invoiceOrderListContainer">
                {!_.isEmpty(ordersData) ? ordersData.map((item, index) => (
                  <div key={index} className="invoiceOrderListItemContainer">
                    <Typography className="invoiceChargesTitle">Device Order: YES</Typography>
                    <Typography className="invoiceMsgText">
                      {`${moment(item.order_date).format('DD/MM/YYYY')} - ${item.order_quantity.map((quantity, i) => (
                        `${quantity} ${item.order_type && item.order_type[i] ? item.order_type[i] : ''}`
                      )).join(', ')}`}
                    </Typography>
                    <div className="invoiceOrderListItemSubContainer">
                      <Typography className="invoiceMsgText">Shipping Fees:</Typography>
                      {isEditing.field === 'shippingCost' && isEditing.index === index ? (
                        <TextField
                          className="invoiceTextInput"
                          value={formData.shippingCost}
                          name="shippingCost"
                          onChange={handleInputChange}
                          size="small"
                          variant="outlined"
                          InputProps={{
                            startAdornment: <InputAdornment position="start"><DollarIcon style={{ width: '15px', height: '15px' }} /></InputAdornment>,
                          }}
                        />
                      ) : (
                        <Typography ml={1} className="invoiceMsgText">{`$${item.shipping_cost}`}</Typography>
                      )}
                      <IconButton onClick={() => handleEditClick('shippingCost', index, item.id)}>
                        {isEditing.field === 'shippingCost' && isEditing.index === index ? (
                          <CheckIcon className="invoiceEditIcon" />
                        ) : (
                          <EditIcon className="invoiceEditIcon" />
                        )}
                      </IconButton>
                    </div>
                  </div>
                )) : <Typography className="invoiceOrderDataEmptyText">No orders are available</Typography>}
              </div>
              <Grid container mb={2}>
                <Grid item xs={7} />
                <Grid item xs={5}>
                  <Typography className="invoiceTotalChargesTitle">
                    {`Total: $${totalCost}`}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <div className="invoiceDivider" />
            <Grid item xs={12} sm={5.98} className="invoiceShipmentsContainer">
              {!_.isEmpty(whatsappChargesData.shipments)
                ? (
                  <Grid container>
                    {whatsappChargesData.shipments.map((item, index) => (
                      <React.Fragment key={`${item.name}-${index}`}>
                        <Grid item xs={7}>
                          <Typography variant="body2">{item.name}</Typography>
                        </Grid>
                        <Grid item xs={5}>
                          <Typography variant="body2">{`Tracker: ${item.tracker[0]}`}</Typography>
                        </Grid>
                      </React.Fragment>
                    ))}
                  </Grid>
                )
                : <Typography className="invoiceShipmentDataEmptyText">No shipments are available</Typography>}
            </Grid>
          </Grid>
        ) : <Typography className="invoiceEmptyText">No data to display</Typography>}
    </div>
  );
};

export default Invoices;
