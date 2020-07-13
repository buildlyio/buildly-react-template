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

//get item types action constants
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

export const GET_PRODUCTS_TYPE = "ITEM/GET_PRODUCTS_TYPE";
export const GET_PRODUCTS_TYPE_SUCCESS = "ITEMS/GET_PRODUCTS_TYPE_SUCCESS";
export const GET_PRODUCTS_TYPE_FAILURE = "ITEMS/GET_PRODUCTS_TYPE_FAILURE";

export const getItems = () => ({ type: GET_ITEMS });

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
 */
export const deleteItem = (itemId) => ({
  type: DELETE_ITEMS,
  itemId,
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

export const getItemType = () => ({
  type: GET_ITEMS_TYPE,
});

export const getUnitsOfMeasure = () => ({
  type: GET_UNITS_OF_MEASURE,
});

export const getProducts = () => ({
  type: GET_PRODUCTS,
});

export const getProductType = () => ({
  type: GET_PRODUCT_TYPE,
});
