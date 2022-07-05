import React, { useEffect, useState } from 'react';
import { Link, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { getAllProducts } from '@redux/product/actions/product.actions';
import { routes } from '@routes/routesConstants';
import AddProduct from '../pages/NewProduct/NewProduct';
import { productColumns, getProductsData } from './ProductConstants';

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

const Products = ({
  dispatch, loading, history, products,
}) => {
  const redirectTo = location.state && location.state.from;
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState(productColumns);

  const addProductPath = redirectTo
    ? `${redirectTo}/product`
    : `${routes.PRODUCTS}/add`;

  const editProductPath = redirectTo
    ? `${redirectTo}/product`
    : `${routes.PRODUCTS}/edit`;

  useEffect(() => {
    if (!products || _.isEmpty(products)) {
      dispatch(getAllProducts());
    }
  }, []);

  useEffect(() => {
    if (products && products.length > 0) {
      const rws = _.orderBy(getProductsData(products), 'create_date', 'desc');
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
                  // <Link
                  //   className={classes.link}
                  //   to={`${routes.PRODUCTS}/view/:${row.product_uuid}`}
                  // >
                  row.name
                  // </Link>
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
  }, [products]);

  const onAddButtonClick = () => {
    history.push(addProductPath, {
      from: redirectTo || routes.PRODUCTS,
    });
  };

  const editProduct = (item) => {
    history.push(`${editProductPath}/:${item.product_uuid}`, {
      type: 'editP',
      from: redirectTo || location.pathname,
      data: item,
    });
  };

  return (
    <div className={classes.root}>
      <DataTableWrapper
        loading={loading}
        rows={rows || []}
        columns={columns}
        filename="ProductList"
        addButtonHeading="Add Product"
        onAddButtonClick={onAddButtonClick}
        editAction={editProduct}
        tableHeader="Products"
      >
        <Route path={addProductPath} component={AddProduct} />
        <Route path={`${editProductPath}/:id`} component={AddProduct} />
      </DataTableWrapper>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.productReducer,
});

export default connect(mapStateToProps)(Products);
