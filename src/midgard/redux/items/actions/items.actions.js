//get items action constants
export const GET_ITEMS = "ITEMS/GET_ITEMS";
export const GET_ITEMS_SUCCESS = "ITEMS/GET_ITEMS_SUCCESS";
export const GET_ITEMS_FAILURE = "ITEMS/GET_ITEMS_FAILURE";

//add items action constants
export const ADD_ITEMS = "ITEMS/ADD_ITEMS";
export const ADD_ITEMS_SUCCESS = "ITEMS/ADD_ITEMS_SUCCESS";
export const ADD_ITEMS_FAILURE = "ITEMS/ADD_ITEMS_FAILURE";

//edit items action constants
export const EDIT_ITEMS = "ITEMS/EDIT_ITEMS";
export const EDIT_ITEMS_SUCCESS = "ITEMS/EDIT_ITEMS_SUCCESS";
export const EDIT_ITEMS_FAILURE = "ITEMS/EDIT_ITEMS_FAILURE";

//delete items action constants
export const DELETE_ITEMS = "ITEMS/DELETE_ITEMS";
export const DELETE_ITEMS_SUCCESS = "ITEMS/DELETE_ITEMS_SUCCESS";
export const DELETE_ITEMS_FAILURE = "ITEMS/DELETE_ITEMS_FAILURE";

//search items action constants
export const SEARCH = "ITEMS/SEARCH";
export const SEARCH_SUCCESS = "ITEMS/SEARCH_SUCCESS";

//get item types action constants
export const GET_ITEMS_TYPE = "ITEMS/GET_ITEMS_TYPE";
export const GET_ITEMS_TYPE_SUCCESS = "ITEMS/GET_ITEMS_TYPE_SUCCESS";
export const GET_ITEMS_TYPE_FAILURE = "ITEMS/GET_ITEMS_TYPE_FAILURE";

//get units of measure action constants
export const GET_UNITS_OF_MEASURE = "ITEMS/GET_UNITS_OF_MEASURE";
export const GET_UNITS_OF_MEASURE_SUCCESS =
  "ITEMS/GET_UNITS_OF_MEASURE_SUCCESS";
export const GET_UNITS_OF_MEASURE_FAILURE =
  "ITEMS/GET_UNITS_OF_MEASURE_FAILURE";

export const GET_ITEM_OPTIONS = "ITEMS/GET_ITEM_OPTIONS";
export const GET_ITEM_OPTIONS_SUCCESS = "ITEMS/GET_ITEM_OPTIONS_SUCCESS";
export const GET_ITEM_OPTIONS_FAILURE = "ITEMS/GET_ITEM_OPTIONS_FAILURE";

export const GET_PRODUCTS = "ITEM/GET_PRODUCTS";
export const GET_PRODUCTS_SUCCESS = "ITEMS/GET_PRODUCTS_SUCCESS";
export const GET_PRODUCTS_FAILURE = "ITEMS/GET_PRODUCTS_FAILURE";

export const GET_PRODUCTS_OPTIONS = "ITEM/GET_PRODUCTS_OPTIONS";
export const GET_PRODUCTS_OPTIONS_SUCCESS =
  "ITEMS/GET_PRODUCTS_OPTIONS_SUCCESS";
export const GET_PRODUCTS_OPTIONS_FAILURE =
  "ITEMS/GET_PRODUCTS_OPTIONS_FAILURE";

export const GET_PRODUCTS_TYPE = "ITEM/GET_PRODUCTS_TYPE";
export const GET_PRODUCTS_TYPE_SUCCESS = "ITEMS/GET_PRODUCTS_TYPE_SUCCESS";
export const GET_PRODUCTS_TYPE_FAILURE = "ITEMS/GET_PRODUCTS_TYPE_FAILURE";

//add item types action constants
export const ADD_ITEMS_TYPE = "ITEMS/ADD_ITEMS_TYPE";
export const ADD_ITEMS_TYPE_SUCCESS = "ITEMS/ADD_ITEMS_TYPE_SUCCESS";
export const ADD_ITEMS_TYPE_FAILURE = "ITEMS/ADD_ITEMS_TYPE_FAILURE";

