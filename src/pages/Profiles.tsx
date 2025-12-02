import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Star } from "lucide-react";
import avatarSadra from "@/assets/avatar-sadra.png";
import lumaMascot from "@/assets/luma-mascot.png";
import {
  loadState,
  setCurrentProfile,
  getChildProgress,
  createProfile,
} from "@/lib/state";

const Profiles = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState(loadState().profiles);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");

  // Initialize with default Sadra profile if none exists
  useEffect(() => {
    const state = loadState();
    if (state.profiles.length === 0) {
      // Create default Sadra profile
      const sadraProfile = createProfile("Sadra", avatarSadra);
      setProfiles([sadraProfile]);
    } else {
      setProfiles(state.profiles);
    }
  }, []);

  const handleProfileSelect = (profileId: string) => {
    setCurrentProfile(profileId);
    navigate("/dashboard");
  };

  const handleCreateProfile = () => {
    if (newProfileName.trim()) {
      const newProfile = createProfile(newProfileName.trim(), avatarSadra);
      setProfiles([...profiles, newProfile]);
      setNewProfileName("");
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary p-8">
      {/* Luma greeting */}
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <img 
          src={lumaMascot} 
          alt="Luma" 
          className="w-32 h-auto mx-auto mb-4 animate-bounce-gentle"
        />
        <h1 className="text-4xl font-black text-foreground mb-2">
          Welcome back, explorer! 🌟
        </h1>
        <p className="text-xl font-semibold text-foreground/70">
          Who's Learning Today?
        </p>
      </div>

      {/* Profile cards */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => {
          const progress = getChildProgress(profile.id);
          const stars = progress?.stars || 0;
          
          return (
            <button
              key={profile.id}
              onClick={() => handleProfileSelect(profile.id)}
              className="bg-card rounded-2xl p-8 shadow-playful hover:shadow-glow hover:scale-105 transition-all active:scale-95 border-4 border-primary/20"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-32 h-32 rounded-full border-4 border-primary shadow-soft"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-muted rounded-full px-3 py-1 flex items-center gap-1 shadow-soft border-2 border-background">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="font-bold text-sm">{stars}</span>
                  </div>
                </div>
                <h2 className="text-2xl font-black text-foreground">{profile.name}</h2>
              </div>
            </button>
          );
        })}

        {/* Add new profile button */}
        <button
          onClick={() => setIsDialogOpen(true)}
          className="bg-card/50 border-4 border-dashed border-primary/30 rounded-2xl p-8 hover:border-primary hover:bg-card/80 hover:scale-105 transition-all active:scale-95 flex flex-col items-center justify-center space-y-4 min-h-[240px]"
        >
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <Plus className="w-10 h-10 text-primary" />
          </div>
          <span className="text-xl font-bold text-primary">New Profile</span>
        </button>
      </div>

      {/* Create Profile Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Profile</DialogTitle>
            <DialogDescription>
              Enter a name for the new learner profile.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="Enter name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateProfile();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProfile} disabled={!newProfileName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Back button */}
      <div className="max-w-4xl mx-auto mt-12 text-center">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default Profiles;
