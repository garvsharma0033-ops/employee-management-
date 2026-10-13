import React, { useState } from 'react';
import { Database, Copy, Check, Table2, Key, ShieldCheck, Code2 } from 'lucide-react';
import { INITIAL_EMPLOYEES } from '../data/initialEmployees';

export const DatabaseViewer: React.FC = () => {
  const [copiedSql, setCopiedSql] = useState(false);

  const sqlScript = `CREATE DATABASE IF NOT EXISTS employee_management_db;
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
('EMP108', 'Sneha Reddy', 'Operations', 'Operations Coordinator', 48000.00, '+919210987654', 'sneha.reddy@codsoft.org', '2024-03-01');`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const schemaColumns = [
    { field: 'employee_id', type: 'VARCHAR(50)', nullAllowed: 'NO', key: 'PRI', desc: 'Unique alphanumeric identifier (Primary Key)' },
    { field: 'full_name', type: 'VARCHAR(100)', nullAllowed: 'NO', key: '', desc: 'Full legal name of the employee' },
    { field: 'department', type: 'VARCHAR(100)', nullAllowed: 'NO', key: '', desc: 'Department division (Engineering, HR, etc.)' },
    { field: 'designation', type: 'VARCHAR(100)', nullAllowed: 'NO', key: '', desc: 'Official corporate title or job role' },
    { field: 'salary', type: 'DOUBLE', nullAllowed: 'NO', key: '', desc: 'Monthly compensation figure (> 0)' },
    { field: 'contact_number', type: 'VARCHAR(20)', nullAllowed: 'NO', key: '', desc: 'Phone contact number with optional country code' },
    { field: 'email', type: 'VARCHAR(100)', nullAllowed: 'NO', key: '', desc: 'Corporate email address format validated' },
    { field: 'date_of_joining', type: 'DATE', nullAllowed: 'NO', key: '', desc: 'ISO Date of onboarding (YYYY-MM-DD)' }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-y-auto border border-slate-700 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">MySQL Database Architecture</h2>
            <p className="text-xs text-slate-400">Database: <code className="text-emerald-400 font-mono">employee_management_db</code> · Table: <code className="text-emerald-400 font-mono">employees</code></p>
          </div>
        </div>

        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition active:scale-95"
        >
          {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copiedSql ? 'SQL Script Copied!' : 'Copy Full SQL Script'}</span>
        </button>
      </div>

      {/* Connection Parameter Pill Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">JDBC URL</span>
          <code className="text-xs text-blue-300 font-mono break-all">jdbc:mysql://localhost:3306/employee_management_db</code>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Driver Class</span>
          <code className="text-xs text-emerald-300 font-mono break-all">com.mysql.cj.jdbc.Driver</code>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Default User</span>
          <code className="text-xs text-amber-300 font-mono">root</code>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Security Model</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>PreparedStatement ONLY</span>
          </div>
        </div>
      </div>

      {/* Table Schema */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table2 className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Table Schema: employees</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">8 columns · PRIMARY KEY (employee_id)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Field Name</th>
                <th className="py-2.5 px-4">Data Type</th>
                <th className="py-2.5 px-4 text-center">Null</th>
                <th className="py-2.5 px-4 text-center">Key</th>
                <th className="py-2.5 px-4">Description & Constraints</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {schemaColumns.map(col => (
                <tr key={col.field} className="hover:bg-slate-900/50 transition">
                  <td className="py-2.5 px-4 font-bold text-blue-400">{col.field}</td>
                  <td className="py-2.5 px-4 text-emerald-300">{col.type}</td>
                  <td className="py-2.5 px-4 text-center text-slate-400">{col.nullAllowed}</td>
                  <td className="py-2.5 px-4 text-center">
                    {col.key === 'PRI' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 text-amber-400 border border-amber-800/60">
                        <Key className="w-3 h-3" /> PK
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 font-sans text-slate-300">{col.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SQL Script Viewer */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">database.sql Creation Script</span>
          </div>
          <button
            onClick={copyToClipboard}
            className="text-xs text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy SQL</span>
          </button>
        </div>

        <div className="p-4 font-mono text-xs text-slate-300 bg-slate-950/90 overflow-x-auto">
          <pre className="select-text whitespace-pre leading-relaxed">
            <code>{sqlScript}</code>
          </pre>
        </div>
      </div>

      {/* Seed Records Preview */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Default Seed Records (8 Employees)</span>
          <span className="text-xs text-slate-400 font-mono">Ready for testing</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="py-2 px-3">ID</th>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Department</th>
                <th className="py-2 px-3">Designation</th>
                <th className="py-2 px-3 text-right">Salary</th>
                <th className="py-2 px-3">Contact</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3 text-center">Joining Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {INITIAL_EMPLOYEES.map(emp => (
                <tr key={emp.employeeId} className="hover:bg-slate-900/50">
                  <td className="py-2 px-3 font-mono font-bold text-blue-400">{emp.employeeId}</td>
                  <td className="py-2 px-3 text-white font-medium">{emp.fullName}</td>
                  <td className="py-2 px-3">{emp.department}</td>
                  <td className="py-2 px-3">{emp.designation}</td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-emerald-400">
                    ${emp.salary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2 px-3 font-mono text-slate-400">{emp.contactNumber}</td>
                  <td className="py-2 px-3 text-slate-400">{emp.email}</td>
                  <td className="py-2 px-3 text-center font-mono text-slate-400">{emp.dateOfJoining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
