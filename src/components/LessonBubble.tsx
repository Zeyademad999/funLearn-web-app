import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonBubbleProps {
  title: string;
  icon: LucideIcon;
  color: "reading" | "math" | "culture" | "geography";
  progress: number;
  locked?: boolean;
  onClick?: () => void;
}

export const LessonBubble = ({
  title,
  icon: Icon,
  color,
  progress,
  locked = false,
  onClick,
}: LessonBubbleProps) => {
  const colorClasses = {
    reading: "bg-reading border-primary",
    math: "bg-math border-muted",
    culture: "bg-culture border-accent",
    geography: "bg-geography border-secondary",
  };

  return (
    <button
      onClick={onClick}
      disabled={locked}
      className={cn(
        "relative w-32 h-32 rounded-full border-4 shadow-playful transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
        colorClasses[color],
        !locked && "hover:shadow-glow animate-bounce-gentle"
      )}
    >
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <Icon className="w-10 h-10 text-foreground" />
        <span className="text-sm font-bold text-foreground px-2">{title}</span>
      </div>
      
      {/* Progress Ring */}
      {!locked && progress > 0 && (
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-primary/20"
          />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={`${progress * 2.89} 289`}
            className="text-primary transition-all duration-500"
          />
        </svg>
      )}

      {locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/40 rounded-full backdrop-blur-sm">
          <span className="text-3xl">🔒</span>
        </div>
      )}
    </button>
  );
};
