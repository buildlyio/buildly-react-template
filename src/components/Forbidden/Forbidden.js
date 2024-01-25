import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { routes } from '../../routes/routesConstants';
import './ForbiddenStyles.css';

const Forbidden = ({ history }) => (
  <Box mt={3} textAlign="center">
    <Card variant="outlined">
      <CardContent>
        <Typography className="forbiddenPageHeading" variant="h2">
          403
        </Typography>
        <Typography className="forbiddenPageHeading" variant="h5">
          Access Denied
          <p>You don't have permission to access this page</p>
        </Typography>
      </CardContent>
    </Card>
    <Button
      type="button"
      variant="contained"
      color="primary"
      onClick={() => history.push(routes.SHIPMENT)}
      className="forbiddenBackButton"
    >
      Back To Shipment Page
    </Button>
  </Box>
);

export default Forbidden;
