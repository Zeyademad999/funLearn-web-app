import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
}

export const ProgressBar = ({ 
  value, 
  max = 100, 
  className,
  showLabel = false 
}: ProgressBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn("w-full", className)}>
      <div className="relative h-4 bg-primary/20 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-warm rounded-full transition-all duration-500 ease-out shadow-soft"
          style={{ width: `${percentage}%` }}
        />
        {showLabel && (
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    </div>
  );
};
