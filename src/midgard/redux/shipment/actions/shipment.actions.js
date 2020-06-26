export const SAVE_SHIPMENT_FORM_DATA = "SHIPMENT/SAVE_SHIPMENT_FORM_DATA";

export const saveShipmentFormData = (formData) => ({
  type: SAVE_SHIPMENT_FORM_DATA,
  formData,
});
