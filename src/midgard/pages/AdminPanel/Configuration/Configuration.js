import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CustomizedTooltips from "midgard/components/ToolTip/ToolTip";
import {
  CUSTODIAN_TYPE_TOOLTIP,
  GATEWAY_TYPE_TOOLTIP,
  ITEM_TYPE_TOOLTIP,
  PRODUCT_TYPE_TOOLTIP,
  SENSOR_TYPE_TOOLTIP,
  SHIPMENT_FLAG_TOOLTIP,
  UNITS_OF_MEASURE_TOOLTIP,
} from "./ConfigurationConstants";
import CustodianType from "./components/CustodianType";
import GatewayType from "./components/GatewayType";
import ItemType from "./components/ItemType";
import ProductType from "./components/ProductType";
import SensorType from "./components/SensorType";
import ShipmentFlag from "./components/ShipmentFlag";
import UnitOfMeasure from "./components/UnitOfMeasure";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(6),
  },
  accordian: {
    backgroundColor: theme.palette.background.default,
    marginBottom: theme.spacing(4),
  },
}));

const Configuration = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
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
            <CustomizedTooltips toolTipText={UNITS_OF_MEASURE_TOOLTIP} />
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <UnitOfMeasure {...props} />
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
});

export default connect(mapStateToProps)(Configuration);
