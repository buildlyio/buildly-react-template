import React from 'react';
import {
  lighten,
  makeStyles,
  InputBase,
} from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    backgroundColor: '#fff',
    color: '#000',
    '&:hover': {
      backgroundColor: lighten(theme.palette.primary.main, 0.5),
      color: theme.palette.primary.contrastText,
    },
    marginRight: theme.spacing(2),
    width: '100%',
    borderRadius: '20px',
    margin: '1em',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: '50%',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    opacity: 0.8,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    display: 'flex',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const SearchInput = ({
  customContainerClass,
  customSearchInputClass,
  searchValue,
  searchAction,
}) => {
  const classes = useStyles();

  return (
    <div
      className={`${classes.search} ${
        customContainerClass && customContainerClass
      }`}
    >
      <div className={classes.searchIcon}>
        <SearchIcon color="inherit" />
      </div>
      <InputBase
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: `${classes.inputInput} ${
            customSearchInputClass
            && customSearchInputClass
          }`,
        }}
        value={searchValue}
        onChange={searchAction}
        inputProps={{ 'aria-label': 'search' }}
      />
    </div>
  );
};

export default SearchInput;
