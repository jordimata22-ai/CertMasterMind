# CertMasterMind V3 — Build Plan

## Status: 🔴 NOT STARTED

---

## What We're Adding

Phase 3 upgrades: more questions from a Microsoft MVP source, a searchable glossary/cheat sheet tab, and an updated study plan that matches Jordi's question-first learning style.

### New Features
1. **Timothy Warner questions** — ~8 high-quality questions from a Microsoft MVP repo (timothywarner/ai900), updated for May 2025 objectives. Covers NEW exam topics we're missing: Microsoft Foundry, Transformer architecture, prompt engineering parameters.
2. **Glossary / Cheat Sheet tab** — Searchable quick-reference of every Azure AI service, key term, and concept. Organized by exam domain. This becomes the digital version of the Day 20 cheat sheet.
3. **Updated study plan** — Restructured around question-first learning (active recall) instead of read-then-quiz. The app's studyPlan.js gets replaced.

---

## Build Steps

### Step 1: Add Timothy Warner questions to questions.json
**Status:** 🔴 Not started

Read `quiz-app/src/questions.json`. Find the highest existing question ID and start new IDs after that (probably 250+). Append the following questions. Do NOT modify or remove any existing questions.

New questions to add:

```json
[
  {
    "id": 300,
    "category": "AI Workloads & Responsible AI",
    "question": "A retail company wants to ensure its AI-powered hiring tool treats all candidates fairly regardless of background. Which responsible AI principle is most relevant?",
    "options": ["Reliability and Safety", "Fairness", "Privacy and Security", "Transparency"],
    "answer": [1],
    "explanation": "Fairness addresses bias and equitable treatment across different groups. While Transparency could help identify bias, the question focuses on equal treatment."
  },
  {
    "id": 301,
    "category": "AI Workloads & Responsible AI",
    "question": "Which of the following are common AI workloads? (Select all that apply)",
    "options": ["Computer vision", "Natural language processing", "Data warehousing", "Document processing", "Network routing"],
    "answer": [0, 1, 3],
    "explanation": "Computer vision, NLP, and document processing are AI workloads. Data warehousing and network routing are general IT tasks, not AI-specific workloads."
  },
  {
    "id": 302,
    "category": "Machine Learning Fundamentals",
    "question": "What is a key feature of the Transformer architecture used in modern AI models?",
    "options": ["It uses convolution layers for image processing", "It processes sequences recursively", "It uses self-attention mechanisms", "It requires less training data than other approaches"],
    "answer": [2],
    "explanation": "Transformers use self-attention to focus on relevant parts of input sequences. This is the foundation of models like GPT and BERT. Convolution is for CNNs, recursive processing is for RNNs."
  },
  {
    "id": 303,
    "category": "Computer Vision",
    "question": "You need to extract text from scanned images that contain both printed and handwritten content. Which Azure service should you use?",
    "options": ["Azure AI Vision (OCR/Read API)", "Custom Vision", "Azure AI Face", "Azure AI Document Intelligence"],
    "answer": [0],
    "explanation": "Azure AI Vision's OCR/Read API handles both printed and handwritten text extraction. Custom Vision is for image classification, Face is for facial analysis, and Document Intelligence is for structured documents like invoices and receipts."
  },
  {
    "id": 304,
    "category": "Natural Language Processing",
    "question": "A company wants to build a bot that understands customer intents like 'book a flight' or 'cancel reservation' and extracts entities like dates and destinations. Which service should they use?",
    "options": ["Azure AI Language (sentiment analysis)", "Conversational Language Understanding (CLU)", "Custom Question Answering", "Azure Translator"],
    "answer": [1],
    "explanation": "CLU (formerly LUIS) is designed for extracting intents and entities from conversational input. Custom QA is for FAQ-style Q&A, sentiment analysis only determines emotion, and Translator converts languages."
  },
  {
    "id": 305,
    "category": "Generative AI",
    "question": "What is Microsoft Foundry?",
    "options": ["A replacement for Azure Machine Learning", "A unified platform for developing AI applications with access to 1,600+ models", "A service only for Azure OpenAI models", "A tool for creating custom AI models from scratch"],
    "answer": [1],
    "explanation": "Microsoft Foundry (formerly Azure AI Studio) is Microsoft's unified AI development platform with access to a vast model catalog including models from Microsoft, OpenAI, Meta, and Hugging Face. It integrates with but doesn't replace Azure ML."
  },
  {
    "id": 306,
    "category": "Generative AI",
    "question": "Which parameter in prompt engineering controls the randomness/creativity of model outputs?",
    "options": ["max_tokens", "top_p", "temperature", "frequency_penalty"],
    "answer": [2],
    "explanation": "Temperature (0-1) controls randomness: 0 = deterministic/factual, 1 = creative/random. max_tokens limits output length, top_p controls probability sampling, frequency_penalty reduces repetition."
  },
  {
    "id": 307,
    "category": "Generative AI",
    "question": "What is the primary purpose of Retrieval-Augmented Generation (RAG)?",
    "options": ["To fine-tune a model on custom data", "To ground model responses in specific, retrieved data to reduce hallucinations", "To compress large language models for faster inference", "To translate content between languages"],
    "answer": [1],
    "explanation": "RAG retrieves relevant documents/data and includes them in the prompt context, grounding the model's responses in factual information and reducing hallucinations."
  },
  {
    "id": 308,
    "category": "Generative AI",
    "question": "What is the difference between zero-shot and few-shot prompting?",
    "options": ["Zero-shot uses no examples while few-shot provides examples in the prompt", "Zero-shot is faster than few-shot", "Few-shot requires fine-tuning the model", "Zero-shot only works with GPT-4"],
    "answer": [0],
    "explanation": "Zero-shot prompting gives the model a task with no examples. Few-shot prompting includes example input-output pairs in the prompt to guide the model's response format and style."
  },
  {
    "id": 309,
    "category": "Generative AI",
    "question": "Which feature of Azure OpenAI Service helps prevent the generation of harmful or inappropriate content?",
    "options": ["Temperature settings", "Content filters", "Token limits", "Embedding models"],
    "answer": [1],
    "explanation": "Azure OpenAI has built-in content filters that detect and block harmful content across categories like hate, violence, sexual content, and self-harm at the platform level."
  },
  {
    "id": 310,
    "category": "Generative AI",
    "question": "What are the features of the Azure AI Foundry model catalog?",
    "options": ["It only contains Microsoft-built models", "It provides access to 1,600+ models from Microsoft, OpenAI, Meta, Hugging Face and others with filtering and comparison tools", "It is a paid service requiring an Enterprise agreement", "It only supports text generation models"],
    "answer": [1],
    "explanation": "The Azure AI Foundry model catalog provides access to over 1,600 models from multiple providers. You can filter, compare, and deploy models for various tasks including text, image, and code generation."
  },
  {
    "id": 311,
    "category": "Machine Learning Fundamentals",
    "question": "A data scientist wants to predict the selling price of houses based on features like square footage, number of bedrooms, and location. Which machine learning technique should they use?",
    "options": ["Classification", "Clustering", "Regression", "Reinforcement Learning"],
    "answer": [2],
    "explanation": "Regression predicts continuous numeric values (price). Classification predicts categories, Clustering finds groups without labels, and Reinforcement Learning learns through trial and error."
  },
  {
    "id": 312,
    "category": "Natural Language Processing",
    "question": "Which Azure service should you use to identify the language of a text document?",
    "options": ["Azure Translator", "Azure AI Language", "Azure OpenAI Service", "Azure AI Speech"],
    "answer": [1],
    "explanation": "Azure AI Language service includes language detection capabilities. Azure Translator translates between known languages but language detection is a feature of the Language service."
  }
]
```

