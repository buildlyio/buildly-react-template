import "./Modal.css";
import Modal from "react-bootstrap/Modal";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { ReleaseService } from "../../services/release.service";
import { Release } from "../../interfaces/release";

const releaseService = new ReleaseService();

interface ModalProps {
  show: boolean;
}

const CustomModal = (props: ModalProps) => {
  const [formData, setFormData] = useState({} as Release);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  // Update formData on form value change
  const updateFormData = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitRelease = (event: any) => {
    event.preventDefault();
    console.log("formData : ", formData);
    releaseService.submitRelease(formData).then();
  };

  const closeModal = {
    // props.show = false
  };

  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal
        show={props.show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>New release</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <Form noValidate>
            {/*name*/}
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                size="sm"
                type="text"
                placeholder="Name"
                name="name"
                required
                onChange={(event) => updateFormData(event)}
              />
            </Form.Group>
            {/*description*/}
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                onChange={(event) => updateFormData(event)}
              />
            </Form.Group>
            {/*release date*/}
            <Form.Group className="mb-3" controlId="date">
              <Form.Label>Release date</Form.Label>
              <Form.Control
                size="sm"
                type="date"
                placeholder="Release date"
                name="release_date"
                required
                onChange={(event) => updateFormData(event)}
              />
            </Form.Group>
            {/*product*/}
            {/*<Form.Group className="mb-3" controlId="product">*/}
            {/*  <Select*/}
            {/*    name="product_uuid"*/}
            {/*    label="Select a product"*/}
            {/*    options={props.products}*/}
            {/*    required={true}*/}
            {/*    onChange={(event) => updateFormData(event)}*/}
            {/*  />*/}
            {/*</Form.Group>*/}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => (props.show = false)}
          >
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={
              !(formData.name && formData.release_date && formData.product_uuid)
            }
            onClick={(event) => submitRelease(event)}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomModal;
