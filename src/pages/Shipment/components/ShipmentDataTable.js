import React, { useContext, useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import _ from 'lodash';
import {
  makeStyles,
  Checkbox,
  Radio,
  IconButton,
} from '@material-ui/core';
import {
  Edit as EditIcon,
  ListAlt as ViewIcon,
  Delete as DeleteIcon,
  FileCopy as FileCopyIcon,
} from '@material-ui/icons';
import { UserContext } from '@context/User.context';
import { checkForGlobalAdmin } from '@utils/utilMethods';
import { getShipmentDataTableColumns } from '../ShipmentConstants';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiChip-root': {
      display: 'none',
    },
  },
  centerHeader: {
    '& div': {
      textAlign: 'center',
    },
  },
  leftHeader: {
    '& span': {
      textAlign: 'left',
    },
  },
}));

const CustomCheckbox = (props) => {
  const newProps = { ...props };
  // eslint-disable-next-line react/destructuring-assignment
  const desc = props['data-description'];

  newProps.color = desc === 'row-select'
    ? 'secondary'
    : 'primary';

  return (
    desc === 'row-select'
      ? <Radio {...newProps} />
      : <Checkbox {...newProps} />
  );
};

const ShipmentDataTable = ({
  tileView,
  rows,
  editAction,
  deleteAction,
  setSelectedShipment,
  timezone,
  copyAction,
  rowsType,
  consortiumData,
}) => {
  const classes = useStyles();
  const [selected, setSelected] = useState(0);
  const [columns, setColumns] = useState([]);
  const user = useContext(UserContext);
  const isAdmin = checkForGlobalAdmin(user);

  const options = {
    filter: true,
    filterType: 'multiselect',
    responsive: 'standard',
    tableBodyHeight: tileView ? '435px' : '500px',
    tableBodyMaxHeight: '',
    selectableRows: 'single',
    selectToolbarPlacement: 'none',
    rowsPerPageOptions: [5, 10, 15],
    downloadOptions: {
      filename: 'ShipmentData.csv',
      separator: ',',
    },
    rowsSelected: [selected],
    onRowSelectionChange: (rowsSelected) => {
      const index = rowsSelected[0].dataIndex;
      setSelected(index);
      setSelectedShipment(rows[index]);
    },
    textLabels: {
      body: {
        noMatch: 'No data to display',
      },
    },
  };

  useEffect(() => {
    const cols = [
      {
        name: 'Copy',
        options: {
          filter: false,
          sort: false,
          empty: true,
          setCellHeaderProps: () => ({
            className: classes.centerHeader,
          }),
          customBodyRenderLite: (dataIndex) => (
            <IconButton
              onClick={() => copyAction(rows[dataIndex])}
            >
              <FileCopyIcon />
            </IconButton>
          ),
        },
      },
      {
        name: (_.lowerCase(rowsType) !== 'active') ? 'View' : 'Edit',
        options: {
          filter: false,
          sort: false,
          empty: true,
          setCellHeaderProps: () => ({
            className: classes.centerHeader,
          }),
          customBodyRenderLite: (dataIndex) => (
            <IconButton onClick={() => editAction(rows[dataIndex])}>
              {!isAdmin
              && rows[dataIndex]
              && rows[dataIndex].status
              && _.lowerCase(rows[dataIndex].status) !== 'planned'
                ? <ViewIcon />
                : <EditIcon />}
            </IconButton>
          ),
        },
      },
      {
        name: 'Delete',
        options: {
          filter: false,
          sort: false,
          empty: true,
          setCellHeaderProps: () => ({
            className: classes.centerHeader,
          }),
          customBodyRenderLite: (dataIndex) => (
            <IconButton
              onClick={() => deleteAction(rows[dataIndex])}
            >
              <DeleteIcon />
            </IconButton>
          ),
        },
      },
      ..._.map(getShipmentDataTableColumns(timezone, consortiumData), (column) => ({
        ...column,
        options: {
          ...column.options,
          setCellHeaderProps: () => ({
            className: classes.leftHeader,
          }),
        },
      })),
    ];

    if (_.lowerCase(rowsType) === 'completed') {
      setColumns(cols);
    } else {
      const restCols = _.filter(cols, (col) => col.name !== 'Copy');
      setColumns(restCols);
    }
  }, [timezone, consortiumData, rowsType]);

  return (
    <div className={classes.root}>
      <MUIDataTable
        data={rows}
        columns={columns}
        options={options}
        components={{
          Checkbox: CustomCheckbox,
        }}
      />
    </div>
  );
};

export default ShipmentDataTable;
