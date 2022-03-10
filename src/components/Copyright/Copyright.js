import React, { useContext } from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { AppContext } from '@context/App.context';

function Copyright() {
  const { title } = useContext(AppContext);
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://example.com/" target="_blank">
        {title}
      </Link>
      {' '}
      {new Date().getFullYear()}
      .
    </Typography>
  );
}

export default Copyright;
