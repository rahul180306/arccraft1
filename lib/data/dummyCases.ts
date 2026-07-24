/**
 * ArcCraft KSP Crime Database — Dummy Case Datasets
 * 
 * These 2 FIR records provide realistic test data matching the KSP CCTNS
 * Entity-Relationship schema. When the real dataset arrives, replace
 * these exports with database queries — the UI code stays identical.
 */

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface Person {
  personId: string;
  name: string;
  alias?: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  occupation?: string;
  address: string;
  phone?: string;
  aadhaarHash?: string;
  riskScore?: number;
  isRepeatOffender?: boolean;
  priorCases?: string[];
  photo?: string; // placeholder URL
}

export interface Evidence {
  evidenceId: string;
  type: 'Physical' | 'Digital' | 'Documentary' | 'Biological' | 'Financial';
  description: string;
  collectedBy: string;
  collectedAt: string; // ISO date
  location: string;
  chainOfCustody: string[];
  confidence?: number;
  status: 'Collected' | 'Under Analysis' | 'Verified' | 'Rejected';
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  source: string;
  type: 'incident' | 'evidence' | 'arrest' | 'statement' | 'forensic' | 'legal';
}

export interface FinancialTransaction {
  txnId: string;
  date: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  bank: string;
  type: 'UPI' | 'NEFT' | 'RTGS' | 'Cash' | 'ATM';
  suspicious: boolean;
  linkedPersonId?: string;
}

export interface WitnessStatement {
  statementId: string;
  witnessName: string;
  relation: string;
  dateRecorded: string;
  summary: string;
  credibilityScore: number; // 0–100
  contradictions?: string[];
}

export interface FIRCase {
  firNumber: string;
  policeStation: string;
  district: string;
  state: string;
  registrationDate: string;
  incidentDate: string;
  incidentTime: string;
  incidentLocation: string;
  coordinates: { lat: number; lng: number };
  crimeCategory: string;
  crimeSubCategory: string;
  sections: string[];
  modusOperandi: string;
  propertyLoss: string;
  propertyValue: number;
  status: 'Under Investigation' | 'Chargesheeted' | 'Closed' | 'Pending';
  investigatingOfficer: { name: string; rank: string; kgid: string };
  complainant: Person;
  accused: Person[];
  victims: Person[];
  evidence: Evidence[];
  timeline: TimelineEvent[];
  financialTrail: FinancialTransaction[];
  witnesses: WitnessStatement[];
  aiRiskScore: number;
  linkedCases?: string[];
}

// ──────────────────────────────────────────────
// FIR #1 — Anekal Commercial Burglary
// ──────────────────────────────────────────────

