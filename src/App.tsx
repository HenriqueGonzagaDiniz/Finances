import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FinancialProvider } from '@/contexts/FinancialContext';
import { OnboardingLayout } from '@/layouts/OnboardingLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Welcome } from '@/pages/Welcome';

const Income = lazy(() => import('@/pages/Income'));
const Expenses = lazy(() => import('@/pages/Expenses'));
const Goals = lazy(() => import('@/pages/Goals'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Transactions = lazy(() => import('@/pages/Transactions'));
const GoalsPage = lazy(() => import('@/pages/GoalsPage'));
const BudgetsPage = lazy(() => import('@/pages/BudgetsPage'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <span
        className="material-symbols-outlined animate-spin text-primary text-[32px]"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        progress_activity
      </span>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <FinancialProvider>
        <Suspense fallback={<PageLoader />}>
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
            <Route
              path="/transactions"
              element={
                <DashboardLayout>
                  <Transactions />
                </DashboardLayout>
              }
            />
            <Route
              path="/goals"
              element={
                <DashboardLayout>
                  <GoalsPage />
                </DashboardLayout>
              }
            />
            <Route
              path="/budgets"
              element={
                <DashboardLayout>
                  <BudgetsPage />
                </DashboardLayout>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </FinancialProvider>
    </BrowserRouter>
  );
}
