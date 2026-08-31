import React, { useState, useEffect } from 'react';
import { useHeartAlarm } from '../context/HeartAlarmContext';
import { 
  playDtmfTone, 
  playPhoneRing, 
  speakTamilOrEnglish, 
  stopSpeaking,
  cprMetronome 
} from '../utils/audioEngine';
import { 
  Phone, 
  PhoneOff, 
  MessageSquare, 
  Radio, 
  Volume2, 
  Send, 
  Hash, 
  BatteryMedium, 
  Signal, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const BasicPhoneSimulator: React.FC = () => {
  const {
    language,
    networkCondition,
    triggerEmergency,
    telephonyLogs,
    addTelephonyLog
  } = useHeartAlarm();

  const isTamil = language === 'ta';

  // Feature Phone State
  const [dialedNumber, setDialedNumber] = useState<string>('*108#');
  const [phoneScreenState, setPhoneScreenState] = useState<'idle' | 'calling_missed' | 'sms_received' | 'incoming_call' | 'in_call_ivr' | 'sms_menu'>('idle');
  const [incomingSmsText, setIncomingSmsText] = useState<string>('');
  const [ivrStep, setIvrStep] = useState<'menu' | 'cpr_playing' | 'aspirin_playing' | 'location_prompt'>('menu');
  const [smsInputText, setSmsInputText] = useState<string>('HELP KILVELUR TEMPLE');
  const [callTimer, setCallTimer] = useState<number>(0);

  // Keypad click handler with DTMF tone
  const handleKeyClick = (key: string) => {
    playDtmfTone(key);

    if (phoneScreenState === 'in_call_ivr') {
      handleIvrDtmfInput(key);
      return;
    }

    if (phoneScreenState === 'idle') {
      setDialedNumber(prev => prev.length < 15 ? prev + key : prev);
    }
  };

  // Trigger Missed Call simulation
  const handleInitiateMissedCall = () => {
    setPhoneScreenState('calling_missed');

    addTelephonyLog({
      callerNumber: '+91 98402 99120',
      type: 'incoming_missed_call',
      durationSeconds: 0,
      status: 'completed',
      ivrTranscriptEn: `Missed Call logged from +91 98402 99120 to *108# HeartAlarm gateway. Triggering automated callback & ASHA notification.`,
      ivrTranscriptTa: `+91 98402 99120 எண்ணிலிருந்து *108# மிஸ்ட் கால் பதிவு செய்யப்பட்டது. தானியங்கி திரும்ப அழைப்பு மற்றும் ASHA எச்சரிக்கை துவங்குகிறது.`
    });

    // Automatically trigger emergency in global context
    triggerEmergency('missed_call', {
      callerPhone: '+91 98402 99120',
      symptom: 'unconscious_no_breathing'
    });

    // 1.5s Missed call disconnects
    setTimeout(() => {
      setPhoneScreenState('sms_received');
      setIncomingSmsText(
        isTamil 
          ? 'HeartAlarm: அவசர எச்சரிக்கை பதிவு செய்யப்பட்டது. 108 ஆம்புலன்ஸ் & ASHA அறிவிக்கப்பட்டுள்ளனர். ஆடியோ வழிகாட்டலுக்கு 3 வினாடியில் அழைப்பு வரும்...' 
          : 'HeartAlarm: Emergency Alert Registered. 108 & Local ASHAs alerted. Outbound IVR audio callback in 3 seconds...'
      );

      // Outbound IVR Callback arrives after 2.5 seconds
      setTimeout(() => {
        playPhoneRing();
        setPhoneScreenState('incoming_call');
      }, 2500);
    }, 1500);
  };

  // Answer the IVR Callback
  const handleAnswerIvrCall = () => {
    setPhoneScreenState('in_call_ivr');
    setIvrStep('menu');
    setCallTimer(0);

    const welcomeMsg = isTamil 
      ? 'வணக்கம். இது HeartAlarm இதய அவசர சேவை. நோயாளிக்கு மயக்கம் அல்லது மூச்சில்லை என்றால் எண் 1 அழுத்தவும். நெஞ்சு வலி மட்டும் இருந்தால் எண் 2 அழுத்தவும். CPR துடிப்பு மீண்டும் கேட்க எண் 9 அழுத்தவும்.'
      : 'Welcome to HeartAlarm Emergency Callback. Press 1 for Unconscious or No Breathing CPR. Press 2 for Severe Chest Pain Aspirin guidance. Press 9 to repeat.';

    speakTamilOrEnglish(welcomeMsg, language);

    addTelephonyLog({
      callerNumber: 'HEARTALARM-IVR',
      type: 'outgoing_ivr_callback',
      durationSeconds: 15,
      status: 'connected',
      ivrTranscriptEn: 'Outbound IVR connected. Spoken Menu: [1: Unconscious / CPR] [2: Chest Pain] [9: Replay].',
      ivrTranscriptTa: 'தானியங்கி அழைப்பு இணைக்கப்பட்டது: [1: மயக்கம் / CPR] [2: நெஞ்சு வலி] [9: மீண்டும் கேட்க].'
    });
  };

  // Handle Keypad presses during IVR call
  const handleIvrDtmfInput = (digit: string) => {
    if (digit === '1') {
      setIvrStep('cpr_playing');
      const cprAudio = isTamil 
        ? 'மார்பின் மையப்பகுதியில் கை வைத்து நிமிடத்திற்கு 110 முறை இடைவிடாது வேகமாக அழுத்தவும். ஒன்று, இரண்டு, மூன்று...' 
        : 'Place hands in center of chest and push hard and fast at 110 beats per minute. One, two, three...';
      
      speakTamilOrEnglish(cprAudio, language);
      cprMetronome.start();

      addTelephonyLog({
        callerNumber: '+91 98402 99120',
        type: 'outgoing_ivr_callback',
        durationSeconds: 30,
        status: 'connected',
        dtmfKey: '1',
        ivrTranscriptEn: 'User pressed Key 1: Streaming Tamil Hands-Only CPR audio and 110 BPM metronome rhythm.',
        ivrTranscriptTa: 'பயனர் எண் 1 அழுத்தினார்: கைமுறை CPR மற்றும் 110 BPM துடிப்பு ஒலி இயக்கப்பட்டது.'
      });
    } else if (digit === '2') {
      setIvrStep('aspirin_playing');
      cprMetronome.stop();
      const aspirinAudio = isTamil 
        ? 'நோயாளிக்கு சுயநினைவு இருந்தால் 300 மில்லிகிராம் ஆஸ்பிரின் மாத்திரையை மென்று சாப்பிட கொடுக்கவும். ஓய்வாக உட்கார வைக்கவும்.' 
        : 'If patient is conscious, have them chew 300mg Aspirin immediately and rest comfortably.';
      
      speakTamilOrEnglish(aspirinAudio, language);

      addTelephonyLog({
        callerNumber: '+91 98402 99120',
        type: 'outgoing_ivr_callback',
        durationSeconds: 22,
        status: 'connected',
        dtmfKey: '2',
        ivrTranscriptEn: 'User pressed Key 2: Streaming Aspirin chewing protocol and recovery instructions.',
        ivrTranscriptTa: 'பயனர் எண் 2 அழுத்தினார்: ஆஸ்பிரின் மெல்லுதல் மற்றும் முதலுதவி வழிகாட்டல்.'
      });
    } else if (digit === '9') {
      setIvrStep('cpr_playing');
      speakTamilOrEnglish(
        isTamil ? 'CPR துடிப்பு ஒலி மீண்டும் இயக்கப்படுகிறது...' : 'Repeating CPR rhythm...',
        language
      );
      cprMetronome.start();
    }
  };

  // Hangup call
  const handleHangupCall = () => {
    stopSpeaking();
    cprMetronome.stop();
    setPhoneScreenState('idle');
    setDialedNumber('*108#');
    setCallTimer(0);
  };

  // Send SMS Trigger
  const handleSendSMS = () => {
    triggerEmergency('sms', {
      callerPhone: '+91 98402 99120',
      customNote: smsInputText,
      symptom: 'severe_chest_pain'
    });

    setPhoneScreenState('sms_received');
    setIncomingSmsText(
      isTamil 
        ? `HeartAlarm SMS பெறப்பட்டது: "${smsInputText}". 108 & ASHAவுக்கு தகவல் அனுப்பப்பட்டது. வழிகாட்டலுக்கு 3 வினாடியில் அழைப்பு வரும்.` 
        : `HeartAlarm SMS Received: "${smsInputText}". 108 & ASHA dispatched. Automated IVR callback in 3s.`
    );

    setTimeout(() => {
      playPhoneRing();
      setPhoneScreenState('incoming_call');
    }, 2500);
  };

  // Call timer counter
  useEffect(() => {
    let interval: number;
    if (phoneScreenState === 'in_call_ivr') {
      interval = window.setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phoneScreenState]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      
      {/* Title & Concept summary */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {isTamil ? 'சாதாரண போன் & மிஸ்ட் கால் தொழில்நுட்பம்' : 'Basic Phone & IVR Telephony Engine'}
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">
              NO INTERNET REQUIRED
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">
            {isTamil ? 'மிஸ்ட் கால் / SMS அவசர உதவி சிமுலேட்டர்' : 'Interactive Feature Phone Simulator'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {isTamil 
              ? 'ஸ்மார்ட்போன் இல்லாத எளிய மக்களுக்கும், பலவீனமான சிக்னல் உள்ள மலைக்கிராமங்களுக்கும் மிஸ்ட் கால் & SMS வழியே 108 மற்றும் தமிழ் குரல் வழிகாட்டல் இயங்கும்.' 
              : 'Empowers low-literacy families with basic 2G feature phones to trigger 108 dispatch & receive automated Tamil voice CPR guidance.'}
          </p>
        </div>

        {/* Quick Demo Action Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setDialedNumber('*108#');
              handleInitiateMissedCall();
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-amber-600/20 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isTamil ? 'மிஸ்ட் கால் டெமோ' : 'Test Missed Call Flow'}</span>
          </button>

          <button
            onClick={() => {
              setPhoneScreenState('sms_menu');
            }}
            className="px-4 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{isTamil ? 'SMS டெமோ' : 'Test SMS Flow'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT / CENTER: PHYSICAL RETRO FEATURE PHONE CASING */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-[310px] bg-gradient-to-b from-[#1c1414] via-[#120a0a] to-[#080404] rounded-[44px] p-5 shadow-2xl border-4 border-white/10 shadow-black/80 relative backdrop-blur-xl">
            
            {/* Phone Top Earpiece Grill */}
            <div className="w-16 h-1.5 bg-white/20 rounded-full mx-auto mb-4" />

            {/* MONOCHROME / LCD RETRO SCREEN */}
            <div className="bg-[#b9d3b0] text-[#1c2e1b] rounded-2xl p-3.5 font-mono shadow-inner border-2 border-[#8fa886] mb-5 min-h-[190px] flex flex-col justify-between select-none">
              
              {/* Screen Top Status Bar */}
              <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-[#9eb895] font-bold">
                <div className="flex items-center gap-1">
                  <Signal className="w-3.5 h-3.5" />
                  <span>{networkCondition === 'offline_sms' ? '2G EDGE' : 'BSNL 2G'}</span>
                </div>
                <span>10:42 AM</span>
                <div className="flex items-center gap-1">
                  <BatteryMedium className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Screen Content Body */}
              <div className="py-2 flex-1 flex flex-col justify-center text-center">
                
                {/* IDLE SCREEN */}
                {phoneScreenState === 'idle' && (
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-[#355233]">HeartAlarm TN</div>
                    <div className="text-xl font-black tracking-wider my-2">{dialedNumber || '___'}</div>
                    <div className="text-[10px] text-[#41613f]">
                      {isTamil ? 'அழைக்க பச்சை பட்டன் அழுத்தவும்' : 'Press Green to Missed Call'}
                    </div>
                  </div>
                )}

                {/* CALLING MISSED CALL */}
                {phoneScreenState === 'calling_missed' && (
                  <div className="animate-pulse">
                    <div className="text-[10px] uppercase">Connecting Gateway</div>
                    <div className="text-lg font-black my-1">{dialedNumber}</div>
                    <div className="text-[11px] font-bold text-red-900">
                      {isTamil ? 'ரிங் ஆகிறது... (Missed Call)' : 'Ringing... (Logging Alert)'}
                    </div>
                  </div>
                )}

                {/* SMS RECEIVED POPUP */}
                {phoneScreenState === 'sms_received' && (
                  <div className="text-left bg-[#a5c29b] p-2 rounded border border-[#839e7a] text-[10px] leading-tight">
                    <div className="font-bold mb-1 flex items-center gap-1 text-[#172b16]">
                      <MessageSquare className="w-3 h-3" />
                      <span>{isTamil ? 'புதிய SMS: HeartAlarm' : 'New SMS: HeartAlarm'}</span>
                    </div>
                    <div>{incomingSmsText}</div>
                  </div>
                )}

                {/* INCOMING CALLBACK RING */}
                {phoneScreenState === 'incoming_call' && (
                  <div className="animate-bounce">
                    <div className="text-[10px] uppercase font-bold text-[#1a2d19]">INCOMING CALLBACK</div>
                    <div className="text-base font-black my-1">HeartAlarm IVR</div>
                    <div className="text-[11px] font-bold bg-[#8ea885] px-2 py-0.5 rounded-full inline-block">
                      +91 800-HEART-TN
                    </div>
                    <div className="text-[9px] mt-1">Press Green [CALL] to listen</div>
                  </div>
                )}

                {/* ACTIVE IN-CALL IVR */}
                {phoneScreenState === 'in_call_ivr' && (
                  <div className="text-left text-[10px] leading-snug">
                    <div className="flex justify-between items-center border-b border-[#9eb895] pb-1 font-bold text-[11px]">
                      <span>IVR TAMIL VOICE</span>
                      <span>{Math.floor(callTimer / 60)}:{String(callTimer % 60).padStart(2, '0')}</span>
                    </div>

                    {ivrStep === 'menu' && (
                      <div className="mt-1 space-y-1">
                        <div className="font-bold text-[#142613]">{isTamil ? 'குரல் மெனு (Tamil IVR):' : 'Spoken Menu:'}</div>
                        <div>1 - {isTamil ? 'மயக்கம் / CPR துடிப்பு' : 'Unconscious / CPR'}</div>
                        <div>2 - {isTamil ? 'நெஞ்சு வலி / ஆஸ்பிரின்' : 'Chest Pain / Aspirin'}</div>
                        <div>9 - {isTamil ? 'CPR ஒலி மீண்டும்' : 'Replay Beat'}</div>
                      </div>
                    )}

                    {ivrStep === 'cpr_playing' && (
                      <div className="mt-1">
                        <div className="font-black text-[11px] text-[#142613] flex items-center gap-1 animate-pulse">
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>110 BPM CPR BEAT ACTIVE</span>
                        </div>
                        <div className="mt-1 text-[9px]">
                          {isTamil ? 'மார்பின் நடுவில் கைகளை வைத்து அழுத்தவும்' : 'Push hard & fast on chest center'}
                        </div>
                      </div>
                    )}

                    {ivrStep === 'aspirin_playing' && (
                      <div className="mt-1">
                        <div className="font-black text-[11px] text-[#142613]">
                          ASPIRIN 300mg GUIDANCE
                        </div>
                        <div className="mt-1 text-[9px]">
                          {isTamil ? '300mg ஆஸ்பிரின் மெல்ல கொடுக்கவும்' : 'Chew 300mg Aspirin immediately'}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SMS COMPOSE SCREEN */}
                {phoneScreenState === 'sms_menu' && (
                  <div className="text-left text-[10px]">
                    <div className="font-bold border-b border-[#9eb895] pb-0.5 mb-1">
                      {isTamil ? 'SMS அனுப்ப: 56767' : 'Write SMS to: 56767'}
                    </div>
                    <div className="bg-[#9eb895] p-1.5 rounded font-mono font-bold">
                      {smsInputText}
                    </div>
                    <div className="text-[9px] mt-1 text-[#3b5938]">
                      Press [SEND] to alert 108
                    </div>
                  </div>
                )}

              </div>

              {/* Screen Footer Softkeys */}
              <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-[#9eb895] font-bold">
                <span>
                  {phoneScreenState === 'in_call_ivr' ? 'Options' : (phoneScreenState === 'sms_menu' ? 'Send' : 'Menu')}
                </span>
                <span>
                  {phoneScreenState === 'in_call_ivr' ? 'End' : (phoneScreenState === 'idle' ? 'Clear' : 'Back')}
                </span>
              </div>
            </div>

            {/* HARDWARE FUNCTION BUTTONS */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {/* Green Call Button */}
              <button
                onClick={() => {
                  playDtmfTone('5');
                  if (phoneScreenState === 'incoming_call') {
                    handleAnswerIvrCall();
                  } else if (phoneScreenState === 'sms_menu') {
                    handleSendSMS();
                  } else {
                    handleInitiateMissedCall();
                  }
                }}
                className="py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-2xl text-xs flex items-center justify-center shadow-lg shadow-emerald-600/30 border border-emerald-400/40 cursor-pointer"
                title="Call / Answer"
              >
                <Phone className="w-4 h-4" />
              </button>

              {/* Middle D-Pad / Select */}
              <button
                onClick={() => {
                  playDtmfTone('0');
                  if (phoneScreenState === 'sms_menu') {
                    handleSendSMS();
                  } else {
                    setPhoneScreenState('sms_menu');
                  }
                }}
                className="py-2.5 bg-white/[0.08] hover:bg-white/[0.15] active:scale-95 text-slate-200 font-bold rounded-2xl text-[10px] flex items-center justify-center border border-white/10 cursor-pointer"
              >
                OK
              </button>

              {/* Red End / Hangup Button */}
              <button
                onClick={() => {
                  playDtmfTone('0');
                  handleHangupCall();
                }}
                className="py-2.5 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold rounded-2xl text-xs flex items-center justify-center shadow-lg shadow-red-600/30 border border-red-400/40 cursor-pointer"
                title="End Call / Clear"
              >
                <PhoneOff className="w-4 h-4" />
              </button>
            </div>

            {/* NUMERIC KEYPAD 1-9, *, 0, # */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { digit: '1', sub: '.,' },
                { digit: '2', sub: 'ABC' },
                { digit: '3', sub: 'DEF' },
                { digit: '4', sub: 'GHI' },
                { digit: '5', sub: 'JKL' },
                { digit: '6', sub: 'MNO' },
                { digit: '7', sub: 'PQRS' },
                { digit: '8', sub: 'TUV' },
                { digit: '9', sub: 'WXYZ' },
                { digit: '*', sub: 'P' },
                { digit: '0', sub: '+' },
                { digit: '#', sub: 'W' },
              ].map((k) => (
                <button
                  key={k.digit}
                  onClick={() => handleKeyClick(k.digit)}
                  className="py-2.5 bg-white/[0.04] hover:bg-white/[0.09] active:bg-white/[0.15] active:scale-95 text-slate-100 rounded-2xl flex flex-col items-center justify-center shadow-md border border-white/10 transition-all cursor-pointer"
                >
                  <span className="text-sm font-bold leading-none">{k.digit}</span>
                  <span className="text-[8px] text-slate-400 font-mono tracking-tighter leading-none mt-0.5">
                    {k.sub}
                  </span>
                </button>
              ))}
            </div>

            {/* Bottom Speaker grill */}
            <div className="mt-4 flex justify-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="w-1 h-1 rounded-full bg-white/20" />
            </div>

          </div>
        </div>

        {/* RIGHT: REAL-TIME TELEPHONY GATEWAY LOGS & ARCHITECTURE BREAKDOWN */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* How Basic Phone Integration Works */}
          <div className="bg-gradient-to-b from-[#140a0a] to-[#0A0505] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Radio className="w-5 h-5 text-amber-400" />
              <span>{isTamil ? 'மிஸ்ட் கால் & IVR இயங்கும் விதம்' : 'Missed Call & IVR Telephony Architecture'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 bg-black/60 rounded-2xl border border-white/10">
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center mb-2.5 border border-amber-500/30">1</div>
                <div className="font-bold text-white mb-1">{isTamil ? '1. மிஸ்ட் கால் தூண்டல்' : '1. Missed Call Trigger'}</div>
                <div className="text-slate-400 text-[11px] leading-relaxed">
                  {isTamil ? 'கட்டணமில்லா எண்ணுக்கு அழைத்ததும் தானாக கட் ஆகி சர்வரில் பதிவாகிறது.' : 'Free missed call logs caller ID & matches pre-registered village profile.'}
                </div>
              </div>

              <div className="p-4 bg-black/60 rounded-2xl border border-white/10">
                <div className="w-7 h-7 rounded-xl bg-red-500/20 text-red-400 font-bold flex items-center justify-center mb-2.5 border border-red-500/30">2</div>
                <div className="font-bold text-white mb-1">{isTamil ? '2. தானியங்கி 108 & ASHA' : '2. Parallel Alerts'}</div>
                <div className="text-slate-400 text-[11px] leading-relaxed">
                  {isTamil ? 'அதே வினாடியில் 108 கன்ட்ரோல் ரூம் மற்றும் அருகிலுள்ள ASHAக்களுக்கு SMS/புஷ் செல்கிறது.' : 'Auto-notifies 108 dispatch queue & geofenced village volunteers via SMS.'}
                </div>
              </div>

              <div className="p-4 bg-black/60 rounded-2xl border border-white/10">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center mb-2.5 border border-emerald-500/30">3</div>
                <div className="font-bold text-white mb-1">{isTamil ? '3. தமிழ் IVR திரும்ப அழைப்பு' : '3. Tamil Audio IVR'}</div>
                <div className="text-slate-400 text-[11px] leading-relaxed">
                  {isTamil ? '3 வினாடியில் திரும்ப அழைத்து 110 BPM CPR துடிப்பு ஒலியை போனில் ஒலிக்கும்.' : 'Outbound call streams 110 BPM CPR rhythm & Tamil emergency steps over voice line.'}
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Telephony Gateway Feed */}
          <div className="bg-gradient-to-b from-[#140a0a] to-[#0A0505] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{isTamil ? 'நேரலை டெலிபோனி பதிவுகள் (Telephony Log)' : 'Live Telephony & Gateway Events'}</span>
              </h4>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-slate-400 font-mono font-bold">
                {telephonyLogs.length} Events
              </span>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {telephonyLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 bg-black/60 rounded-2xl border border-white/10 text-xs font-mono"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      log.type === 'incoming_missed_call'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : log.type === 'outgoing_ivr_callback'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : log.type === 'incoming_sms'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {log.type.toUpperCase().replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-400 text-[10px]">{log.timestamp}</span>
                  </div>

                  <div className="text-slate-200 mt-1 font-sans text-xs">
                    {isTamil ? log.ivrTranscriptTa : log.ivrTranscriptEn}
                  </div>

                  {log.callerNumber && (
                    <div className="mt-1.5 text-[10px] text-slate-400 font-mono">
                      Caller / Channel: {log.callerNumber} {log.dtmfKey ? `| DTMF Key Pressed: [${log.dtmfKey}]` : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
