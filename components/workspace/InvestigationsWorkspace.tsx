'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { pageContainerVariants, pageItemVariants } from '@/lib/motion';
import { useUIStore } from '@/lib/stores/uiStore';
import GoogleTasksPanel from '@/components/workspace/GoogleTasksPanel';
import EvidenceLockerWorkspace from '@/components/workspace/EvidenceLockerWorkspace';
import VideoAnalysisWorkspace from '@/components/workspace/VideoAnalysisWorkspace';
import InvestigationReplayWorkspace from '@/components/workspace/InvestigationReplayWorkspace';
import {
  Folder,
  ChevronDown,
  Share2,
  MoreHorizontal,
  Plus,
  CheckCircle2,
  Clock,
  Circle,
  FileText,
  Video,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  UserCheck,
  Phone,
  Upload,
  MessageSquare,
  FileSpreadsheet,
  Presentation,
  FileCode,
  ListFilter,
  Pencil,
  Eye,
  ShieldAlert,
  Mic,
  Camera,
  Layers,
  MapPin,
  Calendar,
  Search,
  ExternalLink,
  CheckSquare,
  Square,
  AlertCircle,
  Tag,
  X,
  Send,
  Play,
  ShieldCheck,
  HardDrive,
  BarChart3,
  Filter,
  Download,
  User,
  FileCheck,
  RefreshCw,
  Hash,
  Lock,
  Volume2,
  Pause,
  Printer,
  FileDown,
  Building,
  Scale,
  Award,
  AlertTriangle,
  FileArchive,
  Paperclip,
  Check,
  Zap,
  HelpCircle,
  Maximize2,
  Flame,
  ArrowUpRight
} from 'lucide-react';

// --- DATA TYPES & MOCK DATA FOR MULTI-CASE WORKSPACE ---
interface CaseItem {
  id: string;
  firNumber: string;
  title: string;
  sections: string;
  registeredDate: string;
  daysActive: number;
  lastUpdated: string;
  station: string;
  crimeType: string;
  ioName: string;
  location: string;
  status: string;
  priority: 'High' | 'Medium' | 'Low';
  sensitivity: string;
  caseValue: string;
  stolenValue: string;
  progress: number;
  tags: string[];
  pendingTasksCount: number;
  urgentTasksCount: number;
}

const CASES_DATA: Record<string, CaseItem> = {
  'KRP/2026/0456': {
    id: 'KRP/2026/0456',
    firNumber: 'FIR KRP/2026/0456',
    title: 'Armed House Burglary & Jewellery Theft',
    sections: 'IPC 457, 380, 411 (BNS 331, 305)',
    registeredDate: '16 Jul 2025, 10:02 AM',
    daysActive: 8,
    lastUpdated: 'Updated 12m ago by Inspector Arjun',
    station: 'KR Puram Police Station, Bengaluru',
    crimeType: 'House Burglary',
    ioName: 'Inspector Arjun Kumar',
    location: 'Anekal Main Road, KR Puram, Bengaluru',
    status: 'ACTIVE',
    priority: 'High',
    sensitivity: 'Level 2 Confidential',
    caseValue: '₹ 12,45,000',
    stolenValue: '₹ 8,75,000',
    progress: 78,
    tags: ['Burglary', 'Night Crime', 'CCTV Available', 'Forensics Matched'],
    pendingTasksCount: 5,
    urgentTasksCount: 2
  },
  'MYS/2026/0082': {
    id: 'MYS/2026/0082',
    firNumber: 'FIR MYS/2026/0082',
    title: 'Multi-State SIM-Swap Financial Cyber Fraud',
    sections: 'IT Act Sec 66C, 66D, IPC 420 (BNS 318)',
    registeredDate: '10 Jul 2025, 02:30 PM',
    daysActive: 14,
    lastUpdated: 'Updated 1h ago by SI Priya',
    station: 'Cyber Crime PS, Mysuru',
    crimeType: 'Cyber Financial Fraud',
    ioName: 'Inspector Priya Sharma',
    location: 'Devaraja Urs Road, Mysuru',
    status: 'UNDER REVIEW',
    priority: 'High',
    sensitivity: 'Level 1 High Security',
    caseValue: '₹ 45,00,000',
    stolenValue: '₹ 42,30,000',
    progress: 62,
    tags: ['Cyber Crime', 'SIM Swap', 'Mule Accounts', 'Inter-State Gang'],
    pendingTasksCount: 8,
    urgentTasksCount: 4
  },
  'HAL/2026/0119': {
    id: 'HAL/2026/0119',
    firNumber: 'FIR HAL/2026/0119',
    title: 'Commercial Electronics Cargo Highway Hijack',
    sections: 'IPC 395, 397, 365 (BNS 310, 311)',
    registeredDate: '02 Jul 2025, 11:15 PM',
    daysActive: 22,
    lastUpdated: 'Updated 3h ago by ACP Gowda',
    station: 'HAL Airport PS, Bengaluru',
    crimeType: 'Highway Dacoity',
    ioName: 'ACP Rajesh Gowda',
    location: 'Old Airport Road Underpass, Bengaluru',
    status: 'ACTIVE',
    priority: 'High',
    sensitivity: 'Level 2 Confidential',
    caseValue: '₹ 85,00,000',
    stolenValue: '₹ 85,00,000',
    progress: 89,
    tags: ['Dacoity', 'Cargo Theft', 'GPS Tracking', 'Weapon Seized'],
    pendingTasksCount: 3,
    urgentTasksCount: 1
  }
};

