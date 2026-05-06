import { useState } from 'react'
import './App.css'
import questions from './questions.json'

const HIGH_SCORE_KEY = 'ai900-highscore'

function shuffleQuestions(questionBank) {
  const shuffled = [...questionBank]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const currentItem = shuffled[index]
    shuffled[index] = shuffled[swapIndex]
    shuffled[swapIndex] = currentItem
  }

  return shuffled
}

function normalizeAnswers(answerIndexes) {
  return [...answerIndexes].sort((left, right) => left - right)
}

function areAnswersEqual(left, right) {
  if (left.length !== right.length) {
    return false
  }

  return left.every((value, index) => value === right[index])
}

function getSingleOptionState(optionIndex, selectedAnswer, correctAnswers, isAnswered) {
  if (!isAnswered) {
    return 'idle'
  }

  if (correctAnswers.includes(optionIndex)) {
    return 'correct'
  }

  if (selectedAnswer === optionIndex) {
    return 'incorrect'
  }

  return 'idle'
}

function getMultiOptionState(optionIndex, selectedAnswers, correctAnswers, isAnswered) {
  const isSelected = selectedAnswers.includes(optionIndex)
  const isCorrect = correctAnswers.includes(optionIndex)

  if (!isAnswered) {
    return isSelected ? 'selected' : 'idle'
  }

  if (isCorrect) {
    return 'correct'
  }

  if (isSelected && !isCorrect) {
    return 'incorrect'
  }

  return 'idle'
}

