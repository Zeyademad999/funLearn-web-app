import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ProgressBar";
import { ArrowRight, ArrowLeft, Volume2, VolumeX, Play } from "lucide-react";
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
                    speak(currentSlide.content);
                  }
                }}
                className="w-10 h-10 rounded-full bg-card hover:bg-card/80 flex items-center justify-center shadow-soft transition-all hover:scale-110"
                title={isNarrating ? "Stop narration" : "Read aloud"}
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
          <p className="text-sm text-center text-foreground/70 mt-2">
            Slide {currentSlideIndex + 1} of {lesson.slides.length}
          </p>
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

        {/* Navigation buttons */}
        <div className="flex gap-4 justify-center items-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={currentSlideIndex === 0}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>

          {currentSlideIndex < lesson.slides.length - 1 ? (
            <Button
              variant="playful"
              size="lg"
              onClick={handleNext}
              className="min-w-[200px]"
            >
              Next
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              variant="playful"
              size="lg"
              onClick={handleNext}
              className="min-w-[200px]"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Quiz!
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Learn;



