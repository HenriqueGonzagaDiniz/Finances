import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface OnboardingLayoutProps {
  currentStep: number;
  totalSteps: number;
  children: ReactNode;
}

export function OnboardingLayout({ currentStep, totalSteps, children }: OnboardingLayoutProps) {
  const navigate = useNavigate();
  const progressPercent = ((currentStep - 1) / totalSteps) * 100;

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <div className="w-full px-container-margin pt-6 pb-2">
        <div className="flex justify-between items-center mb-3">
          {currentStep > 1 ? (
            <button
              onClick={() => navigate(-1)}
              className="text-on-surface-variant hover:bg-surface-container-low transition-colors p-2 rounded-full active:scale-95 duration-200"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          ) : (
            <div className="w-10" />
          )}
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              savings
            </span>
            <span className="font-headline-md text-headline-md font-bold text-primary">Finances</span>
          </div>
          <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-label-sm">
            Passo {currentStep} de {totalSteps}
          </div>
        </div>
        <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      <main className="flex-1 flex flex-col px-container-margin max-w-md mx-auto w-full pb-xl">
        {children}
      </main>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[40%] bg-secondary-fixed/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[50%] bg-primary-fixed/5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
