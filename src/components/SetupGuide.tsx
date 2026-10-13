import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Terminal, 
  HelpCircle, 
  Layers
} from 'lucide-react';

export const SetupGuide: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      num: 1,
      title: 'Install Java Development Kit (JDK 17+)',
      summary: 'Download and set up the Java runtime & compiler.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            The project requires <strong>Java SE 17 LTS</strong> or higher.
          </p>
          <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
            <li>Download Oracle JDK or Eclipse Temurin (OpenJDK) 17+ from <code className="text-blue-300 font-mono">adoptium.net</code> or Oracle.</li>
            <li>Run the installer and check the box to <strong>Set JAVA_HOME</strong> and add Java to your system PATH.</li>
            <li>Verify installation in terminal / command prompt:</li>
          </ol>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400">
            java -version<br />
            javac -version
          </div>
        </div>
      )
    },
    {
      num: 2,
      title: 'Install Eclipse IDE & WindowBuilder',
      summary: 'Set up the standard Java desktop development environment.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            Eclipse IDE provides integrated GUI editing with WindowBuilder.
          </p>
          <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
            <li>Download <strong>Eclipse IDE for Enterprise Java and Web Developers</strong> or standard <strong>Eclipse IDE for Java Developers</strong>.</li>
            <li>Install <strong>WindowBuilder</strong> (if not already included):
              <ul className="list-disc pl-5 mt-1 text-slate-400">
                <li>In Eclipse, go to <strong>Help &gt; Eclipse Marketplace...</strong></li>
                <li>Search for <code className="text-blue-300">WindowBuilder</code>.</li>
                <li>Click <strong>Install</strong> and restart Eclipse when prompted.</li>
              </ul>
            </li>
          </ol>
        </div>
      )
    },
    {
      num: 3,
      title: 'Install MySQL Server & Workbench',
      summary: 'Set up local relational database storage.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
            <li>Download <strong>MySQL Community Server</strong> and <strong>MySQL Workbench</strong> from <code className="text-blue-300 font-mono">dev.mysql.com/downloads/installer/</code>.</li>
            <li>During installation, keep the default port <code className="text-amber-300 font-mono">3306</code>.</li>
            <li>Choose a root password (e.g. <code className="text-emerald-300 font-mono">password</code> or <code className="text-emerald-300 font-mono">root</code>) and memorize it!</li>
            <li>Start the MySQL Windows/macOS service and verify connectivity in MySQL Workbench.</li>
          </ol>
        </div>
      )
    },
    {
      num: 4,
      title: 'Execute database.sql Script',
      summary: 'Create employee_management_db and seed records.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
            <li>Launch <strong>MySQL Workbench</strong> and connect to your local MySQL instance.</li>
            <li>Click <strong>File &gt; Open SQL Script...</strong> and select <code className="text-blue-300 font-mono">database.sql</code> from this project.</li>
            <li>Click the lightning bolt ⚡ (<strong>Execute</strong>) button to run the script.</li>
            <li>Refresh the Schemas panel; you will now see <code className="text-emerald-300 font-mono">employee_management_db</code> with table <code className="text-emerald-300 font-mono">employees</code> containing 8 seed rows.</li>
          </ol>
        </div>
      )
    },
    {
      num: 5,
      title: 'Import Project into Eclipse',
      summary: 'Open the preconfigured Eclipse project or create classes.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
            <li>In Eclipse, choose <strong>File &gt; Open Projects from File System...</strong></li>
            <li>Click <strong>Archive...</strong> (or Directory) and point to the downloaded project folder.</li>
            <li>Click <strong>Finish</strong>. Eclipse will immediately recognize the project with package:
              <div className="bg-slate-950 p-2 rounded mt-1 font-mono text-blue-300 text-[11px]">
                com.codsoft.employeemanagement
              </div>
            </li>
          </ol>
        </div>
      )
    },
    {
      num: 6,
      title: 'Add MySQL JDBC Driver (.jar) to Build Path',
      summary: 'Enable Java to communicate with MySQL via JDBC.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p className="font-semibold text-white">This step is critical to prevent <code className="text-rose-300">ClassNotFoundException</code>:</p>
          <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
            <li>Download <strong>MySQL Connector/J</strong> (Platform Independent zip) from <code className="text-blue-300 font-mono">dev.mysql.com/downloads/connector/j/</code>.</li>
            <li>Extract the zip archive to find <code className="text-amber-300 font-mono">mysql-connector-j-8.x.x.jar</code>.</li>
            <li>In Eclipse, right-click the <code className="text-blue-300">EmployeeManagementSystem</code> project.</li>
            <li>Select <strong>Build Path &gt; Configure Build Path...</strong></li>
            <li>Under the <strong>Libraries</strong> tab, select <strong>Classpath</strong>, then click <strong>Add External JARs...</strong></li>
            <li>Select your downloaded <code className="text-amber-300 font-mono">mysql-connector-j-8.x.x.jar</code> and click <strong>Apply and Close</strong>.</li>
          </ol>
        </div>
      )
    },
    {
      num: 7,
      title: 'Configure Database Credentials',
      summary: 'Set your local MySQL password in DatabaseConnection.java.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            Open <code className="text-blue-300 font-mono">DatabaseConnection.java</code> in Eclipse and check lines 11-12:
          </p>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1 text-slate-300">
            <span className="text-slate-500">// Adjust USER and PASSWORD to match your local MySQL</span><br />
            <span className="text-emerald-400">private static final String USER = "root";</span><br />
            <span className="text-emerald-400">private static final String PASSWORD = "your_actual_mysql_password";</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Save the file (<kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white font-mono">Ctrl+S</kbd> or <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white font-mono">Cmd+S</kbd>).
          </p>
        </div>
      )
    },
    {
      num: 8,
      title: 'Run Application from Main.java',
      summary: 'Launch the Java desktop application.',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
            <li>In Eclipse Package Explorer, expand <code className="text-blue-300 font-mono">src/com/codsoft/employeemanagement/Main.java</code>.</li>
            <li>Right-click <code className="text-blue-300 font-mono">Main.java</code>.</li>
            <li>Select <strong>Run As &gt; Java Application</strong>.</li>
            <li>The desktop window titled <strong>Employee Management System</strong> will open centered on your monitor!</li>
          </ol>
        </div>
      )
    }
  ];

  const troubleshoots = [
    {
      issue: 'ClassNotFoundException: com.mysql.cj.jdbc.Driver',
      cause: 'The MySQL Connector JAR is missing from the Eclipse Build Path.',
      solution: 'Right-click project > Build Path > Configure Build Path > Libraries > Classpath > Add External JARs > Select mysql-connector-j-8.x.x.jar.'
    },
    {
      issue: 'Communications link failure (Connection Refused)',
      cause: 'MySQL Server service is stopped or port 3306 is blocked.',
      solution: 'Open Windows Services (services.msc) or macOS Terminal and ensure MySQL service status is "Running". Test in MySQL Workbench first.'
    },
    {
      issue: "Access denied for user 'root'@'localhost' (using password: YES)",
      cause: 'Incorrect MySQL password in DatabaseConnection.java.',
      solution: 'Verify the password you entered during MySQL Server installation and update the PASSWORD constant in DatabaseConnection.java.'
    },
    {
      issue: "Table 'employee_management_db.employees' doesn't exist",
      cause: 'database.sql has not been executed yet.',
      solution: 'Execute database.sql inside MySQL Workbench to create the schema and table.'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-y-auto border border-slate-700 p-6 space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-700/50 flex items-center justify-center text-blue-400">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">Beginner Setup & Installation Guide</h2>
          <p className="text-xs text-slate-400">Step-by-step instructions for Eclipse IDE, MySQL, JDBC, and WindowBuilder</p>
        </div>
      </div>

      {/* Step Selector Horizontal Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
        {steps.map(s => (
          <button
            key={s.num}
            onClick={() => setActiveStep(s.num)}
            className={`p-2.5 rounded-xl border text-center transition ${
              activeStep === s.num
                ? 'bg-blue-600 text-white border-blue-500 font-bold shadow-md'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="text-[11px] font-mono">Step {s.num}</div>
            <div className="text-[10px] truncate">{s.title.split(' ')[1]}</div>
          </button>
        ))}
      </div>

      {/* Active Step Card */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/40">
              {steps[activeStep - 1].num}
            </span>
            <h3 className="text-sm font-bold text-white">{steps[activeStep - 1].title}</h3>
          </div>
          <span className="text-xs text-slate-500">{steps[activeStep - 1].summary}</span>
        </div>

        <div className="pt-2">
          {steps[activeStep - 1].content}
        </div>

        <div className="flex justify-between pt-4 border-t border-slate-800">
          <button
            disabled={activeStep === 1}
            onClick={() => setActiveStep(p => Math.max(1, p - 1))}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition disabled:opacity-30"
          >
            ← Previous Step
          </button>
          <button
            disabled={activeStep === steps.length}
            onClick={() => setActiveStep(p => Math.min(steps.length, p + 1))}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition disabled:opacity-30"
          >
            Next Step →
          </button>
        </div>
      </div>

      {/* Troubleshooting Section (Requirement 8 & 11) */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <HelpCircle className="w-5 h-5" />
          <span>Troubleshooting Common Beginner Errors</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {troubleshoots.map(item => (
            <div key={item.issue} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <h4 className="text-xs font-bold text-white leading-tight font-mono">{item.issue}</h4>
              </div>
              <p className="text-[11px] text-slate-400">
                <strong className="text-slate-300">Cause:</strong> {item.cause}
              </p>
              <p className="text-[11px] text-emerald-300 bg-emerald-950/40 p-2 rounded border border-emerald-900/40">
                <strong className="text-emerald-200">Fix:</strong> {item.solution}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
