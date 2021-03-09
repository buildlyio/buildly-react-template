import React, { useContext, useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/RemoveRedEye";
import DeleteIcon from "@material-ui/icons/Delete";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { SHIPMENT_DATA_TABLE_COLUMNS } from "../ShipmentConstants";
import { checkForGlobalAdmin } from "midgard/utils/utilMethods";
import { UserContext } from "midgard/context/User.context";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  centerHeader: {
    '& div': {
      textAlign: "center",
    },
  },
  leftHeader: {
    '& span': {
      textAlign: "left",
    },
  },
}));

const CustomCheckbox = (props) => {
  let newProps = Object.assign({}, props);
  newProps.color = props['data-description'] === 'row-select' ? 'secondary' : 'primary';

  if (props['data-description'] === 'row-select') {
    return (<Radio {...newProps} />);
  } else {
    return (<Checkbox {...newProps} />);
  }
};

const ShipmentDataTable = ({ tileView, rows, editAction, deleteAction, setSelectedShipment, setShipmentFilter }) => {
  const classes = useStyles();

  const [selected, setSelected] = useState(0);
  const [cols, setCols] = useState(columns);
  const [selectedFilter, setSelectedFilter] = useState("Active");
  const user = useContext(UserContext);
  const isAdmin = checkForGlobalAdmin(user);
  const options = {
    filter: true,
    filterType: "multiselect",
    responsive: "standard",
    tableBodyHeight: tileView ? "435px" : "500px",
    tableBodyMaxHeight: "",
    selectableRows: "single",
    selectToolbarPlacement: "none",
    rowsPerPageOptions: [5, 10, 15],
    downloadOptions: { filename: "ShipmentData.csv", separator: "," },
    rowsSelected: [selected],
    onRowSelectionChange: (rowsSelected) => {
      const index = rowsSelected[0].dataIndex;
      setSelected(index);
      setSelectedShipment(rows[index]);
    },
    onFilterChange: (columnChanged, filterList) => {
      if (columnChanged === 'type'){
        let filteredValue = null
        if (filterList[2].length === 1)
          filteredValue = filterList[2][0]
        onFilter({ target: { filteredValue } });
      }
    },
    onTableInit: () => {
      let value = "Active"
      setTimeout(() => onFilter({ target: { value } }), 1000);
    },
    textLabels: {
      body: {
        noMatch: "No data to display",
      },
    },
  };

  const columns = [
    {
      name: "Edit",
      options: {
        filter: false,
        sort: false,
        empty: true,
        setCellHeaderProps: () => ({ className: classes.centerHeader, }),
        customBodyRenderLite: (dataIndex) => {
          const row = rows[dataIndex];
          return (
            <IconButton onClick={() => editAction(row)}>
              {!isAdmin && row && row.status &&
              row.status.toLowerCase() !== 'planned'
                ? <ViewIcon />
                : <EditIcon />
              }
            </IconButton>
          );
        }
      }
    },
    {
      name: "Delete",
      options: {
        filter: false,
        sort: false,
        empty: true,
        setCellHeaderProps: () => ({ className: classes.centerHeader, }),
        customBodyRenderLite: (dataIndex) => {
          return (
            <IconButton onClick={() => deleteAction(rows[dataIndex])}>
              <DeleteIcon />
            </IconButton>
          );
        }
      }
    },
    ...SHIPMENT_DATA_TABLE_COLUMNS.map(column => ({
      ...column,
      options: {
        ...column.options,
        setCellHeaderProps: () => ({ className: classes.leftHeader, }),
      },
    }))
  ];

  useEffect(() => {
    if (selectedFilter && rows.length > 0) {
      let selectedIndex = _.map(_.keys(_.pickBy(rows, {type: selectedFilter})), Number);
      setSelected(selectedIndex[0]);
    }
  })

  const onFilter = ({ target: { value } }) => {
    setSelectedFilter(value);
    setShipmentFilter(value);
    const filteredCols = columns;
    if (value == "Active" || value == "Completed") {
      let filterList = [value];
      filteredCols[2].options.filterList = filterList;
      setCols(filteredCols);
    }
    else {
      filteredCols[2].options.filterList = [];
      setCols(filteredCols);
      setSelected(0);
    }
  };

  return (
    <div>
      <Select onChange={onFilter} value={selectedFilter}>
        <MenuItem value="Active">Active</MenuItem>
        <MenuItem value="Completed">Completed</MenuItem>
      </Select>
    <MUIDataTable
      data={rows}
      columns={cols}
      options={options}
      components={{
        Checkbox: CustomCheckbox,
      }}
    />
    </div>
  )
}

export default ShipmentDataTable;