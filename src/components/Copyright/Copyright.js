import React, { useContext } from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { AppContext } from '@context/App.context';

function Copyright() {
  const { title } = useContext(AppContext);
  return (
    <Typography 
      variant="body2" 
      color="textSecondary" 
      align="center"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        borderTop: '1px solid rgba(0, 0, 0, 0.1)'
      }}
    >
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