export default function InvestigationsWorkspace() {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const openCopilot = useUIStore((s) => s.openCopilot);
  const showToast = useUIStore((s) => s.showToast);

  // Active Multi-Case selection
  const [activeCaseId, setActiveCaseId] = useState<string>('KRP/2026/0456');
  const [showCaseSelectorMenu, setShowCaseSelectorMenu] = useState(false);

  // Current Active Case Data
  const currentCase = CASES_DATA[activeCaseId] || CASES_DATA['KRP/2026/0456'];

  const caseSummary = `FIR ${currentCase.firNumber} describes a night-time armed burglary in KR Puram followed by the theft of 120 grams of gold and a suspicious getaway on scooter KA-03-MN-4481. CCTV evidence and FSL AFIS fingerprint results strongly link suspect Suresh K. to the scene, while a high-confidence alibi contradiction is now the priority to close. Key investigative work remains on CDR verification, financial trail linkage, and vehicle ownership proof. This summary updates automatically as evidence and witness records are added.`;

  // Active Navigation Tab inside Investigation Workspace
  const [activeTab, setActiveTab] = useState('Overview');

  // Search & Filter State (P0)
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Records');
  const [evidenceCategoryFilter, setEvidenceCategoryFilter] = useState('All');
  const [selectedRecommendationId, setSelectedRecommendationId] = useState('rec_1');

  const recommendations = [
    {
      id: 'rec_1',
      title: 'Secure CDR for tower sector 4082',
      confidence: '91%',
      why: 'Strongly links accused movement to the KR Puram underpass exit time.',
      details: [
        'CCTV Exit Gate video E-01 shows scooter at 11:42 PM.',
        'Suspect alibi claims Hoskote presence at 11:30 PM.',
        'Tower 4082 covers the getaway route and nearby suspect location.'
      ]
    },
    {
      id: 'rec_2',
      title: 'Verify pawn shop ledger against recovered gold',
      confidence: '84%',
      why: 'Connects recovered jewelry with Srinivas V. and potential fencing ring.',
      details: [
        'Recovered gold bangles listed in Sec 27 recovery notes.',
        'Srinivas V. admitted receiving items the morning after burglary.',
        'Pawn shop records would show the exact sale chain and time.'
      ]
    },
    {
      id: 'rec_3',
      title: 'Confirm vehicle ownership records for KA-03-MN-4481',
      confidence: '78%',
      why: 'Proves the getaway scooter is linked to the accused or a co-conspirator.',
      details: [
        'Getaway scooter appears in CCTV and witness statement.',
        'Vehicle evidence is currently photo-only, not registration-backed.',
        'Ownership records would solidify suspect connection to escape route.'
      ]
    }
  ];

  const selectedRecommendation = recommendations.find((rec) => rec.id === selectedRecommendationId) || recommendations[0];

  const caseActionChips = ['Summarize Case', 'Find Contradictions', 'Show Similar Cases', 'Generate Chargesheet', 'Find Missing Evidence'];

  const statutoryDeadlineDays = 2;
  const legalReadinessWeight = statutoryDeadlineDays <= 3 ? 0.3 : 0.25;

  const healthMetrics = [
    {
      label: 'Evidence Strength',
      value: 86,
      color: 'text-emerald-400',
      weight: 0.3,
      description:
        'Verified CCTV, AFIS fingerprint match, and recovered stolen property compose the core evidence portfolio.'
    },
    {
      label: 'Lead Confidence',
      value: 91,
      color: 'text-purple-400',
      weight: 0.25,
      description:
        'Primary lead is strong and corroborated by surveillance timestamps, witness placement, and suspect movement analysis.'
    },
    {
      label: 'Legal Readiness',
      value: 74,
      color: 'text-[#FF5A1F]',
      weight: legalReadinessWeight,
      description:
        'Chargesheet documentation: 8/12 complete. Missing: FSL forensic report (overdue), 1 witness statement pending signature.'
    },
    {
      label: 'Witness Reliability',
      value: 79,
      color: 'text-cyan-400',
      weight: 0.15,
      description:
        'Most witness statements have high reliability, but one secondary witness still requires a signed formal statement.'
    }
  ];
  const [previousHealthMetrics] = useState<Record<string, number>>({
    'Evidence Strength': 80,
    'Lead Confidence': 88,
    'Legal Readiness': 76,
    'Witness Reliability': 74
  });
  const [activeHealthDetail, setActiveHealthDetail] = useState<string | null>(null);
  const [showHealthFormula, setShowHealthFormula] = useState(false);

  const healthScore = Math.round(
    healthMetrics.reduce((sum, metric) => sum + metric.value * metric.weight, 0)
  );
  const healthFormula = `${healthMetrics
    .map((metric) => `${metric.label} (${Math.round(metric.weight * 100)}%)`)
    .join(' + ')} = ${healthScore}%`;
  const bottleneckValue = Math.min(...healthMetrics.map((metric) => metric.value));
  const deadlineWarning = healthMetrics.some(
    (metric) => metric.label === 'Legal Readiness' && metric.value < 80 && statutoryDeadlineDays <= 3
  );

  const similarCases = [
    {
      title: 'FIR MYS/2026/0082',
      similarity: '86%',
      reason: 'SIM-swap gang, shared getaway scooter MO, high-value cash movement.'
    },
    {
      title: 'FIR HAL/2026/0119',
      similarity: '74%',
      reason: 'Night burglary with vehicle escape and coordinated loot transfer.'
    }
  ];
  const statutoryDeadlineText = `Chargesheet filing deadline in ${statutoryDeadlineDays} days under BNSS Section 193.`;

  // Case Status Dropdown state
  const [caseStatus, setCaseStatus] = useState(currentCase.status);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  // Top Add New Item Dropdown / Modal state
  const [showAddNewMenu, setShowAddNewMenu] = useState(false);
  const [activeAddNewModalTab, setActiveAddNewModalTab] = useState<'Evidence' | 'Witness' | 'Suspect' | 'Task' | 'FSL' | 'Chargesheet' | 'Note' | null>(null);

  // --- STATE FOR WITNESSES ---
  const [witnesses, setWitnesses] = useState([
    {
      id: 'W1',
      name: 'Ramesh Babu',
      role: 'Eyewitness (Neighbor)',
      phone: '+91 98450 67890',
      credibility: 'High Credibility',
      riskCategory: 'High Reliability',
      sec161Status: 'Recorded',
      dateRecorded: '16 Jul 2025',
      statementText: 'I saw a dark blue two-wheeler (KA-03-MN-4481) parked outside the compound wall around 11:30 PM with lights turned off. Two men wearing jackets jumped over.',
      hasAudio: true,
      audioDuration: '04:12'
    },
    {
      id: 'W2',
      name: 'HC Kavya S.',
      role: 'Complainant / First Officer',
      phone: '+91 98450 12345',
      credibility: 'Verified Officer',
      riskCategory: 'Verified',
      sec161Status: 'Recorded',
      dateRecorded: '16 Jul 2025',
      statementText: 'Received emergency control room dispatch at 11:50 PM. Reached site at 12:08 AM. Found main lock broken with iron crowbar lying near entryway.',
      hasAudio: true,
      audioDuration: '06:45'
    },
    {
      id: 'W3',
      name: 'Srinivas V.',
      role: 'Jewellery Pawn Shop Owner',
      phone: '+91 98450 33445',
      credibility: 'Under Scrutiny',
      riskCategory: 'Hostile Risk',
      sec161Status: 'Pending Signature',
      dateRecorded: '17 Jul 2025',
      statementText: 'Offered gold bangles for quick cash sale without hallmark certification on 16th morning. Kept items under shop counter.',
      hasAudio: false,
      audioDuration: '00:00'
    },
    {
      id: 'W4',
      name: 'Dr. Mohan Reddy',
      role: 'FSL Forensic Expert',
      phone: '+91 98450 99112',
      credibility: 'Verified Expert',
      riskCategory: 'Verified',
      sec161Status: 'Recorded',
      dateRecorded: '18 Jul 2025',
      statementText: 'Latent fingerprint FP_Sample_01 lifted from window latch yields 12 minutiae match points with habitual offender Suresh K. (PersonID A1).',
      hasAudio: true,
      audioDuration: '03:30'
    }
  ]);

  const [selectedWitnessModal, setSelectedWitnessModal] = useState<typeof witnesses[0] | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // --- STATE FOR ACCUSED / SUSPECTS ---
  const [accusedList, setAccusedList] = useState([
    {
      id: 'A1',
      name: 'Suresh K. alias "Spider Suresh"',
      role: 'Prime Accused (House Breaker)',
      custodyStatus: 'In Police Custody (7-Day Remand)',
      riskBadge: '🔴 High Flight Risk',
      priorsCount: 5,
      sec27Recovery: 'Gold Bangles (120g) & Crowbar Recovered',
      alibiScore: 'Falsified (CCTV Contradiction)',
      photo: undefined,
      moTags: ['Night Burglary', 'Crowbar Lock Snap', 'Helmet Concealment'],
      interrogationSummary: 'Admitted entering rear balcony window using iron crowbar. Disclosed hiding stolen gold ornaments with receiver Srinivas V. near Commercial Street.'
    },
    {
      id: 'A2',
      name: 'Naveen J. alias "Chotta Naveen"',
      role: 'Co-Accused / Driver',
      custodyStatus: 'Judicial Remand (Parappana Agrahara)',
      riskBadge: '🟠 Moderate Risk',
      priorsCount: 2,
      sec27Recovery: 'Getaway Scooter KA-03-MN-4481 Seized',
      alibiScore: 'Unverified',
      photo: undefined,
      moTags: ['Getaway Rider', 'Lookout Specialist'],
      interrogationSummary: 'Drove getaway vehicle. Stood guard outside residential gate for 20 minutes monitoring police patrol beat movements.'
    },
    {
      id: 'A3',
      name: 'Mahesh P.',
      role: 'Suspected Receiver of Stolen Property',
      custodyStatus: 'Notice Issued (Sec 41A CrPC)',
      riskBadge: '🟡 Under Surveillance',
      priorsCount: 1,
      sec27Recovery: 'Pending Search Warrant',
      alibiScore: 'Under Verification',
      photo: undefined,
      moTags: ['Pawn Shop Fencing'],
      interrogationSummary: 'Claims lack of awareness regarding stolen origin of pledged items. Financial audit of pawn records in progress.'
    }
  ]);

  const [selectedAccusedModal, setSelectedAccusedModal] = useState<typeof accusedList[0] | null>(null);

  // --- STATE FOR EVIDENCE LOCKER ---
  const [evidenceItems] = useState([
    {
      id: 'E-01',
      title: 'CCTV_Exit_Gate_1080p.mp4',
      category: 'CCTV Video',
      type: 'Video • 450 MB',
      badge: '00:45',
      img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=300&q=80',
      isVideo: true,
      uploader: 'ASI Ramesh',
      uploaderAvatar: 'AR',
      timestamp: '17 Jul 2025, 01:40 PM',
      custodyBadge: 'SHA-256 Verified • Malkhana Rack B-4'
    },
    {
      id: 'E-02',
      title: 'FP_Sample_01_Lifted.png',
      category: 'Forensics',
      type: 'Image • 2.4 MB',
      img: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=300&q=80',
      uploader: 'HC Kavya',
      uploaderAvatar: 'HK',
      timestamp: '16 Jul 2025, 11:30 AM',
      custodyBadge: 'SHA-256 Verified • FSL Lab Box #12'
    },
    {
      id: 'E-03',
      title: 'Vehicle_KA03MN4481_Scooter.jpg',
      category: 'Photos',
      type: 'Image • 1.2 MB',
      img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&q=80',
      uploader: 'SI Naveen',
      uploaderAvatar: 'NJ',
      timestamp: '17 Jul 2025, 04:45 PM',
      custodyBadge: 'Seized Yard • Slot #08'
    },
    {
      id: 'E-04',
      title: 'Crowbar_Seized_P1.jpg',
      category: 'Weapons',
      type: 'Physical Weapon • 1.8 MB',
      img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80',
      uploader: 'Inspector Arjun',
      uploaderAvatar: 'AK',
      timestamp: '16 Jul 2025, 11:20 AM',
      custodyBadge: 'SHA-256 Verified • Malkhana Rack A-1'
    },
    {
      id: 'E-05',
      title: 'Gold_Items_Recovered_120g.jpg',
      category: 'Photos',
      type: 'Valuables • 2.1 MB',
      img: 'https://images.unsplash.com/photo-1611591475281-a1d9a04a08bc?auto=format&fit=crop&w=300&q=80',
      uploader: 'ASI Ramesh',
      uploaderAvatar: 'AR',
      timestamp: '17 Jul 2025, 05:10 PM',
      custodyBadge: 'Bank Vault Deposit #44'
    }
  ]);

  const evidenceCategorySet = new Set(evidenceItems.map((item) => item.category));
  const missingEvidence = [
    { label: 'CDR Records', present: evidenceCategorySet.has('CCTV Video') },
    { label: 'Forensics Reports', present: evidenceCategorySet.has('Forensics') },
    { label: 'Financial Records', present: evidenceItems.some((item) => /Bank|NEFT|UPI|Financial|Transaction/i.test(item.title)) },
    { label: 'Vehicle Ownership Records', present: evidenceItems.some((item) => /Scooter|Vehicle|KA-03|Registration/i.test(item.title)) },
    { label: 'DNA / Forensic Biology', present: false }
  ];

  // --- STATE FOR TIMELINE ---
  const [timelineEvents, setTimelineEvents] = useState([
    { id: 'E1', title: 'Crime Occurred & Alarm Triggered', timestamp: '15 Jul 2025, 11:45 PM', category: 'FIR & Legal', officer: 'KR Puram Control Room', desc: 'Armed entry into residential building via balcony door. House alarm bypassed.', icon: Camera, color: 'text-red-500 bg-red-500/10' },
    { id: 'E2', title: 'FIR KRP/2026/0456 Formally Registered', timestamp: '16 Jul 2025, 10:02 AM', category: 'FIR & Legal', officer: 'SI Naveen', desc: 'FIR registered under IPC 457, 380 upon complaint by homeowner.', icon: FileText, color: 'text-[#FF5A1F] bg-[#FF5A1F]/10' },
    { id: 'E3', title: 'Spot Panchanama & Scene Examination', timestamp: '16 Jul 2025, 11:15 AM', category: 'Forensics & FSL', officer: 'Inspector Arjun', desc: 'Forensic team collected latent fingerprints and seized bent crowbar P1.', icon: Camera, color: 'text-emerald-500 bg-emerald-500/10' },
    { id: 'E4', title: 'CCTV Exit Gate Video Secured', timestamp: '16 Jul 2025, 01:40 PM', category: 'CCTV & Surveillance', officer: 'HC Kavya', desc: '45-second high-resolution video extracted showing getaway scooter KA-03-MN-4481.', icon: Video, color: 'text-purple-500 bg-purple-500/10' },
    { id: 'E5', title: 'Suspect Suresh K. Apprehended & Arrested', timestamp: '17 Jul 2025, 04:30 PM', category: 'Arrest & Custody', officer: 'ASI Ramesh', desc: 'Accused apprehended at Hoskote Checkpost. Seized 120g stolen gold bangles under Sec 27.', icon: UserCheck, color: 'text-blue-500 bg-blue-500/10' },
    { id: 'E6', title: 'FSL AFIS Fingerprint Match Confirmed', timestamp: '18 Jul 2025, 02:15 PM', category: 'Forensics & FSL', officer: 'Dr. Mohan Reddy (FSL)', desc: '100% AFIS minutiae match with Suresh K. fingerprint profile.', icon: ShieldCheck, color: 'text-emerald-500 bg-emerald-500/10' },
    { id: 'E7', title: 'Form 173 Final Chargesheet Draft Generated', timestamp: '19 Jul 2025, 09:00 AM', category: 'FIR & Legal', officer: 'ArcCraft AI System', desc: 'Automated legal chargesheet compiled with evidence matrix and witness list.', icon: Scale, color: 'text-purple-500 bg-purple-500/10' }
  ]);

  const [timelineFilter, setTimelineFilter] = useState('All');
  const [showAddTimelineModal, setShowAddTimelineModal] = useState(false);
  const [newTimelineTitle, setNewTimelineTitle] = useState('');
  const [newTimelineTime, setNewTimelineTime] = useState('');
  const [newTimelineCat, setNewTimelineCat] = useState('FIR & Legal');
  const [newTimelineDesc, setNewTimelineDesc] = useState('');

  // --- STATE FOR REPORTS ---
  const [reportsList] = useState([
    {
      id: 'R1',
      title: 'First Information Report (Form 1 - Sec 154 CrPC)',
      docNo: 'KRP-FIR-2026-0456',
      date: '16 Jul 2025',
      author: 'Sub-Inspector Naveen J.',
      type: 'FIR Document',
      status: 'Signed & Certified',
      previewContent: `KARNATAKA STATE POLICE - FORM NO. 1
FIR No: KRP/2026/0456 | Date & Time: 16-07-2025 10:02 AM
District: Bengaluru City | Police Station: KR Puram
Complainant: HC Kavya S. (W/o S. Kumar)
Acts & Sections: IPC 457, 380, 411 (BNS 331, 305)

Brief Facts:
On 15-07-2025 at approximately 23:45 hrs, unknown perpetrators committed housebreaking by night at Premises No. 42, Anekal Main Road, KR Puram. Stolen property includes 120 grams of 24K Gold Ornaments valued at ₹ 8,75,000 and ₹ 3,70,000 cash.

Investigating Officer: Inspector Arjun Kumar (PID #88492)`
    },
    {
      id: 'R2',
      title: 'Spot Panchanama & Scene Inspection Memo (Sec 100 CrPC)',
      docNo: 'PAN-KRP-2026-0091',
      date: '16 Jul 2025',
      author: 'Inspector Arjun Kumar',
      type: 'Panchanama',
      status: 'Verified by Panchas',
      previewContent: `SPOT PANCHANAMA (CRIME SCENE EXAMINATION MEMO)
In the presence of Panchas:
1. Ramesh Babu, S/o Venkatesh (Aged 44 yrs)
2. Suresh Chandra, S/o Ramappa (Aged 39 yrs)

Observations:
1. Main entry latch snapped forcefully using mechanical leverage.
2. Heavy iron crowbar (Length: 2.5 ft, Weight: 3.2 kg) recovered near balcony entryway.
3. Latent finger impressions lifted from rear glass pane (Exhibits A1 to A4).
4. Physical seizure memo drawn on site in presence of Panchas.`
    },
    {
      id: 'R3',
      title: 'Property Seizure Panchanama (PF 93 / Sec 102 CrPC)',
      docNo: 'PF-KRP-2026-0122',
      date: '17 Jul 2025',
      author: 'ASI Ramesh',
      type: 'Seizure Memo',
      status: 'Deposited in Malkhana',
      previewContent: `PROPERTY SEIZURE MEMO (FORM PF 93)
Case FIR No: KRP/2026/0456

Seized Items:
1. Gold Bangles (4 Nos, Weight: 120 grams) - Recovered from suspect Suresh K. under Sec 27 Evidence Act.
2. Two-wheeler Scooter (TVS Jupiter, Reg No: KA-03-MN-4481) - Used in commission of crime.
3. Heavy Iron Crowbar (Exhibit P1).

Chain of Custody Certificate attached with SHA-256 digital hash verification.`
    },
    {
      id: 'R4',
      title: 'FSL Forensic Chemical & Fingerprint Evaluation Report',
      docNo: 'FSL-BLR-2025-9981',
      date: '18 Jul 2025',
      author: 'Dr. Mohan Reddy (Director FSL)',
      type: 'FSL Report',
      status: 'Conclusive Match',
      previewContent: `FORENSIC SCIENCE LABORATORY (FSL) REPORT
Government of Karnataka, Madiwala, Bengaluru

Exhibit Received: Exhibit A1 (Latent Fingerprint from Crime Scene)
Reference Fingerprint: Suresh K. (PersonID A1, Crime Records Bureau)

AFIS Analysis Result:
Automated Fingerprint Identification System (AFIS) scan confirmed 12 ridge characteristic minutiae matches between Exhibit A1 and Reference Fingerprint A1. Probability of error: < 0.0001%.`
    },
    {
      id: 'R5',
      title: 'Form 173 Final Legal Chargesheet (Draft)',
      docNo: 'CS-KRP-2026-0045',
      date: '19 Jul 2025',
      author: 'ArcCraft AI & Inspector Arjun',
      type: 'Chargesheet',
      status: 'Draft Complete',
      previewContent: `FINAL REPORT UNDER SECTION 173 CrPC (CHARGESHEET)
In the Court of Hon'ble 10th ACMM, Bengaluru

FIR No: KRP/2026/0456 | Police Station: KR Puram
Accused Persons:
1. Suresh K. (A1) - In Custody
2. Naveen J. (A2) - In Custody

Evidence Summary:
1. 100% Forensic AFIS Fingerprint Match (FSL Report #9981).
2. CCTV Footages from 2 intersection cameras showing KA-03-MN-4481.
3. Sec 27 Evidence Act Recovery of 120g Gold from A1 disclosure.

Prosecution Recommendation: Charge accused under IPC 457, 380, 411 read with Sec 34.`
    }
  ]);

  const [selectedReportModal, setSelectedReportModal] = useState<typeof reportsList[0] | null>(null);

  // --- STATE FOR NOTES (CASE DIARY FORM 67) ---
  const [caseNotes, setCaseNotes] = useState([
    {
      id: 'N1',
      author: 'Inspector Arjun',
      designation: 'Investigating Officer',
      timestamp: '19 Jul 2025, 08:30 AM',
      category: 'Field Direction',
      content: 'Instructed ASI Ramesh to produce accused Suresh K. before Magistrate for extension of police custody by 3 days to complete recovery of remaining cash amount.',
      hasAudio: false,
      audioDuration: ''
    },
    {
      id: 'N2',
      author: 'Sub-Inspector Naveen',
      designation: 'Assisting Officer',
      timestamp: '18 Jul 2025, 04:15 PM',
      category: 'Interrogation Note',
      content: 'Interrogated receiver Srinivas V. at shop premises. Admitted receiving gold items from Suresh K. on 16th morning without receipt. Issued Sec 41A notice.',
      hasAudio: true,
      audioDuration: '02:15'
    },
    {
      id: 'N3',
      author: 'ArcCraft Copilot AI',
      designation: 'AI Intelligence Unit',
      timestamp: '17 Jul 2025, 11:20 AM',
      category: 'Automated Insight',
      content: 'Pattern Analysis: Vehicle registration KA-03-MN-4481 was previously cited in FIR #104440008202600002 (SIM-Swap scam getaway in Mysuru). Linkage score: 94.8%.',
      hasAudio: false,
      audioDuration: ''
    }
  ]);

  const [newNoteInput, setNewNoteInput] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState('Field Note');

  // --- STATE FOR FILES ---
  const [filesList] = useState([
    { name: 'FIR_KRP_2026_0456_Certified.pdf', folder: '01_FIR_and_Panchanama', size: '1.2 MB', date: '16 Jul 2025', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    { name: 'Spot_Panchanama_Scene_Photos.zip', folder: '01_FIR_and_Panchanama', size: '18.4 MB', date: '16 Jul 2025', hash: 'fa27d098e98bc01123490aafe124800293748291039485720194850293847589' },
    { name: 'CCTV_Exit_Gate_1080p.mp4', folder: '02_CCTV_Surveillance_Video', size: '450.0 MB', date: '17 Jul 2025', hash: '7c89f01832049182390481029384019283401928401928401928401928401928' },
    { name: 'FSL_Ballistics_AFIS_Analysis.pdf', folder: '03_FSL_Forensic_Reports', size: '4.8 MB', date: '18 Jul 2025', hash: '8f9e102938401928340192840192840192840192840192840192840192840192' },
    { name: 'Witness_Ramesh_Statement_Audio.wav', folder: '04_Witness_Audio_Records', size: '14.2 MB', date: '16 Jul 2025', hash: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef' },
    { name: 'Form_173_Chargesheet_Draft_v2.docx', folder: '05_Form_173_Chargesheet', size: '850 KB', date: '19 Jul 2025', hash: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890' }
  ]);

  const [selectedEvidence, setSelectedEvidence] = useState<typeof evidenceItems[0] | null>(null);

  // Quick Note Modal state
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteModalText, setNoteModalText] = useState('');

  // Handle Save Note
  const handleSaveNote = (text: string, category: string) => {
    if (!text.trim()) return;
    const newEntry = {
      id: `N${Date.now()}`,
      author: 'Inspector Arjun',
      designation: 'Investigating Officer',
      timestamp: 'Just Now',
      category: category || 'Field Note',
      content: text.trim(),
      hasAudio: false,
      audioDuration: ''
    };
    setCaseNotes([newEntry, ...caseNotes]);
    showToast('Saved Note to Official Case Diary');
    setNewNoteInput('');
    setNoteModalText('');
    setShowNoteModal(false);
  };

  const cardBg = isDarkMode
    ? 'bg-[#111827] border-[#1F2937] text-white'
    : 'bg-white border-[#E2E8F0] text-slate-900 shadow-2xs';

  const subCardBg = isDarkMode
    ? 'bg-[#1F2937]/50 border-[#374151]/50 hover:bg-[#1F2937]'
    : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-slate-100';

  const tabsList = [
    'Overview',
    'Replay ⭐',
    'Tasks',
    'Evidence',
    'Timeline',
    'Witnesses',
    'Accused',
    'Reports',
    'Notes',
    'Files',
  ];

  return (
    <motion.main
      variants={pageContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="p-3 sm:p-6 max-w-[1850px] w-full mx-auto flex flex-col gap-5 pb-24"
    >
      {/* 1. STICKY TOP HEADER BAR WITH DAYS SINCE FIR, LAST UPDATED, STATUS STRIP & TASK BADGE (P0) */}
      <motion.div 
        variants={pageItemVariants} 
        className={`sticky top-0 z-30 flex flex-col gap-2.5 p-4 rounded-2xl border backdrop-blur-md transition-colors ${
          isDarkMode ? 'bg-[#0B0F19]/90 border-gray-800 shadow-2xl' : 'bg-white/90 border-gray-200 shadow-sm'
        }`}
      >
        {/* Row 1: Breadcrumbs & Meta Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-medium">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              onClick={() => showToast('Navigated to Investigations Directory')}
              className="hover:text-[#FF5A1F] cursor-pointer transition-colors text-gray-400 font-mono"
            >
              Investigations
            </span>
            <span className="text-gray-600">&gt;</span>
            
            {/* Active Case Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCaseSelectorMenu(!showCaseSelectorMenu)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono font-bold text-xs transition-all cursor-pointer ${
                  isDarkMode ? 'bg-[#1F2937] border-gray-700 text-gray-200 hover:border-[#FF5A1F]' : 'bg-slate-100 border-slate-300 text-slate-800 hover:border-[#FF5A1F]'
                }`}
              >
                <Folder size={13} className="text-[#FF5A1F]" />
                <span>{currentCase.firNumber}</span>
                <ChevronDown size={13} className="text-gray-400" />
              </button>

              <AnimatePresence>
                {showCaseSelectorMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className={`absolute left-0 mt-1.5 w-80 rounded-2xl border shadow-2xl z-50 overflow-hidden text-xs ${
                      isDarkMode ? 'bg-[#1F2937] border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-slate-800'
                    }`}
                  >
                    <div className="p-2.5 border-b border-gray-200 dark:border-gray-700 text-[10px] font-mono uppercase font-bold text-gray-400">
                      Switch Active Station Investigation
                    </div>
                    {Object.values(CASES_DATA).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setActiveCaseId(c.id);
                          setCaseStatus(c.status);
                          setShowCaseSelectorMenu(false);
                          showToast(`Switched active investigation to ${c.firNumber}`);
                        }}
                        className={`w-full p-3 text-left hover:bg-[#FF5A1F] hover:text-white transition-colors cursor-pointer flex flex-col gap-1 border-b border-gray-100 dark:border-gray-800/50 ${
                          activeCaseId === c.id ? 'bg-[#FF5A1F]/10 border-l-4 border-l-[#FF5A1F]' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span>{c.firNumber}</span>
                          <span className="text-[10px] font-mono opacity-80">{c.status}</span>
                        </div>
                        <div className="text-[11px] opacity-90 truncate">{c.title}</div>
                        <div className="flex items-center justify-between text-[9px] opacity-60 font-mono mt-0.5">
                          <span>{c.station}</span>
                          <span>{c.daysActive}d active</span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* P0 HEADER BADGES: DAYS SINCE FIR, LAST UPDATED, PENDING TASKS */}
            <span className="px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-500 font-mono font-bold text-[11px] border border-red-500/20 flex items-center gap-1">
              <Calendar size={12} />
              <span>{currentCase.daysActive} Days Active</span>
            </span>

            <span className="px-2.5 py-0.5 rounded-full bg-gray-500/15 text-gray-400 font-mono text-[11px] border border-gray-500/20 flex items-center gap-1">
              <Clock size={12} />
              <span>{currentCase.lastUpdated}</span>
            </span>

            <span 
              onClick={() => setActiveTab('Tasks')}
              className="px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-400 font-mono font-bold text-[11px] border border-red-500/30 flex items-center gap-1.5 cursor-pointer hover:bg-red-500/25 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span>{currentCase.pendingTasksCount} Tasks ({currentCase.urgentTasksCount} Urgent)</span>
            </span>
          </div>

          {/* Top Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setActiveTab('Replay ⭐');
                showToast('▶ Playing Investigation Timeline');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-all cursor-pointer"
            >
              <Play size={13} className="fill-current" />
              <span>Replay Investigation</span>
            </button>

            <button
              onClick={() => showToast(`Case link for ${currentCase.firNumber} copied to clipboard`)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isDarkMode ? 'bg-[#1F2937] border-gray-700 text-gray-200' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <Share2 size={13} />
              <span>Share</span>
            </button>

            {/* Add New Item Button */}
            <button
              onClick={() => setShowAddNewMenu(!showAddNewMenu)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FF5A1F] text-white hover:bg-[#E04D18] shadow-md transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Add New</span>
            </button>
          </div>
        </div>

        {/* Row 2: STATUS TIMELINE STRIP (P0) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-gray-200 dark:border-gray-800">
          <span className="text-[10px] font-mono uppercase font-bold text-gray-400 mr-1 shrink-0">Workflow Stage:</span>
          {[
            { stage: '1. FIR Registered', status: 'Done', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
            { stage: '2. Scene Examined', status: 'Done', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
            { stage: '3. Evidence Collection', status: 'In Progress', color: 'bg-[#FF5A1F]/15 text-[#FF5A1F] border-[#FF5A1F]/30' },
            { stage: '4. Suspect Interrogation', status: 'Active', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
            { stage: '5. Form 173 Chargesheet', status: 'Draft Ready', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' }
          ].map((st, idx) => (
            <div
              key={st.stage}
              className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-1.5 shrink-0 ${st.color}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>{st.stage}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border ${cardBg}`}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-gray-400">Missing Evidence Detector</span>
            <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1">Flags evidence categories expected for this FIR but not yet present in the case file.</p>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#FF5A1F] bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 px-2 py-0.5 rounded-full">Auto-checklist</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {missingEvidence.map((item) => (
            <div key={item.label} className={`rounded-2xl border p-3 ${item.present ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold">{item.label}</span>
                <span className="text-[10px] font-bold">{item.present ? 'Present' : 'Missing'}</span>
              </div>
              <p className="text-[9px] text-slate-500 dark:text-gray-400 mt-2">{item.present ? 'Evidence found in current records.' : 'Add this evidence type to close gaps.'}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 2. SEARCH BAR WITH RECENT SEARCHES & FILTERS (P0) */}
      <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search investigation records, evidence IDs, accused names, witness statements..."
              className={`w-full pl-10 pr-4 py-2 rounded-xl border text-xs focus:outline-none focus:border-[#FF5A1F] ${
                isDarkMode ? 'bg-[#1F2937] border-gray-700 text-white placeholder-gray-500' : 'bg-slate-50 border-gray-300 text-slate-900 placeholder-slate-400'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Basic Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto shrink-0">
            {['All Records', 'High Urgency', 'Evidence Items', 'Witness Statements', 'FSL Reports'].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setActiveFilter(f);
                  showToast(`Filter applied: ${f}`);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === f
                    ? 'bg-[#FF5A1F] text-white'
                    : isDarkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Searches Pills */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="text-[10px] font-mono uppercase font-bold text-gray-400">Recent Searches:</span>
          {['KA-03-MN-4481', 'Crowbar P1', 'AFIS Fingerprint', 'Suresh K.', 'Srinivas V.'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSearchQuery(tag);
                showToast(`Searching for "${tag}"`);
              }}
              className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                isDarkMode ? 'bg-gray-800/60 border-gray-700 text-gray-300 hover:text-[#FF5A1F]' : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-[#FF5A1F]'
              }`}
            >
              🔍 {tag}
            </button>
          ))}
        </div>
      </motion.div>

      {/* 3. WORKSPACE TABS */}
      <motion.div variants={pageItemVariants} className={`border-b ${isDarkMode ? 'border-[#1F2937]' : 'border-[#E2E8F0]'}`}>
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {tabsList.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  showToast(`Switched to tab: ${tab}`);
                }}
                className={`px-4 py-2 text-xs font-bold transition-all relative shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-[#FF5A1F]'
                    : isDarkMode
                      ? 'text-gray-400 hover:text-gray-200'
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5A1F] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* 4. DYNAMIC TAB VIEW SWITCHER */}
      {activeTab === 'Overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT 3/4 MAIN COLUMN (lg:col-span-9) */}
          <div className="lg:col-span-9 flex flex-col gap-5">

            {/* CARD 1: UNIFIED CASE CONTROL PANEL (MERGED SUMMARY + AT A GLANCE - P0) */}
            <motion.div variants={pageItemVariants} className={`p-5 rounded-2xl border ${cardBg}`}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left Side: Merged Case Intelligence Details (7 Cols) */}
                <div className="md:col-span-7 flex flex-col gap-4 border-b md:border-b-0 md:border-r pb-5 md:pb-0 md:pr-6 border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A1F]" />
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
                        CASE MASTER CONTROL PANEL
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#FF5A1F]/10 text-[#FF5A1F] border border-[#FF5A1F]/20 font-extrabold">
                      {currentCase.crimeType}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-700 dark:text-gray-300">{caseSummary}</p>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-xs font-sans">
                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-mono block">FIR Number</span>
                      <span className="font-extrabold text-sm text-[#FF5A1F]">{currentCase.id}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-mono block">Police Station</span>
                      <span className="font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        {currentCase.station.split(',')[0]}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-mono block">Investigating Officer</span>
                      <span className="font-bold">{currentCase.ioName}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-mono block">Registered Date</span>
                      <span className="font-bold">{currentCase.registeredDate}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-mono block">Legal Sections</span>
                      <span className="font-bold truncate" title={currentCase.sections}>{currentCase.sections}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-mono block">Priority / Sensitivity</span>
                      <span className="font-bold flex items-center gap-2">
                        <span className="text-red-500 font-extrabold">🔴 {currentCase.priority}</span>
                        <span className="text-[#FF5A1F]">• Level 2</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-mono block">Case Total Value</span>
                      <span className="font-mono font-extrabold text-slate-900 dark:text-white">{currentCase.caseValue}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-mono block">Stolen Property Stolen</span>
                      <span className="font-mono font-extrabold text-red-500">{currentCase.stolenValue}</span>
                    </div>

                    <div className="col-span-2 border-t pt-2 border-gray-200 dark:border-gray-800">
                      <span className="text-gray-400 text-[10px] uppercase font-mono">Similar Cases:</span>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {similarCases.map((item) => (
                          <div key={item.title} className="rounded-2xl border p-2 bg-slate-50 dark:bg-[#111827] border-gray-200 dark:border-gray-800">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-bold text-slate-900 dark:text-gray-100">{item.title}</span>
                              <span className="text-[10px] font-mono font-bold text-teal-400">{item.similarity}</span>
                            </div>
                            <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Workflow Progress Matrix (5 Cols) */}
                <div className="md:col-span-5 flex flex-col justify-between gap-4">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
                    INVESTIGATION WORKFLOW MATRIX
                  </h3>

                  <div className="flex items-center gap-5">
                    {/* Progress Circle Visual */}
                    <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-gray-200 dark:text-gray-800"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-[#FF5A1F]"
                          strokeDasharray={`${healthScore}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-xl font-black tracking-tight leading-none">{healthScore}%</span>
                        <span className="text-[8px] font-mono text-gray-400 uppercase mt-0.5">Health Score</span>
                      </div>
                    </div>

                    {/* Health Metric Breakdown */}
                    <div className="flex flex-col gap-3 text-xs flex-1">
                      {deadlineWarning ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-red-800 text-[11px] font-semibold">
                          <div className="flex items-center gap-2">
                            <AlertTriangle size={14} />
                            <span>
                              Legal Readiness below threshold with {statutoryDeadlineDays} days remaining until chargesheet deadline.
                            </span>
                          </div>
                        </div>
                      ) : null}

                      {healthMetrics.map((metric) => {
                        const previousValue = previousHealthMetrics[metric.label] ?? metric.value;
                        const delta = metric.value - previousValue;
                        const isBottleneck = metric.value === bottleneckValue;
                        const arrow = delta === 0 ? '•' : delta > 0 ? '▲' : '▼';

                        return (
                          <div
                            key={metric.label}
                            className={`space-y-1 rounded-2xl border p-3 ${isBottleneck ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-[#111827]'} cursor-pointer`}
                            onClick={() => setActiveHealthDetail((active) => (active === metric.label ? null : metric.label))}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-semibold text-slate-800 dark:text-gray-100">{metric.label}</span>
                              <div className="flex items-center gap-2">
                                <span className={`font-bold ${metric.color}`}>{metric.value}%</span>
                                <span className="text-[10px] text-gray-500">
                                  {arrow} {Math.abs(delta)}% since yesterday
                                </span>
                              </div>
                            </div>
                            <div className="h-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                              <div className={`h-full rounded-full ${metric.color}`} style={{ width: `${metric.value}%` }} />
                            </div>
                            {isBottleneck ? (
                              <div className="text-[10px] font-semibold text-red-700">⚠ Lowest</div>
                            ) : null}
                            {activeHealthDetail === metric.label ? (
                              <div className="mt-2 rounded-2xl bg-gray-50 dark:bg-gray-900 p-3 text-[11px] text-slate-700 dark:text-gray-300">
                                {metric.description}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                        <span className="text-[10px] font-mono uppercase text-gray-400">Statutory Deadline</span>
                        <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-slate-900 dark:text-gray-200">
                          <span>{statutoryDeadlineText}</span>
                          <span className="px-2 py-1 rounded-full bg-[#FF5A1F]/10 text-[#FF5A1F] font-bold">{statutoryDeadlineDays}d</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CARD 2: REPLACED CASE QUICK ACTIONS (P0 & CUT/MERGE) */}
            <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                CASE INVESTIGATION ACTIONS (CASE TOOLS)
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    title: 'Add Evidence Item',
                    desc: 'Upload file & assign Malkhana ID',
                    icon: Upload,
                    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
                    action: () => setActiveAddNewModalTab('Evidence')
                  },
                  {
                    title: 'Request FSL Analysis',
                    desc: 'Generate lab dispatch memo',
                    icon: ShieldCheck,
                    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
                    action: () => setActiveAddNewModalTab('FSL')
                  },
                  {
                    title: 'Start AI Swarm Scan',
                    desc: 'Detect contradictions & patterns',
                    icon: Sparkles,
                    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
                    action: () => openCopilot(`Run multi-agent AI contradiction and pattern scan for case ${currentCase.firNumber}`)
                  },
                  {
                    title: 'Draft Chargesheet (Form 173)',
                    desc: 'Compile final court report',
                    icon: Scale,
                    color: 'text-[#FF5A1F] bg-[#FF5A1F]/10 border-[#FF5A1F]/20',
                    action: () => setActiveAddNewModalTab('Chargesheet')
                  }
                ].map((act, idx) => {
                  const IconComp = act.icon;
                  return (
                    <button
                      key={idx}
                      onClick={act.action}
                      className={`p-3 rounded-xl border flex flex-col items-start gap-1.5 transition-all text-left cursor-pointer hover:border-[#FF5A1F] ${subCardBg}`}
                    >
                      <div className={`p-2 rounded-lg border ${act.color}`}>
                        <IconComp size={18} />
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isDarkMode ? 'text-gray-100' : 'text-slate-900'}`}>
                          {act.title}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{act.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* ROW 3: AI INSIGHTS, CONTRADICTION ENGINE & RECOMMENDATIONS (P1) */}
            <motion.div variants={pageItemVariants} className={`p-5 rounded-2xl border flex flex-col gap-4 ${cardBg}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-purple-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
                    AI INTELLIGENCE & CONTRADICTION ENGINE
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {caseActionChips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => openCopilot(chip)}
                      className="text-[10px] font-mono px-3 py-1 rounded-full border border-purple-500/20 text-purple-400 bg-purple-500/5 hover:bg-purple-500/10"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Box 1: Contradiction Alert Box */}
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-red-500 flex items-center gap-1.5">
                      <AlertTriangle size={15} /> CONTRADICTION DETECTED
                    </span>
                    <span className="text-[10px] font-mono font-extrabold bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                      94.8% Confidence
                    </span>
                  </div>
                  <p className="text-xs text-gray-200 leading-relaxed font-sans">
                    Alibi Statement by Accused <strong>Suresh K.</strong> claims being in Hoskote at 11:30 PM, but CCTV Exit Gate video (#E-01) matches vehicle KA-03-MN-4481 at KR Puram underpass at 11:42 PM.
                  </p>
                  <span className="text-[9px] text-gray-400 font-mono mt-1">Detected on: 18 Jul 2025, 02:15 PM</span>
                </div>

                {/* Box 2: Recommendation List */}
                <div className="lg:col-span-2 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-purple-400 flex items-center gap-1.5">
                      <Zap size={15} /> RECOMMENDED INVESTIGATION ACTIONS
                    </span>
                    <span className="text-[10px] font-mono font-extrabold bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/30">
                      {selectedRecommendation.confidence} Lead Confidence
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {recommendations.map((rec) => (
                      <button
                        key={rec.id}
                        onClick={() => setSelectedRecommendationId(rec.id)}
                        className={`text-left p-3 rounded-2xl border transition-all ${selectedRecommendationId === rec.id ? 'border-purple-500/60 bg-purple-500/10' : 'border-transparent bg-white dark:bg-[#111827]'}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-sm text-slate-900 dark:text-white">{rec.title}</span>
                          <span className="text-[10px] font-bold text-purple-500">{rec.confidence}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-2">{rec.why}</p>
                      </button>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-purple-500/20 bg-slate-50 dark:bg-[#111827] p-3 text-xs text-slate-700 dark:text-gray-200">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-bold">Why this Recommendation?</span>
                      <span className="text-[10px] font-mono text-purple-500">Selected action details</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedRecommendation.title}</p>
                    <div className="mt-2 space-y-1">
                      {selectedRecommendation.details.map((item) => (
                        <div key={item} className="flex items-start gap-2 text-[11px] text-gray-600 dark:text-gray-300">
                          <span className="mt-0.5 text-purple-500">•</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ROW 4: RECENT EVIDENCE WITH CHAIN OF CUSTODY BADGES (P0 & P1) */}
            <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                  RECENT EVIDENCE & CHAIN OF CUSTODY INTEGRITY
                </span>

                {/* Evidence Category Filters */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  {['All', 'CCTV Video', 'Forensics', 'Weapons', 'Photos'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setEvidenceCategoryFilter(cat)}
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                        evidenceCategoryFilter === cat
                          ? 'bg-[#FF5A1F] text-white'
                          : isDarkMode
                            ? 'bg-gray-800 text-gray-300'
                            : 'bg-gray-200 text-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Evidence Thumbnails Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {evidenceItems
                  .filter((ev) => evidenceCategoryFilter === 'All' || ev.category === evidenceCategoryFilter)
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedEvidence(item)}
                      className={`group rounded-xl border overflow-hidden transition-all cursor-pointer hover:border-[#FF5A1F] ${subCardBg}`}
                    >
                      <div className="relative h-24 w-full bg-slate-800 overflow-hidden">
                        <img
                          src={item.img}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {item.badge && (
                          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-mono px-1 rounded">
                            {item.badge}
                          </span>
                        )}
                        {item.isVideo && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                            <div className="w-6 h-6 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center shadow-md">
                              <Video size={12} />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-2 flex flex-col gap-1">
                        <div className={`text-[11px] font-bold truncate ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                          {item.title}
                        </div>
                        <div className="text-[9px] text-emerald-400 font-mono font-bold truncate">
                          {item.custodyBadge}
                        </div>
                        <div className="text-[9px] text-gray-400 font-mono truncate">
                          {item.uploader} • {item.timestamp.split(',')[0]}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>

            {/* ROW 5: PENDING TASKS OVERVIEW (P0) */}
            <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border ${cardBg}`}>
              <GoogleTasksPanel 
                isDarkMode={isDarkMode} 
                subCardBg={subCardBg} 
                showToast={showToast} 
                isCompact={true} 
              />
            </motion.div>
          </div>

          {/* RIGHT 1/4 SIDEBAR COLUMN: VISUALLY SPLIT ACCUSED VS WITNESS DIRECTORY (P0) */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* 🔴 ACCUSED / SUSPECTS SECTION (P0) */}
            <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-red-500 flex items-center gap-1">
                  <ShieldAlert size={14} /> ACCUSED & SUSPECTS ({accusedList.length})
                </span>
                <button
                  onClick={() => setActiveTab('Accused')}
                  className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                {accusedList.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => setSelectedAccusedModal(acc)}
                    className={`p-3 rounded-xl border flex flex-col gap-2 transition-all cursor-pointer hover:border-red-500/50 ${subCardBg}`}
                  >
                    <div className="flex items-center gap-2.5">
                      {acc.photo ? (
                        <img src={acc.photo} alt={acc.name} className="w-10 h-10 rounded-xl object-cover border border-red-500/40 shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/40 shrink-0 flex items-center justify-center text-[10px] font-bold text-red-500">
                          {acc.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className={`text-xs font-extrabold truncate ${isDarkMode ? 'text-gray-100' : 'text-slate-900'}`}>
                          {acc.name}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium truncate">{acc.role}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="font-bold text-red-400">{acc.riskBadge}</span>
                      <span className="text-amber-400">{acc.priorsCount} Priors</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 🟢 WITNESSES & COMPLAINANTS SECTION (P0) */}
            <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-500 flex items-center gap-1">
                  <UserCheck size={14} /> WITNESSES & COMPLAINANTS ({witnesses.length})
                </span>
                <button
                  onClick={() => setActiveTab('Witnesses')}
                  className="text-xs font-bold text-emerald-500 hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                {witnesses.map((w) => (
                  <div
                    key={w.id}
                    onClick={() => setSelectedWitnessModal(w)}
                    className={`p-3 rounded-xl border flex flex-col gap-2 transition-all cursor-pointer hover:border-emerald-500/50 ${subCardBg}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/15 text-emerald-500 font-black text-xs flex items-center justify-center shrink-0">
                        {w.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className={`text-xs font-extrabold truncate ${isDarkMode ? 'text-gray-100' : 'text-slate-900'}`}>
                          {w.name}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium truncate">{w.role}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="font-bold text-emerald-400">{w.credibility}</span>
                      <span className="text-gray-400">Sec 161: {w.sec161Status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* LIVE CASE DIARY FEED */}
            <motion.div variants={pageItemVariants} className={`p-4 rounded-2xl border flex flex-col gap-3 ${cardBg}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                  CASE DIARY STREAM (FORM 67)
                </span>
                <span className="text-[9px] font-mono font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  Sec 172 CrPC
                </span>
              </div>

              <div className="flex flex-col gap-3 text-xs">
                {caseNotes.slice(0, 3).map((note) => (
                  <div key={note.id} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 mt-0.5 text-[#FF5A1F]">
                      <FileText size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-bold ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                        {note.author} ({note.category})
                      </span>
                      <span className="text-[10px] text-gray-400 line-clamp-2">{note.content}</span>
                      <span className="text-[9px] text-gray-500 font-mono mt-0.5">{note.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActiveTab('Notes')}
                className="text-xs font-bold text-[#FF5A1F] hover:underline flex items-center gap-1 cursor-pointer w-fit mt-1"
              >
                <span>View Full Case Diary</span>
                <ArrowRight size={13} />
              </button>
            </motion.div>

          </div>
        </div>
      ) : activeTab === 'Replay ⭐' ? (
        <motion.div variants={pageItemVariants} className="w-full">
          <InvestigationReplayWorkspace />
        </motion.div>
      ) : activeTab === 'Tasks' ? (
        <motion.div variants={pageItemVariants} className={`p-6 rounded-2xl border flex flex-col gap-5 ${cardBg}`}>
          <GoogleTasksPanel 
            isDarkMode={isDarkMode} 
            subCardBg={subCardBg} 
            showToast={showToast} 
            isCompact={false} 
          />
        </motion.div>
      ) : activeTab === 'Evidence' ? (
        <motion.div variants={pageItemVariants} className="w-full">
          <EvidenceLockerWorkspace />
        </motion.div>
      ) : activeTab === 'Timeline' ? (
        <motion.div variants={pageItemVariants} className={`p-6 rounded-2xl border flex flex-col gap-6 ${cardBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                <Clock className="text-[#FF5A1F]" size={20} />
                Investigation Master Timeline ({currentCase.firNumber})
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Chronological event matrix linking scene inspection, CCTV surveillance, forensics, and arrests.</p>
            </div>

            <button
              onClick={() => setShowAddTimelineModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer hover:bg-[#E04D18] shadow-md"
            >
              <Plus size={15} /> Add Milestone Event
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['All', 'FIR & Legal', 'CCTV & Surveillance', 'Forensics & FSL', 'Arrest & Custody'].map((cat) => (
              <button
                key={cat}
                onClick={() => setTimelineFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  timelineFilter === cat
                    ? 'bg-[#FF5A1F] text-white'
                    : isDarkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-[#FF5A1F]/30 flex flex-col gap-6 my-2">
            {timelineEvents
              .filter((ev) => timelineFilter === 'All' || ev.category === timelineFilter)
              .map((ev) => {
                const IconComp = ev.icon;
                return (
                  <div key={ev.id} className="relative flex flex-col gap-1 group">
                    <div className="absolute -left-[31px] sm:-left-[39px] top-0.5 w-6 h-6 rounded-full bg-[#111827] border-2 border-[#FF5A1F] flex items-center justify-center shadow-md">
                      <div className="w-2 h-2 rounded-full bg-[#FF5A1F]" />
                    </div>

                    <div className={`p-4 rounded-xl border transition-all ${subCardBg}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`p-1.5 rounded-lg ${ev.color}`}>
                            <IconComp size={15} />
                          </span>
                          <span className="font-extrabold text-sm text-[#FF5A1F]">{ev.title}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-gray-400">
                            {ev.category}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-gray-400">{ev.timestamp}</span>
                      </div>

                      <p className="text-xs text-gray-300 font-sans leading-relaxed">{ev.desc}</p>

                      <div className="flex items-center justify-between mt-3 text-[11px] text-gray-400 font-mono border-t pt-2 border-gray-200 dark:border-gray-800">
                        <span>Officer: {ev.officer}</span>
                        <button
                          onClick={() => openCopilot(`Analyze timeline milestone: ${ev.title}`)}
                          className="text-[#FF5A1F] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles size={12} /> Analyze Event
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>
      ) : activeTab === 'Witnesses' ? (
        <motion.div variants={pageItemVariants} className={`p-6 rounded-2xl border flex flex-col gap-6 ${cardBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                <UserCheck className="text-emerald-500" size={20} />
                Witness Directory & Section 161 CrPC Statements
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Recorded witness statements, credibility scoring, and audio transcript logs for {currentCase.firNumber}.</p>
            </div>

            <button
              onClick={() => setActiveAddNewModalTab('Witness')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer hover:bg-[#E04D18] shadow-md"
            >
              <Plus size={15} /> Add New Witness
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {witnesses.map((w) => (
              <div key={w.id} className={`p-5 rounded-2xl border flex flex-col gap-3 transition-all ${subCardBg}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-500 font-black text-sm flex items-center justify-center">
                      {w.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm">{w.name}</h3>
                      <p className="text-xs text-gray-400">{w.role} • {w.phone}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                    Credibility: {w.credibility}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/20 border border-white/10 text-xs text-gray-300 italic">
                  &quot;{w.statementText}&quot;
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                  <span>Sec 161: <strong className="text-emerald-400">{w.sec161Status}</strong></span>
                  <span>Recorded: {w.dateRecorded}</span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => {
                      setSelectedWitnessModal(w);
                      setIsPlayingAudio(false);
                    }}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileText size={14} /> Full Transcript
                  </button>

                  <button
                    onClick={() => openCopilot(`Draft interrogation or question list for ${w.name} (${w.role})`)}
                    className="py-2 px-3 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Sparkles size={14} /> Question Strategy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ) : activeTab === 'Accused' ? (
        <motion.div variants={pageItemVariants} className={`p-6 rounded-2xl border flex flex-col gap-6 ${cardBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                <ShieldAlert className="text-red-500" size={20} />
                Suspect & Accused Dossier ({currentCase.firNumber})
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Custody tracking, Sec 27 Evidence Act recovery logs, and interrogation summaries.</p>
            </div>

            <button
              onClick={() => setActiveAddNewModalTab('Suspect')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer hover:bg-[#E04D18] shadow-md"
            >
              <Plus size={15} /> Add Suspect Record
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {accusedList.map((acc) => (
              <div key={acc.id} className={`p-5 rounded-2xl border flex flex-col gap-4 ${subCardBg}`}>
                <div className="flex items-start gap-3">
                  {acc.photo ? (
                    <img
                      src={acc.photo}
                      alt={acc.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-red-500/40 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-red-500/10 border-2 border-red-500/40 shrink-0 flex items-center justify-center text-sm font-bold text-red-500">
                      {acc.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-bold text-red-500 uppercase">{acc.id}</span>
                    <h3 className="font-extrabold text-sm">{acc.name}</h3>
                    <p className="text-xs text-gray-400">{acc.role}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 text-xs font-sans">
                  <div className="flex justify-between border-b pb-1.5 border-gray-200 dark:border-gray-800">
                    <span className="text-gray-400">Custody Status</span>
                    <span className="font-bold text-red-400">{acc.custodyStatus}</span>
                  </div>

                  <div className="flex justify-between border-b pb-1.5 border-gray-200 dark:border-gray-800">
                    <span className="text-gray-400">Prior Antecedents</span>
                    <span className="font-bold text-amber-500">{acc.priorsCount} Criminal Cases</span>
                  </div>

                  <div className="flex justify-between border-b pb-1.5 border-gray-200 dark:border-gray-800">
                    <span className="text-gray-400">Sec 27 Recovery</span>
                    <span className="font-bold text-emerald-400 truncate">{acc.sec27Recovery}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {acc.moTags.map((t) => (
                    <span key={t} className="text-[9px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                      {t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedAccusedModal(acc)}
                  className="w-full py-2.5 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <FileText size={14} /> Full Interrogation Dossier
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      ) : activeTab === 'Reports' ? (
        <motion.div variants={pageItemVariants} className={`p-6 rounded-2xl border flex flex-col gap-6 ${cardBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                <Scale className="text-blue-500" size={20} />
                Police Document & Legal Reports Hub ({currentCase.firNumber})
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Certified FIR Form 1, Spot Panchanama Memos, Seizure Memos, and Chargesheet (Form 173).</p>
            </div>

            <button
              onClick={() => openCopilot(`Draft new custom legal document for ${currentCase.firNumber}`)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer hover:bg-[#E04D18] shadow-md"
            >
              <Sparkles size={15} /> Draft Legal Document
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportsList.map((doc) => (
              <div key={doc.id} className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 ${subCardBg}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center shrink-0 font-bold">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm leading-tight">{doc.title}</h3>
                      <span className="text-[10px] font-mono text-gray-400">{doc.docNo} • {doc.date}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                    {doc.status}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 font-mono text-[11px] text-gray-300 line-clamp-3 border border-white/5">
                  {doc.previewContent}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Author: {doc.author}</span>
                  <button
                    onClick={() => setSelectedReportModal(doc)}
                    className="px-4 py-2 rounded-xl bg-[#FF5A1F] text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Eye size={14} /> Open & Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ) : activeTab === 'Notes' ? (
        <motion.div variants={pageItemVariants} className={`p-6 rounded-2xl border flex flex-col gap-6 ${cardBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                <FileText className="text-[#FF5A1F]" size={20} />
                Official Case Diary Log (Sec 172 CrPC / Form 67)
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Daily investigation proceedings, field observations, and officer log entries.</p>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${subCardBg}`}>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Plus size={14} className="text-[#FF5A1F]" /> Add Case Diary Entry
            </span>
            <div className="flex items-center gap-2">
              <select
                value={newNoteCategory}
                onChange={(e) => setNewNoteCategory(e.target.value)}
                className={`p-2 rounded-xl border text-xs font-bold focus:outline-none focus:border-[#FF5A1F] ${
                  isDarkMode ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-white border-gray-300 text-slate-900'
                }`}
              >
                <option value="Field Note">Field Note</option>
                <option value="Interrogation Note">Interrogation Note</option>
                <option value="Technical Analysis">Technical Analysis</option>
                <option value="Supervisor Direction">Supervisor Direction</option>
              </select>

              <input
                type="text"
                value={newNoteInput}
                onChange={(e) => setNewNoteInput(e.target.value)}
                placeholder="Type official case diary entry observation..."
                className={`flex-1 p-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#FF5A1F] ${
                  isDarkMode ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-white border-gray-300 text-slate-900'
                }`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveNote(newNoteInput, newNoteCategory);
                }}
              />

              <button
                onClick={() => handleSaveNote(newNoteInput, newNoteCategory)}
                className="px-5 py-2.5 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer hover:bg-[#E04D18] shrink-0"
              >
                Save Entry
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {caseNotes.map((note) => (
              <div key={note.id} className={`p-4 rounded-2xl border flex flex-col gap-2 ${subCardBg}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A1F]" />
                    <span className="font-extrabold text-sm">{note.author}</span>
                    <span className="text-xs text-gray-400">({note.designation})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF5A1F]/15 text-[#FF5A1F] font-bold">
                      {note.category}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">{note.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-200 leading-relaxed font-sans mt-1">{note.content}</p>

                {note.hasAudio && (
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-white/10 mt-2 text-xs">
                    <button
                      onClick={() => showToast(`Playing voice recording memo (${note.audioDuration})`)}
                      className="w-7 h-7 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center cursor-pointer"
                    >
                      <Play size={12} className="fill-current" />
                    </button>
                    <span className="text-gray-300 font-mono text-[11px]">Audio Memo Recording ({note.audioDuration})</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ) : activeTab === 'Files' ? (
        <motion.div variants={pageItemVariants} className={`p-6 rounded-2xl border flex flex-col gap-6 ${cardBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                <HardDrive className="text-teal-500" size={20} />
                Cloud Evidence Locker & Files Drive ({currentCase.firNumber})
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">SHA-256 Chain of Custody verified file system.</p>
            </div>

            <button
              onClick={() => setActiveAddNewModalTab('Evidence')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer hover:bg-[#E04D18] shadow-md"
            >
              <Upload size={15} /> Upload Files
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-4 flex flex-col gap-2">
              <span className="text-xs font-mono font-bold text-gray-400 uppercase">Case Folder Hierarchy</span>
              {[
                '01_FIR_and_Panchanama',
                '02_CCTV_Surveillance_Video',
                '03_FSL_Forensic_Reports',
                '04_Witness_Audio_Records',
                '05_Form_173_Chargesheet'
              ].map((f) => (
                <div key={f} className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${subCardBg}`}>
                  <div className="flex items-center gap-2">
                    <Folder size={16} className="text-[#FF5A1F]" />
                    <span className="font-mono text-gray-200">{f}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">Folder</span>
                </div>
              ))}
            </div>

            <div className="md:col-span-8 flex flex-col gap-3">
              <span className="text-xs font-mono font-bold text-gray-400 uppercase">Files & Chain of Custody Hashes</span>
              <div className="flex flex-col gap-2">
                {filesList.map((file) => (
                  <div key={file.name} className={`p-3.5 rounded-xl border flex flex-col gap-1.5 ${subCardBg}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-blue-400" />
                        <span className="font-extrabold text-xs">{file.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">{file.size}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                      <span>Folder: {file.folder}</span>
                      <span>Uploaded: {file.date}</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-white/5 font-mono text-[9px] text-emerald-400">
                      <span className="truncate">SHA-256: {file.hash}</span>
                      <button
                        onClick={() => showToast('Chain of Custody Hash Verified: Pristine Audit Log')}
                        className="text-[#FF5A1F] hover:underline font-bold shrink-0 ml-2"
                      >
                        Verify Hash
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={pageItemVariants} className={`p-8 rounded-2xl border flex flex-col gap-4 text-center items-center justify-center min-h-[300px] ${cardBg}`}>
          <div className="w-12 h-12 rounded-full bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center">
            <Folder size={24} />
          </div>
          <h2 className="text-xl font-black">{activeTab} Section</h2>
          <p className="text-xs text-gray-400 max-w-md">
            Showing synced records and data for {activeTab} in {currentCase.firNumber}.
          </p>
          <button
            onClick={() => openCopilot(`Analyze ${activeTab} data for ${currentCase.firNumber}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer hover:bg-[#E04D18]"
          >
            <Sparkles size={14} /> Ask Copilot
          </button>
        </motion.div>
      )}

      {/* FLOATING ACTION MIC BUTTON */}
      <button
        onClick={() => openCopilot('Voice record new investigation memo')}
        className="fixed bottom-6 right-6 z-40 w-13 h-13 bg-[#FF5A1F] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 cursor-pointer transition-all border-2 border-white/20"
        title="Record Audio / Talk to Copilot"
      >
        <Mic size={22} className="animate-pulse" />
      </button>

      {/* --- MODAL 1: ADD NEW ITEM MODAL --- */}
      <AnimatePresence>
        {activeAddNewModalTab && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-2xl border max-w-lg w-full flex flex-col gap-4 relative ${cardBg}`}
            >
              <button
                onClick={() => setActiveAddNewModalTab(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="text-base font-black flex items-center gap-2">
                <Plus className="text-[#FF5A1F]" size={18} />
                Add New {activeAddNewModalTab} ({currentCase.firNumber})
              </h3>

              {activeAddNewModalTab === 'Evidence' && (
                <div className="flex flex-col gap-3 text-xs">
                  <label className="font-bold text-gray-300">Evidence Title</label>
                  <input type="text" placeholder="e.g. CCTV_Exit_Door_02.mp4" className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`} />
                  <label className="font-bold text-gray-300">Upload File</label>
                  <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-center text-gray-400">
                    <Upload size={24} className="text-[#FF5A1F]" />
                    <span>Drag & Drop file or click to browse</span>
                  </div>
                </div>
              )}

              {activeAddNewModalTab === 'Witness' && (
                <div className="flex flex-col gap-3 text-xs">
                  <label className="font-bold text-gray-300">Witness Name</label>
                  <input type="text" placeholder="e.g. Ramesh Kumar" className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`} />
                  <label className="font-bold text-gray-300">Witness Role / Type</label>
                  <input type="text" placeholder="e.g. Eyewitness / Neighbor" className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`} />
                  <label className="font-bold text-gray-300">Sec 161 CrPC Statement</label>
                  <textarea rows={3} placeholder="Type statement excerpt..." className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`} />
                </div>
              )}

              {activeAddNewModalTab === 'Suspect' && (
                <div className="flex flex-col gap-3 text-xs">
                  <label className="font-bold text-gray-300">Suspect Full Name</label>
                  <input type="text" placeholder="e.g. Suresh K." className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`} />
                  <label className="font-bold text-gray-300">Custody Status</label>
                  <select className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`}>
                    <option>Police Custody (Remand)</option>
                    <option>Judicial Custody</option>
                    <option>Released on Bail</option>
                    <option>Absconding</option>
                  </select>
                </div>
              )}

              {activeAddNewModalTab === 'FSL' && (
                <div className="flex flex-col gap-3 text-xs">
                  <label className="font-bold text-gray-300">Exhibit File / Material</label>
                  <input type="text" placeholder="e.g. Crowbar_Seized_P1.jpg" className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`} />
                  <label className="font-bold text-gray-300">Analysis Type Required</label>
                  <select className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`}>
                    <option>AFIS Fingerprint Minutiae Matching</option>
                    <option>Ballistics & Toolmark Examination</option>
                    <option>Chemical / Forensic Toxicology</option>
                    <option>Cyber Video Deepfake Detection</option>
                  </select>
                </div>
              )}

              {activeAddNewModalTab === 'Chargesheet' && (
                <div className="flex flex-col gap-3 text-xs">
                  <label className="font-bold text-gray-300">Court Jurisdiction</label>
                  <input type="text" placeholder="Hon'ble 10th ACMM Court, Bengaluru" className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`} />
                  <label className="font-bold text-gray-300">Prosecution Recommendation</label>
                  <textarea rows={3} placeholder="Charge accused under IPC 457, 380, 411 read with Sec 34..." className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`} />
                </div>
              )}

              {activeAddNewModalTab === 'Task' && (
                <div className="flex flex-col gap-3 text-xs">
                  <label className="font-bold text-gray-300">Task Title</label>
                  <input type="text" placeholder="e.g. Collect FSL Blood Sample Report" className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`} />
                  <label className="font-bold text-gray-300">Assignee</label>
                  <input type="text" placeholder="e.g. SI Naveen" className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`} />
                </div>
              )}

              {activeAddNewModalTab === 'Note' && (
                <div className="flex flex-col gap-3 text-xs">
                  <label className="font-bold text-gray-300">Case Diary Note Content</label>
                  <textarea
                    rows={4}
                    value={noteModalText}
                    onChange={(e) => setNoteModalText(e.target.value)}
                    placeholder="Type official investigation observation..."
                    className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`}
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  onClick={() => setActiveAddNewModalTab(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (activeAddNewModalTab === 'Note' && noteModalText.trim()) {
                      handleSaveNote(noteModalText, 'Field Note');
                    } else {
                      showToast(`Submitted ${activeAddNewModalTab} request for ${currentCase.firNumber}`);
                    }
                    setActiveAddNewModalTab(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer hover:bg-[#E04D18]"
                >
                  Save Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 2: WITNESS STATEMENT TRANSCRIPT MODAL --- */}
      <AnimatePresence>
        {selectedWitnessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-2xl border max-w-xl w-full flex flex-col gap-4 relative ${cardBg}`}
            >
              <button
                onClick={() => setSelectedWitnessModal(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-500 font-black text-base flex items-center justify-center">
                  {selectedWitnessModal.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-black">{selectedWitnessModal.name}</h3>
                  <p className="text-xs text-gray-400">{selectedWitnessModal.role} • {selectedWitnessModal.phone}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-white/10 text-xs flex flex-col gap-2">
                <div className="flex items-center justify-between font-mono text-[11px] text-emerald-400">
                  <span>Sec 161 CrPC Statement ({selectedWitnessModal.sec161Status})</span>
                  <span>{selectedWitnessModal.dateRecorded}</span>
                </div>
                <p className="text-gray-200 leading-relaxed font-sans">&quot;{selectedWitnessModal.statementText}&quot;</p>
              </div>

              {selectedWitnessModal.hasAudio && (
                <div className="p-3 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setIsPlayingAudio(!isPlayingAudio);
                        showToast(isPlayingAudio ? 'Paused audio playback' : `Playing statement audio recording (${selectedWitnessModal.audioDuration})`);
                      }}
                      className="w-8 h-8 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center cursor-pointer"
                    >
                      {isPlayingAudio ? <Pause size={14} /> : <Play size={14} className="fill-current" />}
                    </button>
                    <span className="font-mono text-gray-200">Audio Recording ({selectedWitnessModal.audioDuration})</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">100% Intelligible</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    openCopilot(`Draft interrogation or cross-examination strategy for witness ${selectedWitnessModal.name}`);
                    setSelectedWitnessModal(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles size={14} /> AI Question Strategy Draft
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 3: ACCUSED INTERROGATION DOSSIER MODAL --- */}
      <AnimatePresence>
        {selectedAccusedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-2xl border max-w-xl w-full flex flex-col gap-4 relative ${cardBg}`}
            >
              <button
                onClick={() => setSelectedAccusedModal(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <img src={selectedAccusedModal.photo} alt={selectedAccusedModal.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-red-500" />
                <div>
                  <h3 className="text-lg font-black">{selectedAccusedModal.name}</h3>
                  <p className="text-xs text-red-400 font-bold">{selectedAccusedModal.role}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-white/10 text-xs flex flex-col gap-2">
                <span className="font-bold text-gray-400 uppercase text-[10px] font-mono">Interrogation & Disclosure Excerpt (Sec 27 Evidence Act)</span>
                <p className="text-gray-200 leading-relaxed font-sans">{selectedAccusedModal.interrogationSummary}</p>
              </div>

              <div className="flex flex-col gap-1 text-xs font-mono">
                <span className="text-gray-400">Custody: <strong className="text-red-400">{selectedAccusedModal.custodyStatus}</strong></span>
                <span className="text-gray-400">Recovery: <strong className="text-emerald-400">{selectedAccusedModal.sec27Recovery}</strong></span>
              </div>

              <button
                onClick={() => {
                  openCopilot(`Generate customized interrogation plan for accused ${selectedAccusedModal.name}`);
                  setSelectedAccusedModal(null);
                }}
                className="w-full py-2.5 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles size={14} /> Generate Interrogation Plan
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 4: REPORT DOCUMENT VIEWER MODAL --- */}
      <AnimatePresence>
        {selectedReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-2xl border max-w-2xl w-full flex flex-col gap-4 relative max-h-[85vh] overflow-y-auto ${cardBg}`}
            >
              <button
                onClick={() => setSelectedReportModal(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="text-base font-black pr-8">{selectedReportModal.title}</h3>

              <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400 border border-white/10 whitespace-pre-wrap leading-relaxed">
                {selectedReportModal.previewContent}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                <span>Doc ID: {selectedReportModal.docNo}</span>
                <span>Certified on: {selectedReportModal.date}</span>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => showToast('Printing Official Certified Document...')}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer size={14} /> Print Document
                </button>

                <button
                  onClick={() => showToast('Downloaded PDF to Local Station')}
                  className="flex-1 py-2.5 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-[#E04D18]"
                >
                  <FileDown size={14} /> Download PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 5: EVIDENCE LIGHTBOX MODAL --- */}
      <AnimatePresence>
        {selectedEvidence && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-2xl border max-w-xl w-full flex flex-col gap-4 relative ${cardBg}`}
            >
              <button
                onClick={() => setSelectedEvidence(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="text-lg font-black pr-8">{selectedEvidence.title}</h3>

              <div className="w-full h-64 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
                <img src={selectedEvidence.img} alt={selectedEvidence.title} referrerPolicy="no-referrer" className="w-full h-full object-contain" />
              </div>

              <div className="flex flex-col gap-1 text-xs text-gray-400 font-mono">
                <span>Category: {selectedEvidence.category} • Size: {selectedEvidence.type}</span>
                <span className="text-emerald-400 font-bold">Chain of Custody: {selectedEvidence.custodyBadge}</span>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => {
                    openCopilot(`Run AI scan on evidence item ${selectedEvidence.title}`);
                    setSelectedEvidence(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles size={14} /> Analyze with Copilot
                </button>

                <button
                  onClick={() => {
                    showToast('Downloaded evidence file to workstation');
                    setSelectedEvidence(null);
                  }}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer ${
                    isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-gray-100 border-gray-200'
                  }`}
                >
                  Download
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 6: ADD TIMELINE MILESTONE MODAL --- */}
      <AnimatePresence>
        {showAddTimelineModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-2xl border max-w-md w-full flex flex-col gap-4 relative ${cardBg}`}
            >
              <button
                onClick={() => setShowAddTimelineModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="text-base font-black">Add Timeline Milestone Event</h3>

              <div className="flex flex-col gap-3 text-xs">
                <input
                  type="text"
                  value={newTimelineTitle}
                  onChange={(e) => setNewTimelineTitle(e.target.value)}
                  placeholder="Event Title (e.g. Seizure of Getaway Scooter)"
                  className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`}
                />
                <input
                  type="text"
                  value={newTimelineTime}
                  onChange={(e) => setNewTimelineTime(e.target.value)}
                  placeholder="Timestamp (e.g. 19 Jul 2025, 02:00 PM)"
                  className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`}
                />
                <select
                  value={newTimelineCat}
                  onChange={(e) => setNewTimelineCat(e.target.value)}
                  className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`}
                >
                  <option value="FIR & Legal">FIR & Legal</option>
                  <option value="CCTV & Surveillance">CCTV & Surveillance</option>
                  <option value="Forensics & FSL">Forensics & FSL</option>
                  <option value="Arrest & Custody">Arrest & Custody</option>
                </select>
                <textarea
                  rows={3}
                  value={newTimelineDesc}
                  onChange={(e) => setNewTimelineDesc(e.target.value)}
                  placeholder="Event description and details..."
                  className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-slate-50 border-gray-300'}`}
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowAddTimelineModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (newTimelineTitle.trim()) {
                      const newEv = {
                        id: `E${Date.now()}`,
                        title: newTimelineTitle.trim(),
                        timestamp: newTimelineTime.trim() || 'Just Now',
                        category: newTimelineCat,
                        officer: 'Inspector Arjun',
                        desc: newTimelineDesc.trim() || 'Custom investigation milestone added by officer.',
                        icon: Clock,
                        color: 'text-amber-500 bg-amber-500/10'
                      };
                      setTimelineEvents([newEv, ...timelineEvents]);
                      showToast('Added Milestone to Investigation Timeline');
                      setNewTimelineTitle('');
                      setNewTimelineTime('');
                      setNewTimelineDesc('');
                      setShowAddTimelineModal(false);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer hover:bg-[#E04D18]"
                >
                  Save Milestone
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
