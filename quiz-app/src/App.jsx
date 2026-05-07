import { useRef, useState } from 'react'
import './App.css'
import StartScreen from './components/StartScreen'
import QuizScreen from './components/QuizScreen'
import SummaryScreen from './components/SummaryScreen'
import StudyPlan from './components/StudyPlan'
import Glossary from './components/Glossary'
import ServiceMatcher from './components/ServiceMatcher'
import ProgressDashboard from './components/ProgressDashboard'
import questions from './questions.json'

const CATEGORY_STATS_KEY = 'ai900-category-stats'
const MISSED_QUESTIONS_KEY = 'ai900-missed'
const TIMED_MODE_KEY = 'ai900-timed-mode'
const SESSION_HISTORY_KEY = 'ai900-session-history'
const MILESTONES_KEY = 'ai900-milestones'

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

function getStoredTimedMode() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(TIMED_MODE_KEY) === 'true'
}

function getStoredSessionHistory() {
  const storedHistory = readStoredJson(SESSION_HISTORY_KEY, [])
  return Array.isArray(storedHistory) ? storedHistory : []
}

function getStoredMilestones() {
  return readStoredJson(MILESTONES_KEY, {
    totalQuestionsAnswered: 0,
    totalCorrect: 0,
    totalSessions: 0,
    totalTimedSessions: 0,
    firstSessionDate: null,
    longestStreak: 0,
  })
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

function getNavScreen(screen) {
  if (screen === 'matchmaker') {
    return 'matchmaker'
  }

  if (screen === 'dashboard') {
    return 'dashboard'
  }

  if (screen === 'plan') {
    return 'plan'
  }

  if (screen === 'glossary') {
    return 'glossary'
  }

  return 'quiz'
}

function App() {
  const uniqueQuestions = dedupeQuestions(questions)
  const [screen, setScreen] = useState('start')
  const [categoryStats, setCategoryStats] = useState(getStoredCategoryStats)
  const [missedQuestionIds, setMissedQuestionIds] = useState(getStoredMissedQuestions)
  const [timedMode, setTimedMode] = useState(getStoredTimedMode)
  const [activeQuiz, setActiveQuiz] = useState({
    questions: [],
    sessionId: 0,
    title: 'All Categories',
    category: 'All',
  })
  const [sessionResults, setSessionResults] = useState([])
  const [sessionMissedQuestionIds, setSessionMissedQuestionIds] = useState([])
  const [sessionHighStreak, setSessionHighStreak] = useState(0)
  const [sessionTimingStats, setSessionTimingStats] = useState({
    timedMode: false,
    totalTime: 0,
    avgTime: 0,
    timeouts: 0,
  })
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
      category: mode.sessionCategory ?? mode.title,
    }))
    setSessionResults([])
    setSessionMissedQuestionIds([])
    setSessionHighStreak(0)
    setSessionTimingStats({
      timedMode,
      totalTime: 0,
      avgTime: 0,
      timeouts: 0,
    })
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

  function handleQuizComplete({ bestStreak, totalTime, avgTime, timeouts, timedMode: usedTimedMode }) {
    const correctAnswers = sessionResults.filter((result) => result.isCorrect).length
    const sessionPercentage =
      activeQuiz.questions.length === 0
        ? 0
        : Math.round((correctAnswers / activeQuiz.questions.length) * 100)
    const normalizedCategory = activeQuiz.category === 'All Categories' ? 'All' : activeQuiz.category
    const sessionEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      category: normalizedCategory,
      correct: correctAnswers,
      total: activeQuiz.questions.length,
      percentage: sessionPercentage,
      timedMode: usedTimedMode,
      totalTime,
      avgTime,
      timeouts,
      isSimulation: normalizedCategory === 'All' && usedTimedMode,
      passed: sessionPercentage >= 70,
      missedQuestionIds: sessionMissedQuestionIds,
    }
    const nextHistory = [sessionEntry, ...getStoredSessionHistory()].slice(0, 100)
    const storedMilestones = getStoredMilestones()
    const nextMilestones = {
      totalQuestionsAnswered:
        storedMilestones.totalQuestionsAnswered + activeQuiz.questions.length,
      totalCorrect: storedMilestones.totalCorrect + correctAnswers,
      totalSessions: storedMilestones.totalSessions + 1,
      totalTimedSessions: storedMilestones.totalTimedSessions + (usedTimedMode ? 1 : 0),
      firstSessionDate: storedMilestones.firstSessionDate ?? sessionEntry.date,
      longestStreak: Math.max(storedMilestones.longestStreak ?? 0, bestStreak),
    }

    window.localStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify(nextHistory))
    window.localStorage.setItem(MILESTONES_KEY, JSON.stringify(nextMilestones))

    setSessionHighStreak(bestStreak)
    setSessionTimingStats({
      timedMode: usedTimedMode,
      totalTime,
      avgTime,
      timeouts,
    })
    lastQuizScreenRef.current = 'summary'
    setScreen('summary')
  }

  function handleTimedModeChange(nextValue) {
    setTimedMode(nextValue)
    window.localStorage.setItem(TIMED_MODE_KEY, String(nextValue))
  }

  function showStudyPlan() {
    if (!['plan', 'glossary', 'matchmaker', 'dashboard'].includes(screen)) {
      lastQuizScreenRef.current = screen
    }

    setScreen('plan')
  }

  function showGlossary() {
    if (!['plan', 'glossary', 'matchmaker', 'dashboard'].includes(screen)) {
      lastQuizScreenRef.current = screen
    }

    setScreen('glossary')
  }

  function showMatchmaker() {
    if (!['plan', 'glossary', 'matchmaker', 'dashboard'].includes(screen)) {
      lastQuizScreenRef.current = screen
    }

    setScreen('matchmaker')
  }

  function showDashboard() {
    if (!['plan', 'glossary', 'matchmaker', 'dashboard'].includes(screen)) {
      lastQuizScreenRef.current = screen
    }

    setScreen('dashboard')
  }

  function showQuizFlow() {
    if (['plan', 'glossary', 'matchmaker', 'dashboard'].includes(screen)) {
      setScreen(lastQuizScreenRef.current || 'start')
      return
    }

    lastQuizScreenRef.current = 'start'
    setScreen('start')
  }

  const missedQuestionCount = uniqueQuestions.filter((question) =>
    missedQuestionIds.includes(question.id),
  ).length
  const activeNavScreen = getNavScreen(screen)
  const navigationItems = [
    {
      key: 'quiz',
      label: 'Quiz',
      icon: '📝',
      onClick: showQuizFlow,
    },
    {
      key: 'matchmaker',
      label: 'Match',
      icon: '🎯',
      onClick: showMatchmaker,
    },
    {
      key: 'dashboard',
      label: 'Stats',
      icon: '📊',
      onClick: showDashboard,
    },
    {
      key: 'plan',
      label: 'Plan',
      icon: '📅',
      onClick: showStudyPlan,
    },
    {
      key: 'glossary',
      label: 'Glossary',
      icon: '📖',
      onClick: showGlossary,
    },
  ]

  return (
    <main className="app-shell">
      <div className="app-frame">
        <header className="app-nav">
          <div className="nav-title-block">
            <p className="nav-kicker">AI-900 Exam Prep</p>
            <h1>CertMasterMind</h1>
          </div>

          <div className="nav-actions nav-actions--desktop">
            {navigationItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={
                  activeNavScreen === item.key
                    ? 'nav-button nav-button--active'
                    : 'nav-button'
                }
                onClick={item.onClick}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </header>

        {screen === 'start' ? (
          <StartScreen
            categoryMeta={CATEGORY_META}
            categoryStats={categoryStats}
            missedQuestionCount={missedQuestionCount}
            timedMode={timedMode}
            onTimedModeChange={handleTimedModeChange}
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
            timedMode={timedMode}
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
            timingStats={sessionTimingStats}
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

        {screen === 'matchmaker' ? <ServiceMatcher onBackToMenu={showQuizFlow} /> : null}

        {screen === 'dashboard' ? <ProgressDashboard /> : null}
      </div>

      <nav className="bottom-tab-bar" aria-label="Primary">
        {navigationItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={
              activeNavScreen === item.key
                ? 'bottom-tab-bar__item bottom-tab-bar__item--active'
                : 'bottom-tab-bar__item'
            }
            onClick={item.onClick}
          >
            <span className="bottom-tab-bar__icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="bottom-tab-bar__label">{item.label}</span>
          </button>
        ))}
      </nav>
    </main>
  )
}

export default App
