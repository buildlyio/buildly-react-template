import React, { useEffect } from 'react';
import {
  makeStyles,
  withStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
} from '@material-ui/core';
import {
  Edit as EditIcon,
  ListAlt as ViewIcon,
  Delete as DeleteIcon,
  LinkOff as LinkOffIcon,
} from '@material-ui/icons';
import SearchInput from '@components/SearchComponent/SearchInput';

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#4F4D4D',
    },
    '&:nth-of-type(even)': {
      backgroundColor: '#383636',
    },
    '&:nth-of-type(odd):hover': {
      backgroundColor: '#000',
    },
    '&:nth-of-type(even):hover': {
      backgroundColor: '#000',
    },
  },
}))(TableRow);

const StyledTableHead = withStyles((theme) => ({
  head: {
    textTransform: 'uppercase',
    fontSize: 12.5,
    fontWeight: '400',
    padding: theme.spacing(1, 2),
    color: '#7C7A7A',
    background: '#383636',
  },
}))(TableCell);

const useStyles = makeStyles({
  root: {
    width: '100%',
    borderRadius: 0,
    background: '#383636',
  },
  container: {
    maxHeight: 440,
  },
  searchSection: {
    background: '#383636',
    width: '100%',
    display: 'flex',
    minHeight: '40px',
    alignItems: 'center',
  },
  nodata: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F4D4D',
  }
});

export default DataTable = ({ ...props }) => {
  const {
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
  const [selectedRows, setSelectedRows] = React.useState(rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage))
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    setSelectedRows(
      rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    );
  }, [rows, page, rowsPerPage])

  return (
    <Paper className={classes.root}>
      {hasSearch && (
        <div className={classes.searchSection}>
          <SearchInput
            searchValue={searchValue}
            searchAction={searchAction}
          />
        </div>
      )}
      <TableContainer className={classes.container}>
        <Table
          stickyHeader
          className={classes.table}
          aria-label='sticky table'
        >
          <TableHead>
            <StyledTableRow>
              {actionsColumns &&
                actionsColumns.map((action, index) => (
                  <StyledTableHead
                    key={`actionCol${index}:${action.id}`}
                    align={'left'}
                    style={{ minWidth: 50 }}
                  >
                    {action.label}
                  </StyledTableHead>
                ))}
              {columns.map((column, index) => (
                <StyledTableHead
                  key={`col${index}:${column.id}`}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                  }}
                >
                  {column.label}
                </StyledTableHead>
              ))}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 &&
              selectedRows.map((row, rowIndex) => (
                <StyledTableRow
                  hover
                  role='checkbox'
                  tabIndex={-1}
                  key={`tableRow${rowIndex}`}
                >
                  {actionsColumns &&
                    actionsColumns.map((action, colIndex) => (
                      <StyledTableHead
                        key={`tableRow${rowIndex}:${colIndex}`}
                        align={'left'}
                        style={{ minWidth: 50, width: 50 }}
                      >
                        <IconButton
                          className={classes.menuButton}
                          onClick={() => action.action(row)}
                          color='secondary'
                          aria-label='menu'
                        >
                          {action.type === 'edit' 
                            ? <EditIcon />
                            : action.type === 'view' 
                              ? <ViewIcon />
                              : action.type === 'unlink'
                                ? <LinkOffIcon />
                                : <DeleteIcon />
                          }
                        </IconButton>
                      </StyledTableHead>
                    ))}
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={`col${colIndex}:${column.id}`}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        maxWidth: column.maxWidth,
                        wordBreak: 'break-word',
                      }}
                    >
                      {column.format
                        ? column.format(row[column.id] || '-')
                        : row[column.id] || '-'
                      }
                    </TableCell>
                  ))}
                </StyledTableRow>
              ))}

            {rows.length === 0 && (
              <StyledTableRow>
                <TableCell
                  align='center'
                  colSpan={
                    actionsColumns
                      ? `${columns.length + actionsColumns.length}`
                      : columns.length
                  }
                >
                  No data to display
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        classes={{ toolbar: classes.toolbar }}
      />
    </Paper>
  );
}
