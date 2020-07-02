import React from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#fff",
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
      color: "#fff",
    },
    marginRight: theme.spacing(2),
    width: "100%",
    borderRadius: "20px",
    margin: "1em",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "50%",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));
export default function SearchInput({ ...props }) {
  const classes = useStyles();
  const { customContainerClass, customSearchInputClass } = props;
  return (
    <div
      className={`${classes.search} ${
        customContainerClass && customContainerClass
      }`}
    >
      <div className={classes.searchIcon}>
        <SearchIcon color={"secondary"} />
      </div>
      <InputBase
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: `${classes.inputInput} ${
            customSearchInputClass && customSearchInputClass
          }`,
        }}
        value={props.searchValue}
        onChange={(e) => props.searchAction(e)}
        inputProps={{ "aria-label": "search" }}
      />
    </div>
  );
}
