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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BookOpen, Calculator, Globe, Map, Award, Flame, Star, Lock, FileText, Home, HelpCircle } from "lucide-react";
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
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-primary p-6">
        {/* Breadcrumb Navigation - Nielsen #1: Visibility of system status */}
        <div className="max-w-6xl mx-auto mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <button onClick={() => navigate("/")} className="flex items-center gap-1 hover:text-primary">
                    <Home className="w-4 h-4" />
                    Home
                  </button>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

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
              {/* Gestalt Proximity: Group related stats together */}
              <div className="flex items-center gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2 shadow-soft cursor-help">
                      <Star className="w-6 h-6 fill-accent text-accent" />
                      <span className="text-xl font-black">{progress.stars}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total stars earned from completing lessons</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 bg-accent/20 rounded-xl px-4 py-2 shadow-soft cursor-help">
                      <Flame className="w-6 h-6 text-accent" />
                      <span className="text-xl font-black">{progress.streak} {progress.streak === 1 ? 'day' : 'days'}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Daily learning streak - keep it going!</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lessons section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gestalt Proximity: Group related lesson bubbles with clear visual container */}
          <div className="bg-card rounded-2xl p-8 shadow-playful border-4 border-primary/20">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-black text-foreground">Choose Your Adventure</h2>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Click on any subject to start learning! Complete lessons to earn stars and badges.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            {/* Gestalt Similarity: Consistent styling for all lesson bubbles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 place-items-center">
              {lessons.map((lesson) => {
                const isAllowed = progress.safetySettings.allowedTopics.includes(lesson.topic);
                return (
                  <Tooltip key={lesson.topic}>
                    <TooltipTrigger asChild>
                      <div>
                        <LessonBubble
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
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {isAllowed 
                          ? `${lesson.title}: ${lesson.progress}% complete. Click to start learning!`
                          : `${lesson.title} is locked. Ask a parent to enable it in settings.`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {/* Flashcards Section - Gestalt Proximity: Group flashcards together */}
          <div className="bg-card rounded-2xl p-8 shadow-playful border-4 border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                <FileText className="w-6 h-6 text-accent" />
                Review with Flashcards
              </h2>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Practice what you've learned! Flip cards to review key concepts from each subject.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-muted-foreground mb-4">
              Practice what you've learned with interactive flashcards!
            </p>
            {/* Gestalt Similarity: Consistent button styling */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {lessons.map((lesson) => {
                const isAllowed = progress.safetySettings.allowedTopics.includes(lesson.topic);
                return (
                  <Tooltip key={`flashcard-${lesson.topic}`}>
                    <TooltipTrigger asChild>
                      <div>
                        <Button
                          variant="outline"
                          disabled={!isAllowed}
                          onClick={() => {
                            if (isAllowed) {
                              navigate(`/flashcards?topic=${lesson.topic}`);
                            }
                          }}
                          className={`h-20 flex flex-col items-center justify-center gap-2 relative ${
                            isAllowed
                              ? "hover:bg-accent/20 hover:scale-105 transition-all"
                              : "opacity-50 cursor-not-allowed"
                          }`}
                        >
                          <lesson.icon className={`w-6 h-6 ${isAllowed ? "" : "opacity-50"}`} />
                          <span className="text-sm font-semibold">{lesson.title}</span>
                          {!isAllowed && <Lock className="w-4 h-4 absolute top-2 right-2" />}
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {isAllowed 
                          ? `Review ${lesson.title} flashcards - Click to start!`
                          : `${lesson.title} flashcards are locked. Ask a parent to enable this subject.`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
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
          {/* Progress card - Gestalt Proximity: Group progress info together */}
          <div className="bg-card rounded-2xl p-6 shadow-playful border-4 border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                <Award className="w-6 h-6 text-accent" />
                Your Progress
              </h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Track your weekly learning goal progress</p>
                </TooltipContent>
              </Tooltip>
            </div>
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

          {/* Badges card - Gestalt Proximity: Group badges together */}
          <div className="bg-card rounded-2xl p-6 shadow-playful border-4 border-primary/20">
            <h3 className="text-xl font-black text-foreground mb-4">
              Badges Earned ({progress.badges.length})
            </h3>
            <div className="flex gap-3 flex-wrap">
              {progress.badges.length > 0 ? (
                progress.badges.map((badge) => (
                  <Tooltip key={badge.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          setSelectedBadge(badge);
                          setShowBadgeDialog(true);
                        }}
                        className="w-16 h-16 bg-gradient-warm rounded-xl flex items-center justify-center text-3xl shadow-soft hover:scale-110 hover:shadow-glow transition-all cursor-pointer border-2 border-accent/30"
                      >
                        {badge.emoji}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{badge.name} - Click to see details!</p>
                    </TooltipContent>
                  </Tooltip>
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

          {/* Navigation buttons - Gestalt Proximity: Group navigation actions */}
          <div className="space-y-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/profiles")}
                >
                  Switch Profile
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Switch to a different learner profile</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate("/")}
                >
                  Exit
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Return to the home page</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
};

export default Dashboard;
