import { useMemo, useState } from 'react'
import questions from '../questions.json'
import studyPlan from '../studyPlan'

const CATEGORY_META = [
  {
    name: 'AI Workloads & Responsible AI',
    color: '#e74c3c',
    weight: 17.5,
  },
  {
    name: 'Machine Learning Fundamentals',
    color: '#3498db',
    weight: 17.5,
  },
  {
    name: 'Computer Vision',
    color: '#2ecc71',
    weight: 17.5,
  },
  {
    name: 'Natural Language Processing',
    color: '#f39c12',
    weight: 17.5,
  },
  {
    name: 'Generative AI',
    color: '#9b59b6',
    weight: 22.5,
  },
]

const EMPTY_MATCHER_STATS = {
  roundsCompleted: 0,
  perfectRounds: 0,
  totalAttempts: 0,
  totalTime: 0,
}

const EMPTY_MILESTONES = {
  totalQuestionsAnswered: 0,
  totalCorrect: 0,
  totalSessions: 0,
  totalTimedSessions: 0,
  firstSessionDate: null,
  longestStreak: 0,
}

function readStoredJson(key, fallbackValue) {
  try {
    const rawValue = window.localStorage.getItem(key)
    return rawValue ? JSON.parse(rawValue) : fallbackValue
  } catch {
    return fallbackValue
  }
}

function getCategoryAccuracy(categoryStats, categoryName) {
  const stats = categoryStats?.[categoryName]

  if (!stats || !stats.total) {
    return 0
  }

  return Math.round((stats.correct / stats.total) * 100)
}

