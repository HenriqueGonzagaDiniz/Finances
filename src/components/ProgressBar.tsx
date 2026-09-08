interface ProgressBarProps {
  value: number;
  className?: string;
  tint?: 'primary' | 'tertiary' | 'error';
}

const tints = {
  primary: 'bg-primary',
  tertiary: 'bg-tertiary',
  error: 'bg-error',
} as const;

export function ProgressBar({ value, className = '', tint = 'primary' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={`w-full bg-surface-container-low h-2 rounded-full overflow-hidden ${className}`}>
      <div
        className={`${tints[tint]} h-full rounded-full transition-all duration-700 ease-out`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
