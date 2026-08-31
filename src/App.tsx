/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HeartAlarmProvider, useHeartAlarm } from './context/HeartAlarmContext';
import { Navbar } from './components/Navbar';
import { VillagerApp } from './components/VillagerApp';
import { BasicPhoneSimulator } from './components/BasicPhoneSimulator';
import { AshaResponderApp } from './components/AshaResponderApp';
import { Emergency108Dashboard } from './components/Emergency108Dashboard';
import { TrainingAcademy } from './components/TrainingAcademy';
import { OverviewGrid } from './components/OverviewGrid';
import { HeartHandshake, Shield, PhoneCall, Radio, Activity } from 'lucide-react';

function AppContent() {
  const { activeRole, language } = useHeartAlarm();
  const isTamil = language === 'ta';

  return (
    <div className="min-h-screen bg-[#0A0505] text-white flex flex-col selection:bg-red-600 selection:text-white relative overflow-x-hidden">
      {/* Immersive Ambient Glow Effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10 animate-ambient-glow" />
      <div className="fixed bottom-10 right-1/4 w-[500px] h-[500px] bg-rose-950/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      <Navbar />

      <main className="flex-1 pb-16 relative z-0">
        {activeRole === 'villager' && <VillagerApp />}
        {activeRole === 'basic_phone' && <BasicPhoneSimulator />}
        {activeRole === 'asha_volunteer' && <AshaResponderApp />}
        {activeRole === 'control_108' && <Emergency108Dashboard />}
        {activeRole === 'training' && <TrainingAcademy />}
        {activeRole === 'overview_grid' && <OverviewGrid />}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#0A0505]/90 backdrop-blur-md py-8 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center font-bold shadow-lg shadow-red-600/30">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-white">HeartAlarm Village Network</span>
            <span className="text-slate-400">| Tamil Nadu Rural Cardiac Pilot</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-red-400" />
              <span>108 Emergency Service</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>DPH & NHM TN Compliant</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <HeartAlarmProvider>
      <AppContent />
    </HeartAlarmProvider>
  );
}

