import _ from 'lodash';
import {
  ADD_REQUIREMENT,
  EDIT_REQUIREMENT,
  DELETE_REQUIREMENT,
  ADD_ISSUE,
  EDIT_ISSUE,
  DELETE_ISSUE,
  CONVERT_ISSUE,
} from '@redux/dashboard/actions/dashboard.actions';

const initialState = {
  projects: [
    { id: 1, name: 'Project 1'},
    { id: 2, name: 'Project 2'},
    { id: 3, name: 'Project 3'},
  ],
  types: [
    { id: 1, value: 'sprint', name: 'Sprint'},
    { id: 2, value: 'release', name: 'Release'},
  ],
  status: [
    { id: 1, value: 'created', name: 'Created'},
    { id: 2, value: 'assigned', name: 'Assigned'},
    { id: 3, value: 'in-progress', name: 'In-Progess'},
    { id: 4, value: 'completed', name: 'Completed'},
  ],
  repos: [
    { projId: 1, id: 1, name: 'buildly-react-template (Project 1)'},
    { projId: 1, id: 2, name: 'buildly-core (Project 1)'},
    { projId: 2, id: 3, name: 'buildly-react-template (Project 2)'},
    { projId: 2, id: 4, name: 'buildly-core (Project 2)'},
  ],
  devs: [
    { projId: 1, id: 1, value: 'dev1', name: 'Developer 1 (Project 1)'},
    { projId: 1, id: 2, value: 'dev2', name: 'Developer 2 (Project 1)'},
    { projId: 2, id: 3, value: 'dev3', name: 'Developer 3 (Project 2)'},
    { projId: 2, id: 4, value: 'dev4', name: 'Developer 4 (Project 2)'},
  ],
  requirements: [
    {
      projId: 1,
      id: 1,
      title: 'Requirements 1 (Project 1)',
      description: 'Description for Requirents 1 (Project 1)',
    },
    {
      projId: 1,
      id: 2,
      title: 'Requirements 2 (Project 1)',
      description: 'Description for Requirents 2 (Project 1)',
    },
    {
      projId: 2,
      id: 3,
      title: 'Requirements 1 (Project 2)',
      description: 'Description for Requirents 1 (Project 2)',
    },
    {
      projId: 2,
      id: 4,
      title: 'Requirements 2 (Project 2)',
      description: 'Description for Requirents 2 (Project 2)',
    },
  ],
  issues: [
    {
      projId: 1,
      id: 1,
      title: 'Issue 1 (Project 1)',
      description: 'Description for Issue 1 (Project 1)',
      type: 'sprint',
      repo: 'buildly-react-template (Project 1)',
      status: 'created',
      assignedTo: '',
    },
    {
      projId: 1,
      id: 2,
      title: 'Issue 2 (Project 1)',
      description: 'Description for Issue 2 (Project 1)',
      type: 'release',
      repo: 'buildly-core (Project 1)',
      status: 'in-progress',
      assignedTo: 'dev1',
    },
    {
      projId: 2,
      id: 3,
      title: 'Issue 1 (Project 2)',
      description: 'Description for Issue 1 (Project 2)',
      type: 'sprint',
      repo: 'buildly-react-template (Project 2)',
      status: 'assigned',
      assignedTo: 'dev2',
    },
    {
      projId: 2,
      id: 4,
      title: 'Issue 2 (Project 2)',
      description: 'Description for Issue 2 (Project 2)',
      type: 'sprint',
      repo: 'buildly-core (Project 2)',
      status: 'completed',
      assignedTo: 'dev3',
    },
  ],
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_REQUIREMENT:
      return {
        ...state,
        requirements: [...state.requirements, action.data],
      };

    case EDIT_REQUIREMENT: {
      let editData = _.filter(
        state.requirements,
        (req) => (req.id !== action.data.id),
      );
      editData = [...editData, action.data];
      return {
        ...state,
        requirements: editData,
      };
    }

    case DELETE_REQUIREMENT: {
      const deleteData = _.filter(
        state.requirements,
        (req) => (req.id !== action.id),
      );
      return {
        ...state,
        requirements: deleteData,
      };
    }

    case ADD_ISSUE:
      return {
        ...state,
        issues: [...state.issues, action.data],
      };

    case EDIT_ISSUE: {
      let editData = _.filter(
        state.issues,
        (issue) => (issue.id !== action.data.id),
      );
      editData = [...editData, action.data];
      return {
        ...state,
        issues: editData,
      };
    }

    case DELETE_ISSUE: {
      const deleteData = _.filter(
        state.issues,
        (req) => (issue.id !== action.id),
      );
      return {
        ...state,
        issues: deleteData,
      };
    }

    case CONVERT_ISSUE: {
      const deleteData = _.filter(
        state.requirements,
        (req) => (req.id !== action.reqId),
      );
      return {
        ...state,
        requirements: deleteData,
        issues: [...state.issues, action.data],
      };
    }
    default:
      return state;
  }
};
