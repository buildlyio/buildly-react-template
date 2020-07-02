import React from "react";
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
import SearchInput from "../SearchComponent/SearchInput";

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

const StyledTableHead = withStyles((theme) => ({
  head: {
    fontWeight: "bold",
    color: " #fff",
    background: "#000",
  },
}))(TableCell);

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
  searchSection: {
    background: "#383636",
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
});

export default function DataTable({ ...props }) {
  let {
    rows,
    columns,
    actionsColumns,
    hasSearch,
    searchValue,
    searchAction,
    showTotal,
  } = props;
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      {hasSearch && (
        <div className={classes.searchSection}>
          <SearchInput searchValue={searchValue} searchAction={searchAction} />
        </div>
      )}
      <TableContainer className={classes.container}>
        <Table stickyHeader className={classes.table} aria-label="sticky table">
          <TableHead>
            <StyledTableRow>
              {columns.map((column) => (
                <StyledTableHead
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </StyledTableHead>
              ))}
              {actionsColumns &&
                actionsColumns.map((action, id) => (
                  <StyledTableHead
                    key={action.id}
                    align={"left"}
                    style={{ minWidth: 50 }}
                  >
                    {action.label}
                  </StyledTableHead>
                ))}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 &&
              rows
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, idx) => {
                  return (
                    <StyledTableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={`tableRow${idx}`}
                    >
                      {columns.map((column) => {
                        const value = row[column.id] || "";
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format ? column.format(value) : value}
                          </TableCell>
                        );
                      })}
                      {actionsColumns &&
                        actionsColumns.map((action, id) => {
                          const actionItemType = action.type;
                          return (
                            <StyledTableHead
                              key={action.id}
                              align={"left"}
                              style={{ minWidth: 50 }}
                            >
                              <IconButton
                                className={classes.menuButton}
                                onClick={() => action.action(row)}
                                color="secondary"
                                aria-label="menu"
                              >
                                {actionItemType === "edit" ? (
                                  <EditIcon />
                                ) : (
                                  <DeleteIcon />
                                )}
                              </IconButton>
                            </StyledTableHead>
                          );
                        })}
                    </StyledTableRow>
                  );
                })}

            {rows.length === 0 && (
              <StyledTableRow>
                <TableCell
                  align="center"
                  colSpan={
                    actionsColumns
                      ? `${columns.length + actionsColumns.length}`
                      : columns.length
                  }
                >
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
