import React from 'react';
import {
  makeStyles,
  Typography,
  Box,
  Grid,
  Button,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import ConfirmModal from '@components/Modal/ConfirmModal';
import Loader from '@components/Loader/Loader';
import DataTable from '@components/Table/Table';

const useStyles = makeStyles((theme) => ({
  dashboardHeading: {
    fontWeight: 'bold',
    marginBottom: '0.5em',
  },
}));

const DashboardWrapper = (props) => {
  const {
    loading,
    onAddButtonClick,
    dashboardHeading,
    addButtonHeading,
    editAction,
    deleteAction,
    columns,
    rows,
    hasSearch,
    search,
    openConfirmModal,
    setConfirmModal,
    handleConfirmModal,
    confirmModalTitle,
    children,
    redirectTo,
  } = props;
  const classes = useStyles();
  const actionsColumns = [
    {
      id: 'edit',
      type: 'edit',
      action: editAction,
      label: 'Edit',
    },
    {
      id: 'delete',
      type: 'delete',
      action: deleteAction,
      label: 'Delete',
    },
  ];
  return (
    <Box mt={5} mb={3}>
      {loading && <Loader open={loading} />}
      <div className={classes.container}>
        {addButtonHeading && (
          <Box mb={3}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={onAddButtonClick}
            >
              <AddIcon />
              {addButtonHeading}
            </Button>
          </Box>
        )}
        {!redirectTo && (
          <Typography
            className={classes.dashboardHeading}
            variant="h4"
          >
            {dashboardHeading}
          </Typography>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <DataTable
              rows={rows || []}
              columns={columns}
              actionsColumns={actionsColumns}
              hasSearch={hasSearch}
              searchAction={search.searchAction}
              searchValue={search.searchValue} // To show the search field in table
            />
          </Grid>
        </Grid>
      </div>
      <ConfirmModal
        open={openConfirmModal}
        setOpen={setConfirmModal}
        submitAction={handleConfirmModal}
        title={confirmModalTitle}
        submitText="Delete"
      />
      {children}
    </Box>
  );
};

export default DashboardWrapper;
