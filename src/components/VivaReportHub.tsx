import React, { useState } from 'react';
import { 
  VIVA_QUESTIONS, 
  TEST_CASES, 
  INTERNSHIP_REPORT_MARKDOWN 
} from '../data/vivaAndReport';
import { 
  GraduationCap, 
  FileText, 
  CheckSquare, 
  Copy, 
  Check, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Award
} from 'lucide-react';

export const VivaReportHub: React.FC = () => {
  const [subTab, setSubTab] = useState<'VIVA' | 'REPORT' | 'TESTS'>('VIVA');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(1);
  const [copiedReport, setCopiedReport] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [checkedTests, setCheckedTests] = useState<Record<string, boolean>>({
    'TC-01': true,
    'TC-02': true,
    'TC-07': true
  });

  const categories = ['All', 'JDBC & MySQL', 'Swing GUI', 'Design Patterns', 'Java Core'];

  const filteredQuestions = selectedCategory === 'All'
    ? VIVA_QUESTIONS
    : VIVA_QUESTIONS.filter(q => q.category === selectedCategory);

  const toggleTest = (id: string) => {
    setCheckedTests(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyReport = () => {
    navigator.clipboard.writeText(INTERNSHIP_REPORT_MARKDOWN);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const totalPassed = Object.values(checkedTests).filter(Boolean).length;

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
      {/* Subtab Navigation */}
      <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">CODSOFT Evaluation & Viva Voce Suite</h3>
            <p className="text-xs text-slate-400">Garv Jangir · Java Programmer Track</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setSubTab('VIVA')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              subTab === 'VIVA' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Viva Voce Q&A</span>
          </button>

          <button
            onClick={() => setSubTab('REPORT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              subTab === 'REPORT' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Internship Report</span>
          </button>

          <button
            onClick={() => setSubTab('TESTS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              subTab === 'TESTS' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Test Checklist ({totalPassed}/{TEST_CASES.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* SUBTAB 1: VIVA VOCE QUESTIONS */}
        {subTab === 'VIVA' && (
          <div className="space-y-5 max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-white">Frequently Asked Viva Questions with Beginner-Friendly Answers</h4>
                <p className="text-xs text-slate-400">Master these core technical concepts to confidently present during your CODSOFT evaluation</p>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 text-xs rounded-lg transition font-medium ${
                      selectedCategory === cat
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredQuestions.map(item => {
                const isExpanded = expandedQuestion === item.id;
                return (
                  <div
                    key={item.id}
                    className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden transition"
                  >
                    <button
                      onClick={() => setExpandedQuestion(isExpanded ? null : item.id)}
                      className="w-full p-4 text-left flex items-start justify-between gap-4 hover:bg-slate-900/50 transition"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-purple-950 border border-purple-800 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          {item.id}
                        </span>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
                            {item.category}
                          </span>
                          <h5 className="text-sm font-semibold text-white leading-snug">
                            {item.question}
                          </h5>
                        </div>
                      </div>

                      <div className="text-slate-400 shrink-0 mt-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 space-y-3 border-t border-slate-800/80 bg-slate-900/30 text-xs">
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80">
                          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                            Recommended Viva Answer:
                          </span>
                          <p className="text-slate-200 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>

                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 flex items-start gap-2 text-slate-400 text-[11px]">
                          <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-amber-300">Pro-Tip for Evaluator:</strong> {item.followUp}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUBTAB 2: INTERNSHIP REPORT */}
        {subTab === 'REPORT' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-white">CODSOFT Java Internship Project Report</h4>
                <p className="text-xs text-slate-400">Formal project documentation formatted for your internship submission</p>
              </div>

              <button
                onClick={copyReport}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition active:scale-95"
              >
                {copiedReport ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedReport ? 'Report Copied!' : 'Copy Full Report'}</span>
              </button>
            </div>

            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
              <pre className="select-text whitespace-pre-wrap">
                {INTERNSHIP_REPORT_MARKDOWN}
              </pre>
            </div>
          </div>
        )}

        {/* SUBTAB 3: TEST CHECKLIST */}
        {subTab === 'TESTS' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-white">Application Verification & Testing Checklist</h4>
                <p className="text-xs text-slate-400">Verify each feature before submitting to your CODSOFT mentor</p>
              </div>

              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                {totalPassed} / {TEST_CASES.length} Verified
              </span>
            </div>

            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4 w-12 text-center">Status</th>
                    <th className="py-2.5 px-3">Test Case</th>
                    <th className="py-2.5 px-3">Test Input / Action</th>
                    <th className="py-2.5 px-4">Expected Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {TEST_CASES.map(tc => {
                    const isChecked = !!checkedTests[tc.id];
                    return (
                      <tr key={tc.id} className="hover:bg-slate-900/40 transition">
                        <td className="py-2.5 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleTest(tc.id)}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-white">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">{tc.id}</span>
                            <span>{tc.testCase}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">{tc.inputData}</td>
                        <td className="py-2.5 px-4 text-slate-300">{tc.expectedResult}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
