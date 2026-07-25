'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Search,
  Filter,
  FileText,
  Bookmark,
  Share2,
  Download,
  Plus,
  Scale,
  ShieldCheck,
  Cpu,
  Sparkles,
  ExternalLink,
  ChevronRight,
  X,
  Check,
  Copy,
  FolderOpen,
  HelpCircle,
  AlertTriangle,
  Globe,
  HardDrive,
  Mail,
  MessageSquare,
  CheckSquare,
  StickyNote,
  FileSpreadsheet,
  Calendar,
  Layers,
  ArrowRight,
  Eye,
  Gavel,
  BookMarked,
  Tag,
  Zap
} from 'lucide-react';

import { useUIStore } from '@/lib/stores/uiStore';
import { useInvestigationStore } from '@/lib/stores/investigationStore';
import { type KSPCase } from '@/lib/data/realCases';
import GoogleDocsPanel from '@/components/workspace/GoogleDocsPanel';
import GoogleSheetsPanel from '@/components/workspace/GoogleSheetsPanel';
import GmailPanel from '@/components/workspace/GmailPanel';
import GoogleChatPanel from '@/components/workspace/GoogleChatPanel';
import GoogleTasksPanel from '@/components/workspace/GoogleTasksPanel';
import GoogleDriveEvidencePanel from '@/components/workspace/GoogleDriveEvidencePanel';
import GoogleCalendarWidget from '@/components/workspace/GoogleCalendarWidget';
import GoogleKeepNotesPanel from '@/components/workspace/GoogleKeepNotesPanel';

export interface KBArticle {
  id: string;
  title: string;
  category: 'BNS_IPC' | 'SOP' | 'CASE_LAW' | 'MODUS_OPERANDI' | 'CYBER_CRIME' | 'CIRCULAR';
  actName: string;
  sectionCode?: string;
  oldIpcEquivalent?: string;
  summary: string;
  fullContent: string;
  author: string;
  updatedDate: string;
  tags: string[];
  isBookmarked?: boolean;
  cognizable?: 'COGNIZABLE' | 'NON-COGNIZABLE';
  bailable?: 'BAILABLE' | 'NON-BAILABLE';
  punishment?: string;
  keyRatio?: string;
  complianceChecklist?: string[];
}