//edit item types action constants
export const EDIT_ITEMS_TYPE = "ITEMS/EDIT_ITEMS_TYPE";
export const EDIT_ITEMS_TYPE_SUCCESS = "ITEMS/EDIT_ITEMS_TYPE_SUCCESS";
export const EDIT_ITEMS_TYPE_FAILURE = "ITEMS/EDIT_ITEMS_TYPE_FAILURE";

//delete item types action constants
export const DELETE_ITEMS_TYPE = "ITEMS/DELETE_ITEMS_TYPE";
export const DELETE_ITEMS_TYPE_SUCCESS = "ITEMS/DELETE_ITEMS_TYPE_SUCCESS";
export const DELETE_ITEMS_TYPE_FAILURE = "ITEMS/DELETE_ITEMS_TYPE_FAILURE";

//add product types action constants
export const ADD_PRODUCTS_TYPE = "ITEMS/ADD_PRODUCTS_TYPE";
export const ADD_PRODUCTS_TYPE_SUCCESS = "ITEMS/ADD_PRODUCTS_TYPE_SUCCESS";
export const ADD_PRODUCTS_TYPE_FAILURE = "ITEMS/ADD_PRODUCTS_TYPE_FAILURE";

//edit product types action constants
export const EDIT_PRODUCTS_TYPE = "ITEMS/EDIT_PRODUCTS_TYPE";
export const EDIT_PRODUCTS_TYPE_SUCCESS = "ITEMS/EDIT_PRODUCTS_TYPE_SUCCESS";
export const EDIT_PRODUCTS_TYPE_FAILURE = "ITEMS/EDIT_PRODUCTS_TYPE_FAILURE";

//delete product types action constants
export const DELETE_PRODUCTS_TYPE = "ITEMS/DELETE_PRODUCTS_TYPE";
export const DELETE_PRODUCTS_TYPE_SUCCESS = "ITEMS/DELETE_PRODUCTS_TYPE_SUCCESS";
export const DELETE_PRODUCTS_TYPE_FAILURE = "ITEMS/DELETE_PRODUCTS_TYPE_FAILURE";

export const ADD_PRODUCTS = "ITEM/ADD_PRODUCTS";
export const ADD_PRODUCTS_SUCCESS = "ITEMS/ADD_PRODUCTS_SUCCESS";
export const ADD_PRODUCTS_FAILURE = "ITEMS/ADD_PRODUCTS_FAILURE";

export const EDIT_PRODUCTS = "ITEM/EDIT_PRODUCTS";
export const EDIT_PRODUCTS_SUCCESS = "ITEMS/EDIT_PRODUCTS_SUCCESS";
export const EDIT_PRODUCTS_FAILURE = "ITEMS/EDIT_PRODUCTS_FAILURE";

export const DELETE_PRODUCTS = "ITEM/DELETE_PRODUCTS";
export const DELETE_PRODUCTS_SUCCESS = "ITEMS/DELETE_PRODUCTS_SUCCESS";
export const DELETE_PRODUCTS_FAILURE = "ITEMS/DELETE_PRODUCTS_FAILURE";

//add units of measure action constants
export const ADD_UNITS_OF_MEASURE = "ITEMS/ADD_UNITS_OF_MEASURE";
export const ADD_UNITS_OF_MEASURE_SUCCESS =
  "ITEMS/ADD_UNITS_OF_MEASURE_SUCCESS";
export const ADD_UNITS_OF_MEASURE_FAILURE =
  "ITEMS/ADD_UNITS_OF_MEASURE_FAILURE";

//edit units of measure action constants
export const EDIT_UNITS_OF_MEASURE = "ITEMS/EDIT_UNITS_OF_MEASURE";
export const EDIT_UNITS_OF_MEASURE_SUCCESS =
  "ITEMS/EDIT_UNITS_OF_MEASURE_SUCCESS";
export const EDIT_UNITS_OF_MEASURE_FAILURE =
  "ITEMS/EDIT_UNITS_OF_MEASURE_FAILURE";

