import { useRef, useState } from 'react'
import './App.css'
import StartScreen from './components/StartScreen'
import QuizScreen from './components/QuizScreen'
import SummaryScreen from './components/SummaryScreen'
import StudyPlan from './components/StudyPlan'
import Glossary from './components/Glossary'
import questions from './questions.json'

const CATEGORY_STATS_KEY = 'ai900-category-stats'
const MISSED_QUESTIONS_KEY = 'ai900-missed'

const CATEGORY_META = [
  {
    name: 'AI Workloads & Responsible AI',
    weight: '15-20%',
    color: '#e74c3c',
    shortLabel: 'AI',
  },
  {
    name: 'Machine Learning Fundamentals',
    weight: '15-20%',
    color: '#3498db',
    shortLabel: 'ML',
  },
  {
    name: 'Computer Vision',
    weight: '15-20%',
    color: '#2ecc71',
    shortLabel: 'CV',
  },
  {
    name: 'Natural Language Processing',
    weight: '15-20%',
    color: '#f39c12',
    shortLabel: 'NLP',
  },
  {
    name: 'Generative AI',
    weight: '20-25%',
    color: '#9b59b6',
    shortLabel: 'GEN',
  },
]

function createEmptyCategoryStats() {
  return Object.fromEntries(
    CATEGORY_META.map(({ name }) => [
      name,
      {
        correct: 0,
        total: 0,
      },
    ]),
  )
}

function dedupeQuestions(questionBank) {
  const seenQuestions = new Set()

  return questionBank.filter((question) => {
    const normalizedQuestion = question.question.trim().toLowerCase()

    if (seenQuestions.has(normalizedQuestion)) {
      return false
    }

    seenQuestions.add(normalizedQuestion)
    return true
  })
}

function readStoredJson(key, fallbackValue) {
  if (typeof window === 'undefined') {
    return fallbackValue
  }

  try {
    const rawValue = window.localStorage.getItem(key)
    return rawValue ? JSON.parse(rawValue) : fallbackValue
  } catch {
    return fallbackValue
  }
}

function getStoredCategoryStats() {
  const storedStats = readStoredJson(CATEGORY_STATS_KEY, {})
  const mergedStats = createEmptyCategoryStats()

  for (const category of CATEGORY_META) {
    const savedEntry = storedStats?.[category.name]

    if (!savedEntry) {
      continue
    }

    mergedStats[category.name] = {
      correct: Number.parseInt(savedEntry.correct, 10) || 0,
      total: Number.parseInt(savedEntry.total, 10) || 0,
    }
  }

  return mergedStats
}

function getStoredMissedQuestions() {
  const storedIds = readStoredJson(MISSED_QUESTIONS_KEY, [])
  return Array.isArray(storedIds) ? storedIds.filter(Number.isInteger) : []
}

function filterQuestionsForMode(mode, questionBank, missedQuestionIds) {
  if (mode.type === 'ids') {
    const questionIdLookup = new Set(mode.questionIds)
    return questionBank.filter((question) => questionIdLookup.has(question.id))
  }

  if (mode.type === 'category') {
    return questionBank.filter((question) => question.category === mode.category)
  }

  if (mode.type === 'missed') {
    const missedLookup = new Set(missedQuestionIds)
    return questionBank.filter((question) => missedLookup.has(question.id))
  }

  return questionBank
}