const buildArticles = (activeCase: KSPCase, availableCases: KSPCase[]): KBArticle[] => [
  {
    id: 'kb-1',
    title: `${activeCase.sections.join(' / ')} Comparison & Charging Guidelines`,
    category: 'BNS_IPC',
    actName: 'Bharatiya Nyaya Sanhita 2023',
    sectionCode: activeCase.sections[0] || 'BNS',
    oldIpcEquivalent: 'IPC Equivalents',
    summary: 'Detailed statutory provisions of theft under BNS 2023 including enhanced provisions for snatching (BNS 304) and repeat offender bail grounds.',
    fullContent: `UNDER BHARATIYA NYAYA SANHITA (BNS) 2023:
- BNS 303(1): Definition of Theft. Whoever, intending to take dishonestly any movable property out of the possession of any person without that person's consent, moves that property in order to such taking.
- BNS 303(2): Punishment for theft - imprisonment up to 3 years, or with fine, or both. For second or subsequent conviction, imprisonment shall not be less than 1 year and may extend to 5 years.
- BNS 304: Snatching (NEW DISTINCT OFFENCE). When theft is committed by sudden or quick or forcible seizure of property from person. Non-bailable, punishable up to 3 years.

PROCEDURAL COMPLIANCE UNDER BNSS 2023:
1. Ensure e-FIR or physical FIR registers exact time and GPS location of snatching/theft.
2. Property Seizure Memo (Panchanama) to be digitally certified under BSA Section 61 (formerly Indian Evidence Act Sec 65B).
3. First Information Report copy to be transmitted to Judicial Magistrate within 24 hours via CCTNS / e-Courts portal.`,
    author: 'KSP Legal Cell & DG-IGP Office',
    updatedDate: '10 Jul 2025',
    tags: ['BNS 303', 'Theft', 'BNS 304', 'Snatching', 'IPC 378', 'Panchanama'],
    isBookmarked: true,
    cognizable: 'COGNIZABLE',
    bailable: 'NON-BAILABLE',
    punishment: 'Imprisonment up to 3 years + Fine'
  },
  {
    id: 'kb-2',
    title: 'Crime Scene Preservation & Digital Evidence Seizure Protocol (BNSS 105 & BSA 61)',
    category: 'SOP',
    actName: 'BNSS 2023 & BSA 2023',
    sectionCode: 'SOP-014/KSP',
    summary: 'Mandatory standard procedures for securing physical crime scenes, collecting fingerprints, and seizing digital devices with Hash Value verification.',
    fullContent: `MANDATORY CRIME SCENE PROCEDURES FOR INVESTIGATING OFFICERS (IOs):
1. CRIME SCENE CORDONING: Secure perimeter using yellow police tape immediately upon arrival. Limit access exclusively to Scientific Officer / FSL team.
2. PHOTOGRAPHY & VIDEOGRAPHY (BNSS SEC 105): Search and seizure MUST be audio-video recorded using official tablet/smartphone camera via KSP e-Evidence App.
3. DIGITAL EVIDENCE HANDLING:
   - Mobile phones: Immediately place in Faraday Isolation Shield Bag or switch to Airplane Mode. Do NOT attempt passcode guessing.
   - Laptops/Hard Drives: Record exact timestamp, system time difference, and MAC address. Generate SHA-256 Hash checksum prior to sealing.
4. CHAIN OF CUSTODY LOG: Fill Form KSP-404 detailing Officer Name, Date, Time, and Evidence Locker Seal ID.`,
    author: 'FSL Bengaluru & KSP Technical Bureau',
    updatedDate: '01 Jun 2025',
    tags: ['Crime Scene', 'Digital Evidence', 'BSA Sec 61', 'FSL', 'Faraday Bag', 'Hash Value'],
    isBookmarked: true,
    complianceChecklist: [
      'Cordon off crime scene with cordon tape',
      'Enable audio-video recording under BNSS 105',
      'Place mobile handsets in Faraday Shield Bag',
      'Generate SHA-256 Hash value for storage drives',
      'Complete Evidence Locker Chain of Custody Form'
    ]
  },
  {
    id: 'kb-3',
    title: 'Cyber Crime 1930 Helpline & Financial Freeze Procedure for Bank Accounts',
    category: 'CYBER_CRIME',
    actName: 'IT Act 2000 / BNS 318(4)',
    sectionCode: 'SOP-CYBER-09',
    summary: 'Fast-track protocol for IOs to request immediate lien/freeze on beneficiary bank accounts via National Cyber Crime Reporting Portal (NCRP).',
    fullContent: `STEPS FOR IMMEDIATE FINANCIAL FRAUD FREEZE:
1. MANDATORY GOLDEN HOUR ACTION: If fraud reported within 24 hours, log in to NCRP / 1930 Financial Fraud Module.
2. TRANSACTION ROUTING IDENTIFICATION: Extract UTR / RRN numbers from victim's bank statement.
3. LIEN CREATION REQUISITION: Issue immediate notice under BNSS Sec 94 (formerly CrPC 91) to Nodal Officer of destination bank / payment gateway (PhonePe, GPay, Paytm).
4. MAPPING MONEY TRAIL: Trace Layer-1 to Layer-3 mule accounts. Request freezing of suspect wallet balances.
5. COURT RECLAIM (BNSS 503): File application before Magistrate for refund of frozen money to victim account under proper indemnity bond.`,
    author: 'Cyber Crime CID Bengaluru',
    updatedDate: '15 Jul 2025',
    tags: ['1930 Helpline', 'Cyber Fraud', 'Bank Freeze', 'NCRP', 'UTRN', 'Mule Account'],
    isBookmarked: false,
    complianceChecklist: [
      'Obtain victim bank statement & UTR numbers',
      'Enter complaint on 1930 Portal within Golden Hour',
      'Issue Sec 94 BNSS notice to Bank Nodal Officers',
      'Freeze Layer-1 & Layer-2 beneficiary accounts',
      'File refund application under BNSS Sec 503'
    ]
  },
  {
    id: 'kb-4',
    title: 'Supreme Court Landmark Guidelines on Arrest: Arnesh Kumar vs State of Bihar & BNSS Sec 35',
    category: 'CASE_LAW',
    actName: 'BNSS 2023 Sec 35 / CrPC 41A',
    sectionCode: '2014 (8) SCC 273',
    summary: 'Mandatory prerequisites before making arrest in offences punishable with less than 7 years imprisonment. Notice of Appearance requirements.',
    fullContent: `KEY RATIO & MANDATORY INSTRUCTIONS FOR POLICE OFFICERS:
1. NO AUTOMATIC ARREST: Arrest should not be made automatically when a case under section punishable with imprisonment up to 7 years is registered.
2. NOTICE OF APPEARANCE (BNSS SEC 35(3)): IO must serve Notice of Appearance within 14 days of FIR registration to suspect.
3. CHECKLIST OF REASONS: If arrest becomes strictly necessary (e.g. risk of absconding or tampering with evidence), IO must record written reasons in police diary and present to Magistrate.
4. MAGISTRATE SCRUTINY: Magistrates shall not authorize detention without recording satisfaction regarding necessity of arrest.
5. PENALTY FOR NON-COMPLIANCE: Departmental proceedings and contempt of court proceedings against defaulting Police Officers.`,
    author: 'Supreme Court of India / KSP Legal Manual',
    updatedDate: '20 May 2025',
    tags: ['Arnesh Kumar', 'Arrest Guidelines', 'BNSS Sec 35', 'Notice of Appearance', 'Bail'],
    isBookmarked: true,
    keyRatio: 'Arrest is not mandatory for offences punishable with up to 7 years imprisonment without recording strict statutory necessity.'
  },
  {
    id: 'kb-5',
    title: `${availableCases[2]?.crimeSubHead || 'Cyber Scam'} - Modus Operandi & Investigation Playbook`,
    category: 'MODUS_OPERANDI',
    actName: 'IT Act 2000 / BNS',
    sectionCode: 'MO-GANG-088',
    summary: `Deconstruction of cyber syndicate tactics related to ${availableCases[2]?.crimeSubHead || 'Cyber Crimes'}. Reference FIR ${availableCases[2]?.crimeNo || 'N/A'}.`,
    fullContent: `MODUS OPERANDI BREAKDOWN:
1. INITIAL CONTACT: Suspect approaches victim via digital channels.
2. IMPERSONATION: Suspects impersonate officials or trusted entities.
3. EXTORTION TRANSACTIONS: Victim coerced into transferring funds to mule accounts.

INVESTIGATION ACTION POINTS:
- Request IP logs and VOIP call origin details from Whatsapp / Microsoft Skype Legal Teams.
- Track mule account withdrawal ATM locations.
- Correlate phone numbers with National SIM Subscriber database (ASTR AI Portal).
- Active Case Reference: ${availableCases[2]?.crimeNo || 'N/A'}`,
    author: 'Karnataka Internal Security Division (ISD)',
    updatedDate: '04 Jul 2025',
    tags: ['Cyber Scam', 'Mule Account', 'VoIP Log', 'IT Act'],
    isBookmarked: false
  },
  {
    id: 'kb-6',
    title: 'DG-IGP Circular: Zero FIR Registration & Jurisdiction Neutrality in Emergency Cases',
    category: 'CIRCULAR',
    actName: 'BNSS 2023 Sec 173(1)',
    sectionCode: 'KSP-CIRCULAR-2025-09',
    summary: 'Mandatory directive to register Zero FIR irrespective of territorial jurisdiction when cognizable crime is reported at any KSP station.',
    fullContent: `CIRCULAR DIRECTIVE FROM OFFICE OF THE DG & IGP KARNATAKA:
1. ZERO FIR MANDATE: Any victim or informant approaching a police station must be permitted to register an FIR immediately regardless of where the crime occurred.
2. CCTNS ENTRY: Enter the FIR in CCTNS as "Zero FIR" (Numbering system: 0000/2025).
3. IMMEDIATE INVESTIGATION: Initiate medical examination, crime scene preservation, or victim protection without waiting for territorial transfer.
4. TRANSFER WITHIN 24 HOURS: Transmit physical file, digital logs, and evidence to jurisdictional police station via CCTNS transfer protocol.
5. NON-COMPLIANCE ACTION: Refusal to register Zero FIR shall attract disciplinary action under Karnataka Police Act Section 20.`,
    author: 'DG & IGP Office Bengaluru',
    updatedDate: '12 Jan 2025',
    tags: ['Zero FIR', 'BNSS 173', 'Jurisdiction', 'CCTNS', 'DG IGP Circular'],
    isBookmarked: true
  }
];

