import React, { useState } from 'react';
import _ from 'lodash';
import {
  Grid,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import Loader from '../../../../components/Loader/Loader';
import { useInput } from '../../../../hooks/useInput';
import { validators } from '../../../../utils/validators';
import { isDesktop2 } from '../../../../utils/mediaQuery';
import { useAddFromFileMutation } from '../../../../react-query/mutations/importExport/addFromFileMutation';
import useAlert from '@hooks/useAlert';
import '../../AdminPanelStyles.css';

const AddFromFile = () => {
  const uploadType = useInput('', { required: true });
  const [uploadFile, setUploadFile] = useState(null);
  const [formError, setFormError] = useState({});

  const { displayAlert } = useAlert();

  const { mutate: addFromFileMutation, isLoading: isAddingFromFile } = useAddFromFileMutation(uploadType.value, displayAlert);

  /**
   * Submit The form and add/edit custodian type
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', uploadFile, uploadFile.name);
    formData.append('model', uploadType.value);
    addFromFileMutation(formData);
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
    if (!uploadType.value || !uploadFile) {
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

  return (
    <div>
      {isAddingFromFile && <Loader open={isAddingFromFile} />}
      <form
        className="adminPanelFormRoot"
        encType="multipart/form-data"
        noValidate
        onSubmit={handleSubmit}
      >
        <Grid container spacing={isDesktop2() ? 2 : 0}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              required
              id="uploadType"
              label="Upload Type"
              select
              error={
                formError.uploadType
                && formError.uploadType.error
              }
              helperText={
                formError.uploadType
                  ? formError.uploadType.message
                  : ''
              }
              onBlur={(e) => handleBlur(e, 'required', uploadType)}
              {...uploadType.bind}
            >
              <MenuItem value="">--------</MenuItem>
              <MenuItem value="item">Items</MenuItem>
              <MenuItem value="product">Products</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              required
              id="uploadFile"
              label="Upload File"
              type="file"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setUploadFile(e.target.files[0])}
            />
          </Grid>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={7} sm={6} md={4}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="adminPanelSubmit"
                disabled={isAddingFromFile || submitDisabled()}
              >
                Upload
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddFromFile;