function App() {
  const [questionQueue, setQuestionQueue] = useState(() => shuffleQuestions(questions))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const storedHighScore = window.localStorage.getItem(HIGH_SCORE_KEY)
    return storedHighScore ? Number.parseInt(storedHighScore, 10) || 0 : 0
  })

  const currentQuestion = questionQueue[currentIndex]
  const isMultiSelect = currentQuestion ? currentQuestion.answer.length > 1 : false
  const progressValue =
    questionQueue.length === 0 ? 0 : ((currentIndex + 1) / questionQueue.length) * 100
  const hasFinished = questionQueue.length > 0 && currentIndex >= questionQueue.length

  function updateHighScore(nextScore) {
    if (nextScore <= highScore) {
      return
    }

    setHighScore(nextScore)
    window.localStorage.setItem(HIGH_SCORE_KEY, String(nextScore))
  }

  function resetSelectionState() {
    setSelectedAnswer(null)
    setSelectedAnswers([])
    setIsAnswered(false)
    setIsCorrect(false)
  }

  function handleCorrectResult() {
    const nextStreak = streak + 1

    setIsCorrect(true)
    setIsAnswered(true)
    setCorrectCount((previousCount) => previousCount + 1)
    setStreak(nextStreak)
    updateHighScore(nextStreak)
  }

  function handleIncorrectResult() {
    setIsCorrect(false)
    setIsAnswered(true)
    setStreak(0)
  }

  function handleSingleAnswer(optionIndex) {
    if (isAnswered || !currentQuestion) {
      return
    }

    setSelectedAnswer(optionIndex)

    if (currentQuestion.answer.includes(optionIndex)) {
      handleCorrectResult()
      return
    }

    handleIncorrectResult()
  }

  function toggleMultiSelectOption(optionIndex) {
    if (isAnswered) {
      return
    }

    setSelectedAnswers((previousSelection) => {
      if (previousSelection.includes(optionIndex)) {
        return previousSelection.filter((value) => value !== optionIndex)
      }

      return [...previousSelection, optionIndex]
    })
  }

  function submitMultiSelectAnswer() {
    if (!currentQuestion || isAnswered) {
      return
    }

    const normalizedSelection = normalizeAnswers(selectedAnswers)
    const normalizedAnswer = normalizeAnswers(currentQuestion.answer)

    if (areAnswersEqual(normalizedSelection, normalizedAnswer)) {
      handleCorrectResult()
      return
    }

    handleIncorrectResult()
  }

  function moveToNextQuestion() {
    const nextIndex = currentIndex + 1

    resetSelectionState()
    setCurrentIndex(nextIndex)
  }

  function restartQuiz() {
    setQuestionQueue(shuffleQuestions(questions))
    setCurrentIndex(0)
    setCorrectCount(0)
    setStreak(0)
    resetSelectionState()
  }

  if (questionQueue.length === 0) {
    return (
      <main className="app-shell">
        <section className="quiz-card quiz-card--loading">
          <p className="eyebrow">AI-900 Exam Prep</p>
          <h1>Loading quiz...</h1>
        </section>
      </main>
    )
  }

  if (hasFinished) {
    const percentageScore = Math.round((correctCount / questionQueue.length) * 100)

    return (
      <main className="app-shell">
        <section className="quiz-card quiz-card--summary">
          <p className="eyebrow">Session complete</p>
          <h1>AI-900 Quiz</h1>
          <p className="summary-copy">
            You answered {correctCount} of {questionQueue.length} questions correctly.
          </p>

          <div className="summary-grid">
            <div className="summary-stat">
              <span className="summary-label">Final score</span>
              <strong>{percentageScore}%</strong>
            </div>
            <div className="summary-stat">
              <span className="summary-label">Best streak</span>
              <strong>{highScore}</strong>
            </div>
          </div>

          <button type="button" className="primary-button" onClick={restartQuiz}>
            Restart
          </button>
        </section>
      </main>
    )
  }

  const questionNumber = currentIndex + 1
  const progressLabel = `Question ${questionNumber} of ${questionQueue.length}`
  const feedbackClassName = isAnswered
    ? isCorrect
      ? 'feedback feedback--correct'
      : 'feedback feedback--incorrect'
    : 'feedback'

  return (
    <main className="app-shell">
      <section className="quiz-card">
        <header className="quiz-header">
          <div className="stat-chip">
            <span className="stat-label">Streak</span>
            <strong>{streak}</strong>
          </div>
          <div className="stat-chip stat-chip--accent">
            <span className="stat-label">High score</span>
            <strong>{highScore}</strong>
          </div>
        </header>

        <div className="progress-block" aria-label={progressLabel}>
          <div className="progress-text-row">
            <span className="eyebrow">AI-900 Exam Prep</span>
            <span className="progress-label">{progressLabel}</span>
          </div>
          <div className="progress-track" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${progressValue}%` }} />
          </div>
        </div>

        <article key={currentQuestion.id} className="question-panel">
          <div className="question-copy">
            <h1>{currentQuestion.question}</h1>
            {isMultiSelect ? (
              <p className="question-hint">Select all correct answers, then press Submit.</p>
            ) : (
              <p className="question-hint">Tap the best answer to reveal feedback.</p>
            )}
          </div>

          <div className="answer-list" role={isMultiSelect ? 'group' : undefined}>
            {currentQuestion.options.map((option, optionIndex) => {
              const optionState = isMultiSelect
                ? getMultiOptionState(
                    optionIndex,
                    selectedAnswers,
                    currentQuestion.answer,
                    isAnswered,
                  )
                : getSingleOptionState(
                    optionIndex,
                    selectedAnswer,
                    currentQuestion.answer,
                    isAnswered,
                  )

              if (isMultiSelect) {
                return (
                  <label
                    key={`${currentQuestion.id}-${optionIndex}`}
                    className={`answer-option answer-option--multi answer-option--${optionState}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAnswers.includes(optionIndex)}
                      onChange={() => toggleMultiSelectOption(optionIndex)}
                      disabled={isAnswered}
                    />
                    <span>{option}</span>
                  </label>
                )
              }

              return (
                <button
                  key={`${currentQuestion.id}-${optionIndex}`}
                  type="button"
                  className={`answer-option answer-option--${optionState}`}
                  onClick={() => handleSingleAnswer(optionIndex)}
                  disabled={isAnswered}
                >
                  <span className="answer-letter">{String.fromCharCode(65 + optionIndex)}</span>
                  <span>{option}</span>
                </button>
              )
            })}
          </div>

          {isMultiSelect && !isAnswered ? (
            <button
              type="button"
              className="secondary-button"
              onClick={submitMultiSelectAnswer}
              disabled={selectedAnswers.length === 0}
            >
              Submit
            </button>
          ) : null}

          {isAnswered ? (
            <div className={feedbackClassName}>
              <p className="feedback-title">{isCorrect ? 'Correct' : 'Not quite'}</p>
              <p>{currentQuestion.explanation}</p>
            </div>
          ) : null}

          {isAnswered ? (
            <button type="button" className="primary-button" onClick={moveToNextQuestion}>
              {questionNumber === questionQueue.length ? 'See results' : 'Next ->'}
            </button>
          ) : null}
        </article>
      </section>
    </main>
  )
}

export default App
