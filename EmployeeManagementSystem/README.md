# Employee Management System

A desktop application developed for the **CODSOFT Java Programmer Internship**.

- **Developer:** Garv Jangir
- **Email:** garvsharma0033@gmail.com
- **Organization:** CODSOFT
- **Technology Stack:** Java 17+, Java Swing (GUI), JDBC (Java Database Connectivity), MySQL Database, Eclipse IDE with WindowBuilder.

---

## 1. System Overview

The Employee Management System provides a desktop interface to perform core Human Resource and Employee record operations:
- **Dashboard Overview:** Displays live operational metrics (Total Employees, Total Departments, Average Salary) and a scrollable table of recently added employees.
- **Manage Employees:** Full CRUD (Create, Read, Update, Delete) operations with validation for salary values, email format, contact number, and unique employee IDs.
- **Search Employees:** Real-time query filtering across Employee ID, Employee Name (partial matching), Department, and Designation using parameterized SQL statements.
- **Database Persistence:** Robust JDBC integration using MySQL database `employee_management_db` with `PreparedStatement` to ensure security against SQL injection.

---

## 2. Project Directory Structure

```text
EmployeeManagementSystem/
├── src/
│   └── com/
│       └── codsoft/
│           └── employeemanagement/
│               ├── Main.java
│               ├── DatabaseConnection.java
│               ├── Employee.java
│               ├── EmployeeDAO.java
│               ├── EmployeeService.java
│               ├── DashboardFrame.java
│               └── EmployeeManagementPanel.java
├── database.sql
├── .project
├── .classpath
└── README.md
```

---

## 3. Database Setup (MySQL)

1. Open **MySQL Workbench** or MySQL Command Line Client.
2. Open and execute the `database.sql` script located in the project root:
   ```sql
   source /path/to/EmployeeManagementSystem/database.sql;
   ```
   Or execute the SQL commands directly:
   - Database: `employee_management_db`
   - Table: `employees` with columns `employee_id`, `full_name`, `department`, `designation`, `salary`, `contact_number`, `email`, `date_of_joining`.
3. Verify the 8 sample employee records are present:
   ```sql
   USE employee_management_db;
   SELECT * FROM employees;
   ```

---

## 4. Eclipse IDE Setup Instructions

### Step 1: Import Project into Eclipse
1. Launch **Eclipse IDE for Java Developers**.
2. Click **File** > **Open Projects from File System...**
3. Click **Directory...**, browse to `EmployeeManagementSystem`, and click **Finish**.

### Step 2: Add MySQL JDBC Driver
1. Download **MySQL Connector/J** (e.g., `mysql-connector-j-8.x.x.jar`) from [https://dev.mysql.com/downloads/connector/j/](https://dev.mysql.com/downloads/connector/j/) (select Platform Independent ZIP).
2. Extract the `.jar` file.
3. In Eclipse, right-click `EmployeeManagementSystem` in the **Package Explorer**.
4. Choose **Build Path** > **Configure Build Path...**
5. Select the **Libraries** tab.
6. Click **Classpath**, then click **Add External JARs...**
7. Select your downloaded `mysql-connector-j-8.x.x.jar` file and click **Apply and Close**.

### Step 3: Configure Database Credentials
Open `src/com/codsoft/employeemanagement/DatabaseConnection.java` and adjust `USER` and `PASSWORD` to match your local MySQL server setup:
```java
private static final String URL = "jdbc:mysql://localhost:3306/employee_management_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
private static final String USER = "root";       // Change if your MySQL user differs
private static final String PASSWORD = "password"; // Set your MySQL password
```

### Step 4: Run Application
1. In the Package Explorer, locate `src/com/codsoft/employeemanagement/Main.java`.
2. Right-click `Main.java` and select **Run As** > **Java Application**.
3. The Employee Management System window will open centered on your desktop screen.

---

## 5. Key Architecture Components

- **Employee.java:** Plain Old Java Object (POJO) encapsulating employee attributes.
- **DatabaseConnection.java:** Centralized JDBC driver loading and `Connection` factory.
- **EmployeeDAO.java:** Data Access Object executing parameterized SQL queries (`PreparedStatement`) with `try-with-resources` resource cleanup.
- **EmployeeService.java:** Business rules and validation engine (regex validation for emails, phone numbers, numeric limits, unique key constraint checking).
- **DashboardFrame.java:** Primary `JFrame` hosting the dark navy sidebar, metric cards, search card, and `CardLayout` navigation.
- **EmployeeManagementPanel.java:** Self-contained `JPanel` containing the input form, CRUD action triggers, and interactive `JTable`.
- **Main.java:** Bootstrapping class applying Nimbus look-and-feel and dispatching onto the Swing Event Dispatch Thread (`SwingUtilities.invokeLater`).

---

## 6. Author Information

- **Developer:** Garv Jangir
- **Email:** garvsharma0033@gmail.com
- **Internship:** CODSOFT Java Programmer Track
