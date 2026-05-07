function getAccuracy(stats) {
  if (!stats.total) {
    return 0
  }

  return Math.round((stats.correct / stats.total) * 100)
}

export default function StatsPanel({ categoryMeta, categoryStats }) {
  const attemptedCategories = categoryMeta
    .map((category) => {
      const stats = categoryStats[category.name] ?? { correct: 0, total: 0 }
      return {
        ...category,
        correct: stats.correct,
        total: stats.total,
        accuracy: getAccuracy(stats),
      }
    })
    .filter((category) => category.total > 0)

  const strongestCategory =
    attemptedCategories.length > 0
      ? [...attemptedCategories].sort((left, right) => right.accuracy - left.accuracy)[0]
      : null
  const weakestCategory =
    attemptedCategories.length > 0
      ? [...attemptedCategories].sort((left, right) => left.accuracy - right.accuracy)[0]
      : null
  const totalQuestionsAnswered = attemptedCategories.reduce(
    (runningTotal, category) => runningTotal + category.total,
    0,
  )

  return (
    <section className="surface-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Stats Overview</p>
          <h2>Strengths and gaps</h2>
        </div>
        <p className="section-caption">Persistent progress is tracked per exam domain.</p>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <span className="stat-label">Questions answered</span>
          <strong>{totalQuestionsAnswered}</strong>
          <p>{attemptedCategories.length ? 'Across your saved practice history.' : 'Start a quiz to build a baseline.'}</p>
        </article>

        <article className="stat-card">
          <span className="stat-label">Strongest category</span>
          <strong>{strongestCategory ? `${strongestCategory.accuracy}%` : '--'}</strong>
          <p>{strongestCategory ? strongestCategory.name : 'No category data yet.'}</p>
        </article>

        <article className="stat-card">
          <span className="stat-label">Needs attention</span>
          <strong>{weakestCategory ? `${weakestCategory.accuracy}%` : '--'}</strong>
          <p>{weakestCategory ? weakestCategory.name : 'Your weakest area will appear here.'}</p>
        </article>
      </div>
    </section>
  )
}
