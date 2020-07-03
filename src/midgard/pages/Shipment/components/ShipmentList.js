import React, { useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import SearchInput from "../../../components/SearchComponent/SearchInput";
import theme from "../../../../styles/theme";
import { Divider } from "@material-ui/core";
import ShipmentFilterAndSort from "./ShipmentFilterAndSort";
import { dispatch } from "../../../redux/store";
import { filterShipmentData } from "../../../redux/shipment/actions/shipment.actions";

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: "#BEBABA",
    },
    "&:nth-of-type(odd):hover": {
      backgroundColor: "#DCD9D8",
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
  searchSection: {
    background: "#878282",
    width: "100%",
    display: "flex",
    minHeight: "40px",
    alignItems: "center",
  },
  nodata: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BEBABA",
  },
  tableCell: {
    padding: theme.spacing(0, 1),
    borderBottom: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  searchComponent: {
    [theme.breakpoints.up("sm")]: {
      width: "100%",
    },
  },
  searchInput: {
    [theme.breakpoints.up("md")]: {
      width: "100%",
    },
  },
});

export default function ShipmentList({ ...props }) {
  let {
    rows,
    columns,
    actionsColumns,
    hasSearch,
    hasSort,
    editAction,
    deleteAction,
    dispatch,
    filteredRows,
  } = props;
  const classes = useStyles();
  const [allCheck, setAllCheck] = useState(false);
  const [recallCheck, setRecallCheck] = useState(false);
  const [temepratureCheck, setTemperatureCheck] = useState(false);
  const [humidityCheck, setHumidityCheck] = useState(false);
  const [lateShipment, setLateShipmentCheck] = useState(false);
  const [sortValue, setSortValue] = useState("");
  const [filterObject, setFilterObject] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [alertAnchor, setAlertAnchor] = useState(null);
  const [sortAnchor, setSortAnchor] = useState(null);
  const [statusAnchor, setStatusAnchor] = useState(null);
  const [statusAllCheck, setStatusAllCheck] = useState(null);
  const [enrouteCheck, setEnrouteCheck] = useState(null);
  const [plannedCheck, setPlannedCheck] = useState(null);
  const [cancelledCheck, setCancelledCheck] = useState(null);
  const [compeletedCheck, setCompeletedCheck] = useState(null);

  const handleAllCheck = (e) => {
    setAllCheck(e.target.checked);
    let prevFilters = { ...filterObject };
    if (e.target.checked) {
      setRecallCheck(true);
      setTemperatureCheck(true);
      setHumidityCheck(true);
      setLateShipmentCheck(true);
      let filterObj = {
        ...prevFilters,
        type: "alert",
        temp: true,
        humid: true,
        delay: true,
        recall: true,
      };
      setFilterObject(filterObj);
      dispatch(filterShipmentData(rows, filterObj));
    } else {
      setRecallCheck(false);
      setTemperatureCheck(false);
      setHumidityCheck(false);
      setLateShipmentCheck(false);
      let filterObj = {
        ...prevFilters,
        type: "alert",
        temp: false,
        humid: false,
        delay: false,
        recall: false,
      };
      setFilterObject(filterObj);
      dispatch(filterShipmentData(rows, filterObj));
    }
  };

  const handleRecallCheck = (e) => {
    setRecallCheck(e.target.checked);
    let prevFilters = { ...filterObject };
    let filterObj = {
      ...prevFilters,
      type: "alert",
      recall: e.target.checked,
    };
    setFilterObject(filterObj);
    dispatch(filterShipmentData(rows, filterObj));
  };

  const handleTemperatureCheck = (e) => {
    setTemperatureCheck(e.target.checked);
    let prevFilters = { ...filterObject };

    let filterObj = {
      ...prevFilters,
      type: "alert",
      temp: e.target.checked,
    };
    setFilterObject(filterObj);
    dispatch(filterShipmentData(rows, filterObj));
  };
  const handleHumidityCheck = (e) => {
    setHumidityCheck(e.target.checked);
    let prevFilters = { ...filterObject };
    let filterObj = {
      ...prevFilters,
      type: "alert",
      humid: e.target.checked,
    };
    setFilterObject(filterObj);
    dispatch(filterShipmentData(rows, filterObj));
  };
  const handleLateCheck = (e) => {
    setLateShipmentCheck(e.target.checked);
    let prevFilters = { ...filterObject };
    let filterObj = {
      ...prevFilters,
      type: "alert",
      delay: e.target.checked,
    };
    setFilterObject(filterObj);
    dispatch(filterShipmentData(rows, filterObj));
  };

  const handleStatusAllCheck = (e) => {
    setStatusAllCheck(e.target.checked);
    let prevFilters = { ...filterObject };
    if (e.target.checked) {
      setEnrouteCheck(true);
      setCancelledCheck(true);
      setPlannedCheck(true);
      setCompeletedCheck(true);
      let filterObj = {
        ...prevFilters,
        type: "status",
        planned: true,
        compeleted: true,
        enroute: true,
        cancelled: true,
      };
      setFilterObject(filterObj);
      dispatch(filterShipmentData(rows, filterObj));
    } else {
      setEnrouteCheck(false);
      setCancelledCheck(false);
      setPlannedCheck(false);
      setCompeletedCheck(false);
      let filterObj = {
        ...prevFilters,
        type: "status",
        temp: false,
        humid: false,
        delay: false,
        recall: false,
      };
      setFilterObject(filterObj);
      dispatch(filterShipmentData(rows, filterObj));
    }
  };

  const handleCompeletedCheck = (e) => {
    setCompeletedCheck(e.target.checked);
    let prevFilters = { ...filterObject };

    let filterObj = {
      ...prevFilters,
      type: "status",
      compeleted: e.target.checked,
    };
    setFilterObject(filterObj);
    dispatch(filterShipmentData(rows, filterObj));
  };

  const handleEnrouteCheck = (e) => {
    setEnrouteCheck(e.target.checked);
    let prevFilters = { ...filterObject };

    let filterObj = {
      ...prevFilters,
      type: "status",
      enroute: e.target.checked,
    };
    setFilterObject(filterObj);
    dispatch(filterShipmentData(rows, filterObj));
  };
  const handleCancelledCheck = (e) => {
    setCancelledCheck(e.target.checked);
    let prevFilters = { ...filterObject };
    let filterObj = {
      ...prevFilters,
      type: "status",
      cancelled: e.target.checked,
    };
    setFilterObject(filterObj);
    dispatch(filterShipmentData(rows, filterObj));
  };
  const handlePlannedCheck = (e) => {
    setPlannedCheck(e.target.checked);
    let prevFilters = { ...filterObject };
    let filterObj = {
      ...prevFilters,
      type: "status",
      planned: e.target.checked,
    };
    setFilterObject(filterObj);
    dispatch(filterShipmentData(rows, filterObj));
  };

  const handleSort = (sortValue) => {
    setSortValue(sortValue);
    let prevFilters = { ...filterObject };

    let filterObj = {
      ...prevFilters,
      type: "sort",
      valueType: "sort",
      value: sortValue,
    };
    setFilterObject(filterObj);
    dispatch(filterShipmentData(rows, filterObj));
    setSortAnchor(null);
  };
  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    let prevFilters = { ...filterObject };

    let filterObj = {
      ...prevFilters,
      type: "search",
      value: e.target.value,
      searchFields: [
        "shipment_uuid",
        "estimated_time_of_arrival",
        "name",
        "custodian_name",
        "value",
      ],
    };
    setFilterObject(filterObj);
    dispatch(filterShipmentData(rows, filterObj));
  };
  return (
    <Paper className={classes.root}>
      {hasSearch && (
        <div className={classes.searchSection}>
          <SearchInput
            searchValue={searchValue}
            searchAction={handleSearch}
            customContainerClass={classes.searchComponent}
            customSearchInputClass={classes.searchInput}
          />
        </div>
      )}
      {hasSort && (
        <ShipmentFilterAndSort
          allCheck={allCheck}
          handleAllCheck={handleAllCheck}
          recallCheck={recallCheck}
          handleRecallCheck={handleRecallCheck}
          temepratureCheck={temepratureCheck}
          handleTemperatureCheck={handleTemperatureCheck}
          humidityCheck={humidityCheck}
          handleHumidityCheck={handleHumidityCheck}
          lateShipment={lateShipment}
          handleLateCheck={handleLateCheck}
          sortValue={sortValue}
          handleSort={handleSort}
          alertAnchor={alertAnchor}
          setAlertAnchor={setAlertAnchor}
          sortAnchor={sortAnchor}
          setSortAnchor={setSortAnchor}
          statusAnchor={statusAnchor}
          setStatusAnchor={setStatusAnchor}
          handlePlannedCheck={handlePlannedCheck}
          handleStatusAllCheck={handleStatusAllCheck}
          handleCancelledCheck={handleCancelledCheck}
          handleEnrouteCheck={handleEnrouteCheck}
          handleCompeletedCheck={handleCompeletedCheck}
          statusAllCheck={statusAllCheck}
          compeletedCheck={compeletedCheck}
          plannedCheck={plannedCheck}
          enrouteCheck={enrouteCheck}
          cancelledCheck={cancelledCheck}
        />
      )}
      <TableContainer className={classes.container}>
        <Table stickyHeader className={classes.table} aria-label="sticky table">
          <TableBody>
            {filteredRows.length > 0 &&
              filteredRows

                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, idx) => {
                  return (
                    <React.Fragment key={`tableRow${idx}`}>
                      <StyledTableRow hover tabIndex={-1}>
                        <TableCell key={row.id} colSpan={3}>
                          <Table>
                            <TableBody>
                              <TableRow>
                                <TableCell
                                  title={`Shipment#: ${row.shipment_uuid}`}
                                  className={classes.tableCell}
                                  colSpan={columns.length + 2}
                                >
                                  {`Shipment#: ${row.shipment_uuid}`}
                                  <Divider />
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                {columns &&
                                  columns.map((column) => {
                                    if (column.id !== "id") {
                                      const value = row[column.id] || "";
                                      return (
                                        <TableCell
                                          style={{
                                            width: column.width,
                                            maxWidth: column.maxWidth,
                                            minWidth: column.minWidth,
                                          }}
                                          className={classes.tableCell}
                                          key={column.id}
                                          align={column.align}
                                          title={
                                            column.format
                                              ? column.format(value)
                                              : value
                                          }
                                        >
                                          {column.format
                                            ? column.format(value, row)
                                            : value}
                                        </TableCell>
                                      );
                                    }
                                  })}
                                <TableCell className={classes.tableCell}>
                                  <IconButton
                                    className={classes.menuButton}
                                    onClick={() => editAction(row)}
                                    color="secondary"
                                    aria-label="menu"
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                  <IconButton
                                    className={classes.menuButton}
                                    onClick={() => deleteAction(row)}
                                    color="secondary"
                                    aria-label="menu"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableCell>
                      </StyledTableRow>
                    </React.Fragment>
                  );
                })}
            {filteredRows.length === 0 && (
              <StyledTableRow>
                <TableCell align="center" colSpan={columns.length + 2}>
                  No Data To Display
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <TablePagination
        rowsPerPageOptions={[5, 6, 10]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      /> */}
    </Paper>
  );
}
