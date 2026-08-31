export type Language = 'ta' | 'en' | 'hi' | 'te' | 'kn' | 'ml';

export type NetworkCondition = '4g' | '2g_weak' | 'offline_sms';

export type TriggerChannel = 'app' | 'missed_call' | 'sms';

export type AlertStatus = 
  | 'initiated' 
  | '108_notified' 
  | 'responders_alerted' 
  | 'responder_accepted' 
  | 'responder_on_scene' 
  | 'cpr_in_progress' 
  | 'ambulance_arrived' 
  | 'resolved';

export type EscalationLevel = 'tier1_local' | 'tier2_expanded' | 'tier3_phc_super';

export interface VillageLandmark {
  id: string;
  nameEn: string;
  nameTa: string;
  type: 'temple' | 'school' | 'phc' | 'panchayat' | 'bus_stop' | 'water_tank' | 'ration_shop';
  lat: number;
  lng: number;
  descriptionEn: string;
  descriptionTa: string;
}

export interface Village {
  id: string;
  nameEn: string;
  nameTa: string;
  districtEn: string;
  districtTa: string;
  centerLat: number;
  centerLng: number;
  population: number;
  phcDistanceKm: number;
  ambulanceEtaMins: number;
  landmarks: VillageLandmark[];
  primaryAshaPhone: string;
  primaryAshaName: string;
}

export interface Responder {
  id: string;
  name: string;
  role: 'asha' | 'volunteer' | 'phc_nurse' | 'panchayat_leader';
  phone: string;
  villageId: string;
  distanceMeters: number;
  etaMinutes: number;
  status: 'idle' | 'alerted' | 'accepted' | 'on_scene' | 'declined';
  cprCertified: boolean;
  avatarUrl?: string;
  completedRescues: number;
}

export interface EmergencyAlert {
  id: string;
  triggerChannel: TriggerChannel;
  patientName?: string;
  callerPhone: string;
  villageId: string;
  villageNameEn: string;
  villageNameTa: string;
  landmark?: VillageLandmark;
  customLandmarkText?: string;
  voiceNoteUrl?: string;
  gpsCoords?: {
    lat: number;
    lng: number;
    accuracyMeters: number;
  };
  symptomType: 'unconscious_no_breathing' | 'severe_chest_pain' | 'sudden_collapse' | 'unknown';
  status: AlertStatus;
  escalationLevel: EscalationLevel;
  timestamp: string;
  elapsedSeconds: number;
  assignedResponders: {
    responderId: string;
    status: 'alerted' | 'accepted' | 'declined' | 'on_scene';
    acceptedAt?: string;
    etaMinutes: number;
  }[];
  ambulance108Status: {
    incidentId: string;
    status: 'dispatch_queued' | 'dispatched' | 'en_route' | 'arrived';
    etaMinutes: number;
    driverName: string;
    driverPhone: string;
  };
  smsPayloadSent?: string;
  cprInitiated: boolean;
  aspirinAdministered: boolean;
}

export interface TrainingQuizQuestion {
  id: string;
  questionEn: string;
  questionTa: string;
  options: {
    id: string;
    textEn: string;
    textTa: string;
    isCorrect: boolean;
    iconName?: string;
  }[];
  explanationEn: string;
  explanationTa: string;
}

export interface TrainingModule {
  id: string;
  titleEn: string;
  titleTa: string;
  descriptionEn: string;
  descriptionTa: string;
  durationMinutes: number;
  category: 'cpr' | 'symptoms' | 'firstaid' | 'system';
  isDownloadedOffline: boolean;
  completed: boolean;
  score?: number;
  badgeEn: string;
  badgeTa: string;
  videoThumbnail: string;
  videoDuration: string;
  keyTakeawaysEn: string[];
  keyTakeawaysTa: string[];
  questions: TrainingQuizQuestion[];
}

export interface TelephonyCallLog {
  id: string;
  callerNumber: string;
  type: 'incoming_missed_call' | 'outgoing_ivr_callback' | 'incoming_sms' | 'outgoing_108_tts';
  timestamp: string;
  durationSeconds: number;
  status: 'connected' | 'completed' | 'busy' | 'failed';
  dtmfKey?: string;
  ivrTranscriptEn: string;
  ivrTranscriptTa: string;
  smsBody?: string;
}
