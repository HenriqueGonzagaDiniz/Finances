interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-xl text-center">
      <span
        className="material-symbols-outlined text-primary-container text-[64px]"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {icon}
      </span>
      <h3 className="font-headline-md text-headline-md text-on-surface mt-md">{title}</h3>
      {description && (
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs max-w-[280px]">
          {description}
        </p>
      )}
    </div>
  );
}
