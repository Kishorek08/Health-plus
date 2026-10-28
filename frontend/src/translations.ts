import { Language } from './types';

export interface TranslationDictionary {
  // Brand & Navigation
  brandName: string;
  brandTagline: string;
  navDashboard: string;
  navKnowledgeBase: string;
  navAiDoctor: string;
  navDoctors: string;
  navAppointments: string;
  navPrescriptions: string;
  navMedAlarms: string;
  navLabReports: string;
  navBedManagement: string;
  navBilling: string;
  emergencySOS: string;

  // Roles & Modes
  rolePatient: string;
  roleDoctor: string;
  roleAdmin: string;
  currentMode: string;
  switchRole: string;
  signOut: string;
  welcomeBack: string;

  // Status & Badges
  statusUpcoming: string;
  statusCompleted: string;
  statusCancelled: string;
  statusOccupied: string;
  statusAvailable: string;
  statusCleaning: string;
  statusReserved: string;
  statusNormal: string;
  statusHigh: string;
  statusLow: string;
  statusPaid: string;
  statusPending: string;

  // Actions
  actionBookConsult: string;
  actionJoinVideo: string;
  actionIssuePrescription: string;
  actionPrintPdf: string;
  actionDownloadTxt: string;
  actionSendPharmacy: string;
  actionAddAlarm: string;
  actionMarkTaken: string;
  actionRingTest: string;
  actionAnalyze: string;
  actionSpeakVoice: string;
  actionStopVoice: string;
  actionClose: string;
  actionCancel: string;
  actionConfirm: string;
  actionSave: string;
  actionFilter: string;
  actionSearch: string;
  actionDispatchAmbulance: string;

  // Dashboard Stats
  statActiveAppointments: string;
  statPrescriptions: string;
  statBedOccupancy: string;
  statAdherenceStreak: string;
  statAvailableSpecialists: string;
  statEmergencyHotline: string;
  statTodayOPD: string;
  statTotalRevenue: string;

  // Knowledge Base (Diseases & Symptoms)
  kbTitle: string;
  kbSubtitle: string;
  kbSearchPlaceholder: string;
  kbAllCategories: string;
  kbKeySymptoms: string;
  kbOverview: string;
  kbSeverity: string;
  kbSpecialist: string;
  kbDiagnosticTests: string;
  kbFirstAid: string;
  kbPrevention: string;
  kbEmergencyAlert: string;
  kbConsultSpecialist: string;

  // AI Medical Assistant & Triage
  aiTitle: string;
  aiSubtitle: string;
  aiInputPlaceholder: string;
  aiAskQuestion: string;
  aiUrgencyEmergency: string;
  aiUrgencyUrgent: string;
  aiUrgencyRoutine: string;
  aiUrgencySelfCare: string;
  aiTriageAssessment: string;
  aiPossibleCauses: string;
  aiRecommendedDepartment: string;
  aiFirstAidGuidance: string;
  aiRedFlagWarning: string;
  aiDisclaimer: string;
  aiQuickChipsTitle: string;

  // Prescription Generator & Viewer
  rxTitle: string;
  rxHospitalLetterhead: string;
  rxAccredited: string;
  rxNumber: string;
  rxDate: string;
  rxDoctorDetails: string;
  rxPatientDetails: string;
  rxAgeGender: string;
  rxVitals: string;
  rxBp: string;
  rxPulse: string;
  rxTemp: string;
  rxSpo2: string;
  rxWeight: string;
  rxBloodSugar: string;
  rxDiagnosis: string;
  rxSymptomsObserved: string;
  rxMedicationsList: string;
  rxMedicineName: string;
  rxDosage: string;
  rxFrequency: string;
  rxTiming: string;
  rxDuration: string;
  rxRoute: string;
  rxInstructions: string;
  rxClinicalAdvice: string;
  rxRecommendedLabs: string;
  rxFollowUp: string;
  rxDoctorSignature: string;
  rxOfficialSeal: string;
  rxValidDisclaimer: string;
  rxDrugInteractionWarning: string;
  rxAddNewMedicine: string;
  rxIssueSuccess: string;

  // Medication Alarms
  alarmTitle: string;
  alarmSubtitle: string;
  alarmTakenNotification: string;
  alarmTime: string;
  alarmDaysStreak: string;
  alarmRingingHeader: string;
  alarmRingingPrompt: string;
  alarmSnoozeDismiss: string;
  alarmDualSmsTitle: string;
  alarmDualSmsSubtitle: string;
  alarmPatientTarget: string;
  alarmGuardianTarget: string;
  alarmSendDualSmsBtn: string;
  alarmSmsDispatchedToast: string;
  alarmSmsSentSuccess: string;
  alarmSmsDelivered: string;
  alarmSmsHistoryTitle: string;
  alarmEditContactsBtn: string;
  alarmSaveContactsBtn: string;
  alarmContactsSavedToast: string;
  alarmSendWhatsAppPatient: string;
  alarmSendWhatsAppGuardian: string;
  alarmSendSmsPatient: string;
  alarmSendSmsGuardian: string;
  alarmAutoDispatchBoth: string;
  alarmRealMessageSuccess: string;
  alarmNumberFormatHint: string;

  // Emergency Modal
  emgTitle: string;
  emgSubtitle: string;
  emgNationalAmbulance: string;
  emgUnifiedEmergency: string;
  emgCardiacHelpline: string;
  emgPoisonControl: string;
  emgAmbulanceTracking: string;
  emgEtaMinutes: string;
  emgDispatchSuccess: string;

  // Telehealth Video Call
  telehealthTitle: string;
  telehealthHipaa: string;
  telehealthEndCall: string;
  telehealthCameraOn: string;
  telehealthCameraOff: string;
  telehealthMicOn: string;
  telehealthMicMute: string;
  telehealthInCallChat: string;
  telehealthTypeMessage: string;
  telehealthLiveWebcam: string;
  telehealthScreenShare: string;
  telehealthStopScreen: string;
  telehealthVitalsHud: string;
  telehealthLiveCaptions: string;
  telehealthSnapshot: string;
  telehealthSnapshotTaken: string;
  telehealthCameraPermission: string;

  // ABHA Digital Health Card
  abhaCardTitle: string;
  abhaCardSubtitle: string;
  abhaIdNumber: string;
  abhaAddress: string;
  abhaDownloadBtn: string;

  // AI Ambient Voice Scribe
  scribeTitle: string;
  scribeListening: string;
  scribeStartBtn: string;
  scribeStopBtn: string;
  scribeSampleHint: string;

  // AI Medical Imaging & Radiology Viewer
  radiologyTitle: string;
  radiologySubtitle: string;
  radiologyAiHeatmap: string;
  radiologyConfidence: string;

  // Auth Page & Form Controls
  authWelcomeTitle: string;
  authCreateTitle: string;
  authSubtitle: string;
  authPatientTab: string;
  authDoctorTab: string;
  authAdminTab: string;
  authQuickFill: string;
  authFullName: string;
  authDoctorName: string;
  authFullNamePlaceholder: string;
  authDoctorNamePlaceholder: string;
  authEmail: string;
  authAdminEmail: string;
  authEmailPlaceholder: string;
  authPassword: string;
  authPhone: string;
  authGuardianName: string;
  authGuardianNamePlaceholder: string;
  authGuardianPhone: string;
  authGuardianPhonePlaceholder: string;
  authGuardianPhoneHelp: string;
  authAge: string;
  authGender: string;
  genderMale: string;
  genderFemale: string;
  genderOther: string;
  authBloodGroup: string;
  authAllergies: string;
  authAllergiesPlaceholder: string;
  authSpecialty: string;
  authQualifications: string;
  authLicense: string;
  authExperience: string;
  authFee: string;
  authHospitalAffiliation: string;
  authHospitalFacility: string;
  authSecurityKey: string;
  authSignInBtn: string;
  authRegisterBtn: string;
  authPortalSuffix: string;
  authHaveAccount: string;
  authNeedAccount: string;
  authSignInLink: string;
  authCreateLink: string;
  authComplianceFooter: string;
  authFillRequired: string;
  authEnterAdminKey: string;
  authEnterBoth: string;

  // General Shared Labels & Navigation
  selectLanguage: string;
  accountType: string;
  emailLabel: string;
  phoneLabel: string;
  bloodLabel: string;
  ageLabel: string;
  emergency247: string;
  emergencyDial: string;
  footerCompliance: string;

  // Patient Dashboard Details
  verifiedMedicalRecord: string;
  bloodGroupLabel: string;
  allergiesLabel: string;
  noneRecorded: string;
  daysUnit: string;
  nextUpcomingConsult: string;
  waitingRoomOpen: string;
  reasonLabel: string;
  atTime: string;
  prescriptionsSubtitle: string;
  noPrescriptions: string;
  noPrescriptionsSub: string;
  prescribedBy: string;
  onDate: string;
  drugsLabel: string;
  alarmsSubtitle: string;
  manageAlarms: string;
  noAlarms: string;
  addReminder: string;
  takenCheck: string;
  viewLabReportsBtn: string;
  exploreDiseaseDb: string;
  doctorsDirectorySubtitle: string;
  noDoctorsFound: string;
  noDoctorsFoundSub: string;
  yearsExp: string;
  consultation: string;
  allSpecialties: string;

  // Doctor Dashboard Details
  clinicalSuite: string;
  issuedBadge: string;
  telehealthClinic: string;
  patientQueueTab: string;
  prescriptionArchiveTab: string;
  todaysScheduleTitle: string;
  noAppointmentsQueue: string;
  noAppointmentsQueueSub: string;
  chiefComplaints: string;
  mode: string;
  startVideoCall: string;
  markComplete: string;
  issuedPrescriptionsTitle: string;
  noDoctorPrescriptions: string;
  noDoctorPrescriptionsSub: string;
  diagnosisLabel: string;
  medicinesLabel: string;

  // Admin Dashboard Details
  bedAllocationSubtitle: string;
  searchBedPlaceholder: string;
  oxygenActive: string;
  admittedLabel: string;
  readyForIntake: string;
  sanitationInProgress: string;
  dischargeAndSanitize: string;
  markAsReady: string;
  allocatePatient: string;
  invoicesSubtitle: string;
  invoicesProcessed: string;
  thInvoiceId: string;
  thPatientName: string;
  thDate: string;
  thPhysician: string;
  thInsurance: string;
  thTotalPayable: string;
  thStatus: string;

  // AI & Modals Extra
  aiAnalyzing: string;
  aiListening: string;
  aiReadAloud: string;
  aiReset: string;
  aiYou: string;
  aiAssistantName: string;
  aiAcuity: string;
  aiBookSpecialist: string;
  aiActive247: string;
  alarmAddCustom: string;
  alarmCancel: string;
  alarmNewTitle: string;
  alarmMedName: string;
  alarmDosage: string;
  alarmFrequency: string;
  alarmSave: string;
  alarmTakenToday: string;
  alarmActiveSchedule: string;
  vaultTitle: string;
  vaultSubtitle: string;
  orderRx: string;
  openAlarmManager: string;
  noActiveAlarms: string;
  addFirstAlarm: string;
  streak: string;
  viewFullDetails: string;
  askAiBot: string;

  // Specialties
  specCardiologist: string;
  specNeurologist: string;
  specGeneralPhysician: string;
  specPulmonologist: string;
  specDermatologist: string;
  specOrthopedic: string;
  specPediatrician: string;
  specGastroenterologist: string;

