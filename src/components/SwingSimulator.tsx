import React, { useState, useMemo } from 'react';
import { 
  EmployeeRecord, 
  INITIAL_EMPLOYEES, 
  DEPARTMENTS 
} from '../data/initialEmployees';
import { 
  Users, 
  Building2, 
  DollarSign, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  RefreshCw, 
  Info, 
  LogOut, 
  Database,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Terminal,
  Calendar,
  Sparkles
} from 'lucide-react';

interface SqlLog {
  id: string;
  time: string;
  query: string;
  status: 'SUCCESS' | 'ERROR';
}

export const SwingSimulator: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeRecord[]>(INITIAL_EMPLOYEES);
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'MANAGE' | 'SEARCH'>('MANAGE');
  const [showAbout, setShowAbout] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Alert dialog state (Simulating JOptionPane)
  const [dialog, setDialog] = useState<{
    type: 'info' | 'warning' | 'error';
    title: string;
    message: string;
  } | null>(null);

  // Form states for EmployeeManagementPanel
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    department: 'Engineering',
    designation: '',
    salary: '',
    contactNumber: '',
    email: '',
    dateOfJoining: ''
  });

  // Search states
  const [searchCriteria, setSearchCriteria] = useState<'id' | 'name' | 'department' | 'designation'>('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // SQL queries log
  const [sqlLogs, setSqlLogs] = useState<SqlLog[]>([
    {
      id: '1',
      time: '07:50:12',
      query: 'SELECT * FROM employees ORDER BY employee_id ASC',
      status: 'SUCCESS'
    },
    {
      id: '2',
      time: '07:50:13',
      query: 'SELECT COUNT(*), COUNT(DISTINCT department), AVG(salary) FROM employees',
      status: 'SUCCESS'
    }
  ]);
  const [showSqlDrawer, setShowSqlDrawer] = useState(false);

  const addSqlLog = (query: string, status: 'SUCCESS' | 'ERROR' = 'SUCCESS') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setSqlLogs(prev => [
      { id: Math.random().toString(), time: timeStr, query, status },
      ...prev.slice(0, 19)
    ]);
  };

  // Dashboard metrics
  const totalEmployees = employees.length;
  const uniqueDepartments = useMemo(() => new Set(employees.map(e => e.department)).size, [employees]);
  const averageSalary = useMemo(() => {
    if (employees.length === 0) return 0;
    const sum = employees.reduce((acc, curr) => acc + curr.salary, 0);
    return sum / employees.length;
  }, [employees]);

  const recentEmployees = useMemo(() => {
    return [...employees]
      .sort((a, b) => b.dateOfJoining.localeCompare(a.dateOfJoining))
      .slice(0, 5);
  }, [employees]);

  // Search results
  const filteredEmployees = useMemo(() => {
    if (!isSearching || !searchQuery.trim()) {
      return employees;
    }
    const q = searchQuery.toLowerCase().trim();
    return employees.filter(emp => {
      if (searchCriteria === 'id') return emp.employeeId.toLowerCase().includes(q);
      if (searchCriteria === 'name') return emp.fullName.toLowerCase().includes(q);
      if (searchCriteria === 'department') return emp.department.toLowerCase().includes(q);
      if (searchCriteria === 'designation') return emp.designation.toLowerCase().includes(q);
      return true;
    });
  }, [employees, searchQuery, searchCriteria, isSearching]);

  // Form helpers
  const handleSelectRow = (emp: EmployeeRecord) => {
    setSelectedId(emp.employeeId);
    setFormData({
      employeeId: emp.employeeId,
      fullName: emp.fullName,
      department: emp.department,
      designation: emp.designation,
      salary: String(emp.salary),
      contactNumber: emp.contactNumber,
      email: emp.email,
      dateOfJoining: emp.dateOfJoining
    });
  };

  const handleClearForm = () => {
    setSelectedId(null);
    setFormData({
      employeeId: '',
      fullName: '',
      department: 'Engineering',
      designation: '',
      salary: '',
      contactNumber: '',
      email: '',
      dateOfJoining: ''
    });
  };

  const handleQuickFillSample = (roleType: 'dev' | 'hr') => {
    const nextNum = Math.floor(100 + Math.random() * 900);
    if (roleType === 'dev') {
      setFormData({
        employeeId: `EMP${nextNum}`,
        fullName: 'Vikram Sharma',
        department: 'Engineering',
        designation: 'Java Software Engineer',
        salary: '82000',
        contactNumber: '+919876543210',
        email: 'vikram.sharma@codsoft.org',
        dateOfJoining: '2026-10-15'
      });
    } else {
      setFormData({
        employeeId: `EMP${nextNum}`,
        fullName: 'Ananya Verma',
        department: 'Human Resources',
        designation: 'HR Executive',
        salary: '68000',
        contactNumber: '+919812345678',
        email: 'ananya.v@codsoft.org',
        dateOfJoining: '2026-09-01'
      });
    }
    setSelectedId(null);
  };

  const handleSetToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, dateOfJoining: today }));
  };

  const validateForm = (isNew: boolean) => {
    if (!formData.employeeId.trim()) {
      setDialog({ type: 'warning', title: 'Input Validation Error', message: 'Employee ID is required.' });
      return false;
    }
    if (isNew && employees.some(e => e.employeeId.toLowerCase() === formData.employeeId.trim().toLowerCase())) {
      setDialog({ type: 'warning', title: 'Duplicate ID Error', message: `Employee ID '${formData.employeeId}' already exists in database.` });
      return false;
    }
    if (!isNew && formData.employeeId.trim().toLowerCase() !== selectedId?.toLowerCase() && employees.some(e => e.employeeId.toLowerCase() === formData.employeeId.trim().toLowerCase())) {
      setDialog({ type: 'warning', title: 'Duplicate ID Error', message: `Employee ID '${formData.employeeId}' already belongs to another employee.` });
      return false;
    }
    if (!formData.fullName.trim()) {
      setDialog({ type: 'warning', title: 'Input Validation Error', message: 'Full Name is required.' });
      return false;
    }
    if (!formData.designation.trim()) {
      setDialog({ type: 'warning', title: 'Input Validation Error', message: 'Designation is required.' });
      return false;
    }
    const salaryVal = parseFloat(formData.salary);
    if (isNaN(salaryVal) || salaryVal <= 0) {
      setDialog({ type: 'warning', title: 'Invalid Salary', message: 'Salary must be a positive numeric value greater than 0.' });
      return false;
    }
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(formData.contactNumber.trim())) {
      setDialog({ type: 'warning', title: 'Invalid Contact Number', message: 'Please provide a valid 7 to 15 digit contact number.' });
      return false;
    }
    const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setDialog({ type: 'warning', title: 'Invalid Email', message: 'Please provide a valid email format (e.g. name@domain.com).' });
      return false;
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formData.dateOfJoining.trim())) {
      setDialog({ type: 'warning', title: 'Invalid Date Format', message: 'Date of Joining must be in YYYY-MM-DD format (e.g. 2026-10-15).' });
      return false;
    }
    return true;
  };

  const handleAddEmployee = () => {
    if (!validateForm(true)) return;
    const newEmp: EmployeeRecord = {
      ...formData,
      salary: parseFloat(formData.salary)
    };
    setEmployees(prev => [...prev, newEmp]);
    addSqlLog(`PreparedStatement: INSERT INTO employees (employee_id, full_name, department, designation, salary, contact_number, email, date_of_joining) VALUES ('${newEmp.employeeId}', '${newEmp.fullName}', '${newEmp.department}', '${newEmp.designation}', ${newEmp.salary}, '${newEmp.contactNumber}', '${newEmp.email}', '${newEmp.dateOfJoining}')`);
    setDialog({ type: 'info', title: 'Operation Successful', message: `Employee '${newEmp.fullName}' (${newEmp.employeeId}) added to MySQL database.` });
    handleClearForm();
  };

  const handleUpdateEmployee = () => {
    if (!selectedId) {
      setDialog({ type: 'warning', title: 'Selection Required', message: 'Please select an employee from the table to update, or click Add Employee to save as a new record.' });
      return;
    }
    if (!validateForm(false)) return;
    const updatedSalary = parseFloat(formData.salary);
    setEmployees(prev => prev.map(e => e.employeeId === selectedId ? { ...formData, salary: updatedSalary } : e));
    addSqlLog(`PreparedStatement: UPDATE employees SET employee_id='${formData.employeeId}', full_name='${formData.fullName}', department='${formData.department}', designation='${formData.designation}', salary=${updatedSalary}, contact_number='${formData.contactNumber}', email='${formData.email}', date_of_joining='${formData.dateOfJoining}' WHERE employee_id='${selectedId}'`);
    setDialog({ type: 'info', title: 'Update Successful', message: `Employee '${formData.fullName}' details updated successfully.` });
    handleClearForm();
  };

  const confirmDelete = () => {
    if (!showDeleteConfirm) return;
    const targetEmp = employees.find(e => e.employeeId === showDeleteConfirm);
    setEmployees(prev => prev.filter(e => e.employeeId !== showDeleteConfirm));
    addSqlLog(`PreparedStatement: DELETE FROM employees WHERE employee_id='${showDeleteConfirm}'`);
    setShowDeleteConfirm(null);
    handleClearForm();
    setDialog({ type: 'info', title: 'Deletion Complete', message: `Employee '${targetEmp?.fullName || showDeleteConfirm}' permanently deleted from database.` });
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    let col = 'employee_id';
    if (searchCriteria === 'name') col = 'full_name';
    if (searchCriteria === 'department') col = 'department';
    if (searchCriteria === 'designation') col = 'designation';
    addSqlLog(`PreparedStatement: SELECT * FROM employees WHERE ${col} LIKE '%${searchQuery.trim()}%'`);
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    addSqlLog(`PreparedStatement: SELECT * FROM employees ORDER BY employee_id ASC`);
  };

  const handleResetAllData = () => {
    setEmployees(INITIAL_EMPLOYEES);
    addSqlLog(`TRUNCATE TABLE employees; INSERT INTO employees VALUES (...) (8 seed records reloaded)`);
    setDialog({ type: 'info', title: 'Database Reset', message: 'Reset database to original 8 sample records.' });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
      {/* Desktop Window Title Bar (Simulating Java Swing JFrame) */}
      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 hover:opacity-80 transition cursor-pointer" onClick={() => setShowExitConfirm(true)} title="Close Frame" />
            <span className="w-3 h-3 rounded-full bg-amber-500 hover:opacity-80 transition cursor-pointer" title="Minimize Frame" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 hover:opacity-80 transition cursor-pointer" title="Maximize Frame" />
          </div>
          <div className="h-4 w-[1px] bg-slate-800 mx-1" />
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 tracking-wide">
            <span className="text-blue-400 font-bold">Java Swing:</span>
            <span>Employee Management System</span>
            <span className="text-slate-500 font-mono text-[11px]">(1100 × 720)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSqlDrawer(!showSqlDrawer)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition border border-slate-700"
            title="Inspect Live MySQL JDBC Queries"
          >
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span>JDBC Query Log</span>
            <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">{sqlLogs.length}</span>
          </button>
          <button 
            onClick={handleResetAllData}
            className="text-xs text-slate-400 hover:text-slate-200 transition px-2 py-1"
            title="Restore sample records"
          >
            Reset Seed Data
          </button>
        </div>
      </div>

      {/* Main Window Canvas: Sidebar + Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Dark Navy Blue Sidebar (Requirement 1 & 2) */}
        <div className="w-60 bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
          <div>
            {/* Branding */}
            <div className="p-5 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
                  EMS
                </div>
                <div>
                  <h1 className="text-sm font-bold text-white tracking-wide">CODSOFT EMS</h1>
                  <p className="text-[11px] text-slate-400">Garv Jangir · Java Edition</p>
                </div>
              </div>
            </div>

            {/* Navigation Options */}
            <nav className="p-3 space-y-1.5">
              <button
                onClick={() => setActiveTab('DASHBOARD')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-lg transition text-left ${
                  activeTab === 'DASHBOARD'
                    ? 'bg-blue-900/60 text-white font-semibold border-l-2 border-blue-500 shadow-inner'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4 text-blue-400 shrink-0" />
                <span>1. Dashboard</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('MANAGE');
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-lg transition text-left ${
                  activeTab === 'MANAGE'
                    ? 'bg-blue-900/60 text-white font-semibold border-l-2 border-blue-500 shadow-inner'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <Edit3 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>2. Manage Employees</span>
              </button>

              <button
                onClick={() => setActiveTab('SEARCH')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-lg transition text-left ${
                  activeTab === 'SEARCH'
                    ? 'bg-blue-900/60 text-white font-semibold border-l-2 border-blue-500 shadow-inner'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <Search className="w-4 h-4 text-amber-400 shrink-0" />
                <span>3. Search Employees</span>
              </button>

              <button
                onClick={() => setShowAbout(true)}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-lg text-slate-300 hover:bg-slate-800/70 hover:text-white transition text-left"
              >
                <Info className="w-4 h-4 text-purple-400 shrink-0" />
                <span>4. About</span>
              </button>

              <button
                onClick={() => setShowExitConfirm(true)}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-lg text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition text-left"
              >
                <LogOut className="w-4 h-4 text-rose-400 shrink-0" />
                <span>5. Exit</span>
              </button>
            </nav>
          </div>

          {/* Sidebar Footer Status */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/50">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div className="truncate">
                <p className="font-medium text-slate-300">MySQL 8.x (Local)</p>
                <p className="text-[10px] text-slate-500 truncate">employee_management_db</p>
              </div>
            </div>
          </div>
        </div>

        {/* Light Background Main Workspace (Requirement 1 & 2) */}
        <div className="flex-1 bg-[#F8FAFC] overflow-y-auto flex flex-col">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'DASHBOARD' && (
            <div className="p-6 space-y-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h2>
                  <p className="text-xs text-slate-500">Live operational statistics calculated from MySQL records</p>
                </div>
                <button
                  onClick={() => {
                    addSqlLog(`SELECT COUNT(*), COUNT(DISTINCT department), AVG(salary) FROM employees`);
                    setDialog({ type: 'info', title: 'Statistics Refreshed', message: 'Dashboard metrics synchronized with database.' });
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm transition"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                  <span>Refresh Statistics</span>
                </button>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Employees</p>
                    <p className="text-3xl font-extrabold text-blue-600 font-mono tabular-nums">{totalEmployees}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Active registered staff</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Departments</p>
                    <p className="text-3xl font-extrabold text-teal-600 font-mono tabular-nums">{uniqueDepartments}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Operating divisions</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Average Salary</p>
                    <p className="text-3xl font-extrabold text-purple-600 font-mono tabular-nums">
                      ${averageSalary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Monthly payroll average</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Recently Added Employees Table */}
              <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800">Recently Added Employees (Last 5 Records)</h3>
                  <button
                    onClick={() => setActiveTab('MANAGE')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
                  >
                    View All in Manage Panel →
                  </button>
                </div>

                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-4">Employee ID</th>
                        <th className="py-2.5 px-4">Full Name</th>
                        <th className="py-2.5 px-4">Department</th>
                        <th className="py-2.5 px-4">Designation</th>
                        <th className="py-2.5 px-4 text-right">Salary</th>
                        <th className="py-2.5 px-4 text-center">Joining Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                      {recentEmployees.map(emp => (
                        <tr key={emp.employeeId} className="hover:bg-blue-50/40 transition">
                          <td className="py-2.5 px-4 font-mono font-bold text-blue-900">{emp.employeeId}</td>
                          <td className="py-2.5 px-4 text-slate-900 font-semibold">{emp.fullName}</td>
                          <td className="py-2.5 px-4">{emp.department}</td>
                          <td className="py-2.5 px-4">{emp.designation}</td>
                          <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-900">
                            ${emp.salary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-4 text-center font-mono text-slate-500">{emp.dateOfJoining}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MANAGE EMPLOYEES */}
          {activeTab === 'MANAGE' && (
            <div className="p-6 space-y-5 flex-1 flex flex-col">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Manage Employee Records</h2>
                <p className="text-xs text-slate-500">Add, select, update, or remove records with real-time MySQL validation</p>
              </div>

              {/* Form Card (WindowBuilder compatible GridBagLayout simulation) */}
              <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-md space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                      Employee Details Form
                    </span>
                    {selectedId ? (
                      <span className="text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full border border-blue-300 flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Editing Selected: {selectedId} ({formData.fullName})</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Mode: Ready to Add New Employee</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickFillSample('dev')}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition"
                      title="Fill sample engineer data instantly"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      <span>Autofill Sample Dev</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFillSample('hr')}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-md transition"
                      title="Fill sample HR data instantly"
                    >
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      <span>Autofill Sample HR</span>
                    </button>
                    {selectedId && (
                      <button
                        type="button"
                        onClick={handleClearForm}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200"
                      >
                        + Switch to Add New
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Fields: All 100% visible, non-blocking, high-contrast */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 1. Employee ID */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      Employee ID <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.employeeId}
                      onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
                      placeholder="e.g. EMP109"
                      autoComplete="off"
                      className="w-full px-3.5 py-2.5 text-sm font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-lg placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none transition shadow-xs"
                    />
                  </div>

                  {/* 2. Full Name */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      Full Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Vikram Sharma"
                      autoComplete="off"
                      className="w-full px-3.5 py-2.5 text-sm font-semibold text-slate-900 bg-white border-2 border-slate-300 rounded-lg placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none transition shadow-xs"
                    />
                  </div>

                  {/* 3. Department */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      Department <span className="text-rose-600">*</span>
                    </label>
                    <select
                      value={formData.department}
                      onChange={e => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm font-semibold text-slate-900 bg-white border-2 border-slate-300 rounded-lg focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none transition shadow-xs"
                    >
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept} className="text-slate-900 bg-white">{dept}</option>
                      ))}
                    </select>
                  </div>

                  {/* 4. Designation */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      Designation <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.designation}
                      onChange={e => setFormData({ ...formData, designation: e.target.value })}
                      placeholder="e.g. Java Engineer"
                      autoComplete="off"
                      className="w-full px-3.5 py-2.5 text-sm font-semibold text-slate-900 bg-white border-2 border-slate-300 rounded-lg placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none transition shadow-xs"
                    />
                  </div>

                  {/* 5. Salary */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      Salary ($) <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={formData.salary}
                      onChange={e => setFormData({ ...formData, salary: e.target.value })}
                      placeholder="e.g. 75000"
                      autoComplete="off"
                      className="w-full px-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-lg placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none transition shadow-xs"
                    />
                  </div>

                  {/* 6. Contact Number */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      Contact Number <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.contactNumber}
                      onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                      placeholder="e.g. +919876543210"
                      autoComplete="off"
                      className="w-full px-3.5 py-2.5 text-sm font-semibold text-slate-900 bg-white border-2 border-slate-300 rounded-lg placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none transition shadow-xs"
                    />
                  </div>

                  {/* 7. Email Address */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      Email Address <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. vikram@codsoft.org"
                      autoComplete="off"
                      className="w-full px-3.5 py-2.5 text-sm font-semibold text-slate-900 bg-white border-2 border-slate-300 rounded-lg placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none transition shadow-xs"
                    />
                  </div>

                  {/* 8. Date of Joining */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-extrabold text-slate-800">
                        Date of Joining <span className="text-rose-600">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleSetToday}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-bold underline"
                      >
                        Set Today
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.dateOfJoining}
                        onChange={e => setFormData({ ...formData, dateOfJoining: e.target.value })}
                        placeholder="YYYY-MM-DD (e.g. 2026-10-15)"
                        autoComplete="off"
                        className="w-full px-3.5 py-2.5 text-sm font-mono font-semibold text-slate-900 bg-white border-2 border-slate-300 rounded-lg placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none transition shadow-xs pr-16"
                      />
                      <button
                        type="button"
                        onClick={handleSetToday}
                        className="absolute right-1.5 top-1.5 bottom-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded flex items-center gap-1 border border-slate-300 transition"
                      >
                        <Calendar className="w-3 h-3 text-blue-600" />
                        <span>Today</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Real-Time Live Keystroke Echo & Field Monitor */}
                <div className="bg-blue-50/60 border border-blue-200/90 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2 pb-1 border-b border-blue-200/60 text-xs">
                    <div className="flex items-center gap-2 font-bold text-blue-950">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Live Keystroke Echo (Instant Field Verification)</span>
                    </div>
                    <span className="text-[11px] text-blue-700 font-medium">
                      {formData.employeeId || formData.fullName ? '✓ Keystrokes Active & Stored in State' : 'Waiting for Keystroke Input'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-[11px]">
                    <div className="p-2 bg-white rounded border border-blue-200 shadow-2xs">
                      <span className="text-slate-500 block text-[9px] uppercase font-sans font-bold">ID:</span>
                      <span className="font-bold text-blue-800 break-all">{formData.employeeId || <span className="text-slate-400 italic">Empty</span>}</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-blue-200 shadow-2xs">
                      <span className="text-slate-500 block text-[9px] uppercase font-sans font-bold">Full Name:</span>
                      <span className="font-bold text-slate-900 break-all">{formData.fullName || <span className="text-slate-400 italic">Empty</span>}</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-blue-200 shadow-2xs">
                      <span className="text-slate-500 block text-[9px] uppercase font-sans font-bold">Dept & Role:</span>
                      <span className="font-semibold text-slate-800 break-all">{formData.department} · {formData.designation || <span className="text-slate-400 italic">Empty</span>}</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-blue-200 shadow-2xs">
                      <span className="text-slate-500 block text-[9px] uppercase font-sans font-bold">Salary:</span>
                      <span className="font-bold text-emerald-700">{formData.salary ? `$${formData.salary}` : <span className="text-slate-400 italic">Empty</span>}</span>
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                  <button
                    onClick={handleAddEmployee}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Employee</span>
                  </button>

                  <button
                    onClick={handleUpdateEmployee}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition active:scale-95"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Update Details</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!selectedId) {
                        setDialog({ type: 'warning', title: 'Selection Required', message: 'Please select an employee record from the table to delete.' });
                        return;
                      }
                      setShowDeleteConfirm(selectedId);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Record</span>
                  </button>

                  <button
                    onClick={handleClearForm}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Form</span>
                  </button>

                  <button
                    onClick={() => {
                      addSqlLog('SELECT * FROM employees ORDER BY employee_id ASC');
                      setDialog({ type: 'info', title: 'Table Refreshed', message: 'Records reloaded from database.' });
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition active:scale-95"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* JTable Records Grid */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="px-4 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    JTable: Employee Records ({employees.length} entries) — Click any row to select & edit
                  </span>
                  {selectedId && (
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      Selected: {selectedId}
                    </span>
                  )}
                </div>

                <div className="overflow-x-auto flex-1 max-h-[340px]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th className="py-2.5 px-3">Employee ID</th>
                        <th className="py-2.5 px-3">Full Name</th>
                        <th className="py-2.5 px-3">Department</th>
                        <th className="py-2.5 px-3">Designation</th>
                        <th className="py-2.5 px-3 text-right">Salary ($)</th>
                        <th className="py-2.5 px-3">Contact</th>
                        <th className="py-2.5 px-3">Email</th>
                        <th className="py-2.5 px-3 text-center">Joining Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {employees.map(emp => {
                        const isSelected = emp.employeeId === selectedId;
                        return (
                          <tr
                            key={emp.employeeId}
                            onClick={() => handleSelectRow(emp)}
                            className={`cursor-pointer transition ${
                              isSelected
                                ? 'bg-blue-100/90 text-blue-950 font-semibold'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <td className="py-2.5 px-3 font-mono font-bold">{emp.employeeId}</td>
                            <td className="py-2.5 px-3 font-semibold">{emp.fullName}</td>
                            <td className="py-2.5 px-3">{emp.department}</td>
                            <td className="py-2.5 px-3">{emp.designation}</td>
                            <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                              {emp.salary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-2.5 px-3 font-mono">{emp.contactNumber}</td>
                            <td className="py-2.5 px-3">{emp.email}</td>
                            <td className="py-2.5 px-3 text-center font-mono">{emp.dateOfJoining}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SEARCH EMPLOYEES */}
          {activeTab === 'SEARCH' && (
            <div className="p-6 space-y-5 flex-1 flex flex-col">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Search Employee Records</h2>
                <p className="text-xs text-slate-500">Query MySQL using secure PreparedStatement with wildcards (LIKE ?)</p>
              </div>

              {/* Search Criteria Bar */}
              <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700">Search By:</label>
                  <select
                    value={searchCriteria}
                    onChange={e => setSearchCriteria(e.target.value as any)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="name" className="text-slate-900 bg-white">Employee Name (Partial)</option>
                    <option value="id" className="text-slate-900 bg-white">Employee ID</option>
                    <option value="department" className="text-slate-900 bg-white">Department</option>
                    <option value="designation" className="text-slate-900 bg-white">Designation</option>
                  </select>
                </div>

                <div className="flex-1 min-w-[220px]">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Enter search keyword..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition active:scale-95"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Search</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetSearch}
                    className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                  >
                    Show All Employees
                  </button>
                </div>
              </form>

              {/* Search Results Table */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="px-4 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    Search Results ({filteredEmployees.length} matching {filteredEmployees.length === 1 ? 'employee' : 'employees'})
                  </span>
                  {isSearching && searchQuery && (
                    <span className="text-[11px] text-slate-500">
                      Query: <strong className="text-slate-800">"{searchQuery}"</strong> in {searchCriteria}
                    </span>
                  )}
                </div>

                {filteredEmployees.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-500">
                    <AlertTriangle className="w-10 h-10 text-amber-500 mb-2" />
                    <p className="font-bold text-slate-700 text-sm">No matching employee records found</p>
                    <p className="text-xs text-slate-400 max-w-sm mt-1">
                      No records matched "{searchQuery}". Try searching by another keyword or click "Show All Employees".
                    </p>
                    <button
                      onClick={handleResetSearch}
                      className="mt-4 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                    >
                      Reset Search Filter
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Employee ID</th>
                          <th className="py-2.5 px-3">Full Name</th>
                          <th className="py-2.5 px-3">Department</th>
                          <th className="py-2.5 px-3">Designation</th>
                          <th className="py-2.5 px-3 text-right">Salary ($)</th>
                          <th className="py-2.5 px-3">Contact</th>
                          <th className="py-2.5 px-3">Email</th>
                          <th className="py-2.5 px-3 text-center">Joining Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {filteredEmployees.map(emp => (
                          <tr key={emp.employeeId} className="hover:bg-blue-50/50 transition">
                            <td className="py-2.5 px-3 font-mono font-bold text-blue-900">{emp.employeeId}</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-900">{emp.fullName}</td>
                            <td className="py-2.5 px-3">{emp.department}</td>
                            <td className="py-2.5 px-3">{emp.designation}</td>
                            <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                              {emp.salary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-2.5 px-3 font-mono">{emp.contactNumber}</td>
                            <td className="py-2.5 px-3">{emp.email}</td>
                            <td className="py-2.5 px-3 text-center font-mono">{emp.dateOfJoining}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Live SQL Drawer (Slides in when user clicks JDBC Query Log) */}
        {showSqlDrawer && (
          <div className="w-80 bg-slate-950 border-l border-slate-800 flex flex-col shrink-0 text-slate-300 font-mono text-[11px] shadow-2xl">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>MySQL JDBC Telemetry</span>
              </div>
              <button 
                onClick={() => setShowSqlDrawer(false)}
                className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5"
              >
                ✕
              </button>
            </div>

            <div className="p-2 border-b border-slate-800/80 bg-slate-950 text-[10px] text-slate-400 flex items-center justify-between">
              <span>DRIVER: com.mysql.cj.jdbc.Driver</span>
              <button 
                onClick={() => setSqlLogs([])}
                className="text-slate-500 hover:text-slate-300 transition"
              >
                Clear
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
              {sqlLogs.map(log => (
                <div key={log.id} className="p-2 rounded bg-slate-900/90 border border-slate-800/80">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span>{log.time}</span>
                    <span className="text-emerald-400 font-semibold">{log.status}</span>
                  </div>
                  <p className="text-slate-200 break-words leading-relaxed select-all">
                    {log.query}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* JOptionPane Simulator Dialog */}
      {dialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-300 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between font-bold text-xs text-slate-800">
              <span>JOptionPane: {dialog.title}</span>
              <button onClick={() => setDialog(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-5 flex items-start gap-4">
              <div className="shrink-0">
                {dialog.type === 'info' && <CheckCircle2 className="w-8 h-8 text-blue-600" />}
                {dialog.type === 'warning' && <AlertTriangle className="w-8 h-8 text-amber-500" />}
                {dialog.type === 'error' && <XCircle className="w-8 h-8 text-rose-600" />}
              </div>
              <div className="text-xs text-slate-700 leading-relaxed pt-1">
                <p className="font-semibold text-slate-900 mb-1">{dialog.title}</p>
                <p>{dialog.message}</p>
              </div>
            </div>
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setDialog(null)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-300 overflow-hidden">
            <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 font-bold text-xs text-slate-800">
              JOptionPane.showConfirmDialog: Confirm Record Deletion
            </div>
            <div className="p-5 flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-rose-500 shrink-0" />
              <div className="text-xs text-slate-700 leading-relaxed pt-1">
                <p className="font-semibold text-slate-900 mb-1">Permanent Deletion Warning</p>
                <p>Are you sure you want to permanently delete employee record <strong>{showDeleteConfirm}</strong> from the MySQL database?</p>
              </div>
            </div>
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition"
              >
                No / Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full border border-slate-300 overflow-hidden">
            <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 font-bold text-xs text-slate-800">
              Confirm Exit
            </div>
            <div className="p-5 flex items-start gap-4">
              <LogOut className="w-7 h-7 text-slate-600 shrink-0" />
              <div className="text-xs text-slate-700 leading-relaxed pt-1">
                <p className="font-semibold text-slate-900 mb-1">Exit Application?</p>
                <p>Are you sure you want to exit the Employee Management System desktop application?</p>
              </div>
            </div>
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  setDialog({ type: 'info', title: 'System Exit', message: 'In desktop Java, System.exit(0) safely closes all windows and terminates the JVM process.' });
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition"
              >
                Exit EMS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Dialog (Requirement 9 & Sidebar) */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-300 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-blue-900 text-white px-4 py-3 flex items-center justify-between">
              <span className="font-bold text-xs tracking-wide">About Employee Management System</span>
              <button onClick={() => setShowAbout(false)} className="text-blue-200 hover:text-white">✕</button>
            </div>
            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  GJ
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Employee Management System</h4>
                  <p className="text-slate-500">Desktop Java Swing Application</p>
                </div>
              </div>

              <div className="space-y-2 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Developer:</span>
                  <span className="font-bold text-slate-900">Garv Jangir</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Email:</span>
                  <a href="mailto:garvsharma0033@gmail.com" className="font-mono text-blue-600 hover:underline">
                    garvsharma0033@gmail.com
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Organization:</span>
                  <span className="font-bold text-slate-900">CODSOFT</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Track:</span>
                  <span className="text-slate-800">Java Programmer Internship</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Tech Stack:</span>
                  <span className="text-slate-800">Java Swing · JDBC · MySQL</span>
                </div>
              </div>

              <p className="text-slate-500 text-[11px] leading-relaxed">
                Developed in adherence to standard software engineering patterns (DAO, Layered MVC, PreparedStatement) for evaluation during the CODSOFT Internship.
              </p>
            </div>
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowAbout(false)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
