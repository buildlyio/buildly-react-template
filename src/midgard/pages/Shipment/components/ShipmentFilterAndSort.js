import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Popper from "@material-ui/core/Popper";
import Button from "@material-ui/core/Button";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { Grid, List, ListItem } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

const useStyles = makeStyles((theme) => ({
  popper: {
    border: "1px solid rgba(27,31,35,.15)",
    boxShadow: "0 3px 12px rgba(27,31,35,.15)",
    borderRadius: 3,
    zIndex: 1,
    fontSize: 16,
    backgroundColor: "#383636",
    color: "#fff",
    padding: theme.spacing(2),
  },
  container: {
    background: "#7C7A7A",
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    minHeight: "40px",
    alignItems: "center",
    padding: theme.spacing(1),
  },
  filterButton: {
    borderRadius: "500px",
    padding: "3px 16px",
    margin: theme.spacing(0.5, 1),
    borderColor: '#fff',
    color: '#fff'
  },
}));

const StatusFilter = (props) => {
  const {
    plannedCheck,
    enrouteCheck,
    cancelledCheck,
    completedCheck,
    handleStatusClick,
    handlePlannedCheck,
    handleEnrouteCheck,
    handleCompeletedCheck,
    handleCancelledCheck,
    statusOpen,
    statusAnchor,
    handlePopoverClose,
    handleStatusAllCheck,
    statusAllCheck,
    classes,
  } = props;
  return (
    <React.Fragment>
      <Button
        type="button"
        variant="outlined"
        aria-describedby={"alert-popup"}
        color="primary"
        className={classes.filterButton}
        onClick={handleStatusClick}
        endIcon={statusOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      >
        Shipment status
      </Button>
      <Popper
        id={"alert-popup"}
        open={statusOpen}
        anchorEl={statusAnchor}
        placement={"bottom-start"}
        onClose={handlePopoverClose}
      >
        <div className={classes.popper}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={statusAllCheck || false}
                  onChange={(e) => handleStatusAllCheck(e)}
                  name="allCheck"
                  id="name"
                  color="primary"
                />
              }
              label="All"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={plannedCheck || false}
                  onChange={(e) => handlePlannedCheck(e)}
                  name="checkedB"
                  color="primary"
                />
              }
              label="Planned"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={enrouteCheck || false}
                  onChange={(e) => handleEnrouteCheck(e)}
                  name="checkedB"
                  color="primary"
                />
              }
              label="Enroute"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={cancelledCheck || false}
                  onChange={(e) => handleCancelledCheck(e)}
                  name="checkedB"
                  color="primary"
                />
              }
              label="Cancelled"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={completedCheck || false}
                  onChange={(e) => handleCompeletedCheck(e)}
                  name="checkedB"
                  color="primary"
                />
              }
              label="Compeleted"
            />
          </FormGroup>
        </div>
      </Popper>
    </React.Fragment>
  );
};