function App() {
  const uniqueQuestions = dedupeQuestions(questions)
  const [screen, setScreen] = useState('start')
  const [categoryStats, setCategoryStats] = useState(getStoredCategoryStats)
  const [missedQuestionIds, setMissedQuestionIds] = useState(getStoredMissedQuestions)
  const [activeQuiz, setActiveQuiz] = useState({
    questions: [],
    sessionId: 0,
    title: 'All Categories',
  })
  const [sessionResults, setSessionResults] = useState([])
  const [sessionMissedQuestionIds, setSessionMissedQuestionIds] = useState([])
  const [sessionHighStreak, setSessionHighStreak] = useState(0)
  const lastQuizScreenRef = useRef('start')

  function persistCategoryStats(nextStats) {
    window.localStorage.setItem(CATEGORY_STATS_KEY, JSON.stringify(nextStats))
  }

  function persistMissedQuestionIds(nextQuestionIds) {
    window.localStorage.setItem(MISSED_QUESTIONS_KEY, JSON.stringify(nextQuestionIds))
  }

  function startQuiz(mode) {
    const filteredQuestions = filterQuestionsForMode(mode, uniqueQuestions, missedQuestionIds)

    if (filteredQuestions.length === 0) {
      return
    }

    setActiveQuiz((previousQuiz) => ({
      questions: filteredQuestions,
      sessionId: previousQuiz.sessionId + 1,
      title: mode.title,
    }))
    setSessionResults([])
    setSessionMissedQuestionIds([])
    setSessionHighStreak(0)
    lastQuizScreenRef.current = 'quiz'
    setScreen('quiz')
  }

  function handleQuizAnswer(result) {
    setSessionResults((previousResults) => [...previousResults, result])

    if (!result.isCorrect) {
      setSessionMissedQuestionIds((previousIds) => {
        if (previousIds.includes(result.questionId)) {
          return previousIds
        }

        return [...previousIds, result.questionId]
      })
    }

    setCategoryStats((previousStats) => {
      const currentStats = previousStats[result.category] ?? { correct: 0, total: 0 }
      const nextStats = {
        ...previousStats,
        [result.category]: {
          correct: currentStats.correct + (result.isCorrect ? 1 : 0),
          total: currentStats.total + 1,
        },
      }

      persistCategoryStats(nextStats)
      return nextStats
    })

    setMissedQuestionIds((previousIds) => {
      const nextIds = new Set(previousIds)

      if (result.isCorrect) {
        nextIds.delete(result.questionId)
      } else {
        nextIds.add(result.questionId)
      }

      const nextMissedIds = [...nextIds]
      persistMissedQuestionIds(nextMissedIds)
      return nextMissedIds
    })
  }

  function handleQuizComplete({ bestStreak }) {
    setSessionHighStreak(bestStreak)
    lastQuizScreenRef.current = 'summary'
    setScreen('summary')
  }

  function showStudyPlan() {
    if (screen !== 'plan' && screen !== 'glossary') {
      lastQuizScreenRef.current = screen
    }

    setScreen('plan')
  }

  function showGlossary() {
    if (screen !== 'plan' && screen !== 'glossary') {
      lastQuizScreenRef.current = screen
    }

    setScreen('glossary')
  }

  function showQuizFlow() {
    if (screen === 'plan' || screen === 'glossary') {
      setScreen(lastQuizScreenRef.current || 'start')
      return
    }

    lastQuizScreenRef.current = 'start'
    setScreen('start')
  }

  const quizButtonClassName =
    screen === 'plan' || screen === 'glossary'
      ? 'nav-button'
      : 'nav-button nav-button--active'
  const planButtonClassName =
    screen === 'plan' ? 'nav-button nav-button--active' : 'nav-button'
  const glossaryButtonClassName =
    screen === 'glossary' ? 'nav-button nav-button--active' : 'nav-button'
  const missedQuestionCount = uniqueQuestions.filter((question) =>
    missedQuestionIds.includes(question.id),
  ).length

  return (
    <main className="app-shell">
      <div className="app-frame">
        <header className="app-nav">
          <div className="nav-title-block">
            <p className="nav-kicker">AI-900 Exam Prep</p>
            <h1>CertMasterMind</h1>
          </div>

          <div className="nav-actions">
            <button type="button" className={quizButtonClassName} onClick={showQuizFlow}>
              Quiz
            </button>
            <button type="button" className={planButtonClassName} onClick={showStudyPlan}>
              Study Plan
            </button>
            <button type="button" className={glossaryButtonClassName} onClick={showGlossary}>
              Glossary
            </button>
          </div>
        </header>

        {screen === 'start' ? (
          <StartScreen
            categoryMeta={CATEGORY_META}
            categoryStats={categoryStats}
            missedQuestionCount={missedQuestionCount}
            onStartAll={() =>
              startQuiz({
                type: 'all',
                title: 'All Categories',
              })
            }
            onStartCategory={(categoryName) =>
              startQuiz({
                type: 'category',
                category: categoryName,
                title: categoryName,
              })
            }
            onStartMissed={() =>
              startQuiz({
                type: 'missed',
                title: 'Missed Questions',
              })
            }
          />
        ) : null}

        {screen === 'quiz' ? (
          <QuizScreen
            questions={activeQuiz.questions}
            sessionId={activeQuiz.sessionId}
            sessionTitle={activeQuiz.title}
            onAnswer={handleQuizAnswer}
            onComplete={handleQuizComplete}
          />
        ) : null}

        {screen === 'summary' ? (
          <SummaryScreen
            categoryMeta={CATEGORY_META}
            sessionLabel={activeQuiz.title}
            sessionResults={sessionResults}
            totalQuestions={activeQuiz.questions.length}
            bestStreak={sessionHighStreak}
            onRestart={() => {
              lastQuizScreenRef.current = 'start'
              setScreen('start')
            }}
            onReviewMissed={() =>
              startQuiz({
                type: 'ids',
                questionIds: sessionMissedQuestionIds,
                title: 'Review Missed Questions',
              })
            }
            canReviewMissed={sessionMissedQuestionIds.length > 0}
            reviewMissedCount={sessionMissedQuestionIds.length}
          />
        ) : null}

        {screen === 'plan' ? <StudyPlan categoryMeta={CATEGORY_META} /> : null}

        {screen === 'glossary' ? <Glossary categoryMeta={CATEGORY_META} /> : null}
      </div>
    </main>
  )
}

export default App
