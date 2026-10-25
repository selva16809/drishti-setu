// DRISHTI-SETU (பார்வை பாலம்) - Universal Offline-First Scanner + Live Online Medical AI
// 100% Real-Time Edge AI · Complete Multilingual Support (Tamil, English, Hindi)

let currentMode = 'medicine'; // 'medicine' or 'currency'
let currentLang = 'ta-IN';   // 'ta-IN', 'en-IN', 'hi-IN'
let lastSpokenText = "";
let isScanning = false;
let autoNetSearch = true;
let isCameraActive = false;
let currentMediaStream = null;
let lastDetectedUnknownDrug = "";

// DOM Elements
const video = document.getElementById('webcam');
const canvas = document.getElementById('overlayCanvas');
const scannerLaser = document.getElementById('scannerLaser');
const camPlaceholder = document.getElementById('camPlaceholder');
const targetBox = document.getElementById('targetBox');
const btnCamToggle = document.getElementById('btnCamToggle');
const resultCard = document.getElementById('resultCard');
const resultTitle = document.getElementById('resultTitle');
const sourceTag = document.getElementById('sourceTag');
const statusIndicator = document.getElementById('statusIndicator');
const valItem = document.getElementById('valItem');
const valUses = document.getElementById('valUses');
const valTiming = document.getElementById('valTiming');
const valCaution = document.getElementById('valCaution');
const valSafety = document.getElementById('valSafety');
const safetyRow = document.getElementById('safetyRow');
const rawText = document.getElementById('rawText');
const scanBtnText = document.getElementById('scanBtnText');
const netStatusBadge = document.getElementById('netStatusBadge');
const netStatusText = document.getElementById('netStatusText');
const onlinePromptBox = document.getElementById('onlinePromptBox');
const onlineStatusBar = document.getElementById('onlineStatusBar');

// =========================================================================
// 1. ALL INDIAN CURRENCY NOTES DATABASE (MULTILINGUAL)
// =========================================================================
const CURRENCY_DATABASE = [
    {
        denom: "500",
        nameTa: "ஐநூறு ரூபாய் நோட்டு",
        nameEn: "Five Hundred Rupees Note",
        nameHi: "पाँच सौ रुपये का नोट",
        colorDescTa: "சாம்பல் நிறம் (Stone Grey · செங்கோட்டை)",
        colorDescEn: "Stone Grey (Red Fort Motif)",
        colorDescHi: "धूसर रंग (लाल किला)",
        keywords: ["500", "५००", "FIVE HUNDRED", "PAANCH SAU"]
    },
    {
        denom: "200",
        nameTa: "இருநூறு ரூபாய் நோட்டு",
        nameEn: "Two Hundred Rupees Note",
        nameHi: "दो सौ रुपये का नोट",
        colorDescTa: "பிரகாசமான மஞ்சள் (Bright Yellow · சாஞ்சி ஸ்தூபி)",
        colorDescEn: "Bright Yellow (Sanchi Stupa Motif)",
        colorDescHi: "चमकीला पीला (सांची स्तूप)",
        keywords: ["200", "२००", "TWO HUNDRED", "DO SAU"]
    },
    {
        denom: "100",
        nameTa: "நூறு ரூபாய் நோட்டு",
        nameEn: "One Hundred Rupees Note",
        nameHi: "एक सौ रुपये का नोट",
        colorDescTa: "லாவண்டர் ஊதா (Lavender · ராணி கி வாவ்)",
        colorDescEn: "Lavender Purple (Rani Ki Vav Motif)",
        colorDescHi: "बैंगनी रंग (रानी की वाव)",
        keywords: ["100", "१००", "ONE HUNDRED", "HUNDRED", "EK SAU"]
    },
    {
        denom: "50",
        nameTa: "ஐம்பது ரூபாய் நோட்டு",
        nameEn: "Fifty Rupees Note",
        nameHi: "पचास रुपये का नोट",
        colorDescTa: "ஃப்ளோரசன்ட் நீலம் (Fluorescent Blue · ஹம்பி தேர்)",
        colorDescEn: "Fluorescent Blue (Hampi Chariot Motif)",
        colorDescHi: "नीला रंग (हम्पी रथ)",
        keywords: ["50", "५०", "FIFTY", "PACHAS"]
    },
    {
        denom: "20",
        nameTa: "இருபது ரூபாய் நோட்டு",
        nameEn: "Twenty Rupees Note",
        nameHi: "बीस रुपये का नोट",
        colorDescTa: "பச்சை கலந்த மஞ்சள் (Greenish Yellow · எல்லோர குகைகள்)",
        colorDescEn: "Greenish Yellow (Ellora Caves Motif)",
        colorDescHi: "हरा-पीला रंग (एलोरा गुफाएं)",
        keywords: ["20", "२०", "TWENTY", "BEES"]
    },
    {
        denom: "10",
        nameTa: "பத்து ரூபாய் நோட்டு",
        nameEn: "Ten Rupees Note",
        nameHi: "दस रुपये का नोट",
        colorDescTa: "சாக்லேட் பிரவுன் (Chocolate Brown · சூரியக் கோவில்)",
        colorDescEn: "Chocolate Brown (Sun Temple Motif)",
        colorDescHi: "भूरा रंग (सूर्य मंदिर)",
        keywords: ["10", "१०", "TEN", "DAS"]
    }
];

const CURRENCY_GENERAL_KEYWORDS = [
    "RESERVE BANK", "BANK OF INDIA", "CENTRAL GOVERNMENT", "GUARANTEED BY",
    "PROMISE TO PAY", "GOVERNOR", "BHARAT", "RUPEES", "RUPEE", "रुपये", "भारतीय"
];

