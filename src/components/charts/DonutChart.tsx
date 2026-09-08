interface DonutSlice {
  label: string;
  value: number;
  color?: string;
}

interface DonutChartProps {
  data: DonutSlice[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerSub?: string;
}

const PALETTE = [
  '#2e7d32',
  '#286b33',
  '#abf4ac',
  '#0d631b',
  '#4d5950',
  '#657167',
  '#88d982',
  '#90d792',
  '#bdcabe',
  '#1b6d24',
];

export function DonutChart({
  data,
  size = 200,
  strokeWidth = 32,
  centerLabel,
  centerSub,
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((s, d) => s + d.value, 0);

  if (total <= 0) {
    return (
      <div
        className="flex items-center justify-center text-on-surface-variant"
        style={{ width: size, height: size }}
      >
        <span className="font-label-sm text-label-sm">Sem dados</span>
      </div>
    );
  }

  let offset = 0;
  const slices = data.map((d, i) => {
    const fraction = d.value / total;
    const dash = fraction * circumference;
    const slice = { ...d, dash, offset, color: d.color || PALETTE[i % PALETTE.length] };
    offset += dash;
    return slice;
  });

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#eceeec"
          strokeWidth={strokeWidth}
        />
        {slices.map((s) => (
          <circle
            key={s.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={s.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${s.dash} ${circumference - s.dash}`}
            strokeDashoffset={s.offset === 0 ? 0 : -s.offset}
            strokeLinecap="butt"
          />
        ))}
      </svg>
      {(centerLabel || centerSub) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {centerLabel && (
            <span className="font-headline-md text-headline-md text-on-surface">{centerLabel}</span>
          )}
          {centerSub && (
            <span className="font-label-sm text-label-sm text-on-surface-variant">{centerSub}</span>
          )}
        </div>
      )}
    </div>
  );
}