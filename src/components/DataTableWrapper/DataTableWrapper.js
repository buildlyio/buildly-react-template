import React from 'react';
import MUIDataTable from 'mui-datatables';
import makeStyles from '@mui/styles/makeStyles';
import {
  Grid,
  Button,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import Loader from '@components/Loader/Loader';
import ConfirmModal from '@components/Modal/ConfirmModal';

const useStyles = makeStyles((theme) => ({
  dashboardHeading: {
    fontWeight: 'bold',
    marginBottom: '0.5em',
  },
  iconButton: {
    padding: theme.spacing(1.5, 0.5),
  },
  dataTableBody: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#4F4D4D',
    },
    '&:nth-of-type(even)': {
      backgroundColor: '#383636',
    },
    '&:hover': {
      backgroundColor: '#000 !important',
    },
  },
  dataTable: {
    '& .MuiPaper-root': {
      backgroundColor: '#383636',
    },
    '& tr > th': {
      backgroundColor: '#383636',
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
  additionalButtonHeading,
  onAdditionalButtonClick,
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
  hideAdditionalButton,
  selectable,
  selected,
  customSort,
  noCustomTheme,
  noSpace,
  noOptionsIcon,
  onRowSelectChange
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
    onRowSelectionChange: (currentRowsExpanded, allRowsExpanded, rowsExpanded) => {
      onRowSelectChange(rowsExpanded);
    },
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
      }
      : {
        filename: `${filename}.csv`,
        separator: ',',
      },
    textLabels: {
      body: {
        noMatch: 'No data to display',
      },
    },
    setRowProps: (row, dataIndex, rowIndex) => !noCustomTheme && ({
      className: classes.dataTableBody,
    }),
    customSort,
  };

  return (
    <Box mt={noSpace ? 0 : 5} mb={noSpace ? 0 : 5}>
      {loading && <Loader open={loading} />}
      <div>
        <Box mb={3} mt={2}>
          {!hideAddButton && (
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={onAddButtonClick}
              sx={{
                marginRight: '16px',
              }}
            >
              <AddIcon />
              {` ${addButtonHeading}`}
            </Button>
          )}
          {!hideAdditionalButton && (
              <Button
                  type="button"
                  variant="outlined"
                  color="error"
                  onClick={onAdditionalButtonClick}
              >
                <CloseIcon />
                {` ${additionalButtonHeading}`}
              </Button>
          )}
        </Box>
        {tableHeader && (
          <Typography
            className={classes.dashboardHeading}
            variant="h4"
          >
            {tableHeader}
          </Typography>
        )}
        <Grid
          className={`${!noCustomTheme && classes.dataTable}`}
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
