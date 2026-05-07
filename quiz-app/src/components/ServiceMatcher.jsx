import { useEffect, useMemo, useRef, useState } from 'react'
import matcherData from '../matcherData'

const MATCHER_STATS_KEY = 'ai900-matcher-stats'
const WRONG_MATCH_DURATION = 300

function shuffleItems(items) {
  const shuffled = [...items]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const currentItem = shuffled[index]
    shuffled[index] = shuffled[swapIndex]
    shuffled[swapIndex] = currentItem
  }

  return shuffled
}

function formatElapsed(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function getStoredMatcherStats() {
  try {
    const rawValue = window.localStorage.getItem(MATCHER_STATS_KEY)
    return rawValue
      ? JSON.parse(rawValue)
      : {
          roundsCompleted: 0,
          perfectRounds: 0,
          totalAttempts: 0,
          totalTime: 0,
        }
  } catch {
    return {
      roundsCompleted: 0,
      perfectRounds: 0,
      totalAttempts: 0,
      totalTime: 0,
    }
  }
}

export default function ServiceMatcher({ onBackToMenu }) {
  const [activeRoundIndex, setActiveRoundIndex] = useState(null)
  const [scenarioItems, setScenarioItems] = useState([])
  const [serviceItems, setServiceItems] = useState([])
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [matchedPairs, setMatchedPairs] = useState(new Set())
  const [attempts, setAttempts] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [roundComplete, setRoundComplete] = useState(false)
  const [wrongPair, setWrongPair] = useState(null)
  const wrongTimeoutRef = useRef(null)
  const statsSavedRef = useRef(false)

  const activeRound = activeRoundIndex === null ? null : matcherData[activeRoundIndex]
  const availableRounds = useMemo(
    () =>
      matcherData.map((round, index) => ({
        index,
        roundName: round.roundName,
      })),
    [],
  )

  useEffect(() => {
    return () => {
      if (wrongTimeoutRef.current) {
        window.clearTimeout(wrongTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!roundComplete || statsSavedRef.current) {
      return
    }

    const storedStats = getStoredMatcherStats()
    const nextStats = {
      roundsCompleted: storedStats.roundsCompleted + 1,
      perfectRounds: storedStats.perfectRounds + (attempts === scenarioItems.length ? 1 : 0),
      totalAttempts: storedStats.totalAttempts + attempts,
      totalTime: storedStats.totalTime + elapsed,
    }

    window.localStorage.setItem(MATCHER_STATS_KEY, JSON.stringify(nextStats))
    statsSavedRef.current = true
  }, [attempts, elapsed, roundComplete, scenarioItems.length])

  function resetRoundState(nextRoundIndex) {
    const round = matcherData[nextRoundIndex]
    const indexedPairs = round.pairs.map((pair, pairIndex) => ({
      ...pair,
      pairId: `${nextRoundIndex}-${pairIndex}`,
    }))

    if (wrongTimeoutRef.current) {
      window.clearTimeout(wrongTimeoutRef.current)
      wrongTimeoutRef.current = null
    }

    setActiveRoundIndex(nextRoundIndex)
    setScenarioItems(shuffleItems(indexedPairs))
    setServiceItems(shuffleItems(indexedPairs))
    setSelectedScenario(null)
    setSelectedService(null)
    setMatchedPairs(new Set())
    setAttempts(0)
    setStartTime(Date.now())
    setElapsed(0)
    setRoundComplete(false)
    setWrongPair(null)
    statsSavedRef.current = false
  }

  function startRound(index) {
    resetRoundState(index)
  }

  function startRandomRound() {
    const nextIndex = Math.floor(Math.random() * matcherData.length)
    resetRoundState(nextIndex)
  }

  function handleScenarioTap(pairId) {
    if (matchedPairs.has(pairId) || roundComplete || wrongPair) {
      return
    }

    setSelectedScenario(pairId)
  }

  function handleServiceTap(pairId) {
    if (!selectedScenario || matchedPairs.has(pairId) || roundComplete || wrongPair) {
      return
    }

    setSelectedService(pairId)
    setAttempts((previousAttempts) => previousAttempts + 1)

    if (selectedScenario === pairId) {
      setMatchedPairs((previousPairs) => {
        const nextPairs = new Set(previousPairs)
        nextPairs.add(pairId)

        if (nextPairs.size === scenarioItems.length) {
          const totalElapsedSeconds = Math.max(
            1,
            Math.round((Date.now() - (startTime ?? Date.now())) / 1000),
          )
          setElapsed(totalElapsedSeconds)
          setRoundComplete(true)
        }

        return nextPairs
      })
      setSelectedScenario(null)
      setSelectedService(null)
      return
    }

    const nextWrongPair = {
      scenarioId: selectedScenario,
      serviceId: pairId,
    }
    setWrongPair(nextWrongPair)

    wrongTimeoutRef.current = window.setTimeout(() => {
      setWrongPair(null)
      setSelectedScenario(null)
      setSelectedService(null)
      wrongTimeoutRef.current = null
    }, WRONG_MATCH_DURATION)
  }

  function handleNextRound() {
    if (activeRoundIndex === null) {
      return
    }

    const nextIndex = (activeRoundIndex + 1) % matcherData.length
    resetRoundState(nextIndex)
  }

  function getScenarioClassName(pairId) {
    const isMatched = matchedPairs.has(pairId)
    const isSelected = selectedScenario === pairId
    const isWrong = wrongPair?.scenarioId === pairId

    return [
      'matcher-card',
      'matcher-card--scenario',
      isMatched ? 'matcher-card--matched' : '',
      isSelected ? 'matcher-card--selected' : '',
      isWrong ? 'matcher-card--wrong' : '',
    ]
      .filter(Boolean)
      .join(' ')
  }

  function getServiceClassName(pairId) {
    const isMatched = matchedPairs.has(pairId)
    const isSelected = selectedService === pairId
    const isWrong = wrongPair?.serviceId === pairId

    return [
      'matcher-card',
      'matcher-card--service',
      isMatched ? 'matcher-card--matched' : '',
      isSelected ? 'matcher-card--selected' : '',
      isWrong ? 'matcher-card--wrong' : '',
    ]
      .filter(Boolean)
      .join(' ')
  }

  if (activeRound === null) {
    return (
      <>
        <section className="surface-panel hero-panel">
          <p className="eyebrow">Service Matchmaker</p>
          <h2>Match each scenario to the best Azure AI service or concept.</h2>
          <p className="panel-copy">
            Pick a round manually or let the app choose one at random. Each round has five pairs.
          </p>

          <div className="action-row">
            <button type="button" className="primary-button" onClick={startRandomRound}>
              Random Round
            </button>
            <button type="button" className="secondary-button" onClick={onBackToMenu}>
              Back to Quiz Menu
            </button>
          </div>
        </section>

        <section className="surface-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Rounds</p>
              <h2>Choose a set</h2>
            </div>
            <p className="section-caption">Six rounds covering the full exam surface area.</p>
          </div>

          <div className="matcher-round-list">
            {availableRounds.map((round) => (
              <button
                key={round.index}
                type="button"
                className="matcher-round-button"
                onClick={() => startRound(round.index)}
              >
                <span className="matcher-round-button__label">Round {round.index + 1}</span>
                <strong>{round.roundName}</strong>
              </button>
            ))}
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <section className="surface-panel hero-panel">
        <p className="eyebrow">Service Matchmaker</p>
        <h2>{activeRound.roundName}</h2>
        <p className="panel-copy">
          Tap a scenario, then tap the matching service. Wrong matches flash red and reset.
        </p>

        <div className="matcher-meta-grid">
          <article className="summary-stat">
            <span className="summary-label">Matched</span>
            <strong>
              {matchedPairs.size}/{scenarioItems.length}
            </strong>
          </article>
          <article className="summary-stat">
            <span className="summary-label">Attempts</span>
            <strong>{attempts}</strong>
          </article>
        </div>
      </section>

      <section className="surface-panel">
        <div className="matcher-board">
          <div className="matcher-column">
            <div className="section-heading matcher-column__heading">
              <div>
                <p className="eyebrow">Scenarios</p>
                <h2>Left side</h2>
              </div>
            </div>

            <div className="matcher-card-list">
              {scenarioItems.map((pair) => (
                <button
                  key={pair.pairId}
                  type="button"
                  className={getScenarioClassName(pair.pairId)}
                  onClick={() => handleScenarioTap(pair.pairId)}
                  disabled={matchedPairs.has(pair.pairId)}
                >
                  <span className="matcher-card__copy">{pair.scenario}</span>
                  {matchedPairs.has(pair.pairId) ? (
                    <span className="matcher-card__status" aria-hidden="true">
                      ✓
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          <div className="matcher-column">
            <div className="section-heading matcher-column__heading">
              <div>
                <p className="eyebrow">Services</p>
                <h2>Right side</h2>
              </div>
            </div>

            <div className="matcher-card-list">
              {serviceItems.map((pair) => (
                <button
                  key={pair.pairId}
                  type="button"
                  className={getServiceClassName(pair.pairId)}
                  onClick={() => handleServiceTap(pair.pairId)}
                  disabled={matchedPairs.has(pair.pairId)}
                >
                  <span className="matcher-card__copy">{pair.service}</span>
                  {matchedPairs.has(pair.pairId) ? (
                    <span className="matcher-card__status" aria-hidden="true">
                      ✓
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {roundComplete ? (
        <section className="surface-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Round Complete</p>
              <h2>{attempts === scenarioItems.length ? 'Perfect Match' : 'Nice work'}</h2>
            </div>
            {attempts === scenarioItems.length ? (
              <span className="category-pill category-pill--success">Perfect</span>
            ) : null}
          </div>

          <div className="stats-grid matcher-results-grid">
            <article className="stat-card">
              <span className="stat-label">Time taken</span>
              <strong>{formatElapsed(elapsed)}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-label">Attempts</span>
              <strong>{attempts}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-label">Mistakes</span>
              <strong>{Math.max(0, attempts - scenarioItems.length)}</strong>
            </article>
          </div>

          <div className="action-row">
            <button type="button" className="primary-button" onClick={handleNextRound}>
              Next Round
            </button>
            <button type="button" className="secondary-button" onClick={onBackToMenu}>
              Back to Menu
            </button>
          </div>
        </section>
      ) : null}
    </>
  )
}
