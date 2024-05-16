/* eslint-disable react/no-danger */
import React from 'react';
import _ from 'lodash';
import { useTheme } from '@mui/material';

const WhatsNewContent = ({ data }) => {
  const theme = useTheme();

  return (
    <>
      {!_.isEmpty(data) && !_.isEmpty(data[0]) ? (
        <div style={{ fontFamily: `${theme.typography.fontFamily} !important` }} dangerouslySetInnerHTML={{ __html: data }} />
      ) : null}
    </>
  );
};

export default WhatsNewContent;
