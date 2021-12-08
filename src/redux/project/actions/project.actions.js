// Project Action types
export const SAVE_PRODUCT_FORM_DATA = 'PRODUCT/SAVE_PRODUCT_FORM_DATA';

export const GET_PRODUCTTEAMS = 'PROJECT_TOOL/GET_PRODUCTTEAMS';
export const GET_PRODUCTTEAMS_SUCCESS = 'PROJECT_TOOL/GET_PRODUCTTEAMS_SUCCESS';
export const GET_PRODUCTTEAMS_FAILURE = 'PROJECT_TOOL/GET_PRODUCTTEAMS_FAILURE';

export const ADD_PRODUCTTEAM = 'PROJECT_TOOL/ADD_PRODUCTTEAM';
export const ADD_PRODUCTTEAM_SUCCESS = 'PROJECT_TOOL/ADD_PRODUCTTEAM_SUCCESS';
export const ADD_PRODUCTTEAM_FAILURE = 'PROJECT_TOOL/ADD_PRODUCTTEAM_FAILURE';

export const UPDATE_PRODUCTTEAM = 'PROJECT_TOOL/UPDATE_PRODUCTTEAM';
export const UPDATE_PRODUCTTEAM_SUCCESS = 'PROJECT_TOOL/UPDATE_PRODUCTTEAM_SUCCESS';
export const UPDATE_PRODUCTTEAM_FAILURE = 'PROJECT_TOOL/UPDATE_PRODUCTTEAM_FAILURE';

export const DELETE_PRODUCTTEAM = 'PROJECT_TOOL/DELETE_PRODUCTTEAM';
export const DELETE_PRODUCTTEAM_SUCCESS = 'PROJECT_TOOL/DELETE_PRODUCTTEAM_SUCCESS';
export const DELETE_PRODUCTTEAM_FAILURE = 'PROJECT_TOOL/DELETE_PRODUCTTEAM_FAILURE';

export const GET_PRODUCTS = 'PROJECT_TOOL/GET_PRODUCTS';
export const GET_PRODUCTS_SUCCESS = 'PROJECT_TOOL/GET_PRODUCTS_SUCCESS';
export const GET_PRODUCTS_FAILURE = 'PROJECT_TOOL/GET_PRODUCTS_FAILURE';

export const ADD_PRODUCT = 'PROJECT_TOOL/ADD_PRODUCT';
export const ADD_PRODUCT_SUCCESS = 'PROJECT_TOOL/ADD_PRODUCT_SUCCESS';
export const ADD_PRODUCT_FAILURE = 'PROJECT_TOOL/ADD_PRODUCT_FAILURE';

export const UPDATE_PRODUCT = 'PROJECT_TOOL/UPDATE_PRODUCT';
export const UPDATE_PRODUCT_SUCCESS = 'PROJECT_TOOL/UPDATE_PRODUCT_SUCCESS';
export const UPDATE_PRODUCT_FAILURE = 'PROJECT_TOOL/UPDATE_PRODUCT_FAILURE';

export const DELETE_PRODUCT = 'PROJECT_TOOL/DELETE_PRODUCT';
export const DELETE_PRODUCT_SUCCESS = 'PROJECT_TOOL/DELETE_PRODUCT_SUCCESS';
export const DELETE_PRODUCT_FAILURE = 'PROJECT_TOOL/DELETE_PRODUCT_FAILURE';

export const GET_THIRDPARTYTOOLS = 'PROJECT_TOOL/GET_THIRDPARTYTOOLS';
export const GET_THIRDPARTYTOOLS_SUCCESS = 'PROJECT_TOOL/GET_THIRDPARTYTOOLS_SUCCESS';
export const GET_THIRDPARTYTOOLS_FAILURE = 'PROJECT_TOOL/GET_THIRDPARTYTOOLS_FAILURE';

export const ADD_THIRDPARTYTOOL = 'PROJECT_TOOL/ADD_THIRDPARTYTOOL';
export const ADD_THIRDPARTYTOOL_SUCCESS = 'PROJECT_TOOL/ADD_THIRDPARTYTOOL_SUCCESS';
export const ADD_THIRDPARTYTOOL_FAILURE = 'PROJECT_TOOL/ADD_THIRDPARTYTOOL_FAILURE';

