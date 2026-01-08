import React, { useState, useEffect } from "react";
import Card from "./Card";
import StanfordSingleItem from "./StanfordSingleItem";
import CBIQuestionnaire from "./CBIQuestionnaire";
import OLBIQuestionnaire from "./OLBIQuestionnaire";
import BurnoutTrendChart from "./BurnoutTrendChart";
import BurnoutRiskStats from "./BurnoutRiskStats";
import { generateMockBurnoutData } from "../utils/mockBurnoutData";
import "../styles/burnout-typography.css";

const BurnoutAssessment = () => {
  const [activeQuestionnaire, setActiveQuestionnaire] = useState("stanford");
  const [refreshKey, setRefreshKey] = useState(0);
  const [mockData, setMockData] = useState(null);

  // Clear previous questionnaire data when switching
  const handleQuestionnaireChange = (questionnaireId) => {
    if (questionnaireId !== activeQuestionnaire) {
      // Clear localStorage for ALL questionnaires to ensure clean state
      const storageKeys = {
        stanford: "burnout_stanford",
        cbi: "burnout_cbi",
        olbi: "burnout_olbi",
      };

      // Clear ALL questionnaire data when switching
      Object.values(storageKeys).forEach(key => {
        localStorage.removeItem(key);
      });

      // Update active questionnaire and force re-render
      setActiveQuestionnaire(questionnaireId);
      setRefreshKey((prev) => prev + 1);
    }
  };

  const questionnaires = [
    {
      id: "stanford",
      label: "Stanford 單題",
      subtitle: "1 題 · 快速評估",
      description: "簡短快速的倦怠自評工具",
    },
    {
      id: "cbi",
      label: "CBI 量表",
      subtitle: "19 題 · 全面評估",
      description: "評估個人、工作與服務對象相關倦怠",
    },
    {
      id: "olbi",
      label: "OLBI 量表",
      subtitle: "16 題 · 雙向評估",
      description: "評估耗竭與工作疏離程度",
    },
  ];

  // Generate mock data when questionnaire changes (INC-006)
  useEffect(() => {
    if (activeQuestionnaire) {
      const data = generateMockBurnoutData(activeQuestionnaire);
      setMockData(data);
    }
  }, [activeQuestionnaire]);

  return (
    <div className="burnout-assessment space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <div className="text-heading-1 text-slate-900 dark:text-slate-100 font-bold mb-2">
          倦怠評估
        </div>
        <div className="text-body text-slate-600 dark:text-slate-300">
          選擇一種問卷進行倦怠評估，所有資料僅儲存於本機瀏覽器，完全匿名化。
        </div>
      </div>

      {/* Questionnaire Tabs */}
      <Card>
        <div className="border-b border-neutral-200 dark:border-slate-700 pb-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            {questionnaires.map((q) => (
              <button
                key={q.id}
                onClick={() => handleQuestionnaireChange(q.id)}
                className={`
                  flex-1 px-4 py-3 rounded-lg transition-all duration-200 text-left
                  ${
                    activeQuestionnaire === q.id
                      ? "bg-primary-50 dark:bg-primary-900/30 border-2 border-primary-500 dark:border-primary-600 shadow-sm"
                      : "bg-neutral-50 dark:bg-slate-700 border-2 border-transparent hover:border-neutral-300 dark:hover:border-slate-600 hover:bg-neutral-100 dark:hover:bg-slate-600"
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div
                      className={`text-sm font-semibold mb-1 ${
                        activeQuestionnaire === q.id
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-slate-900 dark:text-slate-100"
                      }`}
                    >
                      {q.label}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                      {q.subtitle}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      {q.description}
                    </div>
                  </div>
                  {activeQuestionnaire === q.id && (
                    <div className="w-2 h-2 rounded-full bg-primary-500 mt-1 flex-shrink-0"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-info-50 border border-info-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <div className="text-info-500 flex-shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-900 dark:text-slate-100">隱私說明：</strong>
              所有問卷結果僅儲存於您的瀏覽器本機儲存空間（localStorage），不會上傳至任何伺服器。
              儲存格式為匿名化資料（僅包含部門、日期與分數），不包含任何個人識別資訊。
            </div>
          </div>
        </div>
      </Card>

      {/* Burnout Visualization Section - INC-006 */}
      {mockData && (
        <div className="space-y-6">
          <BurnoutRiskStats
            statsData={mockData.statsData}
            questionnaireType={activeQuestionnaire}
          />
          <BurnoutTrendChart
            data={mockData.trendData}
            questionnaireType={activeQuestionnaire}
          />
        </div>
      )}

      {/* Questionnaire Content */}
      {activeQuestionnaire === "stanford" && (
        <StanfordSingleItem key={`stanford-${refreshKey}`} />
      )}
      {activeQuestionnaire === "cbi" && (
        <CBIQuestionnaire key={`cbi-${refreshKey}`} />
      )}
      {activeQuestionnaire === "olbi" && (
        <OLBIQuestionnaire key={`olbi-${refreshKey}`} />
      )}
    </div>
  );
};

export default BurnoutAssessment;
