import { useEffect, useState } from 'react'

const HIGH_SCORE_KEY = 'ai900-highscore'
const QUESTION_TIME_LIMIT = 60
const TIMEOUT_ADVANCE_DELAY = 2000

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

export default function QuizScreen({
  questions,
  sessionId,
  sessionTitle,
  timedMode,
  onAnswer,
  onComplete,
}) {
  const [questionQueue, setQuestionQueue] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [sessionBestStreak, setSessionBestStreak] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(QUESTION_TIME_LIMIT)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [totalElapsedTime, setTotalElapsedTime] = useState(0)
  const [timeoutCount, setTimeoutCount] = useState(0)
  const [didTimeoutCurrentQuestion, setDidTimeoutCurrentQuestion] = useState(false)
  const [highScore, setHighScore] = useState(() => {
    const storedHighScore = window.localStorage.getItem(HIGH_SCORE_KEY)
    return storedHighScore ? Number.parseInt(storedHighScore, 10) || 0 : 0
  })
  const currentQuestion = questionQueue[currentIndex]
  const isMultiSelect = currentQuestion ? currentQuestion.answer.length > 1 : false
  const progressValue =
    questionQueue.length === 0 ? 0 : ((currentIndex + 1) / questionQueue.length) * 100
  const timerPercentage = (timeRemaining / QUESTION_TIME_LIMIT) * 100
  const timerClassName =
    timeRemaining <= 10
      ? 'timer-track timer-track--danger'
      : timeRemaining <= 30
        ? 'timer-track timer-track--warning'
        : 'timer-track timer-track--safe'

  useEffect(() => {
    setQuestionQueue(shuffleQuestions(questions))
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setSelectedAnswers([])
    setIsAnswered(false)
    setIsCorrect(false)
    setCorrectCount(0)
    setStreak(0)
    setSessionBestStreak(0)
    setTimeRemaining(QUESTION_TIME_LIMIT)
    setQuestionStartTime(Date.now())
    setTotalElapsedTime(0)
    setTimeoutCount(0)
    setDidTimeoutCurrentQuestion(false)
  }, [questions, sessionId])

  useEffect(() => {
    if (!timedMode || isAnswered || !currentQuestion) {
      return undefined
    }

    const timerId = window.setInterval(() => {
      setTimeRemaining((previousTime) => {
        if (previousTime <= 1) {
          window.clearInterval(timerId)
          return 0
        }

        return previousTime - 1
      })
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [currentQuestion, isAnswered, timedMode])

  useEffect(() => {
    if (!timedMode || isAnswered || !currentQuestion || timeRemaining > 0) {
      return undefined
    }

    handleTimedOutQuestion()
    return undefined
  }, [currentQuestion, isAnswered, timeRemaining, timedMode])

  useEffect(() => {
    if (!timedMode || !didTimeoutCurrentQuestion || !isAnswered) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      moveToNextQuestion()
    }, TIMEOUT_ADVANCE_DELAY)

    return () => window.clearTimeout(timeoutId)
  }, [didTimeoutCurrentQuestion, isAnswered, timedMode])

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
    setTimeRemaining(QUESTION_TIME_LIMIT)
    setQuestionStartTime(Date.now())
    setDidTimeoutCurrentQuestion(false)
  }

  function finalizeQuestionTiming(forcedElapsedTime) {
    if (!timedMode) {
      return 0
    }

    const computedElapsedTime =
      forcedElapsedTime ?? Math.min(QUESTION_TIME_LIMIT, Math.max(1, QUESTION_TIME_LIMIT - timeRemaining))

    setTotalElapsedTime((previousElapsed) => previousElapsed + computedElapsedTime)
    return computedElapsedTime
  }

  function recordAnswer(answeredCorrect) {
    if (!currentQuestion || isAnswered) {
      return
    }

    finalizeQuestionTiming()

    if (answeredCorrect) {
      const nextStreak = streak + 1
      setIsCorrect(true)
      setIsAnswered(true)
      setCorrectCount((previousCount) => previousCount + 1)
      setStreak(nextStreak)
      setSessionBestStreak((previousBest) => Math.max(previousBest, nextStreak))
      updateHighScore(nextStreak)
    } else {
      setIsCorrect(false)
      setIsAnswered(true)
      setStreak(0)
    }

    onAnswer({
      questionId: currentQuestion.id,
      category: currentQuestion.category,
      isCorrect: answeredCorrect,
    })
  }

  function handleTimedOutQuestion() {
    if (!currentQuestion || isAnswered) {
      return
    }

    finalizeQuestionTiming(QUESTION_TIME_LIMIT)
    setDidTimeoutCurrentQuestion(true)
    setTimeoutCount((previousCount) => previousCount + 1)
    setIsCorrect(false)
    setIsAnswered(true)
    setStreak(0)

    onAnswer({
      questionId: currentQuestion.id,
      category: currentQuestion.category,
      isCorrect: false,
    })
  }

  function handleSingleAnswer(optionIndex) {
    if (isAnswered || !currentQuestion) {
      return
    }

    setSelectedAnswer(optionIndex)
    recordAnswer(currentQuestion.answer.includes(optionIndex))
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
    recordAnswer(areAnswersEqual(normalizedSelection, normalizedAnswer))
  }

  function moveToNextQuestion() {
    if (currentIndex + 1 >= questionQueue.length) {
      onComplete({
        bestStreak: sessionBestStreak,
        totalTime: totalElapsedTime,
        avgTime: questionQueue.length === 0 ? 0 : totalElapsedTime / questionQueue.length,
        timeouts: timeoutCount,
        timedMode,
      })
      return
    }

    resetSelectionState()
    setCurrentIndex((previousIndex) => previousIndex + 1)
  }

  if (!currentQuestion) {
    return (
      <section className="surface-panel">
        <p className="eyebrow">Preparing Session</p>
        <h2>Shuffling questions...</h2>
      </section>
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
    <section className="surface-panel quiz-panel">
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
          <span className="eyebrow">{sessionTitle}</span>
          <span className="progress-label">{progressLabel}</span>
        </div>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${progressValue}%` }} />
        </div>
      </div>

      {timedMode ? (
        <div className="timer-block" aria-label={`Time remaining: ${timeRemaining} seconds`}>
          <div className="progress-text-row">
            <span className="eyebrow">Timed Mode</span>
            <span className="progress-label">{timeRemaining}s remaining</span>
          </div>
          <div className={timerClassName} aria-hidden="true">
            <div className="timer-fill" style={{ width: `${timerPercentage}%` }} />
          </div>
        </div>
      ) : null}

      <article key={`${sessionId}-${currentQuestion.id}`} className="question-panel">
        <div className="question-copy">
          <span className="category-pill">{currentQuestion.category}</span>
          <h2>{currentQuestion.question}</h2>
          {isMultiSelect ? (
            <p className="question-hint">Select all correct answers, then press Submit.</p>
          ) : (
            <p className="question-hint">Tap the best answer to reveal feedback.</p>
          )}
        </div>

        <div className="answer-list" role={isMultiSelect ? 'group' : undefined}>
          {currentQuestion.options.map((option, optionIndex) => {
            const optionState = isMultiSelect
              ? getMultiOptionState(optionIndex, selectedAnswers, currentQuestion.answer, isAnswered)
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
            <p className="feedback-title">
              {didTimeoutCurrentQuestion ? 'Time ran out' : isCorrect ? 'Correct' : 'Not quite'}
            </p>
            <p>{currentQuestion.explanation}</p>
          </div>
        ) : null}

        {isAnswered && !didTimeoutCurrentQuestion ? (
          <button type="button" className="primary-button" onClick={moveToNextQuestion}>
            {questionNumber === questionQueue.length ? 'See results' : 'Next ->'}
          </button>
        ) : null}

        <p className="question-footnote">
          {correctCount} correct so far out of {questionNumber - (isAnswered ? 0 : 1)} answered.
        </p>
      </article>
    </section>
  )
}
