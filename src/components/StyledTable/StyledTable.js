import React from 'react';
import withStyles from '@mui/styles/withStyles';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import Box from '@mui/material/Box';

const StyledContainer = withStyles((theme) => ({
  root: {
    overflowX: 'auto',
    margin: theme.spacing(2, 0),
  },
}))(Box);

export const StyledTable = ({ columns, rows, sortFn }) => {
  const header = columns.map((col, colIndex) => <TableCell key={`tableCol${colIndex}:${col.prop}`}>{col.label}</TableCell>);
  const sortedRows = sortFn ? rows.sort(sortFn) : rows;
  const content = sortedRows.map((row, rowIndex) => (
    <TableRow key={`tableRow${rowIndex}`}>
      {columns.map((col, colIndex) => (
        <TableCell key={`tableCell${rowIndex}:${colIndex}`}>
          {col.template(row)}
        </TableCell>
      ))}
    </TableRow>
  ));

  return (
    <StyledContainer>
      <Table>
        <TableHead>
          <TableRow>
            {header}
          </TableRow>
        </TableHead>
        <TableBody>
          {content}
        </TableBody>
      </Table>
    </StyledContainer>
  );
};
