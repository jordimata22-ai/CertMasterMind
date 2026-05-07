import StatsPanel from './StatsPanel'

function getAccuracy(stats) {
  if (!stats.total) {
    return 0
  }

  return Math.round((stats.correct / stats.total) * 100)
}

export default function StartScreen({
  categoryMeta,
  categoryStats,
  missedQuestionCount,
  timedMode,
  onTimedModeChange,
  onStartAll,
  onStartCategory,
  onStartMissed,
}) {
  return (
    <>
      <section className="surface-panel hero-panel">
        <p className="eyebrow">Session Setup</p>
        <h2>Choose a study lane before you start.</h2>
        <p className="panel-copy">
          Practice one exam domain at a time, run the full shuffled bank, or replay only the
          questions that still need work.
        </p>

        <div className="action-row">
          <button type="button" className="primary-button" onClick={onStartAll}>
            All Categories
          </button>

          {missedQuestionCount > 0 ? (
            <button type="button" className="secondary-button" onClick={onStartMissed}>
              Missed Questions Only ({missedQuestionCount})
            </button>
          ) : null}
        </div>

        <label className="timed-mode-toggle">
          <input
            type="checkbox"
            checked={timedMode}
            onChange={(event) => onTimedModeChange(event.target.checked)}
          />
          <span className="timed-mode-toggle__track" aria-hidden="true">
            <span className="timed-mode-toggle__thumb" />
          </span>
          <span className="timed-mode-toggle__copy">
            <strong>Timed Mode - 60 seconds per question</strong>
            <span>Simulates exam pacing (45 min for ~45 questions)</span>
          </span>
        </label>
      </section>

      <StatsPanel categoryMeta={categoryMeta} categoryStats={categoryStats} />

      <section className="surface-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Categories</p>
            <h2>Focus by domain</h2>
          </div>
          <p className="section-caption">Tap any card to start a filtered quiz session.</p>
        </div>

        <div className="category-grid">
          {categoryMeta.map((category) => {
            const stats = categoryStats[category.name] ?? { correct: 0, total: 0 }
            const accuracy = getAccuracy(stats)
            const hasProgress = stats.total > 0

            return (
              <button
                key={category.name}
                type="button"
                className="category-card"
                style={{ '--accent': category.color }}
                onClick={() => onStartCategory(category.name)}
              >
                <div className="category-card__header">
                  <span className="category-icon">{category.shortLabel}</span>
                  <span className="category-weight">{category.weight}</span>
                </div>

                <div className="category-card__body">
                  <h3>{category.name}</h3>
                  <p>{hasProgress ? `${stats.correct}/${stats.total} correct (${accuracy}%)` : 'Not started'}</p>
                </div>

                <div className="progress-track progress-track--compact" aria-hidden="true">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${accuracy}%`,
                      background: category.color,
                    }}
                  />
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </>
  )
}
