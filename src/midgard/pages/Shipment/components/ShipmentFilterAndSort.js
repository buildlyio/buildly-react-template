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
    // width: 200,
    zIndex: 1,
    fontSize: 13,
    color: "#586069",
    backgroundColor: "#f6f8fa",
    padding: theme.spacing(2),
  },
  container: {
    background: "#383636",
    width: "100%",
    display: "flex",
    minHeight: "40px",
    alignItems: "center",
  },
  filterButton: {
    borderRadius: "500px",
    textTransform: "Capitalize",
    padding: "3px 16px",
    margin: theme.spacing(0, 2),
  },
}));

export default function ShipmentFilterAndSort(props) {
  const classes = useStyles();
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
    handleSort,
  } = props;
  const [alertAnchor, setAlertAnchor] = useState(null);
  const [sortAnchor, setSortAnchor] = useState(null);

  const handleSortClick = (event) => {
    setSortAnchor(sortAnchor ? null : event.currentTarget);
    setAlertAnchor(null);
  };

  const handleAlertClick = (event) => {
    setAlertAnchor(alertAnchor ? null : event.currentTarget);
    setSortAnchor(null);
  };

  const handlePopoverClose = () => {
    setSortAnchor(null);
    setAlertAnchor(null);
  };

  const sortOpen = Boolean(sortAnchor);
  const alertOpen = Boolean(alertAnchor);

  return (
    <ClickAwayListener onClickAway={handlePopoverClose}>
      <div className={classes.container}>
        <Button
          type="button"
          variant="outlined"
          aria-describedby={"alert-popup"}
          color="primary"
          className={classes.filterButton}
          onClick={handleAlertClick}
          endIcon={alertOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        >
          Alerts
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
        <Button
          type="button"
          // fullWidth
          variant="outlined"
          aria-describedby={"sort-popup"}
          color="primary"
          className={classes.filterButton}
          onClick={handleSortClick}
          endIcon={sortOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        >
          Sort By
        </Button>
        <Popper
          id={"sort-popup"}
          open={sortOpen}
          anchorEl={sortAnchor}
          onClose={handlePopoverClose}
          placement={"bottom-start"}
        >
          <div className={classes.popper}>
            <List>
              <ListItem onClick={() => handleSort("dateDsc")}>
                Most Recent
              </ListItem>
              <ListItem onClick={() => handleSort("dateAsc")}>
                Least Recent
              </ListItem>
              <ListItem onClick={() => handleSort("valueDesc")}>
                Highest Value
              </ListItem>
              <ListItem onClick={() => handleSort("valueAsc")}>
                Highest Value
              </ListItem>
              <ListItem onClick={() => handleSort("nameAsc")}>
                Custodian A-Z
              </ListItem>
              <ListItem onClick={() => handleSort("nameDesc")}>
                Custodian Z-A
              </ListItem>
            </List>
          </div>
        </Popper>
      </div>
    </ClickAwayListener>
  );
}
