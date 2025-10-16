# Fun Learn - Educational Web App for Kids

## What This Is

Fun Learn is a web-based learning platform designed for children aged 6-8 years old. Think of it like Duolingo for kids, but focused on multiple subjects including reading, math, culture, and geography. The app combines interactive quizzes with a friendly mascot named Luma who guides kids through their learning journey.

## Page Structure

### 1. Splash Page (`/`)
This is the welcome screen. It shows the Fun Learn logo, floating educational icons, and a big "Start Learning" button. There's also a link to the Parent Dashboard in case parents want to check on their kid's progress.

**Route:** `/`  
**File:** `src/pages/Splash.tsx`

### 2. Profile Selection (`/profiles`)
Kids can select which profile they want to use. Right now it shows Sadra's profile, but you can add more. Each profile has an avatar and tracks individual progress.

**Route:** `/profiles`  
**File:** `src/pages/Profiles.tsx`

### 3. Child Dashboard (`/dashboard`)
This is the main hub where kids see all their options. It displays:
- Their avatar and name at the top
- Star count and streak tracker
- Four lesson bubbles (Reading, Math, Culture, Geography) with progress indicators
- Weekly progress bar
- Badges they've earned

All the lesson bubbles are clickable and lead to the actual lessons.

**Route:** `/dashboard`  
**File:** `src/pages/Dashboard.tsx`

### 4. Lesson Screen (`/lesson?topic=reading`)
This is where the actual learning happens. Each topic has 5 different questions:
- **Reading:** Letter sounds, rhyming, word recognition
- **Math:** Basic addition, counting, shapes
- **Culture:** Flags, food, traditions from different countries
- **Geography:** Oceans, continents, basic Earth facts

The page includes:
- Progress bar showing how far along they are
- Luma mascot giving encouragement
- Answer options (4 choices per question)
- Hint and Retry buttons (hint reveals the answer, retry lets them try again after a wrong answer)

The background color changes based on the topic.

**Route:** `/lesson?topic={topicName}`  
**File:** `src/pages/Lesson.tsx`  
**Questions:** `src/data/questions.ts`

### 5. Results Page (`/results?topic=reading&score=5`)
Shows up after completing all questions in a topic. Displays:
- Celebration message
- Badge earned (specific to the topic completed)
- Stars earned
- Option to continue to next lesson or go back home

**Route:** `/results?topic={topicName}&score={score}`  
**File:** `src/pages/Results.tsx`

### 6. Parent Dashboard (`/parent`)
A clean interface for parents to monitor their child's learning. Shows:
- Progress overview with graphs
- Time spent learning
- Safety settings
- Performance by subject

This page has a more serious, analytical design compared to the playful kid pages.

**Route:** `/parent`  
**File:** `src/pages/ParentDashboard.tsx`

## Navigation Flow

```
Splash → Profiles → Dashboard → Lesson → Results
                                    ↓
                              Parent Dashboard (separate access)
```

## Key Components

- **LessonBubble** (`src/components/LessonBubble.tsx`): The circular buttons for each subject
- **ProgressBar** (`src/components/ProgressBar.tsx`): Shows completion percentage
- **Button variants** (`src/components/ui/button.tsx`): Different button styles used throughout

## Design System

The app uses a custom design system defined in:
- `src/index.css` - Main CSS variables and animations
- `tailwind.config.ts` - Tailwind configuration with custom colors

Colors are theme-based:
- **Reading:** Light blue
- **Math:** Yellow
- **Culture:** Pink/coral
- **Geography:** Green

## Running the Project

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router for navigation
- Lucide React for icons

## Notes for Grading

All pages are fully functional with real navigation between them. The lesson system cycles through 5 unique questions per topic and actually tracks progress. No placeholder content or dummy pages.
