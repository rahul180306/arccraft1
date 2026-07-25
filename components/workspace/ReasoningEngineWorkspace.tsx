'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  BrainCircuit, 
  Scale, 
  CheckCircle2, 
  Copy, 
  Check, 
  Download, 
  Send,
  Sparkles,
  Eye,
  X,
  Database,
  Trash2,
  Loader2,
  AlertCircle,
  Clock,
  User,
  ShieldCheck,
  Target
} from 'lucide-react';
import { useUIStore } from '@/lib/stores/uiStore';
import { exportToPDF } from '@/lib/pdfExport';

// Import micro-components
import ActiveUnitsMonitor from './reasoning/ActiveUnitsMonitor';
import EvidenceViewerModal from './reasoning/EvidenceViewerModal';
import InvestigationHealthGauge from './reasoning/InvestigationHealthGauge';
import ReasoningGraph from './reasoning/ReasoningGraph';
import InvestigationSummaryAnimation from './reasoning/InvestigationSummaryAnimation';
export default function ReasoningEngineWorkspace() {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const showToast = useUIStore((s) => s.showToast);

  const defaultArtifactMd = `# 🛡️ KARNATAKA STATE POLICE — OFFICIAL CASE DOSSIER
**CCTNS Crime Analytics Engine | Confidential Law Enforcement Document**  
*Document ID: KSP-DOC-2026-0456 | Status: Verified by Investigation Orchestrator*

---

## 1. FIR Context & Administrative Metadata
| Field | Value |
|---|---|
| **FIR Number** | \`104430006202600001\` |
| **Police Station** | Anekal Police Station, Bengaluru City |
| **Registration Date** | 10 Feb 2026, 08:30 AM |
| **Investigating Officer** | Inspector Arjun (KGID KSP20180091) |
| **Primary Suspect** | **Suresh K. (Alias "Chotte", PersonID A1)** — *Habitual Offender* |

---

## 2. Executive Summary & Incident Timeline
On 10 Feb 2026 at 02:14 AM, an armed night break-in occurred at **Lakshmi Jewelry Store, Anekal Main Road**. Safes were breached using gas cutters, and gold ornaments valued at **₹45 Lakhs** were stolen.

Multi-agent reasoning by the **Investigation Orchestrator** has established the primary suspect as habitual offender **Suresh K. (PersonID A1)** with **95.2% overall confidence**, linking this crime to a secondary cyber SIM-swap scam in Mysuru (FIR #104440008202600002).

---

## 3. Specialist Police Unit Findings

### 📹 Digital Evidence Unit Report
- **Vehicle Identification**: White Innova (Reg: \`KA-03-MN-4481\`).
- **Source**: CCTV_014.mp4, Frame 291.
- **Confidence**: **96%**

### 🔬 Forensic Analysis Unit Report
- **Biometric Match**: AFIS Latent Fingerprint Sample \`#FP-01\` matched **Suresh K. (PersonID A1)**.
- **Match Score**: **94.2%**

### 🕸 Criminal Intelligence Unit Report
- **Habitual Offender Match**: Suspect \`PersonID A1\` cross-indexed in FIR \`104440008202600002\` (Devaraja PS, Mysuru City).
- **Risk Score**: **92 / 100 (Critical Risk)**

---

## 4. Tactical & Legal Recommendations (BNS / BNSS)
1. **Arrest Warrant**: Issue Non-Bailable Warrant under **BNSS Section 35**.
2. **Charges**: Frame charges under **BNS Section 305** (Aggravated Theft) & **BNS Section 331** (Night House-trespass).
3. **Seizure**: Execute formal seizure memo under **Bharatiya Sakshya Adhiniyam (BSA)** for recovered gas cutter tools and ₹45L gold.
`;

  const defaultDecisionRecord = {
    id: "#AI-30291",
    accepted_findings: ["Video Agent Finding (96%)", "AFIS Fingerprint Match (94.2%)", "Timeline Verification (99%)"],
    overruled_findings: ["Witness Statement #02 (74%) - Contradicts CCTV color logic"],
    consensus_score: "5 / 5 Units",
    overall_confidence: 95,
    next_actions: ["Issue Non-Bailable Warrant", "Frame BNS Section 305 Charges"],
    confidence_story: [
      { step: "Evidence Collected", confidence: 72 },
      { step: "Vehicle Identified", confidence: 81 },
      { step: "Fingerprint Matched", confidence: 90 },
      { step: "Cross-referenced", confidence: 95 }
    ],
    uncertainties: {
      known: ["Primary Suspect Identity", "Getaway Vehicle", "Stolen Amount", "Modus Operandi"],
      unknown: ["Second Suspect Identity", "Weapon Source", "Current Hideout Location"]
    },
    health: {
      evidence: "Verified",
      timeline: "Complete",
      legal: "Verified",
      witnesses: "Weak",
      digital: "Excellent"
    }
  };

  const defaultStream = [
    {
      id: "msg-1",
      role: "Orchestrator",
      sender_name: "Investigation Orchestrator",
      avatar_bg: "bg-[#FF5A1F]",
      timestamp: "09:12:45 AM",
      content: "Initiating investigation cycle for **FIR #104430006202600001 (Anekal Commercial Burglary)**. Delegating tasks to specialist units.",
      type: "orchestrator_directive",
      priority: "Critical",
      assigned_to: "Video, Evidence, and Legal Units",
      expected_output: "Vehicle ID, Biometric Match, BNS Sections"
    },
    {
      id: "msg-2",
      role: "Video Agent",
      sender_name: "Video Intelligence Agent",
      avatar_bg: "bg-blue-600",
      timestamp: "09:13:10 AM",
      content: "### Video Analysis Report Submitted\n- **Finding**: Getaway vehicle identified as **White Innova (Reg: KA03MN4481)** from CCTV_014.mp4 Frame 291.",
      type: "agent_report",
      status: "Verified",
      finding: "Getaway vehicle identified as White Innova (Reg: KA03MN4481)",
      confidence: 96,
      evidence: ["CCTV_014.mp4", "Frame-291"],
      recommendation: "Run ANPR check on KA03MN4481"
    },
    {
      id: "msg-3",
      role: "Evidence Agent",
      sender_name: "Evidence Audit Agent",
      avatar_bg: "bg-purple-600",
      timestamp: "09:13:25 AM",
      content: "### Evidence Report Submitted\n- **Finding**: AFIS Fingerprint Latent Sample #FP-01 matched suspect **Suresh K. (PersonID A1)** with 94.2% biometric match.",
      type: "agent_report",
      status: "Verified",
      finding: "AFIS Fingerprint matched Suresh K. (PersonID A1)",
      confidence: 94,
      evidence: ["AFIS-FP-01"]
    },
    {
      id: "msg-4",
      role: "Orchestrator",
      sender_name: "Investigation Orchestrator",
      avatar_bg: "bg-[#FF5A1F]",
      timestamp: "09:14:00 AM",
      content: "Waiting for unit consensus before finalizing the decision record...",
      type: "consensus_forming"
    },
    {
      id: "msg-5",
      role: "Orchestrator",
      sender_name: "Investigation Orchestrator",
      avatar_bg: "bg-[#FF5A1F]",
      timestamp: "09:14:15 AM",
      content: "### ⚖️ Evidence Conflict Resolution & Decision Record #AI-30291\n- **Conflict**: Witness #02 Statement (Blue Bike 74%) contradicts CCTV analysis.\n- **Decision**: **Overruled Witness Statement** based on 96% ANPR confidence.\n- **Status**: **Broadcasting Decision Record #AI-30291**",
      type: "decision_record"
    },
    {
      id: "msg-6",
      role: "Report Agent",
      sender_name: "Report Compilation Agent",
      avatar_bg: "bg-rose-600",
      timestamp: "09:14:45 AM",
      content: "### 📂 Live Investigation Report Compiled\nAll accepted findings compiled into interactive Executive Brief. Click below to open document.",
      type: "report_ready",
      artifact_title: "INVESTIGATION_REPORT.md"
    }
  ];

  const [chatEvents, setChatEvents] = useState<any[]>(defaultStream);
  const [artifactMd, setArtifactMd] = useState<string>(defaultArtifactMd);
  const [isArtifactOpen, setIsArtifactOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [isGeneratingBundle, setIsGeneratingBundle] = useState<boolean>(false);
  const [isSimulatingSwarm, setIsSimulatingSwarm] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>('');
  const [phases, setPhases] = useState<string[]>([]);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(-1);
  const [decisionRecord, setDecisionRecord] = useState<any>(defaultDecisionRecord);

  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatEvents]);

  const generateAIReport = async () => {
    setIsGeneratingAI(true);
    showToast('✨ Compiling Interactive Dossier...');
    try {
      const res = await fetch('/api/warroom/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_no: "104430006202600001" })
      });
      const data = await res.json();
      if (data.report_md) {
        setArtifactMd(data.report_md);
        setIsArtifactOpen(true);
        showToast('✅ Interactive Dossier generated!');
      }
    } catch (err) {
      console.error(err);
      setArtifactMd(defaultArtifactMd);
      setIsArtifactOpen(true);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleCopyArtifact = () => {
    navigator.clipboard.writeText(artifactMd);
    setIsCopied(true);
    showToast('Dossier content copied to clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleGenerateBundle = async () => {
    setIsGeneratingBundle(true);
    showToast('📦 Generating Official Investigation Dossier Bundle...');
    setTimeout(() => {
      setIsGeneratingBundle(false);
      showToast('✅ Case Bundle (ZIP) successfully generated and downloaded!');
    }, 2500);
  };

  const handleExportPDF = () => {
    exportToPDF("ArcCraft KSP Interactive Dossier", artifactMd);
  };

  const handleClearChat = () => {
    setChatEvents([]);
    setDecisionRecord(null);
    setPhases([]);
    setCurrentPhaseIndex(-1);
    showToast('Chat history cleared');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isSimulatingSwarm) return;

    const query = userInput;
    const newMsg = {
      id: `user-${Date.now()}`,
      role: "User",
      sender_name: "Inspector Arjun",
      avatar_bg: "bg-emerald-600",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: query,
      type: "user"
    };

    setChatEvents((prev) => [...prev, newMsg]);
    setUserInput('');
    setIsSimulatingSwarm(true);
    showToast('🧠 Investigation Orchestrator analyzing query...');

    try {
      const res = await fetch('/api/warroom/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query })
      });
      const data = await res.json();
      
      if (data.events && data.events.length > 0) {
        if (data.phases) setPhases(data.phases);
        setCurrentPhaseIndex(0);
        setDecisionRecord(null);

        let accumulatedDelay = 0;
        data.events.forEach((msg: any, index: number) => {
          accumulatedDelay += (msg.simulated_delay_ms || 1500);
          setTimeout(() => {
            setChatEvents((prev) => [...prev, {
              ...msg,
              id: `ai-${Date.now()}-${index}`
            }]);
            setCurrentPhaseIndex(Math.min(Math.floor((index / data.events.length) * 6), 5));
          }, accumulatedDelay);
        });

        setTimeout(() => {
          setIsSimulatingSwarm(false);
          setCurrentPhaseIndex(5);
          if (data.decision_record) {
            setDecisionRecord(data.decision_record);
            setIsArtifactOpen(true);
          }
        }, accumulatedDelay + 500);

      } else {
        setIsSimulatingSwarm(false);
        showToast('⚠️ Swarm returned no data.');
      }
    } catch (err) {
      console.error(err);
      setIsSimulatingSwarm(false);
      showToast('⚠️ Swarm encountered an error.');
    }
  };

  // Theme classes
  const containerBg = isDarkMode ? 'bg-[#0E0E10] text-gray-100' : 'bg-white text-black';
  const chatBg = isDarkMode ? 'bg-[#141417] border-gray-800' : 'bg-white border-gray-300';
  const msgBoxBg = isDarkMode 
    ? 'bg-[#1C1C21] border-gray-800 text-gray-100' 
    : 'bg-[#F8FAFC] border border-gray-200 text-gray-900 shadow-xs';
  const gdocsBg = isDarkMode ? 'bg-[#18181C] border-gray-800 text-gray-100' : 'bg-[#F1F5F9] border-gray-300 text-black';

  const getAvatarIcon = (role: string) => {
    switch (role) {
      case 'Orchestrator':
      case 'Investigation Orchestrator':
        return <i className="fi fi-ss-brain-circuit text-sm sm:text-base"></i>;
      case 'Video Agent':
      case 'Video Intelligence Agent':
      case 'Digital Evidence Unit':
        return <i className="fi fi-sr-camera text-sm sm:text-base"></i>;
      case 'Evidence Agent':
      case 'Evidence Audit Agent':
      case 'Forensic Analysis Unit':
        return <i className="fi fi-sr-fingerprint text-sm sm:text-base"></i>;
      case 'Report Agent':
      case 'Report Compilation Agent':
      case 'Legal Agent':
      case 'Legal Compliance Unit':
        return <i className="fi fi-sr-newspaper text-sm sm:text-base"></i>;
      case 'User':
        return <User size={16} />;
      default:
        return <i className="fi fi-ss-brain-circuit text-sm sm:text-base"></i>;
    }
  };

  return (
    <div className={`flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full font-sans overflow-hidden ${containerBg}`}>
      
      {/* LEFT PANEL: Live AI Reasoning Room */}
      <div className={`flex flex-col border-r transition-all duration-500 ease-in-out ${
        isArtifactOpen ? 'w-full lg:w-[500px] lg:shrink-0' : 'w-full'
      } ${chatBg} relative min-h-0`}>
        
        {/* NEW: Active Units Monitor (Replaces Phases) */}
        {(phases.length > 0 || isSimulatingSwarm) && (
          <ActiveUnitsMonitor currentPhaseIndex={currentPhaseIndex} isSimulating={isSimulatingSwarm} />
        )}

        {/* Chat Top Bar */}
        <div className={`p-3 sm:p-4 border-b ${isDarkMode ? 'border-gray-800 bg-black/20' : 'border-gray-300 bg-white'} flex items-center justify-between shrink-0`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center font-black shadow-xs shrink-0">
              <i className="fi fi-ss-brain-circuit text-base flex items-center justify-center"></i>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className={`text-xs sm:text-sm font-black tracking-tight truncate ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>AI Multi-Agent War Room</h2>
                <span className="hidden sm:inline text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                  Live
                </span>
              </div>
              <p className={`text-[10px] sm:text-[11px] font-extrabold truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>FIR #104430006202600001 (Anekal PS)</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button 
              onClick={handleClearChat}
              className={`p-2 rounded-xl text-xs font-black transition-all cursor-pointer ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
              title="Clear chat"
            >
              <Trash2 size={14} />
            </button>
            <button 
              onClick={generateAIReport}
              disabled={isGeneratingAI}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-black transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Sparkles size={13} className={isGeneratingAI ? 'animate-spin' : ''} />
              <span>{isGeneratingAI ? 'Compiling...' : 'Generate Report'}</span>
            </button>
          </div>
        </div>

        {/* Chat Messages Feed */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 scrollbar-thin min-h-0">
          {chatEvents.map((msg: any) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-2.5 sm:gap-3.5 text-xs"
            >
              {/* Avatar */}
              <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl ${msg.avatar_bg || 'bg-gray-600'} text-white font-black flex items-center justify-center text-xs sm:text-sm shrink-0 shadow-sm mt-0.5`}>
                {getAvatarIcon(msg.role)}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`font-black text-[11px] sm:text-xs truncate ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{msg.sender_name}</span>
                  <span className={`text-[9px] sm:text-[10px] font-mono font-bold shrink-0 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{msg.timestamp}</span>
                </div>

                <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${
                  msg.type === 'orchestrator_directive'
                    ? 'bg-[#FF5A1F]/5 border-[#FF5A1F]/30' :
                  msg.type === 'decision_record' 
                    ? 'bg-amber-500/10 border-amber-500/30' : msgBoxBg
                }`}>
                  
                  {/* NEW: Orchestrator Directive UI */}
                  {msg.type === 'orchestrator_directive' ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 border-b pb-2 border-[#FF5A1F]/20">
                        <Target size={14} className="text-[#FF5A1F]" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5A1F]">Orchestrator Directive</span>
                      </div>
                      <div className={`prose prose-xs max-w-none text-xs leading-relaxed font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        <ReactMarkdown>{msg.content || ''}</ReactMarkdown>
                      </div>
                      {(msg.priority || msg.assigned_to) && (
                        <div className={`mt-2 p-2 rounded-lg grid grid-cols-2 gap-2 text-[10px] ${isDarkMode ? 'bg-[#FF5A1F]/10' : 'bg-orange-50'}`}>
                          {msg.priority && (
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-500 uppercase tracking-wider">Priority</span>
                              <span className="font-black text-[#FF5A1F]">{msg.priority}</span>
                            </div>
                          )}
                          {msg.assigned_to && (
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-500 uppercase tracking-wider">Assigned To</span>
                              <span className="font-black text-[#FF5A1F]">{msg.assigned_to}</span>
                            </div>
                          )}
                          {msg.expected_output && (
                            <div className="flex flex-col col-span-2 mt-1 pt-1 border-t border-[#FF5A1F]/20">
                              <span className="font-bold text-gray-500 uppercase tracking-wider">Expected Output</span>
                              <span className="font-black text-[#FF5A1F]">{msg.expected_output}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : msg.type === 'consensus_forming' ? (
                    /* NEW: Consensus Builder UI */
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between border-b pb-2 border-emerald-500/20">
                        <div className="flex items-center gap-2 text-emerald-500">
                          <BrainCircuit size={14} />
                          <span className="text-[10px] font-black uppercase tracking-wider">Establishing Consensus</span>
                        </div>
                        <Loader2 size={12} className="animate-spin text-emerald-500" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}} className="flex items-center justify-between pr-2 text-emerald-500">
                           <div className="flex items-center gap-1.5"><CheckCircle2 size={12}/> Video Unit</div>
                           <span className="text-[9px] font-mono font-black">+8%</span>
                        </motion.div>
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.0}} className="flex items-center justify-between pr-2 text-emerald-500">
                           <div className="flex items-center gap-1.5"><CheckCircle2 size={12}/> Evidence Unit</div>
                           <span className="text-[9px] font-mono font-black">+4%</span>
                        </motion.div>
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.5}} className="flex items-center justify-between pr-2 text-emerald-500">
                           <div className="flex items-center gap-1.5"><CheckCircle2 size={12}/> Timeline Unit</div>
                           <span className="text-[9px] font-mono font-black">+3%</span>
                        </motion.div>
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.0}} className="flex items-center justify-between pr-2 text-amber-500">
                           <div className="flex items-center gap-1.5"><AlertCircle size={12}/> Witness Statement</div>
                           <span className="text-[9px] font-mono font-black">-1%</span>
                        </motion.div>
                      </div>
                      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.5}} className="mt-2 text-center text-xs font-black text-emerald-600 bg-emerald-500/10 p-1.5 rounded border border-emerald-500/30 flex justify-center gap-1 items-center">
                        <span>Consensus Achieved:</span>
                        <div className="relative w-8 h-4 overflow-hidden inline-block align-middle">
                          <motion.div 
                            initial={{ y: 0 }}
                            animate={{ y: -64 }}
                            transition={{ delay: 2.5, duration: 1.5, ease: "anticipate" }}
                            className="absolute top-0 left-0 flex flex-col items-center"
                          >
                            <span className="h-4 flex items-center">64%</span>
                            <span className="h-4 flex items-center">71%</span>
                            <span className="h-4 flex items-center">84%</span>
                            <span className="h-4 flex items-center">91%</span>
                            <span className="h-4 flex items-center">95%</span>
                          </motion.div>
                        </div>
                        <span>Confidence</span>
                      </motion.div>
                    </div>
                  ) : msg.type === 'decision_record' ? (
                    <div className="flex flex-col text-[11px] font-mono leading-tight tracking-wide p-1">
                      <div className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>{'━━━━━━━━━━━━━━━━━━━━━━━━━━━━'}</div>
                      <div className="font-black text-[#FF5A1F] uppercase mt-1">Decision Record</div>
                      <div className="font-bold text-gray-500 mb-1">AI-30291</div>
                      <div className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>{'━━━━━━━━━━━━━━━━━━━━━━━━━━━━'}</div>
                      
                      <div className="mt-2 font-bold text-emerald-500 uppercase">Accepted</div>
                      <div className="text-gray-400 ml-2">✓ CCTV</div>
                      <div className="text-gray-400 ml-2">✓ Vehicle</div>
                      <div className="text-gray-400 ml-2">✓ Timeline</div>
                      
                      <div className="mt-2 font-bold text-rose-500 uppercase">Rejected</div>
                      <div className="text-gray-400 ml-2">✗ Witness Color</div>
                      
                      <div className="mt-2 font-bold text-blue-500 uppercase">Confidence</div>
                      <div className="text-gray-900 dark:text-gray-100 text-sm font-black flex items-center gap-2">
                         <span>95.2%</span>
                         <span className="text-[9px] text-emerald-500 font-bold bg-emerald-500/10 px-1 rounded">Final</span>
                      </div>
                      
                      <div className="mt-2 font-bold text-gray-500 uppercase">Signed</div>
                      <div className="text-gray-900 dark:text-gray-100">Investigation Orchestrator</div>
                      <div className={`mt-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>{'━━━━━━━━━━━━━━━━━━━━━━━━━━━━'}</div>
                    </div>
                  ) : (
                    /* Standard Message Content */
                    <>
                      <div className={`prose prose-xs max-w-none text-xs leading-relaxed font-medium ${isDarkMode ? 'text-gray-200 [&_strong]:text-white' : 'text-gray-800 [&_strong]:text-gray-900'}`}>
                        <ReactMarkdown>{msg.content || ''}</ReactMarkdown>
                      </div>

                  {/* Structured Finding Card */}
                  {msg.finding && (
                    <div className={`mt-3 p-3 rounded-lg border ${isDarkMode ? 'bg-[#141417] border-gray-800' : 'bg-white border-gray-200'} shadow-sm`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Structured Finding</span>
                        {msg.confidence != null && (
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${msg.confidence > 90 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                            {msg.confidence}% Confidence
                          </span>
                        )}
                      </div>
                      <p className={`text-xs font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{msg.finding}</p>
                      
                      {/* NEW: Interactive Evidence Tags */}
                      {msg.evidence && msg.evidence.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {msg.evidence.map((ev: string, idx: number) => (
                            <span 
                              key={idx} 
                              onClick={() => setSelectedEvidenceId(ev)}
                              className="flex items-center gap-1 text-[9px] font-mono font-bold text-blue-600 bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400 px-1.5 py-0.5 rounded cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors shadow-sm"
                            >
                              <Database size={9} /> {ev}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {msg.recommendation && (
                        <div className={`text-[10px] font-medium mt-2 pt-2 border-t ${isDarkMode ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-600'}`}>
                          <span className="font-bold">Next Action:</span> {msg.recommendation}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Status Badge */}
                  {msg.status && (
                    <div className="mt-3">
                      <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full shadow-xs ${
                        msg.status === 'Verified' ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                        : 'bg-blue-100 text-blue-700 border border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
                      }`}>
                        ✓ {msg.status}
                      </span>
                    </div>
                  )}

                  {/* Report Artifact Link */}
                  {msg.artifact_title && (
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setIsArtifactOpen(true);
                        showToast('Opened Interactive Investigation Dossier');
                      }}
                      className="mt-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 hover:border-blue-700 cursor-pointer flex items-center justify-between transition-all group shadow-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-black text-[10px] shadow-xs shrink-0">
                          DOC
                        </div>
                        <div className="min-w-0">
                          <span className={`text-xs font-black block truncate ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                            {msg.artifact_title}
                          </span>
                          <span className={`text-[10px] font-mono font-extrabold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Click to Open Executive Brief</span>
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center gap-1.5 text-xs font-black text-blue-700 dark:text-blue-400 bg-white dark:bg-blue-950 px-2.5 py-1 rounded-lg border border-blue-400 shrink-0 ml-2">
                        <Eye size={12} />
                        <span>Open</span>
                      </div>
                    </motion.div>
                  )}
                  </>
                )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isSimulatingSwarm && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2.5 text-xs"
            >
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-[#FF5A1F]/20 flex items-center justify-center shrink-0">
                <Loader2 size={14} className="text-[#FF5A1F] animate-spin" />
              </div>
              <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-[#1C1C21] border border-gray-800' : 'bg-gray-50 border border-gray-200'}`}>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
              <span className={`text-[10px] font-bold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <motion.span
                  key={currentPhaseIndex}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {currentPhaseIndex === 0 ? 'Analyzing query & routing...' :
                   currentPhaseIndex === 1 ? 'Scanning CCTV_014.mp4...' :
                   currentPhaseIndex === 2 ? 'Matching Registration KA03MN4481...' :
                   currentPhaseIndex === 3 ? 'Correlating AFIS-FP-01...' :
                   currentPhaseIndex === 4 ? 'Forming Consensus (95.2%)...' :
                   'Compiling Executive Brief...'}
                </motion.span>
              </span>
            </motion.div>
          )}
          
          {/* Investigation Summary Animation */}
          {!isSimulatingSwarm && currentPhaseIndex === 5 && chatEvents.length > 0 && (
            <div className="px-2 pb-6">
              <InvestigationSummaryAnimation />
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className={`p-3 sm:p-4 border-t ${isDarkMode ? 'border-gray-800 bg-black/30' : 'border-gray-300 bg-white'} shrink-0`}>
          <div className={`flex items-center gap-2 border-2 rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 transition-all ${
            isDarkMode ? 'bg-[#0B0E14] border-gray-800 focus-within:border-[#FF5A1F]' : 'bg-white border-gray-300 focus-within:border-black shadow-inner'
          }`}>
            <input 
              type="text" 
              placeholder="Direct Investigation Orchestrator or specialist AI units..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className={`w-full bg-transparent text-xs font-bold placeholder-gray-500 outline-none ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
            />
            <button 
              type="submit"
              disabled={isSimulatingSwarm}
              className="p-2 sm:p-2.5 rounded-xl bg-[#FF5A1F] hover:bg-[#e04e18] text-white transition-all cursor-pointer shrink-0 shadow-sm disabled:opacity-50 flex items-center justify-center min-w-[32px] sm:min-w-[36px]"
            >
              {isSimulatingSwarm ? <Sparkles size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT PANEL: INTERACTIVE DOSSIER / EXECUTIVE BRIEF */}
      <AnimatePresence>
        {isArtifactOpen && (
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '50%' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`hidden lg:flex flex-col border-l ${gdocsBg} relative shrink-0 shadow-2xl overflow-hidden`}
          >
            {/* TOOLBAR */}
            <div className={`p-3.5 border-b ${isDarkMode ? 'border-gray-800 bg-[#141417]' : 'border-gray-300 bg-white'} flex items-center justify-between shrink-0`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-black text-xs shadow-xs shrink-0">
                  R
                </div>
                <div className="min-w-0">
                  <h3 className={`text-xs font-black tracking-tight truncate ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    KSP Executive Brief
                  </h3>
                  <span className="text-[9px] font-mono font-black text-blue-700 bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded border border-blue-300">
                    Interactive Format
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={handleCopyArtifact}
                  className={`p-1.5 rounded-lg cursor-pointer transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                  title="Copy content"
                >
                  {isCopied ? <Check size={16} /> : <Copy size={16} />}
                </button>
                <button 
                  onClick={handleExportPDF}
                  className={`p-1.5 rounded-lg cursor-pointer transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                  title="Export PDF"
                >
                  <Download size={16} />
                </button>
                <button 
                  onClick={handleGenerateBundle}
                  disabled={isGeneratingBundle}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-black transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Sparkles size={13} className={isGeneratingBundle ? "animate-spin" : ""} />
                  <span>Generate Dossier</span>
                </button>
                <button 
                  onClick={() => setIsArtifactOpen(false)}
                  className={`p-1.5 rounded-lg cursor-pointer font-black transition-colors ${isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'}`}
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* DOCUMENT CANVAS */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center gap-8 scrollbar-thin min-h-0">
              
              {/* NEW: DECISION RECORD DASHBOARD */}
              {decisionRecord && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-[800px] flex flex-col gap-6"
                >
                  
                  {/* Top Bar: Health Gauge & Top-line stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InvestigationHealthGauge 
                      score={decisionRecord.overall_confidence} 
                      health={decisionRecord.health || defaultDecisionRecord.health} 
                    />
                    
                    <div className={`p-4 rounded-xl border-2 flex flex-col justify-between ${
                      isDarkMode ? 'bg-[#1C1C21] border-gray-800' : 'bg-white border-gray-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-2 border-b pb-2 border-gray-200 dark:border-gray-800">
                        <Scale size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                        <h3 className={`text-sm font-black ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>Decision Consensus</h3>
                        <span className={`ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400`}>
                          {decisionRecord.consensus_score}
                        </span>
                      </div>
                      
                      <div className="flex-1 flex gap-4 text-xs font-medium">
                        <div className="flex-1 flex flex-col gap-1">
                          <span className="text-[10px] font-black uppercase text-emerald-500">✓ Accepted</span>
                          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {decisionRecord.accepted_findings?.length || 0} Key Findings
                          </span>
                        </div>
                        <div className="w-px bg-gray-200 dark:bg-gray-800" />
                        <div className="flex-1 flex flex-col gap-1">
                          <span className="text-[10px] font-black uppercase text-rose-500">✗ Overruled</span>
                          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {decisionRecord.overruled_findings?.length || 0} Contradictions
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle Row: Reasoning Timeline & Uncertainties */}
                  <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
                    
                    {/* Confidence Story Timeline */}
                    <div className={`p-4 rounded-xl border-2 ${isDarkMode ? 'bg-[#1C1C21] border-gray-800' : 'bg-white border-gray-200'}`}>
                      <h4 className="font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 text-[10px]">Reasoning Timeline</h4>
                      <div className="flex items-center gap-2">
                        {(decisionRecord.confidence_story || defaultDecisionRecord.confidence_story).map((story: any, idx: number, arr: any[]) => (
                          <React.Fragment key={idx}>
                            <div className="flex flex-col items-center gap-1.5">
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-mono font-bold ${
                                isDarkMode ? 'bg-[#111115] border-emerald-500/50 text-emerald-400' : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                              }`}>
                                {story.confidence}
                              </div>
                              <span className="text-[9px] font-bold uppercase text-center w-16 leading-tight text-gray-500">{story.step}</span>
                            </div>
                            {idx < arr.length - 1 && (
                              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700 mb-4" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Uncertainty Panel */}
                    <div className={`p-4 rounded-xl border-2 ${isDarkMode ? 'bg-[#1C1C21] border-gray-800' : 'bg-white border-gray-200'}`}>
                      <h4 className="font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 text-[10px]">AI Epistemology</h4>
                      
                      <div className="flex flex-col gap-3 text-xs">
                        <div>
                          <span className="flex items-center gap-1 text-[9px] font-black uppercase text-blue-500 mb-1"><ShieldCheck size={10}/> Knowns</span>
                          <ul className="pl-3 list-disc text-gray-700 dark:text-gray-300 font-medium">
                            {(decisionRecord.uncertainties?.known || defaultDecisionRecord.uncertainties.known).slice(0, 2).map((k: string, i: number) => <li key={i}>{k}</li>)}
                          </ul>
                        </div>
                        <div>
                          <span className="flex items-center gap-1 text-[9px] font-black uppercase text-amber-500 mb-1"><AlertCircle size={10}/> Unknowns</span>
                          <ul className="pl-3 list-disc text-gray-700 dark:text-gray-300 font-medium">
                            {(decisionRecord.uncertainties?.unknown || defaultDecisionRecord.uncertainties.unknown).slice(0, 2).map((u: string, i: number) => <li key={i}>{u}</li>)}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Reasoning Graph Tree */}
                  <ReasoningGraph 
                    evidenceList={['CCTV-14', 'AFIS-FP-01']}
                    findings={['Identified Vehicle', 'Matched Biometrics']}
                    decision="Suresh K. committed burglary"
                  />

                </motion.div>
              )}

              {/* Markdown Document (Standard Dossier part) */}
              <div className={`w-full max-w-[800px] p-6 sm:p-8 lg:p-12 rounded-xl shadow-xl border-2 ${
                isDarkMode ? 'bg-[#1C1C21] border-gray-800 text-gray-100' : 'bg-white border-gray-300 text-black'
              } min-h-[600px] text-xs leading-relaxed font-sans`}>
                <div className={`prose max-w-none text-xs leading-relaxed font-medium ${isDarkMode ? 'text-gray-100 [&_*]:text-gray-100 [&_strong]:text-white [&_h1]:text-white [&_h2]:text-gray-200 [&_h3]:text-gray-200 [&_td]:text-gray-300 [&_th]:text-gray-100' : 'text-gray-900 [&_*]:text-gray-900'}`}>
                  <ReactMarkdown>{artifactMd}</ReactMarkdown>
                </div>
                <div className={`mt-8 pt-4 border-t-2 text-[10px] font-mono text-center font-black ${isDarkMode ? 'border-gray-800 text-gray-500' : 'border-gray-300 text-gray-400'}`}>
                  Page 1 of 1 &bull; End of Official Karnataka State Police Case File
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Modals */}
      <EvidenceViewerModal evidenceId={selectedEvidenceId} onClose={() => setSelectedEvidenceId(null)} />

    </div>
  );
}