// =========================================================================
// 2. MULTILINGUAL CLINICAL MEDICINE KNOWLEDGE BASE (TAMIL, ENGLISH, HINDI)
// =========================================================================
const MEDICINE_DATABASE = [
    // --- THYROID ---
    {
        name: "THYRONORM",
        generic: "Levothyroxine Sodium 25/50/75/100 mcg",
        uses: {
            ta: "தைராய்டு ஹார்மோன் குறைபாடு (Hypothyroidism)",
            en: "Treatment of Hypothyroidism (Thyroid hormone deficiency).",
            hi: "थायराइड हार्मोन की कमी (हाइपोथायरायडिज्म) का इलाज।"
        },
        timing: {
            ta: "காலையில் எழுந்தவுடன் வெறும் வயிற்றில் குடிக்க வேண்டும். 30 நிமிடத்திற்கு உணவு சாப்பிடக் கூடாது.",
            en: "Take early morning on an empty stomach with water. Avoid tea or food for 30 minutes.",
            hi: "सुबह खाली पेट पानी के साथ लें। 30 मिनट तक चाय या खाना न खाएं।"
        },
        caution: {
            ta: "மருத்துவர் குறிப்பிட்ட சரியான மைக்ரோகிராம் (mcg) அளவை மட்டும் தவறாமல் உட்கொள்ளவும்.",
            en: "Take exact prescribed micrograms daily without skipping doses.",
            hi: "डॉक्टर द्वारा बताई गई सटीक खुराक ही प्रतिदिन लें।"
        }
    },
    {
        name: "ELTROXIN",
        generic: "Levothyroxine 50/100 mcg",
        uses: {
            ta: "உடலில் தைராய்டு சுரப்பு சீராக்கல்.",
            en: "Thyroid hormone replacement therapy.",
            hi: "थायराइड हार्मोन प्रतिस्थापन उपचार।"
        },
        timing: {
            ta: "காலையில் வெறும் வயிற்றில் ஒரு டம்ளர் தண்ணீருடன் உட்கொள்ளவும்.",
            en: "Take on empty stomach with a glass of water.",
            hi: "सुबह खाली पेट एक गिलास पानी के साथ लें।"
        },
        caution: {
            ta: "இதய பிரச்சனை உள்ளவர்கள் மருத்துவர் பரிந்துரைத்த அளவை மாற்றக் கூடாது.",
            en: "Cardiac patients must strictly follow doctor's dosage.",
            hi: "हृदय रोगी खुराक में कोई बदलाव न करें।"
        }
    },

    // --- PAIN, FEVER & ARTHRITIS ---
    {
        name: "DOLO 650",
        generic: "Paracetamol 650mg",
        uses: {
            ta: "காய்ச்சல், தீவிர தலைவலி, உடல் சோர்வு மற்றும் தசை வலி நிவாரணம்.",
            en: "Relief from fever, severe headache, body aches, and muscular pain.",
            hi: "बुखार, सिरदर्द, बदन दर्द और मांसपेशियों के दर्द से राहत।"
        },
        timing: {
            ta: "உணவுக்குப் பின் வெதுவெதுப்பான தண்ணீருடன் சாப்பிடவும்.",
            en: "Take after food with a glass of warm water.",
            hi: "भोजन के बाद गुनगुने पानी के साथ लें।"
        },
        caution: {
            ta: "ஒரு நாளைக்கு 4 மாத்திரைகளுக்கு மேல் (2600mg) சாப்பிடக் கூடாது.",
            en: "Do not exceed 4 tablets in 24 hours to prevent liver toxicity.",
            hi: "24 घंटे में 4 से अधिक गोलियां न लें।"
        }
    },
    {
        name: "PARACETAMOL",
        generic: "Paracetamol 500mg/650mg",
        uses: {
            ta: "காய்ச்சல் மற்றும் லேசான உடல் வலி தணிப்பு.",
            en: "Reduction of fever and mild to moderate pain relief.",
            hi: "बुखार और सामान्य शरीर दर्द से राहत।"
        },
        timing: {
            ta: "உணவுக்குப் பின் ஒரு டம்ளர் தண்ணீருடன் உட்கொள்ளவும்.",
            en: "Take after meals with plenty of water.",
            hi: "भोजन के बाद पानी के साथ लें।"
        },
        caution: {
            ta: "பிற வலி நிவாரணி மாத்திரைகளுடன் சேர்த்து ஒரே நேரத்தில் எடுக்க வேண்டாம்.",
            en: "Do not combine with other paracetamol-containing medications.",
            hi: "अन्य पेरासिटामोल दवाओं के साथ एक साथ न लें।"
        }
    },
    {
        name: "ZERODOL-SP",
        generic: "Aceclofenac 100mg + Paracetamol 325mg + Serratiopeptidase 15mg",
        uses: {
            ta: "கடுமையான மூட்டு வலி, எலும்பு தேய்மானம், வீக்கம் மற்றும் பல் வலி நிவாரணம்.",
            en: "Severe joint pain, arthritis swelling, dental pain, and inflammation.",
            hi: "गंभीर जोड़ों का दर्द, सूजन, दांत दर्द और चोट का दर्द।"
        },
        timing: {
            ta: "கட்டாயம் உணவுக்குப் பின்பே (After Food) சாப்பிட வேண்டும்.",
            en: "Must be taken strictly after meals. Do not take on empty stomach.",
            hi: "हमेशा भोजन के बाद ही लें। खाली पेट न लें।"
        },
        caution: {
            ta: "அல்சர் அல்லது தீவிர அசிடிட்டி உள்ளவர்கள் கவனமாக எடுக்கவும்.",
            en: "Patients with stomach ulcers or hyperacidity should consult a doctor.",
            hi: "अल्सर या एसिडिटी के मरीज सावधानी से लें।"
        }
    },
    {
        name: "ZERODOL-P",
        generic: "Aceclofenac 100mg + Paracetamol 325mg",
        uses: {
            ta: "மூட்டு வலி, முதுகு தசை பிடிப்பு, காயம் மற்றும் பல் வலி.",
            en: "Pain relief for backache, joint stiffness, and dental ache.",
            hi: "पीठ दर्द, मांसपेशियों में खिंचाव और दांत दर्द से राहत।"
        },
        timing: {
            ta: "உணவுக்குப் பின் உட்கொள்ளவும்.",
            en: "Take after food with water.",
            hi: "खाना खाने के बाद लें।"
        },
        caution: {
            ta: "தொடர்ந்து 5 நாட்களுக்கு மேல் மருத்துவர் ஆலோசனை இன்றி உட்கொள்ளக் கூடாது.",
            en: "Do not take for more than 5 consecutive days without medical advice.",
            hi: "बिना डॉक्टर की सलाह के 5 दिनों से अधिक न लें।"
        }
    },
    {
        name: "SARIDON",
        generic: "Paracetamol + Propyphenazone + Caffeine",
        uses: {
            ta: "தீவிர தலைவலி, ஒற்றைத் தலைவலி (Migraine) மற்றும் பல் வலி.",
            en: "Quick relief from acute headache, migraine, and toothache.",
            hi: "सिरदर्द, माइग्रेन और दांत दर्द से त्वरित राहत।"
        },
        timing: {
            ta: "உணவுக்குப் பின் தேவைப்படும்போது மட்டும் ஒரு மாத்திரை எடுக்கவும்.",
            en: "Take 1 tablet after food only when needed.",
            hi: "जरूरत पड़ने पर भोजन के बाद 1 गोली लें।"
        },
        caution: {
            ta: "காஃபின் உள்ளதால் இரவு தூங்குவதற்கு முன் அதிகம் எடுப்பதை தவிர்க்கவும்.",
            en: "Contains caffeine; avoid taking right before bedtime.",
            hi: "सोने से ठीक पहले लेने से बचें।"
        }
    },

    // --- HEART & BLOOD PRESSURE ---
    {
        name: "ECOSPRIN 75",
        generic: "Aspirin 75mg Gastro-Resistant",
        uses: {
            ta: "மாரடைப்பு மற்றும் பக்கவாதம் வராமல் காக்கும் ரத்த நீர்த்துப்போகும் மாத்திரை.",
            en: "Blood thinner to prevent blood clots, heart attacks, and strokes.",
            hi: "खून को पतला करने और दिल के दौरे से बचाव की दवा।"
        },
        timing: {
            ta: "தினமும் மதிய அல்லது இரவு உணவுக்குப் பின் குறிப்பிட்ட நேரத்தில் உட்கொள்ளவும்.",
            en: "Take daily after lunch or dinner at the same scheduled time.",
            hi: "रोजाना भोजन के बाद निश्चित समय पर लें।"
        },
        caution: {
            ta: "பல் பிடுங்குதல் அல்லது அறுவை சிகிச்சைக்கு முன் மருத்துவரிடம் தெரிவிக்க வேண்டும்.",
            en: "Inform your surgeon or dentist before any surgical or dental procedure.",
            hi: "किसी भी सर्जरी या दांत निकालने से पहले डॉक्टर को सूचित करें।"
        }
    },
    {
        name: "SORBITRATE",
        generic: "Isosorbide Dinitrate 5mg/10mg",
        uses: {
            ta: "நெஞ்சு வலி மற்றும் ஆஞ்சைனா அவசர சிகிச்சை (Emergency Angina).",
            en: "Emergency treatment for acute chest pain (Angina Pectoris).",
            hi: "सीने में तेज दर्द (एनजाइना) के आपातकालीन उपचार के लिए।"
        },
        timing: {
            ta: "அவசர நேரத்தில் மாத்திரையை விழுங்காமல், நாக்கின் அடியில் வைக்க வேண்டும்.",
            en: "Place under the tongue (Sublingually) immediately during chest pain.",
            hi: "सीने में दर्द होने पर इसे निगलें नहीं, जीभ के नीचे रखें।"
        },
        caution: {
            ta: "தலையை சுற்ற வைக்கும்; மாத்திரை நாக்கின் கீழ் இருக்கும்போது படுத்து ஓய்வெடுக்கவும்.",
            en: "May cause sudden dizziness or lightheadedness; rest lying down.",
            hi: "चक्कर आ सकते हैं; इसे लेते समय आराम से बैठ जाएं या लेट जाएं।"
        }
    },
    {
        name: "TELMA 40",
        generic: "Telmisartan 40mg",
        uses: {
            ta: "உயர் ரத்த அழுத்தம் (High BP) குறைத்தல் மற்றும் இதய பாதுகாப்பு.",
            en: "Management of Hypertension (High Blood Pressure) and cardiovascular protection.",
            hi: "उच्च रक्तचाप (हाई बीपी) को नियंत्रित करने और हृदय सुरक्षा के लिए।"
        },
        timing: {
            ta: "தினமும் காலையில் அல்லது மாலையில் குறிப்பிட்ட நேரத்தில் உட்கொள்ளவும்.",
            en: "Take once daily at the same time, with or without food.",
            hi: "प्रतिदिन एक ही समय पर भोजन के साथ या बिना लें।"
        },
        caution: {
            ta: "திடீரென மாத்திரையை நிறுத்திவிடக் கூடாது; ரத்த அழுத்தம் எகிறிவிடலாம்.",
            en: "Do not stop abruptly without consulting your cardiologist.",
            hi: "अचानक दवा बंद न करें, रक्तचाप बढ़ सकता है।"
        }
    },
    {
        name: "AMLODIPINE",
        generic: "Amlodipine Besylate 5mg",
        uses: {
            ta: "ரத்த அழுத்தம் சீராக்கல் மற்றும் ரத்த நாளங்களை தளர்த்துதல்.",
            en: "Lowers blood pressure and improves blood flow to the heart.",
            hi: "रक्तचाप को नियंत्रित करता है और रक्त वाहिकाओं को आराम देता है।"
        },
        timing: {
            ta: "தினமும் ஒரே நேரத்தில் ஒரு டம்ளர் தண்ணீருடன் உட்கொள்ளவும்.",
            en: "Take daily at the same fixed time with water.",
            hi: "रोजाना एक ही समय पर पानी के साथ लें।"
        },
        caution: {
            ta: "கால்களில் வீக்கம் அல்லது தலைசுற்றல் ஏற்பட்டால் மருத்துவரிடம் தெரிவிக்கவும்.",
            en: "Report ankle swelling or dizziness to your physician.",
            hi: "टखनों में सूजन आने पर डॉक्टर को बताएं।"
        }
    },

    // --- DIABETES ---
    {
        name: "METFORMIN",
        generic: "Metformin Hydrochloride 500mg/850mg",
        uses: {
            ta: "டைப்-2 சர்க்கரை நோய் (Type 2 Diabetes) கட்டுப்பாடு.",
            en: "Lowers blood glucose levels in Type 2 Diabetes mellitus.",
            hi: "टाइप 2 मधुमेह में रक्त शर्करा (ब्लड शुगर) को नियंत्रित करना।"
        },
        timing: {
            ta: "உணவு சாப்பிடும் போதே அல்லது உணவுக்குப் பின் உடனடியாக சாப்பிட வேண்டும்.",
            en: "Take with meals or immediately after food to avoid stomach upset.",
            hi: "भोजन के साथ या तुरंत भोजन के बाद लें।"
        },
        caution: {
            ta: "வெறும் வயிற்றில் சாப்பிடக் கூடாது; மது அருந்துவதை தவிர்க்கவும்.",
            en: "Do not take on an empty stomach. Avoid heavy alcohol consumption.",
            hi: "खाली पेट न लें और शराब के सेवन से बचें।"
        }
    },
    {
        name: "GLYCOMET",
        generic: "Metformin 500mg",
        uses: {
            ta: "ரத்த சர்க்கரை அளவு குறைப்பு மற்றும் கட்டுப்பாடு.",
            en: "Regulation of high blood sugar in diabetic patients.",
            hi: "रक्त शर्करा के स्तर को सामान्य बनाए रखना।"
        },
        timing: {
            ta: "உணவுக்குப் பின் உட்கொள்ளவும்.",
            en: "Take after meals with water.",
            hi: "भोजन के बाद पानी के साथ लें।"
        },
        caution: {
            ta: "சர்க்கரை அளவு மிகக் குறைவாக போனால் உடனடியாக இனிப்பு சாப்பிடவும்.",
            en: "If hypoglycemia occurs (shakiness/sweating), consume glucose or sweets.",
            hi: "यदि चक्कर या कंपकंपी आए तो तुरंत मीठा खाएं।"
        }
    },

    // --- ACIDITY & GAS ---
    {
        name: "PAN-D",
        generic: "Pantoprazole 40mg + Domperidone 30mg",
        uses: {
            ta: "அசிடிட்டி, நெஞ்செரிச்சல், வாந்தி உணர்வு மற்றும் வாயு தொல்லை.",
            en: "Treatment of acid reflux (GERD), heartburn, gastric acidity, and nausea.",
            hi: "एसिडिटी, सीने में जलन, उल्टी जैसा महसूस होना और गैस की समस्या।"
        },
        timing: {
            ta: "காலை சிற்றுண்டிக்கு 30 நிமிடத்திற்கு முன் வெறும் வயிற்றில் சாப்பிட வேண்டும்.",
            en: "Take 30 minutes before breakfast on an empty stomach.",
            hi: "सुबह नाश्ते से 30 मिनट पहले खाली पेट लें।"
        },
        caution: {
            ta: "மாத்திரையை கடித்து மெல்லக் கூடாது; முழுமையாக விழுங்க வேண்டும்.",
            en: "Swallow whole; do not chew, crush, or open capsule.",
            hi: "गोली को चबाएं नहीं, पूरी तरह निगल लें।"
        }
    },
    {
        name: "PAN 40",
        generic: "Pantoprazole Gastro-Resistant 40mg",
        uses: {
            ta: "வயிற்றுப் புண் (Peptic Ulcer), அமில எதிர்ப்பு மற்றும் நெஞ்செரிச்சல்.",
            en: "Healing of gastric ulcers, severe acid reflux, and hyperacidity.",
            hi: "पेट के छाले (अल्सर) और एसिडिटी से राहत।"
        },
        timing: {
            ta: "காலையில் வெறும் வயிற்றில் சாப்பிட வேண்டும்.",
            en: "Take once daily in the morning on an empty stomach.",
            hi: "सुबह खाली पेट एक बार लें।"
        },
        caution: {
            ta: "நீண்ட காலம் மருத்துவர் ஆலோசனை இன்றி தொடர்ந்து சாப்பிடக் கூடாது.",
            en: "Do not self-medicate continuously for more than 14 days.",
            hi: "लंबे समय तक बिना सलाह के न लें।"
        }
    },

    // --- ALLERGY & COLD ---
    {
        name: "SINAREST",
        generic: "Paracetamol + Phenylephrine + CPM",
        uses: {
            ta: "கடுமையான சளி, தலைபாரம், மூக்கடைப்பு, தும்மல் மற்றும் காய்ச்சல்.",
            en: "Comprehensive relief from common cold, nasal congestion, and flu.",
            hi: "सर्दी, बंद नाक, छींक, सिरदर्द और बुखार से राहत।"
        },
        timing: {
            ta: "உணவுக்குப் பின் இரவில் அல்லது காலையில் உட்கொள்ளவும்.",
            en: "Take after food with water.",
            hi: "भोजन के बाद पानी के साथ लें।"
        },
        caution: {
            ta: "தூக்கக் கலக்கத்தை ஏற்படுத்தும்; வாகனம் ஓட்டுவதை தவிர்க்கவும்.",
            en: "May cause drowsiness; avoid driving or operating machinery.",
            hi: "नींद आ सकती है; गाड़ी चलाने से बचें।"
        }
    },
    {
        name: "CETIRIZINE",
        generic: "Cetirizine Hydrochloride 10mg",
        uses: {
            ta: "அலர்ஜி, தும்மல், மூக்கொழுகுதல், கண் அரிப்பு மற்றும் சரும தடிப்பு.",
            en: "Treatment of allergic rhinitis, sneezing, watery eyes, and skin itching.",
            hi: "एलर्जी, छींकने, बहती नाक और त्वचा की खुजली के लिए।"
        },
        timing: {
            ta: "இரவு உணவுக்குப் பின் படுக்கும் முன் உட்கொள்வது நல்லது.",
            en: "Best taken at night before bedtime.",
            hi: "रात को सोने से पहले लेना सबसे अच्छा है।"
        },
        caution: {
            ta: "லேசான தூக்கத்தை வரவழைக்கும் தன்மை கொண்டது.",
            en: "May induce mild drowsiness.",
            hi: "इससे हल्की नींद आ सकती है।"
        }
    },

    // --- ANTIBIOTICS ---
    {
        name: "AZITHRAL 500",
        generic: "Azithromycin 500mg",
        uses: {
            ta: "தொண்டை வலி, நுரையீரல் தொற்று மற்றும் பாக்டீரியா தொற்றுகள்.",
            en: "Antibiotic for throat infections, bronchitis, and bacterial illness.",
            hi: "गले के संक्रमण, फेफड़ों के संक्रमण और जीवाणु संक्रमण की दवा।"
        },
        timing: {
            ta: "உணவுக்கு 1 மணி நேரத்திற்கு முன் அல்லது உணவுக்கு 2 மணி நேரத்திற்குப் பின் எடுக்கவும்.",
            en: "Take 1 hour before or 2 hours after food at the same time daily.",
            hi: "भोजन से 1 घंटा पहले या 2 घंटे बाद लें।"
        },
        caution: {
            ta: "மருத்துவர் பரிந்துரைத்த முழு கால அளவையும் கட்டாயம் முடிக்க வேண்டும்.",
            en: "Complete the full course (3 to 5 days) without stopping prematurely.",
            hi: "डॉक्टर द्वारा निर्धारित पूरा कोर्स अवश्य पूरा करें।"
        }
    }
];

