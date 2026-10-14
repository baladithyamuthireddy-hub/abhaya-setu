import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { CommandCenter } from './components/command/CommandCenter';
import { DetectionLab } from './components/lab/DetectionLab';
import { IncidentManagement } from './components/incidents/IncidentManagement';
import { PatrolDispatch } from './components/patrols/PatrolDispatch';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { PrivacyCenter } from './components/privacy/PrivacyCenter';
import { DeviceManagement } from './components/settings/DeviceManagement';
import { SosModal } from './components/sos/SosModal';
import { ToastContainer } from './components/common/ToastContainer';
import { AlertOctagon } from 'lucide-react';

function DashboardContent() {
  const { activeTab, setIsSosModalOpen } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-command-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Operations Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Tab Viewport */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeTab === 'command' && <CommandCenter />}
          {activeTab === 'lab' && <DetectionLab />}
          {activeTab === 'incidents' && <IncidentManagement />}
          {activeTab === 'patrols' && <PatrolDispatch />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'privacy' && <PrivacyCenter />}
          {activeTab === 'settings' && <DeviceManagement />}
        </main>
      </div>

      {/* Floating Quick SOS Trigger (Mobile View) */}
      <div className="fixed bottom-5 left-5 z-30 sm:hidden">
        <button
          onClick={() => setIsSosModalOpen(true)}
          className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl border-2 border-red-400/60 active:scale-95"
          aria-label="Trigger SOS"
        >
          <AlertOctagon className="w-6 h-6 animate-pulse" />
        </button>
      </div>

      {/* Global Modals & Notifications */}
      <SosModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}
