export const PRIMARY_USERS = [
  'Customer 1',
  'Customer 2 (Power User)',
  'Administrator ( All powerfull, helpfull, etc. )',
];

export const BUSSINESS_SEGMENTS = [
  'Advertisement/Marketing',
  'Finance/Banking',
  'HR/People',
  'IT/Tech/Developers',
  'Education - Science',
  'Education - Teachers',
  'Education - Students',
  'Government/Politics',
  'Public/Non-Profit',
  'Other',
];

export const HOSTING = [
  'No Preference',
  'GCP',
  'AWS',
  'Digital Ocean',
  'Oracle Cloud',
  'Azure',
];

export const LANGUAGES = [
  'No Preference',
  'JavaScript',
  'Python',
  'Java',
  'C/CPP',
  'PHP',
  'Swift',
  'C#',
  'Ruby',
  'Objective – C',
  'SQL',
];

export const DATABASES = [
  'No Preference',
  'Postgres',
  'MySQL',
  'MongoDB',
];

export const STORAGES = [
  'No Preference',
  'AWS',
  'GCP',
  'Digital Ocean',
];

export const DEPLOYMENTS = [
  'No Preference',
  'AWS',
  'GCP',
  'Digital Ocean',
];

export const EXAMPLELIST = [
  'Example 1:  A general user will need to be able to see a list of products to buy and a shopping cart to put them in and the ability to pay for and have those items shipped.',
  "Example 2: An administrative user should be able to approve every user's access and level, as well as fix any problem for a general user that does not require direct access to the code or data.",
  'Example 3: A power user should be able to download a report of the previous quarters activity in the application with no more than 3 clicks.',
];

export const PRODUCT_SETUP = [
  { value: '', text: '--------------------------------' },
  { value: 'new', text: 'Create new software from Scratch' },
  { value: 'modify', text: 'Modify existing Software' },
  { value: 'migrate', text: 'Migrate Software from Legacy Application' },
];

export const INTEGRATION_TYPES = [
  { value: 'login', text: 'Login/Authentication Service (Single Sign On or Social Auth)' },
  { value: 'erp', text: 'ERP data system' },
  { value: 'hr', text: 'HR system' },
  { value: 'accounting', text: 'Accounting/Bookeeping' },
  { value: 'sales', text: 'Sales (SalesForce)' },
  { value: 'other', text: 'Other' },
];

export const PRODUCT_TYPE = [
  { value: '', text: '---' },
  { value: 'b2c', text: 'B2C' },
  { value: 'b2b', text: 'B2B' },
];

export const EXPECTED_TRAFFIC = {
  b2c: [
    '1000 - 10000 a month',
    '10000 - 100000 a month',
    '100000 - 1000000 a month',
    '2.5 Billion a month - The next Amazon',
  ],
  b2b: [
    '100 - 1000 a month',
    '1000 - 10000 a month',
    '10000 - 100000 a month',
    '2.5 Million a month - I work at Apple',
  ],
};

export const BUDGET_CATEGORY = [
  { value: 1, label: '10-15k' },
  { value: 2, label: '15-25k' },
  { value: 3, label: '25-35k' },
  { value: 4, label: '35-50k' },
  { value: 5, label: '50-100k' },
  { value: 6, label: '100-150k' },
  { value: 7, label: '150-200k' },
  { value: 8, label: '200-300k' },
  { value: 9, label: '300-500k' },
  { value: 10, label: '500k+' },
];
