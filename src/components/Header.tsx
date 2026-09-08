interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  step?: { current: number; total: number };
}

export function Header({ title, subtitle, onBack, rightAction, step }: HeaderProps) {
  return (
    <header className="w-full top-0 sticky z-50 bg-surface flex items-center justify-between px-container-margin h-16">
      <div className="flex items-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors active:scale-95 duration-200"
          >
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
        )}
        <h1 className="font-headline-md text-headline-md font-bold text-primary">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        {subtitle && (
          <span className="font-label-sm text-label-sm text-on-surface-variant">{subtitle}</span>
        )}
        {step && (
          <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-label-sm">
            Passo {step.current} de {step.total}
          </div>
        )}
        {rightAction}
      </div>
    </header>
  );
}
