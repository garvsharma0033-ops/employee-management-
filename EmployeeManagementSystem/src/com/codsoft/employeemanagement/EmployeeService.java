package com.codsoft.employeemanagement;

import java.sql.SQLException;
import java.util.List;
import java.util.regex.Pattern;

public class EmployeeService {

    private final EmployeeDAO employeeDAO;
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\+?[0-9]{7,15}$");
    private static final Pattern DATE_PATTERN = Pattern.compile("^\\d{4}-\\d{2}-\\d{2}$");

    public EmployeeService() {
        this.employeeDAO = new EmployeeDAO();
    }

    public EmployeeService(EmployeeDAO employeeDAO) {
        this.employeeDAO = employeeDAO;
    }

    public void validateEmployee(Employee employee, boolean isNew) throws IllegalArgumentException, SQLException {
        if (employee == null) {
            throw new IllegalArgumentException("Employee details cannot be empty.");
        }

        if (employee.getEmployeeId() == null || employee.getEmployeeId().trim().isEmpty()) {
            throw new IllegalArgumentException("Employee ID is required.");
        }

        if (isNew) {
            Employee existing = employeeDAO.getEmployeeById(employee.getEmployeeId().trim());
            if (existing != null) {
                throw new IllegalArgumentException("Employee ID '" + employee.getEmployeeId() + "' already exists.");
            }
        }

        if (employee.getFullName() == null || employee.getFullName().trim().isEmpty()) {
            throw new IllegalArgumentException("Full Name is required.");
        }

        if (employee.getDepartment() == null || employee.getDepartment().trim().isEmpty()) {
            throw new IllegalArgumentException("Department is required.");
        }

        if (employee.getDesignation() == null || employee.getDesignation().trim().isEmpty()) {
            throw new IllegalArgumentException("Designation is required.");
        }

        if (employee.getSalary() <= 0) {
            throw new IllegalArgumentException("Salary must be a positive number greater than 0.");
        }

        if (employee.getContactNumber() == null || !PHONE_PATTERN.matcher(employee.getContactNumber().trim()).matches()) {
            throw new IllegalArgumentException("Invalid Contact Number. Please provide 7 to 15 digits.");
        }

        if (employee.getEmail() == null || !EMAIL_PATTERN.matcher(employee.getEmail().trim()).matches()) {
            throw new IllegalArgumentException("Invalid Email Address format (example: name@domain.com).");
        }

        if (employee.getDateOfJoining() == null || !DATE_PATTERN.matcher(employee.getDateOfJoining().trim()).matches()) {
            throw new IllegalArgumentException("Date of Joining must be in YYYY-MM-DD format (example: 2024-01-15).");
        }
    }

    public boolean addEmployee(Employee employee) throws SQLException, IllegalArgumentException {
        validateEmployee(employee, true);
        return employeeDAO.addEmployee(employee);
    }

    public boolean updateEmployee(Employee employee) throws SQLException, IllegalArgumentException {
        validateEmployee(employee, false);
        return employeeDAO.updateEmployee(employee);
    }

    public boolean deleteEmployee(String employeeId) throws SQLException, IllegalArgumentException {
        if (employeeId == null || employeeId.trim().isEmpty()) {
            throw new IllegalArgumentException("Please select an employee to delete.");
        }
        return employeeDAO.deleteEmployee(employeeId.trim());
    }

    public List<Employee> getAllEmployees() throws SQLException {
        return employeeDAO.getAllEmployees();
    }

    public Employee getEmployeeById(String employeeId) throws SQLException {
        if (employeeId == null || employeeId.trim().isEmpty()) {
            return null;
        }
        return employeeDAO.getEmployeeById(employeeId.trim());
    }

    public List<Employee> searchEmployees(String query, String criteria) throws SQLException {
        if (query == null || query.trim().isEmpty()) {
            return employeeDAO.getAllEmployees();
        }
        return employeeDAO.searchEmployees(query.trim(), criteria);
    }

    public int getTotalEmployees() throws SQLException {
        return employeeDAO.getTotalEmployees();
    }

    public int getTotalDepartments() throws SQLException {
        return employeeDAO.getTotalDepartments();
    }

    public double getAverageSalary() throws SQLException {
        return employeeDAO.getAverageSalary();
    }

    public List<Employee> getRecentlyAddedEmployees(int limit) throws SQLException {
        return employeeDAO.getRecentlyAddedEmployees(limit);
    }
}
