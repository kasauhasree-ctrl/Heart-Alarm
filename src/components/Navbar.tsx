import React, { useState, useRef, useEffect } from 'react';
import { useHeartAlarm, UserRole } from '../context/HeartAlarmContext';
import { 
  HeartHandshake, 
  Wifi, 
  WifiOff, 
  Smartphone, 
  PhoneCall, 
  Stethoscope, 
  Ambulance, 
  GraduationCap, 
  LayoutGrid, 
  AlertTriangle, 
  RotateCcw,
  Globe,
  Check,
  ChevronDown,
  Volume2
} from 'lucide-react';
import { NetworkCondition, Language } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/translations';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    networkCondition,
    setNetworkCondition,
    activeRole,
    setActiveRole,
    activeEmergency,
    resetAllDemoData
  } = useHeartAlarm();

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const isTamil = language === 'ta';
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.id === language) || SUPPORTED_LANGUAGES[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles: { id: UserRole; labelKey: string; defaultEn: string; icon: React.ReactNode }[] = [
    { id: 'villager', labelKey: 'role_villager', defaultEn: 'Villager App', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'basic_phone', labelKey: 'role_basic_phone', defaultEn: 'Basic Phone / IVR', icon: <PhoneCall className="w-4 h-4" /> },
    { id: 'asha_volunteer', labelKey: 'role_asha', defaultEn: 'ASHA & Volunteer', icon: <Stethoscope className="w-4 h-4" /> },
    { id: 'control_108', labelKey: 'role_108', defaultEn: '108 Command Center', icon: <Ambulance className="w-4 h-4" /> },
    { id: 'training', labelKey: 'role_training', defaultEn: 'Offline Academy', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'overview_grid', labelKey: 'role_overview', defaultEn: 'Sync Multi-View', icon: <LayoutGrid className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0A0505]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Brand Logo & Live Emergency Badge */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveRole('villager')}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-600/40 text-white font-bold border border-red-400/30 group-hover:scale-105 transition-transform">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white tracking-tight text-base sm:text-lg">
                    HeartAlarm
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold border border-red-500/30 tracking-wider">
                    {currentLangObj.badge} MULTILINGUAL
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {t('app_subtitle')}
                </div>
              </div>
            </div>

            {/* Active alert indicator pill */}
            {activeEmergency && activeEmergency.status !== 'resolved' && (
              <div 
                onClick={() => setActiveRole('villager')}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-red-600/20 border border-red-500/50 rounded-full cursor-pointer hover:bg-red-600/30 transition-all shadow-lg shadow-red-600/20 animate-pulse"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span className="text-xs font-black text-red-300 tracking-wide">
                  {t('emergency_active')}
                </span>
              </div>
            )}
          </div>

          {/* Controls: Network simulator & Multilingual Mode */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
            
            {/* Network condition simulator */}
            <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-2xl p-1 text-xs backdrop-blur-md">
              <span className="text-[10px] text-slate-400 font-semibold px-2.5 hidden sm:inline">
                {t('signal')}:
              </span>

              <button
                onClick={() => setNetworkCondition('4g')}
                className={`px-2.5 py-1 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                  networkCondition === '4g'
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Good 4G/5G Connectivity"
              >
                <Wifi className="w-3.5 h-3.5 text-emerald-300" />
                <span>4G</span>
              </button>

              <button
                onClick={() => setNetworkCondition('2g_weak')}
                className={`px-2.5 py-1 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                  networkCondition === '2g_weak'
                    ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Weak 2G / Edge connection (Compresses voice & uses text fallback)"
              >
                <Wifi className="w-3.5 h-3.5 text-amber-300" />
                <span>2G/Weak</span>
              </button>

              <button
                onClick={() => setNetworkCondition('offline_sms')}
                className={`px-2.5 py-1 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                  networkCondition === 'offline_sms'
                    ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Zero Internet Data - Pure SMS / Missed Call Mode"
              >
                <WifiOff className="w-3.5 h-3.5 text-rose-300" />
                <span>SMS Only</span>
              </button>
            </div>

            {/* Multilingual Mode Dropdown */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-red-950/40 via-white/[0.04] to-white/[0.06] border border-red-500/30 hover:border-red-500/60 rounded-2xl text-xs font-bold text-slate-100 transition-all hover:bg-white/[0.08] shadow-lg shadow-black/40 cursor-pointer"
                title="Multilingual Mode (Tamil, English, Hindi, Telugu, Kannada, Malayalam)"
              >
                <Globe className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="font-extrabold text-white">{currentLangObj.nameNative}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-mono">
                  {currentLangObj.badge}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Language Selection Modal / Dropdown Menu */}
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#140a0a] border border-white/15 rounded-3xl p-2.5 shadow-2xl shadow-black/80 backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-white/10 mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-red-400" />
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-200">
                        Multilingual Mode
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Volume2 className="w-3 h-3 text-emerald-400" /> Voice AI
                    </span>
                  </div>

                  <div className="space-y-1">
                    {SUPPORTED_LANGUAGES.map((lang) => {
                      const isSelected = language === lang.id;
                      return (
                        <button
                          key={lang.id}
                          onClick={() => {
                            setLanguage(lang.id);
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-left transition-all ${
                            isSelected
                              ? 'bg-gradient-to-r from-red-600/30 to-rose-600/20 border border-red-500/50 text-white font-bold'
                              : 'hover:bg-white/[0.06] text-slate-300 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 text-center text-xs font-mono font-bold text-red-400 bg-red-500/10 rounded py-0.5">
                              {lang.badge}
                            </span>
                            <div>
                              <div className="text-xs font-extrabold text-white">
                                {lang.nameNative}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {lang.nameEn} • {lang.region}
                              </div>
                            </div>
                          </div>

                          {isSelected && (
                            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Reset button */}
            <button
              onClick={resetAllDemoData}
              className="p-2 bg-white/[0.04] border border-white/10 hover:border-white/25 text-slate-400 hover:text-slate-200 rounded-2xl transition-all hover:bg-white/[0.08] cursor-pointer"
              title="Reset Demo Simulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Role Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 no-scrollbar">
          {roles.map(r => {
            const isActive = activeRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setActiveRole(r.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30 border border-red-400/40'
                    : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.07] border border-white/10'
                }`}
              >
                {r.icon}
                <span>{t(r.labelKey)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