Before adding, check for duplicate questions by comparing question text against existing entries. Skip any that are too similar to what's already in the file. Validate the final JSON parses correctly.

---

### Step 2: Create the glossary data file
**Status:** 🔴 Not started

Create `quiz-app/src/glossary.js` with a default export. The glossary is organized by exam domain and contains every key term, Azure service, and concept that appears on the exam.

```javascript
export default [
  // --- AI Workloads & Responsible AI ---
  { term: "Artificial Intelligence (AI)", definition: "Software that imitates human behaviors and capabilities including learning, reasoning, and problem-solving.", category: "AI Workloads & Responsible AI" },
  { term: "Machine Learning", definition: "A subset of AI where models learn patterns from data to make predictions without being explicitly programmed.", category: "AI Workloads & Responsible AI" },
  { term: "Computer Vision", definition: "AI workload that interprets visual information from images and video.", category: "AI Workloads & Responsible AI" },
  { term: "Natural Language Processing (NLP)", definition: "AI workload that enables computers to understand, interpret, and generate human language.", category: "AI Workloads & Responsible AI" },
  { term: "Document Processing", definition: "AI workload that extracts structured information from documents like invoices, receipts, and forms.", category: "AI Workloads & Responsible AI" },
  { term: "Generative AI", definition: "AI that creates original content — text, images, code — rather than just analyzing existing data.", category: "AI Workloads & Responsible AI" },
  { term: "Fairness", definition: "Responsible AI principle: AI should treat all groups of people equitably without discrimination based on race, gender, etc.", category: "AI Workloads & Responsible AI" },
  { term: "Reliability & Safety", definition: "Responsible AI principle: AI should perform reliably and safely under normal and unexpected conditions.", category: "AI Workloads & Responsible AI" },
  { term: "Privacy & Security", definition: "Responsible AI principle: AI should handle data securely and protect individual privacy.", category: "AI Workloads & Responsible AI" },
  { term: "Inclusiveness", definition: "Responsible AI principle: AI should address a broad range of human needs and be accessible to people with disabilities.", category: "AI Workloads & Responsible AI" },
  { term: "Transparency", definition: "Responsible AI principle: AI systems should be understandable — users should know how decisions are made.", category: "AI Workloads & Responsible AI" },
  { term: "Accountability", definition: "Responsible AI principle: People who design and deploy AI must be answerable for how their systems operate.", category: "AI Workloads & Responsible AI" },
  { term: "FAIR-PT", definition: "Mnemonic for the 6 responsible AI principles: Fairness, Accountability, Inclusiveness, Reliability & Safety, Privacy & Security, Transparency.", category: "AI Workloads & Responsible AI" },
  { term: "Azure AI Services", definition: "Umbrella term for Microsoft's pre-built AI APIs (formerly Cognitive Services). Can be multi-service (one key for all) or single-service resources.", category: "AI Workloads & Responsible AI" },
  { term: "Multi-service resource", definition: "One Azure AI Services resource with a single key and endpoint that provides access to multiple AI services.", category: "AI Workloads & Responsible AI" },
  { term: "Single-service resource", definition: "A dedicated Azure resource for one specific AI service (e.g., just Vision or just Language) with its own key and endpoint.", category: "AI Workloads & Responsible AI" },

  // --- Machine Learning Fundamentals ---
  { term: "Regression", definition: "ML technique that predicts a continuous numeric value (e.g., price, temperature, sales). Key metrics: MAE, RMSE, R².", category: "Machine Learning Fundamentals" },
  { term: "Classification", definition: "ML technique that predicts a category/class label (e.g., spam/not spam, disease type). Key metrics: accuracy, precision, recall, F1-score.", category: "Machine Learning Fundamentals" },
  { term: "Clustering", definition: "Unsupervised ML technique that groups similar data points without labeled data. Key metric: Silhouette score.", category: "Machine Learning Fundamentals" },
  { term: "Features", definition: "The input columns/variables used to train a model (e.g., square footage, number of bedrooms).", category: "Machine Learning Fundamentals" },
  { term: "Labels", definition: "The target value the model is trained to predict (e.g., house price, spam/not spam).", category: "Machine Learning Fundamentals" },
  { term: "Training dataset", definition: "The portion of data used to teach the model patterns. Typically 70-80% of total data.", category: "Machine Learning Fundamentals" },
  { term: "Validation dataset", definition: "The portion of data used to evaluate model performance during training. Typically 20-30% of total data.", category: "Machine Learning Fundamentals" },
  { term: "Deep Learning", definition: "Advanced ML using artificial neural networks with multiple layers, inspired by the human brain. Used for complex pattern recognition.", category: "Machine Learning Fundamentals" },
  { term: "Transformer", definition: "Neural network architecture that uses self-attention mechanisms. Foundation of GPT, BERT, and all modern LLMs. NEW on exam.", category: "Machine Learning Fundamentals" },
  { term: "Self-attention", definition: "Mechanism in Transformers that lets the model weigh the importance of different parts of the input relative to each other.", category: "Machine Learning Fundamentals" },
  { term: "Azure Machine Learning", definition: "Cloud service for the full ML lifecycle: data prep, training, evaluation, deployment, and monitoring.", category: "Machine Learning Fundamentals" },
  { term: "AutoML", definition: "Azure ML feature that automatically tries multiple algorithms and hyperparameters to find the best model.", category: "Machine Learning Fundamentals" },
  { term: "Azure ML Designer", definition: "Drag-and-drop visual interface for building ML pipelines without code.", category: "Machine Learning Fundamentals" },
  { term: "Inference", definition: "Using a trained model to make predictions on new, unseen data.", category: "Machine Learning Fundamentals" },
  { term: "Overfitting", definition: "When a model performs well on training data but poorly on new data — it memorized instead of learning patterns.", category: "Machine Learning Fundamentals" },
  { term: "Mean Absolute Error (MAE)", definition: "Regression metric: average absolute difference between predicted and actual values. Lower = better.", category: "Machine Learning Fundamentals" },
  { term: "R² (R-squared)", definition: "Regression metric: proportion of variance explained by the model. 1.0 = perfect, 0 = no better than average.", category: "Machine Learning Fundamentals" },
  { term: "F1-score", definition: "Classification metric: harmonic mean of precision and recall. Balances both for overall accuracy.", category: "Machine Learning Fundamentals" },
  { term: "Silhouette score", definition: "Clustering metric: measures how similar points are to their own cluster vs other clusters. Range -1 to 1, higher = better.", category: "Machine Learning Fundamentals" },
  { term: "Feature Engineering", definition: "Creating new input features from existing data to improve model performance.", category: "Machine Learning Fundamentals" },

  // --- Computer Vision ---
  { term: "Image Classification", definition: "Identifies WHAT is in an image by assigning a label/tag (e.g., 'cat', 'dog', 'car').", category: "Computer Vision" },
  { term: "Object Detection", definition: "Identifies WHAT and WHERE objects are in an image using bounding boxes with labels.", category: "Computer Vision" },
  { term: "OCR (Optical Character Recognition)", definition: "Extracts text from images. Azure AI Vision Read API organizes results as Pages → Lines → Words.", category: "Computer Vision" },
  { term: "Azure AI Vision", definition: "Service for image analysis: captions, tags, object detection, OCR, smart cropping. Formerly Computer Vision.", category: "Computer Vision" },
  { term: "Custom Vision", definition: "Service for training your own image classification or object detection models with your labeled images.", category: "Computer Vision" },
  { term: "Azure AI Face", definition: "Service for face detection and analysis: accessories, blur, exposure, glasses, head pose, mask, noise, occlusion.", category: "Computer Vision" },
  { term: "Face Detection vs Recognition", definition: "Detection = finding faces in an image. Recognition = identifying WHO a face belongs to (more restricted).", category: "Computer Vision" },
  { term: "CNN (Convolutional Neural Network)", definition: "Neural network architecture commonly used for image classification and computer vision tasks.", category: "Computer Vision" },
  { term: "Azure AI Document Intelligence", definition: "Extracts structured data from documents (invoices, receipts, IDs). Has prebuilt and custom models. Formerly Form Recognizer.", category: "Computer Vision" },

  // --- Natural Language Processing ---
  { term: "Sentiment Analysis", definition: "Determines if text is positive, negative, or neutral. Part of Azure AI Language service.", category: "Natural Language Processing" },
  { term: "Key Phrase Extraction", definition: "Identifies the main talking points in text. Part of Azure AI Language service.", category: "Natural Language Processing" },
  { term: "Entity Recognition (NER)", definition: "Identifies and categorizes entities in text: people, places, organizations, dates, quantities.", category: "Natural Language Processing" },
  { term: "Language Detection", definition: "Identifies which language a text document is written in. Part of Azure AI Language service.", category: "Natural Language Processing" },
  { term: "Azure AI Language", definition: "Service for text analytics: sentiment, key phrases, entities, language detection, summarization, custom classification.", category: "Natural Language Processing" },
  { term: "CLU (Conversational Language Understanding)", definition: "Service for understanding user intents and extracting entities from natural language. Formerly LUIS.", category: "Natural Language Processing" },
  { term: "Intent", definition: "The purpose or goal expressed in a user's utterance (e.g., 'BookFlight', 'CancelReservation').", category: "Natural Language Processing" },
  { term: "Entity", definition: "An item or concept that an utterance refers to (e.g., 'Seattle', 'tomorrow', '2 tickets').", category: "Natural Language Processing" },
  { term: "Utterance", definition: "An example of something a user might say that the language model must interpret.", category: "Natural Language Processing" },
  { term: "Custom Question Answering", definition: "Creates FAQ-style conversational bots from documents, URLs, or manual Q&A pairs. Formerly QnA Maker.", category: "Natural Language Processing" },
  { term: "Azure AI Speech", definition: "Service for speech-to-text (recognition) and text-to-speech (synthesis).", category: "Natural Language Processing" },
  { term: "Azure Translator", definition: "Service for real-time text translation between 100+ languages.", category: "Natural Language Processing" },
  { term: "Azure Bot Service", definition: "Framework for building and deploying conversational bots across channels: webchat, Teams, email, Slack.", category: "Natural Language Processing" },
  { term: "Azure AI Search", definition: "Search service with AI enrichment (skillsets) for extracting insights from unstructured data. Formerly Cognitive Search.", category: "Natural Language Processing" },
  { term: "Skillset", definition: "In Azure AI Search, a sequence of AI enrichment skills applied during indexing (e.g., OCR, entity extraction, key phrases).", category: "Natural Language Processing" },
  { term: "Knowledge Mining", definition: "Using AI to automatically extract information and insights from large volumes of unstructured data.", category: "Natural Language Processing" },
  { term: "Tokenization", definition: "Breaking text into individual tokens (words or subwords) for NLP or LLM processing.", category: "Natural Language Processing" },

  // --- Generative AI ---
  { term: "Large Language Model (LLM)", definition: "Deep learning model trained on massive text data that can generate, summarize, translate, and reason about text. Examples: GPT-4, LLaMA.", category: "Generative AI" },
  { term: "Azure OpenAI Service", definition: "Microsoft's enterprise platform for deploying OpenAI models (GPT-4, DALL-E, Embeddings) with Azure security and compliance.", category: "Generative AI" },
  { term: "Microsoft Foundry", definition: "Unified AI development platform (formerly Azure AI Studio) with access to 1,600+ models. Integrates with Azure ML. NEW on exam.", category: "Generative AI" },
  { term: "Foundry Model Catalog", definition: "Browsable catalog of 1,600+ models from Microsoft, OpenAI, Meta, Hugging Face and others. Filter and compare before deploying. NEW on exam.", category: "Generative AI" },
  { term: "GPT", definition: "Generative Pre-trained Transformer. OpenAI's text generation model family. GPT-4 is the latest.", category: "Generative AI" },
  { term: "DALL-E", definition: "OpenAI's image generation model. Creates images from text descriptions.", category: "Generative AI" },
  { term: "Embeddings", definition: "Vector representations of text that capture semantic meaning. Used for similarity search, RAG, and recommendations.", category: "Generative AI" },
  { term: "Prompt Engineering", definition: "The practice of crafting inputs (prompts) to get better, more accurate outputs from AI models.", category: "Generative AI" },
  { term: "Temperature", definition: "Prompt parameter (0-1) controlling randomness. 0 = deterministic/factual. 1 = creative/random.", category: "Generative AI" },
  { term: "top_p", definition: "Prompt parameter controlling probability sampling. Lower values make output more focused and deterministic.", category: "Generative AI" },
  { term: "max_tokens", definition: "Prompt parameter that limits the length of the model's response.", category: "Generative AI" },
  { term: "Zero-shot prompting", definition: "Giving the model a task with no examples. Relies on the model's pre-trained knowledge.", category: "Generative AI" },
  { term: "Few-shot prompting", definition: "Including example input-output pairs in the prompt to guide the model's response format and style.", category: "Generative AI" },
  { term: "System message", definition: "Instructions given to the model that define its behavior, persona, and constraints. Part of the metaprompt layer.", category: "Generative AI" },
  { term: "RAG (Retrieval-Augmented Generation)", definition: "Pattern that retrieves relevant documents and includes them in the prompt to ground responses in factual data and reduce hallucinations.", category: "Generative AI" },
  { term: "Grounding", definition: "Connecting model responses to specific, verifiable data sources to improve accuracy.", category: "Generative AI" },
  { term: "Hallucination", definition: "When an AI model generates confident but factually incorrect or fabricated information.", category: "Generative AI" },
  { term: "Content Filters", definition: "Azure OpenAI's built-in safety system that detects and blocks harmful content (hate, violence, sexual, self-harm).", category: "Generative AI" },
  { term: "Copilot", definition: "Microsoft's AI assistant brand integrated into products (Microsoft 365, GitHub, etc.) to help users with everyday tasks.", category: "Generative AI" },
  { term: "Metaprompt & Grounding Layer", definition: "The layer in a GenAI solution that handles prompt construction, system messages, and grounding data.", category: "Generative AI" },
  { term: "Safety System Layer", definition: "Platform-level configurations (content filters, abuse monitoring) that mitigate harm in GenAI solutions.", category: "Generative AI" },
  { term: "Transparency Notes", definition: "Microsoft documentation explaining how AI technology is built and asking users to consider its implications. Part of responsible GenAI.", category: "Generative AI" },
];
```

