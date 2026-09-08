import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'elevated';
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  const variants = {
    default: 'bg-white rounded-xl shadow-tonal border border-surface-container',
    primary: 'bg-primary-container text-on-primary-container rounded-xl p-md ambient-shadow',
    secondary: 'bg-secondary-container rounded-xl p-sm',
    elevated: 'bg-surface-container-lowest rounded-xl p-md ambient-shadow',
  };

  return <div className={`${variants[variant]} ${className}`}>{children}</div>;
}
