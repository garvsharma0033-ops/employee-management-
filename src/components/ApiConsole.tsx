import React, { useState } from 'react';
import { Play, Copy, Check, Terminal, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

interface EndpointSpec {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  roleRequired: string;
  summary: string;
  sampleBody?: string;
  mockResponse: {
    status: number;
    data: any;
  };
}

export const ApiConsole: React.FC = () => {
  const endpoints: EndpointSpec[] = [
    {
      method: 'POST',
      path: '/auth/login',
      roleRequired: 'PUBLIC (PermitAll)',
      summary: 'Authenticate credentials and obtain JWT Bearer token',
      sampleBody: JSON.stringify({ username: "hrmanager", password: "password123" }, null, 2),
      mockResponse: {
        status: 200,
        data: {
          tokenType: "Bearer",
          accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJocm1hbmFnZXIiLCJyb2xlcyI6WyJST0xFX0hSX01BTkFHRVIiXSwiaWF0IjoxNzg0ODMyMDB9.EXAMPLE_SIGNATURE",
          expiresInSeconds: 86400,
          username: "hrmanager",
          roles: ["ROLE_HR_MANAGER"]
        }
      }
    },
    {
      method: 'GET',
      path: '/employees?page=0&size=10',
      roleRequired: 'ROLE_ADMIN, ROLE_HR_MANAGER, ROLE_DEPT_LEAD',
      summary: 'Retrieve paginated list of employees with department relations',
      mockResponse: {
        status: 200,
        data: {
          content: [
            {
              id: "EMP-1001",
              fullName: "Aarav Sharma",
              email: "aarav.sharma@enterprise.io",
              departmentName: "Software Engineering",
              designation: "Senior Backend Engineer",
              baseSalary: 96000.0,
              status: "ACTIVE"
            },
            {
              id: "EMP-1002",
              fullName: "Priya Patel",
              email: "hr@enterprise.io",
              departmentName: "Human Resources",
              designation: "HR Operations Lead",
              baseSalary: 78000.0,
              status: "ACTIVE"
            }
          ],
          totalElements: 5,
          totalPages: 1,
          size: 10,
          number: 0
        }
      }
    },
    {
      method: 'POST',
      path: '/employees',
      roleRequired: 'ROLE_ADMIN, ROLE_HR_MANAGER',
      summary: 'Onboard a new employee with @Valid payload constraints',
      sampleBody: JSON.stringify({
        firstName: "Vikram",
        lastName: "Sharma",
        email: "vikram.s@enterprise.io",
        phone: "+1-555-0177",
        departmentId: 1,
        designation: "Full Stack Engineer",
        employmentType: "FULL_TIME",
        baseSalary: 85000.0,
        dateOfJoining: "2026-10-15"
      }, null, 2),
      mockResponse: {
        status: 201,
        data: {
          id: "EMP-1006",
          fullName: "Vikram Sharma",
          email: "vikram.s@enterprise.io",
          departmentName: "Software Engineering",
          designation: "Full Stack Engineer",
          status: "ACTIVE",
          dateOfJoining: "2026-10-15"
        }
      }
    },
    {
      method: 'POST',
      path: '/leaves/apply',
      roleRequired: 'ROLE_EMPLOYEE, ROLE_DEPT_LEAD, ROLE_HR_MANAGER',
      summary: 'Submit leave request with balance verification',
      sampleBody: JSON.stringify({
        leaveType: "ANNUAL",
        startDate: "2026-11-01",
        endDate: "2026-11-04",
        daysCount: 4,
        reason: "Family wedding event"
      }, null, 2),
      mockResponse: {
        status: 201,
        data: {
          id: 105,
          employeeId: "EMP-1001",
          leaveType: "ANNUAL",
          daysCount: 4,
          status: "PENDING",
          message: "Leave application submitted for supervisor review"
        }
      }
    },
    {
      method: 'PUT',
      path: '/leaves/101/decision',
      roleRequired: 'ROLE_ADMIN, ROLE_HR_MANAGER, ROLE_DEPT_LEAD',
      summary: 'Manager approves or rejects pending leave application',
      sampleBody: JSON.stringify({
        approved: true,
        decisionRemarks: "Approved. Work covered by team lead."
      }, null, 2),
      mockResponse: {
        status: 200,
        data: {
          id: 101,
          status: "APPROVED",
          decisionBy: "hrmanager",
          decidedAt: "2026-10-13T08:15:00Z"
        }
      }
    }
  ];

  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointSpec>(endpoints[0]);
  const [requestPayload, setRequestPayload] = useState<string>(endpoints[0].sampleBody || '');
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleSelectEndpoint = (ep: EndpointSpec) => {
    setSelectedEndpoint(ep);
    setRequestPayload(ep.sampleBody || '');
    setResponseOutput(null);
  };

  const handleExecute = () => {
    setResponseOutput(selectedEndpoint.mockResponse);
  };

  const copyResponse = () => {
    if (!responseOutput) return;
    navigator.clipboard.writeText(JSON.stringify(responseOutput, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMethodBadge = (m: EndpointSpec['method']) => {
    switch (m) {
      case 'GET': return 'bg-blue-900/80 text-blue-300 border-blue-700';
      case 'POST': return 'bg-emerald-900/80 text-emerald-300 border-emerald-700';
      case 'PUT': return 'bg-amber-900/80 text-amber-300 border-amber-700';
      case 'DELETE': return 'bg-rose-900/80 text-rose-300 border-rose-700';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
      {/* Top Bar */}
      <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Spring Boot RESTful API Interactive Console</h3>
            <p className="text-xs text-slate-400">OpenAPI 3.0 / Swagger UI Specification with RBAC validation</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Endpoint List Sidebar */}
        <div className="w-80 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-800/80 bg-slate-900/50">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">REST Endpoints</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {endpoints.map(ep => (
              <button
                key={`${ep.method}-${ep.path}`}
                onClick={() => handleSelectEndpoint(ep)}
                className={`w-full p-2.5 rounded-lg text-left transition space-y-1 ${
                  selectedEndpoint.path === ep.path && selectedEndpoint.method === ep.method
                    ? 'bg-slate-800 border border-slate-700 text-white'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${getMethodBadge(ep.method)}`}>
                    {ep.method}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-200 truncate">{ep.path}</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">{ep.summary}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Console Execution Canvas */}
        <div className="flex-1 flex flex-col overflow-y-auto p-6 bg-slate-900 space-y-5">
          {/* Endpoint Details Banner */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${getMethodBadge(selectedEndpoint.method)}`}>
                {selectedEndpoint.method}
              </span>
              <span className="text-sm font-mono font-bold text-white">{selectedEndpoint.path}</span>
            </div>
            <p className="text-xs text-slate-300">{selectedEndpoint.summary}</p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Authorization Required:</span>
              <code className="text-amber-300 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                {selectedEndpoint.roleRequired}
              </code>
            </div>
          </div>

          {/* Request Payload Editor */}
          {selectedEndpoint.sampleBody && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-300">Request Body (application/json):</span>
                <span className="text-slate-500 font-mono text-[11px]">Valid JSON payload</span>
              </div>
              <textarea
                rows={5}
                value={requestPayload}
                onChange={e => setRequestPayload(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Action Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleExecute}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Send Request</span>
            </button>
            <span className="text-xs text-slate-500 font-mono">Bearer Token: Automatic</span>
          </div>

          {/* Response Inspector */}
          {responseOutput && (
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden space-y-0">
              <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white">HTTP {responseOutput.status} OK</span>
                  <span className="text-slate-500 font-mono text-[11px]">Time: 42ms</span>
                </div>
                <button
                  onClick={copyResponse}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-4 font-mono text-xs text-emerald-300 bg-slate-950 overflow-x-auto">
                <pre>{JSON.stringify(responseOutput.data, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
