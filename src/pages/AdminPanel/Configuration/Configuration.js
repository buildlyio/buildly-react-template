import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { getUser } from '../../../context/User.context';
import { checkForAdmin, checkForGlobalAdmin } from '../../../utils/utilMethods';
import OrganizationSettings from './components/OrganizationSettings';
import CustodianType from './components/CustodianType';
import GatewayType from './components/GatewayType';
import ItemType from './components/ItemType';
import OrganizationType from './components/OrganizationType';
import Product from './components/Product';
import ProductType from './components/ProductType';
import '../AdminPanelStyles.css';

const Configuration = (props) => {
  const isAdmin = checkForAdmin(getUser());
  const superAdmin = checkForGlobalAdmin(getUser());

  return (
    <div>
      {isAdmin && (
        <div className="root">
          <Accordion defaultExpanded className="accordion">
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
        <div className="root">
          <Accordion defaultExpanded className="accordion">
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
          <Accordion className="accordion">
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
          <Accordion className="accordion">
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
          <Accordion className="accordion">
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
          <Accordion className="accordion">
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
          <Accordion className="accordion">
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
          <Accordion className="accordion">
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

export default Configuration;
