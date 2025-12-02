// State management for Fun Learn app
// Uses localStorage for persistence

export type TopicType = "reading" | "math" | "culture" | "geography";

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  createdAt: number;
}

export interface LessonProgress {
  topic: TopicType;
  completedLessons: number;
  totalLessons: number;
  lastCompleted?: number;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlockedAt: number;
  category: "topic" | "streak" | "milestone" | "achievement";
}

export interface BadgeDefinition {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: "topic" | "streak" | "milestone" | "achievement";
}

export interface Session {
  startTime: number;
  endTime?: number;
  topic?: TopicType;
  duration?: number; // in seconds
}

export interface SafetySettings {
  dailyTimeLimit: number; // in minutes
  sessionTimeLimit: number; // in minutes
  contentFilterEnabled: boolean;
  ageAppropriateEnabled: boolean;
  allowedTopics: TopicType[];
}

export interface ChildProgress {
  profileId: string;
  stars: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  badges: Badge[];
  lessons: LessonProgress[];
  sessions: Session[];
  totalTimeSpent: number; // in seconds
  weeklyGoal: number;
  weeklyCompleted: number;
  safetySettings: SafetySettings;
}

export interface AppState {
  profiles: Profile[];
  currentProfileId: string | null;
  children: Record<string, ChildProgress>;
}

const STORAGE_KEY = "funlearn-app-state";

// Default safety settings
const DEFAULT_SAFETY_SETTINGS: SafetySettings = {
  dailyTimeLimit: 60, // 1 hour
  sessionTimeLimit: 30, // 30 minutes
  contentFilterEnabled: true,
  ageAppropriateEnabled: true,
  allowedTopics: ["reading", "math", "culture", "geography"],
};

// Badge definitions
export const BADGE_DEFINITIONS: Record<string, BadgeDefinition> = {
  "reading-master": {
    id: "reading-master",
    name: "Reading Master",
    emoji: "📚",
    description: "Completed all Reading lessons",
    category: "topic",
  },
  "math-master": {
    id: "math-master",
    name: "Math Master",
    emoji: "🔢",
    description: "Completed all Math lessons",
    category: "topic",
  },
  "culture-master": {
    id: "culture-master",
    name: "Culture Master",
    emoji: "🌍",
    description: "Completed all Culture lessons",
    category: "topic",
  },
  "geography-master": {
    id: "geography-master",
    name: "Geography Master",
    emoji: "🗺️",
    description: "Completed all Geography lessons",
    category: "topic",
  },
  "streak-7": {
    id: "streak-7",
    name: "Week Warrior",
    emoji: "🔥",
    description: "7 day streak!",
    category: "streak",
  },
  "streak-30": {
    id: "streak-30",
    name: "Monthly Master",
    emoji: "⭐",
    description: "30 day streak!",
    category: "streak",
  },
  "world-explorer": {
    id: "world-explorer",
    name: "World Explorer",
    emoji: "🌎",
    description: "Explored all cultural topics",
    category: "milestone",
  },
  "star-collector": {
    id: "star-collector",
    name: "Star Collector",
    emoji: "⭐",
    description: "Earned 100 stars",
    category: "achievement",
  },
  "dedicated-learner": {
    id: "dedicated-learner",
    name: "Dedicated Learner",
    emoji: "🏆",
    description: "Completed 10 lessons",
    category: "achievement",
  },
};

// Initialize default state
function getDefaultState(): AppState {
  return {
    profiles: [],
    currentProfileId: null,
    children: {},
  };
}

// Load state from localStorage
export function loadState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure all profiles have required fields
      if (parsed.profiles) {
        parsed.profiles = parsed.profiles.map((p: Profile) => ({
          ...p,
          createdAt: p.createdAt || Date.now(),
        }));
      }
      return parsed;
    }
  } catch (error) {
    console.error("Error loading state:", error);
  }
  return getDefaultState();
}

// Save state to localStorage
export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving state:", error);
  }
}

// Get current state
export function getState(): AppState {
  return loadState();
}

// Update state
export function updateState(updater: (state: AppState) => AppState): void {
  const current = loadState();
  const updated = updater(current);
  saveState(updated);
}

// Profile management
export function createProfile(name: string, avatar: string): Profile {
  const profile: Profile = {
    id: `profile-${Date.now()}`,
    name,
    avatar,
    createdAt: Date.now(),
  };

  updateState((state) => {
    state.profiles.push(profile);
    // Initialize child progress
    state.children[profile.id] = {
      profileId: profile.id,
      stars: 0,
      streak: 0,
      lastActiveDate: "",
      badges: [],
      lessons: [
        { topic: "reading", completedLessons: 0, totalLessons: 5 },
        { topic: "math", completedLessons: 0, totalLessons: 5 },
        { topic: "culture", completedLessons: 0, totalLessons: 5 },
        { topic: "geography", completedLessons: 0, totalLessons: 5 },
      ],
      sessions: [],
      totalTimeSpent: 0,
      weeklyGoal: 10,
      weeklyCompleted: 0,
      safetySettings: { ...DEFAULT_SAFETY_SETTINGS },
    };
    return state;
  });

  return profile;
}