export default function KnowledgeBaseWorkspace() {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const showToast = useUIStore((s) => s.showToast);
  const openCopilot = useUIStore((s) => s.openCopilot);
  const activeCase = useInvestigationStore(s => s.activeCase)!;
  const availableCases = useInvestigationStore(s => s.cases);

  // Main Active Tab
  const [activeTab, setActiveTab] = useState<'All Articles' | 'BNS vs IPC Laws' | 'SOPs & Manuals' | 'Case Law Precedents' | 'Modus Operandi'>('All Articles');

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  // Modal States
  const [selectedArticle, setSelectedArticle] = useState<KBArticle | null>(null);
  const [isAddArticleOpen, setIsAddArticleOpen] = useState(false);

  // Workspace Suite State
  const [isWorkspaceSuiteOpen, setIsWorkspaceSuiteOpen] = useState(false);
  const [workspaceSuiteTab, setWorkspaceSuiteTab] = useState<'Docs' | 'Sheets' | 'Gmail' | 'Chat' | 'Tasks' | 'Drive' | 'Calendar' | 'Keep'>('Docs');

  // New Article Form
  const [newTitle, setNewTitle] = useState('');
  const [newActName, setNewActName] = useState('Bharatiya Nyaya Sanhita (BNS) 2023');
  const [newSectionCode, setNewSectionCode] = useState('');
  const [newCategory, setNewCategory] = useState<KBArticle['category']>('BNS_IPC');
  const [newSummary, setNewSummary] = useState('');
  const [newFullContent, setNewFullContent] = useState('');

  // Knowledge Base Master Data (KSP Law Enforcement Specific)
  // We moved buildArticles outside the component

  // Knowledge Base Master Data (KSP Law Enforcement Specific)
  const [articles, setArticles] = useState<KBArticle[]>(() => buildArticles(activeCase, availableCases));

  // Update articles on case change
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setArticles(buildArticles(activeCase, availableCases));
    }, 0);
    return () => clearTimeout(timer);
  }, [activeCase, availableCases]);

  // Toggle Bookmark State
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isBookmarked: !a.isBookmarked } : a))
    );
    showToast('Updated article bookmark');
  };

  // Add Article Handler
  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newFullContent.trim()) return;

    const article: KBArticle = {
      id: `kb-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      actName: newActName.trim() || 'Karnataka Police Manual',
      sectionCode: newSectionCode.trim() || 'KSP-NOTE',
      summary: newSummary.trim() || newFullContent.slice(0, 140) + '...',
      fullContent: newFullContent.trim(),
      author: 'Inspector Arjun (KR Puram PS)',
      updatedDate: 'Just Now',
      tags: ['Custom Note', newCategory],
      isBookmarked: true
    };

    setArticles((prev) => [article, ...prev]);
    setIsAddArticleOpen(false);
    setNewTitle('');
    setNewSummary('');
    setNewFullContent('');
    setNewSectionCode('');
    showToast(`Added "${article.title}" to Knowledge Base`);
  };

  // Filter Articles
  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.actName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.sectionCode && art.sectionCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ALL' || art.category.toUpperCase() === selectedCategory.toUpperCase();

    const matchesTab =
      activeTab === 'All Articles' ||
      (activeTab === 'BNS vs IPC Laws' && art.category === 'BNS_IPC') ||
      (activeTab === 'SOPs & Manuals' && (art.category === 'SOP' || art.category === 'CIRCULAR')) ||
      (activeTab === 'Case Law Precedents' && art.category === 'CASE_LAW') ||
      (activeTab === 'Modus Operandi' && (art.category === 'MODUS_OPERANDI' || art.category === 'CYBER_CRIME'));

    const matchesBookmark = !onlyBookmarked || art.isBookmarked;

    return matchesSearch && matchesCategory && matchesTab && matchesBookmark;
  });

  // Card theme classes
  const cardBg = isDarkMode ? 'bg-[#111827] border-gray-800 text-white' : 'bg-white border-gray-200 text-slate-900';
  const subCardBg = isDarkMode ? 'bg-[#1F2937]/60 border-gray-800' : 'bg-slate-50 border-slate-200';

  return (
    <div className="flex-1 p-4 lg:p-6 flex flex-col gap-6 max-w-[1800px] w-full mx-auto">
      {/* TOP HEADER & BREADCRUMB */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400 font-mono">
            <span className="hover:text-[#FF5A1F] cursor-pointer transition-colors">ArcCraft Legal &amp; Intel</span>
            <span>&gt;</span>
            <span className="text-slate-800 dark:text-gray-200 font-bold">KSP Knowledge Base</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center border border-[#FF5A1F]/30 shadow-xs">
              <BookOpen size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">KSP Legal &amp; Tactical Knowledge Base</h1>
                <span className="text-[10px] font-mono font-bold text-[#FF5A1F] bg-[#FF5A1F]/10 px-2.5 py-0.5 rounded-full border border-[#FF5A1F]/20 uppercase tracking-wide">
                  BNS 2023 READY
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                Karnataka State Police Legal Repository &bull; BNS/BNSS Statutory Lookup &bull; Crime SOPs &bull; High Court Precedents
              </p>
            </div>
          </div>
        </div>

        {/* TOP ACTION BUTTONS */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsWorkspaceSuiteOpen(!isWorkspaceSuiteOpen)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-bold hover:border-[#FF5A1F] transition-all cursor-pointer bg-gray-100 dark:bg-gray-900 text-slate-700 dark:text-gray-300"
          >
            <Globe size={14} className="text-[#FF5A1F]" />
            <span>Workspace Suite</span>
          </button>

          <button
            onClick={() => {
              showToast('Exported KSP Law & SOP Compendium PDF');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-bold hover:border-gray-600 transition-all cursor-pointer bg-gray-100 dark:bg-gray-900 text-slate-700 dark:text-gray-300"
          >
            <Download size={14} />
            <span>Export Laws PDF</span>
          </button>

          <button
            onClick={() => setIsAddArticleOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-[#FF5A1F]/20"
          >
            <Plus size={15} />
            <span>Add Legal Entry / SOP</span>
          </button>
        </div>
      </div>

      {/* QUICK STATS CARDS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm ${cardBg}`}>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 uppercase">Total Articles &amp; SOPs</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{articles.length + 336}</span>
            <span className="text-[10px] font-medium text-emerald-500 dark:text-emerald-400">Updated for 2025</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <Scale size={20} />
          </div>
        </div>

        <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm ${cardBg}`}>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 uppercase">BNS vs IPC Mappings</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">120</span>
            <span className="text-[10px] font-medium text-blue-500 dark:text-blue-400">100% Cross-Indexed</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <Gavel size={20} />
          </div>
        </div>

        <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm ${cardBg}`}>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 uppercase">Crime Scene &amp; Cyber SOPs</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">85</span>
            <span className="text-[10px] font-medium text-amber-500 dark:text-amber-400">Step-by-step checklists</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <ShieldCheck size={20} />
          </div>
        </div>

        <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm ${cardBg}`}>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 uppercase">Judgments &amp; Precedents</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">54</span>
            <span className="text-[10px] font-medium text-emerald-500 dark:text-emerald-400">SC &amp; High Court Rulings</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <BookMarked size={20} />
          </div>
        </div>
      </div>

      {/* SUB-NAVIGATION CATEGORY TABS */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-1">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {(['All Articles', 'BNS vs IPC Laws', 'SOPs & Manuals', 'Case Law Precedents', 'Modus Operandi'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                showToast(`Viewing Knowledge Base: ${tab}`);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab
                  ? 'text-[#FF5A1F] bg-[#FF5A1F]/5 border-b-2 border-[#FF5A1F]'
                  : 'text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* BOOKMARK FILTER TOGGLE */}
        <button
          onClick={() => {
            setOnlyBookmarked(!onlyBookmarked);
            showToast(onlyBookmarked ? 'Showing all articles' : 'Showing bookmarked items');
          }}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
            onlyBookmarked
              ? 'bg-[#FF5A1F]/10 border-[#FF5A1F] text-[#FF5A1F]'
              : 'bg-slate-100 dark:bg-gray-900 border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bookmark size={13} className={onlyBookmarked ? 'fill-[#FF5A1F]' : ''} />
          <span>Bookmarked ({articles.filter((a) => a.isBookmarked).length})</span>
        </button>
      </div>

      {/* EXPANDABLE GOOGLE WORKSPACE SUITE */}
      <AnimatePresence>
        {isWorkspaceSuiteOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-5 rounded-2xl border flex flex-col gap-4 shadow-xl overflow-hidden ${cardBg}`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center font-black text-xs">
                  G
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-gray-300">
                    KSP GOOGLE WORKSPACE LEGAL SUITE INTEGRATION
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-gray-400">Access Charge-Sheet Requisition Templates, Circular Drive &amp; Legal Notes</p>
                </div>
              </div>

              <button onClick={() => setIsWorkspaceSuiteOpen(false)} className="text-slate-400 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setWorkspaceSuiteTab('Docs')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  workspaceSuiteTab === 'Docs' ? 'bg-[#FF5A1F] text-white shadow-xs' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText size={13} />
                <span>Docs</span>
              </button>

              <button
                onClick={() => setWorkspaceSuiteTab('Keep')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  workspaceSuiteTab === 'Keep' ? 'bg-[#FF5A1F] text-white shadow-xs' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <StickyNote size={13} />
                <span>Keep Notes</span>
              </button>

              <button
                onClick={() => setWorkspaceSuiteTab('Drive')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  workspaceSuiteTab === 'Drive' ? 'bg-[#FF5A1F] text-white shadow-xs' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <HardDrive size={13} />
                <span>Drive</span>
              </button>

              <button
                onClick={() => setWorkspaceSuiteTab('Sheets')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  workspaceSuiteTab === 'Sheets' ? 'bg-[#FF5A1F] text-white shadow-xs' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileSpreadsheet size={13} />
                <span>Sheets</span>
              </button>

              <button
                onClick={() => setWorkspaceSuiteTab('Calendar')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  workspaceSuiteTab === 'Calendar' ? 'bg-[#FF5A1F] text-white shadow-xs' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Calendar size={13} />
                <span>Calendar</span>
              </button>

              <button
                onClick={() => setWorkspaceSuiteTab('Tasks')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  workspaceSuiteTab === 'Tasks' ? 'bg-[#FF5A1F] text-white shadow-xs' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <CheckSquare size={13} />
                <span>Tasks</span>
              </button>

              <button
                onClick={() => setWorkspaceSuiteTab('Gmail')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  workspaceSuiteTab === 'Gmail' ? 'bg-[#FF5A1F] text-white shadow-xs' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Mail size={13} />
                <span>Gmail</span>
              </button>

              <button
                onClick={() => setWorkspaceSuiteTab('Chat')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  workspaceSuiteTab === 'Chat' ? 'bg-[#FF5A1F] text-white shadow-xs' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <MessageSquare size={13} />
                <span>Chat</span>
              </button>
            </div>

            <div className="pt-2">
              {workspaceSuiteTab === 'Docs' && <GoogleDocsPanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Keep' && <GoogleKeepNotesPanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Drive' && <GoogleDriveEvidencePanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Sheets' && <GoogleSheetsPanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Calendar' && <GoogleCalendarWidget isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Tasks' && <GoogleTasksPanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Gmail' && <GmailPanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
              {workspaceSuiteTab === 'Chat' && <GoogleChatPanel isDarkMode={isDarkMode} subCardBg={subCardBg} showToast={showToast} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCH AND QUICK FILTER CONTROLS */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm ${cardBg}`}>
        {/* LIVE SEARCH BAR */}
        <div className="relative w-full md:w-96">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-400 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Search BNS/IPC sections, SOPs, case laws, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs border outline-none focus:border-[#FF5A1F] transition-all ${
              isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
            }`}
          />
        </div>

        {/* CATEGORY SELECTOR & QUICK TAGS */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`px-3 py-2 rounded-xl text-xs border outline-none font-medium cursor-pointer ${
              isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
            }`}
          >
            <option value="ALL">All Categories</option>
            <option value="BNS_IPC">BNS vs IPC Statutory Laws</option>
            <option value="SOP">Standard Operating Procedures (SOP)</option>
            <option value="CYBER_CRIME">Cyber Crime &amp; Financial Protocols</option>
            <option value="CASE_LAW">Supreme Court / HC Judgments</option>
            <option value="MODUS_OPERANDI">Modus Operandi &amp; Gang Manuals</option>
            <option value="CIRCULAR">KSP Circulars &amp; Directives</option>
          </select>

          <button
            onClick={() => {
              setSearchQuery('BNS 303');
              showToast('Filtering for BNS Theft provisions');
            }}
            className="px-3 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold hover:bg-blue-500/20 cursor-pointer"
          >
            #BNS 303
          </button>

          <button
            onClick={() => {
              setSearchQuery('BNSS 105');
              showToast('Filtering for Digital Crime Scene Recording SOP');
            }}
            className="px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 cursor-pointer"
          >
            #BNSS 105
          </button>

          <button
            onClick={() => {
              setSearchQuery('Arnesh Kumar');
              showToast('Filtering for Arrest Guidelines');
            }}
            className="px-3 py-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-bold hover:bg-purple-500/20 cursor-pointer"
          >
            #Arnesh Kumar
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN GRID: ARTICLES LIST (8 COLS) + AI ASSISTANT / QUICK REFERENCE (4 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: KNOWLEDGE BASE CARDS LIST (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {filteredArticles.length === 0 ? (
            <div className={`p-12 rounded-2xl border text-center flex flex-col items-center justify-center gap-3 ${cardBg}`}>
              <AlertTriangle size={32} className="text-amber-500" />
              <h3 className="text-base font-bold">No Legal Articles Match Search</h3>
              <p className="text-xs text-gray-400 max-w-sm">
                Try searching for general terms like &quot;Theft&quot;, &quot;Arrest&quot;, &quot;Cyber&quot;, or clear your search filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                  setOnlyBookmarked(false);
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl border flex flex-col gap-3 transition-all hover:border-[#FF5A1F]/50 group relative shadow-md ${cardBg}`}
              >
                {/* ARTICLE TOP HEADER BADGES & TITLE */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border bg-[#FF5A1F]/10 text-[#FF5A1F] border-[#FF5A1F]/20">
                        {article.actName}
                      </span>

                      {article.sectionCode && (
                        <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border bg-blue-500/10 text-blue-400 border-blue-500/20">
                          {article.sectionCode}
                        </span>
                      )}

                      {article.oldIpcEquivalent && (
                        <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border bg-purple-500/10 text-purple-400 border-purple-500/20">
                          Formerly {article.oldIpcEquivalent}
                        </span>
                      )}

                      {article.cognizable && (
                        <span
                          className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-md ${
                            article.cognizable === 'COGNIZABLE'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : 'bg-gray-800 text-gray-400'
                          }`}
                        >
                          {article.cognizable}
                        </span>
                      )}
                    </div>

                    <h2
                      onClick={() => setSelectedArticle(article)}
                      className="text-base font-black text-slate-900 dark:text-white group-hover:text-[#FF5A1F] transition-colors cursor-pointer leading-snug"
                    >
                      {article.title}
                    </h2>
                  </div>

                  {/* BOOKMARK ICON BUTTON */}
                  <button
                    onClick={(e) => toggleBookmark(article.id, e)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-[#FF5A1F] cursor-pointer"
                    title={article.isBookmarked ? 'Remove Bookmark' : 'Bookmark Article'}
                  >
                    <Bookmark
                      size={18}
                      className={article.isBookmarked ? 'fill-[#FF5A1F] text-[#FF5A1F]' : ''}
                    />
                  </button>
                </div>

                {/* SUMMARY STATEMENT */}
                <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed line-clamp-2">
                  {article.summary}
                </p>

                {/* KEY HIGHLIGHT / COMPLIANCE MINI BOX */}
                {article.complianceChecklist && (
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 flex flex-col gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1">
                      <Check size={12} />
                      <span>IO Compliance Checklist ({article.complianceChecklist.length} steps)</span>
                    </span>
                    <ul className="text-[11px] text-slate-700 dark:text-gray-300 list-disc list-inside space-y-0.5">
                      {article.complianceChecklist.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="truncate">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* BOTTOM METADATA & ACTIONS */}
                <div className="flex items-center justify-between border-t border-slate-200 dark:border-gray-800 pt-3 text-xs text-slate-500 dark:text-gray-400">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[11px] font-medium">
                      By <span className="text-slate-900 dark:text-gray-200 font-bold">{article.author}</span>
                    </span>
                    <span>&bull;</span>
                    <span className="text-[11px] font-mono">{article.updatedDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedArticle(article)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-gray-900 border border-slate-300 dark:border-gray-700 hover:border-[#FF5A1F] text-xs font-bold text-slate-800 dark:text-gray-200 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Eye size={13} />
                      <span>Read Article</span>
                    </button>

                    <button
                      onClick={() => {
                        openCopilot(`Explain statutory requirements for ${article.title}`);
                      }}
                      className="p-1.5 rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F] hover:bg-[#FF5A1F]/20 cursor-pointer"
                      title="Ask Copilot regarding this legal provision"
                    >
                      <Sparkles size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* RIGHT COLUMN: AI LEGAL ASSISTANT & QUICK LAW LOOKUP (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* AI BNS LEGAL COPILOT ASSISTANT CARD */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-4 shadow-xl relative overflow-hidden ${
            isDarkMode
              ? 'bg-gradient-to-br from-[#FF5A1F]/15 via-[#111827] to-[#111827] border-[#FF5A1F]/30'
              : 'bg-gradient-to-br from-[#FF5A1F]/10 via-orange-50/50 to-white border-[#FF5A1F]/30'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#FF5A1F] animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF5A1F]">
                  BNS 2023 AI LEGAL COPILOT
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 bg-slate-200/60 dark:bg-black/40 px-2 py-0.5 rounded-md">
                KSP V2.4
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-gray-200 leading-relaxed">
              Ask ArcCraft Copilot to match old IPC charges to new BNS 2023 sections or generate grounds for opposing bail under BNSS.
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={() =>
                  openCopilot(
                    'Provide exact BNS 2023 section, punishment, and bailable status for house burglary committed at night with theft.'
                  )
                }
                className="w-full text-left p-2.5 rounded-xl bg-white/80 dark:bg-gray-900/80 border border-slate-200 dark:border-gray-800 hover:border-[#FF5A1F] text-xs text-slate-800 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer flex items-center justify-between group"
              >
                <span>Find BNS section for House Burglary &amp; Theft</span>
                <ChevronRight size={14} className="text-[#FF5A1F] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() =>
                  openCopilot(
                    'Draft a 5-point statutory bail objection checklist under BNSS Sec 480 for repeat offender in theft case.'
                  )
                }
                className="w-full text-left p-2.5 rounded-xl bg-white/80 dark:bg-gray-900/80 border border-slate-200 dark:border-gray-800 hover:border-[#FF5A1F] text-xs text-slate-800 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer flex items-center justify-between group"
              >
                <span>Generate Grounds for Opposing Bail</span>
                <ChevronRight size={14} className="text-[#FF5A1F] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() =>
                  openCopilot(
                    'Generate BSA Section 61 electronic evidence certificate template for CCTV video footage extraction.'
                  )
                }
                className="w-full text-left p-2.5 rounded-xl bg-white/80 dark:bg-gray-900/80 border border-slate-200 dark:border-gray-800 hover:border-[#FF5A1F] text-xs text-slate-800 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer flex items-center justify-between group"
              >
                <span>Draft BSA Sec 61 Electronic Evidence Certificate</span>
                <ChevronRight size={14} className="text-[#FF5A1F] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* IPC TO BNS 2023 CONVERSION TABLE QUICK CARD */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-3 shadow-xl ${cardBg}`}>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 border-b pb-2 border-gray-200 dark:border-gray-800">
              POPULAR STATUTORY QUICK LOOKUP
            </span>

            <div className="flex flex-col gap-2">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">IPC 378 / 379 (Theft)</span>
                  <span className="text-[10px] text-[#FF5A1F]">BNS 303(1) &amp; BNS 303(2)</span>
                </div>
                <span className="text-[10px] font-mono bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20 px-2 py-0.5 rounded-md">
                  Non-Bailable
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">IPC 420 (Cheating)</span>
                  <span className="text-[10px] text-[#FF5A1F]">BNS 318(4) Cheating</span>
                </div>
                <span className="text-[10px] font-mono bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md">
                  Up to 7 Yrs
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">CrPC 41A (Notice)</span>
                  <span className="text-[10px] text-[#FF5A1F]">BNSS 35(3) Notice</span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                  14 Days Notice
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Sec 65B Evidence Act</span>
                  <span className="text-[10px] text-[#FF5A1F]">BSA Section 61 Cert</span>
                </div>
                <span className="text-[10px] font-mono bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-md">
                  Mandatory Cert
                </span>
              </div>
            </div>
          </div>

          {/* KSP HELPLINE & REQUISITION QUICK DIRECTORY */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-3 shadow-xl ${cardBg}`}>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 border-b pb-2 border-gray-200 dark:border-gray-800">
              KSP SPECIALIST UNITS DIRECTORY
            </span>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800">
                <span className="text-slate-700 dark:text-gray-300 font-medium">Cyber Crime CID Nodal Desk</span>
                <span className="font-mono text-[#FF5A1F] font-bold">080-2220 0000</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800">
                <span className="text-slate-700 dark:text-gray-300 font-medium">State Forensic Science Lab (FSL)</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">fsl.ksp@gov.in</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800">
                <span className="text-slate-700 dark:text-gray-300 font-medium">Public Prosecutor Cell</span>
                <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">Ext. 402</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ARTICLE READER / FULL DETAIL MODAL */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-3xl p-6 sm:p-8 rounded-3xl border shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto ${cardBg}`}
            >
              {/* MODAL HEADER */}
              <div className="flex items-start justify-between border-b pb-4 border-slate-200 dark:border-gray-800 gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border bg-[#FF5A1F]/10 text-[#FF5A1F] border-[#FF5A1F]/20">
                      {selectedArticle.actName}
                    </span>
                    {selectedArticle.sectionCode && (
                      <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border bg-blue-500/10 text-blue-400 border-blue-500/20">
                        {selectedArticle.sectionCode}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{selectedArticle.title}</h2>
                  <span className="text-xs text-slate-500 dark:text-gray-400">
                    Authored by <span className="text-slate-800 dark:text-gray-200 font-bold">{selectedArticle.author}</span> &bull; Updated {selectedArticle.updatedDate}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-1 rounded-xl text-gray-400 hover:text-white cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* STATUTORY SUMMARY & KEY PARAMETERS */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selectedArticle.cognizable && (
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 flex flex-col gap-0.5">
                    <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 uppercase">Offence Type</span>
                    <span className="text-xs font-bold text-red-500 dark:text-red-400">{selectedArticle.cognizable}</span>
                  </div>
                )}

                {selectedArticle.bailable && (
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 flex flex-col gap-0.5">
                    <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 uppercase">Bail Terms</span>
                    <span className="text-xs font-bold text-amber-500 dark:text-amber-400">{selectedArticle.bailable}</span>
                  </div>
                )}

                {selectedArticle.punishment && (
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 flex flex-col gap-0.5 col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 uppercase">Statutory Term</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{selectedArticle.punishment}</span>
                  </div>
                )}
              </div>

              {/* MAIN CONTENT BODY */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-100 dark:bg-gray-900/80 border border-slate-200 dark:border-gray-800 text-xs sm:text-sm text-slate-800 dark:text-gray-200 leading-relaxed font-sans whitespace-pre-line">
                {selectedArticle.fullContent}
              </div>

              {/* COMPLIANCE CHECKLIST IF AVAILABLE */}
              {selectedArticle.complianceChecklist && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1.5">
                    <CheckSquare size={16} />
                    <span>INVESTIGATING OFFICER COMPLIANCE CHECKLIST</span>
                  </span>
                  <div className="flex flex-col gap-1.5 pt-1">
                    {selectedArticle.complianceChecklist.map((step, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-200">
                        <div className="w-4 h-4 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                          <Check size={10} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MODAL FOOTER BUTTONS */}
              <div className="flex items-center justify-between border-t border-slate-200 dark:border-gray-800 pt-4 flex-wrap gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedArticle.fullContent);
                    showToast('Copied full statutory text to clipboard for Charge-sheet');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-gray-900 border border-slate-300 dark:border-gray-700 hover:border-[#FF5A1F] text-xs font-bold text-slate-800 dark:text-white transition-all cursor-pointer flex items-center gap-2"
                >
                  <Copy size={14} />
                  <span>Copy Text for Charge-sheet</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      showToast('Generated encrypted Legal PDF document');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-gray-900 border border-slate-300 dark:border-gray-700 hover:border-gray-500 text-xs font-bold text-slate-800 dark:text-white transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Download size={14} />
                    <span>Download PDF</span>
                  </button>

                  <button
                    onClick={() => {
                      openCopilot(`Generate formal Charge-sheet legal summary based on ${selectedArticle.title}`);
                      setSelectedArticle(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-md shadow-[#FF5A1F]/20"
                  >
                    <Sparkles size={14} />
                    <span>Ask Copilot to Analyze</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE NEW ARTICLE MODAL */}
      <AnimatePresence>
        {isAddArticleOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-xl p-6 rounded-3xl border shadow-2xl flex flex-col gap-5 ${cardBg}`}
            >
              <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center font-black">
                    <Plus size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900 dark:text-white">Add Knowledge Base Entry</h2>
                    <span className="text-xs text-slate-500 dark:text-gray-400">KSP Station SOP &amp; Legal Reference Note</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsAddArticleOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddArticle} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-gray-300">Title / Section Headline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BNS Sec 304 Snatching Guidelines or Crime Scene SOP"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-gray-900 border border-slate-300 dark:border-gray-800 text-xs text-slate-900 dark:text-white outline-none focus:border-[#FF5A1F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-gray-300">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as KBArticle['category'])}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-gray-900 border border-slate-300 dark:border-gray-800 text-xs text-slate-900 dark:text-white outline-none focus:border-[#FF5A1F]"
                    >
                      <option value="BNS_IPC">BNS vs IPC Laws</option>
                      <option value="SOP">SOP &amp; Manual</option>
                      <option value="CYBER_CRIME">Cyber Crime Protocol</option>
                      <option value="CASE_LAW">Court Judgment</option>
                      <option value="MODUS_OPERANDI">Modus Operandi</option>
                      <option value="CIRCULAR">KSP Circular</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-gray-300">Section Code (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. BNS 304 or SOP-KSP-12"
                      value={newSectionCode}
                      onChange={(e) => setNewSectionCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-gray-900 border border-slate-300 dark:border-gray-800 text-xs text-slate-900 dark:text-white outline-none focus:border-[#FF5A1F]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-gray-300">Act / Authority Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Bharatiya Nyaya Sanhita 2023 or High Court Ruling"
                    value={newActName}
                    onChange={(e) => setNewActName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-gray-900 border border-slate-300 dark:border-gray-800 text-xs text-slate-900 dark:text-white outline-none focus:border-[#FF5A1F]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-gray-300">Short Summary</label>
                  <input
                    type="text"
                    placeholder="Brief 1-sentence synopsis..."
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-gray-900 border border-slate-300 dark:border-gray-800 text-xs text-slate-900 dark:text-white outline-none focus:border-[#FF5A1F]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-gray-300">Full Content &amp; Instructions</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter statutory text, compliance guidelines, or SOP steps..."
                    value={newFullContent}
                    onChange={(e) => setNewFullContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-gray-900 border border-slate-300 dark:border-gray-800 text-xs text-slate-900 dark:text-white outline-none focus:border-[#FF5A1F] resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddArticleOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-800 text-xs font-bold text-gray-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-xs font-bold cursor-pointer shadow-md shadow-[#FF5A1F]/20"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
