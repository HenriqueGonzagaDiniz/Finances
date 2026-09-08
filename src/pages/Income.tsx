import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinancial } from '@/hooks/useFinancial';
import { Button } from '@/components/Button';
import { CurrencyInput } from '@/components/CurrencyInput';

export function Income() {
  const { setIncome } = useFinancial();
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const handleContinue = () => {
    setIncome(value);
    navigate('/onboarding/expenses');
  };

  return (
    <div className="flex-1 flex flex-col justify-between py-md">
      <section className="flex-1 flex flex-col">
        <div className="mb-lg">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-sm">
            Qual é sua renda mensal?
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            O valor que você recebe livre por mês.
          </p>
        </div>
        <div className="space-y-md">
          <CurrencyInput
            value={value}
            onChange={setValue}
            label="Renda líquida"
            large
          />
          <div className="bg-surface-container-highest/30 rounded-xl p-md flex items-start gap-md border border-outline-variant/30">
            <div className="bg-secondary-container p-sm rounded-lg">
              <span className="material-symbols-outlined text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                info
              </span>
            </div>
            <p className="font-label-md text-label-md text-on-surface-variant leading-relaxed">
              Sua renda ajuda a definir limites saudáveis para seus gastos essenciais e estilo de vida.
            </p>
          </div>
        </div>
      </section>
      <section className="mt-xl pb-safe">
        <Button onClick={handleContinue} variant="secondary">
          Continuar
        </Button>
        <p className="text-center mt-md font-label-sm text-label-sm text-on-surface-variant px-lg">
          Você poderá ajustar este valor a qualquer momento em suas configurações.
        </p>
      </section>
    </div>
  );
}

export default Income;
