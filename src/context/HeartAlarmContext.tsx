import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Language, 
  NetworkCondition, 
  TriggerChannel, 
  EmergencyAlert, 
  Responder, 
  Village, 
  VillageLandmark, 
  TrainingModule, 
  TelephonyCallLog 
} from '../types';
import { 
  TAMIL_NADU_VILLAGES, 
  INITIAL_RESPONDERS, 
  TRAINING_MODULES, 
  INITIAL_ALERTS, 
  INITIAL_TELEPHONY_LOGS 
} from '../data/mockData';
import { CPR_VOICE_SCRIPTS, COMMON_TRANSLATIONS } from '../data/translations';
import { 
  cprMetronome, 
  playEmergencyAlertSound, 
  playSuccessChime, 
  speakTamilOrEnglish, 
  stopSpeaking 
} from '../utils/audioEngine';

export type UserRole = 'villager' | 'basic_phone' | 'asha_volunteer' | 'control_108' | 'training' | 'overview_grid';

interface HeartAlarmContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  networkCondition: NetworkCondition;
  setNetworkCondition: (net: NetworkCondition) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  selectedVillage: Village;
  setSelectedVillage: (village: Village) => void;
  
  // Emergency Alert state
  alerts: EmergencyAlert[];
  activeEmergency: EmergencyAlert | null;
  responders: Responder[];
  telephonyLogs: TelephonyCallLog[];
  
  // Actions
  triggerEmergency: (channel: TriggerChannel, customData?: {
    symptom?: EmergencyAlert['symptomType'];
    landmark?: VillageLandmark;
    customNote?: string;
    callerPhone?: string;
  }) => EmergencyAlert;
  cancelOrResolveEmergency: (alertId: string) => void;
  acceptAlertByResponder: (responderId: string, alertId: string) => void;
  markResponderOnScene: (responderId: string, alertId: string) => void;
  updateCPRStatus: (alertId: string, inProgress: boolean) => void;
  updateAspirinStatus: (alertId: string, given: boolean) => void;
  updateAmbulanceStatus: (alertId: string, status: 'dispatched' | 'en_route' | 'arrived') => void;
  
  // Metronome & Audio Voice
  isMetronomeActive: boolean;
  metronomeBeatCount: number;
  toggleMetronome: () => void;
  activeVoiceStep: number;
  playStepVoiceAudio: (stepIndex: number) => void;
  isVoicePlaying: boolean;
  stopVoiceAudio: () => void;
  
  // Training
  trainingModules: TrainingModule[];
  completeQuiz: (moduleId: string, score: number) => void;
  downloadOfflineModule: (moduleId: string) => void;
  
  // Telephony Simulation helper
  simulateMissedCall: (phone: string) => void;
  simulateIncomingSMS: (phone: string, text: string) => void;
  addTelephonyLog: (log: Omit<TelephonyCallLog, 'id' | 'timestamp'>) => void;

  // Reset demo state
  resetAllDemoData: () => void;
}

const HeartAlarmContext = createContext<HeartAlarmContextType | undefined>(undefined);

