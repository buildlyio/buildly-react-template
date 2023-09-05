import React, { useState } from "react";
import { useMachine } from "@xstate/react";
import { productMachine } from "../../state/product/product";
import { ProductService } from "../../services/product.service";
import Select from "../Select";
import Button from "react-bootstrap/Button";
import CustomModal from "../ReleaseModal/Modal";
import "./ProjectSelect.css";

const productService = new ProductService();

const ProjectSelect = ({ orgUuid }: any) => {
  // Add/Edit release modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let selectedProduct = null;

  const [productState] = useMachine(productMachine, {
    services: {
      loadProducts: async (): Promise<any> =>
        productService.getProducts(orgUuid).then((products) => {
          if (products?.length) {
            selectedProduct = products[0];

            return products.map((product: any) => {
              return {
                label: product.name,
                value: product.product_uuid,
              };

              // return selectOptions.sort((a: any, b: any) =>
              //   a.label > b.label ? 1 : -1
              // );
            });
          }
          return [];
        }),
    },
  });

  return (
    <>
      <div className="product-select-container">
        <section className="col-6">
          <Select
            label="Select a product"
            size="large"
            value="b075ca67-936e-471d-a909-d19daf7bc79c"
            info="last updated: 2023 -01-13"
            options={productState.context.products}
          />
        </section>

        <Button variant="outline-secondary" size="sm" onClick={handleShow}>
          New release
        </Button>
      </div>

      {/*Add/Edit release modal*/}
      <CustomModal show={show} />
    </>
  );
};

export default ProjectSelect;
