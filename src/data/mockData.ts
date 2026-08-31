import { Village, Responder, TrainingModule, EmergencyAlert } from '../types';

export const TAMIL_NADU_VILLAGES: Village[] = [
  {
    id: 'vil_kilvelur',
    nameEn: 'Kilvelur (கீழ்வேளூர்)',
    nameTa: 'கீழ்வேளூர்',
    districtEn: 'Nagapattinam',
    districtTa: 'நாகப்பட்டினம்',
    centerLat: 10.7412,
    centerLng: 79.7423,
    population: 3450,
    phcDistanceKm: 7.2,
    ambulanceEtaMins: 24,
    primaryAshaName: 'Kavitha Ramasamy (கவிதா)',
    primaryAshaPhone: '+91 94421 88301',
    landmarks: [
      {
        id: 'lm_1',
        nameEn: 'Sri Akshayalingaswamy Temple Arch',
        nameTa: 'ஸ்ரீ அக்ஷயலிங்கசுவாமி கோவில் வளைவு',
        type: 'temple',
        lat: 10.7410,
        lng: 79.7420,
        descriptionEn: 'Main temple entrance, north street corner next to banyan tree',
        descriptionTa: 'வடக்கு தெரு முனை, ஆலமரம் அருகில்'
      },
      {
        id: 'lm_2',
        nameEn: 'Govt Higher Secondary School',
        nameTa: 'அரசு மேல்நிலைப் பள்ளி',
        type: 'school',
        lat: 10.7425,
        lng: 79.7431,
        descriptionEn: 'Opposite to water tank, yellow gate',
        descriptionTa: 'மேல்நிலை நீர்த்தேக்க தொட்டி எதிரில், மஞ்சள் கேட்'
      },
      {
        id: 'lm_3',
        nameEn: 'Kilvelur Primary Health Centre (PHC)',
        nameTa: 'கீழ்வேளூர் அரசு ஆரம்ப சுகாதார நிலையம்',
        type: 'phc',
        lat: 10.7440,
        lng: 79.7402,
        descriptionEn: 'Main bus route road, 24x7 emergency entry',
        descriptionTa: 'பிரதான பேருந்து சாலை, அவசர சிகிச்சை பிரிவு'
      },
      {
        id: 'lm_4',
        nameEn: 'Panchayat Union Office & Ration Shop',
        nameTa: 'ஊராட்சி ஒன்றிய அலுவலகம் & நியாய விலைக்கடை',
        type: 'panchayat',
        lat: 10.7401,
        lng: 79.7445,
        descriptionEn: 'Near milk cooperative society depot',
        descriptionTa: 'பால் உற்பத்தியாளர் கூட்டுறவு சங்கம் அருகில்'
      },
      {
        id: 'lm_5',
        nameEn: 'Village Bus Stand / Tea Stall Corner',
        nameTa: 'கிராம பேருந்து நிறுத்தம் / தேநீர் கடை முனை',
        type: 'bus_stop',
        lat: 10.7395,
        lng: 79.7415,
        descriptionEn: 'Main junction connecting Thiruvarur road',
        descriptionTa: 'திருவாரூர் சாலை சந்திப்பு'
      }
    ]
  },
  {
    id: 'vil_kumbakonam_rural',
    nameEn: 'Papanasam Rural (பாபநாசம்)',
    nameTa: 'பாபநாசம் கிராமம்',
    districtEn: 'Thanjavur',
    districtTa: 'தஞ்சாவூர்',
    centerLat: 10.9234,
    centerLng: 79.2812,
    population: 4120,
    phcDistanceKm: 9.5,
    ambulanceEtaMins: 28,
    primaryAshaName: 'Meenakshi Sundaram (மீனாட்சி)',
    primaryAshaPhone: '+91 98422 41102',
    landmarks: [
      {
        id: 'lm_201',
        nameEn: 'Mariamman Temple Street',
        nameTa: 'மாரியம்மன் கோவில் தெரு',
        type: 'temple',
        lat: 10.9230,
        lng: 79.2810,
        descriptionEn: 'Near festival chariot shed',
        descriptionTa: 'தேர் கொட்டகை அருகில்'
      },
      {
        id: 'lm_202',
        nameEn: 'Overhead Water Tank & Community Hall',
        nameTa: 'மேல்நிலை குடிநீர் தொட்டி & சமுதாயக்கூடம்',
        type: 'water_tank',
        lat: 10.9245,
        lng: 79.2825,
        descriptionEn: 'Near East Canal bridge',
        descriptionTa: 'கிழக்கு வாய்க்கால் பாலம் அருகில்'
      }
    ]
  },
  {
    id: 'vil_pennagaram',
    nameEn: 'Pennagaram Hills (பென்னாகரம்)',
    nameTa: 'பென்னாகரம் மலைக்கிராமம்',
    districtEn: 'Dharmapuri',
    districtTa: 'தர்மபுரி',
    centerLat: 12.1324,
    centerLng: 77.9011,
    population: 2190,
    phcDistanceKm: 14.0,
    ambulanceEtaMins: 38,
    primaryAshaName: 'Selvi Murugan (செல்வி)',
    primaryAshaPhone: '+91 97891 32411',
    landmarks: [
      {
        id: 'lm_301',
        nameEn: 'Forest Checkpost / Tribal School',
        nameTa: 'வனத்துறை சோதனை சாவடி / பழங்குடியினர் பள்ளி',
        type: 'school',
        lat: 12.1320,
        lng: 77.9010,
        descriptionEn: 'Hill ridge main road',
        descriptionTa: 'மலைப்பாதை பிரதான சாலை'
      }
    ]
  }
];