---

### Step 3: Build the Glossary component and add it as a tab
**Status:** 🔴 Not started

Create `quiz-app/src/components/Glossary.jsx` and wire it into App.jsx as a third nav option alongside Quiz and Study Plan.

The Glossary component should:
1. Import glossary data from `../glossary.js`
2. Show a search bar at the top that filters terms in real-time as you type
3. Show filter buttons for each of the 5 categories (same colors as the quiz categories) plus an "All" button
4. Display terms as expandable cards — tap to reveal the definition (collapsed by default to keep it scannable)
5. Show a count: "Showing X of Y terms"
6. Sort alphabetically within each category
7. Keep the existing dark theme styling (#0f172a background, white cards)
8. Mobile-first, same max-width as the rest of the app

Update the nav bar in App.jsx to include three options: "Quiz" | "Study Plan" | "Glossary"

Add a new screen state "glossary" to the App state machine.

Add styles to App.css for the glossary components. Do NOT use Tailwind.

---

### Step 4: Update the study plan to question-first learning style
**Status:** 🔴 Not started

Replace the contents of `quiz-app/src/studyPlan.js` with this updated plan. Keep the same export format so the StudyPlan component doesn't break.

```javascript
export default [
  { day: 1, date: "May 5", topic: "Blind Run: AI Workloads & Responsible AI", description: "Do ALL questions in this category cold — no studying first. Read every explanation carefully, especially wrong answers. Note your score.", category: "AI Workloads & Responsible AI" },
  { day: 2, date: "May 6", topic: "Blind Run: Machine Learning", description: "Do ALL Machine Learning questions cold. Read every explanation. If something doesn't click, skim ONLY that section on MS Learn — not the whole module.", category: "Machine Learning Fundamentals" },
  { day: 3, date: "May 7", topic: "Blind Run: Computer Vision", description: "Do ALL Computer Vision questions cold. Focus on the explanations for wrong answers. Check the Glossary tab for any unfamiliar service names.", category: "Computer Vision" },
  { day: 4, date: "May 8", topic: "Blind Run: NLP", description: "Do ALL NLP questions cold. Pay attention to old vs new service names (LUIS→CLU, QnA Maker→Custom Question Answering).", category: "Natural Language Processing" },
  { day: 5, date: "May 9", topic: "Blind Run: Generative AI", description: "Do ALL Generative AI questions cold. This is the heaviest domain (20-25%). Know Microsoft Foundry, prompt engineering params, RAG, content filters.", category: "Generative AI" },
  { day: 6, date: "May 10", topic: "Review: Missed Questions Round 1", description: "Hit 'Missed Questions Only' on the start screen. Re-do every question you got wrong in Days 1-5. For any you miss AGAIN, look up that specific concept on MS Learn.", category: "Review" },
  { day: 7, date: "May 11", topic: "Glossary & Gaps", description: "Read through the entire Glossary tab. Star or write down any terms you don't recognize. Look up those specific terms on MS Learn.", category: "Review" },
  { day: 8, date: "May 12", topic: "Targeted Drill: Weakest Category", description: "Check your category stats on the start screen. Drill your lowest-scoring category. Read explanations even for correct answers.", category: "Review" },
  { day: 9, date: "May 13", topic: "Targeted Drill: 2nd Weakest Category", description: "Drill your second-lowest category. If you're above 80% in all categories, do a full 'All Categories' run instead.", category: "Review" },
  { day: 10, date: "May 14", topic: "Full Mixed Quiz #1", description: "Select 'All Categories' and do a full run. Simulate exam conditions: no breaks, no looking things up. Record your overall percentage.", category: "Practice Test" },
  { day: 11, date: "May 15", topic: "Review: Missed Questions Round 2", description: "Hit 'Missed Questions Only' again. These are your persistent weak spots. For each one, write a one-sentence summary of WHY the right answer is right.", category: "Review" },
  { day: 12, date: "May 16", topic: "Responsible AI Deep Dive", description: "Memorize FAIR-PT mnemonic. Do the AI Workloads category again. You should be scoring 85%+ here — it's the easiest domain to lock down.", category: "AI Workloads & Responsible AI" },
  { day: 13, date: "May 17", topic: "Generative AI Deep Dive", description: "Re-drill Generative AI. Focus on: Microsoft Foundry, Foundry model catalog, temperature vs top_p, zero-shot vs few-shot, RAG, content filters.", category: "Generative AI" },
  { day: 14, date: "May 18", topic: "Full Mixed Quiz #2", description: "All categories, exam conditions. Target: 75%+. Compare to Quiz #1 — are the same categories still weak?", category: "Practice Test" },
  { day: 15, date: "May 19", topic: "Microsoft Practice Assessment #1", description: "Take the FREE official Microsoft practice assessment at learn.microsoft.com. This is the closest to the real exam. Record domain scores.", category: "Practice Test" },
  { day: 16, date: "May 20", topic: "Gap Fill from MS Assessment", description: "Review every question you got wrong on the Microsoft assessment. Look up those specific topics. Re-read glossary entries for those concepts.", category: "Review" },
  { day: 17, date: "May 21", topic: "Full Mixed Quiz #3", description: "All categories in the app. Target: 80%+. You should be seeing improvement from Quiz #1 and #2.", category: "Practice Test" },
  { day: 18, date: "May 22", topic: "Service Matching Drill", description: "Go through the Glossary and for every Azure service, quiz yourself: what does it do? When would I use it? What was it formerly called?", category: "Review" },
  { day: 19, date: "May 23", topic: "Microsoft Practice Assessment #2", description: "Retake the official Microsoft assessment. Target: 80%+. Compare domain scores to Assessment #1.", category: "Practice Test" },
  { day: 20, date: "May 24", topic: "Cheat Sheet Day", description: "Review the Glossary tab — this IS your cheat sheet. Write down (by hand) the 10 terms you keep forgetting.", category: "Review" },
  { day: 21, date: "May 25", topic: "Final Full Run", description: "All categories, exam conditions. Target: 85%+. If below 75%, spend tomorrow on your weakest domain only.", category: "Practice Test" },
  { day: 22, date: "May 26", topic: "Final Review", description: "Review your handwritten cheat sheet only. Skim FAIR-PT one more time. Do 10 Missed Questions max. STOP studying by evening.", category: "Review" },
];
```

---

### Step 5: Test locally
**Status:** 🔴 Not started

```bash
cd quiz-app
npm run dev
```

Test checklist:
- [ ] New questions appear in quiz (check for Microsoft Foundry, Transformer, temperature questions)
- [ ] No duplicate questions in the pool
- [ ] Glossary tab appears in nav bar
- [ ] Glossary search filters terms in real-time
- [ ] Glossary category filter buttons work
- [ ] Terms expand/collapse on tap
- [ ] Study Plan shows updated question-first plan
- [ ] All existing features still work (categories, stats, missed questions, streak)
- [ ] `npm run build` succeeds with no errors

---

### Step 6: Deploy
**Status:** 🔴 Not started

```bash
git add .
git commit -m "V3: Timothy Warner questions, glossary tab, question-first study plan"
git push
```

Vercel auto-deploys.

---

## Update Log

| Step | Status | Notes |
|------|--------|-------|
| 1. Add Timothy Warner questions | ✅ | Added 7 non-duplicate Warner questions (IDs 256-262) covering Foundry, Transformer self-attention, temperature, RAG, and few-shot prompting. |
| 2. Create glossary data file | ✅ | Added `quiz-app/src/glossary.js` with the domain-organized cheat-sheet terms and definitions. |
| 3. Build Glossary component + nav | ✅ | Added the Glossary tab with live search, category filters, expandable term cards, and App/nav wiring. |
| 4. Update study plan | ✅ | Replaced `studyPlan.js` with the 22-day question-first schedule while preserving the same data shape. |
| 5. Test locally | ✅ | `npm.cmd run build` passed, Vite dev booted on `127.0.0.1:4174`, and the runtime pool now serves 169 unique questions including Foundry/Transformer/temperature items. |
| 6. Deploy | 🔴 | |

---

## Sources
- Questions: [timothywarner/ai900](https://github.com/timothywarner/ai900) (Microsoft MVP, May 2025 objectives)
- Glossary terms: [Microsoft AI-900 Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-900) + Timothy Warner domain guides
- Responsible AI mnemonic (FAIR-PT): Timothy Warner practice guide
