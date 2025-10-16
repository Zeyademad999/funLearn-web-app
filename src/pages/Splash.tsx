import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import lumaMascot from "@/assets/luma-mascot.png";
import floatingIcons from "@/assets/floating-icons.png";

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-primary flex flex-col items-center justify-center relative overflow-hidden p-8">
      {/* Floating background icons */}
      <div className="absolute inset-0 opacity-30">
        <img 
          src={floatingIcons} 
          alt="" 
          className="w-full h-full object-cover animate-float"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center space-y-8 max-w-2xl animate-scale-in">
        {/* Logo and mascot */}
        <div className="flex flex-col items-center space-y-4">
          <img 
            src={lumaMascot} 
            alt="Luma the star mascot" 
            className="w-64 h-auto animate-bounce-gentle drop-shadow-2xl"
          />
          <h1 className="text-6xl font-black text-primary-foreground drop-shadow-lg">
            Fun Learn
          </h1>
          <p className="text-2xl font-semibold text-primary-foreground/90">
            Learn Through Play! ✨
          </p>
        </div>

        {/* Call to action */}
        <div className="space-y-4">
          <Button
            variant="playful"
            size="xl"
            onClick={() => navigate("/profiles")}
            className="min-w-[280px] text-xl font-bold"
          >
            <Sparkles className="w-6 h-6" />
            Start Learning
          </Button>
          
          <div>
            <button
              onClick={() => navigate("/parent")}
              className="text-primary-foreground/80 hover:text-primary-foreground font-semibold text-lg underline underline-offset-4 transition-colors"
            >
              Parent Dashboard →
            </button>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute -top-10 -left-10 text-6xl animate-wiggle">⭐</div>
        <div className="absolute -bottom-10 -right-10 text-6xl animate-wiggle animation-delay-500">📚</div>
        <div className="absolute top-1/2 -right-20 text-5xl animate-float animation-delay-1000">🌍</div>
      </div>
    </div>
  );
};

export default Splash;
