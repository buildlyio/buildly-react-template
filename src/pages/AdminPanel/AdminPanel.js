import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  makeStyles,
  Box,
  Typography,
  Tabs,
  Tab,
} from '@material-ui/core';
import { routes } from '@routes/routesConstants';
import Configuration from './Configuration/Configuration';
import ImportExport from './ImportExport/ImportExport';

const useStyles = makeStyles((theme) => ({
  heading: {
    fontWeight: 'bold',
    margin: '0.5em 0',
  },
}));

/**
 * Outputs the admin panel page.
 */
const AdminPanel = ({ history, location, organizationData }) => {
  const classes = useStyles();
  const subNav = organizationData && organizationData.allow_import_export
    ? [
      { label: 'Configuration', value: 'configuration' },
      { label: 'Import/Export', value: 'import-export' },
    ]
    : [
      { label: 'Configuration', value: 'configuration' },
    ];
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
      <Box mb={3}>
        <Typography className={classes.heading} variant="h4">
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
      {organizationData
      && organizationData.allow_import_export
      && (
        <Route
          path={routes.IMPORT_EXPORT}
          component={ImportExport}
        />
      )}
    </Box>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
});

export default connect(mapStateToProps)(AdminPanel);
