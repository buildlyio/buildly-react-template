import React, { useState } from "react";
import { useMachine } from "@xstate/react";
import { productMachine } from "../../state/product/product";
import { ProductService } from "../../services/product.service";
import Select from "../Select";
import CustomModal from "../ReleaseModal/Modal";
import "./ProjectSelect.css";

const productService = new ProductService();

const ProjectSelect = ({ orgUuid }: any) => {
  // Add/Edit release modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // @ts-ignore
  const [productState] = useMachine(productMachine, {
    context: {
      products: [],
      error: undefined,
      organization_uuid: "baa50960-1a98-4ced-bb16-b60662ddea55",
      selectedProduct: null,
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

        {/*<Button variant="outline-secondary" size="sm" onClick={handleShow}>*/}
        {/*  New release*/}
        {/*</Button>*/}
      </div>

      {/*Add/Edit release modal*/}
      <CustomModal show={show} />
    </>
  );
};

export default ProjectSelect;