export function getCurrentProfile(): Profile | null {
  const state = loadState();
  if (!state.currentProfileId) return null;
  return state.profiles.find((p) => p.id === state.currentProfileId) || null;
}

export function setCurrentProfile(profileId: string): void {
  updateState((state) => {
    state.currentProfileId = profileId;
    return state;
  });
}

export function getChildProgress(profileId: string): ChildProgress | null {
  const state = loadState();
  return state.children[profileId] || null;
}

// Progress tracking
export function completeLesson(profileId: string, topic: TopicType): void {
  updateState((state) => {
    const child = state.children[profileId];
    if (!child) return state;

    // Update lesson progress
    const lesson = child.lessons.find((l) => l.topic === topic);
    if (lesson) {
      lesson.completedLessons = Math.min(
        lesson.completedLessons + 1,
        lesson.totalLessons
      );
      lesson.lastCompleted = Date.now();
    }

    // Award stars (5 per lesson)
    child.stars += 5;

    // Update weekly goal
    child.weeklyCompleted += 1;

    // Update streak
    updateStreak(child);

    // Check for badges
    checkAndAwardBadges(child);

    return state;
  });
}

// Update streak based on last active date
function updateStreak(child: ChildProgress): void {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (child.lastActiveDate === today) {
    // Already active today, no change
    return;
  }

  if (child.lastActiveDate === yesterday) {
    // Consecutive day
    child.streak += 1;
  } else if (child.lastActiveDate === "") {
    // First time
    child.streak = 1;
  } else {
    // Streak broken
    child.streak = 1;
  }

  child.lastActiveDate = today;
}

// Check and award badges
function checkAndAwardBadges(child: ChildProgress): void {
  const now = Date.now();

  // Topic completion badges
  child.lessons.forEach((lesson) => {
    if (lesson.completedLessons >= lesson.totalLessons) {
      const badgeId = `${lesson.topic}-master` as keyof typeof BADGE_DEFINITIONS;
      if (BADGE_DEFINITIONS[badgeId] && !child.badges.find((b) => b.id === badgeId)) {
        child.badges.push({
          ...BADGE_DEFINITIONS[badgeId],
          unlockedAt: now,
        });
      }
    }
  });

  // Streak badges
  if (child.streak >= 7 && !child.badges.find((b) => b.id === "streak-7")) {
    child.badges.push({
      ...BADGE_DEFINITIONS["streak-7"],
      unlockedAt: now,
    });
  }
  if (child.streak >= 30 && !child.badges.find((b) => b.id === "streak-30")) {
    child.badges.push({
      ...BADGE_DEFINITIONS["streak-30"],
      unlockedAt: now,
    });
  }

  // Star collector badge
  if (child.stars >= 100 && !child.badges.find((b) => b.id === "star-collector")) {
    child.badges.push({
      ...BADGE_DEFINITIONS["star-collector"],
      unlockedAt: now,
    });
  }

  // Dedicated learner badge
  const totalCompleted = child.lessons.reduce(
    (sum, l) => sum + l.completedLessons,
    0
  );
  if (totalCompleted >= 10 && !child.badges.find((b) => b.id === "dedicated-learner")) {
    child.badges.push({
      ...BADGE_DEFINITIONS["dedicated-learner"],
      unlockedAt: now,
    });
  }

  // World explorer badge (all culture/geography lessons)
  const cultureComplete =
    child.lessons.find((l) => l.topic === "culture")?.completedLessons || 0;
  const geoComplete =
    child.lessons.find((l) => l.topic === "geography")?.completedLessons || 0;
  if (
    cultureComplete >= 5 &&
    geoComplete >= 5 &&
    !child.badges.find((b) => b.id === "world-explorer")
  ) {
    child.badges.push({
      ...BADGE_DEFINITIONS["world-explorer"],
      unlockedAt: now,
    });
  }
}

// Session tracking
export function startSession(profileId: string, topic?: TopicType): string {
  const sessionId = `session-${Date.now()}`;
  updateState((state) => {
    const child = state.children[profileId];
    if (!child) return state;

    child.sessions.push({
      startTime: Date.now(),
      topic,
    });

    return state;
  });
  return sessionId;
}