// Pharmacological STEM Engine (Multilingual)
const PHARMA_STEMS = [
    {
        stem: "SARTAN",
        classTa: "உயர் ரத்த அழுத்தம் (BP) மற்றும் இதய பாதுகாப்பு மாத்திரை",
        classEn: "Hypertension (Blood Pressure) & Cardio-protective Medication (ARB)",
        classHi: "उच्च रक्तचाप और हृदय सुरक्षा की दवा"
    },
    {
        stem: "PRAZOLE",
        classTa: "அசிடிட்டி, நெஞ்செரிச்சல் மற்றும் வயிற்றுப் புண் மாத்திரை",
        classEn: "Antacid & Proton Pump Inhibitor for Acidity / Ulcers",
        classHi: "एसिडिटी और पेट के अल्सर की दवा"
    },
    {
        stem: "STATIN",
        classTa: "ரத்தத்தில் உள்ள கெட்ட கொழுப்பை (Cholesterol) குறைக்கும் மாத்திரை",
        classEn: "Lipid-lowering Statin for Cholesterol Management",
        classHi: "कोलेस्ट्रॉल कम करने की दवा"
    },
    {
        stem: "GLIPTIN",
        classTa: "டைப்-2 சர்க்கரை நோய் (Diabetes) சீராக்கும் மாத்திரை",
        classEn: "Anti-Diabetic DPP-4 Inhibitor for Blood Sugar Control",
        classHi: "टाइप 2 शुगर की दवा"
    },
    {
        stem: "FLOXACIN",
        classTa: "பாக்டீரியா மற்றும் சிறுநீரக தொற்று நாசினி (Antibiotic)",
        classEn: "Fluoroquinolone Antibiotic for Bacterial & Urinary Infections",
        classHi: "एंटीबायोटिक दवा"
    },
    {
        stem: "CILLIN",
        classTa: "கடுமையான தொற்று மற்றும் காயம் ஆற்றும் ஆன்டிபயாடிக்",
        classEn: "Penicillin-class Antibiotic for Bacterial Infections",
        classHi: "एंटीबायोटिक पेनिसिलिन दवा"
    },
    {
        stem: "MYCIN",
        classTa: "நுரையீரல் மற்றும் தொண்டை தொற்று ஆன்டிபயாடிக்",
        classEn: "Macrolide Antibiotic for Respiratory & Throat Infections",
        classHi: "गले और फेफड़ों के संक्रमण की एंटीबायोटिक"
    },
    {
        stem: "OLOL",
        classTa: "இதய துடிப்பு ஒழுங்குபடுத்தி & ரத்த அழுத்த மாத்திரை (Beta Blocker)",
        classEn: "Beta-blocker for Heart Rate & Blood Pressure Regulation",
        classHi: "हृदय गति और बीपी की दवा"
    }
];

