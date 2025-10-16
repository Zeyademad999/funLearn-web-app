import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Sparkles } from "lucide-react";
import lumaMascot from "@/assets/luma-mascot.png";

const Results = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-warm p-6 flex items-center justify-center relative overflow-hidden">
      {/* Animated confetti background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl animate-float">⭐</div>
        <div className="absolute top-20 right-20 text-5xl animate-bounce-gentle">🎉</div>
        <div className="absolute bottom-20 left-20 text-6xl animate-wiggle">🏆</div>
        <div className="absolute bottom-10 right-10 text-5xl animate-float">✨</div>
        <div className="absolute top-1/2 left-1/4 text-4xl animate-bounce-gentle">🌟</div>
        <div className="absolute top-1/3 right-1/4 text-5xl animate-float">🎊</div>
      </div>

      {/* Main content */}
      <div className="max-w-2xl w-full relative z-10 animate-scale-in">
        {/* Luma celebration */}
        <div className="text-center mb-8">
          <img
            src={lumaMascot}
            alt="Luma celebrating"
            className="w-48 h-auto mx-auto mb-6 animate-bounce-gentle drop-shadow-2xl"
          />
        </div>

        {/* Results card */}
        <div className="bg-card rounded-3xl p-12 shadow-playful border-4 border-accent/30 text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-foreground">
              Great Job, Sadra! 🎉
            </h1>
            <p className="text-2xl font-bold text-muted-foreground">
              You're becoming a culture expert!
            </p>
          </div>

          {/* Badge earned */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow animate-scale-in">
              <Trophy className="w-16 h-16 text-accent" />
            </div>
            <div className="bg-accent/20 rounded-xl px-6 py-3 border-2 border-accent/50">
              <p className="text-xl font-black text-accent">New Badge Unlocked!</p>
              <p className="text-lg font-semibold">🌍 Culture Explorer</p>
            </div>
          </div>

          {/* Stars earned */}
          <div className="flex justify-center items-center gap-3">
            <Star className="w-10 h-10 fill-muted text-muted animate-wiggle" />
            <span className="text-4xl font-black text-foreground">+25 Stars</span>
            <Star className="w-10 h-10 fill-muted text-muted animate-wiggle" />
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-4">
            <Button
              variant="playful"
              size="lg"
              className="w-full"
              onClick={() => navigate("/lesson")}
            >
              <Sparkles className="w-5 h-5" />
              Next Lesson
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => navigate("/dashboard")}
            >
              Back to Home
            </Button>
          </div>
        </div>

        {/* Encouraging message from Luma */}
        <div className="mt-6 bg-secondary/80 rounded-2xl p-6 shadow-soft text-center backdrop-blur-sm">
          <p className="text-lg font-bold text-secondary-foreground">
            💬 "You're doing amazing! Keep exploring and learning new things!"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Results;
