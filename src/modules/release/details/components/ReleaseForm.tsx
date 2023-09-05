import "./ReleaseForm.css";
import Form from "react-bootstrap/Form";
import React, { useState } from "react";
import { Release } from "../../../../interfaces/release";
import Button from "react-bootstrap/Button";
import { ReleaseService } from "../../../../services/release.service";

const releaseService = new ReleaseService();

function ReleaseForm() {
  // Update formData on form value change
  const [formData, setFormData] = useState({} as Release);
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

  return (
    <>
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
      <div>
        <Button variant="outline-secondary" size="sm">
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
      </div>
    </>
  );
}

export default ReleaseForm;