export const UPDATE_THIRDPARTYTOOL = 'PROJECT_TOOL/UPDATE_THIRDPARTYTOOL';
export const UPDATE_THIRDPARTYTOOL_SUCCESS = 'PROJECT_TOOL/UPDATE_THIRDPARTYTOOL_SUCCESS';
export const UPDATE_THIRDPARTYTOOL_FAILURE = 'PROJECT_TOOL/UPDATE_THIRDPARTYTOOL_FAILURE';

export const DELETE_THIRDPARTYTOOL = 'PROJECT_TOOL/DELETE_THIRDPARTYTOOL';
export const DELETE_THIRDPARTYTOOL_SUCCESS = 'PROJECT_TOOL/DELETE_THIRDPARTYTOOL_SUCCESS';
export const DELETE_THIRDPARTYTOOL_FAILURE = 'PROJECT_TOOL/DELETE_THIRDPARTYTOOL_FAILURE';

export const GET_CREDENTIALS = 'PROJECT_TOOL/GET_CREDENTIALS';
export const GET_CREDENTIALS_SUCCESS = 'PROJECT_TOOL/GET_CREDENTIALS_SUCCESS';
export const GET_CREDENTIALS_FAILURE = 'PROJECT_TOOL/GET_CREDENTIALS_FAILURE';

export const ADD_CREDENTIAL = 'PROJECT_TOOL/ADD_CREDENTIAL';
export const ADD_CREDENTIAL_SUCCESS = 'PROJECT_TOOL/ADD_CREDENTIAL_SUCCESS';
export const ADD_CREDENTIAL_FAILURE = 'PROJECT_TOOL/ADD_CREDENTIAL_FAILURE';

export const UPDATE_CREDENTIAL = 'PROJECT_TOOL/UPDATE_CREDENTIAL';
export const UPDATE_CREDENTIAL_SUCCESS = 'PROJECT_TOOL/UPDATE_CREDENTIAL_SUCCESS';
export const UPDATE_CREDENTIAL_FAILURE = 'PROJECT_TOOL/UPDATE_CREDENTIAL_FAILURE';

export const DELETE_CREDENTIAL = 'PROJECT_TOOL/DELETE_CREDENTIAL';
export const DELETE_CREDENTIAL_SUCCESS = 'PROJECT_TOOL/DELETE_CREDENTIAL_SUCCESS';
export const DELETE_CREDENTIAL_FAILURE = 'PROJECT_TOOL/DELETE_CREDENTIAL_FAILURE';

export const GET_RELEASES = 'PROJECT_TOOL/GET_RELEASES';
export const GET_RELEASES_SUCCESS = 'PROJECT_TOOL/GET_RELEASES_SUCCESS';
export const GET_RELEASES_FAILURE = 'PROJECT_TOOL/GET_RELEASES_FAILURE';

export const ADD_RELEASE = 'PROJECT_TOOL/ADD_RELEASE';
export const ADD_RELEASE_SUCCESS = 'PROJECT_TOOL/ADD_RELEASE_SUCCESS';
export const ADD_RELEASE_FAILURE = 'PROJECT_TOOL/ADD_RELEASE_FAILURE';

export const UPDATE_RELEASE = 'PROJECT_TOOL/UPDATE_RELEASE';
export const UPDATE_RELEASE_SUCCESS = 'PROJECT_TOOL/UPDATE_RELEASE_SUCCESS';
export const UPDATE_RELEASE_FAILURE = 'PROJECT_TOOL/UPDATE_RELEASE_FAILURE';

export const DELETE_RELEASE = 'PROJECT_TOOL/DELETE_RELEASE';
export const DELETE_RELEASE_SUCCESS = 'PROJECT_TOOL/DELETE_RELEASE_SUCCESS';
export const DELETE_RELEASE_FAILURE = 'PROJECT_TOOL/DELETE_RELEASE_FAILURE';

/**
 * Save PRODUCT Form Data
 * @param {Object} formData
 */
 export const saveProductFormData = (formData) => ({
  type: SAVE_PRODUCT_FORM_DATA,
  formData,
});

/**
 * Get Product Teams
 * @param {String} organization_uuid
 * @param {String} product_team_uuid
 */
export const getProductteams = (organization_uuid, product_team_uuid) => (
  { type: GET_PRODUCTTEAMS, organization_uuid, product_team_uuid });

/**
 * Add Product Team
 * @param {Object} payload
 * @param {Object} history
 * @param {String} redirectTo
 */
export const addProductteam = (payload, history, redirectTo) => ({
  type: ADD_PRODUCTTEAM,
  payload,
  history,
  redirectTo,
});