export function endSession(profileId: string, sessionIndex: number): void {
  updateState((state) => {
    const child = state.children[profileId];
    if (!child || !child.sessions[sessionIndex]) return state;

    const session = child.sessions[sessionIndex];
    const now = Date.now();
    const duration = Math.floor((now - session.startTime) / 1000);

    session.endTime = now;
    session.duration = duration;
    child.totalTimeSpent += duration;

    return state;
  });
}

// Safety and limits
export function checkTimeLimit(profileId: string): {
  allowed: boolean;
  reason?: string;
  remainingMinutes?: number;
} {
  const child = getChildProgress(profileId);
  if (!child) {
    return { allowed: false, reason: "Profile not found" };
  }

  const settings = child.safetySettings;

  // Check daily time limit
  const today = new Date().toISOString().split("T")[0];
  const todaySessions = child.sessions.filter((s) => {
    if (!s.endTime) return false;
    const sessionDate = new Date(s.endTime).toISOString().split("T")[0];
    return sessionDate === today;
  });
  const todayTimeSpent = todaySessions.reduce(
    (sum, s) => sum + (s.duration || 0),
    0
  );
  const todayMinutes = Math.floor(todayTimeSpent / 60);

  if (todayMinutes >= settings.dailyTimeLimit) {
    return {
      allowed: false,
      reason: "Daily time limit reached",
      remainingMinutes: 0,
    };
  }

  return {
    allowed: true,
    remainingMinutes: settings.dailyTimeLimit - todayMinutes,
  };
}

export function updateSafetySettings(
  profileId: string,
  settings: Partial<SafetySettings>
): void {
  updateState((state) => {
    const child = state.children[profileId];
    if (!child) return state;

    child.safetySettings = {
      ...child.safetySettings,
      ...settings,
    };

    return state;
  });
}

// Get progress percentage for a topic
export function getTopicProgress(
  profileId: string,
  topic: TopicType
): number {
  const child = getChildProgress(profileId);
  if (!child) return 0;

  const lesson = child.lessons.find((l) => l.topic === topic);
  if (!lesson) return 0;

  return (lesson.completedLessons / lesson.totalLessons) * 100;
}

// Reset weekly progress (call this weekly)
export function resetWeeklyProgress(profileId: string): void {
  updateState((state) => {
    const child = state.children[profileId];
    if (!child) return state;

    child.weeklyCompleted = 0;
    return state;
  });
}

// Get time spent per topic
export function getTimePerTopic(profileId: string): Record<TopicType, number> {
  const child = getChildProgress(profileId);
  if (!child) {
    return { reading: 0, math: 0, culture: 0, geography: 0 };
  }

  const timePerTopic: Record<TopicType, number> = {
    reading: 0,
    math: 0,
    culture: 0,
    geography: 0,
  };

  child.sessions.forEach((session) => {
    if (session.topic && session.duration) {
      timePerTopic[session.topic] += session.duration;
    }
  });

  return timePerTopic;
}

// Generate feedback summary
export function generateFeedbackSummary(profileId: string): string[] {
  const child = getChildProgress(profileId);
  const state = loadState();
  const profile = state.profiles.find((p) => p.id === profileId);
  const childName = profile?.name || "Your child";

  if (!child) return [];

  const summaries: string[] = [];
  const today = new Date().toISOString().split("T")[0];

  // Check for today's activity
  const todaySessions = child.sessions.filter((s) => {
    if (!s.endTime) return false;
    const sessionDate = new Date(s.endTime).toISOString().split("T")[0];
    return sessionDate === today;
  });

  if (todaySessions.length > 0) {
    summaries.push(`${childName} completed ${todaySessions.length} ${todaySessions.length === 1 ? "lesson" : "lessons"} today!`);
  }

  // Check for progress improvements
  child.lessons.forEach((lesson) => {
    if (lesson.lastCompleted) {
      const completedDate = new Date(lesson.lastCompleted).toISOString().split("T")[0];
      if (completedDate === today) {
        const topicName = lesson.topic.charAt(0).toUpperCase() + lesson.topic.slice(1);
        summaries.push(`Great progress in ${topicName}! ${childName} completed a ${topicName.toLowerCase()} lesson.`);
      }
    }
  });

  // Check for new badges today
  const todayBadges = child.badges.filter((badge) => {
    const badgeDate = new Date(badge.unlockedAt).toISOString().split("T")[0];
    return badgeDate === today;
  });

  if (todayBadges.length > 0) {
    summaries.push(`🎉 Earned ${todayBadges.length} new ${todayBadges.length === 1 ? "badge" : "badges"} today!`);
  }

  // Check for streak milestones
  if (child.streak > 0 && child.streak % 7 === 0) {
    summaries.push(`🔥 Amazing! ${child.streak} day streak! Keep it up!`);
  }

  return summaries.length > 0 ? summaries : [`No recent activity. Encourage ${childName} to start learning!`];
}

