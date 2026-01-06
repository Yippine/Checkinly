// Stanford Single-Item Burnout Measure
// Source: Stanford Medicine WellMD Center
// Citation: Rohland BM, Kruse GR, Rohrer JE. Validation of a single-item measure of burnout against the Maslach Burnout Inventory among physicians. Stress Health. 2004;20(2):75-79.

export const stanfordQuestion = {
  id: 'stanford_1',
  text: 'Overall, based on your definition of burnout, how would you rate your level of burnout?',
  text_zh: '整體而言，基於您對倦怠的理解，您如何評估自己的倦怠程度？',
  type: 'likert_5',
  options: [
    { value: 1, label: 'Not at all burned out', label_zh: '完全不倦怠' },
    { value: 2, label: 'A little burned out', label_zh: '有點倦怠' },
    { value: 3, label: 'Moderately burned out', label_zh: '中度倦怠' },
    { value: 4, label: 'Very burned out', label_zh: '非常倦怠' },
    { value: 5, label: 'Completely burned out', label_zh: '完全倦怠' }
  ],
  scoring: 'direct', // Direct score = selected value (1-5)
  interpretation: {
    low: { max: 2, label: '低倦怠', description: '倦怠程度較低，建議維持良好的工作生活平衡' },
    moderate: { min: 3, max: 3, label: '中度倦怠', description: '出現中度倦怠徵兆，建議增加休息時間並尋求支持' },
    high: { min: 4, label: '高倦怠', description: '倦怠程度較高，強烈建議尋求專業協助或調整工作安排' }
  }
};

export const stanfordSource = {
  name: 'Stanford Medicine WellMD Center',
  url: 'https://wellmd.stanford.edu/',
  citation: 'Rohland BM, Kruse GR, Rohrer JE. Validation of a single-item measure of burnout against the Maslach Burnout Inventory among physicians. Stress Health. 2004;20(2):75-79.',
  academicBasis: 'Validated single-item measure with high correlation to Maslach Burnout Inventory (r=0.82)',
  license: 'Public domain - Free to use for research and clinical purposes'
};

export default stanfordQuestion;
