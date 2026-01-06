// Copenhagen Burnout Inventory (CBI)
// Source: National Research Centre for the Working Environment, Denmark
// Citation: Kristensen TS, Borritz M, Villadsen E, Christensen KB. The Copenhagen Burnout Inventory: A new tool for the assessment of burnout. Work Stress. 2005;19(3):192-207.
// License: Free to use for research and clinical purposes

export const cbiQuestions = [
  // Personal Burnout (6 items)
  {
    id: 'cbi_1',
    section: 'personal',
    text: 'How often do you feel tired?',
    text_zh: '您多常感到疲倦？',
    options: [
      { value: 100, label: 'Always', label_zh: '總是' },
      { value: 75, label: 'Often', label_zh: '經常' },
      { value: 50, label: 'Sometimes', label_zh: '有時候' },
      { value: 25, label: 'Seldom', label_zh: '很少' },
      { value: 0, label: 'Never/Almost never', label_zh: '從不/幾乎從不' }
    ]
  },
  {
    id: 'cbi_2',
    section: 'personal',
    text: 'How often do you feel physically exhausted?',
    text_zh: '您多常感到身體上的疲憊？',
    options: [
      { value: 100, label: 'Always', label_zh: '總是' },
      { value: 75, label: 'Often', label_zh: '經常' },
      { value: 50, label: 'Sometimes', label_zh: '有時候' },
      { value: 25, label: 'Seldom', label_zh: '很少' },
      { value: 0, label: 'Never/Almost never', label_zh: '從不/幾乎從不' }
    ]
  },
  {
    id: 'cbi_3',
    section: 'personal',
    text: 'How often do you feel emotionally exhausted?',
    text_zh: '您多常感到情緒上的疲憊？',
    options: [
      { value: 100, label: 'Always', label_zh: '總是' },
      { value: 75, label: 'Often', label_zh: '經常' },
      { value: 50, label: 'Sometimes', label_zh: '有時候' },
      { value: 25, label: 'Seldom', label_zh: '很少' },
      { value: 0, label: 'Never/Almost never', label_zh: '從不/幾乎從不' }
    ]
  },
  {
    id: 'cbi_4',
    section: 'personal',
    text: 'How often do you think: "I can\'t take it anymore"?',
    text_zh: '您多常想著：「我再也受不了了」？',
    options: [
      { value: 100, label: 'Always', label_zh: '總是' },
      { value: 75, label: 'Often', label_zh: '經常' },
      { value: 50, label: 'Sometimes', label_zh: '有時候' },
      { value: 25, label: 'Seldom', label_zh: '很少' },
      { value: 0, label: 'Never/Almost never', label_zh: '從不/幾乎從不' }
    ]
  },
  {
    id: 'cbi_5',
    section: 'personal',
    text: 'How often do you feel weak and susceptible to illness?',
    text_zh: '您多常感到虛弱且容易生病？',
    options: [
      { value: 100, label: 'Always', label_zh: '總是' },
      { value: 75, label: 'Often', label_zh: '經常' },
      { value: 50, label: 'Sometimes', label_zh: '有時候' },
      { value: 25, label: 'Seldom', label_zh: '很少' },
      { value: 0, label: 'Never/Almost never', label_zh: '從不/幾乎從不' }
    ]
  },
  {
    id: 'cbi_6',
    section: 'personal',
    text: 'How often do you feel worn out?',
    text_zh: '您多常感到精疲力竭？',
    options: [
      { value: 100, label: 'Always', label_zh: '總是' },
      { value: 75, label: 'Often', label_zh: '經常' },
      { value: 50, label: 'Sometimes', label_zh: '有時候' },
      { value: 25, label: 'Seldom', label_zh: '很少' },
      { value: 0, label: 'Never/Almost never', label_zh: '從不/幾乎從不' }
    ]
  },

  // Work-related Burnout (7 items)
  {
    id: 'cbi_7',
    section: 'work',
    text: 'Is your work emotionally exhausting?',
    text_zh: '您的工作是否讓您情緒疲憊？',
    options: [
      { value: 100, label: 'To a very high degree', label_zh: '非常嚴重' },
      { value: 75, label: 'To a high degree', label_zh: '嚴重' },
      { value: 50, label: 'Somewhat', label_zh: '有點' },
      { value: 25, label: 'To a low degree', label_zh: '輕微' },
      { value: 0, label: 'To a very low degree', label_zh: '非常輕微' }
    ]
  },
  {
    id: 'cbi_8',
    section: 'work',
    text: 'Do you feel burnt out because of your work?',
    text_zh: '您是否因為工作而感到倦怠？',
    options: [
      { value: 100, label: 'To a very high degree', label_zh: '非常嚴重' },
      { value: 75, label: 'To a high degree', label_zh: '嚴重' },
      { value: 50, label: 'Somewhat', label_zh: '有點' },
      { value: 25, label: 'To a low degree', label_zh: '輕微' },
      { value: 0, label: 'To a very low degree', label_zh: '非常輕微' }
    ]
  },
  {
    id: 'cbi_9',
    section: 'work',
    text: 'Does your work frustrate you?',
    text_zh: '您的工作是否讓您感到挫折？',
    options: [
      { value: 100, label: 'To a very high degree', label_zh: '非常嚴重' },
      { value: 75, label: 'To a high degree', label_zh: '嚴重' },
      { value: 50, label: 'Somewhat', label_zh: '有點' },
      { value: 25, label: 'To a low degree', label_zh: '輕微' },
      { value: 0, label: 'To a very low degree', label_zh: '非常輕微' }
    ]
  },
  {
    id: 'cbi_10',
    section: 'work',
    text: 'Do you feel worn out at the end of the working day?',
    text_zh: '您在工作日結束時是否感到精疲力竭？',
    options: [
      { value: 100, label: 'Always', label_zh: '總是' },
      { value: 75, label: 'Often', label_zh: '經常' },
      { value: 50, label: 'Sometimes', label_zh: '有時候' },
      { value: 25, label: 'Seldom', label_zh: '很少' },
      { value: 0, label: 'Never/Almost never', label_zh: '從不/幾乎從不' }
    ]
  },
  {
    id: 'cbi_11',
    section: 'work',
    text: 'Are you exhausted in the morning at the thought of another day at work?',
    text_zh: '您在早上想到又要工作一天時是否感到疲憊？',
    options: [
      { value: 100, label: 'Always', label_zh: '總是' },
      { value: 75, label: 'Often', label_zh: '經常' },
      { value: 50, label: 'Sometimes', label_zh: '有時候' },
      { value: 25, label: 'Seldom', label_zh: '很少' },
      { value: 0, label: 'Never/Almost never', label_zh: '從不/幾乎從不' }
    ]
  },
  {
    id: 'cbi_12',
    section: 'work',
    text: 'Do you feel that every working hour is tiring for you?',
    text_zh: '您是否感覺每個工作小時都讓您感到疲憊？',
    options: [
      { value: 100, label: 'Always', label_zh: '總是' },
      { value: 75, label: 'Often', label_zh: '經常' },
      { value: 50, label: 'Sometimes', label_zh: '有時候' },
      { value: 25, label: 'Seldom', label_zh: '很少' },
      { value: 0, label: 'Never/Almost never', label_zh: '從不/幾乎從不' }
    ]
  },
  {
    id: 'cbi_13',
    section: 'work',
    text: 'Do you have enough energy for family and friends during leisure time?',
    text_zh: '您在閒暇時間是否有足夠的精力陪伴家人和朋友？',
    options: [
      { value: 0, label: 'Always', label_zh: '總是' },
      { value: 25, label: 'Often', label_zh: '經常' },
      { value: 50, label: 'Sometimes', label_zh: '有時候' },
      { value: 75, label: 'Seldom', label_zh: '很少' },
      { value: 100, label: 'Never/Almost never', label_zh: '從不/幾乎從不' }
    ]
  },

  // Client-related Burnout (6 items) - For healthcare/service workers
  {
    id: 'cbi_14',
    section: 'client',
    text: 'Do you find it hard to work with clients?',
    text_zh: '您是否覺得與服務對象工作很困難？',
    options: [
      { value: 100, label: 'To a very high degree', label_zh: '非常嚴重' },
      { value: 75, label: 'To a high degree', label_zh: '嚴重' },
      { value: 50, label: 'Somewhat', label_zh: '有點' },
      { value: 25, label: 'To a low degree', label_zh: '輕微' },
      { value: 0, label: 'To a very low degree', label_zh: '非常輕微' }
    ]
  },
  {
    id: 'cbi_15',
    section: 'client',
    text: 'Do you find it frustrating to work with clients?',
    text_zh: '您是否覺得與服務對象工作令人挫折？',
    options: [
      { value: 100, label: 'To a very high degree', label_zh: '非常嚴重' },
      { value: 75, label: 'To a high degree', label_zh: '嚴重' },
      { value: 50, label: 'Somewhat', label_zh: '有點' },
      { value: 25, label: 'To a low degree', label_zh: '輕微' },
      { value: 0, label: 'To a very low degree', label_zh: '非常輕微' }
    ]
  },
  {
    id: 'cbi_16',
    section: 'client',
    text: 'Does it drain your energy to work with clients?',
    text_zh: '與服務對象工作是否耗盡您的精力？',
    options: [
      { value: 100, label: 'To a very high degree', label_zh: '非常嚴重' },
      { value: 75, label: 'To a high degree', label_zh: '嚴重' },
      { value: 50, label: 'Somewhat', label_zh: '有點' },
      { value: 25, label: 'To a low degree', label_zh: '輕微' },
      { value: 0, label: 'To a very low degree', label_zh: '非常輕微' }
    ]
  },
  {
    id: 'cbi_17',
    section: 'client',
    text: 'Do you feel that you give more than you get back when you work with clients?',
    text_zh: '您是否覺得在與服務對象工作時付出多於回報？',
    options: [
      { value: 100, label: 'To a very high degree', label_zh: '非常嚴重' },
      { value: 75, label: 'To a high degree', label_zh: '嚴重' },
      { value: 50, label: 'Somewhat', label_zh: '有點' },
      { value: 25, label: 'To a low degree', label_zh: '輕微' },
      { value: 0, label: 'To a very low degree', label_zh: '非常輕微' }
    ]
  },
  {
    id: 'cbi_18',
    section: 'client',
    text: 'Are you tired of working with clients?',
    text_zh: '您是否厭倦了與服務對象工作？',
    options: [
      { value: 100, label: 'To a very high degree', label_zh: '非常嚴重' },
      { value: 75, label: 'To a high degree', label_zh: '嚴重' },
      { value: 50, label: 'Somewhat', label_zh: '有點' },
      { value: 25, label: 'To a low degree', label_zh: '輕微' },
      { value: 0, label: 'To a very low degree', label_zh: '非常輕微' }
    ]
  },
  {
    id: 'cbi_19',
    section: 'client',
    text: 'Do you sometimes wonder how long you will be able to continue working with clients?',
    text_zh: '您是否有時想知道自己還能繼續與服務對象工作多久？',
    options: [
      { value: 100, label: 'To a very high degree', label_zh: '非常嚴重' },
      { value: 75, label: 'To a high degree', label_zh: '嚴重' },
      { value: 50, label: 'Somewhat', label_zh: '有點' },
      { value: 25, label: 'To a low degree', label_zh: '輕微' },
      { value: 0, label: 'To a very low degree', label_zh: '非常輕微' }
    ]
  }
];

