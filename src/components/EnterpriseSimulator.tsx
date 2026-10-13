import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Building2, 
  CalendarCheck, 
  Receipt, 
  FileCheck2, 
  Plus, 
  Check, 
  X, 
  Clock, 
  ShieldAlert, 
  ShieldCheck, 
  Printer, 
  ChevronRight,
  TrendingUp,
  CreditCard
} from 'lucide-react';

export type UserRole = 'ROLE_ADMIN' | 'ROLE_HR_MANAGER' | 'ROLE_DEPT_LEAD' | 'ROLE_EMPLOYEE';

interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  type: string;
  status: 'ACTIVE' | 'ON_LEAVE';
  baseSalary: number;
  emergencyContact: string;
}

interface LeaveRequestItem {
  id: number;
  empId: string;
  empName: string;
  type: 'ANNUAL' | 'SICK' | 'CASUAL';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface AttendanceRecord {
  date: string;
  clockIn: string;
  clockOut: string | null;
  hours: number | null;
  status: 'PRESENT' | 'REMOTE' | 'HALF_DAY';
}

export const EnterpriseSimulator: React.FC = () => {
  // Current active RBAC role
  const [currentRole, setCurrentRole] = useState<UserRole>('ROLE_HR_MANAGER');
  const [activeModule, setActiveModule] = useState<'DASHBOARD' | 'DIRECTORY' | 'LEAVE_ATTENDANCE' | 'PAYROLL' | 'API_CONSOLE'>('DASHBOARD');

  // Employee profiles state
  const [employees, setEmployees] = useState<EmployeeProfile[]>([
    {
      id: 'EMP-1001',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@enterprise.io',
      phone: '+1-555-0101',
      department: 'Software Engineering',
      designation: 'Senior Backend Engineer',
      type: 'FULL_TIME',
      status: 'ACTIVE',
      baseSalary: 96000,
      emergencyContact: 'Sunita Sharma (+1-555-0199)'
    },
    {
      id: 'EMP-1002',
      name: 'Priya Patel',
      email: 'hr@enterprise.io',
      phone: '+1-555-0102',
      department: 'Human Resources',
      designation: 'HR Operations Lead',
      type: 'FULL_TIME',
      status: 'ACTIVE',
      baseSalary: 78000,
      emergencyContact: 'Rajesh Patel (+1-555-0198)'
    },
    {
      id: 'EMP-1003',
      name: 'David Kowalski',
      email: 'lead@enterprise.io',
      phone: '+1-555-0103',
      department: 'Software Engineering',
      designation: 'Engineering Lead',
      type: 'FULL_TIME',
      status: 'ACTIVE',
      baseSalary: 120000,
      emergencyContact: 'Anna Kowalski (+1-555-0197)'
    },
    {
      id: 'EMP-1004',
      name: 'Elena Rostova',
      email: 'elena.r@enterprise.io',
      phone: '+1-555-0104',
      department: 'Finance & Accounting',
      designation: 'Senior Financial Controller',
      type: 'FULL_TIME',
      status: 'ON_LEAVE',
      baseSalary: 89000,
      emergencyContact: 'Igor Rostov (+1-555-0196)'
    },
    {
      id: 'EMP-1005',
      name: 'Marcus Chen',
      email: 'marcus.c@enterprise.io',
      phone: '+1-555-0105',
      department: 'Product Marketing',
      designation: 'Growth Marketing Manager',
      type: 'FULL_TIME',
      status: 'ACTIVE',
      baseSalary: 82000,
      emergencyContact: 'Mei Chen (+1-555-0195)'
    }
  ]);

  // Leave Requests state
  const [leaves, setLeaves] = useState<LeaveRequestItem[]>([
    {
      id: 101,
      empId: 'EMP-1001',
      empName: 'Aarav Sharma',
      type: 'ANNUAL',
      startDate: '2026-10-20',
      endDate: '2026-10-23',
      days: 4,
      reason: 'Family annual vacation trip',
      status: 'PENDING'
    },
    {
      id: 102,
      empId: 'EMP-1004',
      empName: 'Elena Rostova',
      type: 'SICK',
      startDate: '2026-10-05',
      endDate: '2026-10-06',
      days: 2,
      reason: 'Seasonal viral recovery',
      status: 'APPROVED'
    }
  ]);

  // Attendance Tracker state
  const [clockedIn, setClockedIn] = useState<boolean>(false);
  const [clockInTime, setClockInTime] = useState<string>('09:02 AM');
  const [attendanceLog, setAttendanceLog] = useState<AttendanceRecord[]>([
    { date: '2026-10-12', clockIn: '08:58 AM', clockOut: '05:32 PM', hours: 8.5, status: 'PRESENT' },
    { date: '2026-10-11', clockIn: '09:05 AM', clockOut: '05:40 PM', hours: 8.6, status: 'REMOTE' },
    { date: '2026-10-10', clockIn: '09:12 AM', clockOut: '05:15 PM', hours: 8.0, status: 'PRESENT' }
  ]);

  // Leave Application Form state
  const [leaveForm, setLeaveForm] = useState({
    type: 'ANNUAL' as 'ANNUAL' | 'SICK' | 'CASUAL',
    startDate: '',
    endDate: '',
    days: 1,
    reason: ''
  });

  // Selected employee for Payslip Preview
  const [selectedPayslipEmp, setSelectedPayslipEmp] = useState<EmployeeProfile | null>(null);

  // New Employee Modal state
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [newEmpForm, setNewEmpForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Software Engineering',
    designation: '',
    salary: 80000,
    emergencyContact: ''
  });

