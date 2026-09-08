interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function ProgressRing({
  value,
  size = 96,
  strokeWidth = 8,
  label,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className="text-surface-container stroke-current"
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="text-primary stroke-current"
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          r={radius}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 1s ease-out',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-label-md text-primary">{value}%</span>
      </div>
      {label && (
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">
          {label}
        </span>
      )}
    </div>
  );
}
