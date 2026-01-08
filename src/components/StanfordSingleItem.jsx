import React from "react";
import { CheckCircle, ExternalLink } from "lucide-react";
import Card from "./Card";
import useBurnoutForm from "../hooks/useBurnoutForm";
import { stanfordQuestion, stanfordSource } from "../data/stanfordQuestions";
import AcademicAccordion from "./AcademicAccordion";
import BurnoutResultFeedback from "./BurnoutResultFeedback";

// Scoring function for Stanford (direct value)
const stanfordScoring = (formData) => {
  return formData[stanfordQuestion.id] || 0;
};

const StanfordSingleItem = () => {
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
  } = useBurnoutForm([stanfordQuestion], stanfordScoring, "burnout_stanford");

  const departments = [
    "護理部",
    "行政部",
    "醫療部",
    "檢驗部",
    "藥劑部",
    "資訊部",
    "其他",
  ];

  // Get interpretation based on score
  const getInterpretation = (score) => {
    if (score <= 2) return stanfordQuestion.interpretation.low;
    if (score === 3) return stanfordQuestion.interpretation.moderate;
    return stanfordQuestion.interpretation.high;
  };

  if (submitted && savedData) {
    return (
      <>
        <Card>
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle
                size={32}
                className="text-success-600"
                strokeWidth={2}
              />
            </div>
            <h1 className="text-heading-2 text-slate-900 dark:text-slate-100 font-bold mb-2">
              評估完成
            </h1>
            <p className="text-body text-slate-600 dark:text-slate-300 mb-4">
              您的評估結果已儲存
            </p>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              評估日期：{savedData.date} | 部門：{savedData.department}
            </div>
          </div>
        </Card>

        {/* Rich Result Feedback */}
        <BurnoutResultFeedback
          questionnaire="stanford"
          score={savedData.score}
        />

        {/* Clear Data Button */}
        <div className="mt-6 text-center">
          <button
            onClick={clearData}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-error-600 dark:text-error-400 bg-error-50 dark:bg-error-900/20 hover:bg-error-100 dark:hover:bg-error-900/30 border border-error-200 dark:border-error-800 hover:border-error-300 dark:hover:border-error-700 transition-all duration-200"
          >
            清除並重新填寫
          </button>
        </div>
      </>
    );
  }

  return (
    <Card>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-heading-2 text-slate-900 dark:text-slate-100 font-bold mb-2">
          Stanford 單題倦怠評估
        </h2>
        <p className="text-body text-slate-600 dark:text-slate-300 mb-6">
          這是一個經過驗證的快速倦怠評估工具，只需回答一個問題即可評估您的倦怠程度。
        </p>

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
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Academic Accordion */}
        <AcademicAccordion questionnaire="stanford" />

        {/* Question */}
        <div className="mb-8 p-6 bg-neutral-50 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-lg">
          <div className="text-body font-medium text-slate-900 dark:text-slate-100 mb-4">
            {stanfordQuestion.text_zh}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-4 italic">
            {stanfordQuestion.text}
          </div>

          <div className="space-y-2">
            {stanfordQuestion.options.map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  formData[stanfordQuestion.id] === option.value
                    ? "bg-primary-50 dark:bg-primary-900/30 border-primary-500 dark:border-primary-600"
                    : "bg-white dark:bg-slate-800 border-neutral-200 dark:border-slate-700 hover:border-neutral-300 dark:hover:border-slate-600 hover:bg-neutral-50 dark:hover:bg-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name={stanfordQuestion.id}
                  value={option.value}
                  checked={formData[stanfordQuestion.id] === option.value}
                  onChange={(e) =>
                    handleChange(stanfordQuestion.id, parseInt(e.target.value))
                  }
                  className="w-4 h-4 text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
                <div className="ml-3 flex-1">
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {option.label_zh}
                  </span>
                  <span className="ml-2 text-sm text-slate-500 dark:text-slate-400 italic">
                    ({option.label})
                  </span>
                </div>
                <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                  {option.value}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleSubmit}
            disabled={!isComplete || !department}
            className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
              isComplete && department
                ? "bg-primary-500 hover:bg-primary-600 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5"
                : "bg-neutral-200 dark:bg-slate-700 text-neutral-400 dark:text-slate-500 cursor-not-allowed"
            }`}
          >
            提交評估
          </button>
        </div>

        {/* Academic Source */}
        <div className="border-t border-neutral-200 pt-6 mt-6">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
            學術來源與參考文獻
          </h4>
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <p>
              <strong>來源機構：</strong>
              <a
                href={stanfordSource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 ml-1 inline-flex items-center gap-1"
              >
                {stanfordSource.name}
                <ExternalLink size={12} />
              </a>
            </p>
            <p>
              <strong>學術基礎：</strong> {stanfordSource.academicBasis}
            </p>
            <p className="italic text-slate-500 dark:text-slate-400">
              {stanfordSource.citation}
            </p>
            <p className="text-success-600">
              <strong>授權：</strong> {stanfordSource.license}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StanfordSingleItem;
