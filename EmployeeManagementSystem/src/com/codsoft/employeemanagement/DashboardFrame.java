package com.codsoft.employeemanagement;

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
                        "No employee records matched your search criteria: \"" + query + "\"",
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
                    "Database search error:\n" + ex.getMessage(),
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
}
