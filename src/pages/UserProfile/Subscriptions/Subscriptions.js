import React, { useContext, useState } from 'react';
import { UserContext } from '@context/User.context';
import {
  Button,
  Grid,
} from '@mui/material';
import MUIDataTable from 'mui-datatables';

const Subscriptions = ({ dispatch }) => {
  // Initialize variables
  const user = useContext(UserContext);
  const maxDate = new Date();
  maxDate.setHours(0, 0, 0, 0);
  maxDate.setDate(maxDate.getDate() + 1);

  const columns = [
    { name: 'subscription_uuid', options: { display: false, filter: false, sort: false } },
    { name: 'stripe_card_id', options: { display: false, filter: false, sort: false } },
    { name: 'stripe_product_info.name', label: 'Product', options: { filter: true, sort: true } },
    { name: 'stripe_product', label: 'Product', options: { display: false, filter: true, sort: true } },
    { name: 'trial_start_date', label: 'Trial start date', options: { filter: true, sort: true } },
    { name: 'trial_end_date', label: 'Trial end date', options: { filter: true, sort: true } },
    { name: 'subscription_start_date', label: 'Subscription start date', options: { filter: true, sort: true } },
    { name: 'subscription_end_date', label: 'Subscription end date', options: { filter: true, sort: true } },
    {
      name: '',
      label: '',
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex) => (
          <>
            { (maxDate > new Date(user.subscriptions[dataIndex].subscription_end_date)) && (
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              size="small"
            >
              Renew
            </Button>
            )}
          </>
        ),
      },
    },
  ];

  const options = {
    responsive: 'standard',
    selectableRows: 'none',
    download: false,
    search: false,
    print: false,
    filter: false,
    viewColumns: false,
    enableNestedDataAccess: '.',
  };

  return (
    <>
      <Grid item xs={12}>
        <MUIDataTable
          data={user.subscriptions}
          columns={columns}
          options={options}
        />
      </Grid>
    </>
  );
};
export default Subscriptions;
