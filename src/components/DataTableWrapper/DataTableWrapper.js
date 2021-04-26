import React from 'react';
import MUIDataTable from 'mui-datatables';
import {
  makeStyles,
  Grid,
  Button,
  IconButton,
} from '@material-ui/core';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons';
import Loader from '@components/Loader/Loader';
import ConfirmModal from '@components/Modal/ConfirmModal';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    width: '100%',
  },
  addButton: {
    marginBottom: theme.spacing(2),
  },
  title: {
    flex: 1,
    padding: theme.spacing(1, 2),
    textTransform: 'uppercase',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
  },
  leftHeader: {
    '& span': {
      textAlign: 'left',
    },
  },
  iconHeader: {
    '& div': {
      textAlign: 'center',
    },
  },
  icon: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
}) => {
  const classes = useStyles();

  const formattedColumns = [
    {
      name: 'Edit',
      options: {
        filter: false,
        sort: false,
        empty: true,
        setCellHeaderProps: () => ({ className: classes.iconHeader }),
        customBodyRenderLite: (dataIndex) => {
          const row = rows[dataIndex];
          return (
            <div className={classes.icon}>
              <IconButton onClick={() => editAction(row)}>
                <EditIcon />
              </IconButton>
            </div>
          );
        },
      },
    },
    {
      name: 'Delete',
      options: {
        filter: false,
        sort: false,
        empty: true,
        setCellHeaderProps: () => ({ className: classes.iconHeader }),
        customBodyRenderLite: (dataIndex) => {
          const row = rows[dataIndex];
          return (
            <div className={classes.icon}>
              <IconButton onClick={() => deleteAction(row)}>
                <DeleteIcon />
              </IconButton>
            </div>
          );
        },
      },
    },
    ...columns.map((column) => ({
      ...column,
      options: {
        ...column.options,
        setCellHeaderProps: () => ({ className: classes.leftHeader }),
      },
    })),
  ];

  const options = {
    filter: true,
    filterType: 'dropdown',
    responsive: 'standard',
    tableBodyHeight: '300px',
    tableBodyMaxHeight: '',
    selectableRows: 'none',
    rowsPerPageOptions: [5, 10, 15],
    downloadOptions: { filename: `${filename}.csv`, separator: ',' },
    textLabels: {
      body: {
        noMatch: 'No data to display',
      },
    },
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        {loading && <Loader open={loading} />}
        <Grid item xs={12}>
          <Button
            className={classes.addButton}
            type="button"
            variant="contained"
            color="primary"
            onClick={onAddButtonClick}
          >
            <AddIcon />
            {addButtonHeading}
          </Button>
          <MUIDataTable
            data={rows}
            columns={formattedColumns}
            options={options}
          />
          {children}
        </Grid>
      </Grid>
      <ConfirmModal
        open={openConfirmModal}
        setOpen={setConfirmModal}
        submitAction={handleConfirmModal}
        title={confirmModalTitle}
        submitText="Delete"
      />
    </div>
  );
};

export default DataTableWrapper;