export const cbiSections = {
  personal: {
    name: 'Personal Burnout',
    name_zh: '個人倦怠',
    description: 'The degree of physical and psychological fatigue and exhaustion experienced by the person',
    description_zh: '個人經歷的身心疲勞和精疲力竭程度',
    items: [1, 2, 3, 4, 5, 6]
  },
  work: {
    name: 'Work-related Burnout',
    name_zh: '工作相關倦怠',
    description: 'The degree of physical and psychological fatigue and exhaustion perceived by the person as related to work',
    description_zh: '個人認為與工作相關的身心疲勞和精疲力竭程度',
    items: [7, 8, 9, 10, 11, 12, 13]
  },
  client: {
    name: 'Client-related Burnout',
    name_zh: '服務對象相關倦怠',
    description: 'The degree of physical and psychological fatigue and exhaustion perceived by the person as related to work with clients',
    description_zh: '個人認為與服務對象工作相關的身心疲勞和精疲力竭程度',
    items: [14, 15, 16, 17, 18, 19]
  }
};

export const cbiScoring = {
  method: 'average',
  range: { min: 0, max: 100 },
  calculation: 'Average of all item scores (each item already on 0-100 scale)',
  interpretation: {
    low: { max: 33, label: '低倦怠', description: '倦怠程度較低' },
    moderate: { min: 34, max: 66, label: '中度倦怠', description: '出現中度倦怠徵兆，建議關注' },
    high: { min: 67, label: '高倦怠', description: '倦怠程度較高，建議尋求專業協助' }
  }
};

export const cbiSource = {
  name: 'National Research Centre for the Working Environment (Denmark)',
  url: 'https://nfa.dk/da/Vaerktoejer/Sporgeskemaer/Copenhagen-Burnout-Inventory',
  citation: 'Kristensen TS, Borritz M, Villadsen E, Christensen KB. The Copenhagen Burnout Inventory: A new tool for the assessment of burnout. Work & Stress. 2005;19(3):192-207. doi:10.1080/02678370500297720',
  academicBasis: 'Validated measure with three subscales: Personal, Work-related, and Client-related burnout. Widely used in healthcare and service industry research.',
  license: 'Free to use for research and clinical purposes - Open access tool',
  validation: 'Cronbach\'s alpha: Personal (0.87), Work (0.87), Client (0.85). Strong convergent validity with Maslach Burnout Inventory.'
};

export default cbiQuestions;
