export interface VivaQuestion {
  id: number;
  question: string;
  category: 'Java Core' | 'Swing GUI' | 'JDBC & MySQL' | 'Design Patterns';
  answer: string;
  followUp: string;
}

export interface TestCaseItem {
  id: string;
  testCase: string;
  inputData: string;
  expectedResult: string;
  status: 'passed' | 'pending';
}

export const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: 1,
    question: "What is JDBC and what are the main steps to connect Java to a database?",
    category: "JDBC & MySQL",
    answer: "JDBC (Java Database Connectivity) is a standard Java API that allows Java programs to interact with relational databases. The 5 key steps are: 1. Load the JDBC Driver (Class.forName('com.mysql.cj.jdbc.Driver')); 2. Establish Connection (DriverManager.getConnection(url, user, pass)); 3. Create a Statement or PreparedStatement; 4. Execute the SQL query (executeUpdate() or executeQuery()); 5. Process the ResultSet and close resources.",
    followUp: "In modern JDBC 4.0+, the driver can be loaded automatically via SPI, but explicit loading remains great practice in educational environments."
  },
  {
    id: 2,
    question: "Why did you use PreparedStatement instead of Statement in EmployeeDAO?",
    category: "JDBC & MySQL",
    answer: "PreparedStatement provides two major advantages: 1. Security: It protects against SQL Injection attacks because parameters are safely bound with placeholders (?) and escaped by the driver. 2. Performance: PreparedStatement pre-compiles the SQL query template on the database server, making repeated executions faster.",
    followUp: "Always use PreparedStatement whenever user input is included in SQL queries."
  },
  {
    id: 3,
    question: "What is the DAO (Data Access Object) design pattern, and why is it used?",
    category: "Design Patterns",
    answer: "The DAO pattern separates low-level data access logic (SQL queries, JDBC connections) from high-level business and user interface logic. EmployeeDAO isolates all SQL queries so that if we ever switch from MySQL to PostgreSQL or SQLite, the UI classes (DashboardFrame, EmployeeManagementPanel) do not require any changes.",
    followUp: "It adheres to the Single Responsibility Principle (SRP) in software engineering."
  },
  {
    id: 4,
    question: "What is the Swing Event Dispatch Thread (EDT) and why is SwingUtilities.invokeLater used?",
    category: "Swing GUI",
    answer: "Swing is not thread-safe. All GUI component creation, event handling, and painting operations must occur on a dedicated background thread called the Event Dispatch Thread (EDT). Calling SwingUtilities.invokeLater() queues the creation of DashboardFrame on the EDT, preventing graphical glitches and concurrency race conditions.",
    followUp: "Any long-running database task in production should ideally run on a SwingWorker to keep the UI responsive."
  },
  {
    id: 5,
    question: "What layout managers did you use and why avoid absolute positioning?",
    category: "Swing GUI",
    answer: "We used BorderLayout (for main screen framing: North, Center, South, West), GridBagLayout (for structured two-column form alignments with flexible resizing), and FlowLayout (for aligned button toolbars). Absolute positioning (null layout) was avoided because it breaks when running on different screen resolutions, operating systems, font scalings, or when the window is resized.",
    followUp: "Standard layout managers also ensure seamless visual editing inside Eclipse WindowBuilder."
  },
  {
    id: 6,
    question: "How does partial name searching work in the application?",
    category: "JDBC & MySQL",
    answer: "In EmployeeDAO.java, the search method constructs a parameterized query: 'SELECT * FROM employees WHERE full_name LIKE ?'. Before execution, we bind the query parameter with wildcards: stmt.setString(1, '%' + query.trim() + '%'). This enables MySQL to find any record containing the search string anywhere within the full_name field.",
    followUp: "The wildcards '%' represent zero or more characters in SQL."
  },
  {
    id: 7,
    question: "Why did you use try-with-resources in the DatabaseConnection and DAO methods?",
    category: "Java Core",
    answer: "Try-with-resources is a Java 7+ construct that automatically closes any object implementing java.lang.AutoCloseable (such as Connection, PreparedStatement, and ResultSet) when exiting the try block. This prevents resource exhaustion and connection leaks even if an exception occurs during query execution.",
    followUp: "It eliminates the need for bulky and error-prone finally blocks."
  },
  {
    id: 8,
    question: "How does the application prevent duplicate employee IDs?",
    category: "Java Core",
    answer: "There are two protective layers: 1. Database layer: The employees table defines 'employee_id' as the PRIMARY KEY, rejecting duplicates at the engine level. 2. Service layer: EmployeeService.validateEmployee() calls employeeDAO.getEmployeeById() before executing the INSERT. If an existing record is detected, it throws an IllegalArgumentException with a clear message.",
    followUp: "This prevents unhandled database crashes and provides pleasant user feedback."
  },
  {
    id: 9,
    question: "How does CardLayout work in DashboardFrame?",
    category: "Swing GUI",
    answer: "CardLayout treats each view as a 'card' stacked on top of one another inside a central container. When the user clicks sidebar navigation buttons (Dashboard, Manage Employees, Search Employees), cardLayout.show(contentPanel, 'MANAGE') displays the selected card instantly while keeping the sidebar fixed.",
    followUp: "It allows a multi-screen desktop application without opening cluttering multiple separate windows."
  },
  {
    id: 10,
    question: "What happens if MySQL server is offline when launching the app?",
    category: "JDBC & MySQL",
    answer: "The application handles SQLException gracefully. Rather than crashing, DatabaseConnection catches the connection failure or propagates a clean SQLException, and the UI displays a helpful JOptionPane dialog notifying the user: 'Unable to connect to MySQL database', advising them to check their local MySQL service.",
    followUp: "Technical stack traces are printed to System.err for debugging without exposing secrets."
  }
];

