const studyPlan = [
  {
    day: 1,
    date: 'May 5',
    topic: 'What is AI?',
    description:
      'MS Learn: Fundamental AI Concepts - define AI, identify AI workload types (ML, CV, NLP, GenAI). Know what each workload does at a high level.',
    category: 'AI Workloads & Responsible AI',
  },
  {
    day: 2,
    date: 'May 6',
    topic: 'Responsible AI (Part 1)',
    description:
      'MS Learn: Responsible AI principles - fairness, reliability & safety, privacy & security. Memorize all 6 principles and one example each.',
    category: 'AI Workloads & Responsible AI',
  },
  {
    day: 3,
    date: 'May 7',
    topic: 'Responsible AI (Part 2)',
    description:
      'MS Learn: Remaining principles - inclusiveness, transparency, accountability. Know how each applies to real scenarios.',
    category: 'AI Workloads & Responsible AI',
  },
  {
    day: 4,
    date: 'May 8',
    topic: 'Azure AI Services Overview',
    description:
      'MS Learn: Azure AI services resource types (multi-service vs single-service), keys, endpoints, regions. Understand when to use which resource type.',
    category: 'AI Workloads & Responsible AI',
  },
  {
    day: 5,
    date: 'May 9',
    topic: 'Computer Vision Basics',
    description:
      'MS Learn: Image classification, object detection, CNNs. Know the difference between classification (what is it?) vs detection (where is it?).',
    category: 'Computer Vision',
  },
  {
    day: 6,
    date: 'May 10',
    topic: 'Face & OCR',
    description:
      'MS Learn: Azure AI Face service (detection vs analysis vs recognition), OCR with Azure AI Vision Read API. Know the Pages->Lines->Words hierarchy.',
    category: 'Computer Vision',
  },
  {
    day: 7,
    date: 'May 11',
    topic: 'Week 1 Review',
    description:
      'Review Days 1-6 notes. Take a 20-question quiz in CertMasterMind filtered to AI Workloads and Computer Vision categories.',
    category: 'Review',
  },
  {
    day: 8,
    date: 'May 12',
    topic: 'NLP Fundamentals (Part 1)',
    description:
      'MS Learn: Text Analytics - sentiment analysis, key phrase extraction, entity recognition, language detection. Know what each one returns.',
    category: 'Natural Language Processing',
  },
  {
    day: 9,
    date: 'May 13',
    topic: 'NLP Fundamentals (Part 2)',
    description:
      'MS Learn: Conversational Language Understanding (CLU) - intents, entities, utterances, the None intent. Know the author->train->publish->predict flow.',
    category: 'Natural Language Processing',
  },
  {
    day: 10,
    date: 'May 14',
    topic: 'Conversational AI & Bots',
    description:
      'MS Learn: Question Answering, Azure Bot Service, channels. Know how to build a FAQ bot: provision Language resource -> create KB -> deploy bot -> connect channels.',
    category: 'Natural Language Processing',
  },
  {
    day: 11,
    date: 'May 15',
    topic: 'Speech & Translation',
    description:
      'MS Learn: Azure AI Speech (speech-to-text, text-to-speech), Translator service. Know acoustic vs language models and when to use each service.',
    category: 'Natural Language Processing',
  },
  {
    day: 12,
    date: 'May 16',
    topic: 'Machine Learning Concepts',
    description:
      'MS Learn: Regression, classification, clustering. Memorize: regression=numeric, classification=category, clustering=unsupervised grouping. Know one evaluation metric for each.',
    category: 'Machine Learning Fundamentals',
  },
  {
    day: 13,
    date: 'May 17',
    topic: 'Azure ML & Deep Learning',
    description:
      'MS Learn: Azure Machine Learning workspace, AutoML, features vs labels, training/validation split, deep learning & neural networks.',
    category: 'Machine Learning Fundamentals',
  },
  {
    day: 14,
    date: 'May 18',
    topic: 'Week 2 Review',
    description:
      'Review Days 8-13. Take a 30-question quiz in CertMasterMind filtered to NLP and ML categories. Note weak areas.',
    category: 'Review',
  },
  {
    day: 15,
    date: 'May 19',
    topic: 'Generative AI Fundamentals',
    description:
      'MS Learn: LLMs, tokenization, embeddings, transformer architecture, attention mechanism. Know GPT=text, DALL-E=images.',
    category: 'Generative AI',
  },
  {
    day: 16,
    date: 'May 20',
    topic: 'Copilot & RAG',
    description:
      'MS Learn: Microsoft Copilot, retrieval augmented generation (RAG), Azure AI Search integration. Know the full GenAI stack.',
    category: 'Generative AI',
  },
  {
    day: 17,
    date: 'May 21',
    topic: 'Practice Test #1',
    description:
      'Take full Microsoft practice assessment. Target: 65%+. Write down EVERY question you got wrong and why.',
    category: 'Practice Test',
  },
  {
    day: 18,
    date: 'May 22',
    topic: 'Weak Spots',
    description:
      'Re-study the domains where you scored lowest. Go back to those specific MS Learn modules.',
    category: 'Review',
  },
  {
    day: 19,
    date: 'May 23',
    topic: 'Practice Test #2',
    description:
      'Retake practice assessment. Target: 75%+. Compare with Test #1 - are the same topics still weak?',
    category: 'Practice Test',
  },
  {
    day: 20,
    date: 'May 24',
    topic: 'Cheat Sheet',
    description:
      'Build a 1-page cheat sheet: every Azure AI service name, what it does, when to use it. Write by hand if possible.',
    category: 'Review',
  },
  {
    day: 21,
    date: 'May 25',
    topic: 'Practice Test #3',
    description:
      'Final practice assessment. Target: 80%+. If below 75%, focus Day 22 entirely on weak areas.',
    category: 'Practice Test',
  },
  {
    day: 22,
    date: 'May 26',
    topic: 'Final Review',
    description:
      'Review cheat sheet only. Skim responsible AI principles one more time. STOP studying by evening.',
    category: 'Review',
  },
]

export default studyPlan
