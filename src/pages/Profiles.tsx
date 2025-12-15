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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Plus, Star, Home, HelpCircle, AlertCircle } from "lucide-react";
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
  const [nameError, setNameError] = useState<string>("");

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

  // Nielsen #5: Error prevention - Validate profile name
  const handleCreateProfile = () => {
    const trimmedName = newProfileName.trim();
    
    if (!trimmedName) {
      setNameError("Please enter a name");
      return;
    }
    
    if (trimmedName.length < 2) {
      setNameError("Name must be at least 2 characters");
      return;
    }
    
    if (trimmedName.length > 20) {
      setNameError("Name must be 20 characters or less");
      return;
    }
    
    // Check for duplicate names
    if (profiles.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      setNameError("A profile with this name already exists");
      return;
    }
    
    const newProfile = createProfile(trimmedName, avatarSadra);
    setProfiles([...profiles, newProfile]);
    setNewProfileName("");
    setNameError("");
    setIsDialogOpen(false);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-secondary p-8">
        {/* Breadcrumb Navigation - Nielsen #1: Visibility of system status */}
        <div className="max-w-4xl mx-auto mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <button onClick={() => navigate("/")} className="flex items-center gap-1 hover:text-primary">
                    <Home className="w-4 h-4" />
                    Home
                  </button>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Select Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Luma greeting - Gestalt Proximity: Group greeting elements */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <img 
            src={lumaMascot} 
            alt="Luma" 
            className="w-32 h-auto mx-auto mb-4 animate-bounce-gentle"
          />
          <h1 className="text-4xl font-black text-foreground mb-2">
            Welcome back, explorer! 🌟
          </h1>
          <div className="flex items-center justify-center gap-2">
            <p className="text-xl font-semibold text-foreground/70">
              Who's Learning Today?
            </p>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Select your profile to continue learning, or create a new one!</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

      {/* Profile cards - Gestalt Similarity: Consistent card styling */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => {
          const progress = getChildProgress(profile.id);
          const stars = progress?.stars || 0;
          
          return (
            <Tooltip key={profile.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleProfileSelect(profile.id)}
                  className="bg-card rounded-2xl p-8 shadow-playful hover:shadow-glow hover:scale-105 transition-all active:scale-95 border-4 border-primary/20 w-full"
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
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to start learning as {profile.name}</p>
              </TooltipContent>
            </Tooltip>
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
                onChange={(e) => {
                  setNewProfileName(e.target.value);
                  // Clear error when user types
                  if (nameError) {
                    setNameError("");
                  }
                }}
                placeholder="Enter name"
                className={nameError ? "border-destructive" : ""}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateProfile();
                  }
                }}
              />
              {nameError && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span>{nameError}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Name must be 2-20 characters and unique
              </p>
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
    </TooltipProvider>
  );
};

export default Profiles;
