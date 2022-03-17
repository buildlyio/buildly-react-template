import React, { useContext, useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import _ from 'lodash';
import {
  Checkbox,
  Radio,
  IconButton,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Edit as EditIcon,
  ListAlt as ViewIcon,
  Delete as DeleteIcon,
  FileCopy as FileCopyIcon,
} from '@mui/icons-material';
import { UserContext } from '@context/User.context';
import { checkForGlobalAdmin } from '@utils/utilMethods';
import { getShipmentDataTableColumns } from '../ShipmentConstants';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiChip-root': {
      display: 'none',
    },
    '& .MuiPaper-root > .MuiToolbar-regular': {
      marginTop: '-60px',
      paddingRight: '35px',
      backgroundColor: '#222222',
      '&>:nth-child(1)': {
        margin: '0 25%',
      },
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
    selectableRowsHideCheckboxes: true,
    selectableRows: 'single',
    selectToolbarPlacement: 'none',
    rowsPerPageOptions: [5, 10, 15],
    downloadOptions: {
      filename: 'ShipmentData.csv',
      separator: ',',
      filterOptions: {
        useDisplayedColumnsOnly: true,
      },
    },
    onRowClick: (rowData, rowMeta) => {
      setSelected(rowMeta.dataIndex);
      setSelectedShipment(rows[rowMeta.dataIndex]);
    },
    rowsSelected: [selected],
    textLabels: {
      body: {
        noMatch: 'No data to display',
      },
    },
  };

  useEffect(() => {
    setSelected(0);
    let cols = [
      {
        name: 'COPY',
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
        name: (!isAdmin && _.lowerCase(rowsType) !== 'active') ? 'VIEW' : 'EDIT',
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
    ];

    if (isAdmin) {
      cols = [
        ...cols,
        {
          name: 'DELETE',
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
      ];
    }

    cols = [
      ...cols,
      ..._.map(getShipmentDataTableColumns(timezone), (column) => ({
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
      const restCols = _.filter(cols, (col) => col.name !== 'COPY');
      setColumns(restCols);
    }
  }, [timezone, rowsType, rows]);

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
