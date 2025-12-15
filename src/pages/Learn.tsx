import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ProgressBar";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowRight, ArrowLeft, Volume2, VolumeX, Play, Home, HelpCircle } from "lucide-react";
import lumaMascot from "@/assets/luma-mascot.png";
import { lessonsByTopic, type TopicType } from "@/data/lessons";
import {
  getCurrentProfile,
  checkTimeLimit,
  startSession,
  getChildProgress,
} from "@/lib/state";

const Learn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const topic = (searchParams.get("topic") || "reading") as TopicType;
  
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isNarrating, setIsNarrating] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const sessionIndexRef = useRef<number>(-1);
  const profile = getCurrentProfile();

  const lesson = lessonsByTopic[topic];
  const currentSlide = lesson.slides[currentSlideIndex];
  const progress = ((currentSlideIndex + 1) / lesson.slides.length) * 100;

  const topicColors: Record<TopicType, string> = {
    reading: "bg-reading",
    math: "bg-math",
    culture: "bg-culture",
    geography: "bg-geography",
  };

  const topicNames: Record<TopicType, string> = {
    reading: "Reading",
    math: "Math",
    culture: "Culture",
    geography: "Geography",
  };

  // Voice narration support - Kid-friendly female voice
  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const voices = speechSynthesis.getVoices();
      
      let selectedVoice = voices.find(
        (voice) =>
          voice.name.toLowerCase().includes("female") ||
          voice.name.toLowerCase().includes("woman") ||
          voice.name.toLowerCase().includes("girl") ||
          voice.name.toLowerCase().includes("zira") ||
          voice.name.toLowerCase().includes("samantha") ||
          voice.name.toLowerCase().includes("karen") ||
          voice.name.toLowerCase().includes("veena") ||
          voice.name.toLowerCase().includes("fiona")
      );

      if (!selectedVoice) {
        selectedVoice = voices.find(
          (voice) =>
            voice.lang.startsWith("en") &&
            (voice.name.toLowerCase().includes("female") ||
              voice.name.toLowerCase().includes("zira") ||
              voice.name.toLowerCase().includes("samantha") ||
              voice.name.toLowerCase().includes("karen") ||
              voice.name.toLowerCase().includes("fiona"))
        );
      }

      if (!selectedVoice) {
        selectedVoice =
          voices.find((voice) => voice.lang.startsWith("en")) || voices[0];
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.rate = 0.85;
      utterance.pitch = 1.3;
      utterance.volume = 1.0;
      utterance.lang = "en-US";

      setIsNarrating(true);
      utterance.onend = () => setIsNarrating(false);
      utterance.onerror = () => setIsNarrating(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopNarration = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      setIsNarrating(false);
    }
  };

  // Load voices when component mounts
  useEffect(() => {
    if ("speechSynthesis" in window) {
      const loadVoices = () => {
        speechSynthesis.getVoices();
      };
      loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // Check safety limits and start session
  useEffect(() => {
    if (!profile) {
      navigate("/profiles");
      return;
    }

    const progress = getChildProgress(profile.id);
    if (progress && !progress.safetySettings.allowedTopics.includes(topic)) {
      navigate("/dashboard");
      return;
    }

    const timeCheck = checkTimeLimit(profile.id);
    if (!timeCheck.allowed) {
      navigate("/dashboard");
      return;
    }

    startSession(profile.id, topic);
    const progressData = getChildProgress(profile.id);
    if (progressData) {
      sessionIndexRef.current = progressData.sessions.length - 1;
    }

    return () => {
      stopNarration();
    };
  }, []);

  // Note: Auto-narration removed - users must click voice button to hear narration

  const handleNext = () => {
    if (currentSlideIndex < lesson.slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    } else {
      // Go to quiz after learning
      navigate(`/lesson?topic=${topic}`);
    }
  };

  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  return (
    <TooltipProvider>
      <div
        className={`min-h-screen ${topicColors[topic]} p-6 transition-colors duration-500`}
      >
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Navigation - Nielsen #1: Visibility of system status */}
          <div className="mb-4">
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
                  <BreadcrumbLink asChild>
                    <button onClick={() => setShowExitDialog(true)} className="hover:text-primary">
                      Dashboard
                    </button>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{topicNames[topic]} - Learning</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Progress header - Nielsen #1: Visibility of system status */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowExitDialog(true)}
                  >
                    ← Back
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Return to dashboard (your progress will be saved)</p>
                </TooltipContent>
              </Tooltip>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        if (isNarrating) {
                          stopNarration();
                        } else {
                          speak(currentSlide.content);
                        }
                      }}
                      className="w-10 h-10 rounded-full bg-card hover:bg-card/80 flex items-center justify-center shadow-soft transition-all hover:scale-110"
                    >
                      {isNarrating ? (
                        <VolumeX className="w-5 h-5 text-foreground" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-foreground" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isNarrating ? "Stop narration" : "Click to hear this slide read aloud"}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <ProgressBar value={progress} showLabel />
            <p className="text-sm text-center text-foreground/70 mt-2">
              Slide {currentSlideIndex + 1} of {lesson.slides.length}
            </p>
          </div>

        {/* Luma helper - Gestalt Proximity: Group helper message with mascot */}
        <div className="mb-8 animate-scale-in">
          <div className="bg-card rounded-2xl p-6 shadow-playful border-4 border-accent/30 flex items-center gap-4">
            <img
              src={lumaMascot}
              alt="Luma"
              className="w-20 h-auto animate-bounce-gentle"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-muted-foreground mb-1">
                {topicNames[topic]} - Learning Time! 📖
              </p>
              <p className="text-lg font-bold text-foreground">
                {currentSlide.type === "intro"
                  ? "Let's start learning together! 🌟"
                  : currentSlide.type === "example"
                  ? "Ready to practice what you learned? ✨"
                  : "Listen carefully and learn! 🎓"}
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Read through all slides, then take the quiz to test your knowledge!</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Learning content card */}
        <div className="bg-card rounded-2xl p-8 shadow-playful border-4 border-primary/20 mb-6">
          <div className="text-center mb-6">
            {currentSlide.emoji && (
              <div className="text-8xl mb-4 animate-scale-in">
                {currentSlide.emoji}
              </div>
            )}
            {currentSlide.title && (
              <h2 className="text-4xl font-black text-foreground mb-4">
                {currentSlide.title}
              </h2>
            )}
          </div>

          <div className="space-y-6">
            <p className="text-2xl font-bold text-center text-foreground leading-relaxed">
              {currentSlide.content}
            </p>

            {currentSlide.examples && currentSlide.examples.length > 0 && (
              <div className="bg-primary/10 rounded-xl p-6 space-y-3">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Examples:
                </h3>
                {currentSlide.examples.map((example, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-card rounded-lg"
                  >
                    <span className="text-2xl">{example}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation buttons - Gestalt Similarity: Consistent button styling */}
        <div className="flex gap-4 justify-center items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrevious}
                disabled={currentSlideIndex === 0}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Previous
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Go back to the previous slide</p>
            </TooltipContent>
          </Tooltip>

          {currentSlideIndex < lesson.slides.length - 1 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="playful"
                  size="lg"
                  onClick={handleNext}
                  className="min-w-[200px]"
                >
                  Next
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Continue to the next slide</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="playful"
                  size="lg"
                  onClick={handleNext}
                  className="min-w-[200px]"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Quiz!
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Complete all slides? Time to test your knowledge!</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Exit Confirmation Dialog - Nielsen #3: User control and freedom */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Learning Session?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will be saved. You can continue from where you left off later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Learning</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate("/dashboard")}>
              Return to Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </TooltipProvider>
  );
};

export default Learn;



