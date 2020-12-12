import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import Box from '@material-ui/core/Box';

const StyledContainer = withStyles((theme) => ({
  root: {
    overflowX: "auto",
    margin: theme.spacing(2, 0)
  },
}))(Box);

export function StyledTable({columns, rows}) {
  const header = columns.map((col, colIndex) => <TableCell key={`tableCol${colIndex}:${col.prop}`}>{col.label}</TableCell>);
  const content = rows.map((row, rowIndex) => (
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
}