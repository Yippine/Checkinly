// Oldenburg Burnout Inventory (OLBI)
// Source: PsyToolkit Survey Library
// Citation: Demerouti E, Bakker AB, Vardakou I, Kantas A. The convergent validity of two burnout instruments: A multitrait-multimethod analysis. European Journal of Psychological Assessment. 2003;19(1):12-23.
// License: Free to use for research purposes

export const olbiQuestions = [
  // Exhaustion subscale (8 items: 4 negatively worded, 4 positively worded)
  {
    id: 'olbi_1',
    section: 'exhaustion',
    text: 'I always find new and interesting aspects in my work',
    text_zh: '我總是能在工作中發現新的有趣面向',
    reverse: true,
    options: [
      { value: 1, label: 'Strongly agree', label_zh: '非常同意' },
      { value: 2, label: 'Agree', label_zh: '同意' },
      { value: 3, label: 'Disagree', label_zh: '不同意' },
      { value: 4, label: 'Strongly disagree', label_zh: '非常不同意' }
    ]
  },
  {
    id: 'olbi_2',
    section: 'exhaustion',
    text: 'There are days when I feel tired before I arrive at work',
    text_zh: '有些時候，我在到達工作地點前就已經感到疲倦',
    reverse: false,
    options: [
      { value: 1, label: 'Strongly agree', label_zh: '非常同意' },
      { value: 2, label: 'Agree', label_zh: '同意' },
      { value: 3, label: 'Disagree', label_zh: '不同意' },
      { value: 4, label: 'Strongly disagree', label_zh: '非常不同意' }
    ]
  },
  {
    id: 'olbi_3',
    section: 'exhaustion',
    text: 'It happens more and more often that I talk about my work in a negative way',
    text_zh: '我越來越常以負面的方式談論我的工作',
    reverse: false,
    options: [
      { value: 1, label: 'Strongly agree', label_zh: '非常同意' },
      { value: 2, label: 'Agree', label_zh: '同意' },
      { value: 3, label: 'Disagree', label_zh: '不同意' },
      { value: 4, label: 'Strongly disagree', label_zh: '非常不同意' }
    ]
  },
  {
    id: 'olbi_4',
    section: 'exhaustion',
    text: 'After work, I tend to need more time than in the past in order to relax and feel better',
    text_zh: '下班後，我往往需要比過去更多的時間才能放鬆和感覺好一些',
    reverse: false,
    options: [
      { value: 1, label: 'Strongly agree', label_zh: '非常同意' },
      { value: 2, label: 'Agree', label_zh: '同意' },
      { value: 3, label: 'Disagree', label_zh: '不同意' },
      { value: 4, label: 'Strongly disagree', label_zh: '非常不同意' }
    ]
  },
  {
    id: 'olbi_5',
    section: 'exhaustion',
    text: 'I can tolerate the pressure of my work very well',
    text_zh: '我可以很好地承受工作壓力',
    reverse: true,
    options: [
      { value: 1, label: 'Strongly agree', label_zh: '非常同意' },
      { value: 2, label: 'Agree', label_zh: '同意' },
      { value: 3, label: 'Disagree', label_zh: '不同意' },
      { value: 4, label: 'Strongly disagree', label_zh: '非常不同意' }
    ]
  },
  {
    id: 'olbi_6',
    section: 'exhaustion',
    text: 'Lately, I tend to think less at work and do my job almost mechanically',
    text_zh: '最近，我在工作時思考得更少，幾乎是機械地完成工作',
    reverse: false,
    options: [
      { value: 1, label: 'Strongly agree', label_zh: '非常同意' },
      { value: 2, label: 'Agree', label_zh: '同意' },
      { value: 3, label: 'Disagree', label_zh: '不同意' },
      { value: 4, label: 'Strongly disagree', label_zh: '非常不同意' }
    ]
  },
  {
    id: 'olbi_7',
    section: 'exhaustion',
    text: 'I find my work to be a positive challenge',
    text_zh: '我認為我的工作是一個正面的挑戰',
    reverse: true,
    options: [
      { value: 1, label: 'Strongly agree', label_zh: '非常同意' },
      { value: 2, label: 'Agree', label_zh: '同意' },
      { value: 3, label: 'Disagree', label_zh: '不同意' },
      { value: 4, label: 'Strongly disagree', label_zh: '非常不同意' }
    ]
  },
  {
    id: 'olbi_8',
    section: 'exhaustion',
    text: 'During my work, I often feel emotionally drained',
    text_zh: '在工作期間，我經常感到情緒上的耗竭',
    reverse: false,
    options: [
      { value: 1, label: 'Strongly agree', label_zh: '非常同意' },
      { value: 2, label: 'Agree', label_zh: '同意' },
      { value: 3, label: 'Disagree', label_zh: '不同意' },
      { value: 4, label: 'Strongly disagree', label_zh: '非常不同意' }
    ]
  },

  // Disengagement subscale (8 items: 4 negatively worded, 4 positively worded)
  {
    id: 'olbi_9',
    section: 'disengagement',
    text: 'Over time, one can become disconnected from this type of work',
    text_zh: '隨著時間推移，一個人可能會與這類工作失去連結',
    reverse: false,
    options: [
      { value: 1, label: 'Strongly agree', label_zh: '非常同意' },
      { value: 2, label: 'Agree', label_zh: '同意' },
      { value: 3, label: 'Disagree', label_zh: '不同意' },
      { value: 4, label: 'Strongly disagree', label_zh: '非常不同意' }
    ]
  },
  {
    id: 'olbi_10',
    section: 'disengagement',
    text: 'Sometimes I feel sickened by my work tasks',
    text_zh: '有時候我對我的工作任務感到厭惡',
    reverse: false,
    options: [
      { value: 1, label: 'Strongly agree', label_zh: '非常同意' },
      { value: 2, label: 'Agree', label_zh: '同意' },
      { value: 3, label: 'Disagree', label_zh: '不同意' },
      { value: 4, label: 'Strongly disagree', label_zh: '非常不同意' }
    ]
  },
  {
    id: 'olbi_11',
    section: 'disengagement',
    text: 'This is the only type of work that I can imagine myself doing',
    text_zh: '這是我能想像自己做的唯一一種工作',
    reverse: true,
    options: [
      { value: 1, label: 'Strongly agree', label_zh: '非常同意' },
      { value: 2, label: 'Agree', label_zh: '同意' },
      { value: 3, label: 'Disagree', label_zh: '不同意' },
      { value: 4, label: 'Strongly disagree', label_zh: '非常不同意' }
    ]
  },
  {
    id: 'olbi_12',
    section: 'disengagement',
    text: 'I feel more and more engaged in my work',
    text_zh: '我對工作越來越投入',
    reverse: true,
    options: [
      { value: 1, label: 'Strongly agree', label_zh: '非常同意' },
      { value: 2, label: 'Agree', label_zh: '同意' },
      { value: 3, label: 'Disagree', label_zh: '不同意' },
      { value: 4, label: 'Strongly disagree', label_zh: '非常不同意' }
    ]
  },
  {
    id: 'olbi_13',
    section: 'disengagement',
    text: 'I frequently talk about my work in a negative way',
    text_zh: '我經常以負面的方式談論我的工作',
    reverse: false,
    options: [
      { value: 1, label: 'Strongly agree', label_zh: '非常同意' },
      { value: 2, label: 'Agree', label_zh: '同意' },
      { value: 3, label: 'Disagree', label_zh: '不同意' },
      { value: 4, label: 'Strongly disagree', label_zh: '非常不同意' }
    ]
  },
  {
    id: 'olbi_14',
    section: 'disengagement',
    text: 'I feel increasingly motivated in my work',
    text_zh: '我對工作感到越來越有動力',
    reverse: true,
    options: [
      { value: 1, label: 'Strongly agree', label_zh: '非常同意' },
      { value: 2, label: 'Agree', label_zh: '同意' },
      { value: 3, label: 'Disagree', label_zh: '不同意' },
      { value: 4, label: 'Strongly disagree', label_zh: '非常不同意' }
    ]
  },
  {
    id: 'olbi_15',
    section: 'disengagement',
    text: 'I just want to get my work over and done with',
    text_zh: '我只想把工作完成了事',
    reverse: false,
    options: [
      { value: 1, label: 'Strongly agree', label_zh: '非常同意' },
      { value: 2, label: 'Agree', label_zh: '同意' },
      { value: 3, label: 'Disagree', label_zh: '不同意' },
      { value: 4, label: 'Strongly disagree', label_zh: '非常不同意' }
    ]
  },
  {
    id: 'olbi_16',
    section: 'disengagement',
    text: 'I feel that I am contributing something valuable to this organization',
    text_zh: '我覺得我正在為這個組織貢獻有價值的東西',
    reverse: true,
    options: [
      { value: 1, label: 'Strongly agree', label_zh: '非常同意' },
      { value: 2, label: 'Agree', label_zh: '同意' },
      { value: 3, label: 'Disagree', label_zh: '不同意' },
      { value: 4, label: 'Strongly disagree', label_zh: '非常不同意' }
    ]
  }
];

