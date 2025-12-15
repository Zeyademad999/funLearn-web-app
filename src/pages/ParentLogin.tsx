import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Shield, Home, HelpCircle } from "lucide-react";

const PARENT_PASSWORD = "parent123"; // Simple password for demo purposes

const ParentLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PARENT_PASSWORD) {
      // Store parent session in localStorage
      localStorage.setItem("parent-authenticated", "true");
      navigate("/parent");
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        {/* Breadcrumb Navigation - Nielsen #1: Visibility of system status */}
        <div className="absolute top-6 left-6">
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
                <BreadcrumbPage>Parent Login</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="max-w-md w-full bg-card rounded-2xl p-8 shadow-soft border border-border">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-3xl font-black text-foreground">Parent Access</h1>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Parents can monitor their child's learning progress, adjust settings, and view detailed statistics.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-muted-foreground">Enter password to access the dashboard</p>
          </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter parent password"
              className={error ? "border-destructive" : ""}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg">
            Access Dashboard
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-sm"
          >
            ← Back to Home
          </Button>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            Demo password: <code className="bg-background px-2 py-1 rounded">parent123</code>
          </p>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
};

export default ParentLogin;



