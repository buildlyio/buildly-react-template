import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import _ from 'lodash';
import {
  Box,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import Forbidden from '../../components/Forbidden/Forbidden';
import { getUser } from '../../context/User.context';
import { routes } from '../../routes/routesConstants';
import { checkForAdmin, checkForGlobalAdmin } from '../../utils/utilMethods';
import Configuration from './Configuration/Configuration';
// import ImportExport from './ImportExport/ImportExport';
import ConsortiumSettings from './Consortium/ConsortiumSettings';
import './AdminPanelStyles.css';

const AdminPanel = ({
  history, location, organizationData,
}) => {
  const isAdmin = checkForAdmin(getUser()) || checkForGlobalAdmin(getUser());
  const superAdmin = checkForGlobalAdmin(getUser());

  let subNav = [
    { label: 'Configuration', value: 'configuration' },
  ];
  // if (
  //   organizationData
  //   && organizationData.allow_import_export
  // ) {
  //   subNav = [
  //     ...subNav,
  //     { label: 'Import/Export', value: 'import-export' },
  //   ];
  // }
  if (superAdmin) {
    subNav = [
      ...subNav,
      { label: 'Consortium', value: 'consortium' },
    ];
  }

  const viewPath = (_.find(
    subNav,
    (item) => _.endsWith(location.pathname, item.value),
  ) || subNav[0]).value;
  const [view, setView] = useState(viewPath);

  // this will be triggered whenever the content switcher is clicked to change the view
  useEffect(() => {
    history.push(`${routes.ADMIN_PANEL}/${view || location.state}`);
  }, [view]);

  const viewTabClicked = (event, newView) => {
    setView(newView);
  };

  return (
    <Box mt={5} mb={5}>
      {isAdmin && (
        <Box mt={5} mb={5}>
          <Box mb={3}>
            <Typography className="heading" variant="h4">
              Admin Panel
            </Typography>
          </Box>
          <Box mb={3}>
            <Tabs value={view} onChange={viewTabClicked}>
              {_.map(subNav, (itemProps, index) => (
                <Tab
                  {...itemProps}
                  key={`tab${index}:${itemProps.value}`}
                />
              ))}
            </Tabs>
          </Box>
          <Route path={routes.CONFIGURATION} component={Configuration} />
          {/* {organizationData && organizationData.allow_import_export && (
            <Route
              path={routes.IMPORT_EXPORT}
              component={ImportExport}
            />
          )} */}
          <Route path={routes.CONSORTIUM} component={ConsortiumSettings} />
        </Box>
      )}
      {!isAdmin && (
        <Forbidden
          history={history}
          location={location}
        />
      )}
    </Box>
  );
};

export default AdminPanel;
