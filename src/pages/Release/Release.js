import React, { useEffect, useState } from 'react';
import { Link, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { getAllReleases } from '@redux/release/actions/release.actions';
import { routes } from '@routes/routesConstants';
import AddRelease from './components/AddRelease';
import { releaseColumns, getReleasesData } from './ReleaseConstants';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(5),
    paddingTop: 0,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '& :hover': {
      textDecoration: 'underline',
    },
  },
}));

const Release = ({
  dispatch, loading, releases, history, redirectTo,
}) => {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState(releaseColumns);

  const addReleasePath = redirectTo
    ? `${redirectTo}/release`
    : `${routes.RELEASE}/add`;

  const editReleasePath = redirectTo
    ? `${redirectTo}/release`
    : `${routes.RELEASE}/edit`;

  useEffect(() => {
    if (!releases) {
      dispatch(getAllReleases());
    }
  }, []);

  useEffect(() => {
    if (releases && releases.length > 0) {
      const rws = _.orderBy(getReleasesData(releases), 'create_date', 'desc');
      let cols = columns;

      if (cols[0] && !(cols[0].label === 'Name')) {
        cols = [
          {
            name: 'name',
            label: 'Name',
            options: {
              filter: false,
              sort: false,
              empty: true,
              customBodyRenderLite: (dataIndex) => {
                const row = rws[dataIndex];
                return (
                  <Link
                    className={classes.link}
                    to={`${routes.RELEASE}/view/${row.release_uuid}`}
                  >
                    {row.name}
                  </Link>
                );
              },
            },
          },
          ...columns,
        ];
      }

      setRows(rws);
      setColumns(cols);
    }
  }, [releases]);

  const onAddButtonClick = () => {
    history.push(addReleasePath, {
      from: redirectTo || routes.RELEASE,
    });
  };

  const editRelease = (item) => {
    history.push(`${editReleasePath}/:${item.release_uuid}`, {
      type: 'edit',
      from: redirectTo || routes.RELEASE,
      data: item,
    });
  };

  return (
    <div className={classes.root}>
      <DataTableWrapper
        loading={loading}
        rows={rows || []}
        columns={columns}
        filename="ReleaseList"
        addButtonHeading="Add Release"
        onAddButtonClick={onAddButtonClick}
        editAction={editRelease}
        tableHeader="Releases"
      >
        <Route path={addReleasePath} component={AddRelease} />
        <Route path={`${editReleasePath}/:id`} component={AddRelease} />
      </DataTableWrapper>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.productReducer,
});

export default connect(mapStateToProps)(Release);
