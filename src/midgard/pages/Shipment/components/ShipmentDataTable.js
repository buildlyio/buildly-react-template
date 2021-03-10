import React, { useContext, useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/ListAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import { SHIPMENT_DATA_TABLE_COLUMNS } from "../ShipmentConstants";
import { checkForGlobalAdmin } from "midgard/utils/utilMethods";
import { UserContext } from "midgard/context/User.context";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiChip-root': {
      display: 'none',
    },
  },
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
  tabContainer: {
    backgroundColor: "#383636",
    margin: "0",
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
  const subNav = [
    { label: "Active", value: "Active" },
    { label: "Completed", value: "Completed"},
  ];
  const typeFilter = (subNav.find(item => location.pathname.endsWith(item.value)) || subNav[0]).value;
  const [selectedFilter, setSelectedFilter] = useState(typeFilter);
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
    // onFilterChange: (columnChanged, filterList,event) => {
    //   if (columnChanged === 'type'){
    //     let filteredValue = null
    //     if (filterList[2].length === 1)
    //       filteredValue = filterList[2][0]
    //     onTypeFilter(event,filteredValue);
    //   }
    // },
    // onTableInit: () => {
    //   onTypeFilter(null,typeFilter);
    // },
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

  // useEffect(() => {
  //   if (selectedFilter && rows.length) {
  //     let selectedIndex = _.map(_.keys(_.pickBy(rows, {type: selectedFilter})), Number);
  //     setSelected(selectedIndex[0]);
  //   }
  // })

  const onTypeFilter = (event, value) => {
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
    <div className={classes.root}>
      {/* <Box mb={3} className={classes.tabContainer}>
        <Tabs value={selectedFilter} onChange={onTypeFilter}>
          {subNav.map((itemProps, index) => <Tab {...itemProps} key={`tab${index}:${itemProps.value}`} />)}
        </Tabs>
      </Box> */}
      <MUIDataTable
        data={rows}
        columns={columns}
        options={options}
        components={{
          Checkbox: CustomCheckbox,
        }}
      />
    </div>
  )
}

export default ShipmentDataTable;