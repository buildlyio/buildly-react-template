import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  makeStyles, Box, Typography, Grid, Button,
} from '@material-ui/core';
import FormModal from '@components/Modal/FormModal';
import DataTable from '@components/Table/Table';
import { UserContext } from '@context/User.context';
import AddCustodyForm, {
  checkIfCustodianInfoEdited,
} from './AddCustodyForm';
import {
  getFormattedCustodyRows,
  custodyColumns,
} from '../../ShipmentConstants';

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    margin: theme.spacing(8, 0),
    textAlign: 'center',
    justifyContent: 'center',
  },
  submit: {
    borderRadius: '18px',
    fontSize: 11,
  },
  formTitle: {
    fontWeight: 'bold',
    marginTop: '1em',
    textAlign: 'center',
  },
}));

const CustodianInfo = (props) => {
  const {
    custodianData,
    history,
    handleNext,
    handleCancel,
    shipmentFormData,
    dispatch,
    custodyData,
    viewOnly,
  } = props;
  const classes = useStyles();
  const [itemIds, setItemIds] = useState(
    (shipmentFormData && shipmentFormData.custodian_ids) || [],
  );
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [rows, setRows] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const organization = useContext(UserContext).organization.organization_uuid;

  useEffect(() => {
    if (
      custodyData
      && custodyData.length
      && custodianData
      && custodianData.length
      && shipmentFormData
    ) {
      const filteredCustodyData = _.filter(
        custodyData,
        { shipment_id: shipmentFormData.shipment_uuid },
      );
      const customizedRows = getFormattedCustodyRows(
        filteredCustodyData,
        custodianData,
      );
      setRows(customizedRows);
    }
  }, [custodyData, custodianData, shipmentFormData]);

  const handleConfirmModal = () => {
    setConfirmModal(false);
    setOpenModal(false);
  };

  const oncloseModal = () => {
    if (checkIfCustodianInfoEdited()) {
      setConfirmModal(true);
    } else {
      setEditItem(null);
      setOpenModal(false);
    }
  };

  const editCustody = (item) => {
    setEditItem(item);
    setOpenModal(true);
  };

  const actionsColumns = [
    {
      id: 'edit',
      type: viewOnly ? 'view' : 'edit',
      action: editCustody,
      label: viewOnly ? 'View' : 'Edit',
    },
  ];

  return (
    <Box mb={5} mt={3}>
      <Button
        variant="contained"
        color="primary"
        disabled={viewOnly}
        onClick={() => setOpenModal(true)}
        className={classes.submit}
      >
        Add Custody
      </Button>
      <Box mt={3} mb={5}>
        <Grid container>
          {rows.length && (
            <Grid item xs={12}>
              <Box mt={5}>
                <Typography gutterBottom variant="h5">
                  Associated Custodians
                </Typography>
                <DataTable
                  rows={rows || []}
                  columns={custodyColumns}
                  actionsColumns={actionsColumns}
                />
              </Box>
            </Grid>
          )}
        </Grid>
        {openModal && (
          <FormModal
            open={openModal}
            handleClose={oncloseModal}
            title={
              !editItem
                ? 'Add Custody'
                : `${viewOnly ? 'View' : 'Edit'} Custody`
            }
            titleClass={classes.formTitle}
            maxWidth="md"
            openConfirmModal={openConfirmModal}
            setConfirmModal={setConfirmModal}
            handleConfirmModal={handleConfirmModal}
          >
            <AddCustodyForm
              setItemIds={setItemIds}
              itemIds={itemIds}
              setOpenModal={oncloseModal}
              rows={rows}
              viewOnly={viewOnly}
              editItem={editItem}
              {...props}
            />
          </FormModal>
        )}
      </Box>
      <Grid container spacing={3} className={classes.buttonContainer}>
        {viewOnly && (
          <Grid item xs={6} sm={2}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleCancel}
            >
              Done
            </Button>
          </Grid>
        )}
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleNext}
            className={classes.submit}
          >
            Save & Next: Sensors & Gateways
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.custodianReducer,
  ...state.shipmentReducer,
  ...state.authReducer,
});

export default connect(mapStateToProps)(CustodianInfo);
