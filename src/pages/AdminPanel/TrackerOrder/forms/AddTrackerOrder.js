import React, { useState } from 'react';
import _ from 'lodash';
import { useQuery } from 'react-query';
import {
  Grid,
  Button,
  TextField,
  Typography,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import tiveLithium from '@assets/tive_lithium.png';
import tiveNonLithium from '@assets/tive_non_lithium.png';
import Loader from '@components/Loader/Loader';
import FormModal from '@components/Modal/FormModal';
import { getUser } from '@context/User.context';
import useAlert from '@hooks/useAlert';
import { useInput } from '@hooks/useInput';
import { getRecipientAddressQuery } from '@react-query/queries/recipientaddress/getRecipientAddressQuery';
import { validators } from '@utils/validators';
import { isDesktop } from '@utils/mediaQuery';
import { ORDER_TYPES } from '@utils/mock';
import { FlightSafeIcon, FlightUnsafeIcon } from '@utils/constants';
import { useCartStore } from '@zustand/cart/cartStore';
import '../TrackerOrderStyles.css';
import { routes } from '@routes/routesConstants';

const AddTrackerOrder = ({ history, location }) => {
  const { organization_uuid } = getUser().organization;
  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [showAddMore, setShowAddMore] = useState(false);

  const { displayAlert } = useAlert();
  const { data: cartData, setCart } = useCartStore();
  const halfwayOrder = JSON.parse(localStorage.getItem('halfwayOrder'));

  const reOrderPage = location.state && _.isEqual(location.state.type, 're-order');
  const reOrderData = (reOrderPage && location.state.data) || {};

  const placeholderType = useInput('', { required: true });
  const placeholderQuantity = useInput(0, { required: true });
  const order_type = useInput((reOrderData && reOrderData.order_type) || (halfwayOrder && halfwayOrder.order_type) || [], { required: true });
  const order_quantity = useInput((reOrderData && reOrderData.order_quantity) || (halfwayOrder && halfwayOrder.order_quantity) || [], { required: true });
  const order_recipient = useInput((reOrderData && reOrderData.order_recipient) || (halfwayOrder && halfwayOrder.order_recipient) || '', { required: true });
  const order_address = useInput((reOrderData && reOrderData.order_address) || (halfwayOrder && halfwayOrder.order_address) || '', { required: true });
  const [formError, setFormError] = useState({});

  const { data: recipientAddressData, isLoading: isLoadingRecipientAddresses } = useQuery(
    ['recipientAddresses', organization_uuid],
    () => getRecipientAddressQuery(organization_uuid, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const closeFormModal = () => {
    localStorage.removeItem('halfwayOrder');
    if (
      order_type.hasChanged()
      || order_quantity.hasChanged()
      || order_recipient.hasChanged()
      || order_address.hasChanged()
      || !_.isEmpty(order_type.value)
      || !_.isEmpty(order_quantity.value)
      || order_recipient.value
      || order_address.value
    ) {
      setConfirmModal(true);
    } else {
      setFormModal(false);
      history.push(routes.TRACKERORDER);
    }
  };

  const discardFormData = () => {
    setConfirmModal(false);
    setFormModal(false);
    history.push(routes.TRACKERORDER);
  };

  /**
   * Submit The form and add/edit custodian type
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      ...reOrderData,
      order_date: new Date(),
      order_type: order_type.value,
      order_quantity: order_quantity.value,
      order_recipient: order_recipient.value,
      order_address: order_address.value,
      organization_uuid,
    };

    setCart([...cartData, data]);
    displayAlert('success', 'Order has been added to the cart.');
    discardFormData();
  };

  /**
   * Handle input field blur event
   * @param {Event} e Event
   * @param {String} validation validation type if any
   * @param {Object} input input field
   */

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
    if (!order_type.value || _.isEmpty(order_type.value) || !order_quantity.value || _.isEmpty(order_quantity.value) || !order_recipient.value || !order_address.value) {
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

  const onAddRecipient = () => {
    if (!_.isEmpty(order_type.value) || !_.isEmpty(order_quantity.value) || order_recipient.value || order_address.value) {
      const newHalfwayOrder = {
        order_type: order_type.value,
        order_quantity: order_quantity.value,
        order_recipient: order_recipient.value,
        order_address: order_address.value,
      };
      localStorage.setItem('halfwayOrder', JSON.stringify(newHalfwayOrder));
    }

    const addPath = `${routes.CONFIGURATION}/recipient-address/add`;
    history.push(`${addPath}`, {
      from: `${routes.TRACKERORDER}/add`,
    });
  };

  return (
    <div>
      {openFormModal && (
        <FormModal
          open={openFormModal}
          handleClose={closeFormModal}
          openConfirmModal={openConfirmModal}
          setConfirmModal={setConfirmModal}
          handleConfirmModal={discardFormData}
        >
          {isLoadingRecipientAddresses && <Loader open={isLoadingRecipientAddresses} />}
          <form noValidate onSubmit={handleSubmit}>
            <Grid container columnGap={2}>
              <Grid item xs={12} md={5.8} className="addOrderContainer">
                <Grid container>
                  <Grid item xs={12} padding={2}>
                    <Typography className="trackerOrderBold">TRACKER</Typography>
                  </Grid>

                  {!_.isEmpty(order_type.value) && !_.isEmpty(order_quantity.value) && _.map(order_type.value, (orty, idx) => (
                    <Grid container key={`${idx}-${orty}`}>
                      <Grid item xs={12} className={idx > 0 ? 'addOrderTypeContainer' : ''} />
                      <Grid item xs={10} className="addOrderTextFieldWithClose">
                        <TextField
                          className="notranslate"
                          variant="outlined"
                          fullWidth
                          id={`order-type-${idx}`}
                          select
                          label={<span className="translate">Tracker Type</span>}
                          value={orty}
                          onChange={(e) => {
                            const newList = _.map(
                              order_type.value,
                              (o, i) => (_.isEqual(i, idx) ? e.target.value : o),
                            );
                            order_type.setValue(newList);
                          }}
                        >
                          <MenuItem value="">Select</MenuItem>
                          {_.map(ORDER_TYPES, (ot, index) => (
                            <MenuItem className="notranslate" key={`${ot.value}-${index}`} value={ot.value}>
                              <Typography component="div" className="addOrderTypeWithIcon">
                                {ot.label}
                                <span>{_.includes(ot.label, 'Non') ? <FlightSafeIcon /> : <FlightUnsafeIcon />}</span>
                              </Typography>
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      <Grid item xs={1}>
                        <IconButton
                          className="addOrderClose"
                          onClick={(e) => {
                            order_type.setValue(_.filter(order_type.value, (otv, i) => !_.isEqual(i, idx)));
                            order_quantity.setValue(_.filter(order_quantity.value, (oqv, i) => !_.isEqual(i, idx)));
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Grid>

                      <Grid item xs={8} className="orderDeviceImage">
                        {orty && _.includes(orty, 'Non') && (
                          <img
                            src={tiveNonLithium}
                            alt={orty}
                          />
                        )}
                        {orty && !_.includes(orty, 'Non') && (
                          <img
                            src={tiveLithium}
                            alt={orty}
                          />
                        )}
                      </Grid>

                      <Grid item xs={12} textAlign="center">
                        <TextField
                          variant="outlined"
                          margin="normal"
                          type="number"
                          className="addOrderQuantityField"
                          id={`order-quantity-${idx}`}
                          name="order-quantity"
                          label="Tracker Quantity"
                          autoComplete="order-quantity"
                          select
                          value={order_quantity.value[idx]}
                          onChange={(e) => {
                            const newList = _.map(
                              order_quantity.value,
                              (oq, i) => (_.isEqual(i, idx) ? e.target.value : oq),
                            );
                            order_quantity.setValue(newList);
                          }}
                        >
                          <MenuItem value={0}>Select</MenuItem>
                          {_.map([25, 50, 75, 100], (quant, qidx) => (
                            <MenuItem key={`${qidx}-${quant}`} value={quant}>
                              {quant}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>
                  ))}

                  {(showAddMore || (_.isEmpty(order_type.value) && _.isEmpty(order_quantity.value))) && (
                    <Grid container>
                      <Grid item xs={12} className={!_.isEmpty(order_type.value) ? 'addOrderTypeContainer' : ''} />
                      <Grid item xs={!_.isEmpty(order_type.value) ? 10 : 12} className={!_.isEmpty(order_type.value) ? 'addOrderTextFieldWithClose' : 'addOrderTextField'}>
                        <TextField
                          className="notranslate"
                          variant="outlined"
                          fullWidth
                          id="placeholder-order-type"
                          select
                          label={<span className="translate">Tracker Type</span>}
                          {...placeholderType.bind}
                        >
                          <MenuItem value="">Select</MenuItem>
                          {_.map(_.without(ORDER_TYPES, ..._.filter(ORDER_TYPES, (o) => _.includes(order_type.value, o.value))), (ot, index) => (
                            <MenuItem className="notranslate" key={`${ot.value}-${index}`} value={ot.value}>
                              <Typography component="div" className="addOrderTypeWithIcon">
                                {ot.label}
                                <span>{_.includes(ot.label, 'Non') ? <FlightSafeIcon /> : <FlightUnsafeIcon />}</span>
                              </Typography>
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      {!_.isEmpty(order_type.value) && (
                        <Grid item xs={1}>
                          <IconButton className="addOrderClose" onClick={(e) => setShowAddMore(false)}>
                            <CloseIcon />
                          </IconButton>
                        </Grid>
                      )}

                      <Grid item xs={12} className="orderDeviceImage">
                        {placeholderType.value && _.includes(placeholderType.value, 'Non') && (
                          <img
                            src={tiveNonLithium}
                            alt={placeholderType.value}
                          />
                        )}
                        {placeholderType.value && !_.includes(placeholderType.value, 'Non') && (
                          <img
                            src={tiveLithium}
                            alt={placeholderType.value}
                          />
                        )}
                      </Grid>

                      <Grid item xs={12} textAlign="center">
                        <TextField
                          variant="outlined"
                          margin="normal"
                          type="number"
                          className="addOrderQuantityField"
                          id="placeholder-order-quantity"
                          name="placeholder-order-quantity"
                          label="Tracker Quantity"
                          autoComplete="placeholder-order-quantity"
                          select
                          value={placeholderQuantity.value}
                          onChange={(e) => {
                            placeholderQuantity.setValue(e.target.value);
                            order_type.setValue([...order_type.value, placeholderType.value]);
                            order_quantity.setValue([...order_quantity.value, e.target.value]);
                            setShowAddMore(false);
                          }}
                        >
                          <MenuItem value={0}>Select</MenuItem>
                          {_.map([25, 50, 75, 100], (quant, qidx) => (
                            <MenuItem key={`${qidx}-${quant}`} value={quant}>
                              {quant}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>

              <Grid item xs={12} md={5.8} className="addOrderContainer">
                <Grid container>
                  <Grid item xs={12} padding={2}>
                    <Typography className="trackerOrderBold">RECIPIENT</Typography>
                  </Grid>

                  <Grid item xs={12} className="addOrderTextField">
                    <TextField
                      className="notranslate"
                      variant="outlined"
                      fullWidth
                      select
                      required
                      id="order-recipient"
                      label={<span className="translate">Order Recipient</span>}
                      value={_.find(recipientAddressData, { name: order_recipient.value, address: order_address.value })}
                      onChange={(e) => {
                        if (e.target.value) {
                          const formattedAddress = `${e.target.value.address1
                            && `${e.target.value.address1},`} ${e.target.value.address2
                            && `${e.target.value.address2},`} ${e.target.value.city
                            && `${e.target.value.city},`} ${e.target.value.state
                            && `${e.target.value.state},`} ${e.target.value.country
                            && `${e.target.value.country},`} ${e.target.value.postal_code
                            && `${e.target.value.postal_code}`}`;
                          order_recipient.setValue(e.target.value.name);
                          order_address.setValue(formattedAddress);
                        }
                      }}
                    >
                      {_.map(recipientAddressData, (ra, index) => (
                        <MenuItem className="notranslate" key={`${ra.name}-${index}`} value={ra}>
                          {ra.name}
                        </MenuItem>
                      ))}
                      <MenuItem
                        value={null}
                        className="addOrderNewRecipient"
                        onClick={onAddRecipient}
                      >
                        Add Recipient +
                      </MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} className="addOrderTextArea">
                    <TextField
                      disabled
                      fullWidth
                      multiline
                      variant="outlined"
                      margin="normal"
                      id="order-address"
                      name="order-address"
                      autoComplete="order-address"
                      {...order_address.bind}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                {(_.size(_.without(ORDER_TYPES, ..._.filter(ORDER_TYPES, (o) => _.includes(order_type.value, o.value)))) > 0) && (
                  <Typography
                    className="addOrderMoreTracker"
                    onClick={(e) => {
                      setShowAddMore(true);
                      placeholderType.setValue('');
                      placeholderQuantity.setValue(0);
                    }}
                  >
                    Add Tracker +
                  </Typography>
                )}
              </Grid>

              <Grid container spacing={2} justifyContent="center" className="addOrderActions">
                <Grid item xs={6} sm={5.15} md={4}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={isLoadingRecipientAddresses || submitDisabled()}
                  >
                    Add to cart
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </FormModal>
      )}
    </div>
  );
};

export default AddTrackerOrder;
