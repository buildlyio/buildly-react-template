import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import {
  Grid,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import Loader from '../../../../components/Loader/Loader';
import FormModal from '../../../../components/Modal/FormModal';
import { getUser } from '../../../../context/User.context';
import { useInput } from '../../../../hooks/useInput';
import { isDesktop } from '../../../../utils/mediaQuery';
import { useEditCustodianMutation } from '../../../../react-query/mutations/custodians/editCustodianMutation';
import useAlert from '@hooks/useAlert';
import '../../AdminPanelStyles.css';

const EditMapping = ({ history, location }) => {
  const organization = getUser().organization.organization_uuid;
  const [openFormModal, setFormModal] = useState(true);
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [options, setOptions] = useState([]);

  const { displayAlert } = useAlert();

  const { orgData } = location.state || {};

  const pageType = location.state && location.state.type;
  const pageData = location.state && location.state.data;
  const buttonText = pageType === 'edit'
    ? 'Save'
    : 'Set Mapping';
  const formTitle = pageType === 'edit'
    ? 'Edit Mapping'
    : 'Set Mapping';

  const custodyOrg = useInput((
    pageData && pageData.custody_org_uuid
  ) || '');

  useEffect(() => {
    if (orgData && pageData) {
      const opts = _.map(orgData, (org) => {
        const suggest = _.lowerCase(org.name) === _.lowerCase(pageData.name);
        return {
          value: org.organization_uuid,
          name: org.name,
          order: suggest ? 1 : 0,
        };
      });
      const orderedOpts = _.orderBy(
        opts,
        ['order', 'name'],
        ['desc', 'asc'],
      );

      setOptions(orderedOpts);
    }
  }, [orgData, pageData]);

  const closeFormModal = () => {
    if (custodyOrg.hasChanged()) {
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

  const { mutate: editCustodianMutation, isLoading: isEditingCustodian } = useEditCustodianMutation(organization, history, location.state.from, displayAlert);

  /**
   * Submit The form and add/edit custodian type
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const editData = {
      ...pageData,
      custody_org_uuid: custodyOrg.value || null,
      edit_date: new Date(),
    };
    editCustodianMutation([editData, null]);
    setFormModal(false);
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
          {isEditingCustodian && (
            <Loader open={isEditingCustodian} />
          )}
          <form
            className="formContainer"
            noValidate
            onSubmit={handleSubmit}
          >
            <Grid container spacing={isDesktop() ? 2 : 0}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  disabled
                  id="name"
                  label="Custodian Name"
                  name="name"
                  value={(pageData && pageData.name) || ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  select
                  id="custodyOrg"
                  label="Custodian Organization"
                  name="custodyOrg"
                  autoComplete="custodyOrg"
                  {...custodyOrg.bind}
                >
                  <MenuItem value="">Select</MenuItem>
                  {options
                    && options.length > 0
                    && _.map(options, (option, index) => (
                      <MenuItem
                        key={`org-option-${index}`}
                        value={option.value}
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={6} sm={4}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className="submit"
                    disabled={isEditingCustodian}
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
                    className="submit"
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

export default EditMapping;
