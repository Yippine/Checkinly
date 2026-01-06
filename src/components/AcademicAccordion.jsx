import React, { useState } from 'react';
import { ChevronDown, BookOpen } from 'lucide-react';

/**
 * Academic Accordion Component
 * Collapsible academic introduction for each questionnaire
 */
const AcademicAccordion = ({ questionnaire }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const content = getAcademicContent(questionnaire);

  if (!content) return null;

  return (
    <div className="academic-accordion mb-6 border border-neutral-200 rounded-lg overflow-hidden">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-neutral-50 hover:bg-neutral-100 transition-colors duration-200"
        aria-expanded={isExpanded}
        aria-controls={`academic-content-${questionnaire}`}
      >
        <div className="flex items-center gap-3">
          <BookOpen size={20} className="text-primary-600" />
          <span className="text-body-large font-medium text-text-primary">
            了解此量表的學術背景與應用
          </span>
        </div>
        <ChevronDown
          size={20}
          className={`text-text-tertiary transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Content Area */}
      <div
        id={`academic-content-${questionnaire}`}
        className={`accordion-content overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-6 bg-white prose max-w-none">
          {content}
        </div>
      </div>
    </div>
  );
};

/**
 * Get academic content component based on questionnaire type
 */
function getAcademicContent(questionnaire) {
  const content = {
    stanford: <StanfordAcademicContent />,
    cbi: <CBIAcademicContent />,
    olbi: <OLBIAcademicContent />
  };

  return content[questionnaire] || null;
}

/**
 * Stanford Academic Content
 */
const StanfordAcademicContent = () => (
  <div>
    <h3 className="text-2xl font-bold mb-4">關於 Stanford Single-Item Burnout Measure</h3>

    <section className="mb-6">
      <h4 className="text-xl font-semibold mb-3">研究背景</h4>
      <p>這是一個真實存在的研究，由 Rohland, Kruse 和 Rohrer 於 2004 年發表於《Stress and Health》期刊。</p>
      <p className="italic text-sm text-neutral-600 bg-neutral-50 p-3 rounded">
        Rohland BM, Kruse GR, Rohrer JE. Validation of a single-item measure of burnout against the Maslach Burnout Inventory among physicians. Stress and Health. 2004;20(2):75-79.
      </p>
    </section>

    <section className="mb-6">
      <h4 className="text-xl font-semibold mb-3">為什麼開發這個量表？</h4>
      <p>傳統的馬氏職業倦怠量表（Maslach Burnout Inventory, MBI）有 22 題，在繁忙的醫療或職場環境中很難頻繁施測。研究者希望驗證「只問一個問題」是否也能準確測出倦怠感。</p>
    </section>

    <section className="mb-6">
      <h4 className="text-xl font-semibold mb-3">有效性驗證</h4>
      <p>研究發現這個單一題目與完整的 MBI 量表有<strong>高度相關</strong>（相關係數 r 約在 0.64-0.84），證實它是一個有效且快速的篩檢工具。</p>
    </section>

    <section className="mb-6">
      <h4 className="text-xl font-semibold mb-3">建議施測頻率</h4>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>一般職場/組織健康監測：</strong>建議每季（3個月）或每半年一次</li>
        <li><strong>高壓專案期間/醫療人員：</strong>甚至可以每月進行一次</li>
        <li><strong>不建議：</strong>間隔太短（如每天）變動不大；間隔太長（如一年）無法即時發現危機</li>
      </ul>
    </section>

    <section>
      <h4 className="text-xl font-semibold mb-3">分析應用</h4>

      <div className="mb-4">
        <h5 className="text-lg font-medium mb-2">風險分層：</h5>
        <ul className="list-disc pl-6 space-y-1">
          <li>選擇 1-2：非倦怠群（維持現狀）</li>
          <li>選擇 3：需要預防性介入（調整工作量）</li>
          <li>選擇 4-5：需要緊急介入（EAP、強制休假、醫療轉介）</li>
        </ul>
      </div>

      <div className="mb-4">
        <h5 className="text-lg font-medium mb-2">趨勢追蹤：</h5>
        <p>因為施測容易，可以繪製時間軸，觀察組織倦怠率的變化。</p>
      </div>

      <div>
        <h5 className="text-lg font-medium mb-2">資源分配指引：</h5>
        <p>根據分數分佈，決定哪些部門或員工需要優先支持。</p>
      </div>
    </section>
  </div>
);

/**
 * CBI Academic Content
 */
const CBIAcademicContent = () => (
  <div>
    <h3 className="text-2xl font-bold mb-4">關於 Copenhagen Burnout Inventory (CBI)</h3>

    <section className="mb-6">
      <h4 className="text-xl font-semibold mb-3">研究背景</h4>
      <p>由丹麥國家職業環境研究中心（National Research Centre for the Working Environment）的 Kristensen 等人於 2005 年開發。</p>
      <p className="italic text-sm text-neutral-600 bg-neutral-50 p-3 rounded">
        Kristensen TS, Borritz M, Villadsen E, Christensen KB. The Copenhagen Burnout Inventory: A new tool for the assessment of burnout. Work & Stress. 2005;19(3):192-207.
      </p>
    </section>

    <section className="mb-6">
      <h4 className="text-xl font-semibold mb-3">為什麼開發 CBI？</h4>
      <p>傳統的 MBI 主要針對「人際服務」工作者（如醫療、教育），研究者希望開發一個：</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>適用於所有職業的倦怠量表</li>
        <li>免費開源，任何人都可以使用</li>
        <li>理論基礎更清晰（區分個人、工作、客戶三個層面）</li>
      </ul>
    </section>

    <section className="mb-6">
      <h4 className="text-xl font-semibold mb-3">三個維度</h4>
      <div className="space-y-3">
        <div>
          <strong>1. 個人倦怠（Personal Burnout）：</strong>
          <p>整體的身心疲憊感，不特定與工作相關。可能來自生活壓力、健康問題、家庭責任等。</p>
        </div>
        <div>
          <strong>2. 工作相關倦怠（Work-related Burnout）：</strong>
          <p>明確與工作相關的疲憊感。如果這個分數高於個人倦怠，顯示問題主要出在工作本身。</p>
        </div>
        <div>
          <strong>3. 客戶相關倦怠（Client-related Burnout）：</strong>
          <p>因與服務對象（病患、客戶、學生等）互動而產生的疲憊感。特別適用於醫療、教育、服務業。</p>
        </div>
      </div>
    </section>

    <section className="mb-6">
      <h4 className="text-xl font-semibold mb-3">有效性驗證</h4>
      <p>CBI 已在全球多個國家驗證，證實具有良好的信效度：</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>與 MBI 高度相關（證實測量相同概念）</li>
        <li>能預測疾病請假、離職意圖、工作表現下降</li>
        <li>對介入措施敏感（能測出治療或改善的效果）</li>
      </ul>
    </section>

    <section className="mb-6">
      <h4 className="text-xl font-semibold mb-3">建議施測頻率</h4>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>組織層級健康調查：</strong>每年 1-2 次</li>
        <li><strong>介入措施評估：</strong>介入前、介入後 3 個月、6 個月</li>
        <li><strong>個人自我監測：</strong>每季一次</li>
      </ul>
    </section>

    <section>
      <h4 className="text-xl font-semibold mb-3">實務應用</h4>
      <div className="space-y-3">
        <div>
          <strong>診斷倦怠來源：</strong>
          <p>透過比較三個維度的分數，可以判斷倦怠主要來自個人生活、工作制度、還是客戶互動。</p>
        </div>
        <div>
          <strong>針對性介入：</strong>
          <p>根據倦怠來源設計介入措施（如工作調整 vs 生活支持 vs 溝通訓練）。</p>
        </div>
        <div>
          <strong>組織健康診斷：</strong>
          <p>如果整個部門的「工作倦怠」都很高，代表系統性問題，需要組織改革。</p>
        </div>
      </div>
    </section>
  </div>
);

/**
 * OLBI Academic Content
 */
const OLBIAcademicContent = () => (
  <div>
    <h3 className="text-2xl font-bold mb-4">關於 Oldenburg Burnout Inventory (OLBI)</h3>

    <section className="mb-6">
      <h4 className="text-xl font-semibold mb-3">研究背景</h4>
      <p>由 Demerouti 和 Bakker 等人於 2003 年開發，基於「工作要求-資源模型」（Job Demands-Resources Model, JD-R Model）。</p>
      <p className="italic text-sm text-neutral-600 bg-neutral-50 p-3 rounded">
        Demerouti E, Bakker AB, Vardakou I, Kantas A. The convergent validity of two burnout instruments: A multitrait-multimethod analysis. European Journal of Psychological Assessment. 2003;19(1):12-23.
      </p>
    </section>

    <section className="mb-6">
      <h4 className="text-xl font-semibold mb-3">為什麼開發 OLBI？</h4>
      <p>傳統倦怠量表（如 MBI）被批評：</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>題目都是負向表述，容易產生反應偏誤</li>
        <li>理論基礎不夠清晰</li>
        <li>主要針對「人際服務」工作</li>
      </ul>
      <p className="mt-2">OLBI 改進了這些問題：</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>正反向題目混合（減少偏誤）</li>
        <li>基於 JD-R 模型（理論清晰）</li>
        <li>適用於所有職業</li>
      </ul>
    </section>

    <section className="mb-6">
      <h4 className="text-xl font-semibold mb-3">兩個維度</h4>
      <div className="space-y-3">
        <div>
          <strong>1. 耗竭（Exhaustion）：</strong>
          <p>身體和情緒的極度疲憊感。這是倦怠的核心症狀，反映「工作要求」過高。</p>
          <p className="text-sm text-neutral-600">對應 JD-R 模型：高工作要求（工作量、時間壓力、環境壓力）導致耗竭。</p>
        </div>
        <div>
          <strong>2. 疏離（Disengagement）：</strong>
          <p>對工作的疏離感、不投入、失去意義感。反映「工作資源」不足。</p>
          <p className="text-sm text-neutral-600">對應 JD-R 模型：缺乏工作資源（自主權、支持、回饋、成長機會）導致疏離。</p>
        </div>
      </div>
    </section>

    <section className="mb-6">
      <h4 className="text-xl font-semibold mb-3">JD-R 模型的啟示</h4>
      <p>OLBI 的兩個維度對應 JD-R 模型的核心概念：</p>
      <div className="bg-primary-50 p-4 rounded-lg mt-3 space-y-2">
        <div>
          <strong>高工作要求 → 高耗竭：</strong>
          <p className="text-sm">工作量大、時間壓力、環境惡劣 → 身心疲憊</p>
        </div>
        <div>
          <strong>低工作資源 → 高疏離：</strong>
          <p className="text-sm">缺乏自主權、支持、意義感 → 不想投入工作</p>
        </div>
      </div>
      <p className="mt-3"><strong>關鍵洞察：</strong>改善倦怠需要「降低工作要求」和「增加工作資源」雙管齊下。</p>
    </section>

    <section className="mb-6">
      <h4 className="text-xl font-semibold mb-3">有效性驗證</h4>
      <ul className="list-disc pl-6 space-y-1">
        <li>與 MBI 高度相關（收斂效度良好）</li>
        <li>正反向題目設計有效減少反應偏誤</li>
        <li>適用於各種職業（不限於人際服務工作）</li>
        <li>能預測離職、疾病請假、工作表現</li>
      </ul>
    </section>

    <section className="mb-6">
      <h4 className="text-xl font-semibold mb-3">建議施測頻率</h4>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>組織健康調查：</strong>每年 1-2 次</li>
        <li><strong>介入評估：</strong>介入前後測（間隔 3-6 個月）</li>
        <li><strong>個人監測：</strong>每季一次</li>
      </ul>
    </section>

    <section>
      <h4 className="text-xl font-semibold mb-3">實務應用</h4>
      <div className="space-y-3">
        <div>
          <strong>診斷倦怠類型：</strong>
          <ul className="list-disc pl-6 text-sm space-y-1 mt-1">
            <li>高耗竭 + 低疏離 = 工作要求過高（需減少工作量）</li>
            <li>低耗竭 + 高疏離 = 工作資源不足（需增加自主權、意義感）</li>
            <li>高耗竭 + 高疏離 = 完全倦怠（需全面介入）</li>
          </ul>
        </div>
        <div>
          <strong>針對性介入：</strong>
          <p>根據耗竭和疏離的模式，設計不同的介入策略（降低要求 vs 增加資源）。</p>
        </div>
        <div>
          <strong>預防倦怠：</strong>
          <p>在組織層級優化「工作要求-資源」平衡，預防倦怠發生。</p>
        </div>
      </div>
    </section>
  </div>
);

export default AcademicAccordion;
