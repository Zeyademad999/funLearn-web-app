import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ProgressBar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Lightbulb, RotateCcw, Volume2, VolumeX } from "lucide-react";
import lumaMascot from "@/assets/luma-mascot.png";
import { questionsByTopic, TopicType } from "@/data/questions";
import {
  getCurrentProfile,
  checkTimeLimit,
  startSession,
  endSession,
  getChildProgress,
} from "@/lib/state";

const Lesson = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const topic = (searchParams.get("topic") || "reading") as TopicType;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showTimeLimitDialog, setShowTimeLimitDialog] = useState(false);
  const [timeLimitReason, setTimeLimitReason] = useState("");
  const [isNarrating, setIsNarrating] = useState(false);
  const sessionIndexRef = useRef<number>(-1);
  const profile = getCurrentProfile();

  // Voice narration support - Kid-friendly female voice
  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      // Get available voices
      const voices = speechSynthesis.getVoices();

      // Try to find a female, kid-friendly voice
      // Prefer voices with "female", "woman", "girl", "child", or "young" in the name
      let selectedVoice = voices.find(
        (voice) =>
          voice.name.toLowerCase().includes("female") ||
          voice.name.toLowerCase().includes("woman") ||
          voice.name.toLowerCase().includes("girl") ||
          voice.name.toLowerCase().includes("zira") || // Windows female voice
          voice.name.toLowerCase().includes("samantha") || // macOS female voice
          voice.name.toLowerCase().includes("karen") || // macOS Australian female
          voice.name.toLowerCase().includes("veena") || // Google female voice
          voice.name.toLowerCase().includes("fiona") // macOS Scottish female
      );

      // If no specific female voice found, try to find any female-sounding voice
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

      // Fallback to first English voice if still not found
      if (!selectedVoice) {
        selectedVoice =
          voices.find((voice) => voice.lang.startsWith("en")) || voices[0];
      }

      const utterance = new SpeechSynthesisUtterance(text);

      // Set voice properties for a happy, kid-friendly, comforting tone
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.rate = 0.85; // Slightly slower for clarity and comfort
      utterance.pitch = 1.3; // Higher pitch for a happier, more cheerful sound
      utterance.volume = 1.0; // Full volume
      utterance.lang = "en-US"; // English

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

  const questions = questionsByTopic[topic] || questionsByTopic.reading;
  const question = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Load voices when component mounts
  useEffect(() => {
    // Load voices (some browsers need this)
    if ("speechSynthesis" in window) {
      const loadVoices = () => {
        speechSynthesis.getVoices(); // This triggers voice loading
      };
      loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // Check safety limits and start session (only once on mount)
  useEffect(() => {
    if (!profile) {
      navigate("/profiles");
      return;
    }

    // Check if topic is allowed
    const progress = getChildProgress(profile.id);
    if (progress && !progress.safetySettings.allowedTopics.includes(topic)) {
      setTimeLimitReason(
        "This topic is not available. Please check your settings."
      );
      setShowTimeLimitDialog(true);
      return;
    }

    const timeCheck = checkTimeLimit(profile.id);
    if (!timeCheck.allowed) {
      setTimeLimitReason(timeCheck.reason || "Time limit reached");
      setShowTimeLimitDialog(true);
      return;
    }

    // Start session tracking
    startSession(profile.id, topic);
    const progressData = getChildProgress(profile.id);
    if (progressData) {
      sessionIndexRef.current = progressData.sessions.length - 1;
    }

    // Wait a bit for voices to load, then narrate first question
    setTimeout(() => {
      speak(question.text);
    }, 300);

    // Cleanup on unmount
    return () => {
      stopNarration();
      if (sessionIndexRef.current >= 0 && profile) {
        endSession(profile.id, sessionIndexRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Narrate new question when it changes
  useEffect(() => {
    if (currentQuestionIndex > 0) {
      stopNarration();
      // Small delay for smooth transition
      setTimeout(() => {
        speak(question.text);
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex]);

  // Check session time limit periodically
  useEffect(() => {
    if (!profile) return;

    const interval = setInterval(() => {
      const timeCheck = checkTimeLimit(profile.id);
      if (!timeCheck.allowed) {
        setTimeLimitReason(timeCheck.reason || "Time limit reached");
        setShowTimeLimitDialog(true);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [profile]);

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

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    if (index === question.correct) {
      setTimeout(() => {
        if (currentQuestionIndex + 1 >= questions.length) {
          navigate(`/results?topic=${topic}&score=${questions.length}`);
        } else {
          setCurrentQuestionIndex((prev) => prev + 1);
          setSelectedAnswer(null);
          setShowHint(false);
        }
      }, 1000);
    }
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowHint(false);
  };

  const handleHint = () => {
    setShowHint(true);
  };

  return (
    <div
      className={`min-h-screen ${topicColors[topic]} p-6 transition-colors duration-500`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Progress header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
            >
              ← Back
            </Button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (isNarrating) {
                    stopNarration();
                  } else {
                    speak(question.text);
                  }
                }}
                className="w-10 h-10 rounded-full bg-card hover:bg-card/80 flex items-center justify-center shadow-soft transition-all hover:scale-110"
                title={isNarrating ? "Stop narration" : "Read question"}
              >
                {isNarrating ? (
                  <VolumeX className="w-5 h-5 text-foreground" />
                ) : (
                  <Volume2 className="w-5 h-5 text-foreground" />
                )}
              </button>
            </div>
          </div>
          <ProgressBar value={progress} showLabel />
        </div>

        {/* Luma helper */}
        <div className="mb-8 animate-scale-in">
          <div className="bg-card rounded-2xl p-6 shadow-playful border-4 border-accent/30 flex items-center gap-4">
            <img
              src={lumaMascot}
              alt="Luma"
              className="w-20 h-auto animate-bounce-gentle"
            />
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">
                {topicNames[topic]} - Question {currentQuestionIndex + 1} of{" "}
                {questions.length}
              </p>
              <p className="text-lg font-bold text-foreground">
                {showHint
                  ? `💡 The correct answer is option ${question.correct + 1}!`
                  : "Take your time and think carefully! You've got this! 🌟"}
              </p>
            </div>
          </div>
        </div>

        {/* Question card */}
        <div className="bg-card rounded-2xl p-8 shadow-playful border-4 border-primary/20 mb-6">
          <h2 className="text-3xl font-black text-center text-foreground mb-8">
            {question.text}
          </h2>

          {/* Emoji display */}
          {question.emoji && (
            <div className="text-9xl text-center mb-8 animate-scale-in">
              {question.emoji}
            </div>
          )}

          {/* Answer options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`
                  p-6 rounded-xl font-bold text-xl transition-all
                  ${
                    selectedAnswer === null
                      ? "bg-primary/10 hover:bg-primary/20 hover:scale-105 active:scale-95 border-2 border-primary/30"
                      : selectedAnswer === index
                      ? index === question.correct
                        ? "bg-secondary border-4 border-secondary scale-105 shadow-glow"
                        : "bg-destructive/20 border-4 border-destructive scale-95"
                      : "bg-muted/20 opacity-50"
                  }
                `}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Helper buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handleHint}
            disabled={showHint || selectedAnswer !== null}
          >
            <Lightbulb className="w-5 h-5" />
            Hint
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleRetry}
            disabled={
              selectedAnswer === null || selectedAnswer === question.correct
            }
          >
            <RotateCcw className="w-5 h-5" />
            Retry
          </Button>
        </div>
      </div>

      {/* Time limit dialog */}
      <AlertDialog
        open={showTimeLimitDialog}
        onOpenChange={setShowTimeLimitDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Time's Up! ⏰</AlertDialogTitle>
            <AlertDialogDescription>
              {timeLimitReason === "Daily time limit reached"
                ? "You've reached your daily learning time limit. Great job today! Come back tomorrow to continue learning."
                : "Your session time limit has been reached. Take a break and come back later!"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    
  );
};

export default Lesson;
