import React, { useState } from 'react';
import { useQuery } from 'react-query';
import _ from 'lodash';
import moment from 'moment-timezone';
import {
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  TextField,
  MenuItem,
} from '@mui/material';
import tiveLithium from '@assets/tive_lithium.png';
import tiveNonLithium from '@assets/tive_non_lithium.png';
import { getUser } from '@context/User.context';
import Loader from '@components/Loader/Loader';
import useAlert from '@hooks/useAlert';
import { getUnitQuery } from '@react-query/queries/items/getUnitQuery';
import { useAddTrackerOrderMutation } from '@react-query/mutations/trackerorder/addTrackerOrderMutation';
import { isMobile } from '@utils/mediaQuery';
import { FlightSafeIcon, FlightUnsafeIcon } from '@utils/constants';
import { useStore } from '@zustand/timezone/timezoneStore';
import { useCartStore } from '@zustand/cart/cartStore';
import '../TrackerOrderStyles.css';

const ShowCart = ({ history, location }) => {
  const { organization_uuid, name } = getUser().organization;
  const [openCartModal, setCartModal] = useState(true);

  const { displayAlert } = useAlert();
  const { data: timeZone } = useStore();
  const { data: cartData, setCart } = useCartStore();

  const { data: unitData, isLoading: isLoadingUnits } = useQuery(
    ['unit', organization_uuid],
    () => getUnitQuery(organization_uuid, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const dateFormat = _.find(unitData, (unit) => _.isEqual(_.toLower(unit.unit_of_measure_for), 'date'))
    ? _.find(unitData, (unit) => _.isEqual(_.toLower(unit.unit_of_measure_for), 'date')).unit_of_measure
    : '';

  const timeFormat = _.find(unitData, (unit) => _.isEqual(_.toLower(unit.unit_of_measure_for), 'time'))
    ? _.find(unitData, (unit) => _.isEqual(_.toLower(unit.unit_of_measure_for), 'time')).unit_of_measure
    : '';

  const { mutate: addTrackerOrderMutation, isLoading: isAddingTrackerOrder } = useAddTrackerOrderMutation(history, location.state.from, displayAlert, setCart);

  const closeCart = () => {
    setCartModal(false);
    if (location && location.state) {
      history.push(location.state.from);
    }
  };

  const updateOrderQuantity = (cartIndex, itemIndex, newValue) => {
    const newCartData = _.map(cartData, (cd, index) => {
      let newCd = cd;
      if (_.isEqual(index, cartIndex)) {
        const newOQ = _.map(newCd.order_quantity, (oq, idx) => (_.isEqual(idx, itemIndex) ? newValue : oq));
        newCd = { ...newCd, order_quantity: newOQ };
      }

      return newCd;
    });

    setCart(newCartData);
  };

  const removeType = (cartIndex, itemIndex) => {
    const newCartData = _.map(cartData, (cd, index) => {
      let newCd = cd;
      if (_.isEqual(index, cartIndex)) {
        const newOQ = _.filter(newCd.order_quantity, (oq, idx) => !_.isEqual(idx, itemIndex));
        const newOT = _.filter(newCd.order_type, (ot, idx) => !_.isEqual(idx, itemIndex));

        if (_.size(newOQ) > 0) {
          newCd = { ...newCd, order_quantity: newOQ, order_type: newOT };
        } else {
          newCd = null;
        }
      }

      return newCd;
    });

    setCart(_.without(newCartData, null));
  };

  /**
   * Submit The form and add/edit custodian type
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    addTrackerOrderMutation(cartData);
  };

  return (
    <div>
      <Dialog
        open={openCartModal}
        onClose={closeCart}
        fullWidth
        fullScreen={isMobile()}
        maxWidth="md"
        aria-labelledby="form-dialog-title"
      >
        <DialogContent className="cartModalRoot">
          {(isLoadingUnits || isAddingTrackerOrder) && <Loader open={isLoadingUnits || isAddingTrackerOrder} />}
          <form noValidate onSubmit={handleSubmit}>
            <Grid container className="cartContainer">
              <Grid item xs={12} textAlign="center">
                <Typography className="cartTitle">Cart</Typography>
              </Grid>

              {_.isEmpty(cartData) && (
                <Grid item xs={12} textAlign="center">
                  <Typography className="cartNoOrder">No orders to place</Typography>
                </Grid>
              )}

              {!_.isEmpty(cartData) && _.map(cartData, (cd, index) => (
                <Grid
                  item
                  xs={12}
                  pt={3}
                  pb={3}
                  key={`${index}-${cd.order_recipient}`}
                  className={index > 0 ? 'cartTopBorder' : ''}
                >
                  <Grid container>
                    <Grid item xs={6} alignContent="center">
                      {_.map(cd.order_type, (cdot, idx) => (
                        <Grid container key={`${idx}-${cdot}`} alignItems="center">
                          <div className={idx > 0 ? 'cartTypeTopBorder' : ''} />
                          <Grid item xs={2.5} className="orderDeviceImage">
                            {cdot && _.includes(cdot, 'Non') && (
                              <img
                                src={tiveNonLithium}
                                alt={cdot}
                              />
                            )}
                            {cdot && !_.includes(cdot, 'Non') && (
                              <img
                                src={tiveLithium}
                                alt={cdot}
                              />
                            )}
                          </Grid>

                          <Grid item xs={9.5}>
                            <div style={{ height: '20px' }}>
                              {_.includes(cdot, 'Non') ? <FlightSafeIcon /> : <FlightUnsafeIcon />}
                            </div>

                            <Typography>
                              <span className="trackerOrderBold">
                                Type:
                              </span>
                              {' '}
                              {cdot}
                            </Typography>

                            <Grid item className="cartQuantityDisplay">
                              <Typography className="trackerOrderBold">
                                Quantity:
                              </Typography>

                              <TextField
                                variant="outlined"
                                margin="normal"
                                type="number"
                                id="cart-order-quantity"
                                name="cart-order-quantity"
                                autoComplete="cart-order-quantity"
                                select
                                value={cd.order_quantity[idx]}
                                onChange={(e) => updateOrderQuantity(index, idx, e.target.value)}
                              >
                                <MenuItem value={0}>Select</MenuItem>
                                {_.map([25, 50, 75, 100], (quant, qidx) => (
                                  <MenuItem key={`${qidx}-${quant}`} value={quant}>
                                    {quant}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>

                            <Button
                              type="button"
                              variant="contained"
                              color="inherit"
                              size="small"
                              className="cartRemoveButton"
                              onClick={(e) => removeType(index, idx)}
                            >
                              Remove
                            </Button>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>

                    <Grid item xs={6}>
                      <Typography className="trackerOrderBold">
                        Shipping Information
                      </Typography>

                      <Typography className="cartMarginTop32">
                        <span className="trackerOrderBold">
                          Date:
                        </span>
                        {' '}
                        {moment(cd.order_date).tz(timeZone).format(`${dateFormat} ${timeFormat}`)}
                      </Typography>
                      <Typography>
                        <span className="trackerOrderBold">
                          Total Quantity:
                        </span>
                        {' '}
                        {_.sum(cd.order_quantity)}
                      </Typography>

                      <Typography className="cartMarginTop16">
                        <span className="trackerOrderBold">
                          Recipient:
                        </span>
                        {' '}
                        {cd.order_recipient}
                      </Typography>
                      <Typography>
                        <span className="trackerOrderBold">
                          Customer:
                        </span>
                        {' '}
                        {name}
                      </Typography>

                      <Typography className="cartMarginTop16">
                        <span className="trackerOrderBold">
                          Recipient Address:
                        </span>
                        {' '}
                        {cd.order_address}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={2} justifyContent="center" className="cartActions">
              <Grid item xs={6} sm={5.15} md={4}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={_.isEmpty(cartData)}
                >
                  Submit
                </Button>
              </Grid>

              <Grid item xs={6} sm={5.15} md={4}>
                <Button
                  type="button"
                  fullWidth
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={closeCart}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShowCart;
