package com.codsoft.employeemanagement;

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
                    "Unable to load employee records from database:\n" + ex.getMessage(),
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
}
