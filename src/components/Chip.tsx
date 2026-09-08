import { type ReactNode } from 'react';

interface ChipProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'active';
}

export function Chip({ children, onClick, variant = 'default' }: ChipProps) {
  const base =
    'px-4 py-2 rounded-full font-label-md text-label-md transition-colors active:scale-95';

  const variants = {
    default: 'bg-secondary-container/50 text-on-secondary-container hover:bg-secondary-container',
    active: 'bg-primary text-on-primary',
  };

  if (!onClick) {
    return <span className={`${base} ${variants[variant]}`}>{children}</span>;
  }

  return (
    <button type="button" onClick={onClick} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  );
}
