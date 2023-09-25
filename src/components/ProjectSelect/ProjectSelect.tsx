import React, {useState, useContext} from "react";
import {useActor, useSelector} from '@xstate/react';
import Select from "../Select";
import CustomModal from "../ReleaseModal/Modal";
import "./ProjectSelect.css";
import {GlobalStateContext} from '../../context/globalState';


const ProjectSelect = ({orgUuid}: any) => {
    // Add/Edit release modal
    const [show, setShow] = useState(false);

    const globalContext = useContext(GlobalStateContext);
    const [productState, send] = useActor(globalContext.productMachineService);
    const selectCurrentProduct = (state: any) => state.context.selectedProduct;

    // set current product
    const currentProduct = useSelector(globalContext.productMachineService, selectCurrentProduct)
    const setSelectedProduct = (value: any) => {
        send({type: 'SelectProduct', product_uuid: value});
    };

    return (
        <>
            <div className="product-select-container">
                <section className="col-6">
                    <Select
                        label="Select a product"
                        size="large"
                        value={currentProduct?.product_uuid}
                        info={
                            currentProduct?.edit_date
                                ? `last updated: ${
                                    new Date(currentProduct?.edit_date)
                                        .toISOString()
                                        .split("T")[0]
                                }`
                                : ""
                        }
                        options={
                            (productState.context.products.length &&
                                productState.context.products.map((product: any) => ({
                                    label: product.name,
                                    value: product.product_uuid,
                                }))) ||
                            []
                        }
                        onChange={(event) => setSelectedProduct(event.target.value)}
                    />
                </section>

                {/*<Button variant="outline-secondary" size="sm" onClick={handleShow}>*/}
                {/*  New release*/}
                {/*</Button>*/}
            </div>

            {/*Add/Edit release modal*/}
            <CustomModal show={show}/>
        </>
    );
};

export default ProjectSelect;
