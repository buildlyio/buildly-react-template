import React from 'react';
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Box,
} from '@mui/material';
import { withStyles } from '@mui/styles';

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.dark,
    },
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.background.dark,
    },
    '&:nth-of-type(odd):hover': {
      backgroundColor: theme.palette.secondary.contrastText,
    },
    '&:nth-of-type(even):hover': {
      backgroundColor: theme.palette.secondary.contrastText,
    },
  },
}))(TableRow);

const StyledTableHeadCell = withStyles((theme) => ({
  head: {
    textTransform: 'uppercase',
    fontSize: 12.5,
    fontWeight: '400',
    padding: theme.spacing(1, 2),
    color: theme.palette.common.grey,
    background: theme.palette.background.dark,
  },
}))(TableCell);

const StyledContainer = withStyles((theme) => ({
  root: {
    overflowX: 'auto',
  },
}))(Box);

export const PermissionsTable = ({ columns, rows, sortFn }) => {
  const header = columns.map((col, colIndex) => (
    <StyledTableHeadCell key={`tableCol${colIndex}:${col.prop}`}>
      {col.label}
    </StyledTableHeadCell>
  ));

  const sortedRows = sortFn ? rows.sort(sortFn) : rows;
  const content = sortedRows.map((row, rowIndex) => (
    <StyledTableRow key={`tableRow${rowIndex}`}>
      {columns.map((col, colIndex) => (
        <TableCell key={`tableCell${rowIndex}:${colIndex}`}>
          {col.template(row)}
        </TableCell>
      ))}
    </StyledTableRow>
  ));

  return (
    <StyledContainer>
      <Table>
        <TableHead>
          <StyledTableRow>
            {header}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {content}
        </TableBody>
      </Table>
    </StyledContainer>
  );
};
