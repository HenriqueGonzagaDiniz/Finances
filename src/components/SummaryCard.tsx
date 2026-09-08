import type { ReactNode } from 'react';

interface SummaryCardProps {
  label: string;
  value: string;
  icon: string;
  borderColor?: string;
  className?: string;
  children?: ReactNode;
}

export function SummaryCard({
  label,
  value,
  icon,
  borderColor = 'border-secondary',
  className = '',
  children,
}: SummaryCardProps) {
  return (
    <div
      className={`bg-surface-container-lowest rounded-xl p-sm ambient-shadow flex flex-col gap-xs border-l-4 ${borderColor} ${className}`}
    >
      <span className="font-label-sm text-on-surface-variant flex items-center gap-xs">
        <span className="material-symbols-outlined text-[16px]">{icon}</span>
        {label}
      </span>
      <span className="font-headline-md text-headline-md text-on-surface">{value}</span>
      {children}
    </div>
  );
}