  // Wards
  wardAll: string;
  wardIcu: string;
  wardEmergency: string;
  wardCardiology: string;
  wardGeneral: string;
  wardPostSurgical: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  // ---------------------------------------------------------------------------
  // 1. ENGLISH (EN)
  // ---------------------------------------------------------------------------
  en: {
    brandName: 'HealthPulse Ultra',
    brandTagline: 'Advanced AI Healthcare & Hospital Management System',
    navDashboard: 'Dashboard Overview',
    navKnowledgeBase: 'Disease Knowledge Base',
    navAiDoctor: 'AI Doctor & Smart Triage',
    navDoctors: 'Find & Book Doctors',
    navAppointments: 'Consultation Schedule',
    navPrescriptions: 'E-Prescriptions & Rx Vault',
    navMedAlarms: 'Medication Alarms',
    navLabReports: 'Diagnostic Lab Reports',
    navBedManagement: 'ICU & Bed Management',
    navBilling: 'Invoices & Insurance',
    emergencySOS: 'EMERGENCY SOS',

    rolePatient: 'Patient',
    roleDoctor: 'Doctor',
    roleAdmin: 'Hospital Admin',
    currentMode: 'Active Mode',
    switchRole: 'Switch Role',
    signOut: 'Sign Out',
    welcomeBack: 'Welcome back',

    statusUpcoming: 'Upcoming',
    statusCompleted: 'Completed',
    statusCancelled: 'Cancelled',
    statusOccupied: 'Occupied',
    statusAvailable: 'Available',
    statusCleaning: 'Sanitizing',
    statusReserved: 'Reserved',
    statusNormal: 'Normal',
    statusHigh: 'High',
    statusLow: 'Low',
    statusPaid: 'Paid',
    statusPending: 'Pending',

    actionBookConsult: 'Book Consultation',
    actionJoinVideo: 'Join HD Video Call',
    actionIssuePrescription: 'Issue E-Prescription',
    actionPrintPdf: 'Print / Save as PDF',
    actionDownloadTxt: 'Download Text Summary',
    actionSendPharmacy: 'Order via Pharmacy',
    actionAddAlarm: 'Set Medication Alarm',
    actionMarkTaken: 'Mark as Taken',
    actionRingTest: 'Test Ring Chime',
    actionAnalyze: 'Run Smart AI Analysis',
    actionSpeakVoice: 'Speak Symptoms (Voice)',
    actionStopVoice: 'Stop Listening',
    actionClose: 'Close',
    actionCancel: 'Cancel',
    actionConfirm: 'Confirm',
    actionSave: 'Save',
    actionFilter: 'Filter',
    actionSearch: 'Search...',
    actionDispatchAmbulance: 'Dispatch Ambulance',

    statActiveAppointments: 'Upcoming Consultations',
    statPrescriptions: 'Digital Prescriptions',
    statBedOccupancy: 'Bed Occupancy Rate',
    statAdherenceStreak: 'Medication Adherence',
    statAvailableSpecialists: 'Specialists On-Duty',
    statEmergencyHotline: 'Emergency Response',
    statTodayOPD: 'OPD Patients Today',
    statTotalRevenue: 'Total Clinical Billing',

    kbTitle: 'Comprehensive Disease & Symptoms Knowledge Base',
    kbSubtitle: 'Clinically verified medical encyclopedia of human diseases, symptoms, diagnostic tests, and first-aid protocols.',
    kbSearchPlaceholder: 'Search by condition (e.g. Migraine, Asthma, Dengue) or symptom (e.g. Chest pain, Fever)...',
    kbAllCategories: 'All Medical Disciplines',
    kbKeySymptoms: 'Clinical Symptoms',
    kbOverview: 'Medical Overview',
    kbSeverity: 'Triage Severity',
    kbSpecialist: 'Recommended Specialist',
    kbDiagnosticTests: 'Diagnostic Tests & Labs',
    kbFirstAid: 'Immediate First-Aid Protocols',
    kbPrevention: 'Prevention & Clinical Guidelines',
    kbEmergencyAlert: 'Critical Red-Flag Warning',
    kbConsultSpecialist: 'Consult Specialist',

    aiTitle: 'MediPulse AI Medical Doctor & Clinical Triage',
    aiSubtitle: 'Multilingual neural diagnostic engine with red-flag detection and specialist recommendation.',
    aiInputPlaceholder: 'Describe symptoms (e.g. "Severe chest pain radiating to left arm and sweating")...',
    aiAskQuestion: 'Ask MediPulse AI',
    aiUrgencyEmergency: 'CRITICAL EMERGENCY',
    aiUrgencyUrgent: 'URGENT ATTENTION',
    aiUrgencyRoutine: 'ROUTINE CONSULTATION',
    aiUrgencySelfCare: 'HOME SELF-CARE',
    aiTriageAssessment: 'Acuity Score & Triage Level',
    aiPossibleCauses: 'Identified Differential Diagnoses',
    aiRecommendedDepartment: 'Recommended Clinical Department',
    aiFirstAidGuidance: 'Immediate Action Protocols',
    aiRedFlagWarning: 'Potential Life-Threatening Red-Flag Detected! Call 108 / 112 immediately.',
    aiDisclaimer: 'Disclaimer: MediPulse AI is a clinical decision-support tool. In life-threatening emergencies, immediately call your national emergency helpline (108 / 112).',
    aiQuickChipsTitle: 'Suggested Clinical Queries',

    rxTitle: 'Digital E-Prescription & Official Medical Record',
    rxHospitalLetterhead: 'HealthPulse Super Specialty Hospital & Medical Research Center',
    rxAccredited: 'JCI & NABH Accredited Healthcare Institution',
    rxNumber: 'Prescription ID',
    rxDate: 'Date of Issue',
    rxDoctorDetails: 'Attending Physician',
    rxPatientDetails: 'Patient Medical Record',
    rxAgeGender: 'Age / Gender',
    rxVitals: 'Recorded Clinical Vitals',
    rxBp: 'Blood Pressure',
    rxPulse: 'Pulse Rate',
    rxTemp: 'Body Temperature',
    rxSpo2: 'SpO2 Oxygen Saturation',
    rxWeight: 'Body Weight',
    rxBloodSugar: 'Blood Glucose (RBS)',
    rxDiagnosis: 'Primary Clinical Diagnosis',
    rxSymptomsObserved: 'Chief Complaints & Observed Symptoms',
    rxMedicationsList: 'Prescribed Medications (Rx)',
    rxMedicineName: 'Medicine Name & Strength',
    rxDosage: 'Dosage',
    rxFrequency: 'Frequency',
    rxTiming: 'Timing',
    rxDuration: 'Duration',
    rxRoute: 'Route',
    rxInstructions: 'Specific Instructions',
    rxClinicalAdvice: 'Clinical Advice & Dietary / Lifestyle Modifications',
    rxRecommendedLabs: 'Recommended Diagnostic Investigations & Laboratory Tests',
    rxFollowUp: 'Next Clinical Review / Follow-Up Date',
    rxDoctorSignature: 'Authorized Medical Practitioner Signature',
    rxOfficialSeal: 'Official Institutional Seal & NDHM QR Verification',
    rxValidDisclaimer: 'Valid for 90 days from the date of issue. Compliant with Telemedicine Practice Guidelines and National Digital Health Mission (NDHM).',
    rxDrugInteractionWarning: 'Clinical Alert: Potential Drug-Drug Interaction Detected! Review prescribed NSAIDs and anticoagulants.',
    rxAddNewMedicine: 'Add Another Medication',
    rxIssueSuccess: 'Digital prescription successfully issued and signed!',

    alarmTitle: 'Smart Medication Alarms & Adherence Tracker',
    alarmSubtitle: 'Audio-visual chime reminders with daily adherence streak analytics.',
    alarmTakenNotification: 'Medication marked as taken! Adherence streak updated.',
    alarmTime: 'Alarm Schedule Time',
    alarmDaysStreak: 'Days Consecutive Adherence',
    alarmRingingHeader: 'MEDICATION TIME!',
    alarmRingingPrompt: 'It is time to take your scheduled dose of',
    alarmSnoozeDismiss: 'I Have Taken It ✓',
    alarmDualSmsTitle: 'Dual Automated SMS Dispatcher',
    alarmDualSmsSubtitle: 'Automatically dispatches real-time SMS alerts to both Patient & Guardian numbers.',
    alarmPatientTarget: 'Patient Mobile',
    alarmGuardianTarget: 'Guardian Mobile',
    alarmSendDualSmsBtn: 'Ring Alarm & Send Dual SMS',
    alarmSmsDispatchedToast: 'Dual SMS successfully dispatched to Patient & Guardian!',
    alarmSmsSentSuccess: 'SMS Dispatched & Delivered',
    alarmSmsDelivered: 'Delivered via HealthPulse SMS Gateway',
    alarmSmsHistoryTitle: 'Live SMS Dispatch Audit Log',
    alarmEditContactsBtn: 'Update Alert Numbers',
    alarmSaveContactsBtn: 'Save Contact Numbers',
    alarmContactsSavedToast: 'Alert contact numbers updated successfully!',
    alarmSendWhatsAppPatient: 'Send WhatsApp to Patient',
    alarmSendWhatsAppGuardian: 'Send WhatsApp to Guardian',
    alarmSendSmsPatient: 'Send Native SMS to Patient',
    alarmSendSmsGuardian: 'Send Native SMS to Guardian',
    alarmAutoDispatchBoth: 'Dispatch to Both Numbers (WhatsApp / SMS)',
    alarmRealMessageSuccess: 'Real message gateway triggered! Review and send on your device.',
    alarmNumberFormatHint: 'Tip: Enter a valid 10-digit mobile number or include country code (+91).',

    emgTitle: '24x7 Critical Emergency Medical Response',
    emgSubtitle: 'Direct hotline access, GPS paramedic ambulance dispatch, and immediate life support guidance.',
    emgNationalAmbulance: 'National Ambulance Hotline',
    emgUnifiedEmergency: 'Unified Emergency Services',
    emgCardiacHelpline: 'Cardiac Trauma Hotline',
    emgPoisonControl: 'National Poison Control Center',
    emgAmbulanceTracking: 'GPS Ambulance Live Dispatch Tracker',
    emgEtaMinutes: 'Estimated Paramedic Arrival Time',
    emgDispatchSuccess: 'Ambulance successfully dispatched to your geolocation!',

    telehealthTitle: 'Encrypted Telehealth HD Consultation',
    telehealthHipaa: 'HIPAA & Telemedicine Practice Guidelines Compliant 256-bit Encrypted Stream',
    telehealthEndCall: 'End Consultation',
    telehealthCameraOn: 'Turn Camera Off',
    telehealthCameraOff: 'Turn Camera On',
    telehealthMicOn: 'Mute Microphone',
    telehealthMicMute: 'Unmute Microphone',
    telehealthInCallChat: 'In-Call Clinical Chat',
    telehealthTypeMessage: 'Type clinical message to doctor...',
    telehealthLiveWebcam: 'Live HD Webcam',
    telehealthScreenShare: 'Share Screen / Medical Reports',
    telehealthStopScreen: 'Stop Screen Share',
    telehealthVitalsHud: 'Patient Live ECG & Vitals Monitor',
    telehealthLiveCaptions: 'AI Closed Captions (Live Subtitles)',
    telehealthSnapshot: 'Diagnostic Photo Snapshot',
    telehealthSnapshotTaken: 'Diagnostic photo captured and attached to patient medical chart!',
    telehealthCameraPermission: 'Camera permission denied or not found. Showing encrypted HD clinical simulation.',

    // ABHA Digital Health Card
    abhaCardTitle: 'Ayushman Bharat Digital Health Card (ABHA)',
    abhaCardSubtitle: 'National Digital Health Mission (NDHM) Verified Identity Card',
    abhaIdNumber: 'ABHA Health Number',
    abhaAddress: 'ABHA Address',
    abhaDownloadBtn: 'Download Official ABHA Card',

    // AI Ambient Voice Scribe
    scribeTitle: 'AI Ambient Clinical Scribe (Voice to Rx)',
    scribeListening: 'Listening to clinical consultation... dictating to prescription...',
    scribeStartBtn: 'Start AI Scribe Dictation',
    scribeStopBtn: 'Stop Dictation & Parse',
    scribeSampleHint: 'Speak: "Patient diagnosed with Acute Bronchitis. Prescribe Azithromycin 500mg once daily for 5 days and Cetirizine 10mg at night."',

    // AI Medical Imaging & Radiology Viewer
    radiologyTitle: 'Diagnostic Imaging & Radiology AI Heatmap',
    radiologySubtitle: 'Deep learning computer vision for automated thoracic, neurological, and musculoskeletal scan analysis.',
    radiologyAiHeatmap: 'Toggle AI Pathology Heatmap',
    radiologyConfidence: 'AI Diagnostic Confidence',

    // Auth Page & Form Controls
    authWelcomeTitle: 'Welcome to HealthPulse',
    authCreateTitle: 'Create Your Account',
    authSubtitle: 'Select your role to access your personalized medical portal',
    authPatientTab: 'Patient',
    authDoctorTab: 'Doctor',
    authAdminTab: 'Hospital Admin',
    authQuickFill: 'Quick test credentials:',
    authFullName: 'Full Name',
    authDoctorName: 'Doctor Full Name',
    authFullNamePlaceholder: 'e.g. John Doe',
    authDoctorNamePlaceholder: 'e.g. Dr. Jane Smith',
    authEmail: 'Email Address',
    authAdminEmail: 'Official Hospital Email',
    authEmailPlaceholder: 'name@example.com',
    authPassword: 'Password',
    authPhone: 'Contact Phone Number',
    authGuardianName: 'Guardian / Caregiver Name',
    authGuardianNamePlaceholder: 'e.g. Sarah Morgan (Father/Spouse/Caregiver)',
    authGuardianPhone: 'Guardian Emergency Contact Mobile',
    authGuardianPhonePlaceholder: '+91 98765 43211',
    authGuardianPhoneHelp: 'Medication alarms and urgent reminders will be sent via SMS to this number.',
    authAge: 'Age',
    authGender: 'Gender',
    genderMale: 'Male',
    genderFemale: 'Female',
    genderOther: 'Other',
    authBloodGroup: 'Blood Group',
    authAllergies: 'Known Allergies',
    authAllergiesPlaceholder: 'e.g. Penicillin, Peanuts (or None)',
    authSpecialty: 'Specialty',
    authQualifications: 'Qualifications',
    authLicense: 'License / Reg Number',
    authExperience: 'Experience (Years)',
    authFee: 'Consultation Fee (₹)',
    authHospitalAffiliation: 'Hospital / Clinic Affiliation',
    authHospitalFacility: 'Hospital Facility Name',
    authSecurityKey: 'Admin Master Security Key',
    authSignInBtn: 'Sign In to',
    authRegisterBtn: 'Register as',
    authPortalSuffix: 'Portal',
    authHaveAccount: 'Already have an account?',
    authNeedAccount: "Don't have an account yet?",
    authSignInLink: 'Sign In',
    authCreateLink: 'Create New Account',
    authComplianceFooter: 'HealthPulse Ultra • Compliant with NDHM, HIPAA & Telemedicine Guidelines',
    authFillRequired: 'Please fill in all required fields.',
    authEnterAdminKey: 'Please enter an Admin Security Key.',
    authEnterBoth: 'Please enter both email and password.',

    // General Shared Labels & Navigation
    selectLanguage: 'Select Language',
    accountType: 'Account',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    bloodLabel: 'Blood',
    ageLabel: 'Age',
    emergency247: '24x7 Emergency SOS',
    emergencyDial: 'National Emergency Hotline: Dial 108 / 112',
    footerCompliance: 'HealthPulse Ultra Clinical Hospital Management System • Compliant with NDHM, HIPAA & Telemedicine Practice Guidelines.',

    // Patient Dashboard Details
    verifiedMedicalRecord: 'Verified Patient Medical Record',
    bloodGroupLabel: 'Blood Group',
    allergiesLabel: 'Allergies',
    noneRecorded: 'None recorded',
    daysUnit: 'Days',
    nextUpcomingConsult: 'Next Upcoming Consultation',
    waitingRoomOpen: 'Virtual Waiting Room Open',
    reasonLabel: 'Reason',
    atTime: 'at',
    prescriptionsSubtitle: 'Official medical prescriptions with PDF printout.',
    noPrescriptions: 'No medical prescriptions issued yet.',
    noPrescriptionsSub: 'Official prescriptions issued by attending doctors will appear here with PDF download.',
    prescribedBy: 'Prescribed by',
    onDate: 'on',
    drugsLabel: 'Drugs',
    alarmsSubtitle: 'Browser Web Audio alarms & streak tracking.',
    manageAlarms: 'Manage Alarms',
    noAlarms: 'No active medication alarms.',
    addReminder: '+ Add Medication Reminder',
    takenCheck: 'Taken ✓',
    viewLabReportsBtn: 'View Diagnostic Lab Reports',
    exploreDiseaseDb: 'Explore Disease Database',
    doctorsDirectorySubtitle: 'Book instant video or clinic consultations with senior specialists.',
    noDoctorsFound: 'No doctors registered under this specialty yet.',
    noDoctorsFoundSub: 'Register a specialist in the Doctor Portal to list them here.',
    yearsExp: 'Years Exp',
    consultation: 'Consultation',
    allSpecialties: 'ALL',

    // Doctor Dashboard Details
    clinicalSuite: 'Clinical Practice Suite',
    issuedBadge: 'Issued',
    telehealthClinic: 'Telehealth Virtual Clinic',
    patientQueueTab: 'Patient Consultation Queue',
    prescriptionArchiveTab: 'E-Prescription Archive',
    todaysScheduleTitle: "Today's Appointment Schedule & OPD Queue",
    noAppointmentsQueue: 'No patient appointments in your queue.',
    noAppointmentsQueueSub: 'When patients schedule consultations with you, they will immediately appear here in real-time.',
    chiefComplaints: 'Chief Complaints',
    mode: 'Mode',
    startVideoCall: 'Start Video Call',
    markComplete: 'Mark Consultation Complete',
    issuedPrescriptionsTitle: 'Issued E-Prescriptions',
    noDoctorPrescriptions: 'No prescriptions issued yet.',
    noDoctorPrescriptionsSub: "Use '+ Issue E-Prescription' above to generate and sign digital prescriptions with PDF printouts.",
    diagnosisLabel: 'Diagnosis',
    medicinesLabel: 'Medicines',

    // Admin Dashboard Details
    bedAllocationSubtitle: 'Live hospital bed allocation across ICU, Emergency Trauma, Cardiology, and General Wards.',
    searchBedPlaceholder: 'Search bed or patient...',
    oxygenActive: 'O₂ Oxygen Line Active',
    admittedLabel: 'Admitted',
    readyForIntake: 'Ready for patient intake',
    sanitationInProgress: 'Sanitation in progress',
    dischargeAndSanitize: 'Discharge & Sanitize',
    markAsReady: 'Mark as Ready',
    allocatePatient: 'Allocate Patient',
    invoicesSubtitle: 'Recent consultation and pharmacy invoices.',
    invoicesProcessed: 'Invoices Processed',
    thInvoiceId: 'Invoice ID',
    thPatientName: 'Patient Name',
    thDate: 'Date',
    thPhysician: 'Attending Physician',
    thInsurance: 'Insurance Covered',
    thTotalPayable: 'Total Payable',
    thStatus: 'Status',

    // AI & Modals Extra
    aiAnalyzing: 'Analyzing clinical presentation...',
    aiListening: 'Listening to your voice...',
    aiReadAloud: 'Read Aloud',
    aiReset: 'Reset',
    aiYou: 'You',
    aiAssistantName: 'MediPulse AI Assistant',
    aiAcuity: 'Acuity',
    aiBookSpecialist: 'Book Specialist',
    aiActive247: 'Active 24/7',
    alarmAddCustom: 'Add Custom Alarm',
    alarmCancel: 'Cancel',
    alarmNewTitle: 'New Scheduled Medication Alarm',
    alarmMedName: 'Medicine Name',
    alarmDosage: 'Dosage',
    alarmFrequency: 'Frequency',
    alarmSave: 'Save Alarm',
    alarmTakenToday: 'Taken Today ✓',
    alarmActiveSchedule: 'Active Prescriptions Schedule',
    vaultTitle: 'No prescriptions in your vault yet.',
    vaultSubtitle: 'When consultations are concluded, official digital prescriptions will appear here.',
    orderRx: 'Order Rx',
    openAlarmManager: 'Open Alarm Manager',
    noActiveAlarms: 'No active alarms configured.',
    addFirstAlarm: '+ Add your first custom alarm',
    streak: 'Streak',
    viewFullDetails: 'View Full Details',
    askAiBot: 'Ask AI Bot',

    // Specialties
    specCardiologist: 'Cardiologist',
    specNeurologist: 'Neurologist',
    specGeneralPhysician: 'General Physician',
    specPulmonologist: 'Pulmonologist',
    specDermatologist: 'Dermatologist',
    specOrthopedic: 'Orthopedic Surgeon',
    specPediatrician: 'Pediatrician',
    specGastroenterologist: 'Gastroenterologist',

    // Wards
    wardAll: 'ALL',
    wardIcu: 'ICU',
    wardEmergency: 'Emergency Care',
    wardCardiology: 'Cardiology Ward',
    wardGeneral: 'General Ward',
    wardPostSurgical: 'Post-Surgical'
  },

