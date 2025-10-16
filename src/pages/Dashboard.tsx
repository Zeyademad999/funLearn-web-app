import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LessonBubble } from "@/components/LessonBubble";
import { ProgressBar } from "@/components/ProgressBar";
import { BookOpen, Calculator, Globe, Map, Award, Flame, Star } from "lucide-react";
import avatarSadra from "@/assets/avatar-sadra.png";
import lumaMascot from "@/assets/luma-mascot.png";

const Dashboard = () => {
  const navigate = useNavigate();

  const lessons = [
    { title: "Reading", icon: BookOpen, color: "reading" as const, progress: 65, locked: false },
    { title: "Math", icon: Calculator, color: "math" as const, progress: 40, locked: false },
    { title: "Culture", icon: Globe, color: "culture" as const, progress: 80, locked: false },
    { title: "Geography", icon: Map, color: "geography" as const, progress: 30, locked: false },
  ];

  const badges = ["🎨", "📚", "🌍", "⭐", "🏆"];

  return (
    <div className="min-h-screen bg-gradient-primary p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-card rounded-2xl p-6 shadow-playful border-4 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={avatarSadra}
                alt="Sadra"
                className="w-16 h-16 rounded-full border-4 border-primary shadow-soft"
              />
              <div>
                <h1 className="text-3xl font-black text-foreground">Hi Sadra! 👋</h1>
                <p className="text-muted-foreground font-semibold">Let's learn something amazing today!</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2 shadow-soft">
                <Star className="w-6 h-6 fill-accent text-accent" />
                <span className="text-xl font-black">245</span>
              </div>
              <div className="flex items-center gap-2 bg-accent/20 rounded-xl px-4 py-2 shadow-soft">
                <Flame className="w-6 h-6 text-accent" />
                <span className="text-xl font-black">7 days</span>
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
              <LessonBubble
                title="Reading"
                icon={BookOpen}
                color="reading"
                progress={45}
                onClick={() => navigate("/lesson?topic=reading")}
              />
              <LessonBubble
                title="Math"
                icon={Calculator}
                color="math"
                progress={30}
                onClick={() => navigate("/lesson?topic=math")}
              />
              <LessonBubble
                title="Culture"
                icon={Globe}
                color="culture"
                progress={60}
                onClick={() => navigate("/lesson?topic=culture")}
              />
              <LessonBubble
                title="Geography"
                icon={Map}
                color="geography"
                progress={15}
                onClick={() => navigate("/lesson?topic=geography")}
              />
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
                  <span>7/10 lessons</span>
                </div>
                <ProgressBar value={70} showLabel />
              </div>
            </div>
          </div>

          {/* Badges card */}
          <div className="bg-card rounded-2xl p-6 shadow-playful border-4 border-primary/20">
            <h3 className="text-xl font-black text-foreground mb-4">
              Badges Earned
            </h3>
            <div className="flex gap-3 flex-wrap">
              {badges.map((badge, i) => (
                <div
                  key={i}
                  className="w-14 h-14 bg-gradient-warm rounded-xl flex items-center justify-center text-2xl shadow-soft hover:scale-110 transition-transform cursor-pointer"
                >
                  {badge}
                </div>
              ))}
            </div>
          </div>

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