export const olbiSections = {
  exhaustion: {
    name: 'Exhaustion',
    name_zh: '耗竭',
    description: 'Feelings of emptiness, overtaxation, physical exhaustion, and need for rest',
    description_zh: '空虛感、過度消耗、身體疲憊和需要休息的感受',
    items: [1, 2, 3, 4, 5, 6, 7, 8],
    reverseItems: [1, 5, 7] // Items that need reverse scoring (positively worded)
  },
  disengagement: {
    name: 'Disengagement',
    name_zh: '疏離',
    description: 'Distancing oneself from work, negative attitudes toward work, and loss of motivation',
    description_zh: '與工作保持距離、對工作持負面態度和失去動力',
    items: [9, 10, 11, 12, 13, 14, 15, 16],
    reverseItems: [11, 12, 14, 16] // Items that need reverse scoring (positively worded)
  }
};

export const olbiScoring = {
  method: 'average_with_reverse',
  range: { min: 1, max: 4 },
  reverseItems: [1, 5, 7, 11, 12, 14, 16], // All reverse-scored items (positively worded)
  reverseFormula: '5 - original_score',
  calculation: 'Reverse score for positively worded items (5 - score), then average all items',
  interpretation: {
    low: { max: 2.0, label: '低倦怠', description: '倦怠程度較低' },
    moderate: { min: 2.1, max: 2.9, label: '中度倦怠', description: '出現中度倦怠徵兆' },
    high: { min: 3.0, label: '高倦怠', description: '倦怠程度較高，建議尋求協助' }
  }
};

export const olbiSource = {
  name: 'PsyToolkit Survey Library',
  url: 'https://www.psytoolkit.org/survey-library/burnout-olbi.html',
  citation: 'Demerouti E, Bakker AB, Vardakou I, Kantas A. The convergent validity of two burnout instruments: A multitrait-multimethod analysis. European Journal of Psychological Assessment. 2003;19(1):12-23. doi:10.1027//1015-5759.19.1.12',
  academicBasis: 'Two-dimensional measure assessing Exhaustion and Disengagement. Uses both positively and negatively framed items to reduce response bias. Validated across multiple occupational groups.',
  license: 'Free to use for research purposes',
  validation: 'Cronbach\'s alpha: Exhaustion (0.85), Disengagement (0.83). Demonstrated convergent validity with Maslach Burnout Inventory and other burnout measures.',
  specialNote: 'Contains both positively and negatively worded items. Positively worded items (marked with reverse: true) need to be reverse scored (5 - score) before calculating the total.'
};

export default olbiQuestions;
