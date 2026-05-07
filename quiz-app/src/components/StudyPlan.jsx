import { useState } from 'react'
import studyPlan from '../studyPlan'

const CHECKLIST_KEY = 'ai900-checklist'

function readStoredChecklist() {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const rawValue = window.localStorage.getItem(CHECKLIST_KEY)
    return rawValue ? JSON.parse(rawValue) : {}
  } catch {
    return {}
  }
}

function buildCategoryColorMap(categoryMeta) {
  return categoryMeta.reduce((colorMap, category) => {
    colorMap[category.name] = category.color
    return colorMap
  }, {})
}

function isToday(planDate) {
  const today = new Date()
  const [monthName, dayValue] = planDate.split(' ')
  const monthIndex = new Date(`${monthName} 1, ${today.getFullYear()}`).getMonth()

  return today.getMonth() === monthIndex && today.getDate() === Number.parseInt(dayValue, 10)
}

export default function StudyPlan({ categoryMeta }) {
  const [checklistState, setChecklistState] = useState(readStoredChecklist)
  const categoryColors = buildCategoryColorMap(categoryMeta)
  const completedCount = studyPlan.filter((entry) => checklistState[entry.day]).length

  function persistChecklist(nextState) {
    window.localStorage.setItem(CHECKLIST_KEY, JSON.stringify(nextState))
  }

  function toggleDay(dayNumber) {
    setChecklistState((previousState) => {
      const nextState = {
        ...previousState,
        [dayNumber]: !previousState[dayNumber],
      }

      persistChecklist(nextState)
      return nextState
    })
  }

  function resetProgress() {
    const nextState = {}
    persistChecklist(nextState)
    setChecklistState(nextState)
  }

  return (
    <>
      <section className="surface-panel hero-panel">
        <p className="eyebrow">22-Day Plan</p>
        <h2>Stay on a fixed study cadence.</h2>
        <p className="panel-copy">
          Track each day, keep reviews separate from domain study, and use the checklist as your
          pacing guide.
        </p>
        <div className="study-progress">
          <strong>{completedCount}</strong>
          <span>of 22 days completed</span>
        </div>
      </section>

      <section className="surface-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Checklist</p>
            <h2>Daily work</h2>
          </div>
          <p className="section-caption">The current calendar day is highlighted automatically.</p>
        </div>

        <div className="plan-list">
          {studyPlan.map((entry) => {
            const accentColor =
              categoryColors[entry.category] ??
              (entry.category === 'Practice Test' ? '#22c55e' : '#64748b')
            const todayClassName = isToday(entry.date) ? 'plan-item plan-item--today' : 'plan-item'
            const itemClassName = checklistState[entry.day]
              ? `${todayClassName} plan-item--done`
              : todayClassName

            return (
              <label
                key={entry.day}
                className={itemClassName}
                style={{ '--accent': accentColor }}
              >
                <input
                  type="checkbox"
                  checked={Boolean(checklistState[entry.day])}
                  onChange={() => toggleDay(entry.day)}
                />

                <div className="plan-item__content">
                  <div className="plan-item__header">
                    <div>
                      <span className="plan-day">Day {entry.day}</span>
                      <h3>{entry.topic}</h3>
                    </div>
                    <div className="plan-badges">
                      <span className="plan-date">{entry.date}</span>
                      <span className="category-pill category-pill--muted">{entry.category}</span>
                    </div>
                  </div>

                  <p>{entry.description}</p>
                </div>
              </label>
            )
          })}
        </div>

        <button type="button" className="secondary-button secondary-button--inline" onClick={resetProgress}>
          Reset Progress
        </button>
      </section>
    </>
  )
}
