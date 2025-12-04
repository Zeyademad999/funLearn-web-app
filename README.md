# Fun Learn - Educational Web App for Kids

A web-based learning platform designed for children aged 6-8 years old, featuring interactive lessons, quizzes, flashcards, and comprehensive parent monitoring.

## Run Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:8080 or the available port, (check terminal) `

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## View the App

- **Local Development**: Open `http://localhost:8080` in your browser
- **Production**: After building, the app will be in the `dist` folder

## Walkthrough Steps

### Child Learning Flow

1. **Splash Page** (`/`)

   - Welcome screen with Fun Learn logo and mascot Luma
   - Click "Start Learning" to begin
   - Or click "Parent Dashboard" to access parent features

2. **Profile Selection** (`/profiles`)

   - Select an existing profile or create a new one
   - Each profile tracks individual progress
   - Click on a profile card to start learning

3. **Child Dashboard** (`/dashboard`)

   - View your progress: stars earned, daily streak, badges
   - See weekly goal progress
   - **Choose Your Adventure**: Click on any subject (Reading, Math, Culture, Geography)
   - **Review with Flashcards**: Practice what you've learned with interactive flashcards
   - Click on badges to see details
   - Switch profile or exit anytime

4. **Learning Slides** (`/learn?topic={topic}`)

   - Interactive slides with educational content
   - Navigate with Previous/Next buttons
   - Click the voice icon to hear content read aloud
   - Complete all slides to proceed to quiz

5. **Quiz/Lesson** (`/lesson?topic={topic}`)

   - Answer 5 questions about the topic
   - Click voice icon to hear questions read aloud
   - Select an answer (get immediate feedback)
   - Use "Hint" to see the correct answer
   - Use "Retry" if you answered incorrectly
   - Progress bar shows completion status

6. **Results Page** (`/results?topic={topic}&score={score}`)

   - Celebration screen showing completion
   - View badge earned (if any)
   - See stars earned (+5 per lesson)
   - Choose to continue to next lesson or return to dashboard

7. **Flashcards** (`/flashcards?topic={topic}`)
   - Review mode for each subject
   - Tap cards to flip and see answers
   - Navigate with Previous/Next buttons
   - Click "Read Aloud" to hear content
   - Shuffle cards for random review
   - Return to dashboard when done

### Parent Dashboard Flow

1. **Parent Login** (`/parent/login`)

   - Enter password: `parent123` (demo password)
   - Click "Access Dashboard"
   - Redirects to parent dashboard on success

2. **Parent Dashboard** (`/parent`)
   - **Select Child Profile**: Choose which child's progress to view (if multiple)
   - **View Statistics**:
     - Total lessons completed
     - Time spent learning
     - Accuracy percentage
   - **View Subject Progress**: See progress bars for Reading, Math, Culture, Geography
   - **View Time per Subject**: See minutes spent on each subject
   - **View Recent Activity**: See badges earned with dates
   - **View Today's Summary**: Get feedback messages about daily activity
   - **Adjust Settings**: Click Settings button to:
     - Set daily time limit
     - Set session time limit
     - Toggle content filtering
     - Toggle age-appropriate content
     - Select allowed topics
   - **Rename Profile**: Click edit icon next to child's name
   - **Logout**: Return to splash page

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
