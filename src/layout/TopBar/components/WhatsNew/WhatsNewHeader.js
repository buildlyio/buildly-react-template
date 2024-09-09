/* eslint-disable no-undef */
import React from 'react';
import _ from 'lodash';
import { Grid, IconButton, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import '../../TopBarStyles.css';

const WhatsNewHeader = ({ closeIcon, closeOnClick }) => (
  <Grid container className="whatsNewTitleContainer">
    {closeIcon && (
      <Grid item xs={1}>
        <IconButton onClick={closeOnClick} className="whatsNewIcon">
          <CloseIcon fontSize="large" />
        </IconButton>
      </Grid>
    )}
    <Grid item xs={closeIcon ? 11 : 12}>
      <Typography className="whatsNewTitle">What's New?</Typography>
      <Typography className="whatsNewSubTitle">
        Version
        {' '}
        {VERSION}
        {' '}
        Release
      </Typography>
    </Grid>
  </Grid>
);

export default WhatsNewHeader;
