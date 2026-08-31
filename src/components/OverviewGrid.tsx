import React from 'react';
import { useHeartAlarm } from '../context/HeartAlarmContext';
import { VillagerApp } from './VillagerApp';
import { BasicPhoneSimulator } from './BasicPhoneSimulator';
import { AshaResponderApp } from './AshaResponderApp';
import { Emergency108Dashboard } from './Emergency108Dashboard';
import { LayoutGrid, Smartphone, PhoneCall, Stethoscope, Ambulance } from 'lucide-react';

export const OverviewGrid: React.FC = () => {
  const { language } = useHeartAlarm();
  const isTamil = language === 'ta';

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-[#140a0a] to-[#0A0505] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-extrabold text-xs">
              SYNCHRONIZED MULTI-VIEW
            </span>
            <span className="text-xs text-slate-400 font-mono">Live State Synchronizer</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            {isTamil ? 'அனைத்து நிலைகளும் ஒருங்கிணைந்த நேரலை பார்வை' : 'Real-time Multi-Channel Ecosystem View'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isTamil 
              ? 'ஒரு சாதனத்தில் அவசர எச்சரிக்கை தூண்டப்படும்போது 108, ASHA மற்றும் சாதாரண போனில் ஒரே நேரத்தில் செயல்படுவதை நேரடியாகக் காணுங்கள்.' 
              : 'Trigger an alert on any channel to observe the instantaneous cascade across Smartphone, Feature Phone IVR, ASHA Dispatch, and 108 Command.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Panel 1: Smartphone Villager App */}
        <div className="bg-black/60 rounded-3xl border border-white/10 p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-red-400 mb-3 px-2">
            <Smartphone className="w-4 h-4" />
            <span>{isTamil ? '1. கிராமத்து குடும்ப செயலி (Villager App)' : '1. Villager Smartphone Panic App'}</span>
          </div>
          <div className="bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
            <VillagerApp />
          </div>
        </div>

        {/* Panel 2: Basic Feature Phone / IVR */}
        <div className="bg-black/60 rounded-3xl border border-white/10 p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-3 px-2">
            <PhoneCall className="w-4 h-4" />
            <span>{isTamil ? '2. சாதாரண போன் / மிஸ்ட் கால் (Basic Phone & IVR)' : '2. 2G Feature Phone Missed-Call & IVR'}</span>
          </div>
          <div className="bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
            <BasicPhoneSimulator />
          </div>
        </div>

        {/* Panel 3: ASHA Worker & Volunteer */}
        <div className="bg-black/60 rounded-3xl border border-white/10 p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-3 px-2">
            <Stethoscope className="w-4 h-4" />
            <span>{isTamil ? '3. ASHA பணியாளர் & தன்னார்வலர் செயலி' : '3. ASHA & Volunteer First-Responder App'}</span>
          </div>
          <div className="bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
            <AshaResponderApp />
          </div>
        </div>

        {/* Panel 4: 108 Emergency Control Room */}
        <div className="bg-black/60 rounded-3xl border border-white/10 p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 mb-3 px-2">
            <Ambulance className="w-4 h-4" />
            <span>{isTamil ? '4. 108 அவசர கட்டுப்பாட்டு அறை & PHC' : '4. 108 Emergency Tele-Command Hub'}</span>
          </div>
          <div className="bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
            <Emergency108Dashboard />
          </div>
        </div>

      </div>

    </div>
  );
};
