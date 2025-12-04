import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LessonBubble } from "@/components/LessonBubble";
import { ProgressBar } from "@/components/ProgressBar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookOpen, Calculator, Globe, Map, Award, Flame, Star, Lock, FileText } from "lucide-react";
import avatarSadra from "@/assets/avatar-sadra.png";
import lumaMascot from "@/assets/luma-mascot.png";
import {
  getCurrentProfile,
  getChildProgress,
  getTopicProgress,
  type TopicType,
  type Badge,
} from "@/lib/state";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getCurrentProfile());
  const [progress, setProgress] = useState(getChildProgress(profile?.id || ""));

  useEffect(() => {
    const currentProfile = getCurrentProfile();
    if (!currentProfile) {
      navigate("/profiles");
      return;
    }
    setProfile(currentProfile);
    const childProgress = getChildProgress(currentProfile.id);
    setProgress(childProgress);
  }, [navigate]);

  if (!profile || !progress) {
    return null;
  }

  const lessons = [
    { title: "Reading", icon: BookOpen, color: "reading" as const, topic: "reading" as TopicType },
    { title: "Math", icon: Calculator, color: "math" as const, topic: "math" as TopicType },
    { title: "Culture", icon: Globe, color: "culture" as const, topic: "culture" as TopicType },
    { title: "Geography", icon: Map, color: "geography" as const, topic: "geography" as TopicType },
  ].map((lesson) => ({
    ...lesson,
    progress: getTopicProgress(profile.id, lesson.topic),
    locked: false,
  }));

  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [showBadgeDialog, setShowBadgeDialog] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-primary p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-card rounded-2xl p-6 shadow-playful border-4 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-16 h-16 rounded-full border-4 border-primary shadow-soft"
              />
              <div>
                <h1 className="text-3xl font-black text-foreground">Hi {profile.name}! 👋</h1>
                <p className="text-muted-foreground font-semibold">Let's learn something amazing today!</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2 shadow-soft">
                <Star className="w-6 h-6 fill-accent text-accent" />
                <span className="text-xl font-black">{progress.stars}</span>
              </div>
              <div className="flex items-center gap-2 bg-accent/20 rounded-xl px-4 py-2 shadow-soft">
                <Flame className="w-6 h-6 text-accent" />
                <span className="text-xl font-black">{progress.streak} {progress.streak === 1 ? 'day' : 'days'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lessons section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl p-8 shadow-playful border-4 border-primary/20">
            <h2 className="text-2xl font-black text-foreground mb-6">Choose Your Adventure</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 place-items-center">
              {lessons.map((lesson) => {
                const isAllowed = progress.safetySettings.allowedTopics.includes(lesson.topic);
                return (
                  <LessonBubble
                    key={lesson.topic}
                    title={lesson.title}
                    icon={lesson.icon}
                    color={lesson.color}
                    progress={lesson.progress}
                    locked={!isAllowed}
                    onClick={() => {
                      if (isAllowed) {
                        navigate(`/learn?topic=${lesson.topic}`);
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Flashcards Section */}
          <div className="bg-card rounded-2xl p-8 shadow-playful border-4 border-primary/20">
            <h2 className="text-2xl font-black text-foreground mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-accent" />
              Review with Flashcards
            </h2>
            <p className="text-muted-foreground mb-4">
              Practice what you've learned with interactive flashcards!
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {lessons.map((lesson) => {
                const isAllowed = progress.safetySettings.allowedTopics.includes(lesson.topic);
                return (
                  <Button
                    key={`flashcard-${lesson.topic}`}
                    variant="outline"
                    disabled={!isAllowed}
                    onClick={() => {
                      if (isAllowed) {
                        navigate(`/flashcards?topic=${lesson.topic}`);
                      }
                    }}
                    className={`h-20 flex flex-col items-center justify-center gap-2 ${
                      isAllowed
                        ? "hover:bg-accent/20 hover:scale-105 transition-all"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <lesson.icon className={`w-6 h-6 ${isAllowed ? "" : "opacity-50"}`} />
                    <span className="text-sm font-semibold">{lesson.title}</span>
                    {!isAllowed && <Lock className="w-4 h-4 absolute top-2 right-2" />}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Luma message */}
          <div className="bg-secondary rounded-2xl p-6 shadow-soft border-4 border-secondary/50 relative overflow-hidden">
            <img
              src={lumaMascot}
              alt="Luma"
              className="absolute -right-4 -top-4 w-32 h-auto opacity-40"
            />
            <div className="relative z-10">
              <p className="text-lg font-bold text-secondary-foreground">
                💡 "Let's explore traditions from around the world today, Sadra!"
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress card */}
          <div className="bg-card rounded-2xl p-6 shadow-playful border-4 border-primary/20">
            <h3 className="text-xl font-black text-foreground mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-accent" />
              Your Progress
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span>Weekly Goal</span>
                  <span>{progress.weeklyCompleted}/{progress.weeklyGoal} lessons</span>
                </div>
                <ProgressBar value={(progress.weeklyCompleted / progress.weeklyGoal) * 100} showLabel />
              </div>
            </div>
          </div>

          {/* Badges card */}
          <div className="bg-card rounded-2xl p-6 shadow-playful border-4 border-primary/20">
            <h3 className="text-xl font-black text-foreground mb-4">
              Badges Earned ({progress.badges.length})
            </h3>
            <div className="flex gap-3 flex-wrap">
              {progress.badges.length > 0 ? (
                progress.badges.map((badge) => (
                  <button
                    key={badge.id}
                    onClick={() => {
                      setSelectedBadge(badge);
                      setShowBadgeDialog(true);
                    }}
                    className="w-16 h-16 bg-gradient-warm rounded-xl flex items-center justify-center text-3xl shadow-soft hover:scale-110 hover:shadow-glow transition-all cursor-pointer border-2 border-accent/30"
                    title={`${badge.name} - Click to see details!`}
                  >
                    {badge.emoji}
                  </button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Complete lessons to earn badges!</p>
              )}
            </div>
          </div>

          {/* Badge Detail Dialog */}
          <Dialog open={showBadgeDialog} onOpenChange={setShowBadgeDialog}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="text-center text-2xl">
                  {selectedBadge?.name}
                </DialogTitle>
                <DialogDescription className="text-center">
                  {selectedBadge?.description}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-32 h-32 bg-gradient-warm rounded-full flex items-center justify-center text-6xl shadow-glow animate-scale-in">
                  {selectedBadge?.emoji}
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">
                    Category: {selectedBadge?.category}
                  </p>
                  {selectedBadge?.unlockedAt && (
                    <p className="text-xs text-muted-foreground">
                      Earned on {new Date(selectedBadge.unlockedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
                <div className="bg-secondary/20 rounded-lg p-4 w-full text-center">
                  <p className="text-sm font-bold text-secondary-foreground">
                    🎉 Great job earning this badge!
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Navigation buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/profiles")}
            >
              Switch Profile
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/")}
            >
              Exit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
