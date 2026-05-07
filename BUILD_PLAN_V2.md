# CertMasterMind V2 — Build Plan

## Status: 🔴 NOT STARTED

---

## What We're Adding

Phase 2 upgrades to the existing AI-900 quiz app. All changes build on the current `quiz-app/` codebase deployed on Vercel.

### New Features
1. **Category system** — Every question tagged to one of the 5 official AI-900 exam domains
2. **Supplemental questions** — ~100+ new questions from the IsabellaS2/AI-900 GitHub repo (MIT license, community-curated, includes Generative AI coverage we're missing)
3. **Category selection screen** — Pick a single domain or "All" before starting
4. **Randomized questions** — Shuffled every session (already works, but now filtered by selected category)
5. **Per-category score tracking** — localStorage tracks correct/total per domain; shows strengths and weaknesses
6. **22-Day Study Plan checklist** — Interactive checklist tab with your personal study plan, persisted in localStorage
7. **Missed Questions bank** — Every wrong answer gets saved; replay just those

### Updated File Structure
```
quiz-app/src/
├── main.jsx              ← Entry point (no change)
├── App.jsx               ← Refactored: multi-screen flow (Start → Quiz → Summary)
├── App.css               ← Updated styles for new screens
├── index.css             ← Base styles (minor tweaks)
├── questions.json        ← Expanded: ~200+ questions, each with "category" field
├── studyPlan.js          ← 22-day plan data (exported array)
└── components/           ← NEW: extracted components
    ├── StartScreen.jsx   ← Category selection + stats overview
    ├── QuizScreen.jsx    ← Current quiz logic (extracted from App.jsx)
    ├── SummaryScreen.jsx ← End-of-session results with per-category breakdown
    ├── StudyPlan.jsx     ← 22-day checklist tab
    └── StatsPanel.jsx    ← Category strengths/weaknesses display
```

---

## Exam Domains (Categories)

Based on the official Microsoft AI-900 study guide (updated May 2, 2025):

| # | Category | Exam Weight | Color |
|---|----------|-------------|-------|
| 1 | AI Workloads & Responsible AI | 15–20% | `#e74c3c` |
| 2 | Machine Learning Fundamentals | 15–20% | `#3498db` |
| 3 | Computer Vision | 15–20% | `#2ecc71` |
| 4 | Natural Language Processing | 15–20% | `#f39c12` |
| 5 | Generative AI | 20–25% | `#9b59b6` |

---

## Build Steps

### Step 1: Add category field to existing questions + merge supplemental questions
**Status:** 🔴 Not started

The current `questions.json` has 96 questions with no category field. This step:
1. Adds a `"category"` string to every existing question
2. Merges ~100+ new questions from the IsabellaS2/AI-900 repo
3. Ensures no duplicate questions
4. Validates the JSON

New question format:
```json
{
  "id": 200,
  "category": "Generative AI",
  "question": "What are Large Language Models?",
  "options": [
    "Models that only work with one language.",
    "Models that only work with small amounts of data.",
    "Models that use deep learning to process and understand natural language on a massive scale."
  ],
  "answer": [2],
  "explanation": "LLMs use deep learning to process and understand natural language on a massive scale."
}
```

Valid category values (use these exact strings):
- `"AI Workloads & Responsible AI"`
- `"Machine Learning Fundamentals"`
- `"Computer Vision"`
- `"Natural Language Processing"`
- `"Generative AI"`

**Codex prompt:**
```
Read quiz-app/src/questions.json. Add a "category" field to every existing question using one of these exact values:
- "AI Workloads & Responsible AI" — questions about AI workload types, responsible AI principles (fairness, transparency, accountability, inclusiveness, reliability, privacy)
- "Machine Learning Fundamentals" — questions about regression, classification, clustering, deep learning, features/labels, Azure ML, AutoML, model evaluation
- "Computer Vision" — questions about image classification, object detection, OCR, face detection, Custom Vision, Azure AI Vision
- "Natural Language Processing" — questions about text analytics, sentiment analysis, key phrases, entity recognition, language detection, LUIS/CLU, QnA Maker, speech, translation, bots, Form Recognizer/Document Intelligence
- "Generative AI" — questions about LLMs, GPT, DALL-E, Azure OpenAI, prompt engineering, Copilot, RAG, content filters, responsible GenAI

Then append the following NEW questions to the array (start IDs at 200). Categorize each one as you add it.

NEW QUESTIONS TO ADD:

--- AI Workloads & Responsible AI ---

Q: What is AI?
Options: ["Software that imitates human behaviors and capabilities", "Advanced mathematics", "Machine learning, computer vision, natural language processing", "Programming language"]
Answer: [0]
Explanation: AI is software that imitates human behaviors and capabilities.

Q: What are the key workloads in AI?
Options: ["Data science", "Advanced mathematics", "Machine learning, computer vision, natural language processing", "Robotics"]
Answer: [2]
Explanation: The key AI workloads include machine learning, computer vision, natural language processing, and more.

Q: What principle of responsible AI emphasizes treating all people fairly?
Options: ["Reliability and safety", "Privacy and security", "Fairness", "Inclusiveness"]
Answer: [2]
Explanation: Fairness ensures AI treats all groups of people equitably.

Q: Which aspect of responsible AI focuses on ensuring secure handling of data?
Options: ["Reliability and safety", "Transparency", "Privacy and security", "Accountability"]
Answer: [2]
Explanation: Privacy and security focuses on secure handling of personal data.

Q: What Microsoft service provides capabilities for deploying and hosting generative AI models?
Options: ["Azure Vision Studio", "Azure AI Language", "Azure OpenAI Service", "Azure AI Vision"]
Answer: [2]
Explanation: Azure OpenAI Service is Microsoft's platform for deploying and hosting generative AI models.

Q: A predictive app provides audio output for visually impaired users. Which principle of Responsible AI is reflected here?
Options: ["Transparency", "Inclusiveness", "Fairness"]
Answer: [1]
Explanation: Inclusiveness means AI should address a broad range of human needs including accessibility.

Q: According to Microsoft's guidelines, what is the first stage in developing a responsible generative AI plan?
Options: ["Identify potential harms", "Measure potential harms", "Mitigate potential harms"]
Answer: [0]
Explanation: The first stage is to identify potential harms before measuring or mitigating them.

Q: Why should you consider creating an AI Impact Assessment when designing a generative AI solution?
Options: ["To make a legal case that indemnifies you from responsibility", "To document the purpose, expected use, and potential harms for the solution", "To evaluate the cost of cloud services required"]
Answer: [1]
Explanation: An AI Impact Assessment documents the purpose, expected use, and potential harms for the solution.

Q: What is the purpose of the "red team" testing mentioned in the responsible generative AI process?
Options: ["To verify the presence of potential harms in the solution", "To prioritize the identified harms", "To test the robustness of the model layer"]
Answer: [0]
Explanation: Red team testing verifies the presence of potential harms in the solution.

--- Machine Learning Fundamentals ---

Q: What is the fundamental goal of machine learning?
Options: ["To write code for predictive models", "To use data to create a predictive model", "To study historical data only", "To predict past observations accurately"]
Answer: [1]
Explanation: Machine learning uses data to create predictive models that can make inferences about new data.

Q: What is the process called when a machine learning model calculates an output value based on input values?
Options: ["Inference", "Training", "Collaboration", "Modeling"]
Answer: [0]
Explanation: Inference is when a trained model calculates predictions from new input data.

Q: What is the primary objective of clustering in unsupervised machine learning?
Options: ["To determine relationships between features and labels", "To predict a categorization or class", "To group observations based on similarities", "To identify patterns in historical data"]
Answer: [2]
Explanation: Clustering groups data points based on similarities without using labeled data.

Q: Which of the following is an example of regression?
Options: ["Predicting whether a bank customer will default on a loan", "Predicting the genre of a movie", "Predicting the species of a penguin", "Predicting the fuel efficiency of a car"]
Answer: [3]
Explanation: Predicting fuel efficiency (a continuous numeric value) from features is regression.

Q: What evaluation metric is commonly used for evaluating a regression model?
Options: ["Accuracy", "Recall", "Mean Absolute Error (MAE)", "Precision"]
Answer: [2]
Explanation: MAE measures the average difference between predicted and actual values for regression models.

Q: What evaluation metric is commonly used for evaluating a binary classification model?
Options: ["Mean Squared Error (MSE)", "F1-score", "Root Mean Squared Error (RMSE)", "Coefficient of determination (R2)"]
Answer: [1]
Explanation: F1-score balances precision and recall and is commonly used for binary classification.

Q: What is deep learning?
Options: ["A form of unsupervised learning", "A form of supervised learning", "A form of machine learning used for regression", "An advanced form of machine learning inspired by the human brain"]
Answer: [3]
Explanation: Deep learning uses neural networks inspired by the human brain for advanced pattern recognition.

Q: What is Azure Machine Learning?
Options: ["A programming language for machine learning", "A cloud service for managing machine learning projects", "An open-source machine learning library", "A deep learning framework"]
Answer: [1]
Explanation: Azure Machine Learning is a cloud service for managing the full machine learning lifecycle.

Q: Which metric can be used to evaluate the quality of clusters?
Options: ["Accuracy", "Recall", "Silhouette", "Precision"]
Answer: [2]
Explanation: The Silhouette score measures how similar data points are to their own cluster compared to other clusters.

Q: What does automated machine learning in Azure Machine Learning enable you to do?
Options: ["Automatically deploy new versions of a model as they're trained", "Automatically provision Azure Machine Learning workspaces", "Automatically run multiple training jobs using different algorithms and parameters to find the best model"]
Answer: [2]
Explanation: AutoML automates running multiple training jobs with different algorithms and parameters.

Q: Which assumption of the multiple linear regression model should be satisfied to avoid misleading predictions?
Options: ["Features are dependent on each other", "Features are independent of each other", "Labels are dependent on each other", "Labels are independent of each other"]
Answer: [1]
Explanation: Features should be independent of each other to avoid multicollinearity in linear regression.

--- Computer Vision ---

Q: What is an image, from the perspective of a computer program?
Options: ["A representation of biological eyes", "A visual perception mechanism", "An array of numeric pixel values"]
Answer: [2]
Explanation: Computers represent images as arrays of numeric pixel values.

Q: Which machine learning model architecture is commonly used for image classification?
Options: ["Recurrent Neural Networks (RNNs)", "Convolutional Neural Networks (CNNs)", "Transformer Networks"]
Answer: [1]
Explanation: CNNs are the standard architecture for image classification tasks.

Q: What is the primary purpose of face detection and analysis in AI?
Options: ["To analyze text data", "To locate and analyze human faces in images or video content", "To identify animals in photographs", "To generate captions for images"]
Answer: [1]
Explanation: Face detection locates and analyzes human faces in images or video.

Q: What attributes can the Azure Face service provide for detected faces?
Options: ["Species of animals", "Facial expressions", "Accessories, blur, exposure, glasses, head pose, mask, noise, and occlusion", "Text content"]
Answer: [2]
Explanation: Azure Face service detects attributes like accessories, blur, exposure, glasses, head pose, mask, noise, and occlusion.

Q: What is OCR?
Options: ["Optical Character Rendering", "Object Character Recognition", "Optical Character Recognition", "Object Code Recognition"]
Answer: [2]
Explanation: OCR stands for Optical Character Recognition — extracting text from images.

Q: What hierarchy is used to organize results from Azure AI Vision's OCR engine?
Options: ["Pages -> Text blocks -> Words", "Pages -> Lines -> Words", "Pages -> Paragraphs -> Sentences", "Pages -> Regions -> Text blocks"]
Answer: [1]
Explanation: The OCR engine organizes results in a hierarchy of Pages, Lines, and Words.

Q: Which capability is supported by Azure AI Vision service?
Options: ["Generating captions and descriptions of images", "Only optical character recognition", "Image compression"]
Answer: [0]
Explanation: Azure AI Vision can generate captions, descriptions, detect objects, read text, and more.

Q: What are multi-modal models in computer vision?
Options: ["Models that provide prebuilt and customizable computer vision capabilities", "Models that train language models", "Models that perform image editing tasks"]
Answer: [0]
Explanation: Multi-modal models combine vision and language capabilities for richer understanding.

--- Natural Language Processing ---

Q: What is the purpose of natural language processing (NLP) in computer systems?
Options: ["To interpret the subject of text in a way similar to humans", "To encrypt text for secure transmission", "To compress text files for storage efficiency", "To convert text to speech"]
Answer: [0]
Explanation: NLP enables computers to interpret text and spoken language similarly to humans.

Q: What is tokenization in the context of text analysis?
Options: ["Breaking down a text into distinct words or phrases", "Encrypting text for secure transmission", "Converting text to speech", "Analyzing the frequency of words in a text"]
Answer: [0]
Explanation: Tokenization breaks text into individual tokens (words or subwords) for processing.

Q: What is conversational AI?
Options: ["A solution that enables dialogue between an AI agent and a human", "A technique to encrypt communication between computers", "A method for compressing large text files", "An approach to convert speech into text"]
Answer: [0]
Explanation: Conversational AI enables natural dialogue between AI agents and humans.

Q: What is an utterance in conversational language understanding?
Options: ["An example of something a user might say that the application must interpret", "A method for training language models", "A technique to encrypt communication channels", "A type of Azure resource"]
Answer: [0]
Explanation: Utterances are examples of user input that the language model must interpret.

Q: What is an entity in conversational language understanding?
Options: ["A pre-defined intent for common scenarios", "An item to which an utterance refers", "A method for connecting client applications", "A natural language expression"]
Answer: [1]
Explanation: Entities are the items or concepts that utterances refer to (like cities, dates, products).

Q: What is an intent in conversational language understanding?
Options: ["A specific instance of a general device entity", "The purpose or goal expressed in a user's utterance", "A resource for training language models", "A type of pre-built domain"]
Answer: [1]
Explanation: An intent represents the purpose or goal behind what a user says.

Q: What are the two primary capabilities supported by AI speech systems?
Options: ["Speech recognition and transcription", "Speech synthesis and natural language processing", "Speech recognition and synthesis", "Speech analysis and sentiment detection"]
Answer: [2]
Explanation: AI speech systems support speech recognition (speech-to-text) and synthesis (text-to-speech).

Q: What is the main purpose of document intelligence?
Options: ["To create documents", "To process text and extract information from documents", "To share documents", "To archive documents"]
Answer: [1]
Explanation: Document intelligence processes and extracts structured information from documents.

Q: What are the two types of models supported by Azure AI Document Intelligence?
Options: ["Simple and complex models", "Prebuilt and custom models", "Online and offline models", "Static and dynamic models"]
Answer: [1]
Explanation: Azure AI Document Intelligence supports prebuilt models (for common document types) and custom models.

Q: What is the primary purpose of knowledge mining solutions like Azure AI Search?
Options: ["To manually read through documents", "To automatically extract information from unstructured data", "To organize documents in a file system", "To create documents"]
Answer: [1]
Explanation: Knowledge mining automatically extracts information and insights from large volumes of unstructured data.

Q: What is the purpose of a skillset in Azure AI Search?
Options: ["To define search queries", "To store search results", "To automate data ingestion", "To apply a sequence of AI skills to enrich data"]
Answer: [3]
Explanation: A skillset defines a sequence of AI enrichment skills applied during indexing.

Q: Which data format is accepted by Azure AI Search when pushing data to the index?
Options: ["CSV", "SQL", "JSON"]
Answer: [2]
Explanation: Azure AI Search accepts JSON format when pushing data to an index.

Q: What is a significant benefit of Azure AI services?
Options: ["They require specialist AI knowledge to implement", "They are only accessible to large technology companies", "They unlock automation for workloads in language, vision, intelligent search, content generation, and more", "They are primarily designed for robotics applications"]
Answer: [2]
Explanation: Azure AI services provide pre-trained models that unlock automation across many workload types.

Q: What are the two types of Azure AI service resources?
Options: ["Basic and advanced", "Public and private", "Multi-service and single-service", "Internal and external"]
Answer: [2]
Explanation: Azure AI offers multi-service resources (one key for multiple services) and single-service resources.

--- Generative AI ---

Q: What is generative AI?
Options: ["AI that imitates human behavior using predefined instructions", "AI that interacts with the environment without explicit directions", "AI that generates original content", "AI that analyzes existing data and makes predictions"]
Answer: [2]
Explanation: Generative AI creates original content like text, images, and code.

Q: What is the purpose of tokenization in transformer models?
Options: ["To create natural language responses", "To decompose training text into tokens", "To generate embeddings for tokens", "To calculate attention scores"]
Answer: [1]
Explanation: Tokenization decomposes text into individual tokens for the transformer to process.

Q: What is the role of attention layers in transformer models?
Options: ["To predict the next token in a sequence", "To evaluate the semantic relationships between tokens", "To decompose training text into tokens", "To generate embeddings for tokens"]
Answer: [1]
Explanation: Attention layers evaluate how each token relates to every other token in the sequence.

Q: What is Azure OpenAI Service?
Options: ["Microsoft's cloud solution for deploying, customizing, and hosting large language models", "A platform for weather forecasting", "An API for stock market analysis", "A medical diagnosis tool"]
Answer: [0]
Explanation: Azure OpenAI Service is Microsoft's platform for deploying and hosting LLMs.

Q: What are copilots?
Options: ["Large language models for generating code", "AI assistants that help users with common tasks", "Models specifically designed for medical diagnosis", "Tools for weather forecasting"]
Answer: [1]
Explanation: Copilots are AI assistants integrated into applications to help users with everyday tasks.

Q: What is prompt engineering?
Options: ["The process of designing user interfaces", "The process of improving the quality of responses from generative AI by refining prompts", "The process of optimizing search engine algorithms", "The process of training machine learning models"]
Answer: [1]
Explanation: Prompt engineering is the practice of crafting and refining inputs to get better outputs from AI models.

Q: How are ChatGPT, OpenAI, and Azure OpenAI related?
Options: ["Azure OpenAI is Microsoft's version of ChatGPT", "ChatGPT and OpenAI are chatbots that generate natural language. Azure OpenAI provides access to these two chatbots.", "OpenAI is a research company that developed ChatGPT. Azure OpenAI provides access to many of OpenAI's AI models."]
Answer: [2]
Explanation: OpenAI is the research company, ChatGPT is their chatbot product, and Azure OpenAI provides enterprise access to OpenAI's models.

Q: What capability of Azure OpenAI Service helps mitigate harmful content generation at the Safety System level?
Options: ["DALL-E model support", "Fine-tuning", "Content filters"]
Answer: [2]
Explanation: Content filters in Azure OpenAI detect and block harmful content at the platform level.

Q: Which layer of a generative AI solution focuses on the construction of prompts submitted to the model?
Options: ["The model layer", "The safety system layer", "The metaprompt and grounding layer"]
Answer: [2]
Explanation: The metaprompt and grounding layer handles prompt construction including system messages and grounding data.

Q: What is the purpose of the safety system layer in a generative AI solution?
Options: ["To fine-tune the generative AI model", "To apply platform-level configurations and capabilities to mitigate harm", "To design the user interface of the application"]
Answer: [1]
Explanation: The safety system layer applies platform-level configurations like content filters to mitigate harm.

Q: Why should you consider a phased delivery plan for your generative AI solution?
Options: ["To enable rapid deployment without user feedback", "To enable you to gather feedback and identify issues before releasing the solution more broadly", "To ensure complete secrecy of the solution until full release"]
Answer: [1]
Explanation: A phased delivery plan allows gathering feedback and identifying problems before wider release.

Q: What is the purpose of vector-based embeddings?
Options: ["To represent semantic meaning of text tokens", "To create tokens in multiple languages", "To correct misspellings in training data"]
Answer: [0]
Explanation: Embeddings represent the semantic meaning of tokens as numeric vectors in multi-dimensional space.

Q: What types of responses can generative AI applications provide?
Options: ["Text only", "Text, images, and code", "Images only", "Code only"]
Answer: [1]
Explanation: Generative AI can produce text, images, code, and other types of content.

Q: What is one action Microsoft takes to support ethical AI practices in Azure OpenAI?
Options: ["Provides Transparency Notes that share how technology is built and asks users to consider its implications", "Logs users out of Azure OpenAI Studio after inactivity", "Allows users to build any application regardless of harmful effects"]
Answer: [0]
Explanation: Transparency Notes document how the technology works and its implications for ethical consideration.

Ensure all new question IDs start at 200 and increment. Keep the category field as the second field after id for readability. Validate the final JSON is parseable. Do not remove or modify any existing questions — only add the category field to them and append the new ones.
```

---

### Step 2: Create the study plan data file
**Status:** 🔴 Not started

Create `quiz-app/src/studyPlan.js` with the 22-day plan as a structured array.

**Codex prompt:**
```
Create the file quiz-app/src/studyPlan.js with a default export of the 22-day study plan array. Each entry should have: day (number), date (string), topic (string), description (string), and category (string matching one of the 5 exam domains, or "Review" or "Practice Test" for non-domain days).

Here is the plan:

export default [
  { day: 1, date: "May 5", topic: "What is AI?", description: "MS Learn: Fundamental AI Concepts — define AI, identify AI workload types (ML, CV, NLP, GenAI). Know what each workload does at a high level.", category: "AI Workloads & Responsible AI" },
  { day: 2, date: "May 6", topic: "Responsible AI (Part 1)", description: "MS Learn: Responsible AI principles — fairness, reliability & safety, privacy & security. Memorize all 6 principles and one example each.", category: "AI Workloads & Responsible AI" },
  { day: 3, date: "May 7", topic: "Responsible AI (Part 2)", description: "MS Learn: Remaining principles — inclusiveness, transparency, accountability. Know how each applies to real scenarios.", category: "AI Workloads & Responsible AI" },
  { day: 4, date: "May 8", topic: "Azure AI Services Overview", description: "MS Learn: Azure AI services resource types (multi-service vs single-service), keys, endpoints, regions. Understand when to use which resource type.", category: "AI Workloads & Responsible AI" },
  { day: 5, date: "May 9", topic: "Computer Vision Basics", description: "MS Learn: Image classification, object detection, CNNs. Know the difference between classification (what is it?) vs detection (where is it?).", category: "Computer Vision" },
  { day: 6, date: "May 10", topic: "Face & OCR", description: "MS Learn: Azure AI Face service (detection vs analysis vs recognition), OCR with Azure AI Vision Read API. Know the Pages→Lines→Words hierarchy.", category: "Computer Vision" },
  { day: 7, date: "May 11", topic: "Week 1 Review", description: "Review Days 1-6 notes. Take a 20-question quiz in CertMasterMind filtered to AI Workloads and Computer Vision categories.", category: "Review" },
  { day: 8, date: "May 12", topic: "NLP Fundamentals (Part 1)", description: "MS Learn: Text Analytics — sentiment analysis, key phrase extraction, entity recognition, language detection. Know what each one returns.", category: "Natural Language Processing" },
  { day: 9, date: "May 13", topic: "NLP Fundamentals (Part 2)", description: "MS Learn: Conversational Language Understanding (CLU) — intents, entities, utterances, the None intent. Know the author→train→publish→predict flow.", category: "Natural Language Processing" },
  { day: 10, date: "May 14", topic: "Conversational AI & Bots", description: "MS Learn: Question Answering, Azure Bot Service, channels. Know how to build a FAQ bot: provision Language resource → create KB → deploy bot → connect channels.", category: "Natural Language Processing" },
  { day: 11, date: "May 15", topic: "Speech & Translation", description: "MS Learn: Azure AI Speech (speech-to-text, text-to-speech), Translator service. Know acoustic vs language models and when to use each service.", category: "Natural Language Processing" },
  { day: 12, date: "May 16", topic: "Machine Learning Concepts", description: "MS Learn: Regression, classification, clustering. Memorize: regression=numeric, classification=category, clustering=unsupervised grouping. Know one evaluation metric for each.", category: "Machine Learning Fundamentals" },
  { day: 13, date: "May 17", topic: "Azure ML & Deep Learning", description: "MS Learn: Azure Machine Learning workspace, AutoML, features vs labels, training/validation split, deep learning & neural networks.", category: "Machine Learning Fundamentals" },
  { day: 14, date: "May 18", topic: "Week 2 Review", description: "Review Days 8-13. Take a 30-question quiz in CertMasterMind filtered to NLP and ML categories. Note weak areas.", category: "Review" },
  { day: 15, date: "May 19", topic: "Generative AI Fundamentals", description: "MS Learn: LLMs, tokenization, embeddings, transformer architecture, attention mechanism. Know GPT=text, DALL-E=images.", category: "Generative AI" },
  { day: 16, date: "May 20", topic: "Copilot & RAG", description: "MS Learn: Microsoft Copilot, retrieval augmented generation (RAG), Azure AI Search integration. Know the full GenAI stack.", category: "Generative AI" },
  { day: 17, date: "May 21", topic: "Practice Test #1", description: "Take full Microsoft practice assessment. Target: 65%+. Write down EVERY question you got wrong and why.", category: "Practice Test" },
  { day: 18, date: "May 22", topic: "Weak Spots", description: "Re-study the domains where you scored lowest. Go back to those specific MS Learn modules.", category: "Review" },
  { day: 19, date: "May 23", topic: "Practice Test #2", description: "Retake practice assessment. Target: 75%+. Compare with Test #1 — are the same topics still weak?", category: "Practice Test" },
  { day: 20, date: "May 24", topic: "Cheat Sheet", description: "Build a 1-page cheat sheet: every Azure AI service name, what it does, when to use it. Write by hand if possible.", category: "Review" },
  { day: 21, date: "May 25", topic: "Practice Test #3", description: "Final practice assessment. Target: 80%+. If below 75%, focus Day 22 entirely on weak areas.", category: "Practice Test" },
  { day: 22, date: "May 26", topic: "Final Review", description: "Review cheat sheet only. Skim responsible AI principles one more time. STOP studying by evening.", category: "Review" },
];
```

---

### Step 3: Refactor App.jsx into multi-screen component architecture
**Status:** 🔴 Not started

Extract the current monolith into separate components and add the new screen flow:
**Start Screen** → (pick category) → **Quiz Screen** → **Summary Screen**
Plus a **Study Plan** tab accessible from any screen.

**Codex prompt:**
```
Refactor quiz-app/src/App.jsx into a multi-screen app. The current quiz logic stays the same but gets extracted into components. Here's the architecture:

APP STATE MACHINE:
- "start" → StartScreen (category selection + stats)
- "quiz" → QuizScreen (current quiz flow, filtered by selected category)
- "summary" → SummaryScreen (results + per-category breakdown)
- "plan" → StudyPlan (22-day checklist)

The top of every screen should have a nav bar with:
- App title "CertMasterMind" (left)
- Two buttons: "Quiz" and "Study Plan" (right) — these switch between quiz flow and study plan

APP.JSX should:
1. Manage screen state (start/quiz/summary/plan)
2. Manage category stats in localStorage (key: "ai900-category-stats")
   Stats format: { "AI Workloads & Responsible AI": { correct: 5, total: 10 }, ... }
3. Manage missed questions in localStorage (key: "ai900-missed")
   Missed format: array of question IDs
4. Pass props down to child components

STARTSCREEN.JSX should:
1. Show a welcome message
2. Display 5 category cards in a grid, each showing:
   - Category name and icon
   - Exam weight (e.g., "15–20%")
   - Stats: "12/20 correct (60%)" or "Not started" if no data
   - A colored progress bar based on accuracy
   - Tappable to select that category
3. An "All Categories" button at the top that selects all questions
4. A "Missed Questions Only" button (if there are missed questions) that quizzes only previously-wrong answers
5. After selecting, transition to "quiz" screen

QUIZSCREEN.JSX should:
1. Accept filtered question array as prop
2. Shuffle questions on mount
3. Keep the exact same quiz logic from the current App.jsx:
   - Single-answer and multi-select support
   - Tap answer → green/red feedback + explanation
   - Streak counter and high score
   - Progress bar
   - "Next →" button after answering
4. After each answer, call a parent callback to update category stats and missed questions
5. When all questions done, transition to "summary" screen

SUMMARYSCREEN.JSX should:
1. Show overall score (X of Y correct, percentage)
2. Show per-category breakdown table:
   - Category name | Correct | Total | Percentage | colored bar
3. Show session streak high
4. "Restart" button → back to start screen
5. "Review Missed" button → quiz only the questions missed this session

STUDYPLAN.JSX should:
1. Import study plan data from ../studyPlan.js
2. Render a checklist with 22 items
3. Each item shows: checkbox, day number, date, topic name, description
4. Checkboxes persist in localStorage (key: "ai900-checklist")
5. Show progress: "X of 22 days completed"
6. Today's day should be visually highlighted based on the date
7. A "Reset Progress" button at the bottom

Keep the existing dark theme (#0f172a background). Keep the app mobile-first (max-width 480px centered). The styling should stay clean — white cards on dark background, same rounded corners and typography. Add category colors as accent borders or badges on the cards.

Do NOT use Tailwind. Use the existing App.css approach with plain CSS. Add new styles to App.css for the new components.

Make sure the app still builds and runs with `npm run dev` and `npm run build`.
```

---

### Step 4: Ensure questions are randomized
**Status:** 🔴 Not started

The existing shuffle function works, but verify it runs on:
1. Initial session start (already works)
2. Category filter change (new — must re-shuffle when switching categories)
3. Restart (already works)

**Codex prompt:**
```
In quiz-app/src/components/QuizScreen.jsx, ensure the shuffleQuestions function runs every time the component receives a new set of filtered questions (when the user picks a different category). Use a useEffect or key-based remount to trigger a fresh shuffle. The shuffle should use the existing Fisher-Yates implementation. Verify that:
1. Questions are randomized on every new session
2. Questions re-randomize when switching categories
3. The same question never appears twice in a session
4. Restarting gives a fresh random order
```

---

### Step 5: Test locally
**Status:** 🔴 Not started

```bash
cd quiz-app
npm run dev
```

Test checklist:
- [ ] Start screen shows 5 categories with stats
- [ ] Tapping a category filters and shuffles questions
- [ ] "All Categories" loads all questions shuffled
- [ ] Quiz flow works (single + multi-select, streak, high score)
- [ ] Per-category stats update after each answer
- [ ] Missed questions get saved
- [ ] Summary screen shows per-category breakdown
- [ ] "Missed Questions Only" replays wrong answers
- [ ] Study Plan tab shows 22-day checklist
- [ ] Checkbox state persists across page reloads
- [ ] `npm run build` succeeds with no errors

---

### Step 6: Deploy to Vercel
**Status:** 🔴 Not started

```bash
cd quiz-app
git add .
git commit -m "V2: categories, supplemental questions, study plan, per-category tracking"
git push
```

Vercel auto-deploys within ~30 seconds.

---

## Update Log

| Step | Status | Notes |
|------|--------|-------|
| 1. Add categories + supplemental questions | ✅ | Added categories to all 110 existing questions and appended 56 supplemental questions (IDs 200-255). |
| 2. Create study plan data file | ✅ | Added `quiz-app/src/studyPlan.js` with the full 22-day structured plan export. |
| 3. Refactor into multi-screen components | ✅ | Split the app into start, quiz, summary, stats, and study-plan components with shared nav and localStorage-backed state. |
| 4. Randomize questions per category | ✅ | `QuizScreen` now reshuffles with Fisher-Yates whenever the filtered question set or session ID changes. |
| 5. Test locally | ✅ | Verified `npm.cmd run build` succeeds and confirmed the Vite dev server starts on `127.0.0.1:4173` in a smoke test. |
| 6. Deploy to Vercel | 🔴 | |

---

## Question Sources
- Original: [anxkhn/azure-ai-900-exam-prep](https://github.com/anxkhn/azure-ai-900-exam-prep) (96 questions)
- Supplemental: [IsabellaS2/AI-900](https://github.com/IsabellaS2/AI-900) (~100+ questions, Microsoft + community-curated)
- Exam domains: [Microsoft AI-900 Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-900) (updated May 2, 2025)
