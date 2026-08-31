import { Language } from '../types';

export interface LanguageOption {
  id: Language;
  nameNative: string;
  nameEn: string;
  badge: string;
  region: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { id: 'ta', nameNative: 'தமிழ்', nameEn: 'Tamil', badge: 'TN', region: 'Tamil Nadu' },
  { id: 'en', nameNative: 'English', nameEn: 'English', badge: 'EN', region: 'National / Standard' },
  { id: 'hi', nameNative: 'हिन्दी', nameEn: 'Hindi', badge: 'HI', region: 'North & Central India' },
  { id: 'te', nameNative: 'తెలుగు', nameEn: 'Telugu', badge: 'TE', region: 'Andhra Pradesh & Telangana' },
  { id: 'kn', nameNative: 'ಕನ್ನಡ', nameEn: 'Kannada', badge: 'KA', region: 'Karnataka' },
  { id: 'ml', nameNative: 'മലയാളം', nameEn: 'Malayalam', badge: 'KL', region: 'Kerala' },
];

export const CPR_VOICE_SCRIPTS: Record<Language, string[]> = {
  ta: [
    "சுவாசம் இருக்கிறதா என்று சோதிக்கவும். மார்பு அசையவில்லை என்றால் உடனே CPR தொடங்கவும்.",
    "மார்பின் மையப்பகுதியில் உள்ள எலும்பில் இரு கைகளை கோர்த்து வைக்கவும். தோள்பட்டையை நேராக வைக்கவும்.",
    "நிமிடத்திற்கு 110 முறை வேகமாகவும் 5 சென்டிமீட்டர் ஆழமாகவும் அழுத்தவும். ஒன்று, இரண்டு, மூன்று...",
    "நோயாளிக்கு சுயநினைவு இருந்தால் 300 மில்லிகிராம் ஆஸ்பிரின் மாத்திரையை மென்று சாப்பிட கொடுக்கவும்.",
    "சுவாசம் இருந்தால் நோயாளியை ஒருக்களித்து படுக்க வைக்கவும். 108 ஆம்புலன்ஸ் வரும் வரை உடன் இருக்கவும்."
  ],
  en: [
    "Check responsiveness and normal breathing. If unresponsive and not breathing, start CPR immediately.",
    "Place heel of your hand in the center of the chest. Interlock fingers and keep elbows locked straight.",
    "Push hard and fast at 110 beats per minute, at least 2 inches deep. Match the metronome rhythm.",
    "If patient is conscious and has chest pain, have them chew 300 milligrams Aspirin if no allergy.",
    "If breathing normally, turn patient onto their side into recovery position while awaiting 108."
  ],
  hi: [
    "जांचें कि क्या सांस चल रही है। यदि कोई प्रतिक्रिया नहीं है, तो तुरंत सीपीआर शुरू करें।",
    "छाती के केंद्र में अपनी हथेली रखें। उंगलियों को आपस में फंसाएं और कोहनी सीधी रखें।",
    "110 बीट्स प्रति मिनट की गति से तेजी से और 5 सेमी गहराई तक दबाएं।",
    "यदि मरीज होश में है और सीने में दर्द है, तो 300 मिलीग्राम एस्पिरिन चबाने को दें।",
    "यदि सांस ले रहा है, तो मरीज को करवट लिटाएं और 108 एम्बुलेंस का इंतजार करें।"
  ],
  te: [
    "శ్వాస ఆడుతుందో లేదో తనిఖీ చేయండి. స్పందన లేకపోతే వెంటనే సీపీఆర్ ప్రారంభించండి.",
    "రొమ్ము ఎముక మధ్యలో మీ చేతులను ఉంచండి. మోచేతులను నిటారుగా ఉంచండి.",
    "నిమిషానికి 110 సార్లు వేగంగా, 5 సెంటీమీటర్ల లోతుగా ఛాతీపై ఒత్తండి.",
    "రోగి స్పృహలో ఉండి గుండె నొప్పి ఉంటే 300 ఎంజీ ఆస్పిరిన్ నమలడానికి ఇవ్వండి.",
    "శ్వాస ఉంటే రోగిని ఒక పక్కకు తిప్పి పడుకోబెట్టి 108 అంబులెన్స్ కోసం వేచి చూడండి."
  ],
  kn: [
    "ಉಸಿರಾಟ ಸರಿಯಾಗಿದೆಯೇ ಎಂದು ಪರಿಶೀಲಿಸಿ. ಸ್ಪಂದಿಸದಿದ್ದರೆ ತಕ್ಷಣವೇ ಸಿಪಿಆರ್ ಪ್ರಾರಂಭಿಸಿ.",
    "ಎದೆಯ ಮಧ್ಯಭಾಗದಲ್ಲಿ ನಿಮ್ಮ ಕೈಯನ್ನು ಇರಿಸಿ. ಮೊಣಕೈಗಳನ್ನು ನೇರವಾಗಿಡಿ.",
    "ನಿಮಿಷಕ್ಕೆ 110 ಬಾರಿ ವೇಗವಾಗಿ ಮತ್ತು 5 ಸೆಂ.ಮೀ ಆಳವಾಗಿ ಒತ್ತಿರಿ.",
    "ರೋಗಿಗೆ ಪ್ರಜ್ಞೆಯಿದ್ದರೆ 300 ಎಂಜಿ ಆಸ್ಪಿರಿನ್ ಮಾತ್ರೆ ಅಗಿಯಲು ಕೊಡಿ.",
    "ಉಸಿರಾಟವಿದ್ದರೆ ರೋಗಿಯನ್ನು ಒಂದು ಮಗ್ಗುಲಿಗೆ ಮಲಗಿಸಿ 108 ಆಂಬ್ಯುಲೆನ್ಸ್‌ಗಾಗಿ ಕಾಯಿರಿ."
  ],
  ml: [
    "ശ്വാസമെടുക്കുന്നുണ്ടോ എന്ന് പരിശോധിക്കുക. പ്രതികരണമില്ലെങ്കിൽ ഉടൻ സിപിആർ ആരംഭിക്കുക.",
    "നെഞ്ചിന്റെ മധ്യഭാഗത്ത് കൈത്തലം വയ്ക്കുക. കൈമുട്ടുകൾ നിവർത്തി വയ്ക്കുക.",
    "മിനിറ്റിൽ 110 തവണ എന്ന നിരക്കിൽ വേഗത്തിലും 5 സെ.മീ ആഴത്തിലും അമർത്തുക.",
    "രോഗിക്ക് ബോധമുണ്ടെങ്കിൽ 300 മില്ലിഗ്രാം ആസ്പിരിൻ ചവച്ചരച്ച് കഴിക്കാൻ നൽകുക.",
    "ശ്വാസമുണ്ടെങ്കിൽ രോഗിയെ ഒരു വശത്തേക്ക് ചരിച്ചു കിടത്തി 108 ആംബുലൻസിനായി കാത്തിരിക്കുക."
  ]
};