export const CASE_ANEKAL_BURGLARY: FIRCase = {
  firNumber: '104430006202600001',
  policeStation: 'Anekal Police Station',
  district: 'Bengaluru Urban',
  state: 'Karnataka',
  registrationDate: '2026-02-10T08:30:00+05:30',
  incidentDate: '2026-02-10',
  incidentTime: '02:14 AM',
  incidentLocation: 'Lakshmi Jewelry Store, Anekal Main Road, Anekal',
  coordinates: { lat: 12.8087, lng: 77.6961 },
  crimeCategory: 'Heinous Property Crime',
  crimeSubCategory: 'Night Commercial Burglary',
  sections: ['BNS Section 305 (Aggravated Theft)', 'BNS Section 331 (Night House-trespass)'],
  modusOperandi: 'Gas cutter safe breach, stolen hatchback getaway, night operation targeting jewelry store with no guards',
  propertyLoss: '₹45 Lakhs gold ornaments (22k, 18k)',
  propertyValue: 4500000,
  status: 'Chargesheeted',
  investigatingOfficer: { name: 'Inspector Arjun', rank: 'Inspector', kgid: 'KSP20180091' },
  complainant: {
    personId: 'V1',
    name: 'Ramesh Kumar',
    age: 52,
    gender: 'Male',
    occupation: 'Jewelry Store Owner',
    address: 'Anekal Main Road, Bengaluru-562106',
    phone: '9876543210',
  },
  accused: [
    {
      personId: 'A1',
      name: 'Suresh K.',
      alias: 'Chotte',
      age: 34,
      gender: 'Male',
      occupation: 'Unemployed',
      address: 'Jayanagar 4th Block, Bengaluru',
      phone: '9123456789',
      riskScore: 92,
      isRepeatOffender: true,
      priorCases: ['IPC 380 (2019)', 'IPC 457 (2021)', 'BNS 305 (2024)'],
    },
    {
      personId: 'A2',
      name: 'Manjunath V.',
      alias: 'Chinna',
      age: 28,
      gender: 'Male',
      occupation: 'Auto Driver',
      address: 'Electronic City Phase 2, Bengaluru',
      phone: '9988776655',
      riskScore: 68,
      isRepeatOffender: false,
      priorCases: [],
    },
  ],
  victims: [
    {
      personId: 'V1',
      name: 'Ramesh Kumar',
      age: 52,
      gender: 'Male',
      occupation: 'Jewelry Store Owner',
      address: 'Anekal Main Road, Bengaluru-562106',
    },
  ],
  evidence: [
    {
      evidenceId: 'EV-001',
      type: 'Digital',
      description: 'CCTV Exit Gate Camera #14 Frame 291 — Red Hatchback (KA-03-MN-4481) at 02:14 AM',
      collectedBy: 'SI Priya R.',
      collectedAt: '2026-02-10T06:30:00+05:30',
      location: 'Lakshmi Jewelry Store CCTV Server',
      chainOfCustody: ['SI Priya R.', 'FSL Bengaluru'],
      confidence: 96,
      status: 'Verified',
    },
    {
      evidenceId: 'EV-002',
      type: 'Biological',
      description: 'AFIS Latent Fingerprint Sample #FP-01 from safe door handle',
      collectedBy: 'FSL Forensic Team',
      collectedAt: '2026-02-10T07:45:00+05:30',
      location: 'Lakshmi Jewelry Store — Safe Room',
      chainOfCustody: ['FSL Team', 'Inspector Arjun'],
      confidence: 94.2,
      status: 'Verified',
    },
    {
      evidenceId: 'EV-003',
      type: 'Physical',
      description: 'Gas cutter tool set with serial number G-4421 recovered from suspect vehicle',
      collectedBy: 'HC Kavya',
      collectedAt: '2026-02-11T10:00:00+05:30',
      location: 'Suspect Vehicle (KA-03-MN-4481)',
      chainOfCustody: ['HC Kavya', 'Inspector Arjun', 'FSL Bengaluru'],
      confidence: 99,
      status: 'Verified',
    },
    {
      evidenceId: 'EV-004',
      type: 'Documentary',
      description: 'Witness Statement #02 — Neighbor claims suspects fled on a Blue Motorbike',
      collectedBy: 'ASI Ramesh',
      collectedAt: '2026-02-10T09:15:00+05:30',
      location: 'Anekal PS',
      chainOfCustody: ['ASI Ramesh'],
      confidence: 74,
      status: 'Rejected',
    },
    {
      evidenceId: 'EV-005',
      type: 'Digital',
      description: 'CDR analysis — Suspect mobile tower location matches Anekal at 02:14 AM',
      collectedBy: 'Cyber Cell',
      collectedAt: '2026-02-12T14:00:00+05:30',
      location: 'BTS Cell Tower Data',
      chainOfCustody: ['Cyber Cell', 'Inspector Arjun'],
      confidence: 91,
      status: 'Verified',
    },
  ],
  timeline: [
    { id: 'T1', timestamp: '2026-02-10T02:14:00', title: 'Break-in occurs', description: 'Suspects breach safe using gas cutters at Lakshmi Jewelry Store', source: 'CCTV Footage', type: 'incident' },
    { id: 'T2', timestamp: '2026-02-10T02:28:00', title: 'Suspects flee', description: 'Red hatchback KA-03-MN-4481 captured exiting via Gate Camera #14', source: 'CCTV Frame 291', type: 'incident' },
    { id: 'T3', timestamp: '2026-02-10T06:45:00', title: 'FIR Registered', description: 'Complainant Ramesh Kumar registers FIR at Anekal PS', source: 'CCTNS System', type: 'legal' },
    { id: 'T4', timestamp: '2026-02-10T07:45:00', title: 'Fingerprint collected', description: 'AFIS Latent FP #FP-01 lifted from safe door handle', source: 'FSL Team', type: 'forensic' },
    { id: 'T5', timestamp: '2026-02-10T09:15:00', title: 'Witness statement recorded', description: 'Neighbor reports blue motorbike (later overruled by CCTV)', source: 'ASI Ramesh', type: 'statement' },
    { id: 'T6', timestamp: '2026-02-11T10:00:00', title: 'Gas cutter seized', description: 'Tool serial G-4421 recovered from suspect vehicle', source: 'HC Kavya', type: 'evidence' },
    { id: 'T7', timestamp: '2026-02-15T11:30:00', title: 'Suspect arrested', description: 'Suresh K. apprehended at Jayanagar residence', source: 'Inspector Arjun', type: 'arrest' },
    { id: 'T8', timestamp: '2026-03-01T00:00:00', title: 'Chargesheet filed', description: 'CSID #501 filed by IO Inspector Arjun', source: 'Court Records', type: 'legal' },
  ],
  financialTrail: [
    { txnId: 'TXN-001', date: '2026-02-10', fromAccount: 'Cash', toAccount: 'Unknown Hawala', amount: 1500000, bank: 'N/A', type: 'Cash', suspicious: true, linkedPersonId: 'A1' },
    { txnId: 'TXN-002', date: '2026-02-11', fromAccount: 'SBI-908122', toAccount: 'PNB-334567', amount: 800000, bank: 'SBI', type: 'NEFT', suspicious: true, linkedPersonId: 'A1' },
  ],
  witnesses: [
    { statementId: 'WS-01', witnessName: 'Venkatesh R.', relation: 'Neighbor', dateRecorded: '2026-02-10', summary: 'Heard loud metallic cutting sounds around 2 AM. Saw two figures running toward main road.', credibilityScore: 85 },
    { statementId: 'WS-02', witnessName: 'Lakshmi Devi', relation: 'Shop adjacent owner', dateRecorded: '2026-02-10', summary: 'Claims suspects fled on a blue motorbike. However low night visibility and distance make this unreliable.', credibilityScore: 58, contradictions: ['CCTV shows red hatchback, not blue motorbike'] },
  ],
  aiRiskScore: 95.2,
  linkedCases: ['104440008202600002'],
};

