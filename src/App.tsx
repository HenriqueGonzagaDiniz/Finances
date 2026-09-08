import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FinancialProvider } from '@/contexts/FinancialContext';
import { OnboardingLayout } from '@/layouts/OnboardingLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Welcome } from '@/pages/Welcome';
import { Income } from '@/pages/Income';
import { Expenses } from '@/pages/Expenses';
import { Goals } from '@/pages/Goals';
import { Dashboard } from '@/pages/Dashboard';

export function App() {
  return (
    <BrowserRouter>
      <FinancialProvider>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route
            path="/onboarding/income"
            element={
              <OnboardingLayout currentStep={1} totalSteps={3}>
                <Income />
              </OnboardingLayout>
            }
          />
          <Route
            path="/onboarding/expenses"
            element={
              <OnboardingLayout currentStep={2} totalSteps={3}>
                <Expenses />
              </OnboardingLayout>
            }
          />
          <Route
            path="/onboarding/goals"
            element={
              <OnboardingLayout currentStep={3} totalSteps={3}>
                <Goals />
              </OnboardingLayout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </FinancialProvider>
    </BrowserRouter>
  );
}
