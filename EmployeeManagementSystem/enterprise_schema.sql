CREATE DATABASE IF NOT EXISTS enterprise_ems_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE enterprise_ems_db;

-- 1. ROLES & USERS (Spring Security RBAC)
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE COMMENT 'ROLE_ADMIN, ROLE_HR_MANAGER, ROLE_DEPT_LEAD, ROLE_EMPLOYEE',
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    account_non_locked BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_username (username),
    INDEX idx_user_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 2. DEPARTMENTS
CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    lead_employee_id VARCHAR(50) NULL,
    budget DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. EMPLOYEES DIRECTORY
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(50) PRIMARY KEY COMMENT 'e.g. EMP-1001',
    user_id BIGINT UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(25) NOT NULL,
    department_id BIGINT NOT NULL,
    designation VARCHAR(100) NOT NULL,
    employment_type ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN') NOT NULL DEFAULT 'FULL_TIME',
    status ENUM('ACTIVE', 'ON_LEAVE', 'PROBATION', 'TERMINATED') NOT NULL DEFAULT 'ACTIVE',
    date_of_joining DATE NOT NULL,
    date_of_birth DATE,
    base_salary DECIMAL(12, 2) NOT NULL,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(25),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_emp_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT fk_emp_dept FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE RESTRICT,
    INDEX idx_emp_dept (department_id),
    INDEX idx_emp_status (status),
    INDEX idx_emp_name (last_name, first_name)
) ENGINE=InnoDB;

-- 4. ATTENDANCE TRACKING
CREATE TABLE IF NOT EXISTS attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    attendance_date DATE NOT NULL,
    clock_in_time DATETIME NOT NULL,
    clock_out_time DATETIME NULL,
    work_hours DECIMAL(4, 2) NULL,
    status ENUM('PRESENT', 'LATE', 'HALF_DAY', 'REMOTE') NOT NULL DEFAULT 'PRESENT',
    ip_address VARCHAR(45),
    notes VARCHAR(255),
    CONSTRAINT fk_att_emp FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE,
    UNIQUE KEY uk_emp_attendance_date (employee_id, attendance_date),
    INDEX idx_att_date (attendance_date),
    INDEX idx_att_emp (employee_id)
) ENGINE=InnoDB;

