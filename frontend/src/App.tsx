import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './contexts/ThemeContext';
import { UiProvider } from './contexts/UiContext';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './pages/Dashboard';
import { Jobs } from './pages/Jobs';
import { JobDetails } from './pages/JobDetails';
import { Candidates } from './pages/Candidates';
import { CandidateProfile } from './pages/CandidateProfile';
import { Pipeline } from './pages/Pipeline';
import { Interviews } from './pages/Interviews';
import { InterviewFeedback } from './pages/InterviewFeedback';
import { Analytics } from './pages/Analytics';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';

interface AppProps {
  /** Starting colour theme for the workspace. */
  theme?: 'light' | 'dark';
}

export function App({ theme = 'light' }: AppProps) {
  return (
    <ThemeProvider initial={theme}>
      <UiProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:jobId" element={<JobDetails />} />
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/candidates/:candidateId" element={<CandidateProfile />} />
              <Route path="/pipeline" element={<Pipeline />} />
              <Route path="/interviews" element={<Interviews />} />
              <Route path="/interviews/:interviewId/feedback" element={<InterviewFeedback />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster
          position="bottom-right"
          toastOptions={{
            className:
            'rounded-lg border border-border bg-elevated text-ink shadow-lg text-base font-medium'
          }} />
        
      </UiProvider>
    </ThemeProvider>);

}