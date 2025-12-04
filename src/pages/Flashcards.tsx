import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RotateCw, ChevronLeft, ChevronRight, Volume2, VolumeX, Home } from "lucide-react";
import lumaMascot from "@/assets/luma-mascot.png";
import { lessonsByTopic, type TopicType } from "@/data/lessons";
import { getCurrentProfile, getChildProgress, checkTimeLimit } from "@/lib/state";

const Flashcards = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const topic = (searchParams.get("topic") || "reading") as TopicType;
  
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [showTimeLimitDialog, setShowTimeLimitDialog] = useState(false);
  const [timeLimitReason, setTimeLimitReason] = useState("");

  const profile = getCurrentProfile();

  // Get flashcards from lesson content
  const lesson = lessonsByTopic[topic];
  const flashcards = lesson.slides
    .filter((slide) => slide.type === "content" || slide.type === "example")
    .map((slide, index) => ({
      id: index,
      front: slide.title || `Card ${index + 1}`,
      back: slide.content,
      examples: slide.examples || [],
      emoji: slide.emoji || lesson.emoji,
    }));

  const currentCard = flashcards[currentCardIndex];
  const hasNext = currentCardIndex < flashcards.length - 1;
  const hasPrevious = currentCardIndex > 0;

  // Voice narration
  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const voices = speechSynthesis.getVoices();
      let selectedVoice = voices.find(
        (voice) =>
          voice.name.toLowerCase().includes("female") ||
          voice.name.toLowerCase().includes("zira") ||
          voice.name.toLowerCase().includes("samantha") ||
          voice.name.toLowerCase().includes("karen") ||
          voice.name.toLowerCase().includes("fiona")
      );

      if (!selectedVoice) {
        selectedVoice = voices.find((voice) => voice.lang.startsWith("en")) || voices[0];
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

  // Load voices
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

  // Check safety limits
  useEffect(() => {
    if (!profile) {
      navigate("/profiles");
      return;
    }

    const progress = getChildProgress(profile.id);
    if (progress && !progress.safetySettings.allowedTopics.includes(topic)) {
      setTimeLimitReason("This topic is not available. Please check your settings.");
      setShowTimeLimitDialog(true);
      return;
    }

    const timeCheck = checkTimeLimit(profile.id);
    if (!timeCheck.allowed) {
      setTimeLimitReason(timeCheck.reason || "Time limit reached");
      setShowTimeLimitDialog(true);
      return;
    }
  }, [profile, topic, navigate]);

  // Note: Auto-narration removed - users must click voice button to hear narration

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (hasNext) {
      setCurrentCardIndex((prev) => prev + 1);
      setIsFlipped(false);
      stopNarration();
    }
  };

  const handlePrevious = () => {
    if (hasPrevious) {
      setCurrentCardIndex((prev) => prev - 1);
      setIsFlipped(false);
      stopNarration();
    }
  };

  const handleNarrate = () => {
    if (isNarrating) {
      stopNarration();
    } else if (currentCard) {
      speak(isFlipped ? currentCard.back : currentCard.front);
    }
  };

  const handleShuffle = () => {
    // Simple shuffle: go to random card
    const randomIndex = Math.floor(Math.random() * flashcards.length);
    setCurrentCardIndex(randomIndex);
    setIsFlipped(false);
    stopNarration();
  };

  const topicColors: Record<TopicType, string> = {
    reading: "bg-gradient-to-br from-blue-400 to-blue-600",
    math: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    culture: "bg-gradient-to-br from-pink-400 to-pink-600",
    geography: "bg-gradient-to-br from-green-400 to-green-600",
  };

  const topicNames: Record<TopicType, string> = {
    reading: "Reading",
    math: "Math",
    culture: "Culture",
    geography: "Geography",
  };

  if (!profile || !currentCard) {
    return null;
  }

  return (
    <div className={`min-h-screen ${topicColors[topic]} p-6 flex flex-col items-center justify-center`}>
      {/* Header */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
          <span className="text-white font-bold text-sm">
            Card {currentCardIndex + 1} of {flashcards.length}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl w-full relative z-10">
        {/* Luma mascot */}
        <div className="text-center mb-6">
          <img
            src={lumaMascot}
            alt="Luma"
            className="w-32 h-auto mx-auto mb-4 animate-bounce-gentle"
          />
          <h1 className="text-3xl font-black text-white drop-shadow-lg mb-2">
            {topicNames[topic]} Flashcards 📚
          </h1>
          <p className="text-white/90 font-semibold">
            Tap the card to flip and learn!
          </p>
        </div>

        {/* Flashcard */}
        <div className="mb-8">
          <button
            onClick={handleFlip}
            className="w-full min-h-[400px] bg-white rounded-3xl p-8 shadow-2xl transform transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              {!isFlipped ? (
                <>
                  <div className="text-6xl mb-4">{currentCard.emoji}</div>
                  <h2 className="text-4xl font-black text-foreground">
                    {currentCard.front}
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Tap to see the answer! 👆
                  </p>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">{currentCard.emoji}</div>
                  <p className="text-2xl font-bold text-foreground mb-4">
                    {currentCard.back}
                  </p>
                  {currentCard.examples.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {currentCard.examples.map((example, idx) => (
                        <div
                          key={idx}
                          className="text-lg text-muted-foreground bg-muted/30 rounded-lg p-3"
                        >
                          {example}
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mt-4">
                    Tap again to flip back! 🔄
                  </p>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={!hasPrevious}
              className="bg-white/90 hover:bg-white"
              size="lg"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={handleNarrate}
              className="bg-white/90 hover:bg-white"
              size="lg"
            >
              {isNarrating ? (
                <>
                  <VolumeX className="w-5 h-5 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5 mr-2" />
                  Read Aloud
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={!hasNext}
              className="bg-white/90 hover:bg-white"
              size="lg"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
          <Button
            variant="ghost"
            onClick={handleShuffle}
            className="text-white hover:bg-white/20"
          >
            <RotateCw className="w-4 h-4 mr-2" />
            Shuffle Cards
          </Button>
        </div>
      </div>

      {/* Time Limit Dialog */}
      {showTimeLimitDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <h2 className="text-2xl font-black text-foreground mb-4">
              Time Limit Reached ⏰
            </h2>
            <p className="text-muted-foreground mb-6">{timeLimitReason}</p>
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full"
              size="lg"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;

