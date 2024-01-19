import React, { useContext } from 'react';
import { Link, Typography } from '@mui/material';
import { AppContext } from '../../context/App.context';

const Copyright = () => {
  const { title } = useContext(AppContext);

  return (
    <Typography
      variant="body2"
      align="center"
      mt={8}
      mb={1}
    >
      {'Copyright © '}
      <Link
        color="primary"
        href="https://xparent.io/"
        target="_blank"
        sx={{
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        {title}
      </Link>
      {` ${new Date().getFullYear()}.`}
    </Typography>
  );
};

export default Copyright;
