CREATE DATABASE IF NOT EXISTS employee_management_db;
USE employee_management_db;

DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
    employee_id VARCHAR(50) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    salary DOUBLE NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    date_of_joining DATE NOT NULL,
    PRIMARY KEY (employee_id)
);

INSERT INTO employees (employee_id, full_name, department, designation, salary, contact_number, email, date_of_joining) VALUES
('EMP101', 'Aarav Sharma', 'Engineering', 'Senior Software Engineer', 85000.00, '+919876543210', 'aarav.sharma@codsoft.org', '2023-01-15'),
('EMP102', 'Priya Patel', 'Human Resources', 'HR Manager', 62000.00, '+919812345678', 'priya.patel@codsoft.org', '2023-03-20'),
('EMP103', 'Rohan Mehta', 'Engineering', 'Backend Developer', 72000.00, '+919734567890', 'rohan.mehta@codsoft.org', '2023-06-10'),
('EMP104', 'Ananya Verma', 'Finance', 'Financial Analyst', 68000.00, '+919654321098', 'ananya.verma@codsoft.org', '2023-08-01'),
('EMP105', 'Vikram Singh', 'Marketing', 'Digital Marketing Lead', 59000.00, '+919543210987', 'vikram.singh@codsoft.org', '2023-10-18'),
('EMP106', 'Neha Gupta', 'Quality Assurance', 'QA Automation Engineer', 55000.00, '+919432109876', 'neha.gupta@codsoft.org', '2024-01-05'),
('EMP107', 'Karan Malhotra', 'Engineering', 'DevOps Specialist', 78000.00, '+919321098765', 'karan.m@codsoft.org', '2024-02-14'),
('EMP108', 'Sneha Reddy', 'Operations', 'Operations Coordinator', 48000.00, '+919210987654', 'sneha.reddy@codsoft.org', '2024-03-01');
