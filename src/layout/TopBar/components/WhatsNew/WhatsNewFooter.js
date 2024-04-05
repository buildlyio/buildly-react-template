import React from 'react';
import _ from 'lodash';
import { Button, Grid, Typography } from '@mui/material';
import '../../TopBarStyles.css';

export default function WhatsNewFooter({ buttonClick }) {
  return (
    <Grid container flexDirection="column" alignItems="center" justifyContent="center">
      <Grid item xs={8}>
        <Typography className="whatsNewDialogReferenceText">
          To reference this page again, click on the profile icon and then click on
          the "What's New?" section.
        </Typography>
      </Grid>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className="whatsNewDialogButton"
        onClick={buttonClick}
      >
        Return to Platform
      </Button>
    </Grid>
  );
}
