import React, { useContext, useState } from 'react';
import MUIDataTable from 'mui-datatables';
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
} from '@material-ui/icons';
import { UserContext } from '@context/User.context';
import { checkForGlobalAdmin } from '@utils/utilMethods';
import { SHIPMENT_DATA_TABLE_COLUMNS } from '../ShipmentConstants';

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
}) => {
  const classes = useStyles();
  const [selected, setSelected] = useState(0);
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

  const columns = [
    {
      name: 'Edit',
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
            && rows[dataIndex].status.toLowerCase() !== 'planned'
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
    ...SHIPMENT_DATA_TABLE_COLUMNS.map((column) => ({
      ...column,
      options: {
        ...column.options,
        setCellHeaderProps: () => ({
          className: classes.leftHeader,
        }),
      },
    })),
  ];

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