  // ---------------------------------------------------------------------------
  // 2. TAMIL (TA - தமிழ்)
  // ---------------------------------------------------------------------------
  ta: {
    brandName: 'ஹெல்த்பல்ஸ் அல்ட்ரா',
    brandTagline: 'மேம்பட்ட AI சுகாதார மற்றும் மருத்துவமனை மேலாண்மை அமைப்பு',
    navDashboard: 'கட்டுப்பாட்டு பலகை',
    navKnowledgeBase: 'நோய் மற்றும் அறிகுறிகள் களஞ்சியம்',
    navAiDoctor: 'AI மருத்துவர் மற்றும் அவசர வகைப்பாடு',
    navDoctors: 'மருத்துவர்களைக் கண்டறிந்து முன்பதிவு செய்க',
    navAppointments: 'ஆலோசனை அட்டவணை',
    navPrescriptions: 'மின்-மருந்துக் குறிப்புகள் & மருந்து பெட்டகம்',
    navMedAlarms: 'மருந்து நினைவூட்டல் அலாரங்கள்',
    navLabReports: 'பரிசோதனை ஆய்வக அறிக்கைகள்',
    navBedManagement: 'ICU & படுக்கை மேலாண்மை',
    navBilling: 'விலைப்பட்டியல் & காப்பீடு',
    emergencySOS: 'அவசர உதவி SOS',

    rolePatient: 'நோயாளி',
    roleDoctor: 'மருத்துவர்',
    roleAdmin: 'மருத்துவமனை நிர்வாகி',
    currentMode: 'தற்போதைய முறை',
    switchRole: 'பங்கை மாற்றவும்',
    signOut: 'வெளியேறு',
    welcomeBack: 'மீண்டும் நல்வரவு',

    statusUpcoming: 'வரவிருக்கும்',
    statusCompleted: 'முடிவடைந்தது',
    statusCancelled: 'ரத்து செய்யப்பட்டது',
    statusOccupied: 'நிரம்பியுள்ளது',
    statusAvailable: 'கிடைக்கிறது',
    statusCleaning: 'சுத்திகரிப்பு நடைபெறுகிறது',
    statusReserved: 'முன்பதிவு செய்யப்பட்டது',
    statusNormal: 'இயல்பானது',
    statusHigh: 'அதிகம்',
    statusLow: 'குறைவு',
    statusPaid: 'செலுத்தப்பட்டது',
    statusPending: 'நிலுவையில் உள்ளது',

    actionBookConsult: 'ஆலோசனை முன்பதிவு செய்க',
    actionJoinVideo: 'HD வீடியோ ஆலோசனையில் இணைக',
    actionIssuePrescription: 'மின்-மருந்துக் குறிப்பு வழங்குக',
    actionPrintPdf: 'அச்சிடுக / PDF ஆக சேமிக்க',
    actionDownloadTxt: 'உரைச் சுருக்கத்தைப் பதிவிறக்குக',
    actionSendPharmacy: 'மருந்தகத்திற்கு அனுப்புக',
    actionAddAlarm: 'மருந்து நினைவூட்டலை அமைக்கவும்',
    actionMarkTaken: 'எடுக்கப்பட்டதாகக் குறிக்கவும்',
    actionRingTest: 'அலார ஒலியை சோதிக்கவும்',
    actionAnalyze: 'ஸ்மார்ட் AI பகுப்பாய்வை இயக்குக',
    actionSpeakVoice: 'குரல் மூலம் அறிகுறிகளைக் கூறவும்',
    actionStopVoice: 'கேட்பதை நிறுத்துக',
    actionClose: 'மூடுக',
    actionCancel: 'ரத்து செய்',
    actionConfirm: 'உறுதிப்படுத்து',
    actionSave: 'சேமிக்க',
    actionFilter: 'வடிகட்டு',
    actionSearch: 'தேடுக...',
    actionDispatchAmbulance: 'ஆம்புலன்ஸ் அனுப்புக',

    statActiveAppointments: 'வரவிருக்கும் ஆலோசனைகள்',
    statPrescriptions: 'டிஜிட்டல் மருந்துக் குறிப்புகள்',
    statBedOccupancy: 'படுக்கை பயன்பாட்டு விகிதம்',
    statAdherenceStreak: 'மருந்து உட்கொள்ளும் தொடர்ச்சி',
    statAvailableSpecialists: 'பணியில் உள்ள நிபுணர்கள்',
    statEmergencyHotline: 'அவசர சிகிச்சை உதவி',
    statTodayOPD: 'இன்றைய வெளிநோயாளிகள்',
    statTotalRevenue: 'மொத்த மருத்துவ வருவாய்',

    kbTitle: 'விரிவான மனித நோய்கள் மற்றும் அறிகுறிகள் களஞ்சியம்',
    kbSubtitle: 'மருத்துவ ரீதியாக சரிபார்க்கப்பட்ட மனித நோய்கள், அறிகுறிகள், ஆய்வக சோதனைகள் மற்றும் முதலுதவி நெறிமுறைகள்.',
    kbSearchPlaceholder: 'நோய் (எ.கா. மைக்ரேன், ஆஸ்துமா, டெங்கு) அல்லது அறிகுறி (எ.கா. மார்பு வலி, காய்ச்சல்) கொண்டு தேடவும்...',
    kbAllCategories: 'அனைத்து மருத்துவ பிரிவுகள்',
    kbKeySymptoms: 'முக்கிய மருத்துவ அறிகுறிகள்',
    kbOverview: 'மருத்துவ கண்ணோட்டம்',
    kbSeverity: 'தீவிர வகைப்பாடு',
    kbSpecialist: 'பரிந்துரைக்கப்பட்ட சிறப்பு மருத்துவர்',
    kbDiagnosticTests: 'கண்டறியும் சோதனைகள் & ஆய்வகங்கள்',
    kbFirstAid: 'உடனடி முதலுதவி நடைமுறைகள்',
    kbPrevention: 'தடுப்பு முறைகள் & வழிகாட்டுதல்கள்',
    kbEmergencyAlert: 'முக்கிய அபாய எச்சரிக்கை',
    kbConsultSpecialist: 'நிபுணரை அணுகவும்',

    aiTitle: 'MediPulse AI மருத்துவ ஆலோசகர் & தீவிர வகைப்பாடு',
    aiSubtitle: 'பன்மொழி நரம்பியல் கண்டறியும் இயந்திரம் - உடனடி அபாய எச்சரிக்கை மற்றும் நிபுணர் பரிந்துரையுடன்.',
    aiInputPlaceholder: 'உங்கள் அறிகுறிகளை விவரிக்கவும் (எ.கா. "மார்பு இறுக்கம், இடது கை வலி மற்றும் வியர்த்தல்")...',
    aiAskQuestion: 'AI-யிடம் கேட்கவும்',
    aiUrgencyEmergency: 'அவசர ஆபத்தான நிலை',
    aiUrgencyUrgent: 'உடனடி கவனம் தேவை',
    aiUrgencyRoutine: 'வழக்கமான ஆலோசனை',
    aiUrgencySelfCare: 'வீட்டு சுய பராமரிப்பு',
    aiTriageAssessment: 'தீவிரத்தன்மை மதிப்பெண் & வகைப்பாடு',
    aiPossibleCauses: 'சாத்தியமான மருத்துவக் காரணங்கள்',
    aiRecommendedDepartment: 'பரிந்துரைக்கப்பட்ட மருத்துவப் பிரிவு',
    aiFirstAidGuidance: 'உடனடி முதலுதவி வழிமுறைகள்',
    aiRedFlagWarning: 'உயிருக்கு ஆபத்தான அவசர அறிகுறி கண்டறியப்பட்டது! உடனடியாக 108 / 112-ஐ அழைக்கவும்.',
    aiDisclaimer: 'பொறுப்புத் துறப்பு: MediPulse AI ஒரு மருத்துவ முடிவு ஆதரவு கருவி மட்டுமே. உயிருக்கு ஆபத்தான அவசர காலங்களில் உடனடியாக உங்கள் தேசிய அவசர உதவி எண்ணை (108 / 112) அழைக்கவும்.',
    aiQuickChipsTitle: 'பரிந்துரைக்கப்பட்ட மருத்துவக் கேள்விகள்',

    rxTitle: 'டிஜிட்டல் மின்-மருந்துக் குறிப்பு & அதிகாரப்பூர்வ ஆவணம்',
    rxHospitalLetterhead: 'ஹெல்த்பல்ஸ் சிறப்பு மருத்துவமனை & மருத்துவ ஆராய்ச்சி மையம்',
    rxAccredited: 'JCI & NABH அங்கீகாரம் பெற்ற சர்வதேச சுகாதார நிறுவனம்',
    rxNumber: 'மருந்துக் குறிப்பு எண்',
    rxDate: 'வழங்கப்பட்ட தேதி',
    rxDoctorDetails: 'கவனிக்கும் மருத்துவர் விவரம்',
    rxPatientDetails: 'நோயாளி மருத்துவ ஆவணம்',
    rxAgeGender: 'வயது / பாலினம்',
    rxVitals: 'பதிவு செய்யப்பட்ட முக்கிய உடல் குறிகாட்டிகள்',
    rxBp: 'இரத்த அழுத்தம் (BP)',
    rxPulse: 'நாடித் துடிப்பு',
    rxTemp: 'உடல் வெப்பநிலை',
    rxSpo2: 'SpO2 ஆக்ஸிஜன் அளவு',
    rxWeight: 'உடல் எடை',
    rxBloodSugar: 'இரத்த சர்க்கரை (RBS)',
    rxDiagnosis: 'முதன்மை மருத்துவக் கண்டறிதல்',
    rxSymptomsObserved: 'கவனிக்கப்பட்ட அறிகுறிகள்',
    rxMedicationsList: 'பரிந்துரைக்கப்பட்ட மருந்துகள் (Rx)',
    rxMedicineName: 'மருந்தின் பெயர் & வீரியம்',
    rxDosage: 'அளவு',
    rxFrequency: 'அதிர்வெண் (முறை)',
    rxTiming: 'உட்கொள்ளும் நேரம்',
    rxDuration: 'கால அளவு',
    rxRoute: 'வழங்கும் முறை',
    rxInstructions: 'குறிப்பிட்ட வழிமுறைகள்',
    rxClinicalAdvice: 'மருத்துவ ஆலோசனை & உணவு / வாழ்க்கை முறை மாற்றங்கள்',
    rxRecommendedLabs: 'பரிந்துரைக்கப்பட்ட ஆய்வகப் பரிசோதனைகள்',
    rxFollowUp: 'அடுத்த மருத்துவ மறுஆய்வுத் தேதி',
    rxDoctorSignature: 'அங்கீகரிக்கப்பட்ட மருத்துவர் கையொப்பம்',
    rxOfficialSeal: 'அதிகாரப்பூர்வ நிறுவன முத்திரை & NDHM QR சரிபார்ப்பு',
    rxValidDisclaimer: 'வழங்கப்பட்ட தேதியிலிருந்து 90 நாட்களுக்கு செல்லுபடியாகும். டெலிமெடிசின் வழிகாட்டுதல்கள் மற்றும் NDHM விதிகளுக்கு இணக்கமானது.',
    rxDrugInteractionWarning: 'மருத்துவ எச்சரிக்கை: மருந்துகளுக்கிடையே பாதகமான தொடர்பு கண்டறியப்பட்டது! பரிந்துரைக்கப்பட்ட NSAID மற்றும் இரத்த உறைவு எதிர்ப்பு மருந்துகளை மதிப்பாய்வு செய்யவும்.',
    rxAddNewMedicine: 'மற்றொரு மருந்தைச் சேர்க்கவும்',
    rxIssueSuccess: 'டிஜிட்டல் மருந்துக் குறிப்பு வெற்றிகரமாக வழங்கப்பட்டு கையொப்பமிடப்பட்டது!',

    alarmTitle: 'ஸ்மார்ட் மருந்து நினைவூட்டல் அலாரங்கள் & தொடர்ச்சி கண்காணிப்பு',
    alarmSubtitle: 'ஒலி மற்றும் காட்சி நினைவூட்டல்களுடன் தினசரி மருந்து உட்கொள்ளும் தொடர்ச்சி கண்காணிப்பு.',
    alarmTakenNotification: 'மருந்து எடுக்கப்பட்டதாகக் குறிக்கப்பட்டது! தொடர்ச்சி எண்ணிக்கை புதுப்பிக்கப்பட்டது.',
    alarmTime: 'அலாரம் நேரம்',
    alarmDaysStreak: 'நாட்கள் தொடர்ச்சியான மருந்து உட்கொள்ளல்',
    alarmRingingHeader: 'மருந்து உட்கொள்ளும் நேரம்!',
    alarmRingingPrompt: 'நீங்கள் மருந்து உட்கொள்ள வேண்டிய நேரம் இது:',
    alarmSnoozeDismiss: 'நான் உட்கொண்டுவிட்டேன் ✓',
    alarmDualSmsTitle: 'இரட்டை தானியங்கி SMS எச்சரிக்கை சேவை',
    alarmDualSmsSubtitle: 'அலாரம் அடிக்கும்போது நோயாளி மற்றும் பாதுகாவலர் இருவருக்கும் SMS விடுக்கப்படும்.',
    alarmPatientTarget: 'நோயாளி மொபைல்',
    alarmGuardianTarget: 'பாதுகாவலர் மொபைல்',
    alarmSendDualSmsBtn: 'அலாரத்தை இயக்கி இரட்டை SMS அனுப்புக',
    alarmSmsDispatchedToast: 'நோயாளி மற்றும் பாதுகாவலருக்கு SMS வெற்றிகரமாக அனுப்பப்பட்டது!',
    alarmSmsSentSuccess: 'SMS அனுப்பப்பட்டு டெலிவரி செய்யப்பட்டது',
    alarmSmsDelivered: 'HealthPulse SMS நுழைவாயில் மூலம் வழங்கப்பட்டது',
    alarmSmsHistoryTitle: 'நேரலை SMS அனுப்பீட்டு பதிவு',
    alarmEditContactsBtn: 'தொடர்பு எண்களை மாற்று',
    alarmSaveContactsBtn: 'எண்களை சேமி',
    alarmContactsSavedToast: 'அறிவிப்பு எண்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டன!',
    alarmSendWhatsAppPatient: 'நோயாளிக்கு வாட்ஸ்அப் செய்தி அனுப்புக',
    alarmSendWhatsAppGuardian: 'பாதுகாவலருக்கு வாட்ஸ்அப் செய்தி அனுப்புக',
    alarmSendSmsPatient: 'நோயாளிக்கு SMS அனுப்புக',
    alarmSendSmsGuardian: 'பாதுகாவலருக்கு SMS அனுப்புக',
    alarmAutoDispatchBoth: 'இருவருக்கும் செய்தி அனுப்புக (வாட்ஸ்அப் / SMS)',
    alarmRealMessageSuccess: 'உண்மையான செய்தி சாளரம் திறக்கப்பட்டது! சரிபார்த்து அனுப்பு என்பதை அழுத்தவும்.',
    alarmNumberFormatHint: 'குறிப்பு: 10 இலக்க மொபைல் எண் அல்லது +91 குறியீட்டுடன் உள்ளிடவும்.',

    emgTitle: '24x7 தீவிர அவசர மருத்துவப் பிரிவு',
    emgSubtitle: 'நேரடி அவசர உதவி எண், ஜிபிஎஸ் பாராமெடிக் ஆம்புலன்ஸ் மற்றும் உடனடி உயிர்காக்கும் முதலுதவி.',
    emgNationalAmbulance: 'தேசிய ஆம்புலன்ஸ் உதவி எண்',
    emgUnifiedEmergency: 'ஒருங்கிணைந்த அவசர சேவைகள்',
    emgCardiacHelpline: 'இதய அவசர சிகிச்சை உதவி எண்',
    emgPoisonControl: 'தேசிய நச்சு கட்டுப்பாட்டு மையம்',
    emgAmbulanceTracking: 'ஜிபிஎஸ் ஆம்புலன்ஸ் நேரடி கண்காணிப்பு',
    emgEtaMinutes: 'ஆம்புலன்ஸ் வந்து சேரும் தோராயமான நேரம்',
    emgDispatchSuccess: 'ஆம்புலன்ஸ் உங்கள் இருப்பிடத்திற்கு வெற்றிகரமாக அனுப்பப்பட்டது!',

    telehealthTitle: 'பாதுகாக்கப்பட்ட டெலிஹெல்த் HD காணொளி ஆலோசனை',
    telehealthHipaa: 'HIPAA & டெலிமெடிசின் வழிகாட்டுதல்களுக்கு இணக்கமான 256-பிட் மறைகுறியாக்கப்பட்ட நேரலை',
    telehealthEndCall: 'ஆலோசனையை முடிக்கவும்',
    telehealthCameraOn: 'கேமராவை அணைக்கவும்',
    telehealthCameraOff: 'கேமராவை இயக்கவும்',
    telehealthMicOn: 'ஒலிவாங்கியை அணைக்கவும்',
    telehealthMicMute: 'ஒலிவாங்கியை இயக்கவும்',
    telehealthInCallChat: 'நேரலை மருத்துவ உரையாடல்',
    telehealthTypeMessage: 'மருத்துவருக்கு செய்தி அனுப்பவும்...',
    telehealthLiveWebcam: 'நேரலை HD கேமரா',
    telehealthScreenShare: 'திரை / ஆய்வக அறிக்கைகளைப் பகிரவும்',
    telehealthStopScreen: 'திரைப் பகிர்வை நிறுத்தவும்',
    telehealthVitalsHud: 'நேரலை ECG & உடல் குறிகாட்டிகள் கண்காணிப்பு',
    telehealthLiveCaptions: 'AI நேரலை வசனங்கள் (சப்டைட்டில்)',
    telehealthSnapshot: 'நோய் கண்டறியும் புகைப்படத்தை எடுக்கவும்',
    telehealthSnapshotTaken: 'புகைப்படம் எடுக்கப்பட்டு நோயாளி மருத்துவ ஆவணத்தில் இணைக்கப்பட்டது!',
    telehealthCameraPermission: 'கேமரா அனுமதி மறுக்கப்பட்டது அல்லது கிடைக்கவில்லை. மறைகுறியாக்கப்பட்ட HD மாதிரி காட்சி காட்டப்படுகிறது.',

    // ABHA Digital Health Card
    abhaCardTitle: 'ஆயுஷ்மான் பாரத் டிஜிட்டல் ஹெல்த் கார்டு (ABHA)',
    abhaCardSubtitle: 'தேசிய டிஜிட்டல் சுகாதார இயக்கம் (NDHM) சரிபார்க்கப்பட்ட அடையாள அட்டை',
    abhaIdNumber: 'ABHA சுகாதார எண்',
    abhaAddress: 'ABHA முகவரி',
    abhaDownloadBtn: 'அதிகாரப்பூர்வ ABHA கார்டைப் பதிவிறக்குக',

    // AI Ambient Voice Scribe
    scribeTitle: 'AI குரல் வழி மருந்து குறிப்பு எழுதுபவர் (குரல் முதல் மருந்து வரை)',
    scribeListening: 'மருத்துவ ஆலோசனையைக் கேட்கிறது... மருந்துச் சீட்டாக மாற்றுகிறது...',
    scribeStartBtn: 'AI குரல் பதிவைத் தொடங்கவும்',
    scribeStopBtn: 'பதிவை நிறுத்தி பிரித்தெடுக்கவும்',
    scribeSampleHint: 'பேசவும்: "நோயாளிக்கு கடுமையான மூச்சுக்குழாய் அழற்சி. அசித்ரோமைசின் 500 மிகி தினமும் ஒரு முறை 5 நாட்களுக்கு வழங்கவும்."',

    // AI Medical Imaging & Radiology Viewer
    radiologyTitle: 'கண்டறியும் ஸ்கேன் & கதிரியக்கவியல் AI பகுப்பாய்வு',
    radiologySubtitle: 'மார்பு எக்ஸ்ரே மற்றும் ஸ்கேன்களை தானாகவே பகுப்பாய்வு செய்யும் ஆழ்ந்த கற்றல் கணினி பார்வை.',
    radiologyAiHeatmap: 'AI நோய் கண்டறிதல் வரைபடத்தை மாற்றவும்',
    radiologyConfidence: 'AI துல்லியத்தன்மை நம்பிக்கை',

    // Auth Page & Form Controls
    authWelcomeTitle: 'HealthPulse-க்கு வரவேற்கிறோம்',
    authCreateTitle: 'உங்கள் கணக்கை உருவாக்கவும்',
    authSubtitle: 'உங்கள் தனிப்பயனாக்கப்பட்ட மருத்துவ தளத்தை அணுக உங்கள் பங்கைத் தேர்ந்தெடுக்கவும்',
    authPatientTab: 'நோயாளி',
    authDoctorTab: 'மருத்துவர்',
    authAdminTab: 'மருத்துவமனை நிர்வாகி',
    authQuickFill: 'விரைவு சோதனை நற்சான்றிதழ்கள்:',
    authFullName: 'முழு பெயர்',
    authDoctorName: 'மருத்துவர் முழு பெயர்',
    authFullNamePlaceholder: 'எ.கா. கவிதா செல்வன்',
    authDoctorNamePlaceholder: 'எ.கா. டாக்டர் ஆனந்த் குமார்',
    authEmail: 'மின்னஞ்சல் முகவரி',
    authAdminEmail: 'அதிகாரப்பூர்வ மருத்துவமனை மின்னஞ்சல்',
    authEmailPlaceholder: 'name@example.com',
    authPassword: 'கடவுச்சொல்',
    authPhone: 'தொடர்பு தொலைபேசி எண்',
    authGuardianName: 'பாதுகாவலர் / பராமரிப்பாளர் பெயர்',
    authGuardianNamePlaceholder: 'எ.கா. சாரா மார்கன் (தந்தை/துணை/பராமரிப்பாளர்)',
    authGuardianPhone: 'பாதுகாவலர் மொபைல் எண்',
    authGuardianPhonePlaceholder: '+91 98765 43211',
    authGuardianPhoneHelp: 'மருந்து அலாரங்கள் மற்றும் அவசர அறிவிப்புகள் இந்த எண்ணிற்கு SMS மூலம் அனுப்பப்படும்.',
    authAge: 'வயது',
    authGender: 'பாலினம்',
    genderMale: 'ஆண்',
    genderFemale: 'பெண்',
    genderOther: 'மற்றவை',
    authBloodGroup: 'இரத்த வகை',
    authAllergies: 'அறியப்பட்ட ஒவ்வாமைகள்',
    authAllergiesPlaceholder: 'எ.கா. பென்சிலின், வேர்க்கடலை (அல்லது ஏதுமில்லை)',
    authSpecialty: 'சிறப்புத் துறை',
    authQualifications: 'மருத்துவத் தகுதிகள்',
    authLicense: 'மருத்துவ உரிமம் / பதிவு எண்',
    authExperience: 'அனுபவம் (ஆண்டுகள்)',
    authFee: 'ஆலோசனை கட்டணம் (₹)',
    authHospitalAffiliation: 'மருத்துவமனை / கிளினிக் இணைப்பு',
    authHospitalFacility: 'மருத்துவமனை நிறுவனப் பெயர்',
    authSecurityKey: 'நிர்வாகி முதன்மை பாதுகாப்பு சாவி',
    authSignInBtn: 'உள்நுழைக -',
    authRegisterBtn: 'பதிவு செய்க -',
    authPortalSuffix: 'போர்ட்டல்',
    authHaveAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',
    authNeedAccount: 'இன்னும் கணக்கு இல்லையா?',
    authSignInLink: 'உள்நுழைக',
    authCreateLink: 'புதிய கணக்கை உருவாக்கவும்',
    authComplianceFooter: 'HealthPulse Ultra • NDHM, HIPAA மற்றும் டெலிமெடிசின் வழிகாட்டுதல்களுக்கு இணக்கமானது',
    authFillRequired: 'தேவையான அனைத்து விவரங்களையும் நிரப்பவும்.',
    authEnterAdminKey: 'நிர்வாக பாதுகாப்பு சாவியை உள்ளிடவும்.',
    authEnterBoth: 'மின்னஞ்சல் மற்றும் கடவுச்சொல் இரண்டையும் உள்ளிடவும்.',

    // General Shared Labels & Navigation
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    accountType: 'கணக்கு',
    emailLabel: 'மின்னஞ்சல்',
    phoneLabel: 'தொலைபேசி',
    bloodLabel: 'இரத்தம்',
    ageLabel: 'வயது',
    emergency247: '24x7 அவசர எஸ்.ஓ.எஸ்',
    emergencyDial: 'தேசிய அவசர உதவி எண்: 108 / 112-ஐ அழைக்கவும்',
    footerCompliance: 'HealthPulse Ultra மருத்துவ மருத்துவமனை மேலாண்மை அமைப்பு • NDHM, HIPAA மற்றும் டெலிமெடிசின் நடைமுறை வழிகாட்டுதல்களுக்கு இணக்கமானது.',

    // Patient Dashboard Details
    verifiedMedicalRecord: 'சரிபார்க்கப்பட்ட நோயாளி மருத்துவ ஆவணம்',
    bloodGroupLabel: 'இரத்த வகை',
    allergiesLabel: 'ஒவ்வாமைகள்',
    noneRecorded: 'பதிவு செய்யப்படவில்லை',
    daysUnit: 'நாட்கள்',
    nextUpcomingConsult: 'அடுத்த வரவிருக்கும் மருத்துவ ஆலோசனை',
    waitingRoomOpen: 'மெய்நிகர் காத்திருப்பு அறை திறக்கப்பட்டுள்ளது',
    reasonLabel: 'காரணம்',
    atTime: 'நேரம்',
    prescriptionsSubtitle: 'PDF அச்சுப் பிரதியுடன் கூடிய அதிகாரப்பூர்வ மருத்துவ மருந்துக் குறிப்புகள்.',
    noPrescriptions: 'இதுவரை மருத்துவ மருந்துக் குறிப்புகள் எதுவும் வழங்கப்படவில்லை.',
    noPrescriptionsSub: 'மருத்துவர்களால் வழங்கப்படும் மருந்துக் குறிப்புகள் PDF பதிவிறக்கத்துடன் இங்கே தோன்றும்.',
    prescribedBy: 'வழங்கியவர்',
    onDate: 'தேதி',
    drugsLabel: 'மருந்துகள்',
    alarmsSubtitle: 'உலவி ஆடியோ நினைவூட்டல்கள் மற்றும் கண்காணிப்பு.',
    manageAlarms: 'அலாரங்களை நிர்வகிக்கவும்',
    noAlarms: 'செயலில் உள்ள மருந்து நினைவூட்டல்கள் எதுவும் இல்லை.',
    addReminder: '+ மருந்து நினைவூட்டலைச் சேர்க்கவும்',
    takenCheck: 'எடுக்கப்பட்டது ✓',
    viewLabReportsBtn: 'பரிசோதனை ஆய்வக அறிக்கைகளைக் காண்க',
    exploreDiseaseDb: 'நோய் தரவுத்தளத்தை ஆராயுங்கள்',
    doctorsDirectorySubtitle: 'மூத்த மருத்துவ நிபுணர்களுடன் உடனடி வீடியோ அல்லது கிளினிக் ஆலோசனைகளை முன்பதிவு செய்யவும்.',
    noDoctorsFound: 'இந்த சிறப்புத் துறையில் இதுவரை மருத்துவர்கள் பதிவு செய்யப்படவில்லை.',
    noDoctorsFoundSub: 'அவர்களை இங்கே பட்டியலிட மருத்துவர் தளத்தில் ஒரு நிபுணரைப் பதிவு செய்யவும்.',
    yearsExp: 'ஆண்டுகள் அனுபவம்',
    consultation: 'ஆலோசனை',
    allSpecialties: 'அனைத்தும்',

    // Doctor Dashboard Details
    clinicalSuite: 'மருத்துவ பயிற்சி தளம்',
    issuedBadge: 'வழங்கப்பட்டது',
    telehealthClinic: 'டெலிஹெல்த் மெய்நிகர் கிளினிக்',
    patientQueueTab: 'நோயாளி ஆலோசனை வரிசை',
    prescriptionArchiveTab: 'மின்-மருந்துக் குறிப்பு காப்பகம்',
    todaysScheduleTitle: 'இன்றைய சந்திப்பு அட்டவணை மற்றும் ஓ.பி.டி வரிசை',
    noAppointmentsQueue: 'உங்கள் வரிசையில் நோயாளிகளின் சந்திப்புகள் எதுவும் இல்லை.',
    noAppointmentsQueueSub: 'நோயாளிகள் உங்களுடன் ஆலோசனைகளை திட்டமிடும் போது, அவை உடனடியாக இங்கே தோன்றும்.',
    chiefComplaints: 'முக்கிய மருத்துவ அறிகுறிகள்',
    mode: 'முறை',
    startVideoCall: 'வீடியோ அழைப்பைத் தொடங்கவும்',
    markComplete: 'ஆலோசனையை முடித்ததாகக் குறிக்கவும்',
    issuedPrescriptionsTitle: 'வழங்கப்பட்ட மின்-மருந்துக் குறிப்புகள்',
    noDoctorPrescriptions: 'இதுவரை மருந்துக் குறிப்புகள் எதுவும் வழங்கப்படவில்லை.',
    noDoctorPrescriptionsSub: "PDF அச்சுப் பிரதிகளுடன் டிஜிட்டல் மருந்துக் குறிப்புகளை உருவாக்க மேலே உள்ள '+ மின்-மருந்துக் குறிப்பு வழங்குக' என்பதைப் பயன்படுத்தவும்.",
    diagnosisLabel: 'நோய் கண்டறிதல்',
    medicinesLabel: 'மருந்துகள்',

    // Admin Dashboard Details
    bedAllocationSubtitle: 'தீவிர சிகிச்சை பிரிவு, அவசர சிகிச்சை, இதயவியல் மற்றும் பொது வார்டுகளில் நேரடி படுக்கை ஒதுக்கீடு.',
    searchBedPlaceholder: 'படுக்கை அல்லது நோயாளியைத் தேடுங்கள்...',
    oxygenActive: 'O₂ ஆக்ஸிஜன் இணைப்பு செயலில் உள்ளது',
    admittedLabel: 'அனுமதிக்கப்பட்ட தேதி',
    readyForIntake: 'நோயாளி சேர்க்கைக்கு தயார்',
    sanitationInProgress: 'சுத்திகரிப்பு நடைபெறுகிறது',
    dischargeAndSanitize: 'வெளியேற்றி சுத்திகரிக்கவும்',
    markAsReady: 'தயாராகக் குறிக்கவும்',
    allocatePatient: 'நோயாளியை ஒதுக்குங்கள்',
    invoicesSubtitle: 'சமீபத்திய மருத்துவ ஆலோசனை மற்றும் மருந்தக விலைப்பட்டியல்கள்.',
    invoicesProcessed: 'விலைப்பட்டியல்கள் செயலாக்கப்பட்டன',
    thInvoiceId: 'விலைப்பட்டியல் எண்',
    thPatientName: 'நோயாளி பெயர்',
    thDate: 'தேதி',
    thPhysician: 'கவனிக்கும் மருத்துவர்',
    thInsurance: 'காப்பீடு வழங்கியது',
    thTotalPayable: 'மொத்த செலுத்த வேண்டியது',
    thStatus: 'நிலை',

    // AI & Modals Extra
    aiAnalyzing: 'மருத்துவ அறிகுறிகள் பகுப்பாய்வு செய்யப்படுகிறது...',
    aiListening: 'உங்கள் குரலைக் கேட்கிறது...',
    aiReadAloud: 'சத்தமாகப் படிக்கவும்',
    aiReset: 'மீட்டமை',
    aiYou: 'நீங்கள்',
    aiAssistantName: 'MediPulse AI உதவியாளர்',
    aiAcuity: 'தீவிரம்',
    aiBookSpecialist: 'நிபுணரை முன்பதிவு செய்யவும்',
    aiActive247: '24/7 செயலில் உள்ளது',
    alarmAddCustom: 'தனிப்பயன் அலாரத்தைச் சேர்க்கவும்',
    alarmCancel: 'ரத்து செய்',
    alarmNewTitle: 'புதிய திட்டமிடப்பட்ட மருந்து அலாரம்',
    alarmMedName: 'மருந்து பெயர்',
    alarmDosage: 'அளவு',
    alarmFrequency: 'அதிர்வெண்',
    alarmSave: 'அலாரத்தை சேமிக்கவும்',
    alarmTakenToday: 'இன்று எடுக்கப்பட்டது ✓',
    alarmActiveSchedule: 'செயலில் உள்ள மருந்துகள் அட்டவணை',
    vaultTitle: 'உங்கள் பெட்டகத்தில் இதுவரை மருந்துக் குறிப்புகள் இல்லை.',
    vaultSubtitle: 'ஆலோசனைகள் முடிந்ததும், அதிகாரப்பூர்வ டிஜிட்டல் மருந்துக் குறிப்புகள் இங்கே தோன்றும்.',
    orderRx: 'மருந்து வாங்குக',
    openAlarmManager: 'அலாரம் மேலாளரைத் திறக்கவும்',
    noActiveAlarms: 'செயலில் உள்ள அலாரங்கள் எதுவும் கட்டமைக்கப்படவில்லை.',
    addFirstAlarm: '+ உங்கள் முதல் அலாரத்தைச் சேர்க்கவும்',
    streak: 'தொடர்ச்சி',
    viewFullDetails: 'முழு விவரங்களையும் காண்க',
    askAiBot: 'AI போட்டிடம் கேளுங்கள்',

    // Specialties
    specCardiologist: 'இதய நிபுணர்',
    specNeurologist: 'நரம்பியல் நிபுணர்',
    specGeneralPhysician: 'பொது மருத்துவர்',
    specPulmonologist: 'நுரையீரல் நிபுணர்',
    specDermatologist: 'தோல் நோய் நிபுணர்',
    specOrthopedic: 'எலும்பியல் அறுவை சிகிச்சை நிபுணர்',
    specPediatrician: 'குழந்தை நல மருத்துவர்',
    specGastroenterologist: 'இரைப்பை குடல் நிபுணர்',

    // Wards
    wardAll: 'அனைத்தும்',
    wardIcu: 'ICU பிரிவு',
    wardEmergency: 'அவசர சிகிச்சை',
    wardCardiology: 'இதயவியல் பிரிவு',
    wardGeneral: 'பொது வார்டு',
    wardPostSurgical: 'அறுவை சிகிச்சைக்குப் பின்'
  },

