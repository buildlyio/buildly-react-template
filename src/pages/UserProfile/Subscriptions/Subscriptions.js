import React, { useContext, useState } from 'react';
import { UserContext } from '@context/User.context';
import Table from 'react-bootstrap/Table';
import {
  TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';

const Subscriptions = ({ dispatch }) => {
  // Initialize variables
  const user = useContext(UserContext);
  console.log('user : ', user);

  return (
    <>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Trial start date</TableCell>
              <TableCell>Trial end date</TableCell>
              <TableCell>Subscription start date</TableCell>
              <TableCell>Subscription end date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {user.subscriptions.map((row) => (
              <TableRow
                key={row.stripe_card_id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{row.stripe_product}</TableCell>
                <TableCell>{row.trial_start_date}</TableCell>
                <TableCell>{row.trial_end_date}</TableCell>
                <TableCell>{row.subscription_start_date}</TableCell>
                <TableCell>{row.subscription_end_date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
export default Subscriptions;