function formatShortDate(dateValue) {
  return new Date(dateValue).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function formatClock(totalSeconds) {
  const roundedSeconds = Math.round(totalSeconds)
  const minutes = Math.floor(roundedSeconds / 60)
  const seconds = roundedSeconds % 60

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function formatDuration(totalSeconds) {
  const roundedSeconds = Math.round(totalSeconds)
  const hours = Math.floor(roundedSeconds / 3600)
  const minutes = Math.floor((roundedSeconds % 3600) / 60)

  if (hours === 0) {
    return `${minutes}m`
  }

  return `${hours}h ${minutes}m`
}

function getReadinessScore(categoryStats) {
  let weightedTotal = 0
  let usedWeight = 0

  for (const category of CATEGORY_META) {
    const stats = categoryStats?.[category.name]

    if (!stats || !stats.total) {
      continue
    }

    const accuracy = (stats.correct / stats.total) * 100
    weightedTotal += accuracy * category.weight
    usedWeight += category.weight
  }

  if (!usedWeight) {
    return 0
  }

  return Math.round(weightedTotal / usedWeight)
}

function getReadinessColor(readinessScore) {
  if (readinessScore >= 80) {
    return '#16a34a'
  }

  if (readinessScore >= 60) {
    return '#f59e0b'
  }

  return '#dc2626'
}

function getRadarPoints(categoryStats, size, radius) {
  const center = size / 2
  const labels = CATEGORY_META.map((category, index) => {
    const angle = (Math.PI * 2 * index) / CATEGORY_META.length - Math.PI / 2
    const score = getCategoryAccuracy(categoryStats, category.name)
    const scoreRadius = (score / 100) * radius

    return {
      ...category,
      score,
      axisX: center + Math.cos(angle) * radius,
      axisY: center + Math.sin(angle) * radius,
      pointX: center + Math.cos(angle) * scoreRadius,
      pointY: center + Math.sin(angle) * scoreRadius,
      labelX: center + Math.cos(angle) * (radius + 22),
      labelY: center + Math.sin(angle) * (radius + 22),
    }
  })

  return labels
}

function getMostMissedQuestions(sessionHistory) {
  const frequencyMap = new Map()

  for (const session of sessionHistory) {
    for (const questionId of session.missedQuestionIds ?? []) {
      frequencyMap.set(questionId, (frequencyMap.get(questionId) ?? 0) + 1)
    }
  }

  return [...frequencyMap.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([questionId, count]) => {
      const question = questions.find((entry) => entry.id === questionId)
      return {
        id: questionId,
        count,
        question: question?.question ?? `Question ${questionId}`,
        category: question?.category ?? 'Unknown',
      }
    })
}

function truncateQuestion(text) {
  if (text.length <= 80) {
    return text
  }

  return `${text.slice(0, 77)}...`
}

function getTodayStudyPlanEntry() {
  const now = new Date()

  return (
    studyPlan.find((entry) => {
      const [monthName, dayValue] = entry.date.split(' ')
      const monthIndex = new Date(`${monthName} 1, ${now.getFullYear()}`).getMonth()

      return now.getMonth() === monthIndex && now.getDate() === Number.parseInt(dayValue, 10)
    }) ?? null
  )
}

function getMilestoneBadge(totalQuestionsAnswered) {
  if (totalQuestionsAnswered >= 1000) {
    return { label: '1000+', className: 'milestone-badge milestone-badge--platinum' }
  }

  if (totalQuestionsAnswered >= 500) {
    return { label: '500+', className: 'milestone-badge milestone-badge--gold' }
  }

  if (totalQuestionsAnswered >= 250) {
    return { label: '250+', className: 'milestone-badge milestone-badge--silver' }
  }

  if (totalQuestionsAnswered >= 100) {
    return { label: '100+', className: 'milestone-badge milestone-badge--bronze' }
  }

  return null
}

export default function ProgressDashboard() {
  const [categoryStats] = useState(() => readStoredJson('ai900-category-stats', {}))
  const [sessionHistory] = useState(() => readStoredJson('ai900-session-history', []))
  const [matcherStats] = useState(() => readStoredJson('ai900-matcher-stats', EMPTY_MATCHER_STATS))
  const [checklistState] = useState(() => readStoredJson('ai900-checklist', {}))
  const [milestones] = useState(() => readStoredJson('ai900-milestones', EMPTY_MILESTONES))

  const readinessScore = getReadinessScore(categoryStats)
  const readinessColor = getReadinessColor(readinessScore)
  const examDate = new Date('2026-05-30T15:30:00')
  const daysUntilExam = Math.max(
    0,
    Math.ceil((examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  )
  const radarSize = 260
  const radarRadius = 82
  const radarAxes = useMemo(
    () => getRadarPoints(categoryStats, radarSize, radarRadius),
    [categoryStats],
  )
  const radarPolygonPoints = radarAxes.map((axis) => `${axis.pointX},${axis.pointY}`).join(' ')
  const trendSessions = [...sessionHistory].slice(0, 15).reverse()
  const simulationSessions = sessionHistory.filter((session) => session.isSimulation)
  const weakSpots = getMostMissedQuestions(sessionHistory)
  const completedDays = studyPlan.filter((entry) => checklistState?.[entry.day]).length
  const todayEntry = getTodayStudyPlanEntry()
  const totalStudyTime = sessionHistory.reduce(
    (runningTotal, session) => runningTotal + (session.totalTime ?? 0),
    0,
  )
  const overallAccuracy =
    milestones.totalQuestionsAnswered === 0
      ? 0
      : Math.round((milestones.totalCorrect / milestones.totalQuestionsAnswered) * 100)
  const daysActive = milestones.firstSessionDate
    ? Math.max(
        1,
        Math.ceil(
          (Date.now() - new Date(milestones.firstSessionDate).getTime()) / (1000 * 60 * 60 * 24),
        ),
      )
    : 0
  const milestoneBadge = getMilestoneBadge(milestones.totalQuestionsAnswered)
  const averageMatcherTime =
    matcherStats.roundsCompleted === 0
      ? 0
      : matcherStats.totalTime / matcherStats.roundsCompleted

  function handleResetAllProgress() {
    const confirmed = window.confirm(
      'This will clear ALL your progress, scores, and history. This cannot be undone.',
    )

    if (!confirmed) {
      return
    }

    const keysToClear = []

    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index)

      if (key?.startsWith('ai900-')) {
        keysToClear.push(key)
      }
    }

    for (const key of keysToClear) {
      window.localStorage.removeItem(key)
    }

    window.location.reload()
  }

  return (
    <>
      <section className="surface-panel hero-panel dashboard-panel">
        <p className="eyebrow">Readiness</p>
        <h2>Exam readiness snapshot</h2>
        <div className="dashboard-ring-block">
          <svg viewBox="0 0 120 120" className="dashboard-ring" aria-hidden="true">
            <circle cx="60" cy="60" r="48" className="dashboard-ring__track" />
            <circle
              cx="60"
              cy="60"
              r="48"
              className="dashboard-ring__progress"
              style={{
                stroke: readinessColor,
                strokeDasharray: `${(readinessScore / 100) * 301.59} 301.59`,
              }}
            />
          </svg>
          <div className="dashboard-ring__copy">
            <strong>{readinessScore}%</strong>
            <span>Exam Readiness Score</span>
          </div>
        </div>
        <div className="dashboard-countdown">
          <strong>{daysUntilExam} days until exam</strong>
          <span>May 30, 2026 at 3:30 PM</span>
        </div>
      </section>

      <section className="surface-panel dashboard-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Radar Chart</p>
            <h2>Category coverage</h2>
          </div>
        </div>

        <div className="radar-chart">
          <svg viewBox={`0 0 ${radarSize} ${radarSize}`} aria-hidden="true">
            {[25, 50, 75, 100].map((tick) => (
              <circle
                key={tick}
                cx={radarSize / 2}
                cy={radarSize / 2}
                r={(radarRadius * tick) / 100}
                className="radar-chart__ring"
              />
            ))}
            {radarAxes.map((axis) => (
              <line
                key={axis.name}
                x1={radarSize / 2}
                y1={radarSize / 2}
                x2={axis.axisX}
                y2={axis.axisY}
                className="radar-chart__axis"
              />
            ))}
            <polygon points={radarPolygonPoints} className="radar-chart__polygon" />
            {radarAxes.map((axis) => (
              <circle
                key={`${axis.name}-point`}
                cx={axis.pointX}
                cy={axis.pointY}
                r="4"
                fill="#3498db"
              />
            ))}
            {radarAxes.map((axis) => (
              <text
                key={`${axis.name}-label`}
                x={axis.labelX}
                y={axis.labelY}
                className="radar-chart__label"
                textAnchor="middle"
              >
                {axis.name.split(' ')[0]}
              </text>
            ))}
          </svg>
        </div>

        <div className="dashboard-legend">
          {CATEGORY_META.map((category) => {
            const stats = categoryStats?.[category.name] ?? { correct: 0, total: 0 }
            const accuracy = getCategoryAccuracy(categoryStats, category.name)

            return (
              <div key={category.name} className="dashboard-legend__item">
                <span className="summary-dot" style={{ backgroundColor: category.color }} />
                <div>
                  <strong>{category.name}</strong>
                  <p>
                    {stats.correct}/{stats.total} ({accuracy}%)
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="surface-panel dashboard-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Score Trend</p>
            <h2>Last 15 sessions</h2>
          </div>
        </div>

        {trendSessions.length >= 2 ? (
          <div className="trend-chart">
            <svg viewBox="0 0 320 180" aria-hidden="true">
              <line x1="24" y1="28" x2="24" y2="150" className="trend-chart__axis" />
              <line x1="24" y1="150" x2="300" y2="150" className="trend-chart__axis" />
              <line x1="24" y1="64.6" x2="300" y2="64.6" className="trend-chart__pass-line" />
              <text x="300" y="58" className="trend-chart__pass-label">
                Pass
              </text>
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
                points={trendSessions
                  .map((session, index) => {
                    const x =
                      24 + (index * (300 - 24)) / Math.max(1, trendSessions.length - 1)
                    const y = 150 - (session.percentage / 100) * (150 - 28)
                    return `${x},${y}`
                  })
                  .join(' ')}
              />
              {trendSessions.map((session, index) => {
                const x = 24 + (index * (300 - 24)) / Math.max(1, trendSessions.length - 1)
                const y = 150 - (session.percentage / 100) * (150 - 28)

                return (
                  <g key={session.id}>
                    <circle
                      cx={x}
                      cy={y}
                      r="5"
                      fill={session.passed ? '#16a34a' : '#dc2626'}
                    />
                    <text x={x} y="168" className="trend-chart__session-label" textAnchor="middle">
                      {index + 1}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        ) : (
          <div className="dashboard-empty-state">
            <p>Complete 2+ quiz sessions to see your trend.</p>
          </div>
        )}
      </section>

      <section className="surface-panel dashboard-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Exam Simulations</p>
            <h2>Timed all-category runs</h2>
          </div>
        </div>

        {simulationSessions.length > 0 ? (
          <div className="dashboard-card-list">
            {simulationSessions.map((session) => (
              <article key={session.id} className="dashboard-mini-card">
                <div>
                  <span className="stat-label">{formatShortDate(session.date)}</span>
                  <strong>
                    {session.correct}/{session.total} ({session.percentage}%)
                  </strong>
                  <p>Time: {formatClock(session.totalTime)}</p>
                </div>
                <span
                  className={
                    session.passed ? 'category-pill category-pill--success' : 'category-pill category-pill--danger'
                  }
                >
                  {session.passed ? 'PASS' : 'FAIL'}
                </span>
              </article>
            ))}
          </div>
        ) : (
          <div className="dashboard-empty-state">
            <p>Take a full timed quiz with All Categories to simulate the exam.</p>
          </div>
        )}
      </section>

      <section className="surface-panel dashboard-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Top Weak Spots</p>
            <h2>Most missed questions</h2>
          </div>
        </div>

        {weakSpots.length > 0 ? (
          <div className="dashboard-card-list">
            {weakSpots.map((item) => (
              <article key={item.id} className="dashboard-mini-card dashboard-mini-card--stacked">
                <div>
                  <strong>{truncateQuestion(item.question)}</strong>
                  <div className="dashboard-inline-meta">
                    <span className="category-pill category-pill--muted">{item.category}</span>
                    <span className="section-caption">Missed {item.count} times</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="dashboard-empty-state">
            <p>No missed questions yet - keep going!</p>
          </div>
        )}
      </section>

      <section className="surface-panel dashboard-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Service Matchmaker</p>
            <h2>Matcher stats</h2>
          </div>
        </div>

        {matcherStats.roundsCompleted > 0 ? (
          <div className="stats-grid">
            <article className="stat-card">
              <span className="stat-label">Rounds Completed</span>
              <strong>{matcherStats.roundsCompleted}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-label">Perfect Rounds</span>
              <strong>{matcherStats.perfectRounds}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-label">Total Attempts</span>
              <strong>{matcherStats.totalAttempts}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-label">Avg Time / Round</span>
              <strong>{averageMatcherTime.toFixed(1)}s</strong>
            </article>
          </div>
        ) : (
          <div className="dashboard-empty-state">
            <p>Play Service Matchmaker to track your stats.</p>
          </div>
        )}
      </section>

      <section className="surface-panel dashboard-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Study Plan</p>
            <h2>Checklist progress</h2>
          </div>
        </div>

        <div className="dashboard-study-progress">
          <div className="dashboard-ring-block dashboard-ring-block--small">
            <svg viewBox="0 0 120 120" className="dashboard-ring" aria-hidden="true">
              <circle cx="60" cy="60" r="48" className="dashboard-ring__track" />
              <circle
                cx="60"
                cy="60"
                r="48"
                className="dashboard-ring__progress"
                style={{
                  stroke: '#2563eb',
                  strokeDasharray: `${(completedDays / studyPlan.length) * 301.59} 301.59`,
                }}
              />
            </svg>
            <div className="dashboard-ring__copy">
              <strong>
                {completedDays} / {studyPlan.length}
              </strong>
              <span>Days completed</span>
            </div>
          </div>

          <div className="dashboard-study-progress__copy">
            <p>{completedDays} days completed</p>
            <p>
              {todayEntry
                ? `Today: Day ${todayEntry.day} - ${todayEntry.topic}`
                : 'Today is not mapped to a study-plan date in this cycle.'}
            </p>
          </div>
        </div>
      </section>

      <section className="surface-panel dashboard-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Lifetime Stats</p>
            <h2>Milestones and totals</h2>
          </div>
        </div>

        <div className="dashboard-lifetime-grid">
          <article className="stat-card">
            <span className="stat-label">Total Questions Answered</span>
            <strong>{milestones.totalQuestionsAnswered}</strong>
            {milestoneBadge ? <span className={milestoneBadge.className}>{milestoneBadge.label}</span> : null}
          </article>
          <article className="stat-card">
            <span className="stat-label">Overall Accuracy</span>
            <strong>{overallAccuracy}%</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Sessions Completed</span>
            <strong>{milestones.totalSessions}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Best Streak</span>
            <strong>{milestones.longestStreak}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Study Time</span>
            <strong>{formatDuration(totalStudyTime)}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Days Active</span>
            <strong>{daysActive}</strong>
          </article>
        </div>

        <button
          type="button"
          className="secondary-button secondary-button--danger secondary-button--inline"
          onClick={handleResetAllProgress}
        >
          Reset All Progress
        </button>
      </section>
    </>
  )
}
