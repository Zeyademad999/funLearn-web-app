import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ProgressBar";
import { Lightbulb, RotateCcw, Volume2 } from "lucide-react";
import lumaMascot from "@/assets/luma-mascot.png";

const Lesson = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(25);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const question = {
    text: "Which country's flag is this? 🇯🇵",
    options: ["China", "Japan", "South Korea", "Thailand"],
    correct: 1,
  };

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    if (index === question.correct) {
      setTimeout(() => {
        navigate("/results");
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-culture p-6">
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
              <button className="w-10 h-10 rounded-full bg-card hover:bg-card/80 flex items-center justify-center shadow-soft transition-all hover:scale-110">
                <Volume2 className="w-5 h-5 text-foreground" />
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
            <p className="text-lg font-bold text-foreground">
              "Look carefully at the flag! Think about what you've learned about different countries."
            </p>
          </div>
        </div>

        {/* Question card */}
        <div className="bg-card rounded-2xl p-8 shadow-playful border-4 border-primary/20 mb-6">
          <h2 className="text-3xl font-black text-center text-foreground mb-8">
            {question.text}
          </h2>

          {/* Flag display */}
          <div className="text-9xl text-center mb-8 animate-scale-in">
            🇯🇵
          </div>

          {/* Answer options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`
                  p-6 rounded-xl font-bold text-xl transition-all
                  ${selectedAnswer === null
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
          <Button variant="outline" size="lg">
            <Lightbulb className="w-5 h-5" />
            Hint
          </Button>
          <Button variant="outline" size="lg">
            <RotateCcw className="w-5 h-5" />
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Lesson;
