import React, { useState } from 'react';
import { useHeartAlarm } from '../context/HeartAlarmContext';
import { CPRMetronomeVisualizer } from './CPRMetronomeVisualizer';
import { 
  Stethoscope, 
  MapPin, 
  Navigation, 
  PhoneCall, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  UserCheck, 
  Volume2, 
  VolumeX, 
  Activity,
  Heart,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AshaResponderApp: React.FC = () => {
  const {
    language,
    activeEmergency,
    responders,
    acceptAlertByResponder,
    markResponderOnScene,
    updateCPRStatus,
    updateAspirinStatus,
    selectedVillage
  } = useHeartAlarm();

  const isTamil = language === 'ta';

  // Active responder profile (Simulating primary ASHA Kavitha)
  const currentAsha = responders[0]; 
  const isAccepted = activeEmergency?.assignedResponders.some(
    ar => ar.responderId === currentAsha.id && (ar.status === 'accepted' || ar.status === 'on_scene')
  );
  const isOnScene = activeEmergency?.assignedResponders.some(
    ar => ar.responderId === currentAsha.id && ar.status === 'on_scene'
  );

  const [activeTab, setActiveTab] = useState<'live_alert' | 'registry_log'>('live_alert');

  // Past village cardiac cases for PHC registry
  const [pastCases] = useState([
    {
      id: 'CASE-TN-781',
      patientName: 'Velayutham (Age 64)',
      village: 'Kilvelur North',
      date: '24 Aug 2026',
      firstAidGiven: 'CPR 4 mins + Aspirin 300mg',
      outcome: 'Shifted to Nagapattinam GH via 108 (Discharged stable)',
      phcFollowupStatus: 'Completed - BP & ECG normal'
    },
    {
      id: 'CASE-TN-722',
      patientName: 'Ponnammal (Age 56)',
      village: 'Kilvelur East',
      date: '11 Aug 2026',
      firstAidGiven: 'Aspirin chewed + Propped posture',
      outcome: 'Primary PHC Thrombolysis completed within Golden Hour',
      phcFollowupStatus: 'Referred to Thanjavur Medical College'
    }
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      
      {/* ASHA Profile Header Banner */}
      <div className="bg-gradient-to-b from-[#140a0a] to-[#0A0505] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
            <Stethoscope className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs">
                ASHA HEALTH WORKER
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: TN-ASHA-0418</span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">
              {currentAsha.name}
            </h2>
            <p className="text-xs text-slate-400">
              {isTamil 
                ? `${selectedVillage.nameTa} கிராம சுகாதார மையம் | ${currentAsha.completedRescues} உயிர்காக்கும் உதவிகள்` 
                : `${selectedVillage.nameEn} Health Post | ${currentAsha.completedRescues} successful emergency rescues`}
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-black/60 p-1.5 rounded-2xl border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('live_alert')}
            className={`px-4 py-2 rounded-xl transition-all font-bold ${
              activeTab === 'live_alert'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isTamil ? 'அவசர எச்சரிக்கைகள்' : 'Active Emergencies'}
          </button>
          <button
            onClick={() => setActiveTab('registry_log')}
            className={`px-4 py-2 rounded-xl transition-all font-bold ${
              activeTab === 'registry_log'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isTamil ? 'PHC பதிவேடு' : 'PHC Registry'}
          </button>
        </div>
      </div>

      {activeTab === 'live_alert' ? (
        
        /* ACTIVE ALERT VIEW */
        activeEmergency && activeEmergency.status !== 'resolved' ? (
          <div className="space-y-6">
            
            {/* INCOMING EMERGENCY ALERT CARD */}
            <div className="bg-gradient-to-br from-red-950/80 via-[#120808] to-[#0A0505] border-2 border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              
              {/* Header with Distance & Severity */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-red-500/20">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs font-black text-red-400 uppercase tracking-widest">
                    {isTamil ? 'அவசர இதய எச்சரிக்கை பெறப்பட்டது!' : 'CARDIAC EMERGENCY ALERT!'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-red-500/20 text-red-300 font-mono font-bold text-xs rounded-full border border-red-500/30">
                    {isTamil ? 'தூரம்: 380 மீ' : 'Distance: 380m'} (ETA: ~2 mins)
                  </span>
                </div>
              </div>

              {/* Patient Details & Landmark */}
              <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-black/50 rounded-2xl border border-white/10">
                  <div className="text-xs text-slate-400 mb-1">{isTamil ? 'நோயாளி விவரம்:' : 'Patient & Caller:'}</div>
                  <h3 className="text-lg font-bold text-white">
                    {activeEmergency.patientName || 'Emergency Patient'}
                  </h3>
                  <div className="text-xs text-red-400 font-bold mt-2 flex items-center gap-1.5">
                    <Activity className="w-4 h-4" />
                    <span>
                      {activeEmergency.symptomType === 'unconscious_no_breathing'
                        ? (isTamil ? 'மயக்கம் / மூச்சுத்திணறல் (CPR தேவை)' : 'Unconscious / No Breathing (CPR Required)')
                        : (isTamil ? 'கடுமையான நெஞ்சு வலி (ஆஸ்பிரின் தயார்)' : 'Severe Chest Pain (Aspirin Protocol)')}
                    </span>
                  </div>
                </div>

                <div className="bg-black/50 p-5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
                    <MapPin className="w-4 h-4" />
                    <span>{isTamil ? 'வீட்டு அடையாளம் & வழிப்பாதை:' : 'Landmark & Navigation Note:'}</span>
                  </div>
                  <div className="text-xs text-slate-200 font-semibold leading-relaxed mt-1">
                    {isTamil 
                      ? `${activeEmergency.landmark?.nameTa || activeEmergency.customLandmarkText}` 
                      : `${activeEmergency.landmark?.nameEn || activeEmergency.customLandmarkText}`}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2">
                    {isTamil ? 'கோவிலிலிருந்து கிழக்கு நோக்கி 150 மீ சென்று பச்சை நிற கதவு வீடு' : 'Proceed 150m east from temple arch towards green door house'}
                  </div>
                </div>
              </div>

              {/* ACCEPT / DECLINE ACTIONS */}
              {!isAccepted ? (
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => acceptAlertByResponder(currentAsha.id, activeEmergency.id)}
                    className="w-full sm:w-auto flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{isTamil ? 'ஏற்றுக்கொள்கிறேன் - கிளம்பிவிட்டேன்' : 'ACCEPT & NAVIGATE TO PATIENT'}</span>
                  </button>

                  <a
                    href={`tel:${activeEmergency.callerPhone}`}
                    className="w-full sm:w-auto px-6 py-4 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-200 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <PhoneCall className="w-4 h-4 text-emerald-400" />
                    <span>{isTamil ? 'குடும்பத்தினரை அழைக்க' : 'Call Caller'}</span>
                  </a>
                </div>
              ) : (
                
                /* ACCEPTED ON-SCENE CONTROLS */
                <div className="pt-4 border-t border-white/10 space-y-4">
                  
                  {/* Status Banner */}
                  <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-300">
                      <UserCheck className="w-4 h-4" />
                      <span>
                        {isOnScene 
                          ? (isTamil ? 'நீங்கள் சம்பவ இடத்தை அடைந்துவிட்டீர்கள் ✓' : 'You are On-Scene with Patient ✓') 
                          : (isTamil ? 'நீங்கள் உதவிக்கு கிளம்பிவிட்டீர்கள் (En-Route)' : 'Status: En-Route to Patient')}
                      </span>
                    </div>

                    {!isOnScene && (
                      <button
                        onClick={() => markResponderOnScene(currentAsha.id, activeEmergency.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20"
                      >
                        {isTamil ? 'சென்றடைந்தேன்' : 'Mark Arrived'}
                      </button>
                    )}
                  </div>

                  {/* On-Scene First Aid Clinical Checklist */}
                  <div className="bg-black/60 p-6 rounded-3xl border border-white/10">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-emerald-400" />
                      <span>{isTamil ? 'முதலுதவி சரிபார்ப்பு பட்டியல்' : 'On-Scene Action Checklist'}</span>
                    </h4>

                    <div className="space-y-3">
                      
                      {/* Item 1: Breathing check */}
                      <div className="flex items-center justify-between p-3.5 bg-white/[0.03] rounded-2xl border border-white/5 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px]">1</span>
                          <span className="text-slate-200 font-semibold">
                            {isTamil ? 'சுவாசம் மற்றும் நாடித் துடிப்பு சரிபார்க்கவும்' : 'Check responsiveness & pulse/breathing'}
                          </span>
                        </div>
                        <span className="text-[11px] text-emerald-400 font-bold">✓ Checked</span>
                      </div>

                      {/* Item 2: CPR compressions */}
                      <div className="flex items-center justify-between p-3.5 bg-white/[0.03] rounded-2xl border border-white/5 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center text-[10px]">2</span>
                          <span className="text-slate-200 font-semibold">
                            {isTamil ? 'கைமுறை CPR தொடங்கு (110 BPM)' : 'Hands-Only CPR (110 BPM Metronome)'}
                          </span>
                        </div>
                        <button
                          onClick={() => updateCPRStatus(activeEmergency.id, !activeEmergency.cprInitiated)}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                            activeEmergency.cprInitiated 
                              ? 'bg-red-600 text-white shadow-red-600/30' 
                              : 'bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-slate-300'
                          }`}
                        >
                          {activeEmergency.cprInitiated 
                            ? (isTamil ? 'CPR இயங்குகிறது ✓' : 'CPR Active ✓') 
                            : (isTamil ? 'CPR தொடங்கு' : 'Start CPR')}
                        </button>
                      </div>

                      {/* Item 3: Aspirin 300mg */}
                      <div className="flex items-center justify-between p-3.5 bg-white/[0.03] rounded-2xl border border-white/5 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px]">3</span>
                          <span className="text-slate-200 font-semibold">
                            {isTamil ? 'ஆஸ்பிரின் 300mg மெல்லக் கொடுத்தல்' : 'Administer Aspirin 300mg (if conscious)'}
                          </span>
                        </div>
                        <button
                          onClick={() => updateAspirinStatus(activeEmergency.id, !activeEmergency.aspirinAdministered)}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                            activeEmergency.aspirinAdministered 
                              ? 'bg-emerald-600 text-white shadow-emerald-600/30' 
                              : 'bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-slate-300'
                          }`}
                        >
                          {activeEmergency.aspirinAdministered 
                            ? (isTamil ? 'வழங்கப்பட்டது ✓' : 'Administered ✓') 
                            : (isTamil ? 'வழங்கு' : 'Give Aspirin')}
                        </button>
                      </div>

                      {/* Item 4: 108 Ambulance Driver Handover */}
                      <div className="flex items-center justify-between p-3.5 bg-white/[0.03] rounded-2xl border border-white/5 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-[10px]">4</span>
                          <span className="text-slate-200 font-semibold">
                            {isTamil ? '108 ஆம்புலன்ஸ் ஓட்டுநருடன் ஒருங்கிணைப்பு' : 'Coordinate 108 Ambulance Entry'}
                          </span>
                        </div>
                        <a
                          href={`tel:${activeEmergency.ambulance108Status.driverPhone}`}
                          className="px-4 py-1.5 bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-blue-400 font-bold rounded-xl flex items-center gap-1.5"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>{isTamil ? 'ஓட்டுநரை அழைக்க' : 'Call Driver'}</span>
                        </a>
                      </div>

                    </div>
                  </div>

                  {/* CPR Metronome visualizer embedded for on-scene guidance */}
                  <CPRMetronomeVisualizer compact={true} />
                </div>
              )}

            </div>

          </div>
        ) : (
          <div className="bg-gradient-to-b from-[#140a0a] to-[#0A0505] border border-white/10 rounded-3xl p-12 text-center shadow-2xl backdrop-blur-xl">
            <div className="w-16 h-16 rounded-3xl bg-white/[0.05] border border-white/10 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {isTamil ? 'தற்போது புதிய அவசர அழைப்புகள் ஏதுமில்லை' : 'No Active Emergencies in Your Area'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              {isTamil 
                ? 'உங்கள் கிராமப் பகுதியில் அவசர அழைப்பு வந்தவுடன் ஒலி எழுப்பி எச்சரிக்கை திரையில் தோன்றும்.' 
                : 'HeartAlarm is standing by. You will receive an immediate push alert and audible ring when someone in your village needs CPR help.'}
            </p>
          </div>
        )

      ) : (

        /* PHC CARDIAC INCIDENT REGISTRY */
        <div className="bg-gradient-to-b from-[#140a0a] to-[#0A0505] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-emerald-400" />
              <span>{isTamil ? 'கிராம இதய சிகிச்சை பதிவேடு (PHC Log)' : 'Village Cardiac Cases Follow-up Registry'}</span>
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              100% Golden Hour Rate
            </span>
          </div>

          <div className="space-y-3.5">
            {pastCases.map((c) => (
              <div
                key={c.id}
                className="p-5 bg-black/60 rounded-3xl border border-white/10 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                  <div className="font-bold text-white text-sm">{c.patientName}</div>
                  <span className="text-slate-400 font-mono text-[11px]">{c.date} | {c.id}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                  <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/5">
                    <div className="text-slate-400 text-[11px] mb-0.5">{isTamil ? 'முதலுதவி:' : 'First Aid:'}</div>
                    <div className="font-semibold text-emerald-300">{c.firstAidGiven}</div>
                  </div>
                  <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/5">
                    <div className="text-slate-400 text-[11px] mb-0.5">{isTamil ? 'மருத்துவமனை முடிவு:' : 'Outcome:'}</div>
                    <div className="text-slate-200">{c.outcome}</div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{isTamil ? 'PHC பின்தொடர் நிலை:' : 'PHC Follow-up:'} <strong className="text-emerald-400">{c.phcFollowupStatus}</strong></span>
                  <span className="text-emerald-400 font-bold">✓ Synced to DPH</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      )}

    </div>
  );
};
