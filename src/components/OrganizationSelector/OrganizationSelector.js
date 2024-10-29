import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {
  IconButton,
  TextField,
  Menu,
  MenuItem,
} from '@mui/material';
import { ArrowRight as ArrowRightIcon } from '@mui/icons-material';
import { getUser } from '@context/User.context';
import useAlert from '@hooks/useAlert';
import { checkForAdmin, checkForGlobalAdmin } from '@utils/utilMethods';
import { useQuery } from 'react-query';
import { getAllOrganizationQuery } from '@react-query/queries/authUser/getAllOrganizationQuery';
import './OrganizationSelectorStyles.css';

const OrganizationSelector = ({
  handleOrganizationChange,
  selectedOrg,
  mainMenuOpen,
  setMainMenuOpen,
  submenuAnchorEl,
  setSubmenuAnchorEl,
}) => {
  const user = getUser();
  const isAdmin = checkForAdmin(user);
  const isSuperAdmin = checkForGlobalAdmin(user);

  const [submenuOrg, setSubmenuOrg] = useState(null);
  const [custOrgs, setCustOrgs] = useState(null);
  const [displayOrgs, setDisplayOrgs] = useState(null);

  const { displayAlert } = useAlert();

  const { data: orgData, isLoading: isLoadingOrgs } = useQuery(
    ['organizations'],
    () => getAllOrganizationQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const filterAndSetDisplayOrgs = (orgs) => {
    if (orgs) {
      const producerOrgs = orgs.filter((org) => _.isEqual(org.organization_type, 2));
      const resellerOrgs = orgs.filter((org) => org.is_reseller);
      const resellerCustomerOrgIds = resellerOrgs.flatMap((org) => org.reseller_customer_orgs || []);
      const customerOrgs = orgs.filter((org) => resellerCustomerOrgIds.includes(org.id));
      const filteredProducerOrgs = producerOrgs.filter((producerOrg) => !customerOrgs.some((customerOrg) => _.lowerCase(customerOrg.name) === _.lowerCase(producerOrg.name)));
      setCustOrgs(customerOrgs);
      setDisplayOrgs(filteredProducerOrgs);
    }
  };

  useEffect(() => {
    if (!_.isEmpty(orgData) && isAdmin && user.organization.is_reseller) {
      localStorage.setItem('adminOrgs', JSON.stringify(orgData));
    }
    if (isSuperAdmin) {
      localStorage.removeItem('adminOrgs');
      filterAndSetDisplayOrgs(orgData);
    } else if (isAdmin) {
      const adminOrgs = JSON.parse(localStorage.getItem('adminOrgs'));
      filterAndSetDisplayOrgs(adminOrgs);
    }
  }, [orgData]);

  const handleSubmenuClick = (event, org) => {
    event.stopPropagation();
    setSubmenuAnchorEl(event.currentTarget);
    setSubmenuOrg(org);
  };

  const handleSubmenuClose = () => {
    setSubmenuAnchorEl(null);
  };

  return (
    <>
      <TextField
        className="organizationSelectorInput notranslate"
        variant="outlined"
        fullWidth
        id="org"
        label={<span className="translate">Organization</span>}
        select
        value={selectedOrg}
        onChange={(e) => {
          handleOrganizationChange(e);
          handleSubmenuClose();
        }}
        SelectProps={{
          open: mainMenuOpen,
        }}
        onClick={(e) => setMainMenuOpen(!mainMenuOpen)}
      >
        {!_.isEmpty(displayOrgs) && [...displayOrgs, ...custOrgs].map((org) => (
          <MenuItem
            className="notranslate"
            key={org.id}
            value={org.name}
            style={{ display: custOrgs.includes(org) && 'none' }}
          >
            {org.name}
            {org.is_reseller && !_.isEmpty(org.reseller_customer_orgs) && (
              <IconButton
                onClick={(event) => handleSubmenuClick(event, org)}
                className="topBarOrgSelectInput"
              >
                <ArrowRightIcon />
              </IconButton>
            )}
          </MenuItem>
        ))}
      </TextField>
      <Menu
        anchorEl={submenuAnchorEl}
        open={Boolean(submenuAnchorEl)}
        onClose={handleSubmenuClose}
      >
        {
          submenuOrg && !_.isEmpty(submenuOrg.reseller_customer_orgs) && (
            isSuperAdmin
              ? orgData.filter((org) => submenuOrg.reseller_customer_orgs.includes(org.organization_uuid)).map((org) => (
                <MenuItem
                  className="notranslate"
                  key={org.organization_uuid}
                  onClick={() => handleOrganizationChange(org.name)}
                >
                  {org.name}
                </MenuItem>
              ))
              : !_.isEmpty(JSON.parse(localStorage.getItem('adminOrgs'))) && JSON.parse(localStorage.getItem('adminOrgs')).filter((org) => submenuOrg.reseller_customer_orgs.includes(org.organization_uuid)).map((org) => (
                <MenuItem
                  className="notranslate"
                  key={org.organization_uuid}
                  onClick={() => handleOrganizationChange(org.name)}
                >
                  {org.name}
                </MenuItem>
              ))
          )
        }
      </Menu>
    </>
  );
};

export default OrganizationSelector;
