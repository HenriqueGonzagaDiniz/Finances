import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinancial } from '@/hooks/useFinancial';

export function Welcome() {
  const navigate = useNavigate();
  const { settings } = useFinancial();

  useEffect(() => {
    if (settings.onboardingCompleted) {
      navigate('/dashboard', { replace: true });
    }
  }, [settings.onboardingCompleted, navigate]);

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col items-center justify-between overflow-x-hidden">
      <div className="h-16 w-full" />
      <main className="flex-1 flex flex-col items-center justify-center px-container-margin w-full max-w-md text-center">
        <div className="mb-xl" style={{ animation: 'fadeIn 0.8s ease-out forwards' }}>
          <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto">
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl" />
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontSize: 120, fontVariationSettings: "'FILL' 1" }}
              >
                savings
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-md" style={{ animation: 'fadeIn 0.8s ease-out 0.3s both' }}>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface tracking-tight leading-tight">
            Vamos descobrir o melhor equilíbrio entre gastar e economizar.
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[280px] mx-auto opacity-80">
            Uma jornada mindful para organizar sua vida financeira com clareza e paz.
          </p>
        </div>
        <div className="flex gap-2 mt-lg" style={{ animation: 'fadeIn 0.8s ease-out 0.4s both' }}>
          <div className="w-8 h-2 rounded-full bg-primary-container" />
          <div className="w-2 h-2 rounded-full bg-outline-variant" />
          <div className="w-2 h-2 rounded-full bg-outline-variant" />
        </div>
      </main>
      <footer
        className="w-full px-container-margin pb-xl pt-lg max-w-md"
        style={{ animation: 'fadeIn 0.8s ease-out 0.5s both' }}
      >
        <button
          onClick={() => navigate('/onboarding/income')}
          className="w-full h-[56px] bg-primary-container text-on-primary font-bold text-body-lg rounded-xl shadow-[0_8px_24px_rgba(13,99,27,0.15)] hover:bg-primary transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          Começar
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </footer>
      <div className="fixed -bottom-24 -left-24 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -top-12 -right-12 w-48 h-48 bg-tertiary-fixed-dim/20 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
