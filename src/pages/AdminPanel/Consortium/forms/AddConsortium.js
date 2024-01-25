import React, { useState } from 'react';
import _ from 'lodash';
import {
  Grid,
  Button,
  TextField,
  Chip,
} from '@mui/material';
import { Autocomplete } from '@mui/material';
import Loader from '../../../../components/Loader/Loader';
import FormModal from '../../../../components/Modal/FormModal';
import { useInput } from '../../../../hooks/useInput';
import { validators } from '../../../../utils/validators';
import { isDesktop } from '../../../../utils/mediaQuery';
import { useAddConsortiumMutation } from '../../../../react-query/mutations/consortium/addConsortiumMutation';
import { useEditConsortiumMutation } from '../../../../react-query/mutations/consortium/editConsortiumMutation';
import useAlert from '@hooks/useAlert';
import '../../AdminPanelStyles.css';

const AddConsortium = ({ history, location }) => {
  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);

  const { displayAlert } = useAlert();

  const { orgData } = location.state || {};

  const editPage = location.state && location.state.type === 'edit';
  const editData = (
    location.state
    && location.state.type === 'edit'
    && location.state.data
  ) || {};

  const name = useInput((editData && editData.name) || '', {
    required: true,
  });
  const [orgs, setOrgs] = useState((
    editData && editData.organization_uuids
  ) || []);
  const [formError, setFormError] = useState({});

  const buttonText = editPage ? 'Save' : 'Add Consortium';
  const formTitle = editPage ? 'Edit Consortium' : 'Add Consortium';

  const closeFormModal = () => {
    if (name.hasChanged()) {
      setConfirmModal(true);
    } else {
      setFormModal(false);
      if (location && location.state) {
        history.push(location.state.from);
      }
    }
  };

  const discardFormData = () => {
    setConfirmModal(false);
    setFormModal(false);
    if (location && location.state) {
      history.push(location.state.from);
    }
  };

  const { mutate: addConsortiumMutation, isLoading: isAddingConsortium } = useAddConsortiumMutation(history, location.state.from, displayAlert);

  const { mutate: editConsortiumMutation, isLoading: isEditingConsortium } = useEditConsortiumMutation(history, location.state.from, displayAlert);

  /**
   * Submit The form and add/edit custodian type
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const currentDateTime = new Date();
    let data = {
      ...editData,
      name: name.value,
      organization_uuids: orgs,
      edit_date: currentDateTime,
    };
    if (editPage) {
      editConsortiumMutation(data);
    } else {
      data = {
        ...data,
        create_date: currentDateTime,
      };
      addConsortiumMutation(data);
    }
  };

  /**
   * Handle input field blur event
   * @param {Event} e Event
   * @param {String} validation validation type if any
   * @param {Object} input input field
   */

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
    if (!name.value) {
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

  const onInputChange = (value) => {
    switch (true) {
      case (value.length > orgs.length):
        setOrgs([...orgs, _.last(value).organization_uuid]);
        break;
      case (value.length < orgs.length):
        setOrgs(value);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      {openFormModal && (
        <FormModal
          open={openFormModal}
          handleClose={closeFormModal}
          title={formTitle}
          openConfirmModal={openConfirmModal}
          setConfirmModal={setConfirmModal}
          handleConfirmModal={discardFormData}
        >
          {(isAddingConsortium || isEditingConsortium) && (
            <Loader open={isAddingConsortium || isEditingConsortium} />
          )}
          <form
            className="adminPanelFormContainer"
            noValidate
            onSubmit={handleSubmit}
          >
            <Grid container spacing={isDesktop() ? 2 : 0}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                  id="name"
                  label="Consortium Name"
                  name="name"
                  autoComplete="name"
                  error={formError.name && formError.name.error}
                  helperText={
                    formError.name ? formError.name.message : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', name)}
                  {...name.bind}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  fullWidth
                  multiple
                  filterSelectedOptions
                  id="orgs"
                  options={orgData}
                  getOptionLabel={(option) => (
                    option && option.name
                  )}
                  isOptionEqualToValue={(option, value) => (
                    !value || (value && (option.organization_uuid === value))
                  )}
                  value={orgs}
                  onChange={(e, newValue) => onInputChange(newValue)}
                  renderTags={(value, getTagProps) => (
                    _.map(value, (option, index) => (
                      <Chip
                        variant="default"
                        label={
                          !_.isEmpty(orgData) && _.find(orgData, { organization_uuid: option })
                            ? _.find(orgData, { organization_uuid: option }).name
                            : ''
                        }
                        {...getTagProps({ index })}
                      />
                    ))
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Custodian Organizations"
                      placeholder="Attach"
                      margin="normal"
                    />
                  )}
                />
              </Grid>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={6} sm={4}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className="adminPanelSubmit"
                    disabled={isAddingConsortium || isEditingConsortium || submitDisabled()}
                  >
                    {buttonText}
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Button
                    type="button"
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={discardFormData}
                    className="adminPanelSubmit"
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </FormModal>
      )}
    </div>
  );
};

export default AddConsortium;
