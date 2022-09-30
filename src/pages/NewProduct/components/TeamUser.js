import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import {
  Grid,
  Typography,
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  TextField,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  Autocomplete,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import { PictureAsPdf as PictureAsPdfIcon } from '@mui/icons-material';
import { useInput } from '@hooks/useInput';
import { validators } from '@utils/validators';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { saveProductFormData, docIdentifier } from '@redux/product/actions/product.actions';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      width: '70%',
      margin: 'auto',
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    borderRadius: '18px',
  },
  formTitle: {
    fontWeight: 'bold',
    marginTop: '1em',
    textAlign: 'center',
  },
  buttonContainer: {
    margin: theme.spacing(8, 0),
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
  inputWithTooltip: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const StyledRadio = (props) => <Radio color="info" {...props} />;

// eslint-disable-next-line import/no-mutable-exports
export let checkIfTeamUserEdited;

const TeamUser = ({
  productFormData, handleNext, handleBack, dispatch, editData,
}) => {
  const classes = useStyles();
  // let fileChanged = false;
  const [filesUpload, setFilesUpload] = useState([]);

  const teamSize = useInput((editData
    && editData.product_info
    && editData.product_info.team_size)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.team_size)
    || '5 - 10',
  { required: true });

  const [roleCount, setRoleCount] = useState((editData
    && editData.product_info
    && editData.product_info.role_count)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.role_count)
    || [
      { role: 'CTO (Budget Approval?)', count: 0 },
      { role: 'COO (Budget Approval?)', count: 0 },
      { role: 'UI/UX', count: 0 },
      { role: 'Lead Developer', count: 0 },
      { role: 'Product Manager', count: 0 },
      { role: 'Product Manager (Budget Approval?)', count: 0 },
      { role: 'Others', count: 0 },
    ]);

  const existingFeatures = useInput((editData
    && editData.product_info
    && editData.product_info.existing_features)
  || (productFormData
      && productFormData.product_info
      && productFormData.product_info.existing_features)
    || '',
  { required: true });

  // const [existingLinks, setExistingLinks] = useState([]);

  const [formError, setFormError] = useState({});

  const onBackClick = (event) => {
    // if (checkIfProductInfoEdited() === true) {
    //   handleSubmit(event);
    // }
    handleBack();
  };

  const onNextClick = (event) => {
    // if (checkIfProductInfoEdited() === true) {
    //   handleSubmit(event);
    // }
    handleNext();
  };

  const submitDisabled = () => {
    let countNum = 0;
    _.forEach(roleCount, (roleCountObject) => {
      if (roleCountObject.count === 0) {
        countNum += 1;
      }
    });
    if (countNum === roleCount.length) {
      return true;
    }
    return false;
  };

  checkIfTeamUserEdited = () => teamSize.hasChanged();

  // const removeFile = (filename) => {
  //   setFiles(files.filter((file) => file.name !== filename));
  // };

  let uploadFile;
  const fileChange = (event) => {
    setFilesUpload(event.target.files);
  };

  /**
   * Submit The form and add/edit custodian
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    uploadFile = new FormData();
    for (const key of Object.keys(filesUpload)) {
      uploadFile.append('file', filesUpload[key]);
    }
    const formData = {
      ...productFormData,
      product_info: {
        ...productFormData.product_info,
        team_size: teamSize.value,
        role_count: roleCount,
      },
      edit_date: new Date(),
    };
    dispatch(saveProductFormData(formData));
    dispatch(docIdentifier(uploadFile));
    handleNext();
  };

  return (
    <div>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <Box mb={2} mt={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Typography variant="h6" gutterBottom component="div">
                What is the size of your current team and backgrounds/roles?
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  aria-label="current-team-size"
                  name="current-team-size-radio-group"
                  {...teamSize.bind}
                >
                  <FormControlLabel
                    value="1 - 5"
                    control={<StyledRadio />}
                    label="1 - 5"
                  />
                  <FormControlLabel
                    value="5 - 10"
                    control={<StyledRadio />}
                    label="5 - 10"
                  />
                  <FormControlLabel
                    value="10 - 20 or more"
                    control={<StyledRadio />}
                    label="10 - 20 or more"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Roles</TableCell>
                      <TableCell />
                      <TableCell>Count</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {_.map(roleCount, (row, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {row.role}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() => {
                              if (roleCount[index].count > 0) {
                                setRoleCount((prc) => {
                                  prc[index].count -= 1;
                                  return [...prc];
                                });
                              }
                            }}
                            size="large"
                          >
                            <RemoveIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell style={{ width: '30%' }}>
                          <TextField
                            onChange={(e) => {
                              setRoleCount((pvrc) => {
                                pvrc[index].count += parseInt(
                                  e.target.value,
                                  10,
                                );
                                return [...pvrc];
                              });
                            }}
                            value={row.count}
                            type="number"
                            variant="filled"
                          />
                        </TableCell>
                        <TableCell align="left">
                          <IconButton
                            onClick={() => {
                              setRoleCount((prvrc) => {
                                prvrc[index].count += 1;
                                return [...prvrc];
                              });
                            }}
                            size="large"
                          >
                            <AddIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom component="div">
                Do you have any existing requirements documents, mockups,
                designs etc.?
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {/* <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                // value={existingLinks}
                id="existingLinks"
                label="Existing File links"
                name="existingLinks"
                autoComplete="existingLinks"
                onKeyDown={(e) => linkify(e)}
                {...existingLinks.bind}
              /> */}
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                // multiple
                type="file"
                id="existingFeatures"
                label="existing features"
                name="existingFeatures"
                autoComplete="existingFeatures"
                inputProps={{ multiple: true }}
                InputLabelProps={{ shrink: true }}
                onChange={fileChange}
                // {...existingFeatures.bind}
              />
              {/* <List>
                {_.map(files, (file, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={(
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon onClick={(e) => removeFile(file.name)} />
                      </IconButton>
                  )}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={file.name}
                    />
                  </ListItem>
                ))}
              </List> */}
            </Grid>
          </Grid>
          <Grid container spacing={3} className={classes.buttonContainer}>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={onBackClick}
                // disabled={productFormData === null}
                className={classes.submit}
              >
                Back
              </Button>
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
                Save & Next
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
});

export default connect(mapStateToProps)(TeamUser);
