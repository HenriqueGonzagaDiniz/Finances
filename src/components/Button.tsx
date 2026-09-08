import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  fullWidth?: boolean;
  icon?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  fullWidth = true,
  icon,
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const base =
    'h-[56px] rounded-xl font-headline-md text-body-lg transition-all active:scale-[0.98] flex items-center justify-center gap-sm';

  const variants = {
    primary:
      'bg-primary text-on-primary shadow-[0_8px_24px_rgba(13,99,27,0.15)] hover:opacity-90',
    secondary:
      'bg-primary-container text-on-primary hover:bg-primary transition-all shadow-lg shadow-primary-container/20',
    tertiary: 'text-on-surface-variant font-label-md text-label-md py-2 hover:text-primary',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {children}
      {icon && <span className="material-symbols-outlined">{icon}</span>}
    </button>
  );
}
