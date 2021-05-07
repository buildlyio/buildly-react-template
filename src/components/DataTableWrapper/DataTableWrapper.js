import React from 'react';
import MUIDataTable from 'mui-datatables';
import {
  makeStyles,
  Grid,
  Button,
  IconButton,
  Box,
  Typography,
} from '@material-ui/core';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons';
import Loader from '@components/Loader/Loader';
import ConfirmModal from '@components/Modal/ConfirmModal';

const useStyles = makeStyles((theme) => ({
  dashboardHeading: {
    fontWeight: 'bold',
    marginBottom: '0.5em',
  },
  iconButton: {
    padding: theme.spacing(1.5, 0),
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
  children,
  editAction,
  deleteAction,
  openConfirmModal,
  setConfirmModal,
  handleConfirmModal,
  confirmModalTitle,
  tableHeight,
  tableHeader,
  hideAddButton,
}) => {
  const classes = useStyles();

  const finalColumns = [
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
    ...columns,
  ];

  const options = {
    filter: true,
    filterType: 'multiselect',
    responsive: 'standard',
    selectableRows: 'none',
    selectToolbarPlacement: 'none',
    tableBodyHeight: tableHeight || '',
    rowsPerPageOptions: [5, 10, 15],
    downloadOptions: {
      filename: `${filename}.csv`,
      separator: ',',
    },
    textLabels: {
      body: {
        noMatch: 'No data to display',
      },
    },
    setRowProps: (row, dataIndex, rowIndex) => ({
      className: classes.dataTableBody,
    }),
  };

  return (
    <Box mt={5} mb={5}>
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
          className={classes.dataTable}
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

      <ConfirmModal
        open={openConfirmModal}
        setOpen={setConfirmModal}
        submitAction={handleConfirmModal}
        title={confirmModalTitle}
        submitText="Delete"
      />
    </Box>
  );
};

export default DataTableWrapper;