  // ---------------------------------------------------------------------------
  // 3. HINDI (HI - हिन्दी)
  // ---------------------------------------------------------------------------
  hi: {
    brandName: 'हेल्थपल्स अल्ट्रा',
    brandTagline: 'उन्नत एआई स्वास्थ्य सेवा एवं अस्पताल प्रबंधन प्रणाली',
    navDashboard: 'डैशबोर्ड अवलोकन',
    navKnowledgeBase: 'रोग एवं लक्षण ज्ञानकोष',
    navAiDoctor: 'एआई डॉक्टर एवं स्मार्ट ट्राइएज',
    navDoctors: 'डॉक्टर खोजें एवं बुक करें',
    navAppointments: 'परामर्श अनुसूची',
    navPrescriptions: 'ई-प्रिस्क्रिप्शन एवं दवा वॉल्ट',
    navMedAlarms: 'दवा अनुस्मारक अलार्म',
    navLabReports: 'डायग्नोस्टिक लैब रिपोर्ट',
    navBedManagement: 'आईसीयू एवं बिस्तर प्रबंधन',
    navBilling: 'चालान एवं बीमा',
    emergencySOS: 'आपातकालीन एसओएस',

    rolePatient: 'मरीज़',
    roleDoctor: 'डॉक्टर',
    roleAdmin: 'अस्पताल व्यवस्थापक',
    currentMode: 'सक्रिय मोड',
    switchRole: 'भूमिका बदलें',
    signOut: 'साइन आउट',
    welcomeBack: 'वापसी पर स्वागत है',

    statusUpcoming: 'आगामी',
    statusCompleted: 'पूर्ण हुआ',
    statusCancelled: 'रद्द किया गया',
    statusOccupied: 'भरा हुआ',
    statusAvailable: 'उपलब्ध',
    statusCleaning: 'सफाई जारी है',
    statusReserved: 'आरक्षित',
    statusNormal: 'सामान्य',
    statusHigh: 'उच्च',
    statusLow: 'कम',
    statusPaid: 'भुगतान किया गया',
    statusPending: 'लंबित',

    actionBookConsult: 'परामर्श बुक करें',
    actionJoinVideo: 'एचडी वीडियो कॉल में शामिल हों',
    actionIssuePrescription: 'ई-प्रिस्क्रिप्शन जारी करें',
    actionPrintPdf: 'प्रिंट करें / पीडीएफ सहेजें',
    actionDownloadTxt: 'टेक्स्ट सारांश डाउनलोड करें',
    actionSendPharmacy: 'फार्मेसी को भेजें',
    actionAddAlarm: 'दवा अलार्म सेट करें',
    actionMarkTaken: 'ली गई के रूप में चिह्नित करें',
    actionRingTest: 'अलार्म टोन का परीक्षण करें',
    actionAnalyze: 'स्मार्ट एआई विश्लेषण चलाएं',
    actionSpeakVoice: 'लक्षण बोलें (आवाज़)',
    actionStopVoice: 'सुनना बंद करें',
    actionClose: 'बंद करें',
    actionCancel: 'रद्द करें',
    actionConfirm: 'पुष्टि करें',
    actionSave: 'सहेजें',
    actionFilter: 'फ़िल्टर करें',
    actionSearch: 'खोजें...',
    actionDispatchAmbulance: 'एम्बुलेंस भेजें',

    statActiveAppointments: 'आगामी परामर्श',
    statPrescriptions: 'डिजिटल नुस्खे',
    statBedOccupancy: 'बिस्तर उपयोग दर',
    statAdherenceStreak: 'दवा अनुपालन की निरंतरता',
    statAvailableSpecialists: 'ड्यूटी पर विशेषज्ञ',
    statEmergencyHotline: 'आपातकालीन सहायता',
    statTodayOPD: 'आज के ओपीडी मरीज़',
    statTotalRevenue: 'कुल क्लिनिकल बिलिंग',

    kbTitle: 'व्यापक मानव रोग एवं लक्षण ज्ञानकोष',
    kbSubtitle: 'मानव रोगों, लक्षणों, नैदानिक परीक्षणों और प्राथमिक चिकित्सा प्रोटोकॉल का चिकित्सकीय रूप से सत्यापित विश्वकोश।',
    kbSearchPlaceholder: 'रोग (उदा. माइग्रेन, अस्थमा, डेंगू) या लक्षण (उदा. सीने में दर्द, बुखार) द्वारा खोजें...',
    kbAllCategories: 'सभी चिकित्सा विषय',
    kbKeySymptoms: 'मुख्य नैदानिक लक्षण',
    kbOverview: 'चिकित्सीय अवलोकन',
    kbSeverity: 'ट्राइएज गंभीरता',
    kbSpecialist: 'अनुशंसित विशेषज्ञ',
    kbDiagnosticTests: 'नैदानिक परीक्षण एवं प्रयोगशालाएं',
    kbFirstAid: 'तत्काल प्राथमिक चिकित्सा प्रोटोकॉल',
    kbPrevention: 'रोकथाम एवं नैदानिक दिशानिर्देश',
    kbEmergencyAlert: 'महत्वपूर्ण चेतावनी संकेत',
    kbConsultSpecialist: 'विशेषज्ञ से परामर्श लें',

    aiTitle: 'मेडीपल्स एआई मेडिकल डॉक्टर एवं क्लिनिकल ट्राइएज',
    aiSubtitle: 'बहुभाषी तंत्रिका निदान इंजन - तत्काल चेतावनी पहचान और विशेषज्ञ सिफारिश के साथ।',
    aiInputPlaceholder: 'अपने लक्षणों का वर्णन करें (उदा. "सीने में भारीपन, बाएं हाथ में दर्द और पसीना आना")...',
    aiAskQuestion: 'एआई से पूछें',
    aiUrgencyEmergency: 'अति आपातकालीन स्थिति',
    aiUrgencyUrgent: 'तत्काल ध्यान आवश्यक',
    aiUrgencyRoutine: 'नियमित परामर्श',
    aiUrgencySelfCare: 'घरेलू देखभाल',
    aiTriageAssessment: 'गंभीरता स्कोर एवं ट्राइएज स्तर',
    aiPossibleCauses: 'संभावित चिकित्सीय कारण',
    aiRecommendedDepartment: 'अनुशंसित क्लिनिकल विभाग',
    aiFirstAidGuidance: 'तत्काल प्राथमिक चिकित्सा निर्देश',
    aiRedFlagWarning: 'जीवन के लिए खतरनाक आपातकालीन स्थिति पहचानी गई! तुरंत 108 / 112 डायल करें।',
    aiDisclaimer: 'अस्वीकरण: मेडीपल्स एआई केवल एक चिकित्सीय निर्णय-सहायता उपकरण है। जीवन के लिए खतरनाक आपात स्थितियों में तुरंत राष्ट्रीय हेल्पलाइन (108 / 112) पर कॉल करें।',
    aiQuickChipsTitle: 'सुझाए गए चिकित्सीय प्रश्न',

    rxTitle: 'डिजिटल ई-प्रिस्क्रिप्शन एवं आधिकारिक मेडिकल रिकॉर्ड',
    rxHospitalLetterhead: 'हेल्थपल्स सुपर स्पेशलिटी अस्पताल एवं अनुसंधान केंद्र',
    rxAccredited: 'जेसीआई एवं एनएबीएच मान्यता प्राप्त अंतरराष्ट्रीय स्वास्थ्य संस्थान',
    rxNumber: 'प्रिस्क्रिप्शन संख्या',
    rxDate: 'जारी करने की तिथि',
    rxDoctorDetails: 'उपस्थित चिकित्सक विवरण',
    rxPatientDetails: 'मरीज़ मेडिकल रिकॉर्ड',
    rxAgeGender: 'आयु / लिंग',
    rxVitals: 'दर्ज किए गए महत्वपूर्ण शारीरिक संकेतक',
    rxBp: 'रक्तचाप (BP)',
    rxPulse: 'नाड़ी की दर',
    rxTemp: 'शरीर का तापमान',
    rxSpo2: 'SpO2 ऑक्सीजन संतृप्ति',
    rxWeight: 'शरीर का वजन',
    rxBloodSugar: 'ब्लड शुगर (RBS)',
    rxDiagnosis: 'प्राथमिक नैदानिक निष्कर्ष',
    rxSymptomsObserved: 'देखे गए लक्षण एवं मुख्य शिकायतें',
    rxMedicationsList: 'निर्धारित दवाएं (Rx)',
    rxMedicineName: 'दवा का नाम एवं क्षमता',
    rxDosage: 'खुराक',
    rxFrequency: 'आवृत्ति (बार)',
    rxTiming: 'लेने का समय',
    rxDuration: 'अवधि',
    rxRoute: 'मार्ग',
    rxInstructions: 'विशेष निर्देश',
    rxClinicalAdvice: 'चिकित्सीय सलाह एवं आहार/जीवनशैली बदलाव',
    rxRecommendedLabs: 'अनुशंसित नैदानिक प्रयोगशाला परीक्षण',
    rxFollowUp: 'अगली चिकित्सीय समीक्षा/फॉलो-अप तिथि',
    rxDoctorSignature: 'अधिकृत चिकित्सक के डिजिटल हस्ताक्षर',
    rxOfficialSeal: 'आधिकारिक संस्थागत मुहर एवं एनडीएचएम क्यूआर सत्यापन',
    rxValidDisclaimer: 'जारी होने की तारीख से 90 दिनों तक वैध। टेलीमेडिसिन दिशानिर्देशों और एनडीएचएम नियमों के अनुरूप।',
    rxDrugInteractionWarning: 'क्लिनिकल चेतावनी: दवाओं के बीच संभावित प्रतिकूल प्रभाव का पता चला! निर्धारित दर्द निवारक और रक्त पतला करने वाली दवाओं की समीक्षा करें।',
    rxAddNewMedicine: 'एक और दवा जोड़ें',
    rxIssueSuccess: 'डिजिटल नुस्खा सफलतापूर्वक जारी एवं हस्ताक्षरित किया गया!',

    alarmTitle: 'स्मार्ट दवा अलार्म एवं अनुपालन ट्रैकर',
    alarmSubtitle: 'ऑडियो-विजुअल टोन रिमाइंडर और दैनिक दवा निरंतरता विश्लेषण।',
    alarmTakenNotification: 'दवा ली गई के रूप में दर्ज! निरंतरता संख्या अपडेट की गई।',
    alarmTime: 'अलार्म का समय',
    alarmDaysStreak: 'दिनों की निरंतर दवा आदत',
    alarmRingingHeader: 'दवा लेने का समय!',
    alarmRingingPrompt: 'आपकी निर्धारित खुराक लेने का समय आ गया है:',
    alarmSnoozeDismiss: 'मैंने ले ली है ✓',
    alarmDualSmsTitle: 'दोहरी स्वचालित SMS प्रेषण प्रणाली',
    alarmDualSmsSubtitle: 'अलार्म बजने पर मरीज और अभिभावक दोनों के नंबरों पर तत्काल SMS भेजा जाता है।',
    alarmPatientTarget: 'मरीज का मोबाइल',
    alarmGuardianTarget: 'अभिभावक का मोबाइल',
    alarmSendDualSmsBtn: 'अलार्म बजाएं और दोहरी SMS भेजें',
    alarmSmsDispatchedToast: 'मरीज और अभिभावक दोनों को SMS सफलतापूर्वक भेज दिया गया!',
    alarmSmsSentSuccess: 'SMS भेजा गया और प्राप्त हुआ',
    alarmSmsDelivered: 'HealthPulse SMS गेटवे द्वारा वितरित',
    alarmSmsHistoryTitle: 'लाइव SMS प्रेषण रिकॉर्ड',
    alarmEditContactsBtn: 'अलर्ट नंबर बदलें',
    alarmSaveContactsBtn: 'नंबर सहेजें',
    alarmContactsSavedToast: 'अलर्ट संपर्क नंबर सफलतापूर्वक अपडेट किए गए!',
    alarmSendWhatsAppPatient: 'मरीज को व्हाट्सएप भेजें',
    alarmSendWhatsAppGuardian: 'अभिभावक को व्हाट्सएप भेजें',
    alarmSendSmsPatient: 'मरीज को SMS भेजें',
    alarmSendSmsGuardian: 'अभिभावक को SMS भेजें',
    alarmAutoDispatchBoth: 'दोनों नंबरों पर संदेश भेजें (व्हाट्सएप / SMS)',
    alarmRealMessageSuccess: 'वास्तविक संदेश विंडो खुल गई है! समीक्षा करें और भेजें पर टैप करें।',
    alarmNumberFormatHint: 'सुझाव: 10 अंकों का वैध मोबाइल नंबर या देश कोड (+91) दर्ज करें।',

    emgTitle: '24x7 गंभीर आपातकालीन चिकित्सा प्रतिक्रिया',
    emgSubtitle: 'सीधी हेल्पलाइन पहुंच, जीपीएस पैरामेडिक एम्बुलेंस और तत्काल जीवन रक्षक मार्गदर्शन।',
    emgNationalAmbulance: 'राष्ट्रीय एम्बुलेंस हेल्पलाइन',
    emgUnifiedEmergency: 'एकीकृत आपातकालीन सेवाएं',
    emgCardiacHelpline: 'हृदय रोग आपातकालीन हेल्पलाइन',
    emgPoisonControl: 'राष्ट्रीय विष नियंत्रण केंद्र',
    emgAmbulanceTracking: 'जीपीएस एम्बुलेंस लाइव डिस्पैच ट्रैकर',
    emgEtaMinutes: 'एम्बुलेंस पहुंचने का अनुमानित समय',
    emgDispatchSuccess: 'एम्बुलेंस आपके स्थान पर सफलतापूर्वक भेज दी गई है!',

    telehealthTitle: 'सुरक्षित टेलीहेल्थ एचडी वीडियो परामर्श',
    telehealthHipaa: 'HIPAA एवं टेलीमेडिसिन अभ्यास दिशानिर्देशों के अनुरूप 256-बिट एन्क्रिप्टेड स्ट्रीम',
    telehealthEndCall: 'परामर्श समाप्त करें',
    telehealthCameraOn: 'कैमरा बंद करें',
    telehealthCameraOff: 'कैमरा चालू करें',
    telehealthMicOn: 'माइक म्यूट करें',
    telehealthMicMute: 'माइक अनम्यूट करें',
    telehealthInCallChat: 'परामर्श के दौरान चैट',
    telehealthTypeMessage: 'डॉक्टर को संदेश लिखें...',
    telehealthLiveWebcam: 'लाइव एचडी वेबकैम',
    telehealthScreenShare: 'स्क्रीन / मेडिकल रिपोर्ट साझा करें',
    telehealthStopScreen: 'स्क्रीन शेयरिंग बंद करें',
    telehealthVitalsHud: 'लाइव ईसीजी एवं वाइटल्स मॉनिटर',
    telehealthLiveCaptions: 'एआई लाइव सबटाइटल (कैप्शन)',
    telehealthSnapshot: 'नैदानिक फोटो कैप्चर करें',
    telehealthSnapshotTaken: 'नैदानिक फोटो कैप्चर की गई और मरीज़ के मेडिकल चार्ट में संलग्न की गई!',
    telehealthCameraPermission: 'कैमरा अनुमति अस्वीकृत या अनुपलब्ध। एन्क्रिप्टेड एचडी सिमुलेशन दिखाया जा रहा है।',

    // ABHA Digital Health Card
    abhaCardTitle: 'आयुष्मान भारत डिजिटल हेल्थ कार्ड (ABHA)',
    abhaCardSubtitle: 'राष्ट्रीय डिजिटल स्वास्थ्य मिशन (NDHM) सत्यापित पहचान पत्र',
    abhaIdNumber: 'ABHA स्वास्थ्य संख्या',
    abhaAddress: 'ABHA पता',
    abhaDownloadBtn: 'आधिकारिक ABHA कार्ड डाउनलोड करें',

    // AI Ambient Voice Scribe
    scribeTitle: 'एआई एम्बिएंट क्लिनिकल स्क्राइब (आवाज़ से प्रिस्क्रिप्शन)',
    scribeListening: 'परामर्श को सुन रहा है... नुस्खे में बदल रहा है...',
    scribeStartBtn: 'एआई स्क्राइब डिक्टेशन शुरू करें',
    scribeStopBtn: 'डिक्टेशन रोकें एवं लागू करें',
    scribeSampleHint: 'बोलें: "मरीज़ को एक्यूट ब्रोंकाइटिस है। एज़िथ्रोमाइसिन 500mg दिन में एक बार 5 दिनों के लिए दें।"',

    // AI Medical Imaging & Radiology Viewer
    radiologyTitle: 'रेडियोलॉजी एवं डायग्नोस्टिक स्कैन एआई हीटमैप',
    radiologySubtitle: 'एक्स-रे और एमआरआई के स्वचालित विश्लेषण के लिए डीप लर्निंग कंप्यूटर विज़न।',
    radiologyAiHeatmap: 'एआई पैथोलॉजी हीटमैप टॉगल करें',
    radiologyConfidence: 'एआई निदान सटीकता',

    // Auth Page & Form Controls
    authWelcomeTitle: 'HealthPulse में आपका स्वागत है',
    authCreateTitle: 'अपना खाता बनाएं',
    authSubtitle: 'अपने व्यक्तिगत चिकित्सा पोर्टल तक पहुंचने के लिए अपनी भूमिका चुनें',
    authPatientTab: 'मरीज़',
    authDoctorTab: 'डॉक्टर',
    authAdminTab: 'अस्पताल व्यवस्थापक',
    authQuickFill: 'त्वरित परीक्षण क्रेडेंशियल:',
    authFullName: 'पूरा नाम',
    authDoctorName: 'डॉक्टर का पूरा नाम',
    authFullNamePlaceholder: 'उदा. राहुल शर्मा',
    authDoctorNamePlaceholder: 'उदा. डॉ. प्रिया वर्मा',
    authEmail: 'ईमेल पता',
    authAdminEmail: 'आधिकारिक अस्पताल ईमेल',
    authEmailPlaceholder: 'name@example.com',
    authPassword: 'पासवर्ड',
    authPhone: 'संपर्क फोन नंबर',
    authGuardianName: 'अभिभावक / देखभालकर्ता का नाम',
    authGuardianNamePlaceholder: 'उदा. सारा मॉर्गन (पिता/पति/देखभालकर्ता)',
    authGuardianPhone: 'अभिभावक आपातकालीन मोबाइल नंबर',
    authGuardianPhonePlaceholder: '+91 98765 43211',
    authGuardianPhoneHelp: 'दवा अलार्म और आपातकालीन संदेश इस नंबर पर SMS द्वारा भेजे जाएंगे।',
    authAge: 'आयु',
    authGender: 'लिंग',
    genderMale: 'पुरुष',
    genderFemale: 'महिला',
    genderOther: 'अन्य',
    authBloodGroup: 'रक्त समूह',
    authAllergies: 'ज्ञात एलर्जी',
    authAllergiesPlaceholder: 'उदा. पेनिसिलिन, मूंगफली (या कोई नहीं)',
    authSpecialty: 'विशेषज्ञता',
    authQualifications: 'शैक्षणिक योग्यताएं',
    authLicense: 'लाइसेंस / पंजीकरण संख्या',
    authExperience: 'अनुभव (वर्ष)',
    authFee: 'परामर्श शुल्क (₹)',
    authHospitalAffiliation: 'अस्पताल / क्लिनिक संबद्धता',
    authHospitalFacility: 'अस्पताल सुविधा का नाम',
    authSecurityKey: 'व्यवस्थापक मास्टर सुरक्षा कुंजी',
    authSignInBtn: 'साइन इन करें -',
    authRegisterBtn: 'पंजीकरण करें -',
    authPortalSuffix: 'पोर्टल',
    authHaveAccount: 'क्या आपके पास पहले से खाता है?',
    authNeedAccount: 'क्या आपके पास अभी तक खाता नहीं है?',
    authSignInLink: 'साइन इन करें',
    authCreateLink: 'नया खाता बनाएं',
    authComplianceFooter: 'HealthPulse Ultra • NDHM, HIPAA और टेलीमेडिसिन दिशानिर्देशों के अनुरूप',
    authFillRequired: 'कृपया सभी आवश्यक फ़ील्ड भरें।',
    authEnterAdminKey: 'कृपया व्यवस्थापक सुरक्षा कुंजी दर्ज करें।',
    authEnterBoth: 'कृपया ईमेल और पासवर्ड दोनों दर्ज करें।',

    // General Shared Labels & Navigation
    selectLanguage: 'भाषा चुनें',
    accountType: 'खाता',
    emailLabel: 'ईमेल',
    phoneLabel: 'फ़ोन',
    bloodLabel: 'रक्त',
    ageLabel: 'आयु',
    emergency247: '24x7 आपातकालीन एसओएस',
    emergencyDial: 'राष्ट्रीय आपातकालीन हेल्पलाइन: 108 / 112 डायल करें',
    footerCompliance: 'HealthPulse Ultra क्लिनिकल अस्पताल प्रबंधन प्रणाली • NDHM, HIPAA और टेलीमेडिसिन अभ्यास दिशानिर्देशों के अनुरूप।',

    // Patient Dashboard Details
    verifiedMedicalRecord: 'सत्यापित मरीज़ मेडिकल रिकॉर्ड',
    bloodGroupLabel: 'रक्त समूह',
    allergiesLabel: 'एलर्जी',
    noneRecorded: 'कोई दर्ज नहीं',
    daysUnit: 'दिन',
    nextUpcomingConsult: 'अगला आगामी परामर्श',
    waitingRoomOpen: 'वर्चुअल वेटिंग रूम खुला है',
    reasonLabel: 'कारण',
    atTime: 'समय',
    prescriptionsSubtitle: 'पीडीएफ प्रिंटआउट के साथ आधिकारिक चिकित्सा नुस्खे।',
    noPrescriptions: 'अभी तक कोई मेडिकल नुस्खा जारी नहीं किया गया है।',
    noPrescriptionsSub: 'उपस्थित डॉक्टरों द्वारा जारी किए गए आधिकारिक नुस्खे यहां पीडीएफ डाउनलोड के साथ दिखाई देंगे।',
    prescribedBy: 'द्वारा निर्धारित',
    onDate: 'तारीख',
    drugsLabel: 'दवाएं',
    alarmsSubtitle: 'ब्राउज़र वेब ऑडियो अलार्म और स्ट्रीक ट्रैकिंग।',
    manageAlarms: 'अलार्म प्रबंधित करें',
    noAlarms: 'कोई सक्रिय दवा अलार्म नहीं है।',
    addReminder: '+ दवा अनुस्मारक जोड़ें',
    takenCheck: 'ली गई ✓',
    viewLabReportsBtn: 'डायग्नोस्टिक लैब रिपोर्ट देखें',
    exploreDiseaseDb: 'रोग डेटाबेस देखें',
    doctorsDirectorySubtitle: 'वरिष्ठ विशेषज्ञों के साथ तत्काल वीडियो या क्लिनिक परामर्श बुक करें।',
    noDoctorsFound: 'इस विशेषता के तहत अभी तक कोई डॉक्टर पंजीकृत नहीं है।',
    noDoctorsFoundSub: 'उन्हें यहां सूचीबद्ध करने के लिए डॉक्टर पोर्टल में एक विशेषज्ञ पंजीकृत करें।',
    yearsExp: 'वर्ष का अनुभव',
    consultation: 'परामर्श',
    allSpecialties: 'सभी',

    // Doctor Dashboard Details
    clinicalSuite: 'क्लिनिकल प्रैक्टिस सूट',
    issuedBadge: 'जारी किए गए',
    telehealthClinic: 'टेलीहेल्थ वर्चुअल क्लिनिक',
    patientQueueTab: 'मरीज़ परामर्श कतार',
    prescriptionArchiveTab: 'ई-प्रिस्क्रिप्शन आर्काइव',
    todaysScheduleTitle: 'आज का अपॉइंटमेंट शेड्यूल और ओपीडी कतार',
    noAppointmentsQueue: 'आपकी कतार में कोई मरीज़ अपॉइंटमेंट नहीं है।',
    noAppointmentsQueueSub: 'जब मरीज़ आपके साथ परामर्श निर्धारित करते हैं, तो वे तुरंत यहां दिखाई देंगे।',
    chiefComplaints: 'मुख्य शिकायतें',
    mode: 'माध्यम',
    startVideoCall: 'वीडियो कॉल शुरू करें',
    markComplete: 'परामर्श पूर्ण चिह्नित करें',
    issuedPrescriptionsTitle: 'जारी किए गए ई-प्रिस्क्रिप्शन',
    noDoctorPrescriptions: 'अभी तक कोई नुस्खा जारी नहीं किया गया है।',
    noDoctorPrescriptionsSub: "पीडीएफ प्रिंटआउट के साथ डिजिटल नुस्खे उत्पन्न करने और हस्ताक्षर करने के लिए ऊपर '+ ई-प्रिस्क्रिप्शन जारी करें' का उपयोग करें।",
    diagnosisLabel: 'रोग निदान',
    medicinesLabel: 'दवाएं',

    // Admin Dashboard Details
    bedAllocationSubtitle: 'आईसीयू, आपातकालीन आघात, कार्डियोलॉजी और सामान्य वार्डों में लाइव अस्पताल बिस्तर आवंटन।',
    searchBedPlaceholder: 'बिस्तर या मरीज़ खोजें...',
    oxygenActive: 'O₂ ऑक्सीजन लाइन सक्रिय',
    admittedLabel: 'भर्ती तारीख',
    readyForIntake: 'मरीज़ भर्ती के लिए तैयार',
    sanitationInProgress: 'सफाई प्रगति पर है',
    dischargeAndSanitize: 'डिस्चार्ज और सैनिटाइज करें',
    markAsReady: 'तैयार चिह्नित करें',
    allocatePatient: 'मरीज़ आवंटित करें',
    invoicesSubtitle: 'हालिया परामर्श और फार्मेसी चालान।',
    invoicesProcessed: 'चालान संसाधित किए गए',
    thInvoiceId: 'चालान आईडी',
    thPatientName: 'मरीज़ का नाम',
    thDate: 'तारीख',
    thPhysician: 'उपस्थित चिकित्सक',
    thInsurance: 'बीमा कवर',
    thTotalPayable: 'कुल देय',
    thStatus: 'स्थिति',

    // AI & Modals Extra
    aiAnalyzing: 'क्लिनिकल स्थिति का विश्लेषण किया जा रहा है...',
    aiListening: 'आपकी आवाज़ सुन रहा है...',
    aiReadAloud: 'ज़ोर से पढ़ें',
    aiReset: 'रीसेट',
    aiYou: 'आप',
    aiAssistantName: 'MediPulse AI सहायक',
    aiAcuity: 'गंभीरता',
    aiBookSpecialist: 'विशेषज्ञ बुक करें',
    aiActive247: '24/7 सक्रिय',
    alarmAddCustom: 'कस्टम अलार्म जोड़ें',
    alarmCancel: 'रद्द करें',
    alarmNewTitle: 'नया निर्धारित दवा अलार्म',
    alarmMedName: 'दवा का नाम',
    alarmDosage: 'खुराक',
    alarmFrequency: 'आवृत्ति',
    alarmSave: 'अलार्म सहेजें',
    alarmTakenToday: 'आज ली गई ✓',
    alarmActiveSchedule: 'सक्रिय नुस्खे अनुसूची',
    vaultTitle: 'आपके वॉल्ट में अभी तक कोई नुस्खा नहीं है।',
    vaultSubtitle: 'परामर्श समाप्त होने पर आधिकारिक डिजिटल नुस्खे यहां दिखाई देंगे।',
    orderRx: 'दवा ऑर्डर करें',
    openAlarmManager: 'अलार्म प्रबंधक खोलें',
    noActiveAlarms: 'कोई सक्रिय अलार्म कॉन्फ़िगर नहीं किया गया है।',
    addFirstAlarm: '+ अपना पहला कस्टम अलार्म जोड़ें',
    streak: 'लगातार दिन',
    viewFullDetails: 'पूरा विवरण देखें',
    askAiBot: 'AI बॉट से पूछें',

    // Specialties
    specCardiologist: 'हृदय रोग विशेषज्ञ',
    specNeurologist: 'न्यूरोलॉजिस्ट',
    specGeneralPhysician: 'सामान्य चिकित्सक',
    specPulmonologist: 'पल्मोनोलॉजिस्ट',
    specDermatologist: 'त्वचा रोग विशेषज्ञ',
    specOrthopedic: 'हड्डी रोग विशेषज्ञ',
    specPediatrician: 'बाल रोग विशेषज्ञ',
    specGastroenterologist: 'गैस्ट्रोएंटेरोलॉजिस्ट',

    // Wards
    wardAll: 'सभी',
    wardIcu: 'आईसीयू',
    wardEmergency: 'आपातकालीन देखभाल',
    wardCardiology: 'कार्डियोलॉजी वार्ड',
    wardGeneral: 'सामान्य वार्ड',
    wardPostSurgical: 'सर्जरी उपरांत'
  },

