/* eslint-disable react/no-danger */
import React from 'react';
import _ from 'lodash';

export default function WhatsNewContent({ data }) {
  return (
    <>
      {!_.isEmpty(data) && !_.isEmpty(data[0]) ? (
        <div dangerouslySetInnerHTML={{ __html: data[0].version_notes }} />
      ) : null}
    </>
  );
}
