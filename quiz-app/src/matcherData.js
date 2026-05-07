const matcherData = [
  {
    roundName: 'Core AI Services',
    pairs: [
      {
        scenario: 'Extract text from scanned receipts and invoices',
        service: 'Azure AI Document Intelligence',
      },
      {
        scenario: 'Detect whether a photo contains a cat or dog',
        service: 'Custom Vision',
      },
      {
        scenario: 'Determine if a customer review is positive or negative',
        service: 'Azure AI Language',
      },
      {
        scenario: 'Convert spoken audio into written text',
        service: 'Azure AI Speech',
      },
      {
        scenario: 'Build a chatbot that answers FAQ questions from a PDF',
        service: 'Custom Question Answering',
      },
    ],
  },
  {
    roundName: 'Vision & Documents',
    pairs: [
      {
        scenario: 'Read handwritten notes from a whiteboard photo',
        service: 'Azure AI Vision (OCR)',
      },
      {
        scenario: 'Detect the location of people and cars in a security camera feed',
        service: 'Azure AI Vision (Object Detection)',
      },
      {
        scenario: 'Identify whether a person is wearing glasses or a mask',
        service: 'Azure AI Face',
      },
      {
        scenario: 'Extract line items and totals from purchase orders',
        service: 'Azure AI Document Intelligence',
      },
      {
        scenario: 'Tag thousands of product photos by category automatically',
        service: 'Custom Vision',
      },
    ],
  },
  {
    roundName: 'Language & Conversation',
    pairs: [
      {
        scenario:
          "Understand that 'book a flight to Seattle' means the user wants to make a reservation",
        service: 'Conversational Language Understanding (CLU)',
      },
      {
        scenario:
          "Identify that a news article mentions 'Microsoft' as an organization and 'Seattle' as a location",
        service: 'Azure AI Language (NER)',
      },
      {
        scenario: 'Translate a support email from Japanese to English',
        service: 'Azure Translator',
      },
      {
        scenario: 'Generate real-time captions for a live presentation',
        service: 'Azure AI Speech',
      },
      {
        scenario: 'Deploy a bot that works on Teams, webchat, and email simultaneously',
        service: 'Azure Bot Service',
      },
    ],
  },
  {
    roundName: 'Generative AI & Search',
    pairs: [
      {
        scenario: 'Generate marketing copy and blog posts using AI',
        service: 'Azure OpenAI Service',
      },
      {
        scenario: 'Create images from text descriptions for a design team',
        service: 'Azure OpenAI Service (DALL-E)',
      },
      {
        scenario: 'Search through thousands of internal documents and extract insights',
        service: 'Azure AI Search',
      },
      {
        scenario:
          "Ground a chatbot's responses in your company's documentation to reduce hallucinations",
        service: 'RAG with Azure AI Search',
      },
      {
        scenario: 'Browse 1,600+ AI models from multiple providers and deploy the best fit',
        service: 'Microsoft Foundry Model Catalog',
      },
    ],
  },
  {
    roundName: 'Machine Learning',
    pairs: [
      {
        scenario: "Predict next month's sales revenue based on historical data",
        service: 'Regression',
      },
      {
        scenario: 'Determine whether a bank transaction is fraudulent or legitimate',
        service: 'Classification',
      },
      {
        scenario:
          'Group customers into segments based on purchasing behavior without predefined labels',
        service: 'Clustering',
      },
      {
        scenario:
          'Automatically try dozens of algorithms to find the best model for your dataset',
        service: 'Azure ML AutoML',
      },
      {
        scenario: 'Build a training pipeline by dragging and dropping components visually',
        service: 'Azure ML Designer',
      },
    ],
  },
  {
    roundName: 'Responsible AI & Workloads',
    pairs: [
      {
        scenario: 'An AI hiring tool gives different scores to candidates based on gender',
        service: 'Fairness violation',
      },
      {
        scenario: "A company can't explain why their AI denied a loan application",
        service: 'Transparency violation',
      },
      {
        scenario: "An AI assistant doesn't work well with screen readers for blind users",
        service: 'Inclusiveness violation',
      },
      {
        scenario:
          'A self-driving car AI crashes in rain because it was only tested in sunshine',
        service: 'Reliability & Safety violation',
      },
      {
        scenario: 'An AI system collects user location data without consent',
        service: 'Privacy & Security violation',
      },
    ],
  },
]

export default matcherData
