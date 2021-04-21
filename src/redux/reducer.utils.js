import PropTypes from 'prop-types';

/**
* it will add the loaded element to the state
* @param state - the current state
* @param action - the returned action
* @returns {{data; dataLoaded: boolean}}
*/
export const addAll = (state, action) => ({ ...state, data: action.data, loaded: true });

/**
 * it inserts an item to the state if it does not exist
 * otherwise it will update the item with the passed action data
 * @param state - the current state
 * @param action - the returned action
 * @param {string} dataProp - property that stores the data
 * @param {string} idProp - unique identifier property to check if element exists
 * @returns {any}
 */
export const upsertOne = (state, action, idProp, dataProp) => {
  const dataObj = {};
  let updatedState = state;
  let dataArr = [];
  if (dataProp) {
    dataArr = state.data[dataProp];
  } else {
    dataArr = state.data;
  }
  if (Array.isArray(dataArr)) {
    // insert if item does not exist
    if (!dataArr.find((item) => item[idProp] === action.data[idProp])) {
      if (action.index) {
        const stateDataCopy = [...dataArr];
        stateDataCopy.splice(action.index, 0, action.data);
        if (dataProp) {
          dataObj[dataProp] = stateDataCopy;
          updatedState = {
            ...state, data: dataObj, loaded: true, created: true,
          };
        } else {
          updatedState = {
            ...state, data: stateDataCopy, loaded: true, created: true,
          };
        }
      } else if (dataProp) {
        dataObj[dataProp] = [...dataArr, action.data];
        updatedState = {
          ...state, data: dataObj, loaded: true, created: true,
        };
      } else {
        updatedState = {
          ...state, data: [...dataArr, action.data], loaded: true, created: true,
        };
      }
      return updatedState;
    } // update if item exists
    if (dataProp) {
      dataObj[dataProp] = dataArr.map((item) => {
        if (item[idProp] === action.data[idProp]) {
          return action.data;
        }
        return item;
      });
      return {
        ...updatedState, data: dataObj, loaded: true, updated: true,
      };
    }
    return {
      ...updatedState,
      data: dataArr.map((item) => {
        if (item[idProp] === action.data[idProp]) {
          return action.data;
        }
        return item;
      }),
      loaded: true,
      updated: true,
    };
  }
  if (!updatedState.data) {
    return { data: action.data, created: true, loaded: true };
  }
  return { data: action.data, updated: true };
};

upsertOne.propTypes = {
  idProp: PropTypes.string,
  dataProp: PropTypes.string,
};

/**
 * it deletes an from to the state if it does not exist otherwise it will return the curren state
 * @param state - the current state
 * @param action - the returned action
 * @param {string} idProp - unique identifier property to check if element exists
 * @param {string} dataProp - property that stores the data
 * @returns {any}
 */
export const deleteOne = (state, action, idProp, dataProp) => {
  const updatedState = state;
  const dataObj = {};
  let dataArr = [];
  if (dataProp) {
    dataArr = updatedState.data[dataProp].filter((item) => item[idProp] !== action.data[idProp]);
    dataObj[dataProp] = dataArr;
    return { ...updatedState, data: dataObj, deleted: true };
  }
  dataArr = updatedState.data.filter((item) => item[idProp] !== action.data[idProp]);
  return { ...updatedState, data: dataArr, deleted: true };
};

deleteOne.propTypes = {
  idProp: PropTypes.string,
  dataProp: PropTypes.string,
};

/**
 * updates nested data in one reducer only one level of nested data supported
 * @param state
 * @param action
 * @returns {{}}
 */
export const updateNested = (state, action) => {
  const updatedState = state;
  const parentIndex = updatedState.data.findIndex(
    (dataItem) => dataItem.id.toString() === action.data[action.nested.parent].toString(),
  );
  if (parentIndex !== -1) {
    updatedState.data[parentIndex][action.nested.key].forEach((item, index) => {
      if (item.id.toString() === action.data.id.toString()) {
        updatedState.data[parentIndex][action.nested.key][index] = action.data;
      }
      return updatedState;
    });
  }
  return { ...updatedState };
};

/**
 * inserts nested data in one reducer only one level of nested data supported
 * @param state
 * @param action
 * @returns {{}}
 */
export const addNested = (state, action) => {
  const updatedState = state;
  const parentIndex = updatedState.data.findIndex(
    (dataItem) => dataItem.id.toString() === action.data[action.nested.parent].toString(),
  );
  if (parentIndex !== -1) {
    updatedState.data[parentIndex][action.nested.key].push(action.data);
  } else {
    return updatedState;
  }
  return { ...updatedState };
};

/**
 * deletes nested data in one reducer only one level of nested data supported
 * @param state
 * @param action
 * @returns {{}}
 */
export const deleteNested = (state, action) => {
  const updatedState = state;
  if (action.nested) {
    const parentIndex = updatedState.data.findIndex(
      (dataItem) => dataItem.id.toString() === action.data[action.nested.parent].toString(),
    );
    if (parentIndex !== -1) {
      updatedState
        .data[parentIndex][action.nested.key] = updatedState.data[parentIndex][action.nested.key]
          .filter(
            (item) => item.id.toString() !== action.data.id.toString(),
          );
    }
    return { ...updatedState, deleted: true };
  }
  return updatedState;
};

/**
 * add all items from graphQl to redux reducer
 * @param state - the current state
 * @param action - the returned action
 * @returns {any}
 */
export const addFromGraphQl = (state, action, type) => {
  let updatedState = state;
  Object.keys(action.data).forEach((key) => {
    // eslint-disable-next-line no-underscore-dangle
    if (action.data[key].__typename === type) {
      const findItem = updatedState.data.find(
        (item) => (item.id).toString() === (action.data[key].id).toString(),
      );
      if (!findItem) {
        updatedState = { ...updatedState, data: [...updatedState.data, action.data[key]] };
      }
    }
  });

  return updatedState;
};

addFromGraphQl.propTypes = {
  type: PropTypes.string,
};

/**
 * it deletes one or more items from to the state if they exist in the state
 * @param state - the current state
 * @param action - the returned action
 * @returns {any}
 */
export const deleteMultiple = (state, action, idProp) => {
  const updatedState = state;
  return {
    ...updatedState,
    data: updatedState.data.filter(
      (item) => !action.data.find((element) => element[idProp] === item[idProp]),
    ),
    deleted: true,
  };
};

deleteMultiple.propTypes = {
  idProp: PropTypes.string,
};
