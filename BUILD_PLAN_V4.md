# CertMasterMind V4 — Build Plan

## Status: 🔴 NOT STARTED

---

## What We're Adding

Three major features: two new study modes and a full progress dashboard.

### New Features
1. **Service Matchmaker** — Tap-to-match mini-game. Left column = scenarios, right column = Azure services. Match them. 6 rounds covering all exam domains.
2. **Timed Mode** — Toggle on start screen. 60-second countdown per question. Auto-advances on timeout. Shows timing stats on summary.
3. **Progress Dashboard** — Full stats page with: overall readiness score, category radar chart, session history log, score trend line, exam simulation pass/fail log, most-missed questions, matcher stats, study plan progress ring, streaks & milestones.

### New/Updated Files
```
quiz-app/src/
├── matcherData.js                  ← NEW: scenario-service pairs
├── components/
│   ├── ServiceMatcher.jsx          ← NEW: matching mini-game
│   ├── ProgressDashboard.jsx       ← NEW: full stats dashboard
│   ├── QuizScreen.jsx              ← UPDATED: timer logic
│   └── StartScreen.jsx             ← UPDATED: timed mode toggle
├── App.jsx                         ← UPDATED: new screens, session logging
└── App.css                         ← UPDATED: styles for all new components
```

### localStorage Keys (all features)
```
ai900-highscore           — streak high score (existing)
ai900-category-stats      — per-category correct/total (existing)
ai900-missed              — array of missed question IDs (existing)
ai900-checklist           — study plan checkbox state (existing)
ai900-timed-mode          — boolean toggle state (NEW)
ai900-matcher-stats       — matcher rounds/attempts/time (NEW)
ai900-session-history     — array of session log entries (NEW)
ai900-milestones          — total questions answered, sessions, etc. (NEW)
```

---

## Build Steps

### Step 1: Create the matcher data file
**Status:** 🔴 Not started

Create `quiz-app/src/matcherData.js`. Each round has 5 scenario-service pairs. 6 rounds total.

```javascript
export default [
  {
    roundName: "Core AI Services",
    pairs: [
      { scenario: "Extract text from scanned receipts and invoices", service: "Azure AI Document Intelligence" },
      { scenario: "Detect whether a photo contains a cat or dog", service: "Custom Vision" },
      { scenario: "Determine if a customer review is positive or negative", service: "Azure AI Language" },
      { scenario: "Convert spoken audio into written text", service: "Azure AI Speech" },
      { scenario: "Build a chatbot that answers FAQ questions from a PDF", service: "Custom Question Answering" },
    ]
  },
  {
    roundName: "Vision & Documents",
    pairs: [
      { scenario: "Read handwritten notes from a whiteboard photo", service: "Azure AI Vision (OCR)" },
      { scenario: "Detect the location of people and cars in a security camera feed", service: "Azure AI Vision (Object Detection)" },
      { scenario: "Identify whether a person is wearing glasses or a mask", service: "Azure AI Face" },
      { scenario: "Extract line items and totals from purchase orders", service: "Azure AI Document Intelligence" },
      { scenario: "Tag thousands of product photos by category automatically", service: "Custom Vision" },
    ]
  },
  {
    roundName: "Language & Conversation",
    pairs: [
      { scenario: "Understand that 'book a flight to Seattle' means the user wants to make a reservation", service: "Conversational Language Understanding (CLU)" },
      { scenario: "Identify that a news article mentions 'Microsoft' as an organization and 'Seattle' as a location", service: "Azure AI Language (NER)" },
      { scenario: "Translate a support email from Japanese to English", service: "Azure Translator" },
      { scenario: "Generate real-time captions for a live presentation", service: "Azure AI Speech" },
      { scenario: "Deploy a bot that works on Teams, webchat, and email simultaneously", service: "Azure Bot Service" },
    ]
  },
  {
    roundName: "Generative AI & Search",
    pairs: [
      { scenario: "Generate marketing copy and blog posts using AI", service: "Azure OpenAI Service" },
      { scenario: "Create images from text descriptions for a design team", service: "Azure OpenAI Service (DALL-E)" },
      { scenario: "Search through thousands of internal documents and extract insights", service: "Azure AI Search" },
      { scenario: "Ground a chatbot's responses in your company's documentation to reduce hallucinations", service: "RAG with Azure AI Search" },
      { scenario: "Browse 1,600+ AI models from multiple providers and deploy the best fit", service: "Microsoft Foundry Model Catalog" },
    ]
  },
  {
    roundName: "Machine Learning",
    pairs: [
      { scenario: "Predict next month's sales revenue based on historical data", service: "Regression" },
      { scenario: "Determine whether a bank transaction is fraudulent or legitimate", service: "Classification" },
      { scenario: "Group customers into segments based on purchasing behavior without predefined labels", service: "Clustering" },
      { scenario: "Automatically try dozens of algorithms to find the best model for your dataset", service: "Azure ML AutoML" },
      { scenario: "Build a training pipeline by dragging and dropping components visually", service: "Azure ML Designer" },
    ]
  },
  {
    roundName: "Responsible AI & Workloads",
    pairs: [
      { scenario: "An AI hiring tool gives different scores to candidates based on gender", service: "Fairness violation" },
      { scenario: "A company can't explain why their AI denied a loan application", service: "Transparency violation" },
      { scenario: "An AI assistant doesn't work well with screen readers for blind users", service: "Inclusiveness violation" },
      { scenario: "A self-driving car AI crashes in rain because it was only tested in sunshine", service: "Reliability & Safety violation" },
      { scenario: "An AI system collects user location data without consent", service: "Privacy & Security violation" },
    ]
  },
];
```

