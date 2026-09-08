interface ProgressBarProps {
  value: number;
  className?: string;
}

export function ProgressBar({ value, className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={`w-full bg-surface-container-low h-2 rounded-full overflow-hidden ${className}`}>
      <div
        className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
