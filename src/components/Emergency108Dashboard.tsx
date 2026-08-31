import React, { useState } from 'react';
import { useHeartAlarm } from '../context/HeartAlarmContext';
import { 
  Ambulance, 
  MapPin, 
  PhoneCall, 
  Activity, 
  Clock, 
  ShieldAlert, 
  Volume2, 
  CheckCircle2, 
  Radio, 
  TrendingDown, 
  Users, 
  Zap, 
  Flame, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { speakTamilOrEnglish } from '../utils/audioEngine';

export const Emergency108Dashboard: React.FC = () => {
  const {
    language,
    alerts,
    activeEmergency,
    updateAmbulanceStatus,
    selectedVillage
  } = useHeartAlarm();

  const isTamil = language === 'ta';
  const [isPlayingBotVoice, setIsPlayingBotVoice] = useState(false);

  // Play automated 108 dispatch voice broadcast
  const handlePlayVoiceBot = () => {
    if (!activeEmergency) return;
    setIsPlayingBotVoice(true);

    const broadcastEn = `This is an automated HeartAlarm alert. Suspected cardiac emergency in ${activeEmergency.villageNameEn}, ${selectedVillage.districtEn} district. Caller phone: ${activeEmergency.callerPhone}. GPS Coordinates: ${activeEmergency.gpsCoords?.lat.toFixed(4)}, ${activeEmergency.gpsCoords?.lng.toFixed(4)}. Nearest landmark: ${activeEmergency.landmark?.nameEn || activeEmergency.customLandmarkText}. Two local CPR responders are en route. 108 vehicle assigned: ${activeEmergency.ambulance108Status.incidentId}.`;
    const broadcastTa = `இது HeartAlarm தானியங்கி அவசர எச்சரிக்கை. ${activeEmergency.villageNameTa}, ${selectedVillage.districtTa} மாவட்டத்தில் இதய அவசரநிலை. அழைப்பாளர் எண்: ${activeEmergency.callerPhone}. அடையாளம்: ${activeEmergency.landmark?.nameTa || activeEmergency.customLandmarkText}. இரண்டு தன்னார்வலர்கள் சம்பவ இடத்திற்கு விரைகின்றனர். 108 வாகனம் ஒதுக்கப்பட்டுள்ளது.`;

    const text = isTamil ? broadcastTa : broadcastEn;
    speakTamilOrEnglish(text, language).then(() => {
      setIsPlayingBotVoice(false);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* 108 Command Header */}
      <div className="bg-gradient-to-b from-[#140a0a] to-[#0A0505] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 font-bold">
            <Ambulance className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-extrabold text-xs">
                EMRI 108 TAMIL NADU
              </span>
              <span className="text-xs text-slate-400 font-mono">PHC & Dispatch Telemetry Hub</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1 tracking-tight">
              {isTamil ? '108 அவசர கட்டுப்பாட்டு அறை & PHC ஒருங்கிணைப்பு' : '108 Rural Cardiac Tele-Command Center'}
            </h2>
            <p className="text-xs text-slate-400">
              {isTamil 
                ? 'முதல் 60 நிமிட தங்க மணி நேரத்திற்குள் கிராமப்புற இதய அவசரங்களை மீட்டெடுக்கும் வலையமைப்பு' 
                : 'Shrinking response time across rural Tamil Nadu via Village First-Responders & 108 Geofencing'}
            </p>
          </div>
        </div>

        {/* Live System Status pill */}
        <div className="flex items-center gap-2 bg-black/60 px-4 py-2 rounded-2xl border border-white/10 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-300 font-semibold">{isTamil ? '108 API & SMS கேட்வே தயார்' : '108 API & SMS Gateway Active'}</span>
        </div>
      </div>

      {/* SUCCESS METRICS & GOLDEN HOUR DASHBOARD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Median Alert Time */}
        <div className="p-5 bg-gradient-to-b from-[#140a0a] to-[#0A0505] border border-white/10 rounded-3xl shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>{isTamil ? 'அழைப்பு வேகம்' : 'Time to Trigger'}</span>
            <TrendingDown className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">42 sec</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {isTamil ? 'முன்பு 22 நிமிடம் தாமதம்' : 'vs 22 mins conventional delay'}
          </div>
        </div>

        {/* Metric 2: Median CPR Initiation */}
        <div className="p-5 bg-gradient-to-b from-[#140a0a] to-[#0A0505] border border-white/10 rounded-3xl shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>{isTamil ? 'முதல் CPR உதவி' : 'First CPR Help'}</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">3.1 min</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {isTamil ? 'ASHA / தன்னார்வலரால்' : 'by nearest ASHA/Volunteer'}
          </div>
        </div>

        {/* Metric 3: CPR before 108 Arrival */}
        <div className="p-5 bg-gradient-to-b from-[#140a0a] to-[#0A0505] border border-white/10 rounded-3xl shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>{isTamil ? 'முன்கூட்டியே CPR %' : 'Pre-108 CPR Rate'}</span>
            <Activity className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">86.4%</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {isTamil ? 'ஆம்புலன்ஸ் வருமுன் தொடக்கம்' : 'documented CPR before 108'}
          </div>
        </div>

        {/* Metric 4: Offline Resilience */}
        <div className="p-5 bg-gradient-to-b from-[#140a0a] to-[#0A0505] border border-white/10 rounded-3xl shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>{isTamil ? 'ஆஃப்லைன் செயல்திறன்' : 'Offline Resilience'}</span>
            <Radio className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">99.8%</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {isTamil ? 'SMS & மிஸ்ட் கால் மூலம் வெற்றி' : 'via 2G SMS / Missed call'}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: LIVE DISPATCH QUEUE & BOT TRANSMISSION (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Emergency Dispatch Card */}
          {activeEmergency && activeEmergency.status !== 'resolved' ? (
            <div className="bg-gradient-to-br from-red-950/80 via-[#120808] to-[#0A0505] border-2 border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs font-black text-red-400 uppercase tracking-widest">
                    ACTIVE INCIDENT: {activeEmergency.id}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs">
                    {activeEmergency.triggerChannel.toUpperCase()} TRIGGER
                  </span>
                </div>
              </div>

              {/* Location & GPS Data Block */}
              <div className="my-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-black/60 rounded-2xl border border-white/10">
                  <div className="text-slate-400 mb-1">{isTamil ? 'கிராமம் & மாவட்டம்:' : 'Village & District:'}</div>
                  <div className="font-bold text-white text-sm">
                    {isTamil ? activeEmergency.villageNameTa : activeEmergency.villageNameEn} ({selectedVillage.districtEn})
                  </div>
                  <div className="text-slate-400 mt-1">
                    Landmark: <span className="text-slate-200 font-semibold">{activeEmergency.landmark?.nameEn || activeEmergency.customLandmarkText}</span>
                  </div>
                </div>

                <div className="p-4 bg-black/60 rounded-2xl border border-white/10">
                  <div className="text-slate-400 mb-1">{isTamil ? 'அழைப்பாளர் & ஜி.பி.எஸ்:' : 'Caller & Coordinates:'}</div>
                  <div className="font-mono text-emerald-400 font-bold text-sm">{activeEmergency.callerPhone}</div>
                  <div className="font-mono text-slate-400 mt-1">
                    GPS: {activeEmergency.gpsCoords?.lat.toFixed(4)}, {activeEmergency.gpsCoords?.lng.toFixed(4)} (±{activeEmergency.gpsCoords?.accuracyMeters}m)
                  </div>
                </div>
              </div>

              {/* AUTOMATED 108 VOICE BOT SIMULATOR */}
              <div className="p-5 bg-black/60 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400 mb-1">
                    <Volume2 className="w-4 h-4" />
                    <span>{isTamil ? 'தானியங்கி 108 குரல் அறிவிப்பு (TTS Bot)' : 'Automated 108 Voice Bot Payload'}</span>
                  </div>
                  <p className="text-xs text-slate-400 max-w-md">
                    {isTamil 
                      ? 'கட்டுப்பாட்டு அறை ஆபரேட்டருக்கு இடம், அடையாளம் மற்றும் நிலை குறித்து குரல் மூலம் ஒலிக்கும்.' 
                      : 'Synthesized voice bot auto-speaks location, coordinates, and symptoms to 108 operator.'}
                  </p>
                </div>

                <button
                  onClick={handlePlayVoiceBot}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all whitespace-nowrap ${
                    isPlayingBotVoice
                      ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/40'
                      : 'bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 border border-white/10'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isPlayingBotVoice ? 'Broadcasting...' : (isTamil ? 'குரல் போட் கேட்க' : 'Listen to Voice Bot')}</span>
                </button>
              </div>

              {/* 108 Ambulance Status Stepper */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="text-slate-400">{isTamil ? 'ஆம்புலன்ஸ் வாகனம்:' : '108 Vehicle:'} </span>
                  <strong className="text-white font-mono">{activeEmergency.ambulance108Status.incidentId}</strong>
                  <span className="text-slate-400"> (ETA: {activeEmergency.ambulance108Status.etaMinutes} mins)</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateAmbulanceStatus(activeEmergency.id, 'en_route')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeEmergency.ambulance108Status.status === 'en_route'
                        ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                        : 'bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-300'
                    }`}
                  >
                    En Route
                  </button>
                  <button
                    onClick={() => updateAmbulanceStatus(activeEmergency.id, 'arrived')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeEmergency.ambulance108Status.status === 'arrived'
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                        : 'bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-300'
                    }`}
                  >
                    Arrived On Scene
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 bg-gradient-to-b from-[#140a0a] to-[#0A0505] border border-white/10 rounded-3xl text-center shadow-2xl backdrop-blur-xl">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-white">{isTamil ? 'அனைத்து கிராமங்களும் சீராக உள்ளன' : 'No Critical Incidents Pending'}</h3>
              <p className="text-xs text-slate-400 mt-1">{isTamil ? 'புதிய எச்சரிக்கைகள் வந்தால் உடனடியாக ஒளிரும்' : 'Standing by for next cardiac emergency dispatch.'}</p>
            </div>
          )}

          {/* ALL ALERTS INCIDENT LOG TABLE */}
          <div className="bg-gradient-to-b from-[#140a0a] to-[#0A0505] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
            <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>{isTamil ? 'சமீபத்திய அவசர அழைப்புகள் (Incident Queue)' : 'Incident Dispatch Queue'}</span>
            </h3>

            <div className="space-y-2.5">
              {alerts.map((alt) => (
                <div
                  key={alt.id}
                  className="p-4 bg-black/60 rounded-2xl border border-white/10 text-xs flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${alt.status === 'resolved' ? 'bg-slate-600' : 'bg-red-500 animate-ping'}`} />
                    <div>
                      <div className="font-bold text-white">
                        {alt.id} - {isTamil ? alt.villageNameTa : alt.villageNameEn}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {alt.patientName} | {alt.timestamp}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-slate-300 font-mono text-[10px]">
                      {alt.triggerChannel.toUpperCase()}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">
                      {alt.status.toUpperCase().replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT: ESCALATION MATRIX & CHANNEL RESILIENCE (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* AUTO-ESCALATION MATRIX CARD */}
          <div className="bg-gradient-to-b from-[#140a0a] to-[#0A0505] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
            <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{isTamil ? 'தானியங்கி விரிவுபடுத்தும் அடுக்கு (Escalation Matrix)' : 'Multi-Tier Escalation Protocol'}</span>
            </h3>

            <div className="space-y-3 text-xs">
              {/* Tier 1 */}
              <div className="p-4 bg-black/60 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className="text-emerald-400">TIER 1 (0 – 2 Mins)</span>
                  <span className="text-slate-400 font-mono">&lt; 1 KM</span>
                </div>
                <div className="text-slate-300 text-[11px]">
                  {isTamil 
                    ? 'கிராம ASHA மற்றும் உள்ளூர் கடைக்காரர் / இளைஞர் தன்னார்வலர்களுக்கு நேரடி எச்சரிக்கை.' 
                    : 'Geofenced push & SMS to immediate village ASHA and trained shopkeeper volunteers.'}
                </div>
              </div>

              {/* Tier 2 */}
              <div className="p-4 bg-black/60 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className="text-amber-400">TIER 2 (2 – 4 Mins)</span>
                  <span className="text-slate-400 font-mono">3 – 5 KM</span>
                </div>
                <div className="text-slate-300 text-[11px]">
                  {isTamil 
                    ? '2 நிமிடத்தில் ஏற்பு பெறப்படாவிடில், அருகிலுள்ள 3 கிராம தன்னார்வலர்களுக்கு எச்சரிக்கை விரியும்.' 
                    : 'Auto-expands radius to adjacent villages and Panchayat lead responders.'}
                </div>
              </div>

              {/* Tier 3 */}
              <div className="p-4 bg-black/60 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className="text-red-400">TIER 3 (4+ Mins)</span>
                  <span className="text-slate-400 font-mono">PHC & DOCTOR</span>
                </div>
                <div className="text-slate-300 text-[11px]">
                  {isTamil 
                    ? 'ஆரம்ப சுகாதார நிலைய செவிலியர் & மருத்துவருக்கு நேரடி தொலைபேசி அழைப்பு.' 
                    : 'Automated high-priority call to PHC Medical Officer & District Emergency Coordinator.'}
                </div>
              </div>
            </div>
          </div>

          {/* CHANNEL ADOPTION STATS */}
          <div className="bg-gradient-to-b from-[#140a0a] to-[#0A0505] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
            <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-400" />
              <span>{isTamil ? 'அழைப்பு வழிமுறைகளின் பங்கு' : 'Multi-Channel Alert Breakdown'}</span>
            </h3>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-semibold">{isTamil ? 'ஸ்மார்ட்போன் செயலி (App)' : 'Smartphone App Button'}</span>
                  <span className="text-emerald-400 font-mono font-bold">42%</span>
                </div>
                <div className="w-full bg-black/60 border border-white/10 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '42%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-semibold">{isTamil ? 'சாதாரண போன் மிஸ்ட் கால் (Missed Call)' : 'Basic Phone Missed Call'}</span>
                  <span className="text-amber-400 font-mono font-bold">38%</span>
                </div>
                <div className="w-full bg-black/60 border border-white/10 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '38%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-semibold">{isTamil ? 'SMS கீவேர்டு வழி (SMS HELP)' : 'SMS Keyword Payload'}</span>
                  <span className="text-blue-400 font-mono font-bold">20%</span>
                </div>
                <div className="w-full bg-black/60 border border-white/10 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 text-[11px] text-slate-400">
              {isTamil 
                ? '58% கிராமப்புற அவசரங்கள் மிஸ்ட் கால் & SMS வழியே பெறப்படுகின்றன.' 
                : '58% of rural alerts are triggered without any smartphone or active 4G data pack.'}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
