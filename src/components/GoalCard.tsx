import type { Goal } from '@/types';
import { ProgressRing } from './ProgressRing';
import { formatCurrency } from '@/utils/format';
import { calculateGoalProgress, estimateGoalMonths } from '@/utils/financial';

interface GoalCardProps {
  goal: Goal;
  monthlySaving: number;
}

export function GoalCard({ goal, monthlySaving }: GoalCardProps) {
  const progress = calculateGoalProgress(goal);
  const months = estimateGoalMonths(goal, monthlySaving);

  return (
    <div className="bg-surface-container-lowest rounded-xl p-md ambient-shadow flex items-center gap-md">
      <ProgressRing value={progress} size={96} strokeWidth={8} />
      <div className="flex-grow">
        <div className="flex items-center gap-base mb-xs">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            flight_takeoff
          </span>
          <h4 className="font-headline-md text-headline-md text-on-surface">{goal.name}</h4>
        </div>
        <p className="font-body-md text-on-surface-variant">
          {months === Infinity
            ? 'Defina uma economia mensal'
            : `Você alcançará em ${months} ${months === 1 ? 'mês' : 'meses'}!`}
        </p>
        <p className="font-label-md text-primary">
          {formatCurrency(goal.savedAmount)} / {formatCurrency(goal.targetAmount)}
        </p>
      </div>
    </div>
  );
}
