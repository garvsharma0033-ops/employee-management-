package com.codsoft.employeemanagement;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class EmployeeDAO {

    public boolean addEmployee(Employee employee) throws SQLException {
        String sql = "INSERT INTO employees (employee_id, full_name, department, designation, salary, contact_number, email, date_of_joining) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, employee.getEmployeeId());
            stmt.setString(2, employee.getFullName());
            stmt.setString(3, employee.getDepartment());
            stmt.setString(4, employee.getDesignation());
            stmt.setDouble(5, employee.getSalary());
            stmt.setString(6, employee.getContactNumber());
            stmt.setString(7, employee.getEmail());
            stmt.setString(8, employee.getDateOfJoining());
            return stmt.executeUpdate() > 0;
        }
    }

    public List<Employee> getAllEmployees() throws SQLException {
        List<Employee> list = new ArrayList<>();
        String sql = "SELECT employee_id, full_name, department, designation, salary, contact_number, email, date_of_joining FROM employees ORDER BY employee_id ASC";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(extractEmployeeFromResultSet(rs));
            }
        }
        return list;
    }

    public Employee getEmployeeById(String employeeId) throws SQLException {
        String sql = "SELECT employee_id, full_name, department, designation, salary, contact_number, email, date_of_joining FROM employees WHERE employee_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, employeeId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return extractEmployeeFromResultSet(rs);
                }
            }
        }
        return null;
    }

    public boolean updateEmployee(Employee employee) throws SQLException {
        String sql = "UPDATE employees SET full_name = ?, department = ?, designation = ?, salary = ?, contact_number = ?, email = ?, date_of_joining = ? WHERE employee_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, employee.getFullName());
            stmt.setString(2, employee.getDepartment());
            stmt.setString(3, employee.getDesignation());
            stmt.setDouble(4, employee.getSalary());
            stmt.setString(5, employee.getContactNumber());
            stmt.setString(6, employee.getEmail());
            stmt.setString(7, employee.getDateOfJoining());
            stmt.setString(8, employee.getEmployeeId());
            return stmt.executeUpdate() > 0;
        }
    }

    public boolean deleteEmployee(String employeeId) throws SQLException {
        String sql = "DELETE FROM employees WHERE employee_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, employeeId);
            return stmt.executeUpdate() > 0;
        }
    }

    public List<Employee> searchEmployees(String query, String criteria) throws SQLException {
        List<Employee> list = new ArrayList<>();
        String column;
        switch (criteria.toLowerCase().trim()) {
            case "name":
            case "employee name":
            case "full name":
                column = "full_name";
                break;
            case "department":
                column = "department";
                break;
            case "designation":
                column = "designation";
                break;
            case "id":
            case "employee id":
            default:
                column = "employee_id";
                break;
        }

        String sql = "SELECT employee_id, full_name, department, designation, salary, contact_number, email, date_of_joining FROM employees WHERE " + column + " LIKE ? ORDER BY employee_id ASC";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, "%" + query.trim() + "%");
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    list.add(extractEmployeeFromResultSet(rs));
                }
            }
        }
        return list;
    }

    public int getTotalEmployees() throws SQLException {
        String sql = "SELECT COUNT(*) FROM employees";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) {
                return rs.getInt(1);
            }
        }
        return 0;
    }

    public int getTotalDepartments() throws SQLException {
        String sql = "SELECT COUNT(DISTINCT department) FROM employees";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) {
                return rs.getInt(1);
            }
        }
        return 0;
    }

    public double getAverageSalary() throws SQLException {
        String sql = "SELECT COALESCE(AVG(salary), 0.0) FROM employees";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) {
                return rs.getDouble(1);
            }
        }
        return 0.0;
    }

    public List<Employee> getRecentlyAddedEmployees(int limit) throws SQLException {
        List<Employee> list = new ArrayList<>();
        String sql = "SELECT employee_id, full_name, department, designation, salary, contact_number, email, date_of_joining FROM employees ORDER BY date_of_joining DESC LIMIT ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, limit);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    list.add(extractEmployeeFromResultSet(rs));
                }
            }
        }
        return list;
    }

    private Employee extractEmployeeFromResultSet(ResultSet rs) throws SQLException {
        return new Employee(
                rs.getString("employee_id"),
                rs.getString("full_name"),
                rs.getString("department"),
                rs.getString("designation"),
                rs.getDouble("salary"),
                rs.getString("contact_number"),
                rs.getString("email"),
                rs.getString("date_of_joining")
        );
    }
}