/**
   * Update Product Team
   * @param {Object} payload
   * @param {Object} history
   * @param {String} redirectTo
   */
export const updateProductteam = (payload, history, redirectTo) => ({
  type: UPDATE_PRODUCTTEAM,
  payload,
  history,
  redirectTo,
});
  /**
   * Delete Product Team
   * @param {Number} product_team_uuid
   */
export const deleteProductteam = (
  product_team_uuid,
) => ({
  type: DELETE_PRODUCTTEAM,
  product_team_uuid,
});

/**
 * Get Products
 * @param {String} project_uuid
 */
export const getProducts = (organization_uuid, project_uuid) => ({
  type: GET_PRODUCTS, organization_uuid, project_uuid,
});

/**
  * Add Product
  * @param {Object} payload
  * @param {Object} history
  * @param {String} redirectTo
  */
export const addProduct = (payload, history, redirectTo) => ({
  type: ADD_PRODUCT,
  payload,
  history,
  redirectTo,
});

/**
    * Update Product
    * @param {Object} payload
    * @param {Object} history
    * @param {String} redirectTo
    */
export const updateProduct = (payload, history, redirectTo) => ({
  type: UPDATE_PRODUCT,
  payload,
  history,
  redirectTo,
});
/**
    * Delete Product
    * @param {Number} product_uuid
    */
export const deleteProduct = (
  product_uuid,
) => ({
  type: DELETE_PRODUCT,
  product_uuid,
});

/**
 * Get Thirdpartytools
 * @param {String} project_uuid
 */
export const getThirdpartytools = (project_uuid) => ({ type: GET_THIRDPARTYTOOLS, project_uuid });

/**
   * Add Thirdpartytool
   * @param {Object} payload
   * @param {Object} history
   * @param {String} redirectTo
   */
export const addThirdpartytool = (payload, history, redirectTo) => ({
  type: ADD_THIRDPARTYTOOL,
  payload,
  history,
  redirectTo,
});

/**
     * Update Thirdpartytool
     * @param {Object} payload
     * @param {Object} history
     * @param {String} redirectTo
     */
export const updateThirdpartytool = (payload, history, redirectTo) => ({
  type: UPDATE_THIRDPARTYTOOL,
  payload,
  history,
  redirectTo,
});
/**
     * Delete Thirdpartytool
     * @param {Number} thirdpartytool_uuid
     */
export const deleteThirdpartytool = (
  thirdpartytool_uuid,
) => ({
  type: DELETE_THIRDPARTYTOOL,
  thirdpartytool_uuid,
});

/**
 * Get Credentials
 * @param {String} thirdpartytool_uuid
 */
export const getCredentials = (thirdpartytool_uuid) => ({
  type: GET_CREDENTIALS, thirdpartytool_uuid,
});

/**
    * Add Credential
    * @param {Object} payload
    * @param {Object} history
    * @param {String} redirectTo
    */
export const addCredential = (payload, history, redirectTo) => ({
  type: ADD_CREDENTIAL,
  payload,
  history,
  redirectTo,
});

/**
      * Update Credential
      * @param {Object} payload
      * @param {Object} history
      * @param {String} redirectTo
      */
export const updateCredential = (payload, history, redirectTo) => ({
  type: UPDATE_CREDENTIAL,
  payload,
  history,
  redirectTo,
});
  /**
      * Delete Credential
      * @param {Number} credential_uuid
      */
export const deleteCredential = (
  credential_uuid,
) => ({
  type: DELETE_CREDENTIAL,
  credential_uuid,
});

/**
 * Get Credentials
 * @param {String} project_uuid
 */
export const getReleases = (project_uuid, release_uuid, dev_team_uuid) => ({
  type: GET_RELEASES, project_uuid, release_uuid, dev_team_uuid,
});

/**
    * Add Release
    * @param {Object} payload
    * @param {Object} history
    * @param {String} redirectTo
    */
export const addRelease = (payload, history, redirectTo) => ({
  type: ADD_RELEASE,
  payload,
  history,
  redirectTo,
});

/**
      * Update Release
      * @param {Object} payload
      * @param {Object} history
      * @param {String} redirectTo
      */
export const updateRelease = (payload, history, redirectTo) => ({
  type: UPDATE_RELEASE,
  payload,
  history,
  redirectTo,
});
  /**
      * Delete Release
      * @param {Number} release_uuid
      */
export const deleteRelease = (
  release_uuid,
) => ({
  type: DELETE_RELEASE,
  release_uuid,
});
