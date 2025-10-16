import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ProgressBar";
import { 
  BarChart3, 
  Clock, 
  Shield, 
  TrendingUp, 
  BookOpen,
  Calculator,
  Globe,
  Map
} from "lucide-react";
import avatarSadra from "@/assets/avatar-sadra.png";

const ParentDashboard = () => {
  const navigate = useNavigate();

  const subjects = [
    { name: "Reading", icon: BookOpen, progress: 65, color: "bg-reading" },
    { name: "Math", icon: Calculator, progress: 40, color: "bg-math" },
    { name: "Culture", icon: Globe, progress: 80, color: "bg-culture" },
    { name: "Geography", icon: Map, progress: 30, color: "bg-geography" },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-black text-foreground">Parent Dashboard</h1>
              <p className="text-lg text-muted-foreground">Monitor your child's learning progress</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/")}>
              Exit
            </Button>
          </div>
        </div>

        {/* Child profile card */}
        <div className="bg-card rounded-2xl p-6 shadow-soft border border-border mb-8">
          <div className="flex items-center gap-4">
            <img
              src={avatarSadra}
              alt="Sadra"
              className="w-20 h-20 rounded-full border-4 border-primary"
            />
            <div>
              <h2 className="text-2xl font-bold text-foreground">Sadra's Progress</h2>
              <p className="text-muted-foreground">Active for 7 days • 245 stars earned</p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Lessons</p>
                <p className="text-2xl font-bold text-foreground">28</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time Spent</p>
                <p className="text-2xl font-bold text-foreground">4.5 hrs</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className="text-2xl font-bold text-foreground">87%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subject progress */}
        <div className="bg-card rounded-2xl p-8 shadow-soft border border-border mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">Subject Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjects.map((subject) => (
              <div key={subject.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${subject.color} rounded-lg flex items-center justify-center`}>
                      <subject.icon className="w-5 h-5 text-foreground" />
                    </div>
                    <span className="font-bold text-foreground">{subject.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">
                    {subject.progress}%
                  </span>
                </div>
                <ProgressBar value={subject.progress} />
              </div>
            ))}
          </div>
        </div>

        {/* Safety & insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-foreground">Safety</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Daily time limit</span>
                <span className="font-semibold text-foreground">1 hour</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Content filtering</span>
                <span className="font-semibold text-secondary-foreground">Active ✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Age-appropriate</span>
                <span className="font-semibold text-secondary-foreground">Enabled ✓</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
            <h3 className="text-xl font-bold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span className="text-muted-foreground">Completed Culture lesson</span>
                <span className="ml-auto text-xs text-muted-foreground">Today</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Earned Culture Explorer badge</span>
                <span className="ml-auto text-xs text-muted-foreground">Today</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-muted rounded-full"></div>
                <span className="text-muted-foreground">Completed Reading lesson</span>
                <span className="ml-auto text-xs text-muted-foreground">Yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
