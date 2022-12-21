export const AVAILABLE_USER_TYPES = [
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
  { value: 'New', text: 'Create new software from Scratch' },
  { value: 'Modify', text: 'Modify existing Software' },
  { value: 'Migration', text: 'Migrate Software from Legacy Application' },
];

export const INTEGRATION_TYPES = [
  { value: 'Login', text: 'Login/Authentication Service (Single Sign On or Social Auth)' },
  { value: 'ERP', text: 'ERP data system' },
  { value: 'HR', text: 'HR system' },
  { value: 'Accounting', text: 'Accounting/Bookeeping' },
  { value: 'Sales', text: 'Sales (SalesForce)' },
  { value: 'Other', text: 'Other' },
];

export const PRODUCT_TYPE = [
  { value: '', text: '---' },
  { value: 'B2C', text: 'B2C' },
  { value: 'B2B', text: 'B2B' },
  { value: 'B2B Internal', text: 'B2B Internal' },
  { value: 'B2C E-Commerce', text: 'B2C E-Commerce' },
];

export const EXPECTED_TRAFFIC = {
  B2C: [
    '1000 - 10000 a month',
    '10000 - 100000 a month',
    '100000 - 1000000 a month',
    '2.5 Billion a month - The next Amazon',
  ],
  B2B: [
    '100 - 1000 a month',
    '1000 - 10000 a month',
    '10000 - 100000 a month',
    '2.5 Million a month - I work at Apple',
  ],
  'B2C E-Commerce': [
    '1000 - 10000 a month',
    '10000 - 100000 a month',
    '100000 - 1000000 a month',
    '2.5 Billion a month - The next Amazon',
  ],
  'B2B Internal': [
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

export const ROLES = [
  { role: 'Lead engineer', count: 0 },
  { role: 'FrontEnd Engineer', count: 0 },
  { role: 'BackEnd Engineer', count: 0 },
  { role: 'QA/Test Engineer', count: 0 },
  { role: 'Product Owner', count: 0 },
  { role: 'Technical Project Manager', count: 0 },
  { role: 'Software Architect/CTO', count: 0 },
];