export const COMMON_TRANSLATIONS: Record<string, Record<Language, string>> = {
  app_subtitle: {
    ta: 'இதய அவசர கிராம வலையமைப்பு',
    en: 'Village Cardiac Emergency Network',
    hi: 'ग्रामीण हृदय आपातकालीन नेटवर्क',
    te: 'గ్రామీణ గుండె అత్యవసర నెట్‌వర్క్',
    kn: 'ಗ್ರಾಮೀಣ ಹೃದಯ ತುರ್ತು ಜಾಲ',
    ml: 'ഗ്രാമീണ ഹൃദയ അടിയന്തര ശൃംഖല'
  },
  emergency_active: {
    ta: 'அவசரநிலை செயலில் உள்ளது',
    en: 'EMERGENCY ACTIVE',
    hi: 'आपातकाल सक्रिय है',
    te: 'అత్యవసర పరిస్థితి సక్రియంగా ఉంది',
    kn: 'ತುರ್ತು ಪರಿಸ್ಥಿತಿ ಸಕ್ರಿಯವಾಗಿದೆ',
    ml: 'അടിയന്തര സാഹചര്യം നിലവിലുണ്ട്'
  },
  signal: {
    ta: 'சிக்னல்',
    en: 'Signal',
    hi: 'सिग्नल',
    te: 'సిగ్నల్',
    kn: 'ಸಿಗ್ನಲ್',
    ml: 'സിഗ്നൽ'
  },
  role_villager: {
    ta: 'கிராமத்து செயலி',
    en: 'Villager App',
    hi: 'ग्रामीण ऐप',
    te: 'గ్రామస్తుల యాప్',
    kn: 'ಗ್ರಾಮಸ್ಥರ ಆಪ್',
    ml: 'ഗ്രാമീണ ആപ്പ്'
  },
  role_basic_phone: {
    ta: 'சாதாரண போன் / IVR',
    en: 'Basic Phone / IVR',
    hi: 'साधारण फोन / आईवीआर',
    te: 'సాధారణ ఫోన్ / ఐవీఆర్',
    kn: 'ಸಾಮಾನ್ಯ ಫೋನ್ / ಐವಿಆರ್',
    ml: 'സാധാരണ ഫോൺ / IVR'
  },
  role_asha: {
    ta: 'ASHA & தன்னார்வலர்',
    en: 'ASHA & Volunteer',
    hi: 'आशा व स्वयंसेवक',
    te: 'ఆశా & వాలంటీర్',
    kn: 'ಆಶಾ & ಸ್ವಯಂಸೇವಕ',
    ml: 'ആശ & സന്നദ്ധപ്രവർത്തകർ'
  },
  role_108: {
    ta: '108 கட்டுப்பாட்டு அறை',
    en: '108 Command Center',
    hi: '108 नियंत्रण कक्ष',
    te: '108 కంట్రోల్ రూమ్',
    kn: '108 ನಿಯಂತ್ರಣ ಕೊಠಡಿ',
    ml: '108 കൺട്രോൾ റൂം'
  },
  role_training: {
    ta: 'ஆஃப்லைன் பயிற்சி',
    en: 'Offline Academy',
    hi: 'ऑफ़लाइन प्रशिक्षण',
    te: 'ఆఫ్‌లైన్ శిక్షణ',
    kn: 'ಆಫ್‌ಲೈನ್ ತರಬೇತಿ',
    ml: 'ഓഫ്‌ലൈൻ പരിശീലനം'
  },
  role_overview: {
    ta: 'அனைத்து திரை பார்வை',
    en: 'Sync Multi-View',
    hi: 'सिंक मल्टी-व्यू',
    te: 'సింక్ మల్టీ-వ్యూ',
    kn: 'ಸಿಂಕ್ ಮಲ್ಟಿ-ವ್ಯೂ',
    ml: 'സിങ്ക് മൾട്ടി-വ്യൂ'
  }
};
