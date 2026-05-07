const studyPlan = [
  {
    day: 1,
    date: 'May 5',
    topic: 'Blind Run: AI Workloads & Responsible AI',
    description:
      'Do ALL questions in this category cold - no studying first. Read every explanation carefully, especially wrong answers. Note your score.',
    category: 'AI Workloads & Responsible AI',
  },
  {
    day: 2,
    date: 'May 6',
    topic: 'Blind Run: Machine Learning',
    description:
      "Do ALL Machine Learning questions cold. Read every explanation. If something doesn't click, skim ONLY that section on MS Learn - not the whole module.",
    category: 'Machine Learning Fundamentals',
  },
  {
    day: 3,
    date: 'May 7',
    topic: 'Blind Run: Computer Vision',
    description:
      'Do ALL Computer Vision questions cold. Focus on the explanations for wrong answers. Check the Glossary tab for any unfamiliar service names.',
    category: 'Computer Vision',
  },
  {
    day: 4,
    date: 'May 8',
    topic: 'Blind Run: NLP',
    description:
      'Do ALL NLP questions cold. Pay attention to old vs new service names (LUIS->CLU, QnA Maker->Custom Question Answering).',
    category: 'Natural Language Processing',
  },
  {
    day: 5,
    date: 'May 9',
    topic: 'Blind Run: Generative AI',
    description:
      'Do ALL Generative AI questions cold. This is the heaviest domain (20-25%). Know Microsoft Foundry, prompt engineering params, RAG, content filters.',
    category: 'Generative AI',
  },
  {
    day: 6,
    date: 'May 10',
    topic: 'Review: Missed Questions Round 1',
    description:
      "Hit 'Missed Questions Only' on the start screen. Re-do every question you got wrong in Days 1-5. For any you miss AGAIN, look up that specific concept on MS Learn.",
    category: 'Review',
  },
  {
    day: 7,
    date: 'May 11',
    topic: 'Glossary & Gaps',
    description:
      "Read through the entire Glossary tab. Star or write down any terms you don't recognize. Look up those specific terms on MS Learn.",
    category: 'Review',
  },
  {
    day: 8,
    date: 'May 12',
    topic: 'Targeted Drill: Weakest Category',
    description:
      'Check your category stats on the start screen. Drill your lowest-scoring category. Read explanations even for correct answers.',
    category: 'Review',
  },
  {
    day: 9,
    date: 'May 13',
    topic: 'Targeted Drill: 2nd Weakest Category',
    description:
      "Drill your second-lowest category. If you're above 80% in all categories, do a full 'All Categories' run instead.",
    category: 'Review',
  },
  {
    day: 10,
    date: 'May 14',
    topic: 'Full Mixed Quiz #1',
    description:
      'Select All Categories and do a full run. Simulate exam conditions: no breaks, no looking things up. Record your overall percentage.',
    category: 'Practice Test',
  },
  {
    day: 11,
    date: 'May 15',
    topic: 'Review: Missed Questions Round 2',
    description:
      "Hit 'Missed Questions Only' again. These are your persistent weak spots. For each one, write a one-sentence summary of WHY the right answer is right.",
    category: 'Review',
  },
  {
    day: 12,
    date: 'May 16',
    topic: 'Responsible AI Deep Dive',
    description:
      "Memorize FAIR-PT mnemonic. Do the AI Workloads category again. You should be scoring 85%+ here - it's the easiest domain to lock down.",
    category: 'AI Workloads & Responsible AI',
  },
  {
    day: 13,
    date: 'May 17',
    topic: 'Generative AI Deep Dive',
    description:
      'Re-drill Generative AI. Focus on: Microsoft Foundry, Foundry model catalog, temperature vs top_p, zero-shot vs few-shot, RAG, content filters.',
    category: 'Generative AI',
  },
  {
    day: 14,
    date: 'May 18',
    topic: 'Full Mixed Quiz #2',
    description:
      'All categories, exam conditions. Target: 75%+. Compare to Quiz #1 - are the same categories still weak?',
    category: 'Practice Test',
  },
  {
    day: 15,
    date: 'May 19',
    topic: 'Microsoft Practice Assessment #1',
    description:
      'Take the FREE official Microsoft practice assessment at learn.microsoft.com. This is the closest to the real exam. Record domain scores.',
    category: 'Practice Test',
  },
  {
    day: 16,
    date: 'May 20',
    topic: 'Gap Fill from MS Assessment',
    description:
      'Review every question you got wrong on the Microsoft assessment. Look up those specific topics. Re-read glossary entries for those concepts.',
    category: 'Review',
  },
  {
    day: 17,
    date: 'May 21',
    topic: 'Full Mixed Quiz #3',
    description:
      "All categories in the app. Target: 80%+. You should be seeing improvement from Quiz #1 and #2.",
    category: 'Practice Test',
  },
  {
    day: 18,
    date: 'May 22',
    topic: 'Service Matching Drill',
    description:
      'Go through the Glossary and for every Azure service, quiz yourself: what does it do? When would I use it? What was it formerly called?',
    category: 'Review',
  },
  {
    day: 19,
    date: 'May 23',
    topic: 'Microsoft Practice Assessment #2',
    description:
      'Retake the official Microsoft assessment. Target: 80%+. Compare domain scores to Assessment #1.',
    category: 'Practice Test',
  },
  {
    day: 20,
    date: 'May 24',
    topic: 'Cheat Sheet Day',
    description:
      'Review the Glossary tab - this IS your cheat sheet. Write down (by hand) the 10 terms you keep forgetting.',
    category: 'Review',
  },
  {
    day: 21,
    date: 'May 25',
    topic: 'Final Full Run',
    description:
      'All categories, exam conditions. Target: 85%+. If below 75%, spend tomorrow on your weakest domain only.',
    category: 'Practice Test',
  },
  {
    day: 22,
    date: 'May 26',
    topic: 'Final Review',
    description:
      'Review your handwritten cheat sheet only. Skim FAIR-PT one more time. Do 10 Missed Questions max. STOP studying by evening.',
    category: 'Review',
  },
]

export default studyPlan