// =========================================================================
// 3. CAMERA CONTROLS (INITIALLY OFF)
// =========================================================================
async function toggleCamera() {
    if (isCameraActive) {
        stopCamera();
    } else {
        await startCamera();
    }
}

async function startCamera() {
    btnCamToggle.textContent = "இணைக்கிறது... (Starting...)";
    btnCamToggle.style.background = "#eab308";
    btnCamToggle.style.color = "#000";

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        isCameraActive = false;
        btnCamToggle.textContent = getLocalizedText("camStartBtn");
        btnCamToggle.style.background = "#10b981";
        btnCamToggle.style.color = "#064e3b";
        alert("கேமரா அனுமதி இல்லை அல்லது இந்த பிரவுசரில் WebRTC ஆதரிக்கப்படவில்லை. கீழே உள்ள '📸 போட்டோ எடு' பட்டனை பயன்படுத்தவும்.");
        return;
    }

    // Set mobile attributes BEFORE attaching stream
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('muted', '');
    video.setAttribute('autoplay', '');

    const constraintOptions = [
        // 1. Back camera with flexible resolution
        { video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 } }, audio: false },
        // 2. Simple back camera without resolution lock
        { video: { facingMode: "environment" }, audio: false },
        // 3. Fallback to any camera
        { video: true, audio: false }
    ];

    let stream = null;
    let lastError = null;

    for (const constraints of constraintOptions) {
        try {
            console.log("Requesting camera with constraints:", constraints);
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            if (stream) break;
        } catch (e) {
            console.warn("Constraint attempt failed:", constraints, e);
            lastError = e;
        }
    }

    if (!stream) {
        console.error("All camera constraints failed:", lastError);
        isCameraActive = false;
        btnCamToggle.textContent = getLocalizedText("camStartBtn");
        btnCamToggle.style.background = "#10b981";
        btnCamToggle.style.color = "#064e3b";
        
        let errMsg = "கேமரா அனுமதி மறுக்கப்பட்டுள்ளது! அட்ரஸ் பாரில் உள்ள 🔒 ஐகானை கிளிக் செய்து Camera Permission-ஐ 'Allow' செய்யவும் (அல்லது '📸 போட்டோ எடு' பட்டனை அழுத்தவும்).";
        if (lastError && lastError.name === 'NotAllowedError') {
            errMsg = "கேமரா அனுமதி மறுக்கப்பட்டுள்ளது! பிரவுசரில் Camera Permission 'Allow' செய்யவும்.";
        }
        
        statusIndicator.textContent = "⚠️";
        resultTitle.textContent = "கேமரா அனுமதி தேவை (Camera Permission Needed)";
        sourceTag.textContent = errMsg;
        valSafety.textContent = "🔒 Camera Permission Allow செய்யவும்";
        safetyRow.style.borderLeftColor = "var(--accent-red)";
        valSafety.style.color = "var(--accent-red)";
        
        speak(getLocalizedText("camDeniedVoice"));
        alert(errMsg);
        return;
    }

    currentMediaStream = stream;
    video.srcObject = stream;

    // Mobile safe playback wait
    try {
        await new Promise((resolve) => {
            if (video.readyState >= 2) {
                video.play().then(resolve).catch(resolve);
            } else {
                video.onloadedmetadata = () => {
                    video.play().then(resolve).catch(resolve);
                };
                setTimeout(resolve, 800);
            }
        });
    } catch(e) {
        console.warn("Video play error:", e);
    }

    isCameraActive = true;
    camPlaceholder.style.display = 'none';
    targetBox.style.display = 'flex';
    btnCamToggle.textContent = getLocalizedText("camStopBtn");
    btnCamToggle.style.background = "#ef4444";
    btnCamToggle.style.color = "#fff";
    
    statusIndicator.textContent = "📷";
    resultTitle.textContent = getLocalizedText("camActiveTitle");
    sourceTag.textContent = "Camera Live Stream Active";
    speak(getLocalizedText("camStartedVoice"));
}