export const HeartAlarmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ta');
  const [networkCondition, setNetworkCondition] = useState<NetworkCondition>('4g');
  const [activeRole, setActiveRole] = useState<UserRole>('villager');
  const [selectedVillage, setSelectedVillage] = useState<Village>(TAMIL_NADU_VILLAGES[0]);

  const [alerts, setAlerts] = useState<EmergencyAlert[]>(INITIAL_ALERTS);
  const [activeEmergency, setActiveEmergency] = useState<EmergencyAlert | null>(INITIAL_ALERTS[0] || null);
  const [responders, setResponders] = useState<Responder[]>(INITIAL_RESPONDERS);
  const [telephonyLogs, setTelephonyLogs] = useState<TelephonyCallLog[]>(INITIAL_TELEPHONY_LOGS);
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>(TRAINING_MODULES);

  // Audio states
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [metronomeBeatCount, setMetronomeBeatCount] = useState(0);
  const [activeVoiceStep, setActiveVoiceStep] = useState(0);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);

  // Metronome ticker integration
  const toggleMetronome = () => {
    if (isMetronomeActive) {
      cprMetronome.stop();
      setIsMetronomeActive(false);
    } else {
      cprMetronome.start((beat) => {
        setMetronomeBeatCount(beat);
      }, 110);
      setIsMetronomeActive(true);
      if (activeEmergency) {
        updateCPRStatus(activeEmergency.id, true);
      }
    }
  };

  // Translation helper
  const t = (key: string): string => {
    if (COMMON_TRANSLATIONS[key] && COMMON_TRANSLATIONS[key][language]) {
      return COMMON_TRANSLATIONS[key][language];
    }
    if (COMMON_TRANSLATIONS[key] && COMMON_TRANSLATIONS[key]['en']) {
      return COMMON_TRANSLATIONS[key]['en'];
    }
    return key;
  };

  // Voice step playback in chosen multilingual language
  const playStepVoiceAudio = (stepIndex: number) => {
    setActiveVoiceStep(stepIndex);
    setIsVoicePlaying(true);

    const scripts = CPR_VOICE_SCRIPTS[language] || CPR_VOICE_SCRIPTS['ta'];
    const script = scripts[stepIndex] || scripts[0];

    speakTamilOrEnglish(script, language).then(() => {
      setIsVoicePlaying(false);
    });
  };

  const stopVoiceAudio = () => {
    stopSpeaking();
    setIsVoicePlaying(false);
  };

  // Trigger an emergency alert
  const triggerEmergency = (
    channel: TriggerChannel,
    customData?: {
      symptom?: EmergencyAlert['symptomType'];
      landmark?: VillageLandmark;
      customNote?: string;
      callerPhone?: string;
    }
  ): EmergencyAlert => {
    playEmergencyAlertSound();

    const newId = `HA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const selectedLandmark = customData?.landmark || selectedVillage.landmarks[0];
    const phone = customData?.callerPhone || '+91 98401 23456';
    const symptom = customData?.symptom || 'unconscious_no_breathing';

    const smsCode = `HA ALERT:${newId} VIL:${selectedVillage.nameEn.split(' ')[0].toUpperCase()} LMK:${selectedLandmark?.nameEn.substring(0, 15).toUpperCase()} SYM:${symptom}`;

    const newAlert: EmergencyAlert = {
      id: newId,
      triggerChannel: channel,
      patientName: 'Kuppusamy (குப்புசாமி - Age 62)',
      callerPhone: phone,
      villageId: selectedVillage.id,
      villageNameEn: selectedVillage.nameEn,
      villageNameTa: selectedVillage.nameTa,
      landmark: selectedLandmark,
      customLandmarkText: customData?.customNote || `${selectedLandmark.nameEn}, near old ration shop`,
      symptomType: symptom,
      status: 'responders_alerted',
      escalationLevel: 'tier1_local',
      timestamp: 'Just now',
      elapsedSeconds: 0,
      gpsCoords: {
        lat: selectedVillage.centerLat + (Math.random() - 0.5) * 0.003,
        lng: selectedVillage.centerLng + (Math.random() - 0.5) * 0.003,
        accuracyMeters: networkCondition === '4g' ? 8 : (networkCondition === '2g_weak' ? 45 : 0)
      },
      assignedResponders: responders.map(r => ({
        responderId: r.id,
        status: 'alerted',
        etaMinutes: r.etaMinutes
      })),
      ambulance108Status: {
        incidentId: `TN108-DISP-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'dispatched',
        etaMinutes: selectedVillage.ambulanceEtaMins,
        driverName: 'S. Shanmugam',
        driverPhone: '+91 94433 10800'
      },
      smsPayloadSent: smsCode,
      cprInitiated: false,
      aspirinAdministered: false
    };

    setAlerts(prev => [newAlert, ...prev]);
    setActiveEmergency(newAlert);

    // Update responders to alerted
    setResponders(prev => prev.map(r => ({
      ...r,
      status: 'alerted'
    })));

    // Auto add telephony log
    const telephonyEntry: TelephonyCallLog = {
      id: `call_${Date.now()}`,
      callerNumber: phone,
      type: channel === 'missed_call' ? 'incoming_missed_call' : (channel === 'sms' ? 'incoming_sms' : 'outgoing_108_tts'),
      timestamp: 'Just now',
      durationSeconds: channel === 'missed_call' ? 0 : 35,
      status: 'completed',
      ivrTranscriptEn: `Emergency triggered via ${channel.toUpperCase()}. 108 Dispatcher connected with automated speech payload. Village: ${selectedVillage.nameEn}.`,
      ivrTranscriptTa: `${channel.toUpperCase()} வழியாக அவசர அழைப்பு. 108 கட்டுப்பாட்டு அறை மற்றும் கிராம தன்னார்வலர்களுக்கு தகவல் அனுப்பப்பட்டது.`
    };
    setTelephonyLogs(prev => [telephonyEntry, ...prev]);

    // Automatically trigger step 1 audio guide for instant offline responsiveness!
    setTimeout(() => {
      playStepVoiceAudio(0);
      toggleMetronome();
    }, 600);

    return newAlert;
  };

  const cancelOrResolveEmergency = (alertId: string) => {
    cprMetronome.stop();
    setIsMetronomeActive(false);
    stopVoiceAudio();

    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'resolved' } : a));
    if (activeEmergency?.id === alertId) {
      setActiveEmergency(null);
    }
    setResponders(prev => prev.map(r => ({ ...r, status: 'idle' })));
  };

  const acceptAlertByResponder = (responderId: string, alertId: string) => {
    playSuccessChime();
    setResponders(prev => prev.map(r => r.id === responderId ? { ...r, status: 'accepted' } : r));
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'responder_accepted',
          assignedResponders: a.assignedResponders.map(ar => 
            ar.responderId === responderId 
              ? { ...ar, status: 'accepted', acceptedAt: 'Just now' } 
              : ar
          )
        };
      }
      return a;
    }));

    if (activeEmergency?.id === alertId) {
      setActiveEmergency(prev => prev ? {
        ...prev,
        status: 'responder_accepted',
        assignedResponders: prev.assignedResponders.map(ar =>
          ar.responderId === responderId
            ? { ...ar, status: 'accepted', acceptedAt: 'Just now' }
            : ar
        )
      } : null);
    }
  };

  const markResponderOnScene = (responderId: string, alertId: string) => {
    setResponders(prev => prev.map(r => r.id === responderId ? { ...r, status: 'on_scene' } : r));
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'responder_on_scene',
          assignedResponders: a.assignedResponders.map(ar =>
            ar.responderId === responderId ? { ...ar, status: 'on_scene' } : ar
          )
        };
      }
      return a;
    }));

    if (activeEmergency?.id === alertId) {
      setActiveEmergency(prev => prev ? {
        ...prev,
        status: 'responder_on_scene'
      } : null);
    }
  };

  const updateCPRStatus = (alertId: string, inProgress: boolean) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, cprInitiated: inProgress, status: inProgress ? 'cpr_in_progress' : a.status } : a));
    if (activeEmergency?.id === alertId) {
      setActiveEmergency(prev => prev ? { ...prev, cprInitiated: inProgress, status: inProgress ? 'cpr_in_progress' : prev.status } : null);
    }
  };

  const updateAspirinStatus = (alertId: string, given: boolean) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, aspirinAdministered: given } : a));
    if (activeEmergency?.id === alertId) {
      setActiveEmergency(prev => prev ? { ...prev, aspirinAdministered: given } : null);
    }
  };

  const updateAmbulanceStatus = (alertId: string, status: 'dispatched' | 'en_route' | 'arrived') => {
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: status === 'arrived' ? 'ambulance_arrived' : a.status,
          ambulance108Status: {
            ...a.ambulance108Status,
            status,
            etaMinutes: status === 'arrived' ? 0 : (status === 'en_route' ? 8 : a.ambulance108Status.etaMinutes)
          }
        };
      }
      return a;
    }));

    if (activeEmergency?.id === alertId) {
      setActiveEmergency(prev => prev ? {
        ...prev,
        status: status === 'arrived' ? 'ambulance_arrived' : prev.status,
        ambulance108Status: {
          ...prev.ambulance108Status,
          status,
          etaMinutes: status === 'arrived' ? 0 : (status === 'en_route' ? 8 : prev.ambulance108Status.etaMinutes)
        }
      } : null);
    }
  };

  const completeQuiz = (moduleId: string, score: number) => {
    playSuccessChime();
    setTrainingModules(prev => prev.map(m => m.id === moduleId ? { ...m, completed: true, score } : m));
  };

  const downloadOfflineModule = (moduleId: string) => {
    setTrainingModules(prev => prev.map(m => m.id === moduleId ? { ...m, isDownloadedOffline: true } : m));
  };

  const simulateMissedCall = (phone: string) => {
    triggerEmergency('missed_call', {
      callerPhone: phone,
      symptom: 'unconscious_no_breathing'
    });
  };

  const simulateIncomingSMS = (phone: string, text: string) => {
    triggerEmergency('sms', {
      callerPhone: phone,
      customNote: text,
      symptom: 'severe_chest_pain'
    });
  };

  const addTelephonyLog = (log: Omit<TelephonyCallLog, 'id' | 'timestamp'>) => {
    const newLog: TelephonyCallLog = {
      id: `tel_${Date.now()}`,
      timestamp: 'Just now',
      ...log
    };
    setTelephonyLogs(prev => [newLog, ...prev]);
  };

  const resetAllDemoData = () => {
    cprMetronome.stop();
    setIsMetronomeActive(false);
    stopVoiceAudio();
    setAlerts(INITIAL_ALERTS);
    setActiveEmergency(INITIAL_ALERTS[0]);
    setResponders(INITIAL_RESPONDERS);
    setTelephonyLogs(INITIAL_TELEPHONY_LOGS);
    setTrainingModules(TRAINING_MODULES);
    setSelectedVillage(TAMIL_NADU_VILLAGES[0]);
  };

  // Timer simulation loop for active emergency (increments elapsed seconds and handles auto-escalation)
  useEffect(() => {
    if (!activeEmergency || activeEmergency.status === 'resolved') return;

    const interval = setInterval(() => {
      setActiveEmergency(prev => {
        if (!prev || prev.status === 'resolved') return prev;
        const newElapsed = prev.elapsedSeconds + 1;
        
        // Auto escalation logic: if no responder accepted after 120 seconds (2 mins), escalate to Tier 2
        let currentEscalation = prev.escalationLevel;
        let updatedAssigned = [...prev.assignedResponders];

        if (newElapsed > 120 && currentEscalation === 'tier1_local') {
          currentEscalation = 'tier2_expanded';
        } else if (newElapsed > 240 && currentEscalation === 'tier2_expanded') {
          currentEscalation = 'tier3_phc_super';
        }

        // Auto accept simulation for demo realism after 8 seconds
        if (newElapsed === 8 && prev.assignedResponders.some(r => r.status === 'alerted')) {
          updatedAssigned = updatedAssigned.map((r, i) => i === 0 ? { ...r, status: 'accepted', etaMinutes: 2 } : r);
        }

        return {
          ...prev,
          elapsedSeconds: newElapsed,
          escalationLevel: currentEscalation,
          assignedResponders: updatedAssigned
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeEmergency?.id, activeEmergency?.status]);

  return (
    <HeartAlarmContext.Provider value={{
      language,
      setLanguage,
      t,
      networkCondition,
      setNetworkCondition,
      activeRole,
      setActiveRole,
      selectedVillage,
      setSelectedVillage,
      alerts,
      activeEmergency,
      responders,
      telephonyLogs,
      triggerEmergency,
      cancelOrResolveEmergency,
      acceptAlertByResponder,
      markResponderOnScene,
      updateCPRStatus,
      updateAspirinStatus,
      updateAmbulanceStatus,
      isMetronomeActive,
      metronomeBeatCount,
      toggleMetronome,
      activeVoiceStep,
      playStepVoiceAudio,
      isVoicePlaying,
      stopVoiceAudio,
      trainingModules,
      completeQuiz,
      downloadOfflineModule,
      simulateMissedCall,
      simulateIncomingSMS,
      addTelephonyLog,
      resetAllDemoData
    }}>
      {children}
    </HeartAlarmContext.Provider>
  );
};

export const useHeartAlarm = () => {
  const context = useContext(HeartAlarmContext);
  if (!context) {
    throw new Error('useHeartAlarm must be used within a HeartAlarmProvider');
  }
  return context;
};