// ──────────────────────────────────────────────
// FIR #2 — Mysuru ATM SIM Swap Cyber Fraud
// ──────────────────────────────────────────────

export const CASE_MYSURU_CYBERFRAUD: FIRCase = {
  firNumber: '104440008202600002',
  policeStation: 'Devaraja Police Station',
  district: 'Mysuru',
  state: 'Karnataka',
  registrationDate: '2026-02-18T10:00:00+05:30',
  incidentDate: '2026-02-18',
  incidentTime: '03:45 AM',
  incidentLocation: 'SBI ATM, Devaraja Mohalla, Mysuru',
  coordinates: { lat: 12.3052, lng: 76.6551 },
  crimeCategory: 'Cyber Crime',
  crimeSubCategory: 'ATM SIM Swap Financial Fraud',
  sections: ['BNS Section 318 (Cheating)', 'IT Act Section 66D (Identity Theft)', 'IT Act Section 43 (Unauthorized Access)'],
  modusOperandi: 'SIM swap attack via social engineering of telecom employee, followed by OTP interception and unauthorized fund transfers',
  propertyLoss: '₹18.5 Lakhs (electronic fund transfer)',
  propertyValue: 1850000,
  status: 'Under Investigation',
  investigatingOfficer: { name: 'PSI Priya R.', rank: 'Sub-Inspector', kgid: 'KSP20210456' },
  complainant: {
    personId: 'V2',
    name: 'Priya Sharma',
    age: 29,
    gender: 'Female',
    occupation: 'Software Engineer',
    address: 'VV Mohalla, Mysuru-570002',
    phone: '9845123456',
  },
  accused: [
    {
      personId: 'A1',
      name: 'Suresh K.',
      alias: 'Chotte',
      age: 34,
      gender: 'Male',
      occupation: 'Unemployed',
      address: 'Jayanagar 4th Block, Bengaluru',
      phone: '9123456789',
      riskScore: 92,
      isRepeatOffender: true,
      priorCases: ['IPC 380 (2019)', 'IPC 457 (2021)', 'BNS 305 (2024)', '104430006202600001'],
    },
    {
      personId: 'A3',
      name: 'Imran Khan',
      alias: undefined,
      age: 26,
      gender: 'Male',
      occupation: 'Telecom Shop Employee',
      address: 'Sayyaji Rao Road, Mysuru',
      phone: '9900112233',
      riskScore: 75,
      isRepeatOffender: false,
      priorCases: [],
    },
  ],
  victims: [
    {
      personId: 'V2',
      name: 'Priya Sharma',
      age: 29,
      gender: 'Female',
      occupation: 'Software Engineer',
      address: 'VV Mohalla, Mysuru-570002',
    },
  ],
  evidence: [
    {
      evidenceId: 'EV-101',
      type: 'Digital',
      description: 'SIM swap log from Airtel showing unauthorized SIM replacement on Feb 17',
      collectedBy: 'Cyber Cell Mysuru',
      collectedAt: '2026-02-19T11:00:00+05:30',
      location: 'Airtel Telecom Records',
      chainOfCustody: ['Cyber Cell', 'PSI Priya R.'],
      confidence: 98,
      status: 'Verified',
    },
    {
      evidenceId: 'EV-102',
      type: 'Financial',
      description: 'SBI Transaction log — ₹18.5L transferred from victim account to mule account SBI-908122',
      collectedBy: 'SBI Fraud Investigation',
      collectedAt: '2026-02-19T14:30:00+05:30',
      location: 'SBI Core Banking System',
      chainOfCustody: ['SBI', 'PSI Priya R.'],
      confidence: 100,
      status: 'Verified',
    },
    {
      evidenceId: 'EV-103',
      type: 'Digital',
      description: 'ATM CCTV — PersonID A1 seen withdrawing ₹2L from SBI ATM Devaraja Mohalla',
      collectedBy: 'SBI ATM Surveillance',
      collectedAt: '2026-02-19T16:00:00+05:30',
      location: 'SBI ATM, Devaraja Mohalla',
      chainOfCustody: ['SBI Security', 'PSI Priya R.'],
      confidence: 89,
      status: 'Verified',
    },
    {
      evidenceId: 'EV-104',
      type: 'Digital',
      description: 'WhatsApp chat screenshots between PersonID A1 and A3 discussing SIM swap plan',
      collectedBy: 'Cyber Forensics Lab',
      collectedAt: '2026-02-22T09:00:00+05:30',
      location: 'Seized Mobile Device IMEI-356938',
      chainOfCustody: ['Cyber Forensics', 'PSI Priya R.'],
      confidence: 95,
      status: 'Verified',
    },
  ],
  timeline: [
    { id: 'T10', timestamp: '2026-02-17T14:00:00', title: 'SIM swap executed', description: 'Imran Khan uses telecom access to issue duplicate SIM for victim phone number', source: 'Airtel Records', type: 'incident' },
    { id: 'T11', timestamp: '2026-02-18T03:45:00', title: 'Fund transfer initiated', description: '₹18.5L transferred from victim SBI account using intercepted OTPs', source: 'SBI Transaction Log', type: 'incident' },
    { id: 'T12', timestamp: '2026-02-18T04:10:00', title: 'ATM withdrawal', description: 'Suresh K. withdraws ₹2L from SBI ATM Devaraja Mohalla', source: 'ATM CCTV', type: 'incident' },
    { id: 'T13', timestamp: '2026-02-18T10:00:00', title: 'FIR registered', description: 'Priya Sharma files complaint at Devaraja PS', source: 'CCTNS System', type: 'legal' },
    { id: 'T14', timestamp: '2026-02-19T11:00:00', title: 'SIM swap confirmed', description: 'Airtel confirms unauthorized SIM replacement', source: 'Cyber Cell', type: 'evidence' },
    { id: 'T15', timestamp: '2026-02-22T09:00:00', title: 'WhatsApp evidence seized', description: 'Chat logs between A1 and A3 recovered from seized phone', source: 'Cyber Forensics', type: 'evidence' },
  ],
  financialTrail: [
    { txnId: 'TXN-101', date: '2026-02-18', fromAccount: 'SBI-445566 (Victim)', toAccount: 'SBI-908122 (Mule)', amount: 1850000, bank: 'SBI', type: 'NEFT', suspicious: true, linkedPersonId: 'A1' },
    { txnId: 'TXN-102', date: '2026-02-18', fromAccount: 'SBI-908122 (Mule)', toAccount: 'ATM Withdrawal', amount: 200000, bank: 'SBI', type: 'ATM', suspicious: true, linkedPersonId: 'A1' },
    { txnId: 'TXN-103', date: '2026-02-18', fromAccount: 'SBI-908122 (Mule)', toAccount: 'UPI-9900112233@ybl', amount: 150000, bank: 'SBI', type: 'UPI', suspicious: true, linkedPersonId: 'A3' },
  ],
  witnesses: [
    { statementId: 'WS-10', witnessName: 'Ravi Shankar', relation: 'Airtel Store Manager', dateRecorded: '2026-02-20', summary: 'Confirms Imran Khan had access to SIM issuance system and was on duty Feb 17.', credibilityScore: 92 },
  ],
  aiRiskScore: 87.5,
  linkedCases: ['104430006202600001'],
};