-- 5. LEAVE REQUESTS & BALANCES
CREATE TABLE IF NOT EXISTS leave_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    leave_type ENUM('ANNUAL', 'SICK', 'CASUAL', 'MATERNITY', 'UNPAID') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_count INT NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    approved_by_user_id BIGINT NULL,
    decision_reason VARCHAR(255) NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    decided_at TIMESTAMP NULL,
    CONSTRAINT fk_leave_emp FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE,
    CONSTRAINT fk_leave_approver FOREIGN KEY (approved_by_user_id) REFERENCES users (id) ON DELETE SET NULL,
    INDEX idx_leave_status (status),
    INDEX idx_leave_emp (employee_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS leave_balances (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    fiscal_year INT NOT NULL,
    annual_leave_remaining INT NOT NULL DEFAULT 18,
    sick_leave_remaining INT NOT NULL DEFAULT 12,
    casual_leave_remaining INT NOT NULL DEFAULT 6,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_lb_emp FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE,
    UNIQUE KEY uk_emp_fiscal_year (employee_id, fiscal_year)
) ENGINE=InnoDB;

-- 6. PAYROLL & COMPENSATION STRUCTURE
CREATE TABLE IF NOT EXISTS payroll (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    payroll_month VARCHAR(7) NOT NULL COMMENT 'Format: YYYY-MM e.g. 2026-10',
    base_salary DECIMAL(12, 2) NOT NULL,
    hra_allowance DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    special_allowance DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    bonus DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    provident_fund DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    tax_deduction DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    net_salary DECIMAL(12, 2) NOT NULL,
    payment_status ENUM('DRAFT', 'PROCESSED', 'PAID') NOT NULL DEFAULT 'DRAFT',
    payment_date DATE NULL,
    pdf_payslip_url VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payroll_emp FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE,
    UNIQUE KEY uk_emp_month (employee_id, payroll_month),
    INDEX idx_payroll_month (payroll_month)
) ENGINE=InnoDB;

-- SEED DATA
INSERT INTO roles (name, description) VALUES
('ROLE_ADMIN', 'System Administrator with full access'),
('ROLE_HR_MANAGER', 'Human Resources Manager with employee & payroll access'),
('ROLE_DEPT_LEAD', 'Department Lead with approval access over team'),
('ROLE_EMPLOYEE', 'Standard Employee self-service access');

INSERT INTO departments (code, name, budget) VALUES
('ENG', 'Software Engineering', 500000.00),
('HR', 'Human Resources', 120000.00),
('FIN', 'Finance & Accounting', 180000.00),
('MKT', 'Product Marketing', 150000.00);

INSERT INTO users (username, email, password_hash) VALUES
('admin', 'admin@enterprise.io', '$2a$10$wK1mH0Jz5vTqY8pD0x/vQe6r5uE4wT1p3b9a7c5e1g3i5k7m9o1q'),
('hrmanager', 'hr@enterprise.io', '$2a$10$wK1mH0Jz5vTqY8pD0x/vQe6r5uE4wT1p3b9a7c5e1g3i5k7m9o1q'),
('techlead', 'lead@enterprise.io', '$2a$10$wK1mH0Jz5vTqY8pD0x/vQe6r5uE4wT1p3b9a7c5e1g3i5k7m9o1q'),
('aarav', 'aarav.sharma@enterprise.io', '$2a$10$wK1mH0Jz5vTqY8pD0x/vQe6r5uE4wT1p3b9a7c5e1g3i5k7m9o1q');

INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- admin -> ROLE_ADMIN
(2, 2), -- hrmanager -> ROLE_HR_MANAGER
(3, 3), -- techlead -> ROLE_DEPT_LEAD
(4, 4); -- aarav -> ROLE_EMPLOYEE

INSERT INTO employees (id, user_id, first_name, last_name, email, phone, department_id, designation, base_salary, date_of_joining) VALUES
('EMP-1001', 4, 'Aarav', 'Sharma', 'aarav.sharma@enterprise.io', '+1-555-0101', 1, 'Senior Backend Engineer', 96000.00, '2023-01-15'),
('EMP-1002', 2, 'Priya', 'Patel', 'hr@enterprise.io', '+1-555-0102', 2, 'HR Operations Lead', 78000.00, '2023-03-20'),
('EMP-1003', 3, 'David', 'Kowalski', 'lead@enterprise.io', '+1-555-0103', 1, 'Engineering Lead', 120000.00, '2022-08-10'),
('EMP-1004', NULL, 'Elena', 'Rostova', 'elena.r@enterprise.io', '+1-555-0104', 3, 'Senior Financial Controller', 89000.00, '2023-09-01'),
('EMP-1005', NULL, 'Marcus', 'Chen', 'marcus.c@enterprise.io', '+1-555-0105', 4, 'Growth Marketing Manager', 82000.00, '2024-02-01');

INSERT INTO leave_balances (employee_id, fiscal_year, annual_leave_remaining, sick_leave_remaining, casual_leave_remaining) VALUES
('EMP-1001', 2026, 15, 10, 5),
('EMP-1002', 2026, 18, 12, 6),
('EMP-1003', 2026, 12, 11, 4),
('EMP-1004', 2026, 16, 12, 6),
('EMP-1005', 2026, 17, 10, 5);

INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, days_count, reason, status) VALUES
('EMP-1001', 'ANNUAL', '2026-10-20', '2026-10-23', 4, 'Family annual vacation trip', 'PENDING'),
('EMP-1004', 'SICK', '2026-10-05', '2026-10-06', 2, 'Seasonal viral recovery', 'APPROVED');
