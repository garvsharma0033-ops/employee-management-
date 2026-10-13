export interface ProjectFile {
  name: string;
  path: string;
  category: 'java' | 'sql' | 'config' | 'doc';
  description: string;
  explanation: string;
  content: string;
}

export const PROJECT_FILES: ProjectFile[] = [
  {
    name: 'Main.java',
    path: 'src/com/codsoft/employeemanagement/Main.java',
    category: 'java',
    description: 'Application entry point that configures Swing Look and Feel and launches the GUI.',
    explanation: 'Main is the starting execution point of the Java desktop application. It searches the system for modern Look and Feel options (such as Nimbus) to ensure crisp rendering on contemporary high-DPI displays, and gracefully falls back to the native OS Look and Feel. It uses SwingUtilities.invokeLater to ensure the GUI is built strictly on the Event Dispatch Thread (EDT), following Java Swing thread-safety rules.',
    content: `package com.codsoft.employeemanagement;

import javax.swing.SwingUtilities;
import javax.swing.UIManager;

public class Main {

    public static void main(String[] args) {
        try {
            for (UIManager.LookAndFeelInfo info : UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (Exception e) {
            try {
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
            } catch (Exception ignored) {
            }
        }

        SwingUtilities.invokeLater(() -> {
            DashboardFrame frame = new DashboardFrame();
            frame.setVisible(true);
        });
    }
}`
  },
  {
    name: 'Employee.java',
    path: 'src/com/codsoft/employeemanagement/Employee.java',
    category: 'java',
    description: 'POJO model class encapsulating all employee fields with getters and setters.',
    explanation: 'Employee is a Plain Old Java Object (POJO) representing the employee domain model. It encapsulates private attributes: employeeId, fullName, department, designation, salary, contactNumber, email, and dateOfJoining. It provides default and full-argument constructors, public getter and setter methods for encapsulation, and overrides toString() for debugging. It strictly contains no comments inside the code.',
    content: `package com.codsoft.employeemanagement;

public class Employee {
    private String employeeId;
    private String fullName;
    private String department;
    private String designation;
    private double salary;
    private String contactNumber;
    private String email;
    private String dateOfJoining;

    public Employee() {
    }

    public Employee(String employeeId, String fullName, String department, String designation, 
                    double salary, String contactNumber, String email, String dateOfJoining) {
        this.employeeId = employeeId;
        this.fullName = fullName;
        this.department = department;
        this.designation = designation;
        this.salary = salary;
        this.contactNumber = contactNumber;
        this.email = email;
        this.dateOfJoining = dateOfJoining;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public double getSalary() {
        return salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDateOfJoining() {
        return dateOfJoining;
    }

    public void setDateOfJoining(String dateOfJoining) {
        this.dateOfJoining = dateOfJoining;
    }

    @Override
    public String toString() {
        return "Employee{" +
                "employeeId='" + employeeId + '\'' +
                ", fullName='" + fullName + '\'' +
                ", department='" + department + '\'' +
                ", designation='" + designation + '\'' +
                ", salary=" + salary +
                ", contactNumber='" + contactNumber + '\'' +
                ", email='" + email + '\'' +
                ", dateOfJoining='" + dateOfJoining + '\'' +
                '}';
    }
}`
  },
  {
    name: 'DatabaseConnection.java',
    path: 'src/com/codsoft/employeemanagement/DatabaseConnection.java',
    category: 'java',
    description: 'Centralized singleton JDBC database connection factory for MySQL.',
    explanation: 'DatabaseConnection establishes communication between the Java runtime and the MySQL server using JDBC. It loads the modern MySQL Connector/J driver (com.mysql.cj.jdbc.Driver) via a static initialization block. It exposes a public static getConnection() method that creates database connections using configurable URL, user, and password constants, and a testConnection() utility for diagnostics.',
    content: `package com.codsoft.employeemanagement;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {

    private static final String URL = "jdbc:mysql://localhost:3306/employee_management_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASSWORD = "password";

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("MySQL JDBC Driver not found: " + e.getMessage());
        }
    }

    private DatabaseConnection() {
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

    public static boolean testConnection() {
        try (Connection conn = getConnection()) {
            return conn != null && !conn.isClosed();
        } catch (SQLException e) {
            System.err.println("Database connection test failed: " + e.getMessage());
            return false;
        }
    }
}`
  },
  {
    name: 'EmployeeDAO.java',
    path: 'src/com/codsoft/employeemanagement/EmployeeDAO.java',
    category: 'java',
    description: 'Data Access Object executing parameterized SQL statements with PreparedStatement.',
    explanation: 'EmployeeDAO implements the Data Access Object (DAO) pattern to decouple database queries from the presentation layer. It handles addEmployee, getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee, and searchEmployees. Furthermore, it supplies analytical aggregation queries (getTotalEmployees, getTotalDepartments, getAverageSalary, getRecentlyAddedEmployees) for the dashboard. All queries utilize PreparedStatement to prevent SQL injection and try-with-resources to ensure connections and result sets close automatically.',
    content: `package com.codsoft.employeemanagement;

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
}`
  },
  {
    name: 'EmployeeService.java',
    path: 'src/com/codsoft/employeemanagement/EmployeeService.java',
    category: 'java',
    description: 'Service layer validating business constraints (uniqueness, formats, positive salary).',
    explanation: 'EmployeeService acts as the intermediate layer between UI controllers and the DAO. It verifies all required business rules before executing database calls: checking non-empty mandatory attributes, ensuring uniqueness of employee ID for new additions, rejecting non-positive salaries, validating email format with a standard RFC regex, validating phone number length, and enforcing YYYY-MM-DD date formatting.',
    content: `package com.codsoft.employeemanagement;

import java.sql.SQLException;
import java.util.List;
import java.util.regex.Pattern;

public class EmployeeService {

    private final EmployeeDAO employeeDAO;
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\\\+?[0-9]{7,15}$");
    private static final Pattern DATE_PATTERN = Pattern.compile("^\\\\d{4}-\\\\d{2}-\\\\d{2}$");

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
}`
  },
  {
    name: 'DashboardFrame.java',
    path: 'src/com/codsoft/employeemanagement/DashboardFrame.java',
    category: 'java',
    description: 'Main application JFrame featuring the navy sidebar, KPI cards, and CardLayout.',
    explanation: 'DashboardFrame creates the primary top-level window. It is styled with a dark navy blue sidebar (#0F172A) on the west side and a light workspace canvas (#F8FAFC) on the center. Navigation between Dashboard, Manage Employees, and Search Employees is handled dynamically via CardLayout. The dashboard tab contains 3 key performance metric cards (Total Employees, Total Departments, Average Salary) and a scrollable table of recently added employees. It also provides the CODSOFT About dialog and a confirmed Exit sequence.',
    content: `package com.codsoft.employeemanagement;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.sql.SQLException;
import java.text.DecimalFormat;
import java.util.List;

public class DashboardFrame extends JFrame {

    private final EmployeeService employeeService;

    private JPanel contentPanel;
    private CardLayout cardLayout;

    private JLabel lblTotalEmployees;
    private JLabel lblTotalDepartments;
    private JLabel lblAverageSalary;
    private DefaultTableModel recentTableModel;

    private EmployeeManagementPanel managementPanel;

    private JTextField txtSearchQuery;
    private JComboBox<String> cbSearchCriteria;
    private DefaultTableModel searchTableModel;
    private JTable searchTable;

    private JButton btnNavDashboard;
    private JButton btnNavManage;
    private JButton btnNavSearch;
    private JButton btnNavAbout;
    private JButton btnNavExit;

    private final DecimalFormat currencyFormat = new DecimalFormat("$#,##0.00");

    public DashboardFrame() {
        this.employeeService = new EmployeeService();
        initializeFrame();
        refreshDashboardData();
    }

    private void initializeFrame() {
        setTitle("Employee Management System");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1100, 720);
        setMinimumSize(new Dimension(950, 600));
        setLocationRelativeTo(null);

        JPanel rootContainer = new JPanel(new BorderLayout());
        rootContainer.setBackground(new Color(248, 250, 252));

        JPanel sidebar = createSidebar();
        rootContainer.add(sidebar, BorderLayout.WEST);

        cardLayout = new CardLayout();
        contentPanel = new JPanel(cardLayout);
        contentPanel.setBackground(new Color(248, 250, 252));

        JPanel dashboardView = createDashboardView();
        managementPanel = new EmployeeManagementPanel(employeeService, this::refreshDashboardData);
        JPanel searchView = createSearchView();

        contentPanel.add(dashboardView, "DASHBOARD");
        contentPanel.add(managementPanel, "MANAGE");
        contentPanel.add(searchView, "SEARCH");

        rootContainer.add(contentPanel, BorderLayout.CENTER);

        setContentPane(rootContainer);
    }

    private JPanel createSidebar() {
        JPanel sidebar = new JPanel();
        sidebar.setPreferredSize(new Dimension(240, 720));
        sidebar.setBackground(new Color(15, 23, 42));
        sidebar.setLayout(new BorderLayout());

        JPanel brandPanel = new JPanel(new GridLayout(2, 1, 0, 4));
        brandPanel.setOpaque(false);
        brandPanel.setBorder(new EmptyBorder(25, 20, 25, 20));

        JLabel lblBrandTitle = new JLabel("CODSOFT EMS");
        lblBrandTitle.setFont(new Font("SansSerif", Font.BOLD, 18));
        lblBrandTitle.setForeground(Color.WHITE);

        JLabel lblBrandSubtitle = new JLabel("Garv Jangir · Java Edition");
        lblBrandSubtitle.setFont(new Font("SansSerif", Font.PLAIN, 12));
        lblBrandSubtitle.setForeground(new Color(148, 163, 184));

        brandPanel.add(lblBrandTitle);
        brandPanel.add(lblBrandSubtitle);

        sidebar.add(brandPanel, BorderLayout.NORTH);

        JPanel navList = new JPanel();
        navList.setLayout(new BoxLayout(navList, BoxLayout.Y_AXIS));
        navList.setOpaque(false);
        navList.setBorder(new EmptyBorder(10, 12, 10, 12));

        btnNavDashboard = createSidebarButton("Dashboard");
        btnNavManage = createSidebarButton("Manage Employees");
        btnNavSearch = createSidebarButton("Search Employees");
        btnNavAbout = createSidebarButton("About");
        btnNavExit = createSidebarButton("Exit");

        navList.add(btnNavDashboard);
        navList.add(Box.createRigidArea(new Dimension(0, 8)));
        navList.add(btnNavManage);
        navList.add(Box.createRigidArea(new Dimension(0, 8)));
        navList.add(btnNavSearch);
        navList.add(Box.createRigidArea(new Dimension(0, 8)));
        navList.add(btnNavAbout);
        navList.add(Box.createRigidArea(new Dimension(0, 8)));
        navList.add(btnNavExit);

        sidebar.add(navList, BorderLayout.CENTER);

        JPanel footerPanel = new JPanel(new BorderLayout());
        footerPanel.setOpaque(false);
        footerPanel.setBorder(new EmptyBorder(15, 20, 20, 20));

        JLabel lblVersion = new JLabel("Status: Active Database");
        lblVersion.setFont(new Font("SansSerif", Font.PLAIN, 11));
        lblVersion.setForeground(new Color(100, 116, 139));
        footerPanel.add(lblVersion, BorderLayout.SOUTH);

        sidebar.add(footerPanel, BorderLayout.SOUTH);

        btnNavDashboard.addActionListener(e -> switchView("DASHBOARD", btnNavDashboard));
        btnNavManage.addActionListener(e -> {
            managementPanel.loadEmployeeTable();
            switchView("MANAGE", btnNavManage);
        });
        btnNavSearch.addActionListener(e -> {
            performSearch();
            switchView("SEARCH", btnNavSearch);
        });
        btnNavAbout.addActionListener(e -> showAboutDialog());
        btnNavExit.addActionListener(e -> handleExit());

        setActiveNavButton(btnNavDashboard);

        return sidebar;
    }

    private JButton createSidebarButton(String text) {
        JButton btn = new JButton(text);
        btn.setMaximumSize(new Dimension(216, 42));
        btn.setPreferredSize(new Dimension(216, 42));
        btn.setFont(new Font("SansSerif", Font.PLAIN, 13));
        btn.setForeground(new Color(203, 213, 225));
        btn.setBackground(new Color(15, 23, 42));
        btn.setHorizontalAlignment(SwingConstants.LEFT);
        btn.setFocusPainted(false);
        btn.setBorderPainted(false);
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        btn.setBorder(new EmptyBorder(10, 15, 10, 15));
        return btn;
    }

    private void setActiveNavButton(JButton activeBtn) {
        JButton[] buttons = {btnNavDashboard, btnNavManage, btnNavSearch, btnNavAbout, btnNavExit};
        for (JButton b : buttons) {
            b.setBackground(new Color(15, 23, 42));
            b.setForeground(new Color(203, 213, 225));
            b.setFont(new Font("SansSerif", Font.PLAIN, 13));
        }
        activeBtn.setBackground(new Color(30, 58, 138));
        activeBtn.setForeground(Color.WHITE);
        activeBtn.setFont(new Font("SansSerif", Font.BOLD, 13));
    }

    private void switchView(String cardName, JButton triggeringButton) {
        cardLayout.show(contentPanel, cardName);
        setActiveNavButton(triggeringButton);
    }

    private JPanel createDashboardView() {
        JPanel panel = new JPanel(new BorderLayout(20, 20));
        panel.setBorder(new EmptyBorder(25, 25, 25, 25));
        panel.setBackground(new Color(248, 250, 252));

        JPanel headerPanel = new JPanel(new BorderLayout());
        headerPanel.setOpaque(false);

        JLabel lblTitle = new JLabel("Dashboard Overview");
        lblTitle.setFont(new Font("SansSerif", Font.BOLD, 22));
        lblTitle.setForeground(new Color(15, 23, 42));

        JButton btnRefreshStats = new JButton("Refresh Statistics");
        btnRefreshStats.setFont(new Font("SansSerif", Font.BOLD, 12));
        btnRefreshStats.setBackground(new Color(241, 245, 249));
        btnRefreshStats.setForeground(new Color(30, 41, 59));
        btnRefreshStats.setFocusPainted(false);
        btnRefreshStats.setBorder(BorderFactory.createCompoundBorder(
                new LineBorder(new Color(203, 213, 225), 1),
                new EmptyBorder(6, 14, 6, 14)
        ));
        btnRefreshStats.setCursor(new Cursor(Cursor.HAND_CURSOR));
        btnRefreshStats.addActionListener(e -> refreshDashboardData());

        headerPanel.add(lblTitle, BorderLayout.WEST);
        headerPanel.add(btnRefreshStats, BorderLayout.EAST);

        panel.add(headerPanel, BorderLayout.NORTH);

        JPanel mainContent = new JPanel(new BorderLayout(20, 20));
        mainContent.setOpaque(false);

        JPanel cardsGrid = new JPanel(new GridLayout(1, 3, 20, 0));
        cardsGrid.setOpaque(false);

        lblTotalEmployees = new JLabel("0", SwingConstants.CENTER);
        lblTotalDepartments = new JLabel("0", SwingConstants.CENTER);
        lblAverageSalary = new JLabel("$0.00", SwingConstants.CENTER);

        cardsGrid.add(createMetricCard("TOTAL EMPLOYEES", lblTotalEmployees, new Color(37, 99, 235)));
        cardsGrid.add(createMetricCard("DEPARTMENTS", lblTotalDepartments, new Color(13, 148, 136)));
        cardsGrid.add(createMetricCard("AVERAGE SALARY", lblAverageSalary, new Color(124, 58, 237)));

        mainContent.add(cardsGrid, BorderLayout.NORTH);

        JPanel recentPanel = new JPanel(new BorderLayout(10, 10));
        recentPanel.setBackground(Color.WHITE);
        recentPanel.setBorder(BorderFactory.createCompoundBorder(
                new LineBorder(new Color(226, 232, 240), 1),
                new EmptyBorder(15, 15, 15, 15)
        ));

        JLabel lblRecentTitle = new JLabel("Recently Joined Employees");
        lblRecentTitle.setFont(new Font("SansSerif", Font.BOLD, 15));
        lblRecentTitle.setForeground(new Color(30, 41, 59));
        recentPanel.add(lblRecentTitle, BorderLayout.NORTH);

        String[] headers = {"Employee ID", "Full Name", "Department", "Designation", "Joining Date"};
        recentTableModel = new DefaultTableModel(headers, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        JTable recentTable = new JTable(recentTableModel);
        recentTable.setRowHeight(28);
        recentTable.setFont(new Font("SansSerif", Font.PLAIN, 13));
        recentTable.getTableHeader().setFont(new Font("SansSerif", Font.BOLD, 12));
        recentTable.getTableHeader().setBackground(new Color(248, 250, 252));
        recentTable.getTableHeader().setReorderingAllowed(false);
        recentTable.setGridColor(new Color(241, 245, 249));

        JScrollPane recentScroll = new JScrollPane(recentTable);
        recentScroll.setBorder(new LineBorder(new Color(226, 232, 240), 1));
        recentScroll.getViewport().setBackground(Color.WHITE);

        recentPanel.add(recentScroll, BorderLayout.CENTER);

        mainContent.add(recentPanel, BorderLayout.CENTER);

        panel.add(mainContent, BorderLayout.CENTER);

        return panel;
    }

    private JPanel createMetricCard(String title, JLabel valueLabel, Color accentColor) {
        JPanel card = new JPanel(new BorderLayout(8, 8));
        card.setBackground(Color.WHITE);
        card.setBorder(BorderFactory.createCompoundBorder(
                new LineBorder(new Color(226, 232, 240), 1),
                new EmptyBorder(18, 20, 18, 20)
        ));

        JLabel lblCardTitle = new JLabel(title);
        lblCardTitle.setFont(new Font("SansSerif", Font.BOLD, 12));
        lblCardTitle.setForeground(new Color(100, 116, 139));

        valueLabel.setFont(new Font("SansSerif", Font.BOLD, 26));
        valueLabel.setForeground(accentColor);
        valueLabel.setHorizontalAlignment(SwingConstants.LEFT);

        card.add(lblCardTitle, BorderLayout.NORTH);
        card.add(valueLabel, BorderLayout.CENTER);

        return card;
    }

    private JPanel createSearchView() {
        JPanel panel = new JPanel(new BorderLayout(15, 15));
        panel.setBorder(new EmptyBorder(25, 25, 25, 25));
        panel.setBackground(new Color(248, 250, 252));

        JPanel searchHeader = new JPanel(new BorderLayout());
        searchHeader.setOpaque(false);

        JLabel lblTitle = new JLabel("Search Employee Records");
        lblTitle.setFont(new Font("SansSerif", Font.BOLD, 22));
        lblTitle.setForeground(new Color(15, 23, 42));
        searchHeader.add(lblTitle, BorderLayout.WEST);

        panel.add(searchHeader, BorderLayout.NORTH);

        JPanel controlsCard = new JPanel(new FlowLayout(FlowLayout.LEFT, 15, 12));
        controlsCard.setBackground(Color.WHITE);
        controlsCard.setBorder(BorderFactory.createCompoundBorder(
                new LineBorder(new Color(226, 232, 240), 1),
                new EmptyBorder(5, 10, 5, 10)
        ));

        JLabel lblCriteria = new JLabel("Search By:");
        lblCriteria.setFont(new Font("SansSerif", Font.BOLD, 12));
        lblCriteria.setForeground(new Color(71, 85, 105));

        cbSearchCriteria = new JComboBox<>(new String[]{"Employee ID", "Employee Name", "Department", "Designation"});
        cbSearchCriteria.setPreferredSize(new Dimension(160, 32));
        cbSearchCriteria.setFont(new Font("SansSerif", Font.PLAIN, 13));

        JLabel lblQuery = new JLabel("Query:");
        lblQuery.setFont(new Font("SansSerif", Font.BOLD, 12));
        lblQuery.setForeground(new Color(71, 85, 105));

        txtSearchQuery = new JTextField();
        txtSearchQuery.setPreferredSize(new Dimension(240, 32));
        txtSearchQuery.setFont(new Font("SansSerif", Font.PLAIN, 13));
        txtSearchQuery.setBorder(BorderFactory.createCompoundBorder(
                new LineBorder(new Color(203, 213, 225), 1),
                new EmptyBorder(4, 8, 4, 8)
        ));

        JButton btnSearch = new JButton("Search");
        btnSearch.setFont(new Font("SansSerif", Font.BOLD, 12));
        btnSearch.setBackground(new Color(37, 99, 235));
        btnSearch.setForeground(Color.WHITE);
        btnSearch.setFocusPainted(false);
        btnSearch.setCursor(new Cursor(Cursor.HAND_CURSOR));
        btnSearch.setBorder(BorderFactory.createCompoundBorder(
                new LineBorder(new Color(29, 78, 216), 1),
                new EmptyBorder(7, 16, 7, 16)
        ));

        JButton btnReset = new JButton("Show All Employees");
        btnReset.setFont(new Font("SansSerif", Font.BOLD, 12));
        btnReset.setBackground(new Color(241, 245, 249));
        btnReset.setForeground(new Color(30, 41, 59));
        btnReset.setFocusPainted(false);
        btnReset.setCursor(new Cursor(Cursor.HAND_CURSOR));
        btnReset.setBorder(BorderFactory.createCompoundBorder(
                new LineBorder(new Color(203, 213, 225), 1),
                new EmptyBorder(7, 14, 7, 14)
        ));

        controlsCard.add(lblCriteria);
        controlsCard.add(cbSearchCriteria);
        controlsCard.add(lblQuery);
        controlsCard.add(txtSearchQuery);
        controlsCard.add(btnSearch);
        controlsCard.add(btnReset);

        JPanel centerWrapper = new JPanel(new BorderLayout(15, 15));
        centerWrapper.setOpaque(false);
        centerWrapper.add(controlsCard, BorderLayout.NORTH);

        String[] headers = {
                "Employee ID", "Full Name", "Department", "Designation",
                "Salary ($)", "Contact Number", "Email Address", "Joining Date"
        };
        searchTableModel = new DefaultTableModel(headers, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        searchTable = new JTable(searchTableModel);
        searchTable.setRowHeight(28);
        searchTable.setFont(new Font("SansSerif", Font.PLAIN, 13));
        searchTable.getTableHeader().setFont(new Font("SansSerif", Font.BOLD, 12));
        searchTable.getTableHeader().setBackground(new Color(241, 245, 249));
        searchTable.getTableHeader().setReorderingAllowed(false);
        searchTable.setGridColor(new Color(241, 245, 249));

        DefaultTableCellRenderer rightRenderer = new DefaultTableCellRenderer();
        rightRenderer.setHorizontalAlignment(SwingConstants.RIGHT);
        searchTable.getColumnModel().getColumn(4).setCellRenderer(rightRenderer);

        JScrollPane searchScroll = new JScrollPane(searchTable);
        searchScroll.setBorder(new LineBorder(new Color(226, 232, 240), 1));
        searchScroll.getViewport().setBackground(Color.WHITE);

        centerWrapper.add(searchScroll, BorderLayout.CENTER);

        panel.add(centerWrapper, BorderLayout.CENTER);

        btnSearch.addActionListener(e -> performSearch());
        txtSearchQuery.addActionListener(e -> performSearch());
        btnReset.addActionListener(e -> {
            txtSearchQuery.setText("");
            performSearch();
        });

        return panel;
    }

    private void performSearch() {
        String query = txtSearchQuery.getText().trim();
        String criteria = cbSearchCriteria.getSelectedItem() != null ? cbSearchCriteria.getSelectedItem().toString() : "Employee ID";

        searchTableModel.setRowCount(0);
        try {
            List<Employee> results = employeeService.searchEmployees(query, criteria);
            if (results.isEmpty()) {
                JOptionPane.showMessageDialog(this,
                        "No employee records matched your search criteria: \\"" + query + "\\"",
                        "Search Results",
                        JOptionPane.INFORMATION_MESSAGE);
            } else {
                DecimalFormat df = new DecimalFormat("#,##0.00");
                for (Employee emp : results) {
                    searchTableModel.addRow(new Object[]{
                            emp.getEmployeeId(),
                            emp.getFullName(),
                            emp.getDepartment(),
                            emp.getDesignation(),
                            df.format(emp.getSalary()),
                            emp.getContactNumber(),
                            emp.getEmail(),
                            emp.getDateOfJoining()
                    });
                }
            }
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this,
                    "Database search error:\\n" + ex.getMessage(),
                    "Database Error",
                    JOptionPane.ERROR_MESSAGE);
        }
    }

    public void refreshDashboardData() {
        try {
            int totalEmployees = employeeService.getTotalEmployees();
            int totalDepts = employeeService.getTotalDepartments();
            double avgSalary = employeeService.getAverageSalary();
            List<Employee> recent = employeeService.getRecentlyAddedEmployees(5);

            lblTotalEmployees.setText(String.valueOf(totalEmployees));
            lblTotalDepartments.setText(String.valueOf(totalDepts));
            lblAverageSalary.setText(currencyFormat.format(avgSalary));

            recentTableModel.setRowCount(0);
            for (Employee emp : recent) {
                recentTableModel.addRow(new Object[]{
                        emp.getEmployeeId(),
                        emp.getFullName(),
                        emp.getDepartment(),
                        emp.getDesignation(),
                        emp.getDateOfJoining()
                });
            }
        } catch (SQLException ex) {
            System.err.println("Dashboard refresh error: " + ex.getMessage());
        }
    }

    private void showAboutDialog() {
        JPanel aboutPanel = new JPanel(new GridLayout(6, 1, 4, 4));
        aboutPanel.setBorder(new EmptyBorder(10, 15, 10, 15));

        JLabel title = new JLabel("Employee Management System");
        title.setFont(new Font("SansSerif", Font.BOLD, 15));
        title.setForeground(new Color(30, 58, 138));

        JLabel dev = new JLabel("Developer: Garv Jangir");
        dev.setFont(new Font("SansSerif", Font.PLAIN, 13));

        JLabel email = new JLabel("Email: garvsharma0033@gmail.com");
        email.setFont(new Font("SansSerif", Font.PLAIN, 13));

        JLabel org = new JLabel("Organization: CODSOFT");
        org.setFont(new Font("SansSerif", Font.PLAIN, 13));

        JLabel role = new JLabel("Internship Track: Java Programmer");
        role.setFont(new Font("SansSerif", Font.PLAIN, 13));

        JLabel stack = new JLabel("Tech Stack: Java Swing, JDBC, MySQL");
        stack.setFont(new Font("SansSerif", Font.PLAIN, 12));
        stack.setForeground(new Color(100, 116, 139));

        aboutPanel.add(title);
        aboutPanel.add(dev);
        aboutPanel.add(email);
        aboutPanel.add(org);
        aboutPanel.add(role);
        aboutPanel.add(stack);

        JOptionPane.showMessageDialog(this,
                aboutPanel,
                "About Employee Management System",
                JOptionPane.INFORMATION_MESSAGE);
    }

    private void handleExit() {
        int confirm = JOptionPane.showConfirmDialog(
                this,
                "Are you sure you want to exit the Employee Management System?",
                "Confirm Exit",
                JOptionPane.YES_NO_OPTION,
                JOptionPane.QUESTION_MESSAGE
        );

        if (confirm == JOptionPane.YES_OPTION) {
            dispose();
            System.exit(0);
        }
    }
}`
  },
  {
    name: 'EmployeeManagementPanel.java',
    path: 'src/com/codsoft/employeemanagement/EmployeeManagementPanel.java',
    category: 'java',
    description: 'WindowBuilder-compatible JPanel hosting input forms, action buttons, and JTable.',
    explanation: 'EmployeeManagementPanel contains the core CRUD UI components. It is built strictly with standard Java Swing layout managers (BorderLayout and GridBagLayout) to guarantee full compatibility with the Eclipse WindowBuilder visual editor. It features labeled inputs for ID, name, department dropdown, designation, salary, phone, email, and joining date. A ListSelectionListener populates input fields immediately upon clicking a row in the JTable. It provides Add, Update, Delete (with confirm dialog), Clear, and Refresh triggers, catching all validation and SQL exceptions.',
    content: `package com.codsoft.employeemanagement;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.border.TitledBorder;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.sql.SQLException;
import java.text.DecimalFormat;
import java.util.List;

public class EmployeeManagementPanel extends JPanel {

    private final EmployeeService employeeService;
    private final Runnable onDataChangedCallback;

    private JTextField txtId;
    private JTextField txtName;
    private JComboBox<String> cbDepartment;
    private JTextField txtDesignation;
    private JTextField txtSalary;
    private JTextField txtContact;
    private JTextField txtEmail;
    private JTextField txtDate;

    private JTable tableEmployees;
    private DefaultTableModel tableModel;

    private JButton btnAdd;
    private JButton btnUpdate;
    private JButton btnDelete;
    private JButton btnClear;
    private JButton btnRefresh;

    private final DecimalFormat currencyFormat = new DecimalFormat("#,##0.00");

    public EmployeeManagementPanel(EmployeeService employeeService, Runnable onDataChangedCallback) {
        this.employeeService = employeeService;
        this.onDataChangedCallback = onDataChangedCallback;
        initializeUI();
        loadEmployeeTable();
    }

    private void initializeUI() {
        setLayout(new BorderLayout(15, 15));
        setBorder(new EmptyBorder(15, 15, 15, 15));
        setBackground(new Color(245, 247, 250));

        JPanel formWrapper = new JPanel(new BorderLayout(10, 10));
        formWrapper.setOpaque(false);

        JPanel formCard = new JPanel(new GridBagLayout());
        formCard.setBackground(Color.WHITE);
        formCard.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(226, 232, 240), 1),
                new EmptyBorder(15, 20, 15, 20)
        ));

        TitledBorder formTitle = BorderFactory.createTitledBorder(
                BorderFactory.createEmptyBorder(),
                "Employee Details Form",
                TitledBorder.LEFT,
                TitledBorder.TOP,
                new Font("SansSerif", Font.BOLD, 14),
                new Color(30, 41, 59)
        );
        formCard.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(226, 232, 240), 1),
                BorderFactory.createCompoundBorder(formTitle, new EmptyBorder(10, 10, 10, 10))
        ));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(6, 8, 6, 8);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        txtId = createStyledTextField();
        txtName = createStyledTextField();
        cbDepartment = new JComboBox<>(new String[]{
                "Engineering", "Human Resources", "Finance", "Marketing",
                "Quality Assurance", "Operations", "Sales", "Legal", "Research & Development"
        });
        cbDepartment.setFont(new Font("SansSerif", Font.PLAIN, 13));
        cbDepartment.setBackground(Color.WHITE);
        cbDepartment.setPreferredSize(new Dimension(180, 32));

        txtDesignation = createStyledTextField();
        txtSalary = createStyledTextField();
        txtContact = createStyledTextField();
        txtEmail = createStyledTextField();
        txtDate = createStyledTextField();

        addFormField(formCard, gbc, "Employee ID:", txtId, 0, 0);
        addFormField(formCard, gbc, "Full Name:", txtName, 0, 1);
        addFormField(formCard, gbc, "Department:", cbDepartment, 1, 0);
        addFormField(formCard, gbc, "Designation:", txtDesignation, 1, 1);
        addFormField(formCard, gbc, "Salary ($):", txtSalary, 2, 0);
        addFormField(formCard, gbc, "Contact Number:", txtContact, 2, 1);
        addFormField(formCard, gbc, "Email Address:", txtEmail, 3, 0);
        addFormField(formCard, gbc, "Date of Joining (YYYY-MM-DD):", txtDate, 3, 1);

        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 8));
        buttonPanel.setOpaque(false);

        btnAdd = createStyledButton("Add Employee", new Color(37, 99, 235), Color.WHITE);
        btnUpdate = createStyledButton("Update Details", new Color(13, 148, 136), Color.WHITE);
        btnDelete = createStyledButton("Delete Record", new Color(220, 38, 38), Color.WHITE);
        btnClear = createStyledButton("Clear Form", new Color(100, 116, 139), Color.WHITE);
        btnRefresh = createStyledButton("Refresh Table", new Color(51, 65, 85), Color.WHITE);

        buttonPanel.add(btnAdd);
        buttonPanel.add(btnUpdate);
        buttonPanel.add(btnDelete);
        buttonPanel.add(btnClear);
        buttonPanel.add(btnRefresh);

        formWrapper.add(formCard, BorderLayout.CENTER);
        formWrapper.add(buttonPanel, BorderLayout.SOUTH);

        add(formWrapper, BorderLayout.NORTH);

        String[] columnNames = {
                "Employee ID", "Full Name", "Department", "Designation",
                "Salary ($)", "Contact Number", "Email Address", "Joining Date"
        };
        tableModel = new DefaultTableModel(columnNames, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        tableEmployees = new JTable(tableModel);
        tableEmployees.setRowHeight(28);
        tableEmployees.setFont(new Font("SansSerif", Font.PLAIN, 13));
        tableEmployees.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        tableEmployees.getTableHeader().setFont(new Font("SansSerif", Font.BOLD, 13));
        tableEmployees.getTableHeader().setBackground(new Color(241, 245, 249));
        tableEmployees.getTableHeader().setForeground(new Color(15, 23, 42));
        tableEmployees.getTableHeader().setReorderingAllowed(false);
        tableEmployees.setGridColor(new Color(241, 245, 249));
        tableEmployees.setSelectionBackground(new Color(219, 234, 254));
        tableEmployees.setSelectionForeground(new Color(30, 58, 138));

        DefaultTableCellRenderer centerRenderer = new DefaultTableCellRenderer();
        centerRenderer.setHorizontalAlignment(SwingConstants.CENTER);
        tableEmployees.getColumnModel().getColumn(0).setCellRenderer(centerRenderer);
        tableEmployees.getColumnModel().getColumn(7).setCellRenderer(centerRenderer);

        DefaultTableCellRenderer rightRenderer = new DefaultTableCellRenderer();
        rightRenderer.setHorizontalAlignment(SwingConstants.RIGHT);
        tableEmployees.getColumnModel().getColumn(4).setCellRenderer(rightRenderer);

        JScrollPane scrollPane = new JScrollPane(tableEmployees);
        scrollPane.setBorder(BorderFactory.createLineBorder(new Color(226, 232, 240), 1));
        scrollPane.getViewport().setBackground(Color.WHITE);

        add(scrollPane, BorderLayout.CENTER);

        attachEventListeners();
    }

    private void addFormField(JPanel panel, GridBagConstraints gbc, String labelText, JComponent field, int row, int col) {
        gbc.gridx = col * 2;
        gbc.gridy = row;
        gbc.weightx = 0.0;
        JLabel lbl = new JLabel(labelText);
        lbl.setFont(new Font("SansSerif", Font.BOLD, 12));
        lbl.setForeground(new Color(71, 85, 105));
        panel.add(lbl, gbc);

        gbc.gridx = col * 2 + 1;
        gbc.weightx = 1.0;
        panel.add(field, gbc);
    }

    private JTextField createStyledTextField() {
        JTextField field = new JTextField();
        field.setPreferredSize(new Dimension(180, 32));
        field.setFont(new Font("SansSerif", Font.PLAIN, 13));
        field.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(203, 213, 225), 1),
                BorderFactory.createEmptyBorder(4, 8, 4, 8)
        ));
        return field;
    }

    private JButton createStyledButton(String text, Color bg, Color fg) {
        JButton btn = new JButton(text);
        btn.setFont(new Font("SansSerif", Font.BOLD, 12));
        btn.setBackground(bg);
        btn.setForeground(fg);
        btn.setFocusPainted(false);
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        btn.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(bg.darker(), 1),
                BorderFactory.createEmptyBorder(7, 14, 7, 14)
        ));
        return btn;
    }

    private void attachEventListeners() {
        tableEmployees.getSelectionModel().addListSelectionListener(e -> {
            if (!e.getValueIsAdjusting() && tableEmployees.getSelectedRow() != -1) {
                int selectedRow = tableEmployees.getSelectedRow();
                txtId.setText(tableModel.getValueAt(selectedRow, 0).toString());
                txtId.setEditable(false);
                txtName.setText(tableModel.getValueAt(selectedRow, 1).toString());
                cbDepartment.setSelectedItem(tableModel.getValueAt(selectedRow, 2).toString());
                txtDesignation.setText(tableModel.getValueAt(selectedRow, 3).toString());

                String salaryStr = tableModel.getValueAt(selectedRow, 4).toString().replace(",", "");
                txtSalary.setText(salaryStr);

                txtContact.setText(tableModel.getValueAt(selectedRow, 5).toString());
                txtEmail.setText(tableModel.getValueAt(selectedRow, 6).toString());
                txtDate.setText(tableModel.getValueAt(selectedRow, 7).toString());
            }
        });

        btnAdd.addActionListener(e -> handleAddEmployee());
        btnUpdate.addActionListener(e -> handleUpdateEmployee());
        btnDelete.addActionListener(e -> handleDeleteEmployee());
        btnClear.addActionListener(e -> clearForm());
        btnRefresh.addActionListener(e -> {
            loadEmployeeTable();
            if (onDataChangedCallback != null) {
                onDataChangedCallback.run();
            }
        });
    }

    private void handleAddEmployee() {
        try {
            double salary = parseSalary(txtSalary.getText().trim());
            Employee emp = new Employee(
                    txtId.getText().trim(),
                    txtName.getText().trim(),
                    cbDepartment.getSelectedItem() != null ? cbDepartment.getSelectedItem().toString() : "",
                    txtDesignation.getText().trim(),
                    salary,
                    txtContact.getText().trim(),
                    txtEmail.getText().trim(),
                    txtDate.getText().trim()
            );

            employeeService.addEmployee(emp);
            JOptionPane.showMessageDialog(this,
                    "Employee record added successfully!",
                    "Operation Successful",
                    JOptionPane.INFORMATION_MESSAGE);
            clearForm();
            loadEmployeeTable();
            notifyDataChanged();
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this,
                    "Please enter a valid numeric salary amount.",
                    "Input Validation Error",
                    JOptionPane.WARNING_MESSAGE);
            txtSalary.requestFocus();
        } catch (IllegalArgumentException ex) {
            JOptionPane.showMessageDialog(this,
                    ex.getMessage(),
                    "Validation Error",
                    JOptionPane.WARNING_MESSAGE);
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this,
                    "Database error while adding employee: " + ex.getMessage(),
                    "Database Error",
                    JOptionPane.ERROR_MESSAGE);
        }
    }

    private void handleUpdateEmployee() {
        if (txtId.getText().trim().isEmpty() || tableEmployees.getSelectedRow() == -1) {
            JOptionPane.showMessageDialog(this,
                    "Please select an employee from the table to update.",
                    "Selection Required",
                    JOptionPane.WARNING_MESSAGE);
            return;
        }

        try {
            double salary = parseSalary(txtSalary.getText().trim());
            Employee emp = new Employee(
                    txtId.getText().trim(),
                    txtName.getText().trim(),
                    cbDepartment.getSelectedItem() != null ? cbDepartment.getSelectedItem().toString() : "",
                    txtDesignation.getText().trim(),
                    salary,
                    txtContact.getText().trim(),
                    txtEmail.getText().trim(),
                    txtDate.getText().trim()
            );

            employeeService.updateEmployee(emp);
            JOptionPane.showMessageDialog(this,
                    "Employee record updated successfully!",
                    "Update Successful",
                    JOptionPane.INFORMATION_MESSAGE);
            clearForm();
            loadEmployeeTable();
            notifyDataChanged();
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this,
                    "Please enter a valid numeric salary amount.",
                    "Input Validation Error",
                    JOptionPane.WARNING_MESSAGE);
            txtSalary.requestFocus();
        } catch (IllegalArgumentException ex) {
            JOptionPane.showMessageDialog(this,
                    ex.getMessage(),
                    "Validation Error",
                    JOptionPane.WARNING_MESSAGE);
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this,
                    "Database error while updating employee: " + ex.getMessage(),
                    "Database Error",
                    JOptionPane.ERROR_MESSAGE);
        }
    }

    private void handleDeleteEmployee() {
        int selectedRow = tableEmployees.getSelectedRow();
        if (selectedRow == -1) {
            JOptionPane.showMessageDialog(this,
                    "Please select an employee record from the table to delete.",
                    "Selection Required",
                    JOptionPane.WARNING_MESSAGE);
            return;
        }

        String employeeId = tableModel.getValueAt(selectedRow, 0).toString();
        String employeeName = tableModel.getValueAt(selectedRow, 1).toString();

        int confirm = JOptionPane.showConfirmDialog(
                this,
                "Are you sure you want to permanently delete employee '" + employeeName + "' (" + employeeId + ")?",
                "Confirm Deletion",
                JOptionPane.YES_NO_OPTION,
                JOptionPane.QUESTION_MESSAGE
        );

        if (confirm == JOptionPane.YES_OPTION) {
            try {
                employeeService.deleteEmployee(employeeId);
                JOptionPane.showMessageDialog(this,
                        "Employee record deleted successfully.",
                        "Deletion Complete",
                        JOptionPane.INFORMATION_MESSAGE);
                clearForm();
                loadEmployeeTable();
                notifyDataChanged();
            } catch (SQLException ex) {
                JOptionPane.showMessageDialog(this,
                        "Database error while deleting record: " + ex.getMessage(),
                        "Database Error",
                        JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    public void clearForm() {
        txtId.setText("");
        txtId.setEditable(true);
        txtName.setText("");
        if (cbDepartment.getItemCount() > 0) {
            cbDepartment.setSelectedIndex(0);
        }
        txtDesignation.setText("");
        txtSalary.setText("");
        txtContact.setText("");
        txtEmail.setText("");
        txtDate.setText("");
        tableEmployees.clearSelection();
    }

    public void loadEmployeeTable() {
        tableModel.setRowCount(0);
        try {
            List<Employee> list = employeeService.getAllEmployees();
            for (Employee emp : list) {
                tableModel.addRow(new Object[]{
                        emp.getEmployeeId(),
                        emp.getFullName(),
                        emp.getDepartment(),
                        emp.getDesignation(),
                        currencyFormat.format(emp.getSalary()),
                        emp.getContactNumber(),
                        emp.getEmail(),
                        emp.getDateOfJoining()
                });
            }
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this,
                    "Unable to load employee records from database:\\n" + ex.getMessage(),
                    "Database Connection Notice",
                    JOptionPane.WARNING_MESSAGE);
        }
    }

    private double parseSalary(String str) {
        return Double.parseDouble(str);
    }

    private void notifyDataChanged() {
        if (onDataChangedCallback != null) {
            onDataChangedCallback.run();
        }
    }
}`
  },
  {
    name: 'database.sql',
    path: 'database.sql',
    category: 'sql',
    description: 'MySQL database creation script with table schema and sample data.',
    explanation: 'database.sql sets up the MySQL database named employee_management_db and creates the employees table with employee_id designated as the primary key. It includes 8 sample employee records across departments (Engineering, HR, Finance, Marketing, QA, Operations) to enable immediate testing after project creation.',
    content: `CREATE DATABASE IF NOT EXISTS employee_management_db;
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
('EMP108', 'Sneha Reddy', 'Operations', 'Operations Coordinator', 48000.00, '+919210987654', 'sneha.reddy@codsoft.org', '2024-03-01');`
  },
  {
    name: 'README.md',
    path: 'README.md',
    category: 'doc',
    description: 'Complete documentation covering Eclipse setup, JDBC configuration, and features.',
    explanation: 'Comprehensive Markdown readme detailing project prerequisites, step-by-step Eclipse setup instructions, MySQL JDBC driver linking, credentials management, architectural notes, and Garv Jangir author attribution for CODSOFT.',
    content: `# Employee Management System

A desktop application developed for the CODSOFT Java Programmer Internship.

- Developer: Garv Jangir
- Email: garvsharma0033@gmail.com
- Organization: CODSOFT
- Technology Stack: Java 17+, Java Swing (GUI), JDBC, MySQL Database, Eclipse IDE with WindowBuilder.

## System Overview
The Employee Management System provides a desktop interface to perform core Human Resource and Employee record operations:
- Dashboard Overview: Displays live operational metrics and recently added employees.
- Manage Employees: Full CRUD operations with comprehensive field validations.
- Search Employees: Parameterized query filtering using PreparedStatement.
- Database Persistence: MySQL persistence using JDBC.`
  },
  {
    name: '.project',
    path: '.project',
    category: 'config',
    description: 'Eclipse IDE project definition descriptor.',
    explanation: 'Eclipse metadata file that marks the folder as a genuine Eclipse Java project so it can be imported using File > Open Projects from File System without manual wizard steps.',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<projectDescription>
	<name>EmployeeManagementSystem</name>
	<comment>CODSOFT Java Programmer Internship Project by Garv Jangir</comment>
	<projects>
	</projects>
	<buildSpec>
		<buildCommand>
			<name>org.eclipse.jdt.core.javabuilder</name>
			<arguments>
			</arguments>
		</buildCommand>
	</buildSpec>
	<natures>
		<nature>org.eclipse.jdt.core.javanature</nature>
	</natures>
</projectDescription>`
  },
  {
    name: '.classpath',
    path: '.classpath',
    category: 'config',
    description: 'Eclipse IDE classpath configuration descriptor.',
    explanation: 'Eclipse configuration mapping src as the source folder, bin as the output bytecode folder, and binding the standard Java JRE system library container.',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<classpath>
	<classpathentry kind="src" path="src"/>
	<classpathentry kind="con" path="org.eclipse.jdt.launching.JRE_CONTAINER"/>
	<classpathentry kind="output" path="bin"/>
</classpath>`
  }
];
