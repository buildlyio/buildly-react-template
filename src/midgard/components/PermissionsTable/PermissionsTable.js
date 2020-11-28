import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import Box from '@material-ui/core/Box';

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: "#4F4D4D",
    },
    "&:nth-of-type(even)": {
      backgroundColor: "#383636",
    },
    "&:nth-of-type(odd):hover": {
      backgroundColor: "#000"
    },
    "&:nth-of-type(even):hover": {
      backgroundColor: "#000"
    }
  },
}))(TableRow);

const StyledTableHeadCell = withStyles((theme) => ({
  head: {
    textTransform: "uppercase",
    fontSize: 12.5,
    fontWeight: "400",
    padding: theme.spacing(1, 2),
    color: "#7C7A7A",
    background: "#383636",
  },
}))(TableCell);

const StyledContainer = withStyles((theme) => ({
  root: {
    overflowX: "auto",
  },
}))(Box);

export function PermissionsTable({columns, rows}) {
  const header = columns.map((col, colIndex) => <StyledTableHeadCell key={`tableCol${colIndex}:${col.prop}`}>{col.label}</StyledTableHeadCell>);
  const content = rows.map((row, rowIndex) => (
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
}