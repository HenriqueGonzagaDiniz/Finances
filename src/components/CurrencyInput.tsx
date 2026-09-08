import { useState, useCallback } from 'react';
import { maskCurrencyInput } from '@/utils/format';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  label?: string;
  prefix?: string;
  large?: boolean;
}

export function CurrencyInput({
  value,
  onChange,
  placeholder = '0,00',
  label,
  prefix = 'R$',
  large = false,
}: CurrencyInputProps) {
  const [display, setDisplay] = useState(() => {
    if (value === 0) return '';
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const masked = maskCurrencyInput(e.target.value);
      setDisplay(masked);
      const raw = e.target.value.replace(/\D/g, '');
      const num = raw ? parseInt(raw, 10) / 100 : 0;
      onChange(num);
    },
    [onChange],
  );

  const inputCls = large
    ? 'w-full h-20 bg-white border-2 border-transparent focus:border-primary focus:ring-0 rounded-xl text-headline-lg-mobile font-headline-lg shadow-tonal transition-all placeholder:text-surface-dim'
    : 'w-full h-14 bg-surface-container-lowest border-2 border-surface-container-high rounded-xl px-4 font-body-md text-body-md transition-all focus:border-primary focus:bg-white';

  return (
    <div className="space-y-xs">
      {label && (
        <label className="font-label-md text-label-md text-on-surface-variant ml-1">{label}</label>
      )}
      <div className="relative">
        {prefix && (
          <span
            className={`absolute left-4 top-1/2 -translate-y-1/2 text-primary font-headline-lg-mobile ${
              large ? 'text-headline-lg-mobile' : 'text-body-md'
            }`}
          >
            {prefix}
          </span>
        )}
        <input
          type="text"
          inputMode="numeric"
          value={display}
          onChange={handleChange}
          placeholder={placeholder}
          className={inputCls + (prefix ? ' pl-16' : '')}
        />
      </div>
    </div>
  );
}