// ──────────────────────────────────────────────
// Aggregated Exports
// ──────────────────────────────────────────────

export const ALL_CASES: FIRCase[] = [CASE_ANEKAL_BURGLARY, CASE_MYSURU_CYBERFRAUD];

export const ALL_ACCUSED: Person[] = [
  ...CASE_ANEKAL_BURGLARY.accused,
  ...CASE_MYSURU_CYBERFRAUD.accused.filter(a => !CASE_ANEKAL_BURGLARY.accused.some(b => b.personId === a.personId)),
];

export const LINKED_SUSPECT = CASE_ANEKAL_BURGLARY.accused[0]; // Suresh K. — cross-case linked

// Dashboard summary metrics
export const DASHBOARD_METRICS = {
  totalFIRs: 2,
  activeCases: 1,
  chargesheeted: 1,
  totalAccused: 3,
  totalVictims: 2,
  totalEvidence: 9,
  totalPropertyLoss: CASE_ANEKAL_BURGLARY.propertyValue + CASE_MYSURU_CYBERFRAUD.propertyValue,
  avgAIConfidence: 95.2,
  repeatOffenders: 1,
  linkedCaseClusters: 1,
  crimeHotspots: ['Anekal, Bengaluru', 'Devaraja Mohalla, Mysuru'],
};
