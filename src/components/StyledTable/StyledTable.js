import React from 'react';
import {
  withStyles,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Box,
} from '@material-ui/core';

const StyledContainer = withStyles((theme) => ({
  root: {
    overflowX: 'auto',
    margin: theme.spacing(2, 0),
  },
}))(Box);

export function StyledTable({ columns, rows, sortFn }) {
  const header = columns.map((col, colIndex) => (
    <TableCell key={`tableCol${colIndex}:${col.prop}`}>{col.label}</TableCell>
  ));
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
          <TableRow>{header}</TableRow>
        </TableHead>
        <TableBody>{content}</TableBody>
      </Table>
    </StyledContainer>
  );
}
