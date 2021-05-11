/* eslint-disable no-param-reassign */
import React, { useState } from 'react';
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
    marginBottom: theme.spacing(2),
  },
  pdfIcon: {
    marginRight: theme.spacing(1),
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

  const [file, setFile] = useState(null);
  const [text, setText] = useState(null);
  const [key, setKey] = useState('');
  const [loadingText, setLoadingText] = useState(false);
  const [options, setOptions] = useState([]);
  const [keyValue, setKeyValue] = useState('');

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
    if (key) {
      const re = new RegExp(`(.{0,20})${key}(.{0,20})`, 'gi');
      let m;
      const values = [];
      // eslint-disable-next-line no-cond-assign
      while ((m = re.exec(text))) {
        // let line = (m[1] ? '...' : '') + m[0] + (m[2] ? '...' : '');
        values.push(m[2]);
      }
      let opts = [];
      values.forEach((value) => {
        const segments = value[0] === ':' ? value.split(': ') : value.split(' ');
        const segment = segments[1]
          ? segments[1].split(' ')[0]
          : segments[0].split(' ')[0];

        if (segment.match('^[A-Za-z0-9]+$')) {
          opts = [...opts, segment];
        }
      });
      setOptions(opts);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const uploadFile = new FormData();
    uploadFile.append('file', file, file.name);
    const identifier = key ? JSON.stringify({ [key]: keyValue }) : null;

    dispatch(
      pdfIdentifier(
        uploadFile,
        file.name,
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
    setKey('');
    fileInput.value = '';
    fileInput.files = null;
  };
  let fileChanged = false;
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

  checkIfShipmentKeyEdited = () => fileChanged || Boolean(key || keyValue);

  const onNextClick = (event) => {
    if (checkIfShipmentKeyEdited()) {
      // setConfirmModalFor('next');
      // setConfirmModal(true);
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

  return (
    <Container className={classes.root} maxWidth="sm">
      {loadingText && (
        <Loader open={loadingText} label="Extracting text from selected PDF" />
      )}
      <form noValidate onSubmit={handleSubmit}>
        <Card variant="outlined">
          <CardContent>
            <TextField
              variant="outlined"
              fullWidth
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
                  && shipmentFormData.unique_identifier
                  && shipmentFormData.uploaded_pdf.length > 0
                  && shipmentFormData.uploaded_pdf_link.length > 0 ? (
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
                                {index
                                  < shipmentFormData.uploaded_pdf.length - 1 && (
                                    <span>{', '}</span>
                                )}
                              </React.Fragment>
                            ),
                          )}
                        </span>
                      </span>
                      <span>
                        <em>Unique Identifier</em>
                      </span>
                      <br />
                      <span>
                        {`${_.keys(
                          JSON.parse(shipmentFormData.unique_identifier),
                        )[0]
                        }: ${_.values(
                          JSON.parse(shipmentFormData.unique_identifier),
                        )[0]
                        }`}
                      </span>
                    </>
                  ) : (
                    ''
                  )
              }
            />
            {file && (
              <TextField
                className={classes.textfield}
                variant="outlined"
                fullWidth
                id="file-search"
                name="file-search"
                label="Which should be the key?"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                onBlur={searchOnBlur}
              />
            )}
            {file && key && (
              <Autocomplete
                freeSolo
                className={classes.autoComplete}
                id="unique-identifier"
                options={options}
                value={keyValue}
                onChange={(event, newValue) => setKeyValue(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    required
                    fullWidth
                    label="What should be the key value?"
                    onChange={(e) => setKeyValue(e.target.value)}
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
                  disabled={Boolean(loading || !file || (key && !keyValue))}
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
