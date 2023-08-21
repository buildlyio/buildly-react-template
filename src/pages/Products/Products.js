import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import DataTableWrapper from '@components/DataTableWrapper/DataTableWrapper';
import { getAllProducts } from '@redux/product/actions/product.actions';
import { routes } from '@routes/routesConstants';
import AddProduct from '@pages/NewProduct/NewProduct';
import { productColumns, getProductsData } from './ProductConstants';
import { clearProductData } from '@redux/release/actions/release.actions';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(5),
    paddingTop: 0,
  },
}));

const Products = ({
  dispatch, loading, history, products, user,
}) => {
  const redirectTo = location.state && location.state.from;
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState('');
  const [menuIndex, setMenuIndex] = useState(0);

  const addProductPath = redirectTo
    ? `${redirectTo}/product`
    : `${routes.NEW_PRODUCT}`;

  const editProductPath = redirectTo
    ? `${redirectTo}/product`
    : `${routes.PRODUCTS}/edit`;

  const deleteProduct = (item) => {
    setDeleteItemId(item.product_uuid);
    setConfirmModal(true);
  };

  const handleConfirmModal = () => {
    const deleteData = {
      product_uuid: deleteItemId,
    };
    dispatch(clearProductData(deleteData));
    setConfirmModal(false);
  };

  useEffect(() => {
    dispatch(getAllProducts(user.organization.organization_uuid));
  }, [user]);

  useEffect(() => {
    setRows(_.orderBy(getProductsData(products), 'create_date', 'desc'));
  }, [products]);

  const onAddButtonClick = () => {
    history.push(addProductPath, {
      from: redirectTo || location.pathname,
    });
  };

  const editProduct = (item) => {
    history.push(`${editProductPath}/:${item.product_uuid}`, {
      type: 'editP',
      from: redirectTo || location.pathname,
      data: item,
      product_uuid: item.product_uuid,
    });
  };

  const viewProductRoadmap = (item) => {
    localStorage.setItem('activeProduct', item.product_uuid);
    history.push(routes.ROADMAP_REPORT);
  };

  return (
    <div className={classes.root}>
      <DataTableWrapper
        loading={loading}
        rows={rows || []}
        columns={productColumns}
        filename="ProductList"
        addButtonHeading="Add Product"
        onAddButtonClick={onAddButtonClick}
        editAction={editProduct}
        roadmapAction={viewProductRoadmap}
        deleteAction={deleteProduct}
        openDeleteModal={openConfirmModal}
        setDeleteModal={setConfirmModal}
        handleDeleteModal={handleConfirmModal}
        deleteModalTitle="Are you sure you want to delete this product?"
        tableHeader="Dashboard"
        menuIndex={menuIndex}
        setMenuIndex={setMenuIndex}
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
  user: state.authReducer.data,
});

export default connect(mapStateToProps)(Products);
