import React, { useState } from 'react';
import { useHeartAlarm } from '../context/HeartAlarmContext';
import { CPRMetronomeVisualizer } from './CPRMetronomeVisualizer';
import { 
  AlertCircle, 
  PhoneCall, 
  MapPin, 
  Volume2, 
  VolumeX, 
  Navigation, 
  Mic, 
  CheckCircle2, 
  Clock, 
  Radio, 
  UserCheck, 
  ChevronRight, 
  ChevronLeft,
  Flame,
  ShieldAlert,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TAMIL_NADU_VILLAGES } from '../data/mockData';
import { VillageLandmark } from '../types';

export const VillagerApp: React.FC = () => {
  const {
    language,
    networkCondition,
    activeEmergency,
    triggerEmergency,
    cancelOrResolveEmergency,
    selectedVillage,
    setSelectedVillage,
    isVoicePlaying,
    activeVoiceStep,
    playStepVoiceAudio,
    stopVoiceAudio,
    updateAspirinStatus
  } = useHeartAlarm();

  const isTamil = language === 'ta';
  const [selectedLandmark, setSelectedLandmark] = useState<VillageLandmark>(selectedVillage.landmarks[0]);
  const [customDirections, setCustomDirections] = useState<string>('');
  const [isRecordingVoiceNote, setIsRecordingVoiceNote] = useState<boolean>(false);
  const [recordedVoiceNote, setRecordedVoiceNote] = useState<boolean>(false);
  const [showLocationFallbackModal, setShowLocationFallbackModal] = useState<boolean>(false);

  const emergencySteps = [
    {
      titleEn: '1. Check Breathing & Response',
      titleTa: '1. சுவாசம் உள்ளதா என சோதிக்கவும்',
      descEn: 'Tap shoulder firmly. Look at chest for movement. If no normal breathing, start compressions immediately.',
      descTa: 'தோள்பட்டையை தட்டி கூப்பிடவும். மார்பு அசையவில்லை என்றால் உடனடியாக CPR தொடங்கவும்.',
      action: 'Check Responsiveness',
      icon: '🫁'
    },
    {
      titleEn: '2. Center Hand Position',
      titleTa: '2. மார்பின் நடுவில் இரு கைகள்',
      descEn: 'Place heel of palm in center of breastbone (between nipples). Interlock second hand on top. Lock elbows straight.',
      descTa: 'மார்பின் மைய எலும்பில் ஒரு கையின் அடிபாகத்தை வைக்கவும். மற்றொரு கையை அதன் மேல் கோர்த்து முழங்கையை நேராக வைக்கவும்.',
      action: 'Correct Hand Grip',
      icon: '👐'
    },
    {
      titleEn: '3. Hard & Fast Compressions',
      titleTa: '3. இடைவிடாது வேகமாக அழுத்தவும்',
      descEn: 'Push hard & fast at 110 BPM (5cm deep). Do not stop until ASHA, volunteer, or 108 ambulance arrives.',
      descTa: 'நிமிடத்திற்கு 110 முறை 5 செ.மீ ஆழத்தில் அழுத்தவும். ஆம்புலன்ஸ் அல்லது ASHA வரும் வரை நிறுத்த வேண்டாம்.',
      action: 'Continuous CPR',
      icon: '⚡'
    },
    {
      titleEn: '4. Aspirin 300mg (If Conscious)',
      titleTa: '4. ஆஸ்பிரின் மாத்திரை (சுயநினைவு இருந்தால்)',
      descEn: 'If patient is awake with severe chest pain & no allergy, give 1 Dispirin/Aspirin 300mg to chew thoroughly with saliva.',
      descTa: 'சுயநினைவு உள்ள நோயாளிக்கு கடுமையான நெஞ்சு வலி இருந்தால் 300mg ஆஸ்பிரினை மென்று சாப்பிட கொடுக்கவும்.',
      action: 'Chew Aspirin',
      icon: '💊'
    },
    {
      titleEn: '5. Recovery Position (If Breathing)',
      titleTa: '5. ஒருக்களித்து படுக்க வைக்கவும்',
      descEn: 'If unconscious but breathing normally, roll patient onto their side to keep airway open and clear.',
      descTa: 'சுவாசம் சரியாக இருந்தால் நோயாளியை பக்கவாட்டில் ஒருக்களித்து படுக்க வைக்கவும்.',
      action: 'Side Recovery Pose',
      icon: '🛌'
    }
  ];

  const handlePanicButton = () => {
    triggerEmergency('app', {
      landmark: selectedLandmark,
      customNote: customDirections || `${selectedLandmark.nameEn}, near main road`
    });
  };

  const toggleVoiceRecording = () => {
    if (isRecordingVoiceNote) {
      setIsRecordingVoiceNote(false);
      setRecordedVoiceNote(true);
    } else {
      setIsRecordingVoiceNote(true);
      setTimeout(() => {
        setIsRecordingVoiceNote(false);
        setRecordedVoiceNote(true);
      }, 3500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      
      {/* Network Alert Banner */}
      <div className={`mb-6 p-3.5 rounded-2xl flex items-center justify-between text-xs font-semibold border backdrop-blur-md shadow-lg ${
        networkCondition === '4g'
          ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
          : networkCondition === '2g_weak'
          ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
          : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
      }`}>
        <div className="flex items-center gap-2.5">
          <Radio className="w-4 h-4 animate-pulse" />
          <span>
            {networkCondition === '4g' && (isTamil ? '4G இணையம்: நேரடி GPS + 108 குரல் போட் + ASHA புஷ் அலெர்ட் இயக்கத்தில் உள்ளது' : '4G Online: Live GPS + 108 Voice Bot + Geofenced ASHA dispatch active')}
            {networkCondition === '2g_weak' && (isTamil ? '2G பலவீனமான சிக்னல்: குறைந்த டேட்டா + SMS பேலோட் பாதுகாப்பு தயார்' : '2G Weak Signal: Low-bandwidth data + Instant SMS fallback active')}
            {networkCondition === 'offline_sms' && (isTamil ? 'டேட்டா இல்லை (ஆஃப்லைன்): உடனடி SMS கேட்வே பேலோட் + உள்ளூர் ஆடியோ தயார்' : 'Offline Mode: Encrypted SMS dispatch payload ready + Local audio guidance cached')}
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-xl bg-black/50 border border-white/10 font-mono text-[10px] uppercase font-bold tracking-wider">
          {networkCondition.replace('_', ' ')}
        </span>
      </div>

      {/* EMERGENCY INACTIVE STATE: PANIC BUTTON */}
      {!activeEmergency || activeEmergency.status === 'resolved' ? (
        <div className="bg-gradient-to-b from-[#160a0a] via-[#100707] to-[#0A0505] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl text-center relative overflow-hidden backdrop-blur-xl">
          
          {/* Subtle village context header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-6 border-b border-white/10 mb-8 text-left">
            <div>
              <span className="text-xs font-black text-red-400 uppercase tracking-widest">
                {isTamil ? 'கிராம அவசர மையம்' : 'Village Emergency Node'}
              </span>
              <h2 className="text-xl font-black text-white mt-0.5">
                {isTamil ? selectedVillage.nameTa : selectedVillage.nameEn}
              </h2>
              <p className="text-xs text-slate-400">
                {isTamil ? `${selectedVillage.districtTa} மாவட்டம் | ASHA: ${selectedVillage.primaryAshaName}` : `${selectedVillage.districtEn} District | Primary ASHA: ${selectedVillage.primaryAshaName}`}
              </p>
            </div>

            {/* Village Selector Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={selectedVillage.id}
                onChange={(e) => {
                  const found = TAMIL_NADU_VILLAGES.find(v => v.id === e.target.value);
                  if (found) {
                    setSelectedVillage(found);
                    setSelectedLandmark(found.landmarks[0]);
                  }
                }}
                className="bg-black/60 border border-white/15 text-slate-200 text-xs rounded-2xl px-3.5 py-2.5 focus:ring-2 focus:ring-red-500 outline-none backdrop-blur-md"
              >
                {TAMIL_NADU_VILLAGES.map(v => (
                  <option key={v.id} value={v.id} className="bg-slate-900 text-white">
                    {isTamil ? v.nameTa : v.nameEn} ({v.districtEn})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* GIANT RED EMERGENCY PANIC BUTTON */}
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="relative">
              {/* Outer pulsing ripple circles */}
              <div className="absolute inset-0 rounded-full bg-red-600/30 animate-pulse-ring pointer-events-none" />
              <div className="absolute -inset-4 rounded-full bg-red-500/20 animate-ping pointer-events-none" />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                onClick={handlePanicButton}
                className="relative z-10 w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 text-white shadow-2xl shadow-red-600/60 flex flex-col items-center justify-center p-6 border-4 border-red-400/50 cursor-pointer transition-all"
              >
                <div className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center mb-3 shadow-inner">
                  <Flame className="w-10 h-10 text-white animate-bounce" />
                </div>
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight drop-shadow-md">
                  {isTamil ? 'இதய அவசரநிலை' : 'HEART ALARM'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-red-100 uppercase tracking-wider mt-1 bg-red-900/60 border border-red-400/30 px-3.5 py-1 rounded-full">
                  {isTamil ? 'உடனடி உதவிக்கு அழுத்தவும்' : 'TAP FOR 108 & VILLAGE HELP'}
                </span>
              </motion.button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mt-8 max-w-md">
              {isTamil 
                ? 'ஒரே தட்டலில் 108 ஆம்புலன்ஸ், அருகிலுள்ள ASHA பணியாளர்கள் மற்றும் பயிற்சி பெற்ற தன்னார்வலர்களுக்கு தகவல் செல்லும்.' 
                : 'Instantly dials 108, shares GPS/Landmark, alerts nearby ASHAs & starts offline Tamil voice guidance.'}
            </p>
          </div>

          {/* Quick Landmark selection preview */}
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/[0.05] border border-white/10 rounded-2xl text-red-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">{isTamil ? 'அருகிலுள்ள அடையாளம் / Landmark:' : 'Nearest Landmark fallback:'}</div>
                <div className="text-sm font-bold text-slate-200">{isTamil ? selectedLandmark.nameTa : selectedLandmark.nameEn}</div>
              </div>
            </div>

            <button
              onClick={() => setShowLocationFallbackModal(true)}
              className="px-4 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 text-xs font-bold rounded-2xl transition-all"
            >
              {isTamil ? 'அடையாளத்தை மாற்றவும்' : 'Change Landmark / Directions'}
            </button>
          </div>
        </div>
      ) : (
        
        /* EMERGENCY ACTIVE STATE */
        <div className="space-y-6">
          
          {/* Active Emergency Alert Ribbon */}
          <div className="bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white rounded-3xl p-6 shadow-2xl shadow-red-700/40 border border-red-400/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center flex-shrink-0 animate-cpr-beat shadow-lg">
                <ShieldAlert className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-white text-red-700 font-black text-xs rounded-full uppercase tracking-wider shadow">
                    {isTamil ? 'அவசர எச்சரிக்கை அனுப்பப்பட்டது' : 'ALERT DISPATCHED'}
                  </span>
                  <span className="text-xs font-mono text-red-100 font-bold">
                    ID: {activeEmergency.id}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black mt-1">
                  {isTamil ? '108 மற்றும் கிராம தன்னார்வலர்களுக்கு தகவல் சென்றது' : '108 & Village Responders Notified'}
                </h2>
                <p className="text-xs text-red-100 mt-0.5">
                  {isTamil 
                    ? `இடம்: ${activeEmergency.villageNameTa} | அடையாளம்: ${activeEmergency.landmark?.nameTa || activeEmergency.customLandmarkText}`
                    : `Location: ${activeEmergency.villageNameEn} | Landmark: ${activeEmergency.landmark?.nameEn || activeEmergency.customLandmarkText}`}
                </p>
              </div>
            </div>

            {/* Direct 108 call button & Resolve button */}
            <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
              <a
                href="tel:108"
                className="px-4 py-2.5 bg-white text-red-700 hover:bg-red-50 font-bold rounded-2xl text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <PhoneCall className="w-4 h-4 text-red-600" />
                <span>{isTamil ? '108 உடன் பேசவும்' : 'Call 108 Directly'}</span>
              </a>

              <button
                onClick={() => cancelOrResolveEmergency(activeEmergency.id)}
                className="px-4 py-2.5 bg-red-950/80 hover:bg-red-900 text-white font-bold rounded-2xl text-xs border border-red-500/40 transition-colors"
              >
                {isTamil ? 'முடிந்தது / ரத்து' : 'Resolve / Cancel'}
              </button>
            </div>
          </div>

          {/* LIVE RESPONDER TRACKER & 108 AMBULANCE STATUS */}
          <div className="bg-gradient-to-b from-[#140a0a] to-[#0A0505] border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
            <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>{isTamil ? 'உதவி வரும் விவரம் (Live Responders)' : 'Nearby Responders & 108 Status'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* ASHA Responder card */}
              <div className="p-4 bg-black/60 rounded-2xl border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">ASHA Worker</span>
                    <span className="font-mono text-emerald-400 text-xs font-bold">
                      {activeEmergency.assignedResponders[0]?.status === 'accepted' ? '2 MINS' : 'ALERTED'}
                    </span>
                  </div>
                  <div className="font-bold text-white text-sm">{selectedVillage.primaryAshaName}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {activeEmergency.assignedResponders[0]?.status === 'accepted'
                      ? (isTamil ? 'கிளம்பிவிட்டார் (On the way)' : 'En route with first-aid kit')
                      : (isTamil ? 'அறிவிப்பு அனுப்பப்பட்டுள்ளது' : 'Alert ringing on phone')}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isTamil ? 'CPR பயிற்சி பெற்றவர்' : 'CPR Certified'}</span>
                </div>
              </div>

              {/* Village Youth Volunteer card */}
              <div className="p-4 bg-black/60 rounded-2xl border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">Village Volunteer</span>
                    <span className="font-mono text-blue-400 text-xs font-bold">3 MINS</span>
                  </div>
                  <div className="font-bold text-white text-sm">Muthuvel K. (Shop Owner)</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {isTamil ? 'ஏற்றுக்கொண்டார் (350மீ தூரம்)' : 'Accepted alert (350m away)'}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-blue-400 font-medium">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{isTamil ? 'இருசக்கர வாகனத்தில் வருகிறார்' : 'Approaching on 2-wheeler'}</span>
                </div>
              </div>

              {/* 108 Ambulance Dispatch card */}
              <div className="p-4 bg-black/60 rounded-2xl border border-red-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold border border-red-500/30">108 Ambulance</span>
                    <span className="font-mono text-red-400 text-xs font-bold">
                      {activeEmergency.ambulance108Status.etaMinutes} MINS
                    </span>
                  </div>
                  <div className="font-bold text-white text-sm">
                    {activeEmergency.ambulance108Status.incidentId}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {isTamil 
                      ? `ஓட்டுநர்: ${activeEmergency.ambulance108Status.driverName}` 
                      : `Driver: ${activeEmergency.ambulance108Status.driverName}`}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{isTamil ? 'நிலை:' : 'Status:'}</span>
                  <span className="text-red-400 font-bold uppercase">{activeEmergency.ambulance108Status.status}</span>
                </div>
              </div>
            </div>

            {/* Auto-escalation message */}
            <div className="mt-4 p-3.5 bg-black/60 rounded-2xl border border-white/10 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>
                  {isTamil 
                    ? `கடந்த நேரம்: ${activeEmergency.elapsedSeconds} வினாடிகள் | 2 நிமிடத்தில் பதிலில்லையெனில் தானாக 5 கி.மீ சுற்றளவுக்கு எச்சரிக்கை விரியும்.` 
                    : `Elapsed: ${activeEmergency.elapsedSeconds}s | Auto-escalation: Broadens to 5km radius if unconfirmed in 2 mins.`}
                </span>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                {activeEmergency.escalationLevel.toUpperCase()}
              </span>
            </div>
          </div>

          {/* JIT VOICE GUIDANCE & CPR METRONOME (TAMIL & ENGLISH) */}
          <div className="bg-gradient-to-b from-[#140a0a] to-[#0A0505] border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div>
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  {isTamil ? 'உடனடி உயிர் காக்கும் வழிகாட்டல்' : 'Just-in-Time Voice Instructions'}
                </span>
                <h3 className="text-xl font-black text-white">
                  {isTamil ? 'இப்போது நீங்கள் செய்ய வேண்டியவை' : 'What To Do Right Now (Step-by-Step)'}
                </h3>
              </div>

              {/* Voice instruction controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (isVoicePlaying) {
                      stopVoiceAudio();
                    } else {
                      playStepVoiceAudio(activeVoiceStep);
                    }
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
                    isVoicePlaying 
                      ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/30' 
                      : 'bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200'
                  }`}
                >
                  {isVoicePlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>
                    {isVoicePlaying 
                      ? (isTamil ? 'குரலை நிறுத்து' : 'Stop Audio') 
                      : (isTamil ? 'தமிழில் கேட்கவும் (Play Voice)' : 'Play Voice Guide')}
                  </span>
                </button>
              </div>
            </div>

            {/* Step navigation tabs */}
            <div className="grid grid-cols-5 gap-2 mb-6">
              {emergencySteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => playStepVoiceAudio(idx)}
                  className={`p-3 rounded-2xl text-center transition-all ${
                    activeVoiceStep === idx 
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-lg shadow-red-600/30 border border-red-400/50' 
                      : 'bg-black/50 text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-white/10'
                  }`}
                >
                  <div className="text-lg mb-0.5">{step.icon}</div>
                  <div className="text-[10px] hidden sm:block truncate font-semibold">
                    {isTamil ? step.titleTa.split(' ')[1] : step.titleEn.split(' ')[1]}
                  </div>
                  <div className="text-[10px] sm:hidden font-bold">
                    {idx + 1}
                  </div>
                </button>
              ))}
            </div>

            {/* Active Step Highlight Card */}
            <div className="p-6 bg-black/60 rounded-3xl border border-red-500/30 mb-6 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
                    {emergencySteps[activeVoiceStep].icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">
                      {isTamil ? emergencySteps[activeVoiceStep].titleTa : emergencySteps[activeVoiceStep].titleEn}
                    </h4>
                    <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                      {isTamil ? emergencySteps[activeVoiceStep].descTa : emergencySteps[activeVoiceStep].descEn}
                    </p>
                  </div>
                </div>

                {/* Aspirin checkbox if on step 4 */}
                {activeVoiceStep === 3 && (
                  <button
                    onClick={() => updateAspirinStatus(activeEmergency.id, !activeEmergency.aspirinAdministered)}
                    className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all ${
                      activeEmergency.aspirinAdministered
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                        : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/15'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {activeEmergency.aspirinAdministered 
                        ? (isTamil ? 'ஆஸ்பிரின் கொடுக்கப்பட்டது ✓' : 'Aspirin Administered ✓') 
                        : (isTamil ? 'ஆஸ்பிரின் கொடுத்துள்ளேன்' : 'Mark Aspirin Given')}
                    </span>
                  </button>
                )}
              </div>

              {/* Prev / Next Step arrows */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                <button
                  disabled={activeVoiceStep === 0}
                  onClick={() => playStepVoiceAudio(Math.max(0, activeVoiceStep - 1))}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{isTamil ? 'முந்தைய படி' : 'Previous Step'}</span>
                </button>

                <span className="text-xs font-mono text-slate-400 font-bold">
                  {activeVoiceStep + 1} / {emergencySteps.length}
                </span>

                <button
                  disabled={activeVoiceStep === emergencySteps.length - 1}
                  onClick={() => playStepVoiceAudio(Math.min(emergencySteps.length - 1, activeVoiceStep + 1))}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <span>{isTamil ? 'அடுத்த படி' : 'Next Step'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Embedded CPR Metronome Visualizer */}
            <CPRMetronomeVisualizer compact={false} />
          </div>

          {/* FALLBACK LOCATION & VOICE NOTE DIRECTIONS */}
          <div className="bg-gradient-to-b from-[#140a0a] to-[#0A0505] border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/[0.05] border border-white/10 rounded-2xl text-emerald-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    {isTamil ? 'கிராம இருப்பிட அடையாளம்' : 'Location & Landmark Details'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {isTamil ? '108 மற்றும் தன்னார்வலர் வழி அறிய உதவும்' : 'Helps responders locate house quickly'}
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono text-emerald-400 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-xl font-bold">
                GPS: {activeEmergency.gpsCoords?.lat.toFixed(4)}, {activeEmergency.gpsCoords?.lng.toFixed(4)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-black/60 rounded-2xl border border-white/10">
                <div className="text-xs text-slate-400 mb-1">{isTamil ? 'தேர்வு செய்யப்பட்ட அடையாளம்:' : 'Selected Landmark:'}</div>
                <div className="font-bold text-white text-sm">{isTamil ? selectedLandmark.nameTa : selectedLandmark.nameEn}</div>
                <div className="text-xs text-slate-400 mt-1">{isTamil ? selectedLandmark.descriptionTa : selectedLandmark.descriptionEn}</div>
              </div>

              {/* Voice direction note */}
              <div className="p-4 bg-black/60 rounded-2xl border border-white/10 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-400 mb-1">{isTamil ? 'குரல் வழிப்பாதை பதிவு:' : 'Voice Directions note:'}</div>
                  <div className="font-semibold text-white text-xs">
                    {recordedVoiceNote 
                      ? (isTamil ? 'குரல் பதிவு இணைக்கப்பட்டுள்ளது (4s) ✓' : 'Voice note attached (4s) ✓') 
                      : (isTamil ? 'குரல் மூலம் வழி சொல்லலாம்' : 'Record 5s spoken landmark audio')}
                  </div>
                </div>

                <button
                  onClick={toggleVoiceRecording}
                  className={`p-3.5 rounded-2xl flex items-center justify-center transition-all ${
                    isRecordingVoiceNote 
                      ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-600/30' 
                      : (recordedVoiceNote ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200')
                  }`}
                  title="Record voice note"
                >
                  <Mic className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CHANGE LANDMARK / ADDRESS FALLBACK */}
      <AnimatePresence>
        {showLocationFallbackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#140a0a] border border-white/15 rounded-3xl p-6 max-w-lg w-full shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-1">
                {isTamil ? 'கிராம அடையாளத்தை தேர்வு செய்யவும்' : 'Select Landmark in Village'}
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                {isTamil ? 'GPS பலவீனமாக இருக்கும்போது தன்னார்வலர் உடனடியாக வீடு வந்து சேர உதவும்' : 'Critical for rural navigation when GPS accuracy is limited.'}
              </p>

              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-1">
                {selectedVillage.landmarks.map((lm) => (
                  <div
                    key={lm.id}
                    onClick={() => setSelectedLandmark(lm)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      selectedLandmark.id === lm.id
                        ? 'bg-red-600/20 border-red-500 text-white shadow'
                        : 'bg-black/50 border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="font-bold text-sm">{isTamil ? lm.nameTa : lm.nameEn}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{isTamil ? lm.descriptionTa : lm.descriptionEn}</div>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isTamil ? 'கூடுதல் வழிக்குறிப்பு (விரும்பினால்):' : 'Custom house landmark (optional):'}
                </label>
                <input
                  type="text"
                  value={customDirections}
                  onChange={(e) => setCustomDirections(e.target.value)}
                  placeholder={isTamil ? "எ.கா: ரேஷன் கடைக்கு பின்னால், பச்சை நிற கேட்" : "e.g., Behind ration shop, green gate house"}
                  className="w-full bg-black/60 border border-white/15 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-slate-500 outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowLocationFallbackModal(false)}
                  className="px-4 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 text-xs font-semibold rounded-2xl transition-all"
                >
                  {isTamil ? 'மூடு' : 'Cancel'}
                </button>
                <button
                  onClick={() => setShowLocationFallbackModal(false)}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-red-600/30 transition-all"
                >
                  {isTamil ? 'சேமி' : 'Save Landmark'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
