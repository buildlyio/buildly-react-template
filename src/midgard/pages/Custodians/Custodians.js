import React, { useState } from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import DataTable from "../../components/Table/Table";
import { numberWithCommas } from "../../utils/utilMethods";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";

const recallColumns = [
  { id: "shipmentId", label: "Shipment ID", minWidth: 150 },
  { id: "issue", label: "Issue", minWidth: 150 },
  {
    id: "affected",
    label: "Affected Items",
    minWidth: 150,
  },
  {
    id: "custodian",
    label: "Current Custodians",
    minWidth: 170,
  },
];

const recallRows = [
  {
    shipmentId: "10000",
    issue: "recall",
    affected: "2000",
    custodian: "CN01222",
  },
  {
    shipmentId: "20000",
    issue: "recall",
    affected: "2000",
    custodian: "CN01222",
  },
  {
    shipmentId: "30000",
    issue: "recall",
    affected: "2000",
    custodian: "CN01222",
  },
  {
    shipmentId: "40000",
    issue: "recall",
    affected: "2000",
    custodian: "CN01222",
  },
];

const delayColumns = [
  { id: "shipmentId", label: "Shipment ID", minWidth: 150 },
  {
    id: "delay",
    label: "Delay(hrs)",
    minWidth: 150,
  },
  {
    id: "itemNo",
    label: "Items",
    minWidth: 170,
  },
  {
    id: "risk",
    label: "Revenue Risk",
    minWidth: 170,
    format: (value) => `$${numberWithCommas(value)}`,
  },
  {
    id: "custodian",
    label: "Current Custodians",
    minWidth: 170,
  },
];

const delayRows = [
  {
    shipmentId: "10000",
    delay: "74",
    itemNo: "400",
    risk: "100000",
    custodian: "CN01222",
  },
  {
    shipmentId: "10000",
    delay: "74",
    itemNo: "400",
    risk: "100000",
    custodian: "CN01222",
  },
  {
    shipmentId: "10000",
    delay: "74",
    itemNo: "400",
    risk: "100000",
    custodian: "CN01222",
  },
  {
    shipmentId: "10000",
    delay: "74",
    itemNo: "400",
    risk: "100000",
    custodian: "CN01222",
  },
];

const useStyles = makeStyles((theme) => ({
  dashboardHeading: {
    fontWeight: "bold",
  },
  tileView: {
    display: "flex",
  },
  rowView: {
    display: "flex",
    flexDirection: "column",
  },
  switchViewSection: {
    background: "#383636",
    width: "100%",
    display: "flex",
    minHeight: "40px",
    alignItems: "center",
  },
  tileHeading: {
    flex: 1,
    padding: "8px",
  },
  addButton: {
    backgroundColor: "#000",
  },
}));

function Custodian({ dispatch, history, location, data }) {
  let classes = useStyles();
  const editItem = (item) => {
    console.log("edit", item);
  };
  const deletItem = (item) => {
    console.log("delete", item);
  };
  const actionsColumns = [
    { id: "edit", type: "edit", action: editItem, label: "Edit" },
    { id: "delete", type: "delete", action: deletItem, label: "Delete" },
  ];
  return (
    <Box mt={3}>
      <div className={classes.container}>
        <Box mb={3}>
          <Button
            type="button"
            // fullWidth
            variant="contained"
            color="primary"
            className={classes.addButton}
          >
            <AddIcon /> Add Custodian
          </Button>
        </Box>
        <Typography className={classes.dashboardHeading} variant={"h4"}>
          Custodians
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <DataTable
              rows={recallRows}
              columns={recallColumns}
              actionsColumns={actionsColumns}
              hasSearch={true} // To show the search field in table
            />
          </Grid>
        </Grid>
      </div>
    </Box>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.custodianReducer,
});
export default connect(mapStateToProps)(Custodian);
