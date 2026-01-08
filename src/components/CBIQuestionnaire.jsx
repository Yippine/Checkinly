import React from 'react';
import { CheckCircle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import Card from './Card';
import useBurnoutForm from '../hooks/useBurnoutForm';
import { cbiQuestions, cbiSections, cbiScoring, cbiSource } from '../data/cbiQuestions';
import AcademicAccordion from './AcademicAccordion';
import BurnoutResultFeedback from './BurnoutResultFeedback';

// Scoring function for CBI (average of all items, already on 0-100 scale)
const cbiScoringFunction = (formData) => {
  const values = Object.values(formData).filter(v => v !== undefined && v !== null);
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / values.length);
};

const CBIQuestionnaire = () => {
  const {
    formData,
    department,
    setDepartment,
    submitted,
    savedData,
    handleChange,
    handleSubmit,
    clearData,
    isComplete,
    progress
  } = useBurnoutForm(cbiQuestions, cbiScoringFunction, 'burnout_cbi');

  const [expandedSections, setExpandedSections] = React.useState(['personal', 'work', 'client']);

  const departments = [
    '護理部',
    '行政部',
    '醫療部',
    '檢驗部',
    '藥劑部',
    '資訊部',
    '其他'
  ];

  const toggleSection = (sectionId) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(s => s !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Get interpretation based on score
  const getInterpretation = (score) => {
    if (score <= 33) return cbiScoring.interpretation.low;
    if (score <= 66) return cbiScoring.interpretation.moderate;
    return cbiScoring.interpretation.high;
  };

  // Calculate section scores
  const getSectionScore = (sectionId) => {
    const section = cbiSections[sectionId];
    const sectionQuestions = cbiQuestions.filter(q => q.section === sectionId);
    const sectionData = sectionQuestions.map(q => formData[q.id]).filter(v => v !== undefined && v !== null);
    if (sectionData.length === 0) return 0;
    return Math.round(sectionData.reduce((sum, val) => sum + val, 0) / sectionData.length);
  };

  if (submitted && savedData) {
    const interpretation = getInterpretation(savedData.score);
    const personalScore = getSectionScore('personal');
    const workScore = getSectionScore('work');
    const clientScore = getSectionScore('client');

    return (
      <>
        <Card>
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-success-600" strokeWidth={2} />
            </div>
            <h3 className="text-heading-2 text-slate-900 dark:text-slate-100 font-bold mb-2">評估完成</h3>
            <p className="text-body text-slate-600 dark:text-slate-300 mb-6">您的評估結果已儲存</p>

            {/* Section Scores */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{cbiSections.personal.name_zh}</div>
                  <div className="text-2xl font-bold text-primary-600">{personalScore}</div>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{cbiSections.work.name_zh}</div>
                  <div className="text-2xl font-bold text-warning-600">{workScore}</div>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{cbiSections.client.name_zh}</div>
                  <div className="text-2xl font-bold text-info-600">{clientScore}</div>
                </div>
              </div>

              <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                評估日期：{savedData.date} | 部門：{savedData.department}
              </div>
            </div>

            {/* Clear Data Button */}
            <button
              onClick={clearData}
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-error-600 dark:text-error-400 bg-error-50 dark:bg-error-900/20 hover:bg-error-100 dark:hover:bg-error-900/30 border border-error-200 dark:border-error-800 hover:border-error-300 dark:hover:border-error-700 transition-all duration-200"
            >
              清除並重新填寫
            </button>
          </div>
        </Card>

        {/* Rich Feedback Component */}
        <BurnoutResultFeedback
          questionnaire="cbi"
          score={savedData.score}
          subscales={{
            personal: personalScore,
            work: workScore,
            client: clientScore
          }}
        />
      </>
    );
  }

  return (
    <Card>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-heading-2 text-slate-900 dark:text-slate-100 font-bold mb-2">Copenhagen Burnout Inventory (CBI)</h2>
        <p className="text-body-small text-slate-600 dark:text-slate-300 mb-6">
          這是一個全面的倦怠評估工具，包含 19 個問題，分為三個部分：個人倦怠、工作相關倦怠、服務對象相關倦怠。
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
            <span>完成進度</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-neutral-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Department Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
            您的部門 <span className="text-error-500">*</span>
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-4 py-2.5 border border-neutral-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">請選擇部門</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Academic Introduction */}
        <AcademicAccordion questionnaire="cbi" />

        {/* Questions by Section */}
        {Object.entries(cbiSections).map(([sectionId, section]) => {
          const sectionQuestions = cbiQuestions.filter(q => q.section === sectionId);
          const isExpanded = expandedSections.includes(sectionId);

          return (
            <div key={sectionId} className="mb-4 border border-neutral-200 dark:border-slate-700 rounded-lg overflow-hidden">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(sectionId)}
                className="w-full px-6 py-4 bg-neutral-50 dark:bg-slate-700 hover:bg-neutral-100 dark:hover:bg-slate-600 flex items-center justify-between transition-colors duration-200"
              >
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{section.name_zh}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{section.description_zh}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {sectionQuestions.filter(q => formData[q.id] !== undefined).length}/{sectionQuestions.length} 題
                  </span>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {/* Section Questions */}
              {isExpanded && (
                <div className="p-6 space-y-6 bg-white dark:bg-slate-800">
                  {sectionQuestions.map((question, idx) => (
                    <div key={question.id} className="pb-6 border-b border-neutral-100 dark:border-slate-700 last:border-b-0">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
                        <span className="inline-block w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm flex items-center justify-center mr-2">
                          {idx + 1}
                        </span>
                        {question.text_zh}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 mb-3 italic pl-8">
                        {question.text}
                      </div>

                      <div className="space-y-2 pl-8">
                        {question.options.map((option) => (
                          <label
                            key={option.value}
                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                              formData[question.id] === option.value
                                ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 dark:border-primary-600'
                                : 'bg-white dark:bg-slate-800 border-neutral-200 dark:border-slate-700 hover:border-neutral-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={option.value}
                              checked={formData[question.id] === option.value}
                              onChange={(e) => handleChange(question.id, parseInt(e.target.value))}
                              className="w-4 h-4 text-primary-600 focus:ring-2 focus:ring-primary-500"
                            />
                            <div className="ml-3 flex-1">
                              <span className="text-sm text-slate-900 dark:text-slate-100">{option.label_zh}</span>
                              <span className="ml-2 text-sm text-slate-500 dark:text-slate-400 italic">({option.label})</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Submit Button */}
        <div className="flex justify-center mt-8 mb-6">
          <button
            onClick={handleSubmit}
            disabled={!isComplete || !department}
            className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
              isComplete && department
                ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5'
                : 'bg-neutral-200 dark:bg-slate-700 text-neutral-400 dark:text-slate-500 cursor-not-allowed'
            }`}
          >
            {isComplete ? '提交評估' : `請完成所有問題 (${progress}%)`}
          </button>
        </div>

        {/* Academic Source */}
        <div className="border-t border-neutral-200 dark:border-slate-700 pt-6 mt-6">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">學術來源與參考文獻</h4>
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <p>
              <strong>來源機構：</strong>
              <a
                href={cbiSource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 ml-1 inline-flex items-center gap-1"
              >
                {cbiSource.name}
                <ExternalLink size={12} />
              </a>
            </p>
            <p>
              <strong>學術基礎：</strong> {cbiSource.academicBasis}
            </p>
            <p>
              <strong>信效度：</strong> {cbiSource.validation}
            </p>
            <p className="italic text-slate-500 dark:text-slate-400">
              {cbiSource.citation}
            </p>
            <p className="text-success-600">
              <strong>授權：</strong> {cbiSource.license}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CBIQuestionnaire;
