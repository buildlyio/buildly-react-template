import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Route } from "react-router-dom";
import { routes } from "midgard/routes/routesConstants";
import Configuration from "./Configuration/Configuration";

const useStyles = makeStyles((theme) => ({
  heading: {
    fontWeight: "bold",
    margin: "0.5em 0",
  },
}));

/**
 * Outputs the admin panel page.
 */
const AdminPanel = ({ history, location }) => {
  const classes = useStyles();
  const subNav = [
    { label: "Configuration", value: "configuration" },
  ];
  const viewPath = (subNav.find(item => location.pathname.endsWith(item.value)) || subNav[0]).value;
  const [view, setView] = useState(viewPath);

  // this will be triggered whenever the content switcher is clicked to change the view
  useEffect(() => {
    history.push(`${routes.ADMIN_PANEL}/${view || location.state}`);
  }, [view]);

  const viewTabClicked = (event, view) => {
    setView(view);
  };

  return (
    <Box mt={5} mb={5}>
      <Box mb={3}>
        <Typography className={classes.heading} variant={"h4"}>
          Admin Panel
        </Typography>
      </Box>
      <Box mb={3}>
        <Tabs value={view} onChange={viewTabClicked}>
          {subNav.map((itemProps, index) => <Tab {...itemProps} key={`tab${index}:${itemProps.value}`} />)}
        </Tabs>
      </Box>
      <Route path={routes.CONFIGURATION} component={Configuration} />
    </Box>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
});

export default connect(mapStateToProps)(AdminPanel);