  // Toast notice
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Clock in / out handlers
  const handleToggleClock = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (!clockedIn) {
      setClockedIn(true);
      setClockInTime(timeStr);
      showToast(`Clocked In successfully at ${timeStr}`);
    } else {
      setClockedIn(false);
      const newRecord: AttendanceRecord = {
        date: now.toISOString().split('T')[0],
        clockIn: clockInTime,
        clockOut: timeStr,
        hours: 8.2,
        status: 'PRESENT'
      };
      setAttendanceLog([newRecord, ...attendanceLog]);
      showToast(`Clocked Out at ${timeStr}. Session recorded.`);
    }
  };

  // Leave Application handler
  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason.trim()) {
      showToast('Please fill all required leave details');
      return;
    }
    const newLeave: LeaveRequestItem = {
      id: Math.floor(Math.random() * 9000) + 1000,
      empId: 'EMP-1001',
      empName: 'Aarav Sharma',
      type: leaveForm.type,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      days: Number(leaveForm.days) || 1,
      reason: leaveForm.reason,
      status: 'PENDING'
    };
    setLeaves([newLeave, ...leaves]);
    setLeaveForm({ type: 'ANNUAL', startDate: '', endDate: '', days: 1, reason: '' });
    showToast('Leave request submitted for Manager approval');
  };

  // Leave approval / rejection
  const handleApproveLeave = (id: number, approved: boolean) => {
    if (currentRole === 'ROLE_EMPLOYEE') {
      showToast('Access Denied (403): Standard Employees cannot approve leaves');
      return;
    }
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: approved ? 'APPROVED' : 'REJECTED' } : l));
    showToast(approved ? 'Leave request approved successfully' : 'Leave request rejected');
  };

  // Add Employee handler
  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpForm.firstName || !newEmpForm.lastName || !newEmpForm.email) {
      showToast('Please fill all required employee attributes');
      return;
    }
    const newEmp: EmployeeProfile = {
      id: `EMP-${1000 + employees.length + 1}`,
      name: `${newEmpForm.firstName} ${newEmpForm.lastName}`,
      email: newEmpForm.email,
      phone: newEmpForm.phone || '+1-555-0180',
      department: newEmpForm.department,
      designation: newEmpForm.designation || 'Software Engineer',
      type: 'FULL_TIME',
      status: 'ACTIVE',
      baseSalary: Number(newEmpForm.salary) || 75000,
      emergencyContact: newEmpForm.emergencyContact || 'Not Specified'
    };
    setEmployees([...employees, newEmp]);
    setShowAddEmpModal(false);
    showToast(`Employee ${newEmp.name} (${newEmp.id}) added to enterprise registry`);
  };

  // Salary calculations
  const calculatePayroll = (base: number) => {
    const monthlyBase = base / 12;
    const hra = monthlyBase * 0.20;
    const specialAllowance = monthlyBase * 0.15;
    const gross = monthlyBase + hra + specialAllowance;
    const pf = monthlyBase * 0.05;
    const tax = gross * 0.12;
    const net = gross - pf - tax;
    return { monthlyBase, hra, specialAllowance, gross, pf, tax, net };
  };

  // Permission helpers
  const canManageEmployees = currentRole === 'ROLE_ADMIN' || currentRole === 'ROLE_HR_MANAGER';
  const canApproveLeaves = currentRole === 'ROLE_ADMIN' || currentRole === 'ROLE_HR_MANAGER' || currentRole === 'ROLE_DEPT_LEAD';

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
      {/* Top RBAC & Role Switcher Toolbar */}
      <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow">
            EMS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-wide">Enterprise Spring Boot EMS</h2>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                JWT Auth Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Spring Security 6 · Spring Data JPA · MySQL 8.x</p>
          </div>
        </div>

        {/* Live RBAC Persona Selector */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-lg border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 pl-2">RBAC Persona:</span>
          {(['ROLE_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_DEPT_LEAD', 'ROLE_EMPLOYEE'] as UserRole[]).map(r => (
            <button
              key={r}
              onClick={() => {
                setCurrentRole(r);
                showToast(`Switched active security token to: ${r}`);
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                currentRole === r
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {r.replace('ROLE_', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="bg-slate-950/60 px-5 border-b border-slate-800 flex items-center gap-6 text-xs font-medium text-slate-400">
        <button
          onClick={() => setActiveModule('DASHBOARD')}
          className={`py-2.5 transition whitespace-nowrap ${
            activeModule === 'DASHBOARD' ? 'text-blue-400 font-bold border-b-2 border-blue-400' : 'hover:text-white'
          }`}
        >
          Executive HR Dashboard
        </button>
        <button
          onClick={() => setActiveModule('DIRECTORY')}
          className={`py-2.5 transition whitespace-nowrap ${
            activeModule === 'DIRECTORY' ? 'text-blue-400 font-bold border-b-2 border-blue-400' : 'hover:text-white'
          }`}
        >
          Employee Directory ({employees.length})
        </button>
        <button
          onClick={() => setActiveModule('LEAVE_ATTENDANCE')}
          className={`py-2.5 transition whitespace-nowrap ${
            activeModule === 'LEAVE_ATTENDANCE' ? 'text-blue-400 font-bold border-b-2 border-blue-400' : 'hover:text-white'
          }`}
        >
          Attendance & Leave Approvals
        </button>
        <button
          onClick={() => setActiveModule('PAYROLL')}
          className={`py-2.5 transition whitespace-nowrap ${
            activeModule === 'PAYROLL' ? 'text-blue-400 font-bold border-b-2 border-blue-400' : 'hover:text-white'
          }`}
        >
          Payroll & Compensation
        </button>
      </div>

      {/* Main Module Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-900/60">
        {/* MODULE 1: EXECUTIVE HR DASHBOARD */}
        {activeModule === 'DASHBOARD' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Headcount</span>
                  <p className="text-2xl font-extrabold text-blue-400 font-mono tabular-nums">{employees.length}</p>
                  <p className="text-[10px] text-slate-500 mt-1">100% full-time employees</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800 text-blue-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Active Departments</span>
                  <p className="text-2xl font-extrabold text-teal-400 font-mono tabular-nums">4</p>
                  <p className="text-[10px] text-slate-500 mt-1">Eng, HR, Finance, Marketing</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-teal-950/80 border border-teal-800 text-teal-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pending Leaves</span>
                  <p className="text-2xl font-extrabold text-amber-400 font-mono tabular-nums">
                    {leaves.filter(l => l.status === 'PENDING').length}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">Requiring manager review</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Monthly Payroll</span>
                  <p className="text-2xl font-extrabold text-purple-400 font-mono tabular-nums">
                    ${Math.round(employees.reduce((acc, curr) => acc + curr.baseSalary, 0) / 12).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">Disbursed on 1st of month</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800 text-purple-400 flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* OKR & Department Breakdown Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Department Distribution */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Department Allocation</h3>
                  <span className="text-xs text-slate-400">Headcount</span>
                </div>
                <div className="space-y-3">
                  {[
                    { dept: 'Software Engineering', count: 2, pct: '40%' },
                    { dept: 'Human Resources', count: 1, pct: '20%' },
                    { dept: 'Finance & Accounting', count: 1, pct: '20%' },
                    { dept: 'Product Marketing', count: 1, pct: '20%' }
                  ].map(d => (
                    <div key={d.dept} className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>{d.dept}</span>
                        <span className="font-mono">{d.count} ({d.pct})</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: d.pct }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Goal Tracking & OKR Performance */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Company OKRs (Q4 2026)</h3>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono font-bold">84% On Track</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="flex justify-between text-white font-medium mb-1">
                      <span>Migrate Core Monolith to Spring Boot 3 & MySQL 8</span>
                      <span className="text-emerald-400 font-mono">100%</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Target completion: Completed ahead of schedule</p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="flex justify-between text-white font-medium mb-1">
                      <span>Roll out RBAC Security & Automated Payslip Generation</span>
                      <span className="text-blue-400 font-mono">90%</span>
                    </div>
                    <p className="text-[11px] text-slate-400">PDFBox payslip renderer active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 2: EMPLOYEE DIRECTORY & PROFILES */}
        {activeModule === 'DIRECTORY' && (
          <div className="space-y-5 max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Enterprise Employee Directory</h3>
                <p className="text-xs text-slate-400">Full JPA Employee entity profiles with Department relations and compensation tier</p>
              </div>

              {canManageEmployees && (
                <button
                  onClick={() => setShowAddEmpModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Onboard New Employee</span>
                </button>
              )}
            </div>

            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Employee ID</th>
                    <th className="py-2.5 px-4">Full Name</th>
                    <th className="py-2.5 px-4">Department</th>
                    <th className="py-2.5 px-4">Designation</th>
                    <th className="py-2.5 px-4 text-right">Base Salary</th>
                    <th className="py-2.5 px-4">Emergency Contact</th>
                    <th className="py-2.5 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  {employees.map(emp => (
                    <tr key={emp.id} className="hover:bg-slate-900/40 transition">
                      <td className="py-2.5 px-4 font-mono font-bold text-blue-400">{emp.id}</td>
                      <td className="py-2.5 px-4">
                        <div className="font-semibold text-white">{emp.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{emp.email}</div>
                      </td>
                      <td className="py-2.5 px-4">{emp.department}</td>
                      <td className="py-2.5 px-4">{emp.designation}</td>
                      <td className="py-2.5 px-4 text-right font-mono tabular-nums text-emerald-400">
                        ${emp.baseSalary.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-slate-400">{emp.emergencyContact}</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          emp.status === 'ACTIVE' 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE 3: ATTENDANCE & LEAVE MANAGEMENT */}
        {activeModule === 'LEAVE_ATTENDANCE' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Clock-In / Clock-Out Widget */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Daily Attendance Punch-In</h4>
                  <p className="text-xs text-slate-400">
                    Logged in as: <strong className="text-slate-200">Aarav Sharma (EMP-1001)</strong> · Current IP: 192.168.1.104
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Status:</span>
                  <span className={`text-xs font-bold ${clockedIn ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {clockedIn ? `Clocked In (${clockInTime})` : 'Not Clocked In'}
                  </span>
                </div>

                <button
                  onClick={handleToggleClock}
                  className={`px-4 py-2 text-xs font-bold rounded-lg shadow-sm transition active:scale-95 text-white ${
                    clockedIn ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {clockedIn ? 'Clock Out for Day' : 'Clock In Now'}
                </button>
              </div>
            </div>

            {/* Attendance & Leave Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Leave Application Form */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                  Apply for Leave
                </h4>
                <form onSubmit={handleApplyLeave} className="space-y-3 text-xs dark-input">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Leave Category</label>
                    <select
                      value={leaveForm.type}
                      onChange={e => setLeaveForm({ ...leaveForm, type: e.target.value as any })}
                      className="dark-input w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-medium focus:border-blue-500 focus:outline-none"
                    >
                      <option value="ANNUAL">Annual Leave (18 Days Remaining)</option>
                      <option value="SICK">Sick Leave (12 Days Remaining)</option>
                      <option value="CASUAL">Casual Leave (6 Days Remaining)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Start Date</label>
                      <input
                        type="date"
                        value={leaveForm.startDate}
                        onChange={e => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                        className="dark-input w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-medium focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">End Date</label>
                      <input
                        type="date"
                        value={leaveForm.endDate}
                        onChange={e => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                        className="dark-input w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-medium focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Reason for Leave</label>
                    <textarea
                      rows={2}
                      value={leaveForm.reason}
                      onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                      placeholder="Brief description for manager approval..."
                      className="dark-input w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-medium placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                  >
                    Submit Leave Request
                  </button>
                </form>
              </div>

              {/* Leave Requests & Manager Approval Table */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Leave Request Approvals ({leaves.length})
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {canApproveLeaves ? 'You have approval privileges' : 'Read-only view'}
                  </span>
                </div>

                <div className="space-y-3">
                  {leaves.map(l => (
                    <div key={l.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white">{l.empName}</span>
                          <span className="text-slate-500 font-mono ml-1.5">({l.empId})</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          l.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                          l.status === 'REJECTED' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                          'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {l.status}
                        </span>
                      </div>

                      <div className="text-slate-300">
                        <span className="font-medium text-blue-400">{l.type} Leave:</span> {l.startDate} to {l.endDate} ({l.days} days)
                      </div>
                      <p className="text-[11px] text-slate-400 italic">"{l.reason}"</p>

                      {l.status === 'PENDING' && canApproveLeaves && (
                        <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/60">
                          <button
                            onClick={() => handleApproveLeave(l.id, false)}
                            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-rose-300 bg-rose-950/60 hover:bg-rose-900 rounded border border-rose-800 transition"
                          >
                            <X className="w-3 h-3" /> Reject
                          </button>
                          <button
                            onClick={() => handleApproveLeave(l.id, true)}
                            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition"
                          >
                            <Check className="w-3 h-3" /> Approve
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 4: PAYROLL & COMPENSATION */}
        {activeModule === 'PAYROLL' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Automated Payroll & Salary Structures</h3>
              <p className="text-xs text-slate-400">Monthly compensation engine: Base + HRA + Allowances - PF - Tax Deductions</p>
            </div>

            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Employee</th>
                    <th className="py-2.5 px-4 text-right">Annual Base</th>
                    <th className="py-2.5 px-4 text-right">Monthly Gross</th>
                    <th className="py-2.5 px-4 text-right">Deductions (PF + Tax)</th>
                    <th className="py-2.5 px-4 text-right">Net Take-Home</th>
                    <th className="py-2.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  {employees.map(emp => {
                    const pay = calculatePayroll(emp.baseSalary);
                    return (
                      <tr key={emp.id} className="hover:bg-slate-900/40 transition">
                        <td className="py-2.5 px-4">
                          <span className="font-bold text-white">{emp.name}</span>
                          <span className="text-[11px] text-slate-500 font-mono ml-2">({emp.id})</span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono tabular-nums">
                          ${emp.baseSalary.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono tabular-nums text-blue-300">
                          ${pay.gross.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono tabular-nums text-rose-300">
                          -${(pay.pf + pay.tax).toFixed(2)}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono tabular-nums text-emerald-400 font-bold">
                          ${pay.net.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <button
                            onClick={() => setSelectedPayslipEmp(emp)}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition"
                          >
                            View Payslip (PDF)
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Payslip Modal (Simulating PDFBox Generator) */}
      {selectedPayslipEmp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white text-slate-900 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base tracking-wide">ENTERPRISE TECHNOLOGIES INC.</h3>
                <p className="text-xs text-slate-400">Monthly Compensation Slip · October 2026</p>
              </div>
              <button onClick={() => setSelectedPayslipEmp(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Payslip Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-slate-500 block">Employee Name:</span>
                  <strong className="text-slate-800 text-sm">{selectedPayslipEmp.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Employee ID:</span>
                  <strong className="text-slate-800 font-mono">{selectedPayslipEmp.id}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Department:</span>
                  <span className="text-slate-800">{selectedPayslipEmp.department}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Designation:</span>
                  <span className="text-slate-800">{selectedPayslipEmp.designation}</span>
                </div>
              </div>

              {/* Earnings & Deductions Table */}
              {(() => {
                const pay = calculatePayroll(selectedPayslipEmp.baseSalary);
                return (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Earnings */}
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                        <span className="font-bold text-slate-700 block mb-1">Earnings</span>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Basic Salary:</span>
                          <span className="font-mono">${pay.monthlyBase.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">HRA Allowance:</span>
                          <span className="font-mono">${pay.hra.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Special Allowance:</span>
                          <span className="font-mono">${pay.specialAllowance.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900">
                          <span>Gross Earnings:</span>
                          <span className="font-mono">${pay.gross.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Deductions */}
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                        <span className="font-bold text-slate-700 block mb-1">Deductions</span>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Provident Fund (5%):</span>
                          <span className="font-mono">-${pay.pf.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Income Tax (12%):</span>
                          <span className="font-mono">-${pay.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-5 border-t border-slate-200 font-bold text-rose-700">
                          <span>Total Deductions:</span>
                          <span className="font-mono">-${(pay.pf + pay.tax).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Net Total Box */}
                    <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 flex items-center justify-between">
                      <span className="font-bold text-emerald-900 text-sm">NET PAYABLE AMOUNT:</span>
                      <span className="text-xl font-extrabold text-emerald-700 font-mono">
                        ${pay.net.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Footer */}
            <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Rendered via Spring Boot Apache PDFBox Engine</span>
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboard Employee Modal */}
      {showAddEmpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-950 border border-slate-800 text-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider">Register New Employee (Spring Data JPA)</h4>
              <button onClick={() => setShowAddEmpModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAddEmployee} className="p-5 space-y-3 text-xs dark-input">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={newEmpForm.firstName}
                    onChange={e => setNewEmpForm({ ...newEmpForm, firstName: e.target.value })}
                    className="dark-input w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newEmpForm.lastName}
                    onChange={e => setNewEmpForm({ ...newEmpForm, lastName: e.target.value })}
                    className="dark-input w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmpForm.email}
                  onChange={e => setNewEmpForm({ ...newEmpForm, email: e.target.value })}
                  className="dark-input w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-medium focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Department</label>
                  <select
                    value={newEmpForm.department}
                    onChange={e => setNewEmpForm({ ...newEmpForm, department: e.target.value })}
                    className="dark-input w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-medium focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                    <option value="Product Marketing">Product Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Base Salary ($)</label>
                  <input
                    type="number"
                    value={newEmpForm.salary}
                    onChange={e => setNewEmpForm({ ...newEmpForm, salary: Number(e.target.value) })}
                    className="dark-input w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Designation</label>
                <input
                  type="text"
                  value={newEmpForm.designation}
                  onChange={e => setNewEmpForm({ ...newEmpForm, designation: e.target.value })}
                  placeholder="e.g. Lead Engineer"
                  className="dark-input w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-medium placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddEmpModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow"
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-slate-950 border border-blue-500/80 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-2">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};
