import React from 'react';
import { connect } from 'react-redux';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { getUser } from '../../../context/User.context';
import { checkForAdmin, checkForGlobalAdmin } from '../../../utils/utilMethods';
import CustodianType from './components/CustodianType';
import GatewayType from './components/GatewayType';
import ItemType from './components/ItemType';
import OrganizationType from './components/OrganizationType';
import Product from './components/Product';
import ProductType from './components/ProductType';
import OrganizationSettings from './components/OrganizationSettings';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(6),
  },
  accordion: {
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
  const isAdmin = checkForAdmin(getUser());
  const superAdmin = checkForGlobalAdmin(getUser());

  return (
    <div>
      {isAdmin && (
      <div className={classes.root}>
        <Accordion defaultExpanded className={classes.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="organization-setting-content"
            id="organization-setting-header"
          >
            <Typography variant="h5">
              Organization Settings
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <OrganizationSettings {...props} />
          </AccordionDetails>
        </Accordion>
      </div>
      )}

      {superAdmin && (
      <div className={classes.root}>
        <Accordion defaultExpanded className={classes.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="organization-setting-content"
            id="organization-setting-header"
          >
            <Typography variant="h5">
              Organization Settings
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
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ProductType {...props} />
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