//delete units of measure action constants
export const DELETE_UNITS_OF_MEASURE = "ITEMS/DELETE_UNITS_OF_MEASURE";
export const DELETE_UNITS_OF_MEASURE_SUCCESS =
  "ITEMS/DELETE_UNITS_OF_MEASURE_SUCCESS";
export const DELETE_UNITS_OF_MEASURE_FAILURE =
  "ITEMS/DELETE_UNITS_OF_MEASURE_FAILURE";

export const IMPORT_ITEMS = "ITEMS/IMPORT_ITEMS";
export const IMPORT_ITEMS_SUCCESS = "ITEMS/IMPORT_ITEMS_SUCCESS";
export const IMPORT_ITEMS_FAILURE = "ITEMS/IMPORT_ITEMS_FAILURE";

export const IMPORT_PRODUCTS = "ITEMS/IMPORT_PRODUCTS";
export const IMPORT_PRODUCTS_SUCCESS = "ITEMS/IMPORT_PRODUCTS_SUCCESS";
export const IMPORT_PRODUCTS_FAILURE = "ITEMS/IMPORT_PRODUCTS_FAILURE";

export const getItems = (organization_uuid) => ({ type: GET_ITEMS,organization_uuid, });

/**
 *Add Item
 * @param {Object} payload
 * @param {Object} history
 * @param {String} redirectTo
 */
export const addItem = (payload, history, redirectTo) => ({
  type: ADD_ITEMS,
  payload,
  history,
  redirectTo,
});
/**
 *
 * @param {Object} payload
 * @param {Object} history
 * @param {String} redirectTo
 */
export const editItem = (payload, history, redirectTo) => ({
  type: EDIT_ITEMS,
  payload,
  history,
  redirectTo,
});

/**
 *Delete Item entity
 * @param {{id}} payload
 * @param {{organization_uuid}} organization
 */
export const deleteItem = (itemId, organization_uuid) => ({
  type: DELETE_ITEMS,
  itemId,
  organization_uuid,
});

/**
 *
 * @param {String} searchItem
 * @param {Array} searchList
 */
export const searchItem = (searchItem, searchList, searchFields) => ({
  type: SEARCH,
  searchItem,
  searchList,
  searchFields,
});

export const getItemType = (organization_uuid) => ({
  type: GET_ITEMS_TYPE,
  organization_uuid,
});

export const getUnitsOfMeasure = () => ({
  type: GET_UNITS_OF_MEASURE,
});

export const getProducts = (organization_uuid) => ({
  type: GET_PRODUCTS,
  organization_uuid,
});

export const getProductType = (organization_uuid) => ({
  type: GET_PRODUCTS_TYPE,
  organization_uuid,
});

export const addItemType = (payload) => ({
  type: ADD_ITEMS_TYPE,
  payload,
});

export const editItemType = (payload) => ({
  type: EDIT_ITEMS_TYPE,
  payload,
});

export const deleteItemType = (id) => ({
  type: DELETE_ITEMS_TYPE,
  id,
});

export const addProduct = (payload) => ({
  type: ADD_PRODUCTS,
  payload,
});

export const editProduct = (payload) => ({
  type: EDIT_PRODUCTS,
  payload,
});

export const deleteProduct = (id) => ({
  type: DELETE_PRODUCTS,
  id,
});

export const addProductType = (payload) => ({
  type: ADD_PRODUCTS_TYPE,
  payload,
});

export const editProductType = (payload) => ({
  type: EDIT_PRODUCTS_TYPE,
  payload,
});

export const deleteProductType = (id) => ({
  type: DELETE_PRODUCTS_TYPE,
  id,
});

export const addUnitsOfMeasure = (payload) => ({
  type: ADD_UNITS_OF_MEASURE,
  payload,
});

export const editUnitsOfMeasure = (payload) => ({
  type: EDIT_UNITS_OF_MEASURE,
  payload,
});

export const deleteUnitsOfMeasure = (id) => ({
  type: DELETE_UNITS_OF_MEASURE,
  id,
});

export const importItems = (payload) => ({
  type: IMPORT_ITEMS,
  payload,
});

export const importProducts = (payload) => ({
  type: IMPORT_PRODUCTS,
  payload,
});