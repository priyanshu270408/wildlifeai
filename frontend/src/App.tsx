import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DemoBanner } from './components/ui/DemoBanner';
import { Navbar } from './components/ui/Navbar';
import { Footer } from './components/ui/Footer';

// Pages
import { LandingPage } from './pages/public/LandingPage';
import { SafetyPage } from './pages/public/SafetyPage';
import { SpeciesGuide } from './pages/public/SpeciesGuide';
import { MapPage } from './pages/public/MapPage';

import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { ReportWizard } from './pages/citizen/ReportWizard';
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { OfficerDashboard } from './pages/officer/OfficerDashboard';
import { ResearcherDashboard } from './pages/researcher/ResearcherDashboard';
import { ResponseDashboard } from './pages/response/ResponseDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-surface font-sans text-surface-charcoal">
          {/* Top Demo Evaluation Banner */}
          <DemoBanner />

          {/* Sticky Navigation Header */}
          <Navbar />

          {/* Main App Content Area */}
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/wildlife-safety" element={<SafetyPage />} />
              <Route path="/species" element={<SpeciesGuide />} />
              <Route path="/map" element={<MapPage />} />

              {/* Citizen Routes */}
              <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
              <Route path="/citizen/report" element={<ReportWizard />} />

              {/* Farmer Routes */}
              <Route path="/farmer/dashboard" element={<FarmerDashboard />} />

              {/* Forest Officer Routes */}
              <Route path="/officer/dashboard" element={<OfficerDashboard />} />

              {/* Researcher Routes */}
              <Route path="/research/dashboard" element={<ResearcherDashboard />} />

              {/* Response Team Routes */}
              <Route path="/response/dashboard" element={<ResponseDashboard />} />

              {/* Administrator Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Catch-all redirect to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Environmental Intelligence Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