export const TEST_CASES: TestCaseItem[] = [
  {
    id: 'TC-01',
    testCase: 'Application Launch',
    inputData: 'Execute Main.java',
    expectedResult: 'Window opens centered (1100x720), dark navy sidebar visible, Nimbus styling applied.',
    status: 'passed'
  },
  {
    id: 'TC-02',
    testCase: 'Add Employee Valid Details',
    inputData: 'ID: EMP109, Name: Vikram Jain, Dept: Engineering, Sal: 75000, Date: 2024-04-10',
    expectedResult: 'Record saved to MySQL, success popup shown, table reloads, dashboard stats increment.',
    status: 'passed'
  },
  {
    id: 'TC-03',
    testCase: 'Duplicate Employee ID Validation',
    inputData: 'Attempt to add EMP101 (already existing)',
    expectedResult: 'Operation rejected with warning: "Employee ID EMP101 already exists."',
    status: 'passed'
  },
  {
    id: 'TC-04',
    testCase: 'Invalid Salary Validation',
    inputData: 'Salary: -5000 or "abc"',
    expectedResult: 'Validation error: "Salary must be a positive number greater than 0."',
    status: 'passed'
  },
  {
    id: 'TC-05',
    testCase: 'Email Format Validation',
    inputData: 'Email: "invalid-email-address"',
    expectedResult: 'Validation error: "Invalid Email Address format (example: name@domain.com)."',
    status: 'passed'
  },
  {
    id: 'TC-06',
    testCase: 'Phone Number Validation',
    inputData: 'Contact: "123" (less than 7 digits)',
    expectedResult: 'Validation error: "Invalid Contact Number. Please provide 7 to 15 digits."',
    status: 'passed'
  },
  {
    id: 'TC-07',
    testCase: 'Table Row Selection & Form Fill',
    inputData: 'Click on Priya Patel (EMP102) in JTable',
    expectedResult: 'All 8 input fields populate with EMP102 data; ID field becomes read-only.',
    status: 'passed'
  },
  {
    id: 'TC-08',
    testCase: 'Update Employee Details',
    inputData: 'Change salary of EMP102 from 62000 to 65000 and click Update',
    expectedResult: 'MySQL record updated, table refreshed, dashboard average salary recalculates.',
    status: 'passed'
  },
  {
    id: 'TC-09',
    testCase: 'Delete Employee with Confirmation',
    inputData: 'Select EMP108 and click Delete Record -> Click "Yes"',
    expectedResult: 'Confirmation dialog asks permission; record removed from DB; table refreshes.',
    status: 'passed'
  },
  {
    id: 'TC-10',
    testCase: 'Partial Name Search',
    inputData: 'Criteria: Employee Name, Query: "arav"',
    expectedResult: 'Table filters to show "Aarav Sharma" (EMP101).',
    status: 'passed'
  },
  {
    id: 'TC-11',
    testCase: 'Department Search',
    inputData: 'Criteria: Department, Query: "Finance"',
    expectedResult: 'Table shows all employees belonging to the Finance department.',
    status: 'passed'
  },
  {
    id: 'TC-12',
    testCase: 'Clear Form Button',
    inputData: 'Click "Clear Form" after selecting an employee',
    expectedResult: 'Form fields emptied, ID field unlocked; no database records altered.',
    status: 'passed'
  },
  {
    id: 'TC-13',
    testCase: 'About Dialog',
    inputData: 'Click "About" on sidebar',
    expectedResult: 'Dialog displays Garv Jangir, garvsharma0033@gmail.com, CODSOFT Java Programmer Track.',
    status: 'passed'
  }
];

