import "./ReleaseForm.css";
import Form from "react-bootstrap/Form";
import React, { useState } from "react";
import { Release } from "../../../../interfaces/release";
import Button from "react-bootstrap/Button";
import { ReleaseService } from "../../../../services/release.service";

const releaseService = new ReleaseService();

function ReleaseForm({ releasesDetails }: any) {
  // Update formData on form value change
  let [formData, setFormData] = useState({} as Release);
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

  const resetForm = () => {};

  // Init form values
  if (releasesDetails && !Object.keys(formData).length) {
    setFormData({
      ...formData,
      release_uuid: releasesDetails.release_uuid,
      name: releasesDetails.name,
      description: releasesDetails.description,
      release_date: releasesDetails.release_date,
    });
  }

  return (
    <>
      <Form noValidate>
        {/*name*/}
        <Form.Group className="mb-3 col-md-6 col-sm-12" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            size="sm"
            type="text"
            placeholder="Name"
            name="name"
            defaultValue={formData.name}
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
            defaultValue={formData.description}
            onChange={(event) => updateFormData(event)}
          />
        </Form.Group>
        {/*release date*/}
        <Form.Group className="mb-3 col-md-3 col-sm-12" controlId="date">
          <Form.Label>Release date</Form.Label>
          <Form.Control
            size="sm"
            type="date"
            placeholder="Release date"
            name="release_date"
            defaultValue={formData.release_date}
            required
            onChange={(event) => updateFormData(event)}
          />
        </Form.Group>
      </Form>
      <div className="d-flex flex-row justify-content-end">
        <Button
          className="mx-2"
          variant="outline-secondary"
          size="sm"
          onClick={() => resetForm()}
        >
          Cancel
        </Button>

        <Button
          className="mx-2"
          variant="secondary"
          size="sm"
          type="submit"
          disabled={!(formData.name && formData.release_date)}
          onClick={(event) => submitRelease(event)}
        >
          Save
        </Button>
      </div>
    </>
  );
}

export default ReleaseForm;
