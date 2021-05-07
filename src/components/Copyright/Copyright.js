import React, { useContext } from 'react';
import { Link, Typography } from '@material-ui/core';
import { AppContext } from '@context/App.context';

const Copyright = () => {
  const { title } = useContext(AppContext);

  return (
    <Typography
      variant="body2"
      color="textSecondary"
      align="center"
    >
      {'Copyright © '}
      <Link
        color="inherit"
        href="https://xparent.io/"
        target="_blank"
      >
        {title}
      </Link>
      {` ${new Date().getFullYear()}.`}
    </Typography>
  );
};

export default Copyright;