export const INTERNSHIP_REPORT_MARKDOWN = `# CODSOFT INTERNSHIP PROJECT REPORT

## Project Title: Employee Management System
**Developer:** Garv Jangir  
**Email:** garvsharma0033@gmail.com  
**Organization:** CODSOFT  
**Domain:** Java Development Internship  
**Project Category:** Desktop Application (Java Swing & MySQL JDBC)  

---

### 1. ABSTRACT
The Employee Management System (EMS) is a standalone desktop application developed using core Java, Java Swing for the graphical user interface, and JDBC for relational database connectivity with MySQL. Designed to streamline corporate Human Resource operations, the application facilitates employee record creation, tracking, searching, updates, and deletion. It features an intuitive executive dashboard that computes operational statistics in real time.

---

### 2. PROBLEM STATEMENT
Manual employee record management using spreadsheets or physical ledgers often leads to data duplication, formatting inconsistencies, unauthorized manipulation, and slow retrieval speeds. Small and medium enterprises require an efficient, self-contained desktop system with strict input validation, relational database persistence, and rapid search capabilities.

---

### 3. OBJECTIVES
1. Design an ergonomic, user-friendly desktop interface using Java Swing.
2. Implement layered architecture using the Data Access Object (DAO) and Service patterns.
3. Secure relational data transactions using MySQL and parameterized JDBC PreparedStatements.
4. Provide comprehensive data validation (salary values, email formats, contact numbers, unique IDs).
5. Build an executive analytics dashboard displaying key operational metrics.

---

### 4. TECHNICAL ARCHITECTURE & STACK
- **Language:** Java SE (Standard Edition 17+)
- **GUI Framework:** Java Swing (JFrame, JPanel, CardLayout, JTable, DefaultTableModel, GridBagLayout)
- **Database Engine:** MySQL 8.x
- **Connectivity:** JDBC (MySQL Connector/J)
- **Design Pattern:** Layered MVC / DAO Architecture
- **IDE:** Eclipse IDE with WindowBuilder

---

### 5. SYSTEM MODULES
1. **Dashboard Module:** Summarizes Total Employees, Unique Departments, and Company-wide Average Salary, alongside a preview of recently onboarded personnel.
2. **Employee Records Management:** Form-driven interface supporting Add, Update, and Delete operations with selection synchronization with a scrollable JTable.
3. **Search & Filter Engine:** Parameterized query processor supporting partial text matching across ID, Name, Department, and Designation.
4. **Data Validation Engine:** Regular-expression-based verification for email, phone numbers, positive currency amounts, and primary key uniqueness.

---

### 6. CONCLUSION
The Employee Management System was successfully designed, developed, and verified as part of the CODSOFT Java Programmer Internship. The project demonstrates strong proficiency in Object-Oriented Programming (OOP), GUI component architecture, secure database transactions, and clean code principles.
`;
