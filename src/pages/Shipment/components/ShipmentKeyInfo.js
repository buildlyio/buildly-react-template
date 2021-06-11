/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { createWorker } from 'tesseract.js';
import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  makeStyles,
  TextField,
  CircularProgress,
  Link,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { PictureAsPdf as PictureAsPdfIcon } from '@material-ui/icons';
import Loader from '@components/Loader/Loader';
import { pdfIdentifier } from '@redux/shipment/actions/shipment.actions';
import { routes } from '@routes/routesConstants';
import PdfViewer from './PDFViewer';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  textfield: {
    marginBottom: theme.spacing(3),
  },
  preview: {
    width: theme.spacing(69),
  },
  buttonContainer: {
    margin: theme.spacing(4, 0),
    textAlign: 'center',
    justifyContent: 'center',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  loadingWrapper: {
    position: 'relative',
  },
  submit: {
    borderRadius: '18px',
    fontSize: 11,
  },
  autoComplete: {
    width: '100%',
  },
  caption: {
    display: 'flex',
    alignItems: 'center',
  },
  pdfIcon: {
    marginRight: theme.spacing(1),
  },
  identifier: {
    marginTop: theme.spacing(1),
  },
}));

// eslint-disable-next-line import/no-mutable-exports
export let checkIfShipmentKeyEdited;

