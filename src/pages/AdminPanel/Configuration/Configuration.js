import React from 'react';
import { connect } from 'react-redux';
import {
  makeStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import CustomizedTooltips from '@components/ToolTip/ToolTip';
import {
  CUSTODIAN_TYPE_TOOLTIP,
  GATEWAY_TYPE_TOOLTIP,
  ITEM_TYPE_TOOLTIP,
  PRODUCT_TOOLTIP,
  PRODUCT_TYPE_TOOLTIP,
  SENSOR_TYPE_TOOLTIP,
  SHIPMENT_FLAG_TOOLTIP,
  UNITS_OF_MEASURE_TOOLTIP,
  ORG_SETTINGS_TOOLTIP,
} from './ConfigurationConstants';
import CustodianType from './components/CustodianType';
import GatewayType from './components/GatewayType';
import ItemType from './components/ItemType';
import Product from './components/Product';
import ProductType from './components/ProductType';
import SensorType from './components/SensorType';
import ShipmentFlag from './components/ShipmentFlag';
import UnitOfMeasure from './components/UnitOfMeasure';
import OrganizationSettings from './components/OrganizationSettings';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(6),
  },
  accordian: {
    backgroundColor: '#4F4D4D',
    marginBottom: theme.spacing(4),
    overflowX: 'scroll',
  },
}));

const Configuration = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Accordion className={classes.accordian}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="organization-setting-content"
          id="organization-setting-header"
        >
          <Typography variant="h5">
            Organization Settings
            <CustomizedTooltips toolTipText={ORG_SETTINGS_TOOLTIP} />
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <OrganizationSettings {...props} />
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.accordian}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="custodian-type-content"
          id="custodian-type-header"
        >
          <Typography variant="h5">
            Custodian Type
            <CustomizedTooltips toolTipText={CUSTODIAN_TYPE_TOOLTIP} />
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CustodianType {...props} />
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.accordian}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="gateway-type-content"
          id="gateway-type-header"
        >
          <Typography variant="h5">
            Gateway Type
            <CustomizedTooltips toolTipText={GATEWAY_TYPE_TOOLTIP} />
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <GatewayType {...props} />
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.accordian}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="item-type-content"
          id="item-type-header"
        >
          <Typography variant="h5">
            Item Type
            <CustomizedTooltips toolTipText={ITEM_TYPE_TOOLTIP} />
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ItemType {...props} />
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.accordian}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="product-content"
          id="product-header"
        >
          <Typography variant="h5">
            Products
            <CustomizedTooltips toolTipText={PRODUCT_TOOLTIP} />
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Product {...props} />
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.accordian}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="product-type-content"
          id="product-type-header"
        >
          <Typography variant="h5">
            Product Type
            <CustomizedTooltips toolTipText={PRODUCT_TYPE_TOOLTIP} />
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ProductType {...props} />
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.accordian}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="sensor-type-content"
          id="sensor-type-header"
        >
          <Typography variant="h5">
            Sensor Type
            <CustomizedTooltips toolTipText={SENSOR_TYPE_TOOLTIP} />
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SensorType {...props} />
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.accordian}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="shipment-flag-content"
          id="shipment-flag-header"
        >
          <Typography variant="h5">
            Shipment Flag
            <CustomizedTooltips toolTipText={SHIPMENT_FLAG_TOOLTIP} />
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ShipmentFlag {...props} />
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.accordian}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="unit-of-measure-content"
          id="unit-of-measure-header"
        >
          <Typography variant="h5">
            Units of Measure
            <CustomizedTooltips
              toolTipText={UNITS_OF_MEASURE_TOOLTIP}
            />
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <UnitOfMeasure {...props} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
});

export default connect(mapStateToProps)(Configuration);