export const INITIAL_RESPONDERS: Responder[] = [
  {
    id: 'resp_1',
    name: 'Kavitha R. (கவிதா - ASHA)',
    role: 'asha',
    phone: '+91 94421 88301',
    villageId: 'vil_kilvelur',
    distanceMeters: 380,
    etaMinutes: 3,
    status: 'idle',
    cprCertified: true,
    completedRescues: 12
  },
  {
    id: 'resp_2',
    name: 'Muthuvel K. (முத்துவேல் - Youth Volunteer / Shop)',
    role: 'volunteer',
    phone: '+91 98402 11982',
    villageId: 'vil_kilvelur',
    distanceMeters: 520,
    etaMinutes: 4,
    status: 'idle',
    cprCertified: true,
    completedRescues: 7
  },
  {
    id: 'resp_3',
    name: 'Dr. Arulmozhi (PHC Nurse / Staff)',
    role: 'phc_nurse',
    phone: '+91 94433 90812',
    villageId: 'vil_kilvelur',
    distanceMeters: 1400,
    etaMinutes: 8,
    status: 'idle',
    cprCertified: true,
    completedRescues: 29
  },
  {
    id: 'resp_4',
    name: 'Senthil Kumar (Panchayat Youth Lead)',
    role: 'volunteer',
    phone: '+91 98411 77654',
    villageId: 'vil_kilvelur',
    distanceMeters: 750,
    etaMinutes: 6,
    status: 'idle',
    cprCertified: true,
    completedRescues: 4
  }
];

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'mod_cpr_basics',
    titleEn: 'Hands-Only CPR: The 110 BPM Golden Hour Rhythm',
    titleTa: 'கைமுறை CPR: 110 துடிப்பு உயிர்காக்கும் முதலுதவி',
    descriptionEn: 'Learn chest compression depth (5cm), hand placement at breastbone center, and non-stop rhythm matching 100-120 BPM.',
    descriptionTa: 'மார்பின் மையப்பகுதியில் கை வைத்து 5 செ.மீ ஆழத்தில் 110 துடிப்பு வேகத்தில் இடைவிடாது அழுத்தும் முறை.',
    durationMinutes: 3,
    category: 'cpr',
    isDownloadedOffline: true,
    completed: true,
    score: 100,
    badgeEn: 'CPR Village Hero',
    badgeTa: 'CPR கிராமத்து நாயகன்',
    videoThumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
    videoDuration: '2:45 min',
    keyTakeawaysEn: [
      'Center of chest between nipples (lower half of sternum)',
      'Push hard & fast at 100-120 beats per minute',
      'Do not stop until 108 ambulance or ASHA arrives',
      'Hands-only CPR doubles survival chances'
    ],
    keyTakeawaysTa: [
      'மார்பின் மையப்பகுதியில் உள்ள எலும்பில் இரு கைகளை கோர்த்து வைக்கவும்',
      'நிமிடத்திற்கு 100 முதல் 120 முறை வேகமாகவும் அழுத்தமாகவும் அழுத்தவும்',
      '108 ஆம்புலன்ஸ் அல்லது ASHA வரும் வரை நிறுத்தாமல் தொடரவும்',
      'உடனடி CPR உயிரிழப்பை 50% தடுக்கிறது'
    ],
    questions: [
      {
        id: 'q1',
        questionEn: 'Where should your hands be placed for chest compressions?',
        questionTa: 'CPR செய்யும்போது கைகளை எங்கு வைக்க வேண்டும்?',
        options: [
          { id: 'opt1', textEn: 'Center of the chest on the breastbone', textTa: 'மார்பின் மையப்பகுதி எலும்பின் மேல்', isCorrect: true },
          { id: 'opt2', textEn: 'Left side over the stomach', textTa: 'வயிற்றின் இடது புறம்', isCorrect: false },
          { id: 'opt3', textEn: 'Over the neck and throat', textTa: 'கழுத்துப் பகுதியில்', isCorrect: false }
        ],
        explanationEn: 'Compressions must be performed in the center of the breastbone (sternum) to effectively pump blood.',
        explanationTa: 'இதயத்திலிருந்து ரத்த ஓட்டத்தை சீராக்க மார்பின் நடுப்பகுதியில் அழுத்தம் தர வேண்டும்.'
      },
      {
        id: 'q2',
        questionEn: 'What is the recommended speed of chest compressions?',
        questionTa: 'மார்பை அழுத்தும் சரியான வேகம் என்ன?',
        options: [
          { id: 'opt1', textEn: '30 beats per minute (slow)', textTa: 'நிமிடத்திற்கு 30 முறை (மெதுவாக)', isCorrect: false },
          { id: 'opt2', textEn: '100-120 beats per minute (Stayin Alive rhythm)', textTa: 'நிமிடத்திற்கு 100 - 120 முறை (வேகமாக)', isCorrect: true },
          { id: 'opt3', textEn: '200 beats per minute', textTa: 'நிமிடத்திற்கு 200 முறை', isCorrect: false }
        ],
        explanationEn: '100 to 120 compressions per minute ensures adequate cerebral and myocardial perfusion.',
        explanationTa: 'நிமிடத்திற்கு 100-120 முறை அழுத்துவது மூளைக்கு ரத்த ஓட்டத்தை உறுதி செய்யும்.'
      },
      {
        id: 'q3',
        questionEn: 'If the collapsed person does not wake up or breathe, what should you do FIRST?',
        questionTa: 'மயங்கி விழுந்தவர் சுவாசிக்கவில்லை என்றால் முதலில் என்ன செய்ய வேண்டும்?',
        options: [
          { id: 'opt1', textEn: 'Give water with sugar immediately', textTa: 'உடனே சர்க்கரை தண்ணீர் புகட்ட வேண்டும்', isCorrect: false },
          { id: 'opt2', textEn: 'Trigger HeartAlarm / 108 & start CPR compressions', textTa: 'HeartAlarm / 108 அலர்ட் செய்து உடனே CPR தொடங்க வேண்டும்', isCorrect: true },
          { id: 'opt3', textEn: 'Wait 30 minutes to see if they recover', textTa: '30 நிமிடம் ஓய்வெடுக்க வைக்க வேண்டும்', isCorrect: false }
        ],
        explanationEn: 'Never force water into an unconscious person. Trigger emergency network and start compressions immediately!',
        explanationTa: 'மயக்கத்தில் உள்ளவருக்கு தண்ணீர் புகட்டக்கூடாது. உடனடியாக 108 அழைத்து CPR செய்ய வேண்டும்.'
      }
    ]
  },
  {
    id: 'mod_symptoms',
    titleEn: 'Recognizing Cardiac Warning Signs vs Gas / Acidity',
    titleTa: 'மாரடைப்பு அறிகுறிகள் vs வாய்வுத் தொல்லை',
    descriptionEn: 'Differentiate between simple gastric pain and radiating chest tightness, cold sweats, jaw ache, or sudden weakness.',
    descriptionTa: 'நெஞ்சு இறுக்கம், இடது கை வலி, அதிக வியர்வை ஆகியவற்றை வாய்வுத் தொல்லையாக நினைத்து தாமதிக்காமல் கண்டறியும் முறை.',
    durationMinutes: 3,
    category: 'symptoms',
    isDownloadedOffline: true,
    completed: false,
    badgeEn: 'Symptom Detective',
    badgeTa: 'அறிகுறி அறிஞர்',
    videoThumbnail: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80',
    videoDuration: '3:10 min',
    keyTakeawaysEn: [
      'Heavy pressure in chest center like an elephant sitting on chest',
      'Pain spreading to left arm, neck, jaw, or upper back',
      'Cold sweating and unexplained shortness of breath',
      'Do not dismiss as "gas trouble" or sleep it off!'
    ],
    keyTakeawaysTa: [
      'மார்பில் கடுமையான பாரம் அல்லது இறுக்கம்',
      'வலி இடது கை, தாடை அல்லது முதுகுக்கு பரவுதல்',
      'காரணமின்றி அதிக வியர்வை மற்றும் மூச்சுத்திணறல்',
      'இதை வெறும் வாய்வு என நினைத்து அலட்சியம் செய்யக்கூடாது!'
    ],
    questions: [
      {
        id: 'qs1',
        questionEn: 'Which is a classic red-flag sign of a heart attack in rural areas?',
        questionTa: 'மாரடைப்பின் மிக முக்கியமான ஆபத்தான அறிகுறி எது?',
        options: [
          { id: 'opt1', textEn: 'Chest squeezing pain radiating to left arm + cold sweat', textTa: 'நெஞ்சு வலி இடது கைக்கு பரவுதல் + அதிக வியர்வை', isCorrect: true },
          { id: 'opt2', textEn: 'Mild knee pain after walking', textTa: 'நடந்த பிறகு ஏற்படும் லேசான முழங்கால் வலி', isCorrect: false },
          { id: 'opt3', textEn: 'Skin itching after meal', textTa: 'சாப்பிட்ட பின் தோல் அரிப்பு', isCorrect: false }
        ],
        explanationEn: 'Heavy crushing chest pain spreading to arm or jaw accompanied by cold perspiration requires instant 108 alert.',
        explanationTa: 'நெஞ்சு வலியுடன் வியர்வை மற்றும் கை வலி இருந்தால் உடனே 108 மற்றும் கிராம தன்னார்வலரை அழைக்க வேண்டும்.'
      }
    ]
  },
  {
    id: 'mod_firstaid',
    titleEn: 'Aspirin Protocol & Recovery Position',
    titleTa: 'ஆஸ்பிரின் முதலுதவி & சரியான படுக்கை நிலை',
    descriptionEn: 'Guidelines on chewing 300mg soluble Dispirin/Aspirin if patient is conscious, plus recovery posture if breathing.',
    descriptionTa: 'நோயாளி சுயநினைவுடன் இருந்தால் ஆஸ்பிரின் மாத்திரை மெல்லக் கொடுத்தல் மற்றும் ஒருக்களித்து படுக்க வைக்கும் முறை.',
    durationMinutes: 2,
    category: 'firstaid',
    isDownloadedOffline: true,
    completed: false,
    badgeEn: 'First Responder Guard',
    badgeTa: 'முதலுதவி காவலர்',
    videoThumbnail: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    videoDuration: '2:15 min',
    keyTakeawaysEn: [
      'If conscious and suspected heart attack: Chew 1 Dispirin 300mg (if no allergy)',
      'Keep patient resting, calm, and slightly propped up',
      'If unconscious but breathing: Turn onto side (Recovery Position)',
      'If NOT breathing: Start CPR compressions immediately'
    ],
    keyTakeawaysTa: [
      'சுயநினைவு இருந்தால்: 300mg ஆஸ்பிரின் மாத்திரையை மெல்லக் கொடுக்கவும் (ஒவ்வாமை இல்லையெனில்)',
      'அமைதியாக உட்கார அல்லது சாய்ந்த நிலையில் ஓய்வெடுக்க வைக்கவும்',
      'சுவாசம் இருந்தால்: ஒருக்களித்து படுக்க வைக்கவும் (Recovery Position)',
      'சுவாசம் இல்லையெனில்: உடனடியாக CPR தொடங்கவும்'
    ],
    questions: [
      {
        id: 'qfa1',
        questionEn: 'How should Aspirin/Dispirin be taken during suspected heart attack?',
        questionTa: 'மாரடைப்பு சந்தேகத்தின் போது ஆஸ்பிரின் மாத்திரையை எவ்வாறு எடுத்துக்கொள்ள வேண்டும்?',
        options: [
          { id: 'opt1', textEn: 'Chewed thoroughly with saliva for quick absorption', textTa: 'விரைவாக ரத்தத்தில் கலக்க நன்றாக மென்று சாப்பிட வேண்டும்', isCorrect: true },
          { id: 'opt2', textEn: 'Swallowed whole with cold milk after 2 hours', textTa: '2 மணி நேரம் கழித்து பாலில் முழுங்க வேண்டும்', isCorrect: false },
          { id: 'opt3', textEn: 'Applied as paste on chest', textTa: 'மார்பில் பற்று போட வேண்டும்', isCorrect: false }
        ],
        explanationEn: 'Chewing aspirin dissolves the anti-platelet medication rapidly into the bloodstream through oral mucosa.',
        explanationTa: 'மென்று சாப்பிடும்போது மாத்திரை வேகமாக உறிஞ்சப்பட்டு ரத்தக்கட்டியை கரைக்க உதவும்.'
      }
    ]
  }
];

