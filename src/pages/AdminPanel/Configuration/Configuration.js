import React, { useContext } from 'react';
import { connect } from 'react-redux';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import CustomizedTooltips from '@components/ToolTip/ToolTip';
import { UserContext } from '@context/User.context';
import { checkForGlobalAdmin } from '@utils/utilMethods';
import {
  CUSTODIAN_TYPE_TOOLTIP,
  GATEWAY_TYPE_TOOLTIP,
  ITEM_TYPE_TOOLTIP,
  ORGANIZATION_TYPE_TOOLTIP,
  PRODUCT_TOOLTIP,
  PRODUCT_TYPE_TOOLTIP,
  SENSOR_TYPE_TOOLTIP,
  UNITS_OF_MEASURE_TOOLTIP,
  ORG_SETTINGS_TOOLTIP,
} from './ConfigurationConstants';
import CustodianType from './components/CustodianType';
import GatewayType from './components/GatewayType';
import ItemType from './components/ItemType';
import OrganizationType from './components/OrganizationType';
import Product from './components/Product';
import ProductType from './components/ProductType';
import SensorType from './components/SensorType';
import UnitOfMeasure from './components/UnitOfMeasure';
import OrganizationSettings from './components/OrganizationSettings';
import Forbidden from '../Forbidden';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(6),
  },
  accordion: {
    backgroundColor: '#4F4D4D',
    marginBottom: theme.spacing(4),
    overflow: 'scroll hidden',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
}));

const Configuration = (props) => {
  const classes = useStyles();
  const superAdmin = checkForGlobalAdmin(useContext(UserContext));

  return (
    <div>
      {!superAdmin && (
      <Forbidden
        history={history}
        location={location}
      />
      )}
      {superAdmin && (
      <div className={classes.root}>
        <Accordion className={classes.accordion}>
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
        <Accordion className={classes.accordion}>
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
        <Accordion className={classes.accordion}>
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
        <Accordion className={classes.accordion}>
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
        <Accordion className={classes.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="organization-type-content"
            id="organization-type-header"
          >
            <Typography variant="h5">
              Organization Type
              <CustomizedTooltips
                toolTipText={ORGANIZATION_TYPE_TOOLTIP}
              />
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <OrganizationType {...props} />
          </AccordionDetails>
        </Accordion>
        <Accordion className={classes.accordion}>
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
        <Accordion className={classes.accordion}>
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
        <Accordion className={classes.accordion}>
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
        <Accordion className={classes.accordion}>
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
      )}
    </div>

  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state,
});

export default connect(mapStateToProps)(Configuration);
