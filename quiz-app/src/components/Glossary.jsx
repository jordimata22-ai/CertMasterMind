import { useMemo, useState } from 'react'
import glossary from '../glossary'

function normalizeValue(value) {
  return value.toLowerCase()
}

function sortTermsAlphabetically(items) {
  return [...items].sort((left, right) => left.term.localeCompare(right.term))
}

export default function Glossary({ categoryMeta }) {
  const [searchValue, setSearchValue] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [expandedTerms, setExpandedTerms] = useState({})

  const filteredTerms = useMemo(() => {
    const normalizedSearch = normalizeValue(searchValue.trim())

    return glossary.filter((entry) => {
      const matchesCategory =
        activeCategory === 'All' ? true : entry.category === activeCategory
      const matchesSearch =
        normalizedSearch.length === 0
          ? true
          : normalizeValue(`${entry.term} ${entry.definition}`).includes(normalizedSearch)

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchValue])

  const groupedTerms = useMemo(() => {
    return categoryMeta
      .map((category) => ({
        ...category,
        items: sortTermsAlphabetically(
          filteredTerms.filter((entry) => entry.category === category.name),
        ),
      }))
      .filter((category) => category.items.length > 0)
  }, [categoryMeta, filteredTerms])

  function toggleTerm(term) {
    setExpandedTerms((previousState) => ({
      ...previousState,
      [term]: !previousState[term],
    }))
  }

  return (
    <>
      <section className="surface-panel hero-panel">
        <p className="eyebrow">Glossary / Cheat Sheet</p>
        <h2>Quick reference for services, terms, and exam language.</h2>
        <p className="panel-copy">
          Search across the whole exam surface area or drill one domain at a time. Cards stay
          collapsed by default so the list remains scannable.
        </p>

        <label className="glossary-search">
          <span className="glossary-search__label">Search glossary</span>
          <input
            type="search"
            placeholder="Search terms, services, or concepts"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </label>
      </section>

      <section className="surface-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Filters</p>
            <h2>Browse by category</h2>
          </div>
          <p className="section-caption">
            Showing {filteredTerms.length} of {glossary.length} terms
          </p>
        </div>

        <div className="glossary-filter-row">
          <button
            type="button"
            className={
              activeCategory === 'All'
                ? 'glossary-filter glossary-filter--active'
                : 'glossary-filter'
            }
            onClick={() => setActiveCategory('All')}
          >
            All
          </button>

          {categoryMeta.map((category) => (
            <button
              key={category.name}
              type="button"
              className={
                activeCategory === category.name
                  ? 'glossary-filter glossary-filter--active'
                  : 'glossary-filter'
              }
              style={{
                '--accent': category.color,
                '--accent-soft': `color-mix(in srgb, ${category.color} 16%, white)`,
              }}
              onClick={() => setActiveCategory(category.name)}
            >
              {category.shortLabel}
            </button>
          ))}
        </div>

        <div className="glossary-sections">
          {groupedTerms.map((category) => (
            <section key={category.name} className="glossary-section">
              <div className="glossary-section__header">
                <div className="summary-row__title">
                  <span
                    className="summary-dot"
                    style={{ backgroundColor: category.color }}
                    aria-hidden="true"
                  />
                  <h3>{category.name}</h3>
                </div>
                <p className="section-caption">{category.items.length} terms</p>
              </div>

              <div className="glossary-list">
                {category.items.map((entry) => {
                  const isExpanded = Boolean(expandedTerms[entry.term])

                  return (
                    <article key={entry.term} className="glossary-card">
                      <button
                        type="button"
                        className="glossary-card__toggle"
                        onClick={() => toggleTerm(entry.term)}
                      >
                        <div>
                          <span className="category-pill category-pill--muted">{entry.category}</span>
                          <h4>{entry.term}</h4>
                        </div>
                        <span className="glossary-card__icon" aria-hidden="true">
                          {isExpanded ? '-' : '+'}
                        </span>
                      </button>

                      {isExpanded ? <p className="glossary-card__definition">{entry.definition}</p> : null}
                    </article>
                  )
                })}
              </div>
            </section>
          ))}

          {groupedTerms.length === 0 ? (
            <div className="glossary-empty">
              <h3>No matching terms</h3>
              <p>Try a broader search or switch back to All categories.</p>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