  // ---------------------------------------------------------------------------
  // 4. GERMAN (DE - Deutsch)
  // ---------------------------------------------------------------------------
  de: {
    brandName: 'HealthPulse Ultra',
    brandTagline: 'Fortschrittliches KI-Gesundheits- & Krankenhaus-Managementsystem',
    navDashboard: 'Dashboard-Übersicht',
    navKnowledgeBase: 'Krankheiten- & Symptom-Wissensdatenbank',
    navAiDoctor: 'KI-Arzt & Intelligente Triage',
    navDoctors: 'Ärzte finden & buchen',
    navAppointments: 'Sprechstunden-Terminplan',
    navPrescriptions: 'E-Rezepte & Medikamententresor',
    navMedAlarms: 'Medikamenten-Alarme',
    navLabReports: 'Diagnostische Laborberichte',
    navBedManagement: 'Intensivstation- & Bettenmanagement',
    navBilling: 'Rechnungen & Krankenversicherung',
    emergencySOS: 'NOTFALL-SOS',

    rolePatient: 'Patient',
    roleDoctor: 'Arzt',
    roleAdmin: 'Krankenhaus-Admin',
    currentMode: 'Aktiver Modus',
    switchRole: 'Rolle wechseln',
    signOut: 'Abmelden',
    welcomeBack: 'Willkommen zurück',

    statusUpcoming: 'Bevorstehend',
    statusCompleted: 'Abgeschlossen',
    statusCancelled: 'Storniert',
    statusOccupied: 'Belegt',
    statusAvailable: 'Verfügbar',
    statusCleaning: 'Desinfektion läuft',
    statusReserved: 'Reserviert',
    statusNormal: 'Normal',
    statusHigh: 'Hoch',
    statusLow: 'Niedrig',
    statusPaid: 'Bezahlt',
    statusPending: 'Ausstehend',

    actionBookConsult: 'Konsultation buchen',
    actionJoinVideo: 'HD-Videoanruf beitreten',
    actionIssuePrescription: 'E-Rezept ausstellen',
    actionPrintPdf: 'Drucken / Als PDF speichern',
    actionDownloadTxt: 'Textzusammenfassung herunterladen',
    actionSendPharmacy: 'Über Apotheke bestellen',
    actionAddAlarm: 'Medikamenten-Alarm einrichten',
    actionMarkTaken: 'Als eingenommen markieren',
    actionRingTest: 'Alarmton testen',
    actionAnalyze: 'Smarte KI-Analyse starten',
    actionSpeakVoice: 'Symptome sprechen (Spracheingabe)',
    actionStopVoice: 'Zuhören beenden',
    actionClose: 'Schließen',
    actionCancel: 'Abbrechen',
    actionConfirm: 'Bestätigen',
    actionSave: 'Speichern',
    actionFilter: 'Filtern',
    actionSearch: 'Suchen...',
    actionDispatchAmbulance: 'Krankenwagen entsenden',

    statActiveAppointments: 'Bevorstehende Konsultationen',
    statPrescriptions: 'Digitale Rezepte',
    statBedOccupancy: 'Bettenauslastungsrate',
    statAdherenceStreak: 'Medikamenten-Adhärenz',
    statAvailableSpecialists: 'Diensthabende Fachärzte',
    statEmergencyHotline: 'Notfall-Einsatzbereitschaft',
    statTodayOPD: 'Heutige Ambulanzpatienten',
    statTotalRevenue: 'Gesamte klinische Abrechnung',

    kbTitle: 'Umfassende Krankheiten- & Symptom-Wissensdatenbank',
    kbSubtitle: 'Klinisch verifizierte medizinische Enzyklopädie menschlicher Erkrankungen, Symptome, Diagnosetests und Notfallprotokolle.',
    kbSearchPlaceholder: 'Nach Erkrankung (z.B. Migräne, Asthma, Dengue) oder Symptom (z.B. Brustschmerzen, Fieber) suchen...',
    kbAllCategories: 'Alle Fachdisziplinen',
    kbKeySymptoms: 'Klinische Leitsymptome',
    kbOverview: 'Medizinischer Überblick',
    kbSeverity: 'Triage-Schweregrad',
    kbSpecialist: 'Empfohlener Facharzt',
    kbDiagnosticTests: 'Diagnostische Tests & Laboruntersuchungen',
    kbFirstAid: 'Unmittelbare Erste-Hilfe-Maßnahmen',
    kbPrevention: 'Prävention & Klinische Richtlinien',
    kbEmergencyAlert: 'Kritische Warnhinweise (Red Flags)',
    kbConsultSpecialist: 'Facharzt konsultieren',

    aiTitle: 'MediPulse KI-Arzt & Klinische Triage',
    aiSubtitle: 'Mehrsprachige neuronale Diagnose-Engine mit Erkennung von Gefahrensignalen und Facharztempfehlung.',
    aiInputPlaceholder: 'Symptome beschreiben (z.B. "Druckgefühl in der Brust mit Ausstrahlung in den linken Arm und Schweißausbruch")...',
    aiAskQuestion: 'MediPulse KI befragen',
    aiUrgencyEmergency: 'KRITISCHER NOTFALL',
    aiUrgencyUrgent: 'DRINGENDER HANDLUNGSBEDARF',
    aiUrgencyRoutine: 'ROUTINEKONSULTATION',
    aiUrgencySelfCare: 'HÄUSLICHE SELBSTPFLEGE',
    aiTriageAssessment: 'Schweregrad-Bewertung & Triage-Stufe',
    aiPossibleCauses: 'Identifizierte Differenzialdiagnosen',
    aiRecommendedDepartment: 'Empfohlene Fachabteilung',
    aiFirstAidGuidance: 'Sofortige Handlungsmaßnahmen',
    aiRedFlagWarning: 'Potenziell lebensbedrohliches Warnsignal erkannt! Bitte sofort den Notruf 108 / 112 wählen.',
    aiDisclaimer: 'Haftungsausschluss: MediPulse KI ist ein klinisches Entscheidungsunterstützungssystem. Bei akuten Notfällen sofort den nationalen Rettungsdienst (108 / 112) alarmieren.',
    aiQuickChipsTitle: 'Vorgeschlagene klinische Fragen',

    rxTitle: 'Digitales E-Rezept & Offizielle Patientenakte',
    rxHospitalLetterhead: 'HealthPulse Überregionales Fachkrankenhaus & Medizinisches Forschungszentrum',
    rxAccredited: 'JCI- & NABH-akkreditierte Gesundheitseinrichtung',
    rxNumber: 'Rezeptnummer',
    rxDate: 'Ausstellungsdatum',
    rxDoctorDetails: 'Behandelnder Facharzt',
    rxPatientDetails: 'Patienten-Stammdaten',
    rxAgeGender: 'Alter / Geschlecht',
    rxVitals: 'Erfasste klinische Vitalparameter',
    rxBp: 'Blutdruck (RR)',
    rxPulse: 'Herzfrequenz / Puls',
    rxTemp: 'Körpertemperatur',
    rxSpo2: 'Sauerstoffsättigung (SpO2)',
    rxWeight: 'Körpergewicht',
    rxBloodSugar: 'Blutzucker (BZ)',
    rxDiagnosis: 'Primäre klinische Diagnose',
    rxSymptomsObserved: 'Hauptbeschwerden & Symptomatik',
    rxMedicationsList: 'Verschriebene Medikation (Rx)',
    rxMedicineName: 'Medikament & Wirkstärke',
    rxDosage: 'Dosierung',
    rxFrequency: 'Einnahmefrequenz',
    rxTiming: 'Einnahmezeitpunkt',
    rxDuration: 'Dauer',
    rxRoute: 'Applikationsweg',
    rxInstructions: 'Spezifische Einnahmehinweise',
    rxClinicalAdvice: 'Ärztliche Beratung & Lebensstil- / Ernährungsempfehlungen',
    rxRecommendedLabs: 'Empfohlene diagnostische Laboruntersuchungen',
    rxFollowUp: 'Nächster Kontrolltermin / Wiedervorstellung',
    rxDoctorSignature: 'Unterschrift des approbierten Arztes',
    rxOfficialSeal: 'Offizielles Institutionssiegel & NDHM-QR-Verifikation',
    rxValidDisclaimer: 'Gültig für 90 Tage ab Ausstellungsdatum. Konform mit den Richtlinien für Telemedizin und der National Digital Health Mission (NDHM).',
    rxDrugInteractionWarning: 'Klinischer Warnhinweis: Mögliche Arzneimittelwechselwirkung erkannt! Überprüfen Sie verordnete NSAR und Antikoagulanzien.',
    rxAddNewMedicine: 'Weiteres Medikament hinzufügen',
    rxIssueSuccess: 'Digitales Rezept erfolgreich ausgestellt und signiert!',

    alarmTitle: 'Intelligente Medikamenten-Alarme & Therapietreue',
    alarmSubtitle: 'Audiovisuelle Erinnerungssignale mit täglicher Einnahme-Statistik.',
    alarmTakenNotification: 'Medikament als eingenommen markiert! Adhärenz-Serie aktualisiert.',
    alarmTime: 'Alarm-Uhrzeit',
    alarmDaysStreak: 'Tage kontinuierliche Therapietreue',
    alarmRingingHeader: 'ZEIT FÜR DIE MEDIKATION!',
    alarmRingingPrompt: 'Es ist Zeit für Ihre geplante Einnahme von',
    alarmSnoozeDismiss: 'Habe ich eingenommen ✓',
    alarmDualSmsTitle: 'Duale automatisierte SMS-Benachrichtigung',
    alarmDualSmsSubtitle: 'Sendet bei Alarmauslösung automatisch Echtzeit-SMS an Patient und Vormund.',
    alarmPatientTarget: 'Mobilnummer des Patienten',
    alarmGuardianTarget: 'Mobilnummer des Vormunds',
    alarmSendDualSmsBtn: 'Alarm auslösen & Dual-SMS senden',
    alarmSmsDispatchedToast: 'Duale SMS erfolgreich an Patient & Vormund versendet!',
    alarmSmsSentSuccess: 'SMS versendet & zugestellt',
    alarmSmsDelivered: 'Zugestellt über das HealthPulse SMS-Gateway',
    alarmSmsHistoryTitle: 'Echtzeit-SMS-Versandprotokoll',
    alarmEditContactsBtn: 'Nummern bearbeiten',
    alarmSaveContactsBtn: 'Nummern speichern',
    alarmContactsSavedToast: 'Benachrichtigungsnummern erfolgreich aktualisiert!',
    alarmSendWhatsAppPatient: 'WhatsApp an Patient senden',
    alarmSendWhatsAppGuardian: 'WhatsApp an Vormund senden',
    alarmSendSmsPatient: 'SMS an Patient senden',
    alarmSendSmsGuardian: 'SMS an Vormund senden',
    alarmAutoDispatchBoth: 'An beide Nummern senden (WhatsApp / SMS)',
    alarmRealMessageSuccess: 'Echtes Nachrichtenfenster geöffnet! Bitte überprüfen und absenden.',
    alarmNumberFormatHint: 'Tipp: Bitte gültige Mobilnummer mit Ländervorwahl eingeben.',

    emgTitle: '24x7 Akute Notfallmedizinische Versorgung',
    emgSubtitle: 'Direkte Notrufleitstelle, GPS-Rettungswagen-Ortung und Sofortanleitungen zur Lebensrettung.',
    emgNationalAmbulance: 'Rettungsdienst-Zentrale',
    emgUnifiedEmergency: 'Einheitlicher Notruf',
    emgCardiacHelpline: 'Kardiovaskuläres Notfalltelefon',
    emgPoisonControl: 'Giftnotruf-Zentrale',
    emgAmbulanceTracking: 'Echtzeit-GPS-Rettungswagen-Verfolgung',
    emgEtaMinutes: 'Voraussichtliche Eintreffzeit des Rettungsdienstes',
    emgDispatchSuccess: 'Rettungswagen wurde erfolgreich zu Ihrem Standort alarmiert!',

    telehealthTitle: 'Verschlüsselte Telemedizin-HD-Videosprechstunde',
    telehealthHipaa: 'HIPAA- & Telemedizin-konforme 256-Bit-Ende-zu-Ende-verschlüsselte Verbindung',
    telehealthEndCall: 'Sprechstunde beenden',
    telehealthCameraOn: 'Kamera ausschalten',
    telehealthCameraOff: 'Kamera einschalten',
    telehealthMicOn: 'Mikrofon stummschalten',
    telehealthMicMute: 'Mikrofon aktivieren',
    telehealthInCallChat: 'Klinischer Sprechstunden-Chat',
    telehealthTypeMessage: 'Nachricht an den behandelnden Arzt schreiben...',
    telehealthLiveWebcam: 'Live-HD-Webcam',
    telehealthScreenShare: 'Bildschirm / Befunde teilen',
    telehealthStopScreen: 'Bildschirmfreigabe beenden',
    telehealthVitalsHud: 'Patienten-Live-EKG & Vitaldatenmonitor',
    telehealthLiveCaptions: 'KI-Live-Untertitel (Captions)',
    telehealthSnapshot: 'Diagnostisches Foto aufnehmen',
    telehealthSnapshotTaken: 'Diagnostisches Foto aufgenommen und in der Patientenakte gespeichert!',
    telehealthCameraPermission: 'Kamerazugriff verweigert oder nicht verfügbar. Verschlüsselte HD-Kliniksimulation aktiv.',

    // ABHA Digital Health Card
    abhaCardTitle: 'Nationale Digitale Gesundheitskarte (ABHA / eGK)',
    abhaCardSubtitle: 'NDHM-verifizierte digitale Identitätskarte',
    abhaIdNumber: 'Gesundheits-ID-Nummer',
    abhaAddress: 'Persönliche ID-Adresse',
    abhaDownloadBtn: 'Offizielle Gesundheitskarte herunterladen',

    // AI Ambient Voice Scribe
    scribeTitle: 'KI-Klinik-Schreiber (Sprachdiktat zu E-Rezept)',
    scribeListening: 'Konsultation wird aufgezeichnet und in Rezeptdaten konvertiert...',
    scribeStartBtn: 'KI-Sprachdiktat starten',
    scribeStopBtn: 'Diktat beenden & auswerten',
    scribeSampleHint: 'Sprechen Sie: "Patient mit akuter Bronchitis. Verordne Azithromycin 500mg einmal täglich für 5 Tage."',

    // AI Medical Imaging & Radiology Viewer
    radiologyTitle: 'Diagnostische Radiologie & Bildgebungs-KI',
    radiologySubtitle: 'Deep-Learning-Computer-Vision zur automatisierten Analyse von Thorax- und MRT-Aufnahmen.',
    radiologyAiHeatmap: 'KI-Pathologie-Heatmap umschalten',
    radiologyConfidence: 'KI-Diagnose-Konfidenz',

    // Auth Page & Form Controls
    authWelcomeTitle: 'Willkommen bei HealthPulse',
    authCreateTitle: 'Erstellen Sie Ihr Konto',
    authSubtitle: 'Wählen Sie Ihre Rolle, um auf Ihr personalisiertes medizinisches Portal zuzugreifen',
    authPatientTab: 'Patient',
    authDoctorTab: 'Arzt',
    authAdminTab: 'Krankenhaus-Admin',
    authQuickFill: 'Schnelle Testanmeldedaten:',
    authFullName: 'Vollständiger Name',
    authDoctorName: 'Vollständiger Name des Arztes',
    authFullNamePlaceholder: 'z.B. Max Mustermann',
    authDoctorNamePlaceholder: 'z.B. Dr. Anna Schmidt',
    authEmail: 'E-Mail-Adresse',
    authAdminEmail: 'Offizielle Krankenhaus-E-Mail',
    authEmailPlaceholder: 'name@example.com',
    authPassword: 'Passwort',
    authPhone: 'Kontakttelefonnummer',
    authGuardianName: 'Name der Begleitperson / des Vormunds',
    authGuardianNamePlaceholder: 'z. B. Sarah Morgan (Eltern/Ehepartner/Pfleger)',
    authGuardianPhone: 'Notfall-Mobilnummer des Vormunds',
    authGuardianPhonePlaceholder: '+91 98765 43211',
    authGuardianPhoneHelp: 'Medikamenten-Alarme und wichtige Erinnerungen werden per SMS an diese Nummer gesendet.',
    authAge: 'Alter',
    authGender: 'Geschlecht',
    genderMale: 'Männlich',
    genderFemale: 'Weiblich',
    genderOther: 'Divers',
    authBloodGroup: 'Blutgruppe',
    authAllergies: 'Bekannte Allergien',
    authAllergiesPlaceholder: 'z.B. Penicillin, Erdnüsse (oder keine)',
    authSpecialty: 'Fachgebiet',
    authQualifications: 'Qualifikationen',
    authLicense: 'Approbation / Registrierungsnummer',
    authExperience: 'Erfahrung (Jahre)',
    authFee: 'Konsultationsgebühr (₹)',
    authHospitalAffiliation: 'Krankenhaus- / Klinikzugehörigkeit',
    authHospitalFacility: 'Name der Krankenhauseinrichtung',
    authSecurityKey: 'Admin-Hauptsicherheitsschlüssel',
    authSignInBtn: 'Anmelden beim',
    authRegisterBtn: 'Registrieren als',
    authPortalSuffix: 'Portal',
    authHaveAccount: 'Haben Sie bereits ein Konto?',
    authNeedAccount: 'Noch kein Konto?',
    authSignInLink: 'Anmelden',
    authCreateLink: 'Neues Konto erstellen',
    authComplianceFooter: 'HealthPulse Ultra • Konform mit NDHM-, HIPAA- und Telemedizin-Richtlinien',
    authFillRequired: 'Bitte füllen Sie alle erforderlichen Felder aus.',
    authEnterAdminKey: 'Bitte geben Sie einen Admin-Sicherheitsschlüssel ein.',
    authEnterBoth: 'Bitte geben Sie sowohl E-Mail als auch Passwort ein.',

    // General Shared Labels & Navigation
    selectLanguage: 'Sprache wählen',
    accountType: 'Konto',
    emailLabel: 'E-Mail',
    phoneLabel: 'Telefon',
    bloodLabel: 'Blut',
    ageLabel: 'Alter',
    emergency247: '24x7 Notfall-SOS',
    emergencyDial: 'Nationaler Notruf: 108 / 112 wählen',
    footerCompliance: 'HealthPulse Ultra Klinisches Krankenhaus-Managementsystem • Konform mit NDHM-, HIPAA- und Telemedizin-Richtlinien.',

    // Patient Dashboard Details
    verifiedMedicalRecord: 'Verifizierte Patientenakte',
    bloodGroupLabel: 'Blutgruppe',
    allergiesLabel: 'Allergien',
    noneRecorded: 'Keine erfasst',
    daysUnit: 'Tage',
    nextUpcomingConsult: 'Nächste bevorstehende Konsultation',
    waitingRoomOpen: 'Virtueller Warteraum geöffnet',
    reasonLabel: 'Grund',
    atTime: 'um',
    prescriptionsSubtitle: 'Offizielle ärztliche Rezepte mit PDF-Ausdruck.',
    noPrescriptions: 'Noch keine ärztlichen Rezepte ausgestellt.',
    noPrescriptionsSub: 'Von behandelnden Ärzten ausgestellte Rezepte erscheinen hier mit PDF-Download.',
    prescribedBy: 'Verschrieben von',
    onDate: 'am',
    drugsLabel: 'Medikamente',
    alarmsSubtitle: 'Browser-Web-Audio-Alarme und Adhärenz-Tracking.',
    manageAlarms: 'Alarme verwalten',
    noAlarms: 'Keine aktiven Medikamenten-Alarme.',
    addReminder: '+ Medikamentenerinnerung hinzufügen',
    takenCheck: 'Eingenommen ✓',
    viewLabReportsBtn: 'Diagnoselaborberichte anzeigen',
    exploreDiseaseDb: 'Krankheitsdatenbank erkunden',
    doctorsDirectorySubtitle: 'Buchen Sie sofortige Video- oder Klinikkonsultationen bei Fachärzten.',
    noDoctorsFound: 'Noch keine Ärzte für dieses Fachgebiet registriert.',
    noDoctorsFoundSub: 'Registrieren Sie einen Facharzt im Arzt-Portal, um ihn hier aufzulisten.',
    yearsExp: 'Jahre Erfahrung',
    consultation: 'Konsultation',
    allSpecialties: 'ALLE',

    // Doctor Dashboard Details
    clinicalSuite: 'Klinische Praxissuit',
    issuedBadge: 'Ausgestellt',
    telehealthClinic: 'Virtuelle Telemedizin-Klinik',
    patientQueueTab: 'Patientenkonsultationswarteschlange',
    prescriptionArchiveTab: 'E-Rezept-Archiv',
    todaysScheduleTitle: 'Heutiger Terminplan & Ambulanz-Warteschlange',
    noAppointmentsQueue: 'Keine Patiententermine in Ihrer Warteschlange.',
    noAppointmentsQueueSub: 'Wenn Patienten Konsultationen buchen, erscheinen sie hier sofort in Echtzeit.',
    chiefComplaints: 'Hauptbeschwerden',
    mode: 'Modus',
    startVideoCall: 'Videoanruf starten',
    markComplete: 'Konsultation als abgeschlossen markieren',
    issuedPrescriptionsTitle: 'Ausgestellte E-Rezepte',
    noDoctorPrescriptions: 'Noch keine Rezepte ausgestellt.',
    noDoctorPrescriptionsSub: "Verwenden Sie oben '+ E-Rezept ausstellen', um digitale Rezepte mit PDF-Ausdrucken zu erstellen.",
    diagnosisLabel: 'Diagnose',
    medicinesLabel: 'Medikamente',

    // Admin Dashboard Details
    bedAllocationSubtitle: 'Live-Krankenhausbettenbelegung über Intensivstation, Notaufnahme, Kardiologie und Normalstationen.',
    searchBedPlaceholder: 'Bett oder Patient suchen...',
    oxygenActive: 'O₂ Sauerstoffleitung aktiv',
    admittedLabel: 'Aufgenommen',
    readyForIntake: 'Bereit zur Patientenaufnahme',
    sanitationInProgress: 'Desinfektion läuft',
    dischargeAndSanitize: 'Entlassen & Desinfizieren',
    markAsReady: 'Als bereit markieren',
    allocatePatient: 'Patient zuweisen',
    invoicesSubtitle: 'Aktuelle Konsultations- und Apothekenrechnungen.',
    invoicesProcessed: 'Rechnungen verarbeitet',
    thInvoiceId: 'Rechnungs-ID',
    thPatientName: 'Patientenname',
    thDate: 'Datum',
    thPhysician: 'Behandelnder Arzt',
    thInsurance: 'Versicherungsanteil',
    thTotalPayable: 'Gesamtbetrag',
    thStatus: 'Status',

    // AI & Modals Extra
    aiAnalyzing: 'Klinische Symptomatik wird analysiert...',
    aiListening: 'Höre Ihre Stimme...',
    aiReadAloud: 'Vorlesen',
    aiReset: 'Zurücksetzen',
    aiYou: 'Sie',
    aiAssistantName: 'MediPulse KI-Assistent',
    aiAcuity: 'Schweregrad',
    aiBookSpecialist: 'Facharzt buchen',
    aiActive247: 'Rund um die Uhr aktiv',
    alarmAddCustom: 'Benutzerdefinierten Alarm hinzufügen',
    alarmCancel: 'Abbrechen',
    alarmNewTitle: 'Neuer geplanter Medikamentenalarm',
    alarmMedName: 'Medikamentenname',
    alarmDosage: 'Dosierung',
    alarmFrequency: 'Häufigkeit',
    alarmSave: 'Alarm speichern',
    alarmTakenToday: 'Heute eingenommen ✓',
    alarmActiveSchedule: 'Aktiver Medikamentenplan',
    vaultTitle: 'Noch keine Rezepte in Ihrem Tresor.',
    vaultSubtitle: 'Sobald Konsultationen abgeschlossen sind, erscheinen offizielle digitale Rezepte hier.',
    orderRx: 'Medikamente bestellen',
    openAlarmManager: 'Alarm-Manager öffnen',
    noActiveAlarms: 'Keine aktiven Alarme konfiguriert.',
    addFirstAlarm: '+ Ersten eigenen Alarm hinzufügen',
    streak: 'Serie',
    viewFullDetails: 'Vollständige Details anzeigen',
    askAiBot: 'KI-Bot fragen',

    // Specialties
    specCardiologist: 'Kardiologe',
    specNeurologist: 'Neurologe',
    specGeneralPhysician: 'Allgemeinarzt',
    specPulmonologist: 'Pneumologe',
    specDermatologist: 'Dermatologe',
    specOrthopedic: 'Orthopäde',
    specPediatrician: 'Kinderarzt',
    specGastroenterologist: 'Gastroenterologe',

    // Wards
    wardAll: 'ALLE',
    wardIcu: 'Intensivstation (ICU)',
    wardEmergency: 'Notaufnahme',
    wardCardiology: 'Kardiologiestation',
    wardGeneral: 'Normalstation',
    wardPostSurgical: 'Postoperativ'
  }
};
