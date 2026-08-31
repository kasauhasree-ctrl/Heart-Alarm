import React, { useState, useEffect } from 'react';
import { useHeartAlarm } from '../context/HeartAlarmContext';
import { Activity, Play, Square, Heart, Volume2, VolumeX, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export const CPRMetronomeVisualizer: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { 
    language, 
    isMetronomeActive, 
    toggleMetronome, 
    metronomeBeatCount, 
    updateCPRStatus, 
    activeEmergency 
  } = useHeartAlarm();

  const [practiceTaps, setPracticeTaps] = useState<number[]>([]);
  const [userBpm, setUserBpm] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');

  const isTamil = language === 'ta';

  // Calculate practice BPM when user taps
  const handlePracticeTap = () => {
    const now = Date.now();
    const newTaps = [...practiceTaps.slice(-4), now];
    setPracticeTaps(newTaps);

    if (newTaps.length >= 3) {
      const intervals = [];
      for (let i = 1; i < newTaps.length; i++) {
        intervals.push(newTaps[i] - newTaps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      setUserBpm(calculatedBpm);

      if (calculatedBpm >= 100 && calculatedBpm <= 125) {
        setFeedback(isTamil ? 'அருமை! சரியான CPR வேகம் (110 BPM)' : 'Perfect! Ideal CPR rhythm (110 BPM)');
      } else if (calculatedBpm < 100) {
        setFeedback(isTamil ? 'இன்னும் வேகமாக அழுத்தவும் (<100 BPM)' : 'Push faster! Target 100-120 BPM');
      } else {
        setFeedback(isTamil ? 'சிறிது வேகம் குறைக்கவும் (>125 BPM)' : 'A bit too fast! Relax tempo slightly');
      }
    }
  };

  useEffect(() => {
    if (isMetronomeActive && activeEmergency) {
      updateCPRStatus(activeEmergency.id, true);
    }
  }, [isMetronomeActive]);

  if (compact) {
    return (
      <div className="bg-[#0A0505]/90 backdrop-blur-xl border border-red-500/30 rounded-3xl p-4 flex items-center justify-between shadow-2xl shadow-black/60">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isMetronomeActive ? 'bg-gradient-to-tr from-red-600 to-rose-500 animate-cpr-beat shadow-lg shadow-red-600/50' : 'bg-white/[0.05] border border-white/10'}`}>
              <Heart className={`w-6 h-6 text-white ${isMetronomeActive ? 'fill-white' : ''}`} />
            </div>
            {isMetronomeActive && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>{isTamil ? 'CPR மெட்ரோனோம்' : 'CPR Metronome'}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-mono font-bold border border-red-500/30">110 BPM</span>
            </div>
            <div className="text-xs text-slate-400">
              {isMetronomeActive 
                ? (isTamil ? `துடிப்புகள்: ${metronomeBeatCount}` : `Beats: ${metronomeBeatCount}`) 
                : (isTamil ? 'இடைவிடாது மார்பில் அழுத்தவும்' : 'Continuous chest compressions')}
            </div>
          </div>
        </div>

        <button
          onClick={toggleMetronome}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${
            isMetronomeActive 
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30' 
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
          }`}
        >
          {isMetronomeActive ? (
            <>
              <Square className="w-4 h-4 fill-white" />
              <span>{isTamil ? 'நிறுத்து' : 'Stop Beat'}</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>{isTamil ? 'துடிப்பு ஒலி' : 'Start Beat'}</span>
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#140a0a] to-[#0A0505] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Background rhythm pulse glow */}
      {isMetronomeActive && (
        <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none" />
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <Activity className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {isTamil ? 'கைமுறை CPR வழிகாட்டி & துடிப்பு' : 'Hands-Only CPR Metronome & Depth Guide'}
            </h3>
            <p className="text-xs text-slate-400">
              {isTamil ? 'அமெரிக்க இதய சங்கம் & 108 நெறிமுறை: நிமிடத்திற்கு 100-120 துடிப்பு' : 'AHA & 108 Emergency Protocol: 100-120 compressions per min'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full text-xs font-mono font-bold">
            110 BPM TARGET
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left: Compression Visualizer & Beat counter */}
        <div className="flex flex-col items-center justify-center p-6 bg-black/60 rounded-3xl border border-white/10">
          <div className="relative mb-4">
            <motion.div
              animate={{
                scale: isMetronomeActive ? [1, 1.15, 1] : 1
              }}
              transition={{
                duration: 0.545, // 110 bpm
                repeat: isMetronomeActive ? Infinity : 0,
                ease: 'easeInOut'
              }}
              className={`w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-2xl transition-colors ${
                isMetronomeActive 
                  ? 'bg-gradient-to-tr from-red-700 to-rose-500 text-white shadow-red-600/50 ring-8 ring-red-500/20' 
                  : 'bg-white/[0.05] text-slate-400 border border-white/10'
              }`}
            >
              <Heart className={`w-10 h-10 ${isMetronomeActive ? 'fill-white animate-pulse' : ''}`} />
              <span className="text-xs font-bold mt-1">
                {isMetronomeActive ? `${metronomeBeatCount}` : '110 BPM'}
              </span>
            </motion.div>
          </div>

          <div className="text-center">
            <div className="text-sm font-bold text-white">
              {isMetronomeActive ? (isTamil ? 'தொடர்ந்து மார்பை அழுத்தவும்!' : 'Compress Chest Hard & Fast!') : (isTamil ? 'CPR துடிப்பு தயார்' : 'Rhythm Ready')}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {isTamil ? 'மார்பின் நடு எலும்பில் 5 செ.மீ ஆழம்' : 'Depth: 5-6 cm (2 inches) in chest center'}
            </div>
          </div>

          <button
            onClick={toggleMetronome}
            className={`mt-4 w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              isMetronomeActive
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
            }`}
          >
            {isMetronomeActive ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>{isTamil ? 'துடிப்பு ஒலியை நிறுத்து' : 'Pause Metronome'}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>{isTamil ? '110 BPM துடிப்பு தொடங்கு' : 'Start 110 BPM Metronome'}</span>
              </>
            )}
          </button>
        </div>

        {/* Center: Anatomical Hand Placement Graphic */}
        <div className="p-5 bg-black/60 rounded-3xl border border-white/10 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-3 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>{isTamil ? 'சரியான கை வைக்கும் முறை' : 'Hand Placement Protocol'}</span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5 p-3 bg-white/[0.03] rounded-2xl border border-white/5">
                <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">1</span>
                <span>{isTamil ? 'மார்பின் நடுவில் கீழ் பாதி எலும்பில் (Sternum) ஒரு கையின் கீழ் பகுதியை வைக்கவும்.' : 'Place heel of one hand on center of breastbone.'}</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 bg-white/[0.03] rounded-2xl border border-white/5">
                <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">2</span>
                <span>{isTamil ? 'மற்றொரு கையை அதன் மேல் வைத்து விரல்களை கோர்த்துக்கொள்ளவும்.' : 'Interlock second hand on top. Lock elbows straight.'}</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 bg-white/[0.03] rounded-2xl border border-white/5">
                <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">3</span>
                <span>{isTamil ? 'ஒவ்வொரு அழுத்தத்திற்குப் பிறகும் மார்பு முழுமையாக மேலே எழும்ப அனுமதிக்கவும்.' : 'Allow full chest recoil after each push.'}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>{isTamil ? 'நோக்கம்:' : 'Goal:'}</span>
            <span className="font-semibold text-slate-200">{isTamil ? 'மூளைக்கு இடைவிடாத ரத்த ஓட்டம்' : 'Maintain cerebral perfusion'}</span>
          </div>
        </div>

        {/* Right: Interactive Rhythm Practice Test */}
        <div className="p-5 bg-black/60 rounded-3xl border border-white/10 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                <span>{isTamil ? 'வேக பயிற்சி பரிசோதனை' : 'Interactive Tap Test'}</span>
              </div>
              {userBpm && (
                <span className="text-xs font-mono font-bold text-amber-300 px-2.5 py-0.5 bg-amber-500/10 rounded-full border border-amber-500/20">
                  {userBpm} BPM
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 mb-3">
              {isTamil ? 'கீழே உள்ள பட்டனை தட்டி உங்கள் CPR வேகத்தை சோதிக்கவும்:' : 'Tap the button repeatedly to test your natural compression pace:'}
            </p>

            <button
              onClick={handlePracticeTap}
              className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-amber-600/20 flex flex-col items-center justify-center gap-1 transition-all"
            >
              <Heart className="w-6 h-6 fill-white" />
              <span className="text-xs font-black">{isTamil ? 'இங்கு தட்டவும் (Tap Here)' : 'TAP IN RHYTHM'}</span>
            </button>
          </div>

          {feedback && (
            <div className="mt-3 p-2.5 bg-white/[0.05] rounded-2xl text-center text-xs font-semibold text-emerald-300 border border-emerald-500/30">
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