const SortFilter = (props) => {
  const {
    handleSort,
    sortValue,
    sortAnchor,
    handleSortClick,
    sortOpen,
    handlePopoverClose,
    classes,
  } = props;
  return (
    <React.Fragment>
      <Button
        type="button"
        variant="outlined"
        aria-describedby={"sort-popup"}
        color="primary"
        className={classes.filterButton}
        onClick={handleSortClick}
        endIcon={sortOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      >
        Sort by
      </Button>
      <Popper
        id={"sort-popup"}
        open={sortOpen}
        anchorEl={sortAnchor}
        onClose={handlePopoverClose}
        placement={"bottom-start"}
      >
        <div className={classes.popper}>
          <List component="ul">
            <ListItem
              button
              selected={sortValue === "dateDesc"}
              onClick={() => handleSort("dateDesc")}
            >
              Most recent
            </ListItem>
            <ListItem
              button
              selected={sortValue === "dateAsc"}
              onClick={() => handleSort("dateAsc")}
            >
              Least recent
            </ListItem>
            <ListItem
              button
              selected={sortValue === "valueDesc"}
              onClick={() => handleSort("valueDesc")}
            >
              Highest value
            </ListItem>
            <ListItem
              button
              selected={sortValue === "valueAsc"}
              onClick={() => handleSort("valueAsc")}
            >
              Lowest value
            </ListItem>
            <ListItem
              button
              selected={sortValue === "nameAsc"}
              onClick={() => handleSort("nameAsc")}
            >
              Custodian A-Z
            </ListItem>
            <ListItem
              button
              selected={sortValue === "nameDesc"}
              onClick={() => handleSort("nameDesc")}
            >
              Custodian Z-A
            </ListItem>
          </List>
        </div>
      </Popper>
    </React.Fragment>
  );
};

const AlertFilter = (props) => {
  const {
    allCheck,
    handleAllCheck,
    recallCheck,
    handleRecallCheck,
    temepratureCheck,
    handleTemperatureCheck,
    humidityCheck,
    handleHumidityCheck,
    lateShipment,
    handleLateCheck,
    alertAnchor,
    alertOpen,
    handlePopoverClose,
    handleAlertClick,
    classes,
  } = props;
  return (
    <React.Fragment>
      <Button
        type="button"
        variant="outlined"
        aria-describedby={"alert-popup"}
        color="primary"
        className={classes.filterButton}
        onClick={handleAlertClick}
        endIcon={alertOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      >
        Alert type
      </Button>
      <Popper
        id={"alert-popup"}
        open={alertOpen}
        anchorEl={alertAnchor}
        placement={"bottom-start"}
        onClose={handlePopoverClose}
      >
        <div className={classes.popper}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={allCheck || false}
                  onChange={(e) => handleAllCheck(e)}
                  name="allCheck"
                  id="name"
                  color="primary"
                />
              }
              label="All"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={recallCheck || false}
                  onChange={(e) => handleRecallCheck(e)}
                  name="checkedB"
                  color="primary"
                />
              }
              label="Recall"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={temepratureCheck || false}
                  onChange={(e) => handleTemperatureCheck(e)}
                  name="checkedB"
                  color="primary"
                />
              }
              label="Temperature"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={humidityCheck || false}
                  onChange={(e) => handleHumidityCheck(e)}
                  name="checkedB"
                  color="primary"
                />
              }
              label="Humidity"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={lateShipment || false}
                  onChange={(e) => handleLateCheck(e)}
                  name="checkedB"
                  color="primary"
                />
              }
              label="Late Shipment"
            />
          </FormGroup>
        </div>
      </Popper>
    </React.Fragment>
  );
};

export default function ShipmentFilterAndSort(props) {
  const classes = useStyles();
  const {
    alertAnchor,
    setAlertAnchor,
    sortAnchor,
    setSortAnchor,
    setStatusAnchor,
    statusAnchor,
  } = props;

  const handleSortClick = (event) => {
    setSortAnchor(sortAnchor ? null : event.currentTarget);
    setAlertAnchor(null);
    setStatusAnchor(null);
  };

  const handleAlertClick = (event) => {
    setAlertAnchor(alertAnchor ? null : event.currentTarget);
    setSortAnchor(null);
    setStatusAnchor(null);
  };

  const handlePopoverClose = () => {
    setSortAnchor(null);
    setAlertAnchor(null);
    setStatusAnchor(null);
  };

  const handleStatusClick = (event) => {
    setStatusAnchor(statusAnchor ? null : event.currentTarget);
    setSortAnchor(null);
    setAlertAnchor(null);
  };

  const sortOpen = Boolean(sortAnchor);
  const alertOpen = Boolean(alertAnchor);
  const statusOpen = Boolean(statusAnchor);

  return (
    <ClickAwayListener onClickAway={handlePopoverClose}>
      <div className={classes.container}>
        <AlertFilter
          {...props}
          alertOpen={alertOpen}
          classes={classes}
          handleAlertClick={handleAlertClick}
          handlePopoverClose={handlePopoverClose}
        />
        <SortFilter
          {...props}
          sortOpen={sortOpen}
          classes={classes}
          handleSortClick={handleSortClick}
          handlePopoverClose={handlePopoverClose}
        />
        <StatusFilter
          {...props}
          statusOpen={statusOpen}
          classes={classes}
          handleStatusClick={handleStatusClick}
          handlePopoverClose={handlePopoverClose}
        />
      </div>
    </ClickAwayListener>
  );
}
