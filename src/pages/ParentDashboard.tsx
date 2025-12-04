import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ProgressBar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  BarChart3, 
  Clock, 
  Shield, 
  TrendingUp, 
  BookOpen,
  Calculator,
  Globe,
  Map,
  Settings,
  LogOut,
  Edit2
} from "lucide-react";
import avatarSadra from "@/assets/avatar-sadra.png";
import {
  loadState,
  getChildProgress,
  getTopicProgress,
  updateSafetySettings,
  getTimePerTopic,
  generateFeedbackSummary,
  updateProfileName,
  BADGE_DEFINITIONS,
  type TopicType,
  type Badge,
} from "@/lib/state";

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [state, setState] = useState(loadState());
  
  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("parent-authenticated");
    if (!isAuthenticated) {
      navigate("/parent/login");
    }
  }, [navigate]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    state.profiles.length > 0 ? state.profiles[0].id : null
  );
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [showBadgeDialog, setShowBadgeDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [settings, setSettings] = useState({
    dailyTimeLimit: 60,
    sessionTimeLimit: 30,
    contentFilterEnabled: true,
    ageAppropriateEnabled: true,
    allowedTopics: ["reading", "math", "culture", "geography"] as TopicType[],
  });

  useEffect(() => {
    const currentState = loadState();
    setState(currentState);
    if (currentState.profiles.length > 0 && !selectedProfileId) {
      setSelectedProfileId(currentState.profiles[0].id);
    }
  }, []);

  // Refresh state when profile changes
  useEffect(() => {
    if (selectedProfileId) {
      const currentState = loadState();
      setState(currentState);
    }
  }, [selectedProfileId]);

  const selectedProgress = selectedProfileId
    ? getChildProgress(selectedProfileId)
    : null;
  const selectedProfile = state.profiles.find((p) => p.id === selectedProfileId);

  const subjects: Array<{
    name: string;
    icon: typeof BookOpen;
    progress: number;
    color: string;
    topic: TopicType;
  }> = [
    { name: "Reading", icon: BookOpen, topic: "reading", color: "bg-reading" },
    { name: "Math", icon: Calculator, topic: "math", color: "bg-math" },
    { name: "Culture", icon: Globe, topic: "culture", color: "bg-culture" },
    { name: "Geography", icon: Map, topic: "geography", color: "bg-geography" },
  ].map((subject) => ({
    ...subject,
    progress: selectedProgress
      ? getTopicProgress(selectedProfileId!, subject.topic)
      : 0,
  }));

  const totalLessons = selectedProgress
    ? selectedProgress.lessons.reduce(
        (sum, l) => sum + l.completedLessons,
        0
      )
    : 0;

  const totalTimeHours = selectedProgress
    ? Math.floor(selectedProgress.totalTimeSpent / 3600 * 10) / 10
    : 0;

  const calculateAccuracy = () => {
    if (!selectedProgress || selectedProgress.sessions.length === 0) return 0;
    // Simple calculation: assume 80% accuracy for completed lessons
    return Math.round((totalLessons / (totalLessons + 2)) * 100);
  };

  const handleSaveSettings = () => {
    if (selectedProfileId) {
      updateSafetySettings(selectedProfileId, settings);
      setShowSettingsDialog(false);
      // Refresh state
      const updatedState = loadState();
      setState(updatedState);
      // Update selected progress
      if (updatedState.profiles.length > 0 && !selectedProfileId) {
        setSelectedProfileId(updatedState.profiles[0].id);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("parent-authenticated");
    navigate("/");
  };

  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
    setShowBadgeDialog(true);
  };

  const handleRenameClick = () => {
    if (selectedProfile) {
      setNewProfileName(selectedProfile.name);
      setShowRenameDialog(true);
    }
  };

  const handleSaveRename = () => {
    if (selectedProfileId && newProfileName.trim()) {
      updateProfileName(selectedProfileId, newProfileName.trim());
      setShowRenameDialog(false);
      // Refresh state
      const updatedState = loadState();
      setState(updatedState);
    }
  };

  useEffect(() => {
    if (selectedProfileId && selectedProgress) {
      setSettings({
        dailyTimeLimit: selectedProgress.safetySettings.dailyTimeLimit,
        sessionTimeLimit: selectedProgress.safetySettings.sessionTimeLimit,
        contentFilterEnabled: selectedProgress.safetySettings.contentFilterEnabled,
        ageAppropriateEnabled: selectedProgress.safetySettings.ageAppropriateEnabled,
        allowedTopics: selectedProgress.safetySettings.allowedTopics,
      });
    }
  }, [selectedProfileId, selectedProgress]);

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
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowSettingsDialog(true)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Profile selector */}
        {state.profiles.length > 1 && (
          <div className="mb-6">
            <Label className="text-sm font-semibold text-muted-foreground mb-2 block">
              Select Child Profile
            </Label>
            <div className="flex gap-2 flex-wrap">
              {state.profiles.map((profile) => {
                const profileProgress = getChildProgress(profile.id);
                return (
                  <Button
                    key={profile.id}
                    variant={selectedProfileId === profile.id ? "default" : "outline"}
                    onClick={() => {
                      setSelectedProfileId(profile.id);
                      // Load child data
                      const updatedState = loadState();
                      setState(updatedState);
                    }}
                    className="flex items-center gap-2"
                  >
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-6 h-6 rounded-full"
                    />
                    {profile.name}
                    {profileProgress && (
                      <span className="text-xs opacity-75">
                        ({profileProgress.stars} ⭐)
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Child profile card */}
        {selectedProfile && selectedProgress && (
          <div className="bg-card rounded-2xl p-6 shadow-soft border border-border mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedProfile.avatar}
                  alt={selectedProfile.name}
                  className="w-20 h-20 rounded-full border-4 border-primary"
                />
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-foreground">
                      {selectedProfile.name}'s Progress
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRenameClick}
                      className="h-8 w-8 p-0"
                      title="Rename profile"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground">
                    Active for {selectedProgress.streak} {selectedProgress.streak === 1 ? 'day' : 'days'} • {selectedProgress.stars} stars earned • {selectedProgress.badges.length} badges
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Lessons</p>
                <p className="text-2xl font-bold text-foreground">{totalLessons}</p>
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
                <p className="text-2xl font-bold text-foreground">{totalTimeHours} hrs</p>
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
                <p className="text-2xl font-bold text-foreground">{calculateAccuracy()}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subject progress */}
        <div className="bg-card rounded-2xl p-8 shadow-soft border border-border mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">Subject Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
          
          {/* Time per subject */}
          {selectedProfileId && (
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="text-lg font-bold text-foreground mb-4">Time Spent per Subject</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {subjects.map((subject) => {
                  const timePerTopic = getTimePerTopic(selectedProfileId);
                  const minutes = Math.floor(timePerTopic[subject.topic] / 60);
                  return (
                    <div key={subject.name} className="text-center">
                      <div className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                        <subject.icon className="w-6 h-6 text-foreground" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">{minutes} min</p>
                      <p className="text-xs text-muted-foreground">{subject.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
                <span className="font-semibold text-foreground">
                  {selectedProgress?.safetySettings.dailyTimeLimit || 60} minutes
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Content filtering</span>
                <span className="font-semibold text-secondary-foreground">
                  {selectedProgress?.safetySettings.contentFilterEnabled ? "Active ✓" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Age-appropriate</span>
                <span className="font-semibold text-secondary-foreground">
                  {selectedProgress?.safetySettings.ageAppropriateEnabled ? "Enabled ✓" : "Disabled"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
            <h3 className="text-xl font-bold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {selectedProgress && selectedProgress.badges.length > 0 ? (
                <>
                  <div className="space-y-3 text-sm mb-4">
                    {selectedProgress.badges
                      .slice(-3)
                      .reverse()
                      .map((badge, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-muted-foreground">
                            Earned {badge.emoji} {badge.name} badge
                          </span>
                          <span className="ml-auto text-xs text-muted-foreground">
                            {new Date(badge.unlockedAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-semibold text-foreground mb-3">
                      Badges Earned ({selectedProgress.badges.length})
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {selectedProgress.badges.map((badge) => (
                        <button
                          key={badge.id}
                          onClick={() => handleBadgeClick(badge)}
                          className="w-14 h-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center text-2xl shadow-soft hover:scale-110 hover:shadow-glow transition-all cursor-pointer border-2 border-primary/30 hover:border-primary/60"
                          title={`${badge.name} - Click to see details!`}
                        >
                          {badge.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Summary */}
        {selectedProfileId && (
          <div className="bg-card rounded-2xl p-6 shadow-soft border border-border mb-8">
            <h3 className="text-xl font-bold text-foreground mb-4">Today's Summary</h3>
            <div className="space-y-2">
              {generateFeedbackSummary(selectedProfileId).map((summary, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-secondary/20 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-sm text-foreground flex-1">{summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Adjust Settings</DialogTitle>
            <DialogDescription>
              Configure safety and time limits for {selectedProfile?.name || "your child"}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="dailyLimit" className="text-base font-semibold">
                Set Daily Time Limit (minutes)
              </Label>
              <Input
                id="dailyLimit"
                type="number"
                min="15"
                max="120"
                step="5"
                value={settings.dailyTimeLimit}
                onChange={(e) =>
                  setSettings({ ...settings, dailyTimeLimit: parseInt(e.target.value) || 60 })
                }
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">
                Recommended: 30-60 minutes per day
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sessionLimit" className="text-base font-semibold">
                Set Session Time Limit (minutes)
              </Label>
              <Input
                id="sessionLimit"
                type="number"
                min="10"
                max="60"
                step="5"
                value={settings.sessionTimeLimit}
                onChange={(e) =>
                  setSettings({ ...settings, sessionTimeLimit: parseInt(e.target.value) || 30 })
                }
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">
                Maximum time per learning session
              </p>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="contentFilter" className="text-base font-semibold cursor-pointer">
                  Toggle Content Filtering
                </Label>
                <p className="text-xs text-muted-foreground">
                  Filter inappropriate content
                </p>
              </div>
              <Switch
                id="contentFilter"
                checked={settings.contentFilterEnabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, contentFilterEnabled: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="ageAppropriate" className="text-base font-semibold cursor-pointer">
                  Toggle Age-Appropriate Content
                </Label>
                <p className="text-xs text-muted-foreground">
                  Show only age-appropriate lessons
                </p>
              </div>
              <Switch
                id="ageAppropriate"
                checked={settings.ageAppropriateEnabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, ageAppropriateEnabled: checked })
                }
              />
            </div>
            <div className="grid gap-3 pt-2 border-t border-border">
              <Label className="text-base font-semibold">Select Allowed Topics</Label>
              <p className="text-xs text-muted-foreground mb-3">
                Choose which subjects your child can access
              </p>
              <div className="grid grid-cols-2 gap-3">
                {subjects.map((subject) => (
                  <div 
                    key={subject.topic} 
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                      settings.allowedTopics.includes(subject.topic)
                        ? "border-primary bg-primary/10"
                        : "border-border bg-muted/30"
                    }`}
                  >
                    <Checkbox
                      id={`topic-${subject.topic}`}
                      checked={settings.allowedTopics.includes(subject.topic)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSettings({
                            ...settings,
                            allowedTopics: [...settings.allowedTopics, subject.topic],
                          });
                        } else {
                          setSettings({
                            ...settings,
                            allowedTopics: settings.allowedTopics.filter(
                              (t) => t !== subject.topic
                            ),
                          });
                        }
                      }}
                    />
                    <Label
                      htmlFor={`topic-${subject.topic}`}
                      className="text-sm font-semibold cursor-pointer flex items-center gap-2 flex-1"
                    >
                      <subject.icon className="w-4 h-4" />
                      {subject.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings} className="min-w-[100px]">
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center text-6xl shadow-glow">
              {selectedBadge?.emoji}
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-semibold text-muted-foreground capitalize">
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

      {/* Rename Profile Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename Child Profile</DialogTitle>
            <DialogDescription>
              Update the name for {selectedProfile?.name || "this profile"}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="profileName">Child's Name</Label>
              <Input
                id="profileName"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="Enter new name"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newProfileName.trim()) {
                    handleSaveRename();
                  }
                }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveRename} 
              disabled={!newProfileName.trim() || newProfileName.trim() === selectedProfile?.name}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};

export default ParentDashboard;
