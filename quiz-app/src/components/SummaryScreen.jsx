function getBreakdown(categoryMeta, sessionResults) {
  return categoryMeta
    .map((category) => {
      const categoryResults = sessionResults.filter((result) => result.category === category.name)
      const total = categoryResults.length
      const correct = categoryResults.filter((result) => result.isCorrect).length
      const percentage = total ? Math.round((correct / total) * 100) : 0

      return {
        ...category,
        correct,
        total,
        percentage,
      }
    })
    .filter((category) => category.total > 0)
}

export default function SummaryScreen({
  categoryMeta,
  sessionLabel,
  sessionResults,
  totalQuestions,
  bestStreak,
  onRestart,
  onReviewMissed,
  canReviewMissed,
  reviewMissedCount,
}) {
  const correctCount = sessionResults.filter((result) => result.isCorrect).length
  const percentageScore = totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0
  const breakdown = getBreakdown(categoryMeta, sessionResults)

  return (
    <>
      <section className="surface-panel hero-panel">
        <p className="eyebrow">Session Complete</p>
        <h2>{sessionLabel}</h2>
        <p className="panel-copy">
          You answered {correctCount} of {totalQuestions} questions correctly for a score of{' '}
          {percentageScore}%.
        </p>

        <div className="summary-grid">
          <article className="summary-stat">
            <span className="summary-label">Final score</span>
            <strong>{percentageScore}%</strong>
          </article>
          <article className="summary-stat">
            <span className="summary-label">Session best streak</span>
            <strong>{bestStreak}</strong>
          </article>
        </div>

        <div className="action-row">
          <button type="button" className="primary-button" onClick={onRestart}>
            Restart
          </button>

          {canReviewMissed ? (
            <button type="button" className="secondary-button" onClick={onReviewMissed}>
              Review Missed ({reviewMissedCount})
            </button>
          ) : null}
        </div>
      </section>

      <section className="surface-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Breakdown</p>
            <h2>Per-category results</h2>
          </div>
          <p className="section-caption">Accuracy bars reflect this session only.</p>
        </div>

        <div className="summary-table">
          {breakdown.map((category) => (
            <article key={category.name} className="summary-row">
              <div className="summary-row__copy">
                <div className="summary-row__title">
                  <span
                    className="summary-dot"
                    style={{ backgroundColor: category.color }}
                    aria-hidden="true"
                  />
                  <h3>{category.name}</h3>
                </div>
                <p>
                  {category.correct} / {category.total} correct
                </p>
              </div>

              <div className="summary-row__metrics">
                <strong>{category.percentage}%</strong>
                <div className="progress-track progress-track--compact" aria-hidden="true">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${category.percentage}%`,
                      background: category.color,
                    }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