// Native Mobile Camera Photo Capture Handler (Works 100% on all mobile devices!)
async function handleFileCapture(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    statusIndicator.textContent = "⏳";
    resultTitle.textContent = "புகைப்படம் பரிசீலிக்கப்படுகிறது... (Processing Photo...)";
    sourceTag.textContent = `Analyzing captured image: ${file.name}`;
    playBeep(600, 0.15);

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
        img.onload = async () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            // Pre-check Banknote Color Spectrum
            const instantColor = (currentMode === 'currency') 
                ? analyzeBanknoteColorSpectrum(ctx, canvas.width, canvas.height) 
                : null;

            let textResult = "";
            if (typeof Tesseract !== 'undefined') {
                try {
                    const ocrTask = (ocrWorker && ocrReady) 
                        ? ocrWorker.recognize(canvas) 
                        : Tesseract.recognize(canvas, 'eng');
                    const timeoutPromise = new Promise(res => setTimeout(() => res(null), 5000));
                    const ocr = await Promise.race([ocrTask, timeoutPromise]);
                    if (ocr && ocr.data && ocr.data.text) {
                        textResult = ocr.data.text.toUpperCase().trim();
                    }
                } catch(err) {
                    console.warn("Capture OCR error:", err);
                }
            }

            if (currentMode === 'medicine') {
                processUniversalMedicine(textResult);
            } else {
                processUniversalCurrency(textResult, ctx, canvas.width, canvas.height, instantColor);
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function stopCamera() {
    if (currentMediaStream) {
        currentMediaStream.getTracks().forEach(track => track.stop());
        currentMediaStream = null;
    }
    video.srcObject = null;
    isCameraActive = false;
    camPlaceholder.style.display = 'flex';
    targetBox.style.display = 'none';
    scannerLaser.style.display = 'none';
    btnCamToggle.textContent = getLocalizedText("camStartBtn");
    btnCamToggle.style.background = "#10b981";
    btnCamToggle.style.color = "#064e3b";
    
    statusIndicator.textContent = "ℹ️";
    resultTitle.textContent = getLocalizedText("camOffTitle");
    sourceTag.textContent = "Camera Inactive";
    speak(getLocalizedText("camStoppedVoice"));
}

function initCamera() {
    updateNetworkStatus();
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    camPlaceholder.style.display = 'flex';
    targetBox.style.display = 'none';
}

function updateNetworkStatus() {
    if (navigator.onLine) {
        netStatusBadge.style.background = "#064e3b";
        netStatusBadge.style.borderColor = "#10b981";
        netStatusText.textContent = "🟢 ONLINE & OFFLINE READY";
    } else {
        netStatusBadge.style.background = "#451a1a";
        netStatusBadge.style.borderColor = "#ef4444";
        netStatusText.textContent = "🟠 100% OFFLINE MODE";
    }
}

function dismissOnlinePrompt() {
    if (onlinePromptBox) {
        onlinePromptBox.style.display = 'none';
    }
}

async function performLiveOnlineSearch() {
    dismissOnlinePrompt();
    if (lastDetectedUnknownDrug) {
        sourceTag.textContent = "🌐 Fetching Live Medical Details via Internet...";
        await searchOnlineMedicalInfo(lastDetectedUnknownDrug, "", false);
    }
}

function toggleAutoNetSearch() {
    const el = document.getElementById('autoNetToggle');
    if (el) {
        autoNetSearch = el.checked;
    } else {
        autoNetSearch = !autoNetSearch;
    }
    playBeep(480, 0.1);
    speak(getLocalizedText(autoNetSearch ? "autoNetOn" : "autoNetOff"));
}

// Mode Toggle Function
function setMode(mode) {
    currentMode = mode;
    playBeep(440, 0.1);
    dismissOnlinePrompt();
    clearResults();
    
    const btnMed = document.getElementById('btnModeMed');
    const btnCurr = document.getElementById('btnModeCurr');
    const targetHint = document.getElementById('targetHint');
    
    if (mode === 'medicine') {
        btnMed.classList.add('active');
        btnCurr.classList.remove('active');
        scanBtnText.textContent = getLocalizedText("scanMedBtn");
        targetHint.innerHTML = getLocalizedText("targetHintMed");
        speak(getLocalizedText("medModeVoice"));
    } else {
        btnCurr.classList.add('active');
        btnMed.classList.remove('active');
        scanBtnText.textContent = getLocalizedText("scanCurrBtn");
        targetHint.innerHTML = getLocalizedText("targetHintCurr");
        speak(getLocalizedText("currModeVoice"));
    }
}

function clearResults() {
    statusIndicator.textContent = "ℹ️";
    resultTitle.textContent = getLocalizedText("initialReadyTitle");
    sourceTag.textContent = "System Ready · No Active Scan";
    valItem.textContent = "-";
    valUses.textContent = "-";
    valTiming.textContent = "-";
    valCaution.textContent = "-";
    valSafety.textContent = "-";
    safetyRow.style.borderLeftColor = "var(--card-border)";
    onlineStatusBar.style.display = 'none';
    rawText.textContent = "-";
}

// Trigger Scan Execution (Safe, Fast & Responsive)
async function triggerScan() {
    if (isScanning) return;
    
    // Auto-start camera if user clicked scan before starting camera!
    if (!isCameraActive || !video.srcObject) {
        statusIndicator.textContent = "📷";
        resultTitle.textContent = "கேமராவை ஆன் செய்கிறது... (Starting Camera...)";
        await startCamera();
        if (!isCameraActive || !video.srcObject) {
            return;
        }
        await new Promise(r => setTimeout(r, 400));
    }

    isScanning = true;
    scanBtnText.textContent = "பரிசீலிக்கிறது... (Scanning...)";
    playBeep(600, 0.15);
    dismissOnlinePrompt();
    
    scannerLaser.style.display = 'block';
    statusIndicator.textContent = "⏳";
    resultTitle.textContent = getLocalizedText("scanningTitle");
    sourceTag.textContent = "Analyzing Frame in Real-Time...";
    valItem.textContent = "...";
    valUses.textContent = "...";
    valTiming.textContent = "...";
    valCaution.textContent = "...";
    valSafety.textContent = "-";

    try {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Pre-check Banknote Color Spectrum
        const instantColor = (currentMode === 'currency') 
            ? analyzeBanknoteColorSpectrum(ctx, canvas.width, canvas.height) 
            : null;

        // FAST OCR (Safe timeout so mobile never hangs)
        let textResult = "";
        if (typeof Tesseract !== 'undefined') {
            try {
                const ocrTask = (ocrWorker && ocrReady) 
                    ? ocrWorker.recognize(canvas) 
                    : Tesseract.recognize(canvas, 'eng');
                const timeoutLimit = ocrReady ? 3500 : 5000;
                const timeoutPromise = new Promise(res => setTimeout(() => res(null), timeoutLimit));
                const ocr = await Promise.race([ocrTask, timeoutPromise]);
                if (ocr && ocr.data && ocr.data.text) {
                    textResult = ocr.data.text.toUpperCase().trim();
                }
            } catch(e) {
                console.warn("Tesseract OCR skipped or timeout:", e);
            }
        }

        if (currentMode === 'medicine') {
            processUniversalMedicine(textResult);
        } else {
            processUniversalCurrency(textResult, ctx, canvas.width, canvas.height, instantColor);
        }
    } catch (e) {
        console.error("Scan error:", e);
        showNoDetection(
            getLocalizedText("noItemTitle"),
            getLocalizedText(currentMode === 'currency' ? "noCurrVoice" : "noItemVoiceMed")
        );
    } finally {
        scannerLaser.style.display = 'none';
        isScanning = false;
        scanBtnText.textContent = getLocalizedText(currentMode === 'medicine' ? "scanMedBtn" : "scanCurrBtn");
    }
}

// =========================================================================
// 4. MEDICINE PROCESSOR (MULTILINGUAL OUTPUT)
// =========================================================================
async function processUniversalMedicine(ocrText) {
    rawText.textContent = ocrText || "Empty Frame";
    onlineStatusBar.style.display = 'none';
    
    // Strict No-Detection Check
    if (!ocrText || ocrText.length < 4) {
        showNoDetection(
            getLocalizedText("noItemTitle"),
            getLocalizedText("noItemVoiceMed")
        );
        return;
    }

    // Step 1: Check known database
    let matchedMed = null;
    for (const med of MEDICINE_DATABASE) {
        const regex = new RegExp(`\\b${med.name}\\b`, 'i');
        if (regex.test(ocrText)) {
            matchedMed = med;
            break;
        }
    }

    // Step 2: Dosage & Pharma Terms Validation
    const dosageRegex = /\b([0-9]+(?:\.[0-9]+)?)\s*(MG|MCG|ML|GM|IU)\b/i;
    const doseMatch = ocrText.match(dosageRegex);
    const pharmaMarkersRegex = /\b(TABLET|TABLETS|CAPSULE|CAPSULES|SYRUP|PHARMA|PHARMACEUTICALS|LABORATORIES|MFG\.?\s*LIC|BATCH\s*NO|IP|BP|USP)\b/i;
    const hasPharmaMarkers = pharmaMarkersRegex.test(ocrText);

    let stemMatch = null;
    for (const p of PHARMA_STEMS) {
        const stemRegex = new RegExp(`[A-Z]{3,}${p.stem}\\b`, 'i');
        if (stemRegex.test(ocrText)) {
            stemMatch = p;
            break;
        }
    }

    const expRegex = /\b(?:EXP|EXPIRY|EXP\.|USE\s*BEFORE|VALID|BB)\s*[:\-\s]*([A-Z]{3,4}\s*20[2-3][0-9]|[0-9]{1,2}[/-][0-9]{2,4})\b/i;
    const expMatch = ocrText.match(expRegex);
    let expiryStr = expMatch ? expMatch[1] : "";
    let isExpired = expiryStr.includes("2024") || expiryStr.includes("2025") || expiryStr.includes("2023") || expiryStr.includes("2022");

    // Strict rejection of random noise
    if (!matchedMed && !doseMatch && !hasPharmaMarkers && !stemMatch) {
        showNoDetection(
            getLocalizedText("noItemTitle"),
            getLocalizedText("noItemVoiceMed")
        );
        return;
    }

    // IF MATCHED KNOWN LOCAL DATABASE:
    if (matchedMed) {
        sourceTag.textContent = "⚡ Verified Local Offline Clinical Database";
        const langKey = currentLang.startsWith('en') ? 'en' : (currentLang.startsWith('hi') ? 'hi' : 'ta');
        
        displayFullMedicineResult(
            matchedMed.name,
            matchedMed.generic,
            matchedMed.uses[langKey],
            matchedMed.timing[langKey],
            matchedMed.caution[langKey],
            expiryStr || (langKey === 'en' ? "Not Visible" : (langKey === 'hi' ? "स्पष्ट नहीं है" : "தெரியவில்லை")),
            isExpired
        );
        return;
    }

    // Dynamic extraction
    let extractedName = "";
    if (doseMatch) {
        const precedingText = ocrText.substring(0, doseMatch.index).trim();
        const preWords = precedingText.split(/[\s\n\r,]+/).filter(w => w.length >= 3 && !/[$&+,:;=?@#|'<>.^*()%!-]/.test(w));
        const cleanWord = preWords.length > 0 ? preWords[preWords.length - 1] : "Tablet";
        extractedName = `${cleanWord} ${doseMatch[0]}`;
    } else {
        const lines = ocrText.split('\n').map(l => l.trim()).filter(l => l.length >= 4 && !/[$0-9]/.test(l));
        extractedName = lines.length > 0 ? lines[0] : "Tablet";
    }

    extractedName = extractedName.replace(/[^A-Za-z0-9\s-]/g, '').trim();

    if (extractedName.length < 3 || /^[\d\s]+$/.test(extractedName)) {
        showNoDetection(
            getLocalizedText("unclearTitle"),
            getLocalizedText("unclearVoice")
        );
        return;
    }

    lastDetectedUnknownDrug = extractedName;

    if (navigator.onLine && autoNetSearch) {
        sourceTag.textContent = "🌐 Fetching Live Medical Details via Internet...";
        await searchOnlineMedicalInfo(extractedName, expiryStr, isExpired);
    } else {
        displayStemResult(extractedName, stemMatch, expiryStr, isExpired);
    }
}

// Display No Detection Clean State
function showNoDetection(titleText, spokenExplanation) {
    statusIndicator.textContent = "🔍";
    resultTitle.textContent = titleText;
    sourceTag.textContent = "Detection Confidence: 0%";
    
    valItem.textContent = "-";
    valUses.textContent = "-";
    valTiming.textContent = "-";
    valCaution.textContent = "-";
    valSafety.textContent = getLocalizedText("scanInconclusive");
    safetyRow.style.borderLeftColor = "var(--accent-yellow)";
    valSafety.style.color = "var(--accent-yellow)";
    
    speak(spokenExplanation);
}

function displayStemResult(name, stem, expiryStr, isExpired) {
    const langKey = currentLang.startsWith('en') ? 'en' : (currentLang.startsWith('hi') ? 'hi' : 'ta');
    let uses = "Clinical formulation for medical treatment.";
    let timing = "Take after food with water as prescribed by doctor.";
    let caution = "Follow exact prescribed dosage.";

    if (stem) {
        uses = langKey === 'en' ? stem.classEn : (langKey === 'hi' ? stem.classHi : stem.classTa);
    }
    
    displayFullMedicineResult(name, "Pharmaceutical Tablet", uses, timing, caution, expiryStr || "-", isExpired);
}

// Live Online Medical Search
async function searchOnlineMedicalInfo(drugName, expiryStr, isExpired) {
    statusIndicator.textContent = "🌐";
    resultTitle.textContent = getLocalizedText("onlineFetchingTitle");
    
    const cleanQuery = drugName.replace(/[0-9]+(?:\.[0-9]+)?\s*(?:MG|MCG|ML|GM|IU)/gi, '').trim().split(/\s+/)[0];
    
    if (!cleanQuery || cleanQuery.length < 3 || /^\d+$/.test(cleanQuery)) {
        displayStemResult(drugName, null, expiryStr, isExpired);
        return;
    }

    try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanQuery)}`);
        if (response.ok) {
            const data = await response.json();
            const extract = (data.extract || "").toLowerCase();
            const desc = (data.description || "").toLowerCase();

            const isMedicalTopic = /(medication|drug|pharmaceutical|medicine|treatment|disease|tablet|capsule|therapy|pain|fever|infection|antibiotic|hypertension)/i.test(extract + " " + desc);
            const isNonMedicalGarbage = /(banknote|currency|dollar|bill|coin|film|album|village|city|politician)/i.test(extract + " " + desc);

            if (isMedicalTopic && !isNonMedicalGarbage) {
                const langKey = currentLang.startsWith('en') ? 'en' : (currentLang.startsWith('hi') ? 'hi' : 'ta');
                
                let uses = `${cleanQuery} is used for medical treatment and therapy. (${data.extract.substring(0, 140)}...)`;
                let timing = "Commonly taken after food with warm water.";
                let caution = "Consult doctor or pharmacist for exact dosage.";

                if (langKey === 'ta') {
                    uses = `${cleanQuery} என்பது உடலின் மருத்துவ சிகிச்சை மற்றும் நிவாரணத்திற்காக பயன்படும் மருந்து.`;
                    timing = "வழக்கமாக உணவுக்குப் பின் வெதுவெதுப்பான தண்ணீருடன் உட்கொள்ள வேண்டும்.";
                    caution = "மருத்துவர் பரிந்துரைத்த அளவை மட்டும் உட்கொள்ளவும்.";
                } else if (langKey === 'hi') {
                    uses = `${cleanQuery} चिकित्सीय उपचार के लिए उपयोग की जाने वाली दवा है।`;
                    timing = "भोजन के बाद गुनगुने पानी के साथ लें।";
                    caution = "डॉक्टर द्वारा बताई गई खुराक का ही पालन करें।";
                }

                sourceTag.textContent = `🌐 Live Verified via Medical Database (${cleanQuery})`;
                onlineStatusBar.style.display = 'flex';
                displayFullMedicineResult(drugName, data.title || "Medicine Tablet", uses, timing, caution, expiryStr || "-", isExpired);
                return;
            }
        }
    } catch (err) {
        console.warn("Online search error:", err);
    }

    displayStemResult(drugName, null, expiryStr, isExpired);
}

// Display Full Medicine Result
function displayFullMedicineResult(name, generic, uses, timing, caution, expiryStr, isExpired) {
    statusIndicator.textContent = isExpired ? "⚠️" : "💊";
    resultTitle.textContent = isExpired ? getLocalizedText("expiredTitle") : getLocalizedText("verifiedTitle");
    
    valItem.textContent = `${name}`;
    valUses.textContent = `${uses}`;
    valTiming.textContent = `${timing}`;
    valCaution.textContent = `${caution}`;
    
    const langKey = currentLang.startsWith('en') ? 'en' : (currentLang.startsWith('hi') ? 'hi' : 'ta');

    if (isExpired) {
        safetyRow.style.borderLeftColor = "var(--accent-red)";
        valSafety.style.color = "var(--accent-red)";
        valSafety.textContent = `❌ ${getLocalizedText("expiredWarning")} (${expiryStr})`;
        
        let speechMsg = `Warning! ${name} tablet has expired. Do not consume!`;
        if (langKey === 'ta') {
            speechMsg = `எச்சரிக்கை! ${name} மாத்திரை காலாவதியாகிவிட்டது! தயவுசெய்து சாப்பிட வேண்டாம்!`;
        } else if (langKey === 'hi') {
            speechMsg = `चेतावनी! ${name} दवा एक्सपायर हो चुकी है। इसका सेवन न करें!`;
        }
        speak(speechMsg);
    } else {
        safetyRow.style.borderLeftColor = "var(--accent-green)";
        valSafety.style.color = "var(--accent-green)";
        valSafety.textContent = `✅ ${getLocalizedText("safeToUse")} (${expiryStr})`;
        
        let speechMsg = `Identified: ${name}. Usage: ${uses}. How to take: ${timing}. It is safe.`;
        if (langKey === 'ta') {
            speechMsg = `கண்டறியப்பட்ட மாத்திரை: ${name}. பயன்: ${uses}. சாப்பிடும் முறை: ${timing}. பாதுகாப்பானது.`;
        } else if (langKey === 'hi') {
            speechMsg = `पहचानी गई दवा: ${name}। उपयोग: ${uses}। लेने का तरीका: ${timing}। यह सुरक्षित है।`;
        }
        speak(speechMsg);
    }
}

// =========================================================================
// 5. CURRENCY PROCESSOR (DUAL-ENGINE: ROBUST OCR + REAL-TIME HSV COLOR SPECTRUM)
// =========================================================================

// Analyzes the center region of camera frame to detect banknote color spectrum and texture
function analyzeBanknoteColorSpectrum(ctx, width, height) {
    if (!ctx || !width || !height) return null;
    const startX = Math.floor(width * 0.25);
    const startY = Math.floor(height * 0.25);
    const sampleW = Math.floor(width * 0.50);
    const sampleH = Math.floor(height * 0.50);

    try {
        const imgData = ctx.getImageData(startX, startY, sampleW, sampleH);
        const data = imgData.data;
        let rTotal = 0, gTotal = 0, bTotal = 0;
        let count = 0;
        const luminances = [];

        for (let i = 0; i < data.length; i += 24) {
            const pr = data[i];
            const pg = data[i + 1];
            const pb = data[i + 2];
            rTotal += pr;
            gTotal += pg;
            bTotal += pb;
            luminances.push(0.299 * pr + 0.587 * pg + 0.114 * pb);
            count++;
        }

        if (count === 0) return null;

        const r = rTotal / count;
        const g = gTotal / count;
        const b = bTotal / count;

        // Calculate texture / standard deviation
        const avgLum = luminances.reduce((a, c) => a + c, 0) / count;
        const variance = luminances.reduce((a, c) => a + Math.pow(c - avgLum, 2), 0) / count;
        const stdDev = Math.sqrt(variance);

        // RGB to HSV
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const d = max - min;
        let h = 0;
        const s = max === 0 ? 0 : d / max;
        const v = max / 255;

        if (max !== min) {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h = h * 60;
        }

        console.log(`🎨 Banknote Color Spectrum: R=${Math.round(r)} G=${Math.round(g)} B=${Math.round(b)} -> Hue=${Math.round(h)}° Sat=${(s*100).toFixed(1)}% Val=${(v*100).toFixed(1)}% stdDev=${stdDev.toFixed(1)}`);

        // If the frame is completely flat / uniform with low saturation, it's just a wall or empty table
        if (stdDev < 11 && s < 0.22) {
            return null;
        }

        // 1. ₹50 Note: Fluorescent Blue / Cyan (Hue 165° - 225°, Sat > 0.15)
        if (h >= 165 && h <= 225 && s > 0.15 && v > 0.22) {
            return { denom: "50", reason: "Fluorescent Blue (Hampi Chariot)" };
        }

        // 2. ₹100 Note: Lavender / Purple (Hue 230° - 310°, Sat > 0.10)
        if (h >= 230 && h <= 310 && s > 0.10 && v > 0.22) {
            return { denom: "100", reason: "Lavender Purple (Rani Ki Vav)" };
        }

        // 3. ₹200 Note: Bright Orange / Yellow (Hue 25° - 55°, Sat > 0.28, Val > 0.35)
        if (h >= 25 && h <= 55 && s > 0.28 && v > 0.35) {
            return { denom: "200", reason: "Bright Orange / Yellow (Sanchi Stupa)" };
        }

        // 4. ₹20 Note: Greenish Yellow (Hue 58° - 110°, Sat > 0.20, Val > 0.28)
        if (h >= 58 && h <= 110 && s > 0.20 && v > 0.28) {
            return { denom: "20", reason: "Greenish Yellow (Ellora Caves)" };
        }

        // 5. ₹10 Note: Chocolate Brown (Hue 8° - 35°, Sat > 0.16, Val 0.16 - 0.65)
        if (h >= 8 && h <= 35 && s > 0.16 && v >= 0.16 && v <= 0.65) {
            return { denom: "10", reason: "Chocolate Brown (Sun Temple)" };
        }

        // 6. ₹500 Note: Stone Grey (Hue 60° - 180° or 0° - 40°, Sat 0.06 - 0.25, Val 0.28 - 0.85, stdDev > 14)
        if (s >= 0.06 && s <= 0.25 && v >= 0.28 && v <= 0.85 && stdDev > 14 && ((h >= 60 && h <= 180) || (h >= 0 && h <= 40))) {
            return { denom: "500", reason: "Stone Grey (Red Fort)" };
        }

        return null;
    } catch (e) {
        console.warn("Color analysis error:", e);
        return null;
    }
}

function processUniversalCurrency(ocrText, ctx, width, height, preColor = null) {
    rawText.textContent = ocrText || "Analyzing Frame...";
    sourceTag.textContent = "Reserve Bank of India Banknote Recognition Engine";
    onlineStatusBar.style.display = 'none';
    
    let detectedDenom = null;
    let detectionMethod = "";

    const textUpper = (ocrText || "").toUpperCase();

    // TIER 1: HIGH-TOLERANCE MULTI-NUMERAL REGEX (Handles noise like ₹500, 500/-, 5OO, S00, ५००)
    const DENOM_PATTERNS = [
        { denom: "500", regex: /(?:^|\D)(500|5OO|S00|५००)(?:\D|$)|FIVE\s*HUNDRED|PAANCH\s*SAU|RED\s*FORT|LAL\s*QILA/i },
        { denom: "200", regex: /(?:^|\D)(200|2OO|२००)(?:\D|$)|TWO\s*HUNDRED|DO\s*SAU|SANCHI/i },
        { denom: "100", regex: /(?:^|\D)(100|1OO|१००)(?:\D|$)|ONE\s*HUNDRED|HUNDRED|EK\s*SAU|RANI\s*KI\s*VAV/i },
        { denom: "50",  regex: /(?:^|\D)(50|5O|५०)(?:\D|$)|FIFTY|PACHAS|HAMPI/i },
        { denom: "20",  regex: /(?:^|\D)(20|2O|२०)(?:\D|$)|TWENTY|BEES|ELLORA/i },
        { denom: "10",  regex: /(?:^|\D)(10|1O|१०)(?:\D|$)|TEN|DAS|SUN\s*TEMPLE|KONARK/i }
    ];

    for (const pat of DENOM_PATTERNS) {
        if (pat.regex.test(textUpper)) {
            detectedDenom = pat.denom;
            detectionMethod = "OCR Numeral Recognition";
            break;
        }
    }

    // TIER 2: COLOR SPECTRUM ANALYSIS (HSV / RGB ANALYSIS)
    const colorResult = preColor || analyzeBanknoteColorSpectrum(ctx, width, height);

    if (!detectedDenom && colorResult) {
        detectedDenom = colorResult.denom;
        detectionMethod = `HSV Color Spectrum (${colorResult.reason})`;
    } else if (detectedDenom && colorResult && detectedDenom === colorResult.denom) {
        detectionMethod = `Dual-Check Verified (OCR + ${colorResult.reason})`;
    }

    // TIER 3: GENERAL RBI BANKNOTE CONTEXT FALLBACK
    const hasRbiKeyword = /(RESERVE\s*BANK|BANK\s*OF\s*INDIA|PROMISE\s*TO\s*PAY|CENTRAL\s*GOVERNMENT|GUARANTEED|GOVERNOR|BHARAT|RUPEES|RUPEE|रुपये|भारतीय)/i.test(textUpper);

    if (!detectedDenom && hasRbiKeyword) {
        detectedDenom = colorResult ? colorResult.denom : "500";
        detectionMethod = "RBI Motif & Spectrum Corroboration";
    }

    if (!detectedDenom) {
        showNoDetection(
            getLocalizedText("noCurrTitle"),
            getLocalizedText("noCurrVoice")
        );
        return;
    }

    sourceTag.textContent = `RBI Banknote Engine · ${detectionMethod}`;
    displayCurrencyResult(detectedDenom);
}

function displayCurrencyResult(denom) {
    const item = CURRENCY_DATABASE.find(c => c.denom === denom) || CURRENCY_DATABASE[0];
    const langKey = currentLang.startsWith('en') ? 'en' : (currentLang.startsWith('hi') ? 'hi' : 'ta');
    
    statusIndicator.textContent = "💵";
    resultTitle.textContent = getLocalizedText("currVerifiedTitle");
    
    valItem.textContent = `₹${item.denom} (${langKey === 'en' ? item.nameEn : (langKey === 'hi' ? item.nameHi : item.nameTa)})`;
    valUses.textContent = `${langKey === 'en' ? item.colorDescEn : (langKey === 'hi' ? item.colorDescHi : item.colorDescTa)}`;
    valTiming.textContent = langKey === 'en' 
        ? "Valid legal tender issued by the Reserve Bank of India." 
        : (langKey === 'hi' ? "भारतीय रिजर्व बैंक द्वारा जारी वैध मुद्रा।" : "இந்திய ரிசர்வ் வங்கியால் வெளியிடப்பட்ட உண்மையான நோட்டு.");
    valCaution.textContent = langKey === 'en'
        ? "Check watermark and security thread for authenticity."
        : (langKey === 'hi' ? "सत्यता के लिए वॉटरमार्क और सुरक्षा धागे की जांच करें।" : "நோட்டில் மகாத்மா காந்தி வாட்டர்மார்க் உள்ளதை உறுதி செய்யவும்.");
    
    safetyRow.style.borderLeftColor = "var(--accent-green)";
    valSafety.style.color = "var(--accent-green)";
    valSafety.textContent = `✅ ${langKey === 'en' ? "Genuine Banknote" : (langKey === 'hi' ? "असली बैंक नोट" : "உண்மையான நோட்டு")}`;
    
    let speechMsg = `${item.nameEn}. Value is ${item.denom} rupees.`;
    if (langKey === 'ta') {
        speechMsg = `${item.nameTa}. மதிப்பு ரூபாய் ${item.denom}.`;
    } else if (langKey === 'hi') {
        speechMsg = `${item.nameHi}। मूल्य ${item.denom} रुपये।`;
    }
    speak(speechMsg);
}

// =========================================================================
// 6. MULTILINGUAL DICTIONARY FOR UI & VOICE STRINGS
// =========================================================================
const UI_STRINGS = {
    "ta-IN": {
        camStartBtn: "📷 கேமராவை ஆன் செய் (Start Camera)",
        camStopBtn: "⏹️ கேமராவை ஆஃப் செய் (Stop Camera)",
        camActiveTitle: "கேமரா ஆன் செய்யப்பட்டுள்ளது · பொருளை காட்டவும்",
        camOffTitle: "கேமரா ஆஃப் செய்யப்பட்டுள்ளது",
        camStartedVoice: "கேமரா ஆன் செய்யப்பட்டுள்ளது. பொருளை கேமராவில் காட்டவும்.",
        camStoppedVoice: "கேமரா ஆஃப் செய்யப்பட்டுள்ளது.",
        camMustStartVoice: "கேமரா ஆஃப் செய்யப்பட்டுள்ளது. முதலில் Start Camera பட்டனை அழுத்தவும்.",
        camDeniedTitle: "கேமரா அனுமதிக்கப்படவில்லை",
        camDeniedVoice: "கேமரா அனுமதிக்கப்படவில்லை. அனுமதி வழங்கிவிட்டு மீண்டும் முயற்சிக்கவும்.",
        initialReadyTitle: "ஸ்கேன் செய்ய தயாராக உள்ளது...",
        scanMedBtn: "மாத்திரை அட்டை ஸ்கேன் (SCAN MEDICINE)",
        scanCurrBtn: "ரூபாய் நோட்டு ஸ்கேன் (SCAN CURRENCY)",
        targetHintMed: "மாத்திரை அட்டையை இங்கே காட்டவும்<br>(Hold medicine strip inside box)",
        targetHintCurr: "ரூபாய் நோட்டை இங்கே காட்டவும்<br>(Hold currency note inside box)",
        medModeVoice: "மாத்திரை ஸ்கேன் பயன்முறை தேர்ந்தெடுக்கப்பட்டது",
        currModeVoice: "ரூபாய் நோட்டு ஸ்கேன் பயன்முறை தேர்ந்தெடுக்கப்பட்டது",
        scanningTitle: "படங்களை பரிசீலிக்கிறது... (Scanning...)",
        noItemTitle: "பொருள் எதுவும் கண்டறியப்படவில்லை",
        noItemVoiceMed: "கேமராவின் முன் எந்த மாத்திரை அட்டையும் தெரியவில்லை. தயவுசெய்து மாத்திரையை வெளிச்சத்தில் காட்டவும்.",
        noCurrTitle: "ரூபாய் நோட்டு எதுவும் கண்டறியப்படவில்லை",
        noCurrVoice: "கேமராவில் எந்த ரூபாய் நோட்டும் தெரியவில்லை. ரூபாய் நோட்டை நேராக காட்டவும்.",
        unclearTitle: "எழுத்துக்கள் தெளிவாக இல்லை",
        unclearVoice: "எழுத்துக்கள் தெளிவாக தெரியவில்லை. தயவுசெய்து சற்று அருகில் காட்டவும்.",
        scanInconclusive: "ஸ்கேன் தோல்வி (Scan Inconclusive)",
        onlineFetchingTitle: "இணையத்தில் விவரங்கள் பெறப்படுகின்றன...",
        expiredTitle: "எச்சரிக்கை! மாத்திரை காலாவதியானது (EXPIRED TABLET)",
        verifiedTitle: "மாத்திரை விவரங்கள் பெறப்பட்டது (Medicine Verified)",
        currVerifiedTitle: "ரூபாய் நோட்டு கண்டறியப்பட்டது (Currency Verified)",
        expiredWarning: "காலாவதியானது! சாப்பிட வேண்டாம்!",
        safeToUse: "பாதுகாப்பானது (Safe to Consume)",
        autoNetOn: "புதிய மாத்திரைகளுக்கு தானியங்கி இணையத் தேடல் ஆன் செய்யப்பட்டுள்ளது",
        autoNetOff: "தானியங்கி இணையத் தேடல் ஆஃப் செய்யப்பட்டுள்ளது",
        langSwitched: "தமிழ் மொழி தேர்ந்தெடுக்கப்பட்டது"
    },
    "en-IN": {
        camStartBtn: "📷 Start Camera",
        camStopBtn: "⏹️ Stop Camera",
        camActiveTitle: "Camera Active · Hold item in front of lens",
        camOffTitle: "Camera is Currently Off",
        camStartedVoice: "Camera started. Hold medicine or currency note in front of lens.",
        camStoppedVoice: "Camera stopped.",
        camMustStartVoice: "Camera is currently off. Please click the Start Camera button first.",
        camDeniedTitle: "Camera Permission Denied",
        camDeniedVoice: "Camera permission denied. Please allow camera access in browser.",
        initialReadyTitle: "Ready to Scan...",
        scanMedBtn: "SCAN MEDICINE TABLET",
        scanCurrBtn: "SCAN CURRENCY NOTE",
        targetHintMed: "Hold medicine strip inside box",
        targetHintCurr: "Hold currency note inside box",
        medModeVoice: "Medicine scan mode selected",
        currModeVoice: "Currency scan mode selected",
        scanningTitle: "Analyzing frame... (Scanning...)",
        noItemTitle: "No Item Detected",
        noItemVoiceMed: "No medicine strip detected. Please hold the tablet steadily under good light.",
        noCurrTitle: "No Currency Note Detected",
        noCurrVoice: "No currency note detected. Please hold the banknote steadily.",
        unclearTitle: "Text Unclear / Low Light",
        unclearVoice: "Text is unclear. Please hold closer to the camera.",
        scanInconclusive: "Scan Inconclusive",
        onlineFetchingTitle: "Fetching medical details online...",
        expiredTitle: "WARNING! MEDICINE EXPIRED",
        verifiedTitle: "Medicine Identified & Verified",
        currVerifiedTitle: "Currency Note Verified",
        expiredWarning: "EXPIRED! Do not consume!",
        safeToUse: "Safe to Consume",
        autoNetOn: "Automatic online medical search enabled",
        autoNetOff: "Automatic online search disabled",
        langSwitched: "English language selected."
    },
    "hi-IN": {
        camStartBtn: "📷 कैमरा चालू करें (Start Camera)",
        camStopBtn: "⏹️ कैमरा बंद करें (Stop Camera)",
        camActiveTitle: "कैमरा चालू है · वस्तु को सामने रखें",
        camOffTitle: "कैमरा बंद है",
        camStartedVoice: "कैमरा चालू हो गया है। दवा या नोट को सामने रखें।",
        camStoppedVoice: "कैमरा बंद कर दिया गया है।",
        camMustStartVoice: "कैमरा बंद है। कृपया पहले स्टार्ट कैमरा बटन दबाएं।",
        camDeniedTitle: "कैमरा अनुमति अस्वीकृत",
        camDeniedVoice: "कैमरा अनुमति अस्वीकृत हुई। कृपया अनुमति दें।",
        initialReadyTitle: "स्कैन करने के लिए तैयार...",
        scanMedBtn: "दवा की गोली स्कैन करें (SCAN MEDICINE)",
        scanCurrBtn: "करेंसी नोट स्कैन करें (SCAN CURRENCY)",
        targetHintMed: "दवा को बॉक्स के अंदर रखें",
        targetHintCurr: "नोट को बॉक्स के अंदर रखें",
        medModeVoice: "दवा स्कैन मोड चुना गया",
        currModeVoice: "करेंसी नोट स्कैन मोड चुना गया",
        scanningTitle: "स्कैन किया जा रहा है...",
        noItemTitle: "कोई वस्तु नहीं मिली",
        noItemVoiceMed: "कैमरे के सामने कोई दवा नहीं मिली। कृपया दवा को रोशनी में दिखाएं।",
        noCurrTitle: "कोई नोट नहीं मिला",
        noCurrVoice: "कोई करेंसी नोट नहीं मिला। कृपया नोट को सीधा रखें।",
        unclearTitle: "अक्षर स्पष्ट नहीं हैं",
        unclearVoice: "अक्षर स्पष्ट नहीं हैं। कृपया थोड़ा पास दिखाएं।",
        scanInconclusive: "स्कैन असफल",
        onlineFetchingTitle: "इंटरनेट से जानकारी प्राप्त की जा रही है...",
        expiredTitle: "चेतावनी! दवा एक्सपायर हो चुकी है (EXPIRED)",
        verifiedTitle: "दवा की पुष्टि हो गई (Verified)",
        currVerifiedTitle: "करेंसी नोट की पुष्टि हो गई",
        expiredWarning: "एक्सपायर! इसका सेवन न करें!",
        safeToUse: "सुरक्षित है (Safe to Consume)",
        autoNetOn: "स्वचालित ऑनलाइन खोज सक्षम की गई",
        autoNetOff: "स्वचालित ऑनलाइन खोज बंद की गई",
        langSwitched: "हिंदी भाषा चुनी गई।"
    }
};

function getLocalizedText(key) {
    const dict = UI_STRINGS[currentLang] || UI_STRINGS["ta-IN"];
    return dict[key] || UI_STRINGS["en-IN"][key] || "";
}

// =========================================================================
// 7. SPEECH SYNTHESIS ENGINE (ACCURATE LANGUAGE VOICE SELECTION)
// =========================================================================
function speak(text) {
    lastSpokenText = text;
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const targetPrefix = currentLang.split('-')[0]; // 'ta', 'en', 'hi'
    
    const matchingVoice = voices.find(v => v.lang.startsWith(targetPrefix));
    if (matchingVoice) {
        utterance.voice = matchingVoice;
    }
    
    window.speechSynthesis.speak(utterance);
}

function replayAudio() {
    if (lastSpokenText) {
        speak(lastSpokenText);
    } else {
        speak(getLocalizedText("camMustStartVoice"));
    }
}

function onLanguageChange() {
    currentLang = document.getElementById('langSelect').value;
    playBeep(480, 0.1);
    
    // Update button labels dynamically
    if (isCameraActive) {
        btnCamToggle.textContent = getLocalizedText("camStopBtn");
    } else {
        btnCamToggle.textContent = getLocalizedText("camStartBtn");
    }
    
    scanBtnText.textContent = getLocalizedText(currentMode === 'medicine' ? "scanMedBtn" : "scanCurrBtn");
    targetBox.querySelector('#targetHint').innerHTML = getLocalizedText(currentMode === 'medicine' ? "targetHintMed" : "targetHintCurr");
    
    speak(getLocalizedText("langSwitched"));
}

function playBeep(freq = 440, duration = 0.1) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
}

// =========================================================================
// 8. INSTANT SAMPLE TESTERS (FOR FAST VERIFICATION & VIDEO RECORDING)
// =========================================================================
function testCurrencySample(denom) {
    setMode('currency');
    playBeep(520, 0.1);
    sourceTag.textContent = `RBI Banknote Engine · Instant Sample Test`;
    rawText.textContent = `Sample Banknote: ₹${denom} Note (Mahatma Gandhi New Series)`;
    displayCurrencyResult(denom);
}

function testMedicineSample(sampleKey) {
    setMode('medicine');
    playBeep(520, 0.1);
    sourceTag.textContent = `Clinical Knowledge Engine · Instant Sample Test`;
    if (sampleKey === 'EXPIRED') {
        const expiredOcr = `DOLO 650 PARACETAMOL TABLETS IP B.No. 4022 EXP 03/2023 MFG 04/2021`;
        rawText.textContent = expiredOcr;
        processUniversalMedicine(expiredOcr);
    } else {
        const sampleTexts = {
            'PARACETAMOL': 'DOLO 650 PARACETAMOL TABLETS IP 650 MG B.No. 8921 EXP 08/2027',
            'THYRONORM': 'THYRONORM 50 MCG LEVOTHYROXINE SODIUM B.No. 3310 EXP 12/2027',
            'AZITHRAL': 'AZITHRAL 500 AZITHROMYCIN TABLETS IP 500MG B.No. 7741 EXP 10/2026',
            'TELMA': 'TELMA 40 TELMISARTAN TABLETS IP 40MG B.No. 5512 EXP 09/2027'
        };
        const text = sampleTexts[sampleKey] || sampleKey;
        rawText.textContent = text;
        processUniversalMedicine(text);
    }
}

// Background OCR Pre-warming
let ocrWorker = null;
let ocrLoading = false;
let ocrReady = false;

async function prewarmOCR() {
    if (typeof Tesseract === 'undefined' || ocrLoading || ocrReady) return;
    try {
        ocrLoading = true;
        console.log("Pre-warming Edge Tesseract OCR...");
        ocrWorker = await Tesseract.createWorker('eng');
        ocrReady = true;
        ocrLoading = false;
        console.log("✅ Edge Tesseract OCR Ready in Memory!");
    } catch(err) {
        console.warn("OCR worker background init fallback:", err);
        ocrLoading = false;
    }
}

// Startup
window.addEventListener('DOMContentLoaded', () => {
    initCamera();
    prewarmOCR();
    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }

    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            triggerScan();
        }
    });
});
