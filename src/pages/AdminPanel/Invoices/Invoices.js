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
    additionalCost: '',
    notes: '',
  });

  const invoicesDetailsRef = useRef();

  const { displayAlert } = useAlert();

  const month = useInput(moment().format('MMMM'));

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

  const handleOrganizationChange = (e) => {
    const organization_name = e.target ? e.target.value : e;
    if (!_.isEqual(organization, organization_name)) {
      setOrganization(organization_name);
    }
    setMainMenuOpen(false);
    setSubmenuAnchorEl(null);
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
        pdf.save(`${_.toLower(organization)}_${_.toLower(month.value)}_invoice.pdf`);
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
    const selectedMonth = month.value;
    const year = moment().year();
    const firstDateOfSelectedMonth = moment(`${year}-${selectedMonth}-01`).startOf('month').format('YYYY-MM-DD');
    const firstDateOfNextMonth = moment(`${year}-${selectedMonth}-01`).add(1, 'month').startOf('month').format('YYYY-MM-DD');
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
      } else if (isEditing.field === 'additionalCost') {
        updatedData.additional_cost = formData[field] ? parseInt(formData[field], 10) : 0;
      } else if (isEditing.field === 'notes') {
        updatedData.notes = formData[field];
      }
      editTrackerOrderMutation(updatedData);
      setIsEditing({ field: null, index: null });
      setFormData({
        shippingCost: '',
        additionalCost: '',
        notes: '',
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
            Invoicing
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
            className="invoiceMonths"
            variant="outlined"
            id="month"
            select
            label="Month"
            {...month.bind}
          >
            <MenuItem value="">Select</MenuItem>
            {_.map(MONTHS, (item, index) => (
              <MenuItem
                key={`months${index}:${item.id}`}
                value={item.value}
              >
                {item.label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            type="button"
            variant="contained"
            color="primary"
            style={{ marginLeft: '20px', marginTop: '4px', height: '38px' }}
            disabled={!!_.isEmpty(month.value)}
            onClick={handleSubmit}
          >
            OK
          </Button>
        </Grid>
      </Grid>
      {!_.isEmpty(whatsappChargesData)
        ? (
          <Grid container className="invoiceDetailsContainer" ref={invoicesDetailsRef}>
            <Grid item xs={12} sm={5} className="invoiceChargesContainer">
              <Typography variant="body3" component="div" textAlign="center">CHARGES</Typography>
              <Typography mt={1.25} fontSize={16}>{`Total alerts per month: ${whatsappChargesData.alerts_count}`}</Typography>
              <Typography fontSize={16} mt={1}>{`Total WhatsApp messages: ${whatsappChargesData.total_whatsapp_messages}`}</Typography>
              {!_.isEmpty(whatsappChargesData.detailed_whatsapp_messages) && whatsappChargesData.detailed_whatsapp_messages.map((item, index) => (
                <Typography key={index} className="invoiceMsgText">{`${item.user} - ${item.message_count} message(s)`}</Typography>
              ))}

              <Typography mt={3.25} variant="body3" component="div" textAlign="center">ORDERS</Typography>
              <div className="invoiceOrderListContainer">
                {!_.isEmpty(ordersData) ? ordersData.map((item, index) => (
                  <div key={index} className="invoiceOrderListItemContainer">
                    <Typography>
                      {`Device Order: ${item.order_quantity.map((quantity, i) => (
                        `${quantity} ${item.order_type && item.order_type[i] ? item.order_type[i] : ''}`
                      )).join(', ')}`}
                    </Typography>
                    <Typography className="invoiceMsgText">{`Order Placed: ${moment(item.order_date).format('DD/MM/YYYY')}`}</Typography>
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
                    <div className="invoiceOrderListItemSubContainer">
                      <Typography className="invoiceMsgText">Additional Fees:</Typography>
                      {isEditing.field === 'additionalCost' && isEditing.index === index ? (
                        <TextField
                          className="invoiceTextInput"
                          value={formData.additionalCost}
                          name="additionalCost"
                          onChange={handleInputChange}
                          size="small"
                          variant="outlined"
                          InputProps={{
                            startAdornment: <InputAdornment position="start"><DollarIcon style={{ width: '15px', height: '15px' }} /></InputAdornment>,
                          }}
                        />
                      ) : (
                        <Typography ml={1} className="invoiceMsgText">{`$${item.additional_cost}`}</Typography>
                      )}
                      <IconButton onClick={() => handleEditClick('additionalCost', index, item.id)}>
                        {isEditing.field === 'additionalCost' && isEditing.index === index ? (
                          <CheckIcon className="invoiceEditIcon" />
                        ) : (
                          <EditIcon className="invoiceEditIcon" />
                        )}
                      </IconButton>
                    </div>
                    <div className="invoiceOrderListItemSubContainer">
                      <Typography className="invoiceMsgText">Notes:</Typography>
                      {isEditing.field === 'notes' && isEditing.index === index ? (
                        <TextField
                          className="invoiceTextInput"
                          value={formData.notes}
                          name="notes"
                          onChange={handleInputChange}
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        <Typography ml={1} className="invoiceMsgText">{`${item.notes ? item.notes : 'N/A'}`}</Typography>
                      )}
                      <IconButton onClick={() => handleEditClick('notes', index, item.id)}>
                        {isEditing.field === 'notes' && isEditing.index === index ? (
                          <CheckIcon className="invoiceEditIcon" />
                        ) : (
                          <EditIcon className="invoiceEditIcon" />
                        )}
                      </IconButton>
                    </div>
                  </div>
                )) : <Typography className="invoiceDataEmptyText">No orders are available</Typography>}
              </div>
            </Grid>

            <Grid item xs={12} sm={7} className="invoiceShipmentsContainer">
              <Typography variant="body3">SHIPMENTS</Typography>
              {!_.isEmpty(whatsappChargesData.shipments)
                ? (
                  <div className="invoiceShipmentListContainer">
                    <div className="invoiceShipmentListScroll">
                      {whatsappChargesData.shipments.map((item, index) => (
                        <Typography key={index} variant="body2">{item}</Typography>
                      ))}
                    </div>
                    <div style={{ alignSelf: 'center' }}>
                      <Typography variant="body3">{`TOTAL SHIPMENTS: ${_.size(whatsappChargesData.shipments)}`}</Typography>
                    </div>
                  </div>
                )
                : <Typography className="invoiceDataEmptyText">No shipments are available</Typography>}
            </Grid>
          </Grid>
        ) : <Typography className="invoiceEmptyText">No data to display</Typography>}
    </div>
  );
};

export default Invoices;