const ShipmentKeyInfo = ({
  dispatch,
  shipmentFormData,
  loading,
  viewOnly,
  handleNext,
  handleCancel,
  history,
  setConfirmModal,
  setConfirmModalFor,
}) => {
  const classes = useStyles();
  const worker = createWorker({
    // eslint-disable-next-line no-console
    logger: (m) => console.log(m),
  });
  let fileChanged = false;

  const [file, setFile] = useState(null);
  const [text, setText] = useState(null);
  const [keys, setKeys] = useState([]);
  const [loadingText, setLoadingText] = useState(false);
  const [options, setOptions] = useState(['PR474946444', '1', '7194']);
  const [keyValues, setKeyValues] = useState([]);
  const [showIdentifier, setShowIdentifier] = useState('');

  useEffect(() => {
    if (
      shipmentFormData
      && shipmentFormData.unique_identifier
    ) {
      const identifier = JSON.parse(shipmentFormData.unique_identifier);
      const KEYS = _.keys(identifier);
      const VALUES = _.values(identifier);
      let showIdfr = '';

      _.forEach(KEYS, (key, index) => {
        showIdfr = showIdfr
          ? `${showIdfr}, ${key}: ${VALUES[index]}`
          : `${key}: ${VALUES[index]}`;
      });
      setShowIdentifier(showIdfr);
    }
  }, [shipmentFormData]);

  const getPdfText = async (imageUrl) => {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data } = await worker.recognize(imageUrl);
    setText(data.text);
    setLoadingText(false);
    await worker.terminate();
  };

  const searchOnBlur = () => {
    if (file && keys.length > 0) {
      let values = [];

      _.forEach(keys, (key) => {
        const re = new RegExp(`(.{0,20})${key}(.{0,20})`, 'gi');
        let m;
        // eslint-disable-next-line no-cond-assign
        while ((m = re.exec(text))) {
          values = [...values, m[2]];
        }
      });

      let opts = [];
      _.forEach(values, (value) => {
        const segments = value[0] === ':' ? value.split(': ') : value.split(' ');
        const segment = segments[1]
          ? segments[1].split(' ')[0]
          : segments[0].split(' ')[0];

        if (segment.match('^[A-Za-z0-9]+$')) {
          opts = [...opts, segment];
        }
      });
      setOptions(_.uniq(opts));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let uploadFile = null;
    let identifier = shipmentFormData
    && shipmentFormData.unique_identifier
      ? JSON.parse(shipmentFormData.unique_identifier)
      : null;

    if (file) {
      uploadFile = new FormData();
      uploadFile.append('file', file, file.name);
    }

    if (keys.length > 0 && keyValues.length > 0) {
      _.forEach(keys, (key, index) => {
        identifier = { ...identifier, [key]: keyValues[index] };
      });
      identifier = JSON.stringify(identifier);
    }

    dispatch(
      pdfIdentifier(
        uploadFile,
        file ? file.name : null,
        identifier,
        shipmentFormData,
        history,
        `${routes.SHIPMENT}/edit/:${shipmentFormData.id}`,
        shipmentFormData.organization_uuid,
      ),
    );

    const fileInput = document.getElementById('key-file');
    setFile(null);
    setText(null);
    setKeys([]);
    setKeyValues([]);
    setOptions([]);
    fileInput.value = '';
    fileInput.files = null;
  };

  const fileChange = (event) => {
    const maxAllowedSize = 2 * 1024 * 1024;
    if (event.target.files[0].type === 'application/pdf') {
      if (event.target.files[0].size < maxAllowedSize) {
        setFile(event.target.files[0]);
        setLoadingText(true);
        fileChanged = true;
      } else {
        event.target.files = null;
        event.target.value = '';
        // eslint-disable-next-line no-alert
        alert('File size is more that 2MB. Please upload another file.');
      }
    } else {
      event.target.files = null;
      event.target.value = '';
      // eslint-disable-next-line no-alert
      alert('Only PDF files are allowed for upload.');
    }
  };

  checkIfShipmentKeyEdited = () => (
    fileChanged
    || file !== null
    || keys.length > 0
    || keyValues.length > 0
  );

  const onNextClick = (event) => {
    if (checkIfShipmentKeyEdited()) {
      handleSubmit(event);
    }
    handleNext();
  };

  const onCancelClick = () => {
    if (checkIfShipmentKeyEdited()) {
      setConfirmModalFor('close');
      setConfirmModal(true);
    } else {
      handleCancel();
    }
  };

  const submitDisabled = () => {
    if (
      (keys && !keyValues)
      && (keys.length !== keyValues.length)
    ) {
      return true;
    }
    return false;
  };

  return (
    <Container className={classes.root} maxWidth="sm">
      {loadingText && (
      <Loader
        open={loadingText}
        label="Extracting text from selected PDF"
      />
      )}
      <form noValidate onSubmit={handleSubmit}>
        <Card variant="outlined">
          <CardContent>
            <TextField
              variant="outlined"
              fullWidth
              disabled={viewOnly}
              type="file"
              id="key-file"
              name="key-file"
              label="Upload file for key"
              className={classes.textfield}
              InputLabelProps={{ shrink: true }}
              onChange={fileChange}
              helperText={
                shipmentFormData
                && shipmentFormData.uploaded_pdf
                && shipmentFormData.uploaded_pdf_link
                && shipmentFormData.uploaded_pdf.length > 0
                && shipmentFormData.uploaded_pdf_link.length > 0
                  ? (
                    <>
                      <span className={classes.caption}>
                        <PictureAsPdfIcon
                          className={classes.pdfIcon}
                          fontSize="large"
                        />
                        <span>
                          {'PDF(s) already uploaded for this shipment '}
                          {_.map(
                            shipmentFormData.uploaded_pdf,
                            (pdfName, index) => (
                              <React.Fragment key={index}>
                                <Link
                                  color="primary"
                                  href={shipmentFormData.uploaded_pdf_link[index]}
                                  target="_blank"
                                >
                                  {pdfName}
                                </Link>
                                {index < shipmentFormData.uploaded_pdf.length - 1 && (
                                  <span>{', '}</span>
                                )}
                              </React.Fragment>
                            ),
                          )}
                        </span>
                      </span>
                    </>
                  ) : (
                    ''
                  )
              }
            />
            <Autocomplete
              freeSolo
              multiple
              className={classes.autoComplete}
              id="file-search"
              options={[]}
              value={keys}
              onChange={(event, newValue) => setKeys(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className={classes.textfield}
                  variant="outlined"
                  fullWidth
                  label="Which should be the key?"
                  onBlur={searchOnBlur}
                  helperText={
                    shipmentFormData
                    && shipmentFormData.unique_identifier
                      ? (
                        <span className={classes.identifier}>
                          <span>
                            Multiple keys allowed
                          </span>
                          <br />
                          <em>Unique Identifier(s)  --  </em>
                          {showIdentifier}
                        </span>
                      ) : (
                        'Multiple keys allowed'
                      )
                  }
                />
              )}
            />
            {keys.length > 0 && (
            <Autocomplete
              freeSolo
              multiple
              className={classes.autoComplete}
              id="unique-identifier"
              options={options}
              value={keyValues}
              onChange={(event, newValue, reason) => {
                if (
                  reason === 'remove-option'
                  && _.lowerCase(event.target.tagName) === 'li'
                ) {
                  setKeyValues([
                    ...keyValues,
                    options[event.target.value],
                  ]);
                } else {
                  setKeyValues(newValue);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  required
                  fullWidth
                  label="What should be the key value?"
                  error={
                    keyValues.length > 0
                    && keys.length !== keyValues.length
                  }
                  helperText={
                    keyValues.length > 0
                    && keys.length !== keyValues.length
                      ? 'Number of keys and values mismatch'
                      : 'Multiple values allowed'
                  }
                />
              )}
            />
            )}
          </CardContent>
        </Card>
        <Grid className={classes.buttonContainer} container spacing={3}>
          <Grid item xs={6} sm={2}>
            {viewOnly ? (
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={onCancelClick}
              >
                Done
              </Button>
            ) : (
              <div className={classes.loadingWrapper}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={loading || submitDisabled()}
                >
                  Save
                </Button>
                {loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
                )}
              </div>
            )}
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={onNextClick}
              disabled={submitDisabled()}
              className={classes.submit}
            >
              Save & Next: Items
            </Button>
          </Grid>
        </Grid>
      </form>
      {file && (
        <PdfViewer
          canvasClass={classes.preview}
          url={URL.createObjectURL(file)}
          getPdfText={getPdfText}
        />
      )}
    </Container>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.shipmentReducer,
});

export default connect(mapStateToProps)(ShipmentKeyInfo);
