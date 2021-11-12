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
import uuid from 'uuid/v4';

const initialState = {
  view: 'table',
  products: [
    { id: 1, name: 'Project 1' },
    { id: 2, name: 'Project 2' },
    { id: 3, name: 'Project 3' },
  ],
  types: [
    { id: 1, value: 'sprint', name: 'Sprint' },
    { id: 2, value: 'release', name: 'Release' },
  ],
  status: [
    { id: 1, value: 'backlog', name: 'Backlog' },
    { id: 2, value: 'to-do', name: 'To-Do' },
    { id: 3, value: 'in-progress', name: 'In-Progess' },
    { id: 4, value: 'review', name: 'Review' },
    { id: 5, value: 'done', name: 'Done' },
  ],
  repos: [
    { projectID: 1, id: 1, name: 'buildly-react-template (Project 1)' },
    { projectID: 1, id: 2, name: 'buildly-core (Project 1)' },
    { projectID: 2, id: 3, name: 'buildly-react-template (Project 2)' },
    { projectID: 2, id: 4, name: 'buildly-core (Project 2)' },
  ],
  devs: [
    {
      projectID: 1, id: 1, value: 'dev1', name: 'Developer 1 (Project 1)',
    },
    {
      projectID: 1, id: 2, value: 'dev2', name: 'Developer 2 (Project 1)',
    },
    {
      projectID: 2, id: 3, value: 'dev3', name: 'Developer 3 (Project 2)',
    },
    {
      projectID: 2, id: 4, value: 'dev4', name: 'Developer 4 (Project 2)',
    },
  ],
  requirements: [
    {
      projectID: 1,
      id: uuid(),
      name: 'Requirements 1 (Project 1)',
      description: 'Description for Requirents 1 (Project 1)',
      priority: 'high',
      status: 'backlog',
      version: 1,
      decisions: [],
      issues: [],
      totalEstimate: '',
      tags: ['testing', 'documentation'],
    },
    {
      projectID: 1,
      id: uuid(),
      name: 'Requirements 2 (Project 1)',
      description: 'Description for Requirents 2 (Project 1)',
      priority: 'low',
      status: 'in-progress',
      version: 1,
      decisions: [],
      issues: [],
      totalEstimate: '10',
      tags: ['testing', 'bug'],
    },
    {
      projectID: 2,
      id: uuid(),
      name: 'Requirements 1 (Project 2)',
      description: 'Description for Requirents 1 (Project 2)',
      priority: 'medium',
      status: 'in-progress',
      version: 1,
      decisions: [],
      issues: [],
      totalEstimate: '15',
      tags: ['testing', 'bug'],
    },
    {
      projectID: 2,
      id: uuid(),
      name: 'Requirements 2 (Project 2)',
      description: 'Description for Requirents 2 (Project 2)',
      priority: 'urgent',
      status: 'done',
      version: 1,
      decisions: [],
      issues: [],
      totalEstimate: '15',
      tags: ['testing', 'bug'],
    },
  ],
  issues: [
    {
      id: uuid(),
      name: 'Issue 1 (Project 1)',
      description: 'Description for Issue 1 (Project 1)',
      repository: 'buildly-react-template (Project 1)',
      status: 'in-progress',
      projectID: 1,
      featureUUID: 1,
      estimate: '1',
      sprint: 1,
      tags: ['abc', 'def'],
      complexity: 1,
      issueType: 'backend',
      startDate: '2021-10-25 10:00:00',
      endDate: '2021-10-25 11:00:00',
      issueTrackerUUID: '1',
      assignedTo: '',
    },
    {
      id: uuid(),
      name: 'Issue 2 (Project 1)',
      description: 'Description for Issue 2 (Project 1)',
      repository: 'buildly-core (Project 1)',
      status: 'in-progress',
      projectID: 1,
      featureUUID: 1,
      estimate: '1',
      sprint: 1,
      tags: ['abc', 'def'],
      complexity: 1,
      issueType: 'backend',
      startDate: '2021-10-25 10:00:00',
      endDate: '2021-10-25 11:00:00',
      issueTrackerUUID: '1',
      assignedTo: 'dev1',
    },
    {
      id: uuid(),
      name: 'Issue 1 (Project 2)',
      description: 'Description for Issue 1 (Project 2)',
      repository: 'buildly-react-template (Project 2)',
      status: 'review',
      projectID: 1,
      featureUUID: 1,
      estimate: '1',
      sprint: 1,
      tags: ['abc', 'def'],
      complexity: 1,
      issueType: 'backend',
      startDate: '2021-10-25 10:00:00',
      endDate: '2021-10-25 11:00:00',
      issueTrackerUUID: '2',
      assignedTo: 'dev2',
    },
    {
      projectID: 2,
      id: uuid(),
      name: 'Issue 2 (Project 2)',
      description: 'Description for Issue 2 (Project 2)',
      repository: 'buildly-react-template (Project 2)',
      status: 'done',
      featureUUID: 1,
      estimate: '2',
      sprint: 1,
      tags: ['abc', 'def'],
      complexity: 1,
      issueType: 'backend',
      startDate: '2021-10-25 10:00:00',
      endDate: '2021-10-25 11:00:00',
      issueTrackerUUID: '2',
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
        (issue) => (issue.id !== action.id),
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