export const INITIAL_ALERTS: EmergencyAlert[] = [
  {
    id: 'HA-2026-0941',
    triggerChannel: 'app',
    patientName: 'Ramanathan (ராமநாதன் - Age 58)',
    callerPhone: '+91 98401 23456',
    villageId: 'vil_kilvelur',
    villageNameEn: 'Kilvelur',
    villageNameTa: 'கீழ்வேளூர்',
    landmark: TAMIL_NADU_VILLAGES[0].landmarks[0],
    customLandmarkText: 'North Car Street, opposite to old banyan tree, blue door house',
    symptomType: 'unconscious_no_breathing',
    status: 'responder_accepted',
    escalationLevel: 'tier1_local',
    timestamp: '2 mins ago',
    elapsedSeconds: 124,
    gpsCoords: {
      lat: 10.7412,
      lng: 79.7423,
      accuracyMeters: 12
    },
    assignedResponders: [
      {
        responderId: 'resp_1',
        status: 'accepted',
        acceptedAt: '1 min ago',
        etaMinutes: 2
      },
      {
        responderId: 'resp_2',
        status: 'accepted',
        acceptedAt: '1 min ago',
        etaMinutes: 3
      }
    ],
    ambulance108Status: {
      incidentId: 'TN108-NGP-8842',
      status: 'dispatched',
      etaMinutes: 18,
      driverName: 'Velmurugan S.',
      driverPhone: '+91 94432 00108'
    },
    smsPayloadSent: 'HA ALERT:ID941 VIL:KILVELUR LMK:TEMPLE LAT:10.741 LON:79.742 SYM:UNCONSCIOUS',
    cprInitiated: true,
    aspirinAdministered: false
  }
];

