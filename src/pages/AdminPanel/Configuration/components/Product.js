import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";
import {
  getProducts,
  deleteProduct,
} from "midgard/redux/items/actions/items.actions";
import DataTableWrapper from "midgard/components/DataTableWrapper/DataTableWrapper";
import { PRODUCT_COLUMNS, unitMeasures } from "../ConfigurationConstants";
import { routes } from "midgard/routes/routesConstants";
import { Route } from "react-router-dom";
import AddProduct from "../forms/AddProduct";
import { UserContext } from "midgard/context/User.context";

const Product = (props) => {
  const { 
    dispatch,
    loading,
    products,
    unitsOfMeasure,
    redirectTo,
    history, 
  } = props;
  const organization = useContext(UserContext).organization.organization_uuid;
  const [openConfirmModal, setConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const addPath = redirectTo
    ? `${redirectTo}/product`
    : `${routes.CONFIGURATION}/product/add`;
  const editPath = redirectTo
  ? `${redirectTo}/product`
  : `${routes.CONFIGURATION}/product/edit`;

  useEffect(() => {
    if (!loading && !products) {
      dispatch(getProducts(organization));
    }
  }, [products]);

  useEffect(() => {
    if (!loading) {
      unitMeasures(unitsOfMeasure);
    }
  }, [unitsOfMeasure]);

  const onAddButtonClick = () => {
    history.push(`${addPath}`, {
      from: redirectTo || routes.CONFIGURATION,
    });
  };

  const editType = (item) => {
    history.push(`${editPath}/:${item.id}`, {
      type: "edit",
      from: redirectTo || routes.CONFIGURATION,
      data: item,
    });
  };

  const deleteType = (item) => {
    setDeleteId(item.id);
    setConfirmModal(true);
  };

  const handleConfirmModal = () => {
    dispatch(deleteProduct(deleteId));
    setConfirmModal(false);
  };

  return (
    <DataTableWrapper
      loading={loading}
      rows={products || []}
      columns={PRODUCT_COLUMNS}
      filename="Products"
      addButtonHeading="Product"
      onAddButtonClick={onAddButtonClick}
      editAction={editType}
      deleteAction={deleteType}
      openConfirmModal={openConfirmModal}
      setConfirmModal={setConfirmModal}
      handleConfirmModal={handleConfirmModal}
      confirmModalTitle={"Are you sure you want to Delete this Product?"}
    >
      <Route path={`${addPath}`} component={AddProduct} />
      <Route path={`${editPath}/:id`} component={AddProduct} />
    </DataTableWrapper>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.itemsReducer,
});

export default connect(mapStateToProps)(Product);
