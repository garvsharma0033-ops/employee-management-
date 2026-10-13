export interface EmployeeRecord {
  employeeId: string;
  fullName: string;
  department: string;
  designation: string;
  salary: number;
  contactNumber: string;
  email: string;
  dateOfJoining: string;
}

export const INITIAL_EMPLOYEES: EmployeeRecord[] = [
  {
    employeeId: 'EMP101',
    fullName: 'Aarav Sharma',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    salary: 85000,
    contactNumber: '+919876543210',
    email: 'aarav.sharma@codsoft.org',
    dateOfJoining: '2023-01-15'
  },
  {
    employeeId: 'EMP102',
    fullName: 'Priya Patel',
    department: 'Human Resources',
    designation: 'HR Manager',
    salary: 62000,
    contactNumber: '+919812345678',
    email: 'priya.patel@codsoft.org',
    dateOfJoining: '2023-03-20'
  },
  {
    employeeId: 'EMP103',
    fullName: 'Rohan Mehta',
    department: 'Engineering',
    designation: 'Backend Developer',
    salary: 72000,
    contactNumber: '+919734567890',
    email: 'rohan.mehta@codsoft.org',
    dateOfJoining: '2023-06-10'
  },
  {
    employeeId: 'EMP104',
    fullName: 'Ananya Verma',
    department: 'Finance',
    designation: 'Financial Analyst',
    salary: 68000,
    contactNumber: '+919654321098',
    email: 'ananya.verma@codsoft.org',
    dateOfJoining: '2023-08-01'
  },
  {
    employeeId: 'EMP105',
    fullName: 'Vikram Singh',
    department: 'Marketing',
    designation: 'Digital Marketing Lead',
    salary: 59000,
    contactNumber: '+919543210987',
    email: 'vikram.singh@codsoft.org',
    dateOfJoining: '2023-10-18'
  },
  {
    employeeId: 'EMP106',
    fullName: 'Neha Gupta',
    department: 'Quality Assurance',
    designation: 'QA Automation Engineer',
    salary: 55000,
    contactNumber: '+919432109876',
    email: 'neha.gupta@codsoft.org',
    dateOfJoining: '2024-01-05'
  },
  {
    employeeId: 'EMP107',
    fullName: 'Karan Malhotra',
    department: 'Engineering',
    designation: 'DevOps Specialist',
    salary: 78000,
    contactNumber: '+919321098765',
    email: 'karan.m@codsoft.org',
    dateOfJoining: '2024-02-14'
  },
  {
    employeeId: 'EMP108',
    fullName: 'Sneha Reddy',
    department: 'Operations',
    designation: 'Operations Coordinator',
    salary: 48000,
    contactNumber: '+919210987654',
    email: 'sneha.reddy@codsoft.org',
    dateOfJoining: '2024-03-01'
  }
];

export const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Finance',
  'Marketing',
  'Quality Assurance',
  'Operations',
  'Sales',
  'Legal',
  'Research & Development'
];