export const INITIAL_TELEPHONY_LOGS = [
  {
    id: 'call_1',
    callerNumber: '+91 94420 77123',
    type: 'incoming_missed_call' as const,
    timestamp: '5 mins ago',
    durationSeconds: 0,
    status: 'completed' as const,
    dtmfKey: '1',
    ivrTranscriptEn: 'Missed call received. Outbound callback triggered in 3s. User selected [1: Unconscious / CPR]. Tamil audio stream played.',
    ivrTranscriptTa: 'மிஸ்ட் கால் பெறப்பட்டது. 3 வினாடியில் திரும்ப அழைப்பு. பயனர் [1: மயக்கம் / CPR] தேர்வு செய்தார். தமிழ் ஆடியோ வழிகாட்டல் இயங்கியது.',
  },
  {
    id: 'sms_1',
    callerNumber: '+91 98409 55432',
    type: 'incoming_sms' as const,
    timestamp: '14 mins ago',
    durationSeconds: 0,
    status: 'completed' as const,
    smsBody: 'HELP VIL:KILVELUR LMK:HIGH SCHOOL',
    ivrTranscriptEn: 'SMS parser matched Village Kilvelur & Landmark High School. Auto-dispatched 2 nearest ASHAs & alerted 108 dispatch queue.',
    ivrTranscriptTa: 'SMS மூலம் கீழ்வேளூர் மேல்நிலைப் பள்ளி இடம் கண்டறியப்பட்டு 2 ASHA மற்றும் 108க்கு தகவல் அனுப்பப்பட்டது.'
  },
  {
    id: 'call_2',
    callerNumber: '108-EMERGENCY-TN',
    type: 'outgoing_108_tts' as const,
    timestamp: '2 mins ago',
    durationSeconds: 42,
    status: 'connected' as const,
    ivrTranscriptEn: 'Automated 108 Voice Bot: "Automated HeartAlarm Village alert. Suspected cardiac collapse in Kilvelur North Street. GPS: 10.7412, 79.7423. Responders arriving in 3 mins. 108 vehicle assigned: TN108-NGP-8842."',
    ivrTranscriptTa: 'தானியங்கி 108 குரல் போட்: "கீழ்வேளூர் வடக்கு தெருவில் இதய அவசரநிலை. GPS: 10.7412, 79.7423. தன்னார்வலர் 3 நிமிடத்தில் வருவர். 108 வாகனம் புறப்பட்டது."'
  }
];