---

### Step 2: Build the ServiceMatcher component
**Status:** 🔴 Not started

Create `quiz-app/src/components/ServiceMatcher.jsx`.

**How it works:**
1. User picks a round (or "Random" which picks one at random)
2. Left column shows 5 scenarios (shuffled), right column shows 5 services (shuffled differently)
3. User taps a scenario on the left, then taps the matching service on the right
4. If correct: both items turn green and get visually marked as matched (reduced opacity, checkmark, non-interactive)
5. If wrong: both flash red briefly (300ms animation), selection resets, attempt counter increments
6. When all 5 are matched, show a results card: time taken, attempts used, "Perfect" badge if no mistakes
7. "Next Round" and "Back to Menu" buttons

**State management:**
- `selectedScenario` — index of the currently tapped scenario (null if none)
- `matchedPairs` — set of indices that have been correctly matched
- `attempts` — total number of attempts (correct + incorrect)
- `startTime` — timestamp when round started
- `elapsed` — time taken to complete

**Styling:**
- Two columns side by side on desktop, stacked on mobile with clear "Scenarios" and "Services" headers
- Same dark theme (#0f172a), white cards
- Scenario cards: left-bordered with blue (#3498db)
- Service cards: left-bordered with purple (#9b59b6)
- Matched pairs: green border, reduced opacity, non-interactive
- Selected item: highlighted border, slight scale-up
- Wrong match: brief red flash animation (300ms)

**localStorage:**
- Key: `ai900-matcher-stats`
- Format: `{ roundsCompleted: number, perfectRounds: number, totalAttempts: number, totalTime: number }`
- Update after each completed round

---

### Step 3: Add Timed Mode to the quiz
**Status:** 🔴 Not started

Update the QuizScreen component to support an optional timed mode.

**How it works:**
1. On the StartScreen, add a toggle switch: "⏱️ Timed Mode — 60 seconds per question" with subtitle "Simulates exam pacing (45 min for ~45 questions)"
2. When enabled, each question gets a 60-second countdown timer displayed as a horizontal bar at the top of the question card
3. Visual urgency: bar is green when > 30s, yellow when 10-30s, red when < 10s
4. If timer hits 0:
   - Question is marked as incorrect automatically
   - The correct answer is highlighted green
   - Explanation is shown
   - Streak resets
   - Auto-advance to next question after 2 seconds (so user can see the answer)
5. Timer pauses while the explanation is showing (after answering)
6. Summary screen shows additional stats when timed: total time elapsed, average time per question, number of timeouts

**Implementation details:**
- Pass `timedMode` as a boolean prop from App.jsx to QuizScreen
- Use `useEffect` with `setInterval` for the countdown (clean up on unmount and on answer)
- Store timer state per question, reset on each new question
- Timer bar should animate smoothly (CSS transition on width)
- Add `timedMode` toggle state to App.jsx, persist in localStorage key `ai900-timed-mode`

---

### Step 4: Add session logging to App.jsx
**Status:** 🔴 Not started

This is the data layer the Progress Dashboard reads from. Every time a quiz session completes (user reaches summary screen), log it.

**Session log entry format:**
```javascript
{
  id: crypto.randomUUID(),
  date: new Date().toISOString(),
  category: "All" | "Generative AI" | etc.,
  correct: 18,
  total: 25,
  percentage: 72,
  timedMode: true,
  totalTime: 1245,
  avgTime: 49.8,
  timeouts: 2,
  isSimulation: true,   // true ONLY if category was "All" AND timedMode was on
  passed: true,          // true if percentage >= 70
  missedQuestionIds: [14, 67, 203],
}
```

**localStorage key:** `ai900-session-history`
**Format:** Array of session log entries, most recent first. Cap at 100 entries (drop oldest if over).

Also update a milestones counter in localStorage key `ai900-milestones`:
```javascript
{
  totalQuestionsAnswered: 450,
  totalCorrect: 342,
  totalSessions: 18,
  totalTimedSessions: 7,
  firstSessionDate: "2025-05-05T...",
  longestStreak: 12,
}
```
Update milestones after every session.

---

### Step 5: Build the Progress Dashboard component
**Status:** 🔴 Not started

Create `quiz-app/src/components/ProgressDashboard.jsx`.

**Layout (top to bottom, mobile-first, scrollable):**

#### Section 1: Readiness Header
- Large circular progress ring showing **Exam Readiness Score** as a percentage in the center
- Calculated as weighted average of category scores using exam weights:
  - AI Workloads & Responsible AI: 17.5% weight
  - Machine Learning: 17.5% weight
  - Computer Vision: 17.5% weight
  - NLP: 17.5% weight
  - Generative AI: 22.5% weight
  - If a category has no data yet, exclude it from the calculation
- Ring color: green (#16a34a) if >= 80%, yellow (#f59e0b) if 60-79%, red (#dc2626) if < 60%
- Below the ring: "X days until exam" countdown (target: May 30, 2026)
- Below that: "May 30, 2026 at 3:30 PM"

#### Section 2: Category Radar Chart
- SVG radar/spider chart with 5 axes (one per exam domain)
- Each axis goes from 0% (center) to 100% (outer edge)
- Filled polygon showing current score per category
- Use a semi-transparent blue fill (#3498db at 30% opacity) with a solid blue border
- Category labels around the outside of the chart
- If a category has no data, plot it at 0%
- Below the chart: legend showing each category name, fraction (e.g., "12/20"), percentage, with the category's color dot

#### Section 3: Score Trend
- Simple SVG line chart showing score percentage over the last 15 sessions
- X-axis: session numbers (1, 2, 3...)
- Y-axis: 0% to 100%
- A horizontal dashed line at 70% labeled "Pass"
- Data point dots: green fill if session passed (>=70%), red fill if failed
- Connecting line between dots
- If fewer than 2 sessions exist, show message: "Complete 2+ quiz sessions to see your trend"

#### Section 4: Exam Simulations
- Header: "Exam Simulations"
- Only shows sessions where `isSimulation === true` (category "All" + timedMode on)
- Each simulation as a card showing:
  - Date (formatted nicely, e.g., "May 12")
  - Score: "36/45 (80%)"
  - Time: "32:15"
  - PASS badge (green background, white text) or FAIL badge (red background, white text)
- Pass threshold: >= 70%
- Most recent simulation at top
- If no simulations yet: "Take a full timed quiz with 'All Categories' to simulate the exam"

#### Section 5: Most Missed Questions
- Header: "Top Weak Spots"
- Top 5 most frequently missed questions across ALL sessions in history
- Count frequency of each question ID across all `missedQuestionIds` arrays in session history
- For each question show:
  - Question text (truncated to ~80 characters with "..." if longer)
  - Category badge (small pill with category color)
  - "Missed X times" counter
- Import questions.json to look up question text and category by ID
- If no missed questions: "No missed questions yet — keep going!"

#### Section 6: Matcher Stats
- Header: "Service Matchmaker"
- Read from `ai900-matcher-stats` localStorage
- Grid of 4 stat cards:
  - Rounds Completed (number)
  - Perfect Rounds (number)
  - Total Attempts (number)
  - Avg Time/Round (formatted as seconds)
- If no matcher data: "Play Service Matchmaker to track your stats"

#### Section 7: Study Plan Progress
- Circular progress ring showing "X / 22" in the center
- Ring fills proportionally
- Below: "X days completed"
- Below that: show which day corresponds to today based on plan dates, e.g., "Today: Day 8 — Targeted Drill: Weakest Category"
- Read from `ai900-checklist` localStorage (count checked items)

#### Section 8: Milestones & Lifetime Stats
- Header: "Lifetime Stats"
- Grid of stat cards (2 columns on mobile, 3 on desktop):
  - 🎯 Total Questions Answered — show number, milestone badge if >= 100/250/500/1000
  - ✅ Overall Accuracy — totalCorrect / totalQuestionsAnswered as percentage
  - 📝 Sessions Completed — total count
  - 🔥 Best Streak — all-time high streak
  - ⏱️ Study Time — sum of all timed session totalTime values, formatted as "Xh Ym"
  - 📅 Days Active — days since firstSessionDate

#### Bottom: Reset
- "Reset All Progress" button (red, outlined, not filled)
- On click: show a confirmation dialog "This will clear ALL your progress, scores, and history. This cannot be undone."
- If confirmed: clear ALL ai900-* keys from localStorage and reload the page

**Styling:**
- Dark theme (#0f172a background) consistent with rest of app
- White cards with rounded corners for each section
- Section headers as small uppercase eyebrow labels
- All charts rendered as inline SVG — NO external charting libraries (keep build size small)
- Mobile-first: single column, each section full-width
- Cards have subtle box-shadow for depth
- Milestone badges: small colored pills (gold for 100, silver for 250, etc.)

---

### Step 6: Wire everything into App.jsx navigation
**Status:** 🔴 Not started

Update App.jsx:
1. Add screen states: start | quiz | summary | plan | glossary | matchmaker | dashboard
2. Update nav bar to 5 items with short labels for mobile:
   - 📝 Quiz
   - 🎯 Match
   - 📊 Stats
   - 📅 Plan
   - 📖 Glossary
3. Pass `timedMode` state and setter to StartScreen and QuizScreen
4. After quiz completion (transitioning to summary), call a `logSession()` function that writes to `ai900-session-history` and updates `ai900-milestones`
5. ProgressDashboard reads all data from localStorage directly — no props needed

**Nav bar mobile layout:**
- Use a fixed bottom tab bar on mobile with icons + short labels
- 5 items should fit in a single row
- Active tab highlighted with the app's accent color
- On desktop, keep the top horizontal nav bar

---

### Step 7: Test locally
**Status:** 🔴 Not started

```bash
cd quiz-app
npm run dev
```

Test checklist:

**Service Matchmaker:**
- [ ] Nav shows Match option
- [ ] Round selection with 6 rounds + Random
- [ ] Correct match = green animation
- [ ] Wrong match = red flash, resets
- [ ] Completion = results card with time and attempts
- [ ] Stats persist in localStorage

**Timed Mode:**
- [ ] Toggle on start screen
- [ ] Timer bar during quiz
- [ ] Color changes: green > yellow > red
- [ ] Timeout = auto wrong, shows answer, auto-advances after 2s
- [ ] Timer pauses after answering
- [ ] Summary shows timing stats

**Session Logging:**
- [ ] Completing quiz creates session-history entry
- [ ] Milestones counter updates
- [ ] Session has all required fields
- [ ] Capped at 100 entries

**Progress Dashboard:**
- [ ] Readiness score calculates from weighted category averages
- [ ] Exam countdown correct
- [ ] Radar chart renders 5 axes with data polygon
- [ ] Score trend renders after 2+ sessions
- [ ] Exam simulations shows pass/fail for timed "All" runs
- [ ] Most missed shows top 5 with question text and category
- [ ] Matcher stats section populated
- [ ] Study plan progress ring matches checklist
- [ ] Milestones show lifetime stats
- [ ] Reset clears all progress with confirmation
- [ ] Empty states show helpful messages

**General:**
- [ ] All 5 nav items navigate correctly
- [ ] Nav works on mobile without overflow
- [ ] All existing features still work
- [ ] `npm run build` succeeds

---

### Step 8: Deploy
**Status:** 🔴 Not started

```bash
git add .
git commit -m "V4: Service Matchmaker, Timed Mode, Progress Dashboard"
git push
```

Vercel auto-deploys.

---

## Update Log

| Step | Status | Notes |
|------|--------|-------|
| 1. Create matcher data | ✅ | Added `quiz-app/src/matcherData.js` with 6 rounds of 5 scenario-service pairs each. |
| 2. Build ServiceMatcher component | ✅ | Added `ServiceMatcher.jsx` with round selection, shuffled matching, wrong-flash reset logic, results state, and matcher-stat persistence. |
| 3. Add Timed Mode to quiz | ✅ | Added a persisted timed-mode toggle, per-question countdown/timeout behavior, and timed summary stats. |
| 4. Add session logging | ✅ | Added `ai900-session-history` and `ai900-milestones` writes on quiz completion, including pass/simulation and timing fields. |
| 5. Build Progress Dashboard | ✅ | Added `ProgressDashboard.jsx` with readiness, SVG charts, simulations, weak spots, matcher stats, study progress, lifetime stats, and reset flow. |
| 6. Wire into App.jsx navigation | ✅ | Wired matchmaker/dashboard screens into `App.jsx`, expanded nav to 5 destinations, and added desktop-top/mobile-bottom navigation layouts. |
| 7. Test locally | ✅ | `npm.cmd run build` passed, Vite booted on `127.0.0.1:4175`, and source/data checks confirmed matcher rounds, timed-mode wiring, session-history keys, and the 5-item nav. |
| 8. Deploy | ✅ | Committed as `028b8a5` and pushed to `origin/main` to trigger the Vercel deployment. |
