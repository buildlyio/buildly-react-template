import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {
  Grid,
  Button,
  TextField,
  MenuItem,
  Typography,
  Tooltip,
} from '@mui/material';
import { CloudSync as CloudSyncIcon } from '@mui/icons-material';
import { useInput } from '@hooks/useInput';
import { GATEWAY_ACTIONS } from '@utils/mock';
import FormModal from '@components/Modal/FormModal';
import Loader from '@components/Loader/Loader';
import { validators } from '@utils/validators';
import { isDesktop } from '@utils/mediaQuery';
import { GATEWAY_STATUS, getCustodianFormattedRow } from '@utils/constants';

const GatewayActions = ({
  selectedRows,
  custodianData,
  contactInfo,
  editGatewayMutation,
  isEditingGateway,
}) => {
  const gateway_action = useInput('');
  const change_status = useInput('', { required: true });

  const [assignShipper, setAssignShipper] = useState('');
  const [custodianList, setCustodianList] = useState([]);
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [showGatewayAction, setShowGatewayAction] = useState(false);
  const [formError, setFormError] = useState({});

  useEffect(() => {
    if (!_.isEmpty(custodianData) && contactInfo) {
      setCustodianList(getCustodianFormattedRow(
        custodianData,
        contactInfo,
      ));
    }
  }, [custodianData, contactInfo]);

  const closeFormModal = () => {
    const dataHasChanged = (
      change_status.hasChanged()
      || !_.isEmpty(assignShipper)
    );
    if (dataHasChanged) {
      setConfirmModal(true);
    } else {
      setShowGatewayAction(false);
    }
  };

  const discardFormData = () => {
    gateway_action.reset();
    change_status.reset();
    setAssignShipper('');
    setFormError({});
    setConfirmModal(false);
    setShowGatewayAction(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (_.isEqual(gateway_action.value, 'Change Status')) {
      const updatedRows = selectedRows.map((row) => ({
        ...row,
        gateway_status: change_status.value,
      }));
      editGatewayMutation(updatedRows);
    } else if (_.isEqual(gateway_action.value, 'Assign Shipper')) {
      const updatedRows = selectedRows.map((row) => ({
        ...row,
        custodian_uuid: assignShipper,
      }));
      editGatewayMutation(updatedRows);
    } else if (_.isEqual(gateway_action.value, 'Remove Tracker')) {
      const updatedRows = selectedRows.map((row) => ({
        ...row,
        organization_uuid: null,
        custodian_uuid: null,
        is_new: false,
      }));
      editGatewayMutation(updatedRows);
    }
  };

  useEffect(() => {
    if (!isEditingGateway) {
      discardFormData();
    }
  }, [isEditingGateway]);

  const handleBlur = (e, validation, input, parentId) => {
    const validateObj = validators(validation, input);
    const prevState = { ...formError };
    if (validateObj && validateObj.error) {
      setFormError({
        ...prevState,
        [e.target.id || parentId]: validateObj,
      });
    } else {
      setFormError({
        ...prevState,
        [e.target.id || parentId]: {
          error: false,
          message: '',
        },
      });
    }
  };

  const submitDisabled = () => {
    const errorKeys = Object.keys(formError);
    if (!_.isEmpty(selectedRows)) {
      if (_.isEqual(gateway_action.value, 'Change Status')) {
        if (!change_status.value) {
          return true;
        }
      }
      if (_.isEqual(gateway_action.value, 'Assign Shipper')) {
        if (_.isEmpty(assignShipper)) {
          return true;
        }
      }
    } else {
      return true;
    }
    let errorExists = false;
    _.forEach(errorKeys, (key) => {
      if (formError[key].error) {
        errorExists = true;
      }
    });
    return errorExists;
  };

  const onInputChange = (e) => {
    const { value } = e.target;
    if (value) {
      setAssignShipper(value);
      if (custodianList.length > 0) {
        let selectedCustodian = '';
        _.forEach(custodianList, (list) => {
          if (list.uuid === value) {
            selectedCustodian = list;
          }
        });
      }
    } else {
      setAssignShipper(value);
    }
  };

  return (
    <>
      <Grid item xs={12} sm={6} className="gatewayHeaderActionContainer">
        <TextField
          className={_.isEmpty(gateway_action.value) ? 'gatewayActions' : 'gatewayActionsValue'}
          variant="outlined"
          id="gateway_actions"
          select
          label="Actions"
          {...gateway_action.bind}
        >
          <MenuItem value="">Select</MenuItem>
          {_.map(GATEWAY_ACTIONS, (item, index) => {
            if (_.isEqual(_.size(selectedRows), 1) && !_.isEqual(item.value, 'Remove Tracker')) {
              return null;
            }
            return (
              <MenuItem
                key={`gatewayAction${index}:${item.id}`}
                value={item.value}
              >
                {item.label}
              </MenuItem>
            );
          })}
        </TextField>
        <Button
          type="button"
          variant="contained"
          color="primary"
          style={{ marginLeft: '20px' }}
          disabled={!!_.isEmpty(gateway_action.value)}
          onClick={() => setShowGatewayAction(true)}
        >
          OK
        </Button>
      </Grid>
      <FormModal
        open={showGatewayAction}
        handleClose={closeFormModal}
        title="Tracker Action"
        openConfirmModal={openConfirmModal}
        setConfirmModal={setConfirmModal}
        handleConfirmModal={discardFormData}
      >
        {isEditingGateway && <Loader open={isEditingGateway} />}
        <form className="gatewayFormContainer" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={isDesktop() ? 2 : 0}>
            <Grid className="gatewayInputWithTooltip" item xs={12}>
              <TextField
                className="notranslate"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="selectedTrackers"
                label={<span className="translate">Selected Trackers</span>}
                disabled
                multiline
                value={selectedRows.map((tracker) => tracker.name).join('\n')}
                error={formError.selectedTrackers && formError.selectedTrackers.error}
                helperText={formError.selectedTrackers ? formError.selectedTrackers.message : ''}
                onBlur={(e) => handleBlur(e, 'required', { value: selectedRows, required: true })}
              />
            </Grid>
            {_.isEqual(gateway_action.value, 'Change Status')
              && (
                <Grid className="gatewayInputWithTooltip" item xs={12} md={6} sm={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                    id="changeStatus"
                    select
                    label="Change Status"
                    error={formError.changeStatus && formError.changeStatus.error}
                    helperText={formError.changeStatus ? formError.changeStatus.message : ''}
                    onBlur={(e) => handleBlur(e, 'required', change_status, 'changeStatus')}
                    {...change_status.bind}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {GATEWAY_STATUS
                      && _.map(
                        GATEWAY_STATUS,
                        (item, index) => (
                          <MenuItem
                            key={`gatewayStatus${index}:${item.value}`}
                            value={item.value}
                          >
                            {item.name}
                          </MenuItem>
                        ),
                      )}
                  </TextField>
                </Grid>
              )}
            {_.isEqual(gateway_action.value, 'Assign Shipper')
              && (
                <Grid className="gatewayInputWithTooltip" item xs={12} md={6} sm={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                    id="assignShipper"
                    select
                    label="Assign Shipper"
                    error={formError.assignShipper && formError.assignShipper.error}
                    helperText={formError.assignShipper ? formError.assignShipper.message : ''}
                    onBlur={(e) => handleBlur(e, 'required', assignShipper, 'assignShipper')}
                    value={assignShipper}
                    onChange={onInputChange}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {custodianList
                      && _.map(
                        _.orderBy(
                          _.filter(custodianList, ['custodian_type', `${window.env.CUSTODIAN_URL}custodian_type/1/`]),
                          ['name'],
                          ['asc'],
                        ),
                        (item, index) => (
                          <MenuItem
                            key={`custodian${index}:${item.id}`}
                            value={item.custodian_uuid}
                          >
                            {item.name}
                          </MenuItem>
                        ),
                      )}
                  </TextField>
                </Grid>
              )}
            {_.isEqual(gateway_action.value, 'Remove Tracker')
              && <Typography ml={2}>Are you sure you want to remove these above tracker(s) from the organization?</Typography>}
          </Grid>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="gatewaySubmit"
                disabled={isEditingGateway || submitDisabled()}
              >
                Save
              </Button>
            </Grid>
            <Grid item xs={12} sm={4} className="gatewaySubmit2">
              <Button
                type="button"
                fullWidth
                variant="outlined"
                color="primary"
                onClick={discardFormData}
                className="gatewaySubmit"
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormModal>
    </>
  );
};

export default GatewayActions;
