import React from 'react';
import MUIDataTable from 'mui-datatables';
import {
  Grid,
  Button,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import Loader from '../Loader/Loader';
import ConfirmModal from '../Modal/ConfirmModal';

const useStyles = makeStyles((theme) => ({
  dashboardHeading: {
    fontWeight: 'bold',
    marginBottom: '0.5em',
  },
  iconButton: {
    padding: 0,
    color: theme.palette.primary.dark,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  },
  dataTableBody: {
    '&:hover': {
      backgroundColor: 'none',
    },
  },
  dataTable: {
    '& .MuiPaper-root > .MuiToolbar-root': {
      backgroundColor: theme.palette.primary.dark,
      '& .MuiSvgIcon-root': {
        fill: theme.palette.background.default,
      },
    },
    '& tr > th': {
      backgroundColor: theme.palette.primary.light,
    },
    '& .MuiTableFooter-root': {
      backgroundColor: theme.palette.primary.light,
    },
  },
}));

const DataTableWrapper = ({
  loading,
  rows,
  columns,
  filename,
  addButtonHeading,
  onAddButtonClick,
  children,
  editAction,
  deleteAction,
  openDeleteModal,
  setDeleteModal,
  handleDeleteModal,
  deleteModalTitle,
  tableHeight,
  tableHeader,
  hideAddButton,
  selectable,
  selected,
  customSort,
  customTheme,
  noSpace,
  noOptionsIcon,
  centerLabel,
  extraOptions,
}) => {
  const classes = useStyles();

  let finalColumns = [];
  if (editAction) {
    finalColumns = [
      ...finalColumns,
      {
        name: 'Edit',
        options: {
          filter: false,
          sort: false,
          empty: true,
          setCellHeaderProps: () => ({ style: { textAlign: centerLabel ? 'center' : 'start' } }),
          customBodyRenderLite: (dataIndex) => (
            <IconButton
              className={classes.iconButton}
              onClick={() => editAction(rows[dataIndex])}
            >
              <EditIcon />
            </IconButton>
          ),
        },
      },
    ];
  }
  if (deleteAction) {
    finalColumns = [
      ...finalColumns,
      {
        name: 'Delete',
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRenderLite: (dataIndex) => (
            <IconButton
              className={classes.iconButton}
              onClick={() => deleteAction(rows[dataIndex])}
            >
              <DeleteIcon />
            </IconButton>
          ),
        },
      },
    ];
  }
  finalColumns = [
    ...finalColumns,
    ...columns,
  ];

  const options = {
    download: !noOptionsIcon,
    print: !noOptionsIcon,
    search: !noOptionsIcon,
    viewColumns: !noOptionsIcon,
    filter: !noOptionsIcon,
    filterType: 'multiselect',
    responsive: 'standard',
    tableBodyHeight: tableHeight || '',
    selectableRows: selectable && selectable.rows
      ? selectable.rows
      : 'none',
    selectToolbarPlacement: 'none',
    selectableRowsHeader: selectable && selectable.rowsHeader
      ? selectable.rowsHeader
      : true,
    selectableRowsHideCheckboxes: selectable && selectable.rowsHideCheckboxes
      ? selectable.rowsHideCheckboxes
      : false,
    rowsSelected: selected || [],
    rowsPerPageOptions: [5, 10, 15],
    downloadOptions: noOptionsIcon
      ? {
        filename: 'nothing.csv',
        separator: ',',
        filterOptions: {
          useDisplayedColumnsOnly: true,
        },
      }
      : {
        filename: `${filename}.csv`,
        separator: ',',
        filterOptions: {
          useDisplayedColumnsOnly: true,
        },
      },
    textLabels: {
      body: {
        noMatch: 'No data to display',
      },
    },
    setRowProps: (row, dataIndex, rowIndex) => !customTheme && ({
      className: classes.dataTableBody,
    }),
    customSort,
    ...extraOptions,
  };

  return (
    <Box mt={noSpace ? 0 : 5} mb={noSpace ? 0 : 5}>
      {loading && <Loader open={loading} />}
      <div>
        {!hideAddButton && (
          <Box mb={3} mt={2}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={onAddButtonClick}
            >
              <AddIcon />
              {` ${addButtonHeading}`}
            </Button>
          </Box>
        )}
        {tableHeader && (
          <Typography
            className={classes.dashboardHeading}
            variant="h4"
          >
            {tableHeader}
          </Typography>
        )}
        <Grid
          className={`${!customTheme && classes.dataTable}`}
          container
          spacing={2}
        >
          <Grid item xs={12}>
            <MUIDataTable
              data={rows}
              columns={finalColumns}
              options={options}
            />
          </Grid>
        </Grid>
        {children}
      </div>

      {deleteAction && (
      <ConfirmModal
        open={openDeleteModal}
        setOpen={setDeleteModal}
        submitAction={handleDeleteModal}
        title={deleteModalTitle}
        submitText="Delete"
      />
      )}
    </Box>
  );
};

export default DataTableWrapper;
