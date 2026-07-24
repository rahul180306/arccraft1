'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { 
  Sliders, 
  Palette, 
  Briefcase, 
  Cpu, 
  Video, 
  Mic, 
  ShieldCheck, 
  Database, 
  EyeOff, 
  Bell, 
  HardDrive, 
  Info, 
  Search, 
  Check, 
  RotateCcw, 
  Sparkles, 
  ChevronRight, 
  Lock, 
  Server, 
  Wifi, 
  Layers, 
  Globe, 
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  FileText,
  Key,
  ShieldAlert
} from 'lucide-react';

import { useUIStore } from '@/lib/stores/uiStore';
import StatusBadge from '@/components/ui/StatusBadge';
import PremiumCard from '@/components/ui/PremiumCard';

// Motion variants
const tabTransitionVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.99 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }
  },
  exit: { 
    opacity: 0, 
    y: -8, 
    scale: 0.99,
    transition: { duration: 0.15, ease: 'easeIn' }
  }
};

interface CategoryConfig {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
}

const SETTINGS_CATEGORIES: CategoryConfig[] = [
  { id: 'general', title: 'General', description: 'Station ID, timezone & core system preferences', icon: Sliders },
  { id: 'appearance', title: 'Appearance', description: 'Theme modes, high contrast & interface density', icon: Palette },
  { id: 'workspace', title: 'Investigation Workspace', description: 'Default case views, Form 173 presets & BSA standards', icon: Briefcase, badge: 'BSA 2023' },
  { id: 'ai-models', title: 'AI Models', description: 'Gemini engines, temperature & hallucination strictness', icon: Cpu, badge: 'v2.5' },
  { id: 'evidence', title: 'Evidence Processing', description: 'CCTV frame sampling, motion triggers & SHA-256 hash', icon: Video },
  { id: 'voice', title: 'Voice Assistant', description: 'Wake-word detection, audio feedback & offline mode', icon: Mic },
  { id: 'security', title: 'Security & Access', description: 'Biometric MFA, inspector level & session timeouts', icon: ShieldCheck },
  { id: 'integrations', title: 'Integrations', description: 'Karnataka CCTNS, CyberCrime Vault & Forensic Cloud', icon: Database, badge: 'Live' },
  { id: 'privacy', title: 'Privacy & Compliance', description: 'Data retention, suspect PII masking & chain of custody', icon: EyeOff },
  { id: 'notifications', title: 'Notifications', description: 'Priority alert sounds, email briefs & mobile pushes', icon: Bell },
  { id: 'backup', title: 'Backup & Sync', description: 'Cloud replica nodes, local cache & hash export', icon: HardDrive },
  { id: 'about', title: 'About & Node Health', description: 'ArcCraft OS version, system uptime & audit status', icon: Info }
];

export default function SettingsWorkspace() {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const openCopilot = useUIStore((s) => s.openCopilot);
  const showToast = useUIStore((s) => s.showToast);

  // Active Category & Search
  const [activeCategoryId, setActiveCategoryId] = useState<string>('general');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dirty State Management (for Sticky Save Bar)
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Category Settings Local State
  const [settings, setSettings] = useState({
    // General
    stationId: 'KRP-PS-4509',
    timezone: 'Asia/Kolkata (IST +5:30)',
    autoSaveInterval: '15',
    defaultAuditLevel: 'Strict (BSA Sec 63)',

    // Appearance
    compactMode: false,
    highContrast: false,
    accentColor: 'orange',
    reducedMotion: false,

    // Workspace
    defaultCaseView: 'Kanban Board',
    autoLinkEvidence: true,
    autoDraftChargesheet: true,
    bsaComplianceMode: 'Full Verification',

    // AI Models
    primaryModel: 'gemini-2.5-flash',
    temperature: 0.2,
    hallucinationCheck: 'High (0.95 Threshold)',
    contextLimit: '128k Tokens',

    // Evidence
    cctvFps: '30',
    motionSensitivity: 'Medium-High',
    audioLanguage: 'Kannada + English (Hybrid)',
    autoHashSha256: true,

    // Voice
    wakeWord: true,
    audioFeedback: true,
    micSensitivity: 80,
    offlineVoice: false,

    // Security
    biometricMfa: true,
    inspectorRole: 'Senior Inspector / IO',
    sessionTimeout: '30 Mins',
    auditLogging: 'Verbose',

    // Integrations
    cctnsConnected: true,
    cyberVaultConnected: true,
    forensicCloudConnected: true,
    trafficGridConnected: false,

    // Privacy
    piiMasking: true,
    retentionDays: '180',
    chainOfCustodyMode: 'Cryptographic Timestamp',

    // Notifications
    priorityAlertSound: true,
    dailyBriefEmail: true,
    smsUrgentAlerts: true
  });

  const updateSetting = (key: keyof typeof settings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasChanges(false);
      showToast('Settings saved & synchronized across station nodes');
    }, 600);
  };

  const handleResetCategory = () => {
    setHasChanges(false);
    showToast('Reverted category settings to node defaults');
  };

  // Filter Categories by Search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return SETTINGS_CATEGORIES;
    const query = searchQuery.toLowerCase();
    return SETTINGS_CATEGORIES.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const activeCategory = SETTINGS_CATEGORIES.find((c) => c.id === activeCategoryId) || SETTINGS_CATEGORIES[0];

  return (
    <motion.main 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 pb-36"
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <StatusBadge label="ARCCRAFT 2.0 OS" type="ai" />
            <StatusBadge label="STATION NODE ACTIVE" type="success" />
            <StatusBadge label="CASE: FIR KRP/2026/0456" type="info" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
            System & Workspace Settings
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 max-w-2xl">
            Manage law enforcement operating system preferences, AI Copilot parameters, CCTNS database connections, and digital evidence hashing standards.
          </p>
        </div>

        <button 
          onClick={() => openCopilot('Help me configure optimum settings for FIR KRP/2026/0456 evidence handling')}
          className="self-start lg:self-center flex items-center gap-2 bg-[#FF5A1F] hover:bg-[#E84A12] active:bg-[#D63F0A] text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-xs cursor-pointer transition-all shrink-0 hover:scale-[1.01] active:scale-[0.98]"
        >
          <Sparkles size={15} />
          <span>Ask AI Assistant</span>
        </button>
      </div>

      {/* QUICK SEARCH BAR */}
      <div className="relative w-full">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search settings, options, AI parameters or protocols... (e.g. Gemini, SHA-256, CCTNS)"
          className="w-full pl-11 pr-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-2xl text-xs font-medium text-[var(--text-primary)] placeholder-[#9CA3AF] dark:placeholder-[#6B7280] focus:outline-none focus:border-[#FF5A1F] focus:ring-2 focus:ring-[#FF5A1F]/20 transition-all shadow-xs"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT NAVIGATION CATEGORIES (Desktop Col 4 / Tablet-Mobile Col 12) */}
        <div 
          className="lg:col-span-4 flex flex-col gap-1.5 lg:sticky lg:top-20 z-10 bg-[var(--surface)] p-2 rounded-2xl border border-[var(--border)] max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin"
          data-lenis-prevent
        >
          <div className="px-3 py-2 text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Configuration Categories ({filteredCategories.length})
          </div>

          {filteredCategories.length === 0 ? (
            <div className="p-4 text-center text-xs text-[var(--text-muted)]">
              No matching settings found.
            </div>
          ) : (
            filteredCategories.map((cat) => {
              const IconComponent = cat.icon;
              const isActive = activeCategoryId === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategoryId(cat.id);
                    if (searchQuery) setSearchQuery('');
                  }}
                  className={`group relative flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[var(--accent)]/10 text-[var(--accent)] text-[var(--text-primary)] border-l-4 border-l-[#FF5A1F] border-y border-r border-[var(--border)] font-bold' 
                      : 'hover:bg-[var(--surface-hover)] text-[var(--text-secondary)]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                      isActive 
                        ? 'bg-[var(--accent)]/15 text-[var(--accent)]' 
                        : 'bg-[var(--surface-muted)] text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'
                    }`}>
                      <IconComponent size={16} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className={`text-xs truncate ${isActive ? 'font-black text-[var(--text-primary)]' : 'font-semibold text-[var(--text-primary)]'}`}>
                        {cat.title}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] truncate">
                        {cat.description}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {cat.badge && (
                      <span className="text-[9px] font-mono font-bold bg-[var(--accent)]/10 dark:bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30 px-1.5 py-0.5 rounded-md">
                        {cat.badge}
                      </span>
                    )}
                    <ChevronRight size={14} className={`transition-transform ${isActive ? 'text-[var(--accent)] translate-x-0.5' : 'text-[var(--text-muted)]'}`} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* RIGHT CONTENT PANEL (Desktop Col 8) */}
        <div className="lg:col-span-8 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory.id}
              variants={tabTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-6"
            >
              {/* Category Header Card */}
              <PremiumCard className="p-6">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[var(--accent)]/10 dark:bg-[var(--accent)]/20 text-[var(--accent)]">
                      <activeCategory.icon size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-[var(--text-primary)]">
                        {activeCategory.title}
                      </h2>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        {activeCategory.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleResetCategory}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                    title="Reset category settings"
                  >
                    <RotateCcw size={13} />
                    <span className="hidden sm:inline">Reset Defaults</span>
                  </button>
                </div>

                {/* CATEGORY CONTENT SWITCHER */}
                {activeCategory.id === 'general' && (
                  <div className="space-y-6">
                    <SettingControlGroup title="Station Identifier & Timezone">
                      <TextInputControl 
                        label="Station Node ID"
                        description="Registered Karnataka Police CCTNS Station Code"
                        value={settings.stationId}
                        onChange={(val) => updateSetting('stationId', val)}
                        icon={BuildingCodeIcon}
                      />
                      <SelectControl 
                        label="System Timezone"
                        description="Official timestamp standard used across evidence logs"
                        value={settings.timezone}
                        options={['Asia/Kolkata (IST +5:30)', 'UTC (Coordinated Universal Time)', 'GMT (+0:00)']}
                        onChange={(val) => updateSetting('timezone', val)}
                      />
                    </SettingControlGroup>

                    <SettingControlGroup title="System Performance & Auditing">
                      <SelectControl 
                        label="Auto-Save Interval"
                        description="Frequency of automatic background draft persistence"
                        value={settings.autoSaveInterval}
                        options={['5', '15', '30', '60']}
                        unit="Seconds"
                        onChange={(val) => updateSetting('autoSaveInterval', val)}
                      />
                      <SelectControl 
                        label="Default Audit Trail Standard"
                        description="Security verification rigor applied to case actions"
                        value={settings.defaultAuditLevel}
                        options={['Strict (BSA Sec 63)', 'Standard CCTNS', 'Minimal Logging']}
                        onChange={(val) => updateSetting('defaultAuditLevel', val)}
                      />
                    </SettingControlGroup>
                  </div>
                )}

                {activeCategory.id === 'appearance' && (
                  <div className="space-y-6">
                    <SettingControlGroup title="Visual Mode & Theme">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                        <div>
                          <label className="text-xs font-bold text-[var(--text-primary)]">Active Theme Mode</label>
                          <p className="text-[11px] text-[var(--text-muted)]">Switch between dark obsidian and light clean layouts</p>
                        </div>
                        <SegmentedControl 
                          value={isDarkMode ? 'dark' : 'light'}
                          options={[
                            { label: 'Light', value: 'light' },
                            { label: 'Dark', value: 'dark' }
                          ]}
                          onChange={(val) => {
                            if ((val === 'dark' && !isDarkMode) || (val === 'light' && isDarkMode)) {
                              toggleTheme();
                              setHasChanges(true);
                            }
                          }}
                        />
                      </div>

                      <ToggleControl 
                        label="Compact UI Density"
                        description="Reduce vertical padding to fit more case data on screen"
                        checked={settings.compactMode}
                        onChange={(checked) => updateSetting('compactMode', checked)}
                      />

                      <ToggleControl 
                        label="High Contrast Text"
                        description="Enhance text legibility for outdoor operational field use"
                        checked={settings.highContrast}
                        onChange={(checked) => updateSetting('highContrast', checked)}
                      />

                      <ToggleControl 
                        label="Reduced Motion & Animations"
                        description="Disable subtle UI transitions for maximum responsiveness"
                        checked={settings.reducedMotion}
                        onChange={(checked) => updateSetting('reducedMotion', checked)}
                      />
                    </SettingControlGroup>
                  </div>
                )}

                {activeCategory.id === 'workspace' && (
                  <div className="space-y-6">
                    <SettingControlGroup title="Investigation Layout Defaults">
                      <SelectControl 
                        label="Default Case View Layout"
                        description="Initial display style when opening an active FIR"
                        value={settings.defaultCaseView}
                        options={['Kanban Board', 'Timeline Chronology', 'Evidence Grid', 'Link Analysis Graph']}
                        onChange={(val) => updateSetting('defaultCaseView', val)}
                      />
                      <ToggleControl 
                        label="Automatic Evidence Linkage"
                        description="Auto-detect relationships between suspects, phones, and locations"
                        checked={settings.autoLinkEvidence}
                        onChange={(checked) => updateSetting('autoLinkEvidence', checked)}
                      />
                      <ToggleControl 
                        label="Section 63 BSA Compliance Auto-Verification"
                        description="Enforce digital certificate hash validation on all uploaded files"
                        checked={true}
                        disabled={true}
                        badge="Mandatory"
                      />
                    </SettingControlGroup>
                  </div>
                )}

                {activeCategory.id === 'ai-models' && (
                  <div className="space-y-6">
                    <SettingControlGroup title="Gemini AI Engine Parameters">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                        <div>
                          <label className="text-xs font-bold text-[var(--text-primary)]">Primary Intelligence Model</label>
                          <p className="text-[11px] text-[var(--text-muted)]">Server-side Gemini engine powering copilot & chargesheet drafting</p>
                        </div>
                        <SegmentedControl 
                          value={settings.primaryModel}
                          options={[
                            { label: 'Gemini 2.5 Flash', value: 'gemini-2.5-flash' },
                            { label: 'Gemini 2.5 Pro', value: 'gemini-2.5-pro' }
                          ]}
                          onChange={(val) => updateSetting('primaryModel', val)}
                        />
                      </div>

                      <SliderControl 
                        label="Model Temperature (Creativity)"
                        description="Lower values produce strictly analytical factual legal outputs"
                        value={settings.temperature}
                        min={0.0}
                        max={1.0}
                        step={0.05}
                        unit=""
                        onChange={(val) => updateSetting('temperature', val)}
                      />

                      <SelectControl 
                        label="Hallucination Verification Strictness"
                        description="Cross-reference AI summaries against raw evidence source text"
                        value={settings.hallucinationCheck}
                        options={['High (0.95 Threshold)', 'Strict (0.99 Threshold)', 'Moderate (0.85 Threshold)']}
                        onChange={(val) => updateSetting('hallucinationCheck', val)}
                      />
                    </SettingControlGroup>
                  </div>
                )}

                {activeCategory.id === 'evidence' && (
                  <div className="space-y-6">
                    <SettingControlGroup title="CCTV & Media Forensic Ingestion">
                      <SelectControl 
                        label="CCTV Video Keyframe Frame Rate"
                        description="Sampling resolution for automatic AI facial & motion detection"
                        value={settings.cctvFps}
                        options={['15', '30', '60']}
                        unit="FPS"
                        onChange={(val) => updateSetting('cctvFps', val)}
                      />
                      <SelectControl 
                        label="Audio Transcription Engine"
                        description="Multi-lingual model trained on Karnataka dialect regional audio"
                        value={settings.audioLanguage}
                        options={['Kannada + English (Hybrid)', 'Kannada Only', 'English Only']}
                        onChange={(val) => updateSetting('audioLanguage', val)}
                      />
                      <ToggleControl 
                        label="Automatic SHA-256 Hash Locking"
                        description="Instantly seal uploaded media files into court-admissible custody logs"
                        checked={settings.autoHashSha256}
                        onChange={(checked) => updateSetting('autoHashSha256', checked)}
                      />
                    </SettingControlGroup>
                  </div>
                )}

                {activeCategory.id === 'voice' && (
                  <div className="space-y-6">
                    <SettingControlGroup title="Voice Assistant & Speech Command">
                      <ToggleControl 
                        label="Enable Wake-Word Detection ('Hey ArcCraft')"
                        description="Allow hands-free voice commands directly inside the station UI"
                        checked={settings.wakeWord}
                        onChange={(checked) => updateSetting('wakeWord', checked)}
                      />
                      <ToggleControl 
                        label="Voice Audio Confirmation Spoken Feedback"
                        description="Speak confirmation responses for chargesheet drafting"
                        checked={settings.audioFeedback}
                        onChange={(checked) => updateSetting('audioFeedback', checked)}
                      />
                      <SliderControl 
                        label="Microphone Sensitivity Threshold"
                        description="Adjust background noise cancellation for noisy station environments"
                        value={settings.micSensitivity}
                        min={10}
                        max={100}
                        step={5}
                        unit="%"
                        onChange={(val) => updateSetting('micSensitivity', val)}
                      />
                    </SettingControlGroup>
                  </div>
                )}

                {activeCategory.id === 'security' && (
                  <div className="space-y-6">
                    <SettingControlGroup title="Authentication & Role Permissions">
                      <ToggleControl 
                        label="Biometric Multi-Factor Authentication"
                        description="Require fingerprint or security key approval before exporting chargesheets"
                        checked={settings.biometricMfa}
                        onChange={(checked) => updateSetting('biometricMfa', checked)}
                      />
                      <SelectControl 
                        label="Active Inspector Role Level"
                        description="Grants permission to sign Form 173 and seal digital evidence"
                        value={settings.inspectorRole}
                        options={['Senior Inspector / IO', 'Sub-Inspector', 'Forensic Analyst', 'Station Admin']}
                        onChange={(val) => updateSetting('inspectorRole', val)}
                      />
                      <SelectControl 
                        label="Automatic Inactivity Session Timeout"
                        description="Lock workspace screen when unattended in station"
                        value={settings.sessionTimeout}
                        options={['15 Mins', '30 Mins', '60 Mins', 'Never']}
                        onChange={(val) => updateSetting('sessionTimeout', val)}
                      />
                    </SettingControlGroup>
                  </div>
                )}

                {activeCategory.id === 'integrations' && (
                  <div className="space-y-6">
                    <SettingControlGroup title="External Database Connectors">
                      <IntegrationCard 
                        title="Karnataka Police CCTNS Core"
                        description="Central Crime and Criminal Tracking Network & Systems Sync"
                        connected={settings.cctnsConnected}
                        onToggle={(val) => updateSetting('cctnsConnected', val)}
                        statusText="Connected via SSL Key KRP-4509"
                      />
                      <IntegrationCard 
                        title="Karnataka CyberCrime Vault"
                        description="CDR analysis, IP logs & digital suspect database"
                        connected={settings.cyberVaultConnected}
                        onToggle={(val) => updateSetting('cyberVaultConnected', val)}
                        statusText="Syncing real-time suspect leads"
                      />
                      <IntegrationCard 
                        title="State Forensic Science Lab (FSL) Cloud"
                        description="Fingerprint, DNA, and ballistics report pipeline"
                        connected={settings.forensicCloudConnected}
                        onToggle={(val) => updateSetting('forensicCloudConnected', val)}
                        statusText="Encrypted link active"
                      />
                    </SettingControlGroup>
                  </div>
                )}

                {activeCategory.id === 'privacy' && (
                  <div className="space-y-6">
                    <SettingControlGroup title="Data Privacy & Evidence Retention">
                      <ToggleControl 
                        label="Mask Suspect PII in Draft Exports"
                        description="Automatically redact phone numbers & Aadhaar numbers in initial AI drafts"
                        checked={settings.piiMasking}
                        onChange={(checked) => updateSetting('piiMasking', checked)}
                      />
                      <SelectControl 
                        label="Local Cache Retention Period"
                        description="Retain encrypted offline evidence files before automatic wipe"
                        value={settings.retentionDays}
                        options={['90', '180', '365', 'Indefinite']}
                        unit="Days"
                        onChange={(val) => updateSetting('retentionDays', val)}
                      />
                    </SettingControlGroup>
                  </div>
                )}

                {activeCategory.id === 'notifications' && (
                  <div className="space-y-6">
                    <SettingControlGroup title="Alert Notifications & Broadcasts">
                      <ToggleControl 
                        label="Priority CCTV Match Audio Alerts"
                        description="Play station audio ping when a suspect face is matched"
                        checked={settings.priorityAlertSound}
                        onChange={(checked) => updateSetting('priorityAlertSound', checked)}
                      />
                      <ToggleControl 
                        label="Daily Case Progress Briefs"
                        description="Receive automated 08:00 AM summary of ongoing investigations"
                        checked={settings.dailyBriefEmail}
                        onChange={(checked) => updateSetting('dailyBriefEmail', checked)}
                      />
                      <ToggleControl 
                        label="SMS Urgent Alerts for High Severity Leads"
                        description="Send direct SMS to Investigating Officer's registered phone"
                        checked={settings.smsUrgentAlerts}
                        onChange={(checked) => updateSetting('smsUrgentAlerts', checked)}
                      />
                    </SettingControlGroup>
                  </div>
                )}

                {activeCategory.id === 'backup' && (
                  <div className="space-y-6">
                    <SettingControlGroup title="Node Redundancy & Local Caching">
                      <div className="p-4 rounded-xl bg-[var(--surface-muted)]/50 border border-[var(--border)]/60 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                            <Server size={15} className="text-[var(--accent)]" />
                            <span>Station Node Local DB Snapshot</span>
                          </div>
                          <p className="text-[11px] text-[var(--text-muted)] mt-1">
                            Last full offline backup created: Today at 18:30 IST (4.2 GB)
                          </p>
                        </div>
                        <button
                          onClick={() => showToast('Triggered immediate local DB snapshot backup')}
                          className="px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white rounded-xl text-xs font-bold hover:bg-[#FF5A1F] transition-colors cursor-pointer"
                        >
                          Create Snapshot
                        </button>
                      </div>
                    </SettingControlGroup>
                  </div>
                )}

                {activeCategory.id === 'about' && (
                  <div className="space-y-6">
                    <SettingControlGroup title="System Health & OS Build Metadata">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-[var(--surface-hover)]/60 border border-[var(--border)]/60 flex flex-col gap-1 shadow-xs">
                          <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase">OS Build</span>
                          <span className="text-sm font-black text-[var(--text-primary)]">ArcCraft OS 2.4.0</span>
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 size={12} /> Latest Release
                          </span>
                        </div>

                        <div className="p-4 rounded-2xl bg-[var(--surface-hover)]/60 border border-[var(--border)]/60 flex flex-col gap-1 shadow-xs">
                          <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase">Node Uptime</span>
                          <span className="text-sm font-black text-[var(--text-primary)]">99.98% (142 Days)</span>
                          <span className="text-[10px] text-[var(--text-muted)]">Zero packet drops</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-[var(--surface-hover)]/60 border border-[var(--border)]/60 flex flex-col gap-1 shadow-xs">
                          <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase">Legal Audit Status</span>
                          <span className="text-sm font-black text-[var(--accent)] ">BSA 2023 Verified</span>
                          <span className="text-[10px] text-[var(--text-muted)]">Sec 63 compliant</span>
                        </div>
                      </div>
                    </SettingControlGroup>
                  </div>
                )}
              </PremiumCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* STICKY SAVE BAR FOR DIRTY STATE CHANGES */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl bg-[#111111] text-white border border-[#FF5A1F]/40 shadow-2xl rounded-2xl px-5 py-3.5 flex items-center justify-between gap-4 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A1F] animate-ping" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Unsaved Configuration Changes</span>
                <span className="text-[10px] text-[var(--text-muted)]">Settings modified in {activeCategory.title}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetCategory}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-[var(--surface-muted)] transition-colors cursor-pointer"
              >
                Discard
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-[#FF5A1F] hover:bg-[#E04D18] text-white shadow-md transition-all cursor-pointer active:scale-95"
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}

// SUB-COMPONENTS & MODULAR CONTROLS

function SettingControlGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">
        {title}
      </h3>
      <div className="flex flex-col border border-[var(--border)] rounded-2xl p-4 bg-[var(--surface-hover)] gap-4">
        {children}
      </div>
    </div>
  );
}

function ToggleControl({ 
  label, 
  description, 
  checked, 
  onChange,
  disabled = false,
  badge
}: { 
  label: string; 
  description: string; 
  checked: boolean; 
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  badge?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0 border-[var(--border)]">
      <div className="pr-4">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-[var(--text-primary)] cursor-pointer">{label}</label>
          {badge && (
            <span className="text-[9px] font-mono font-bold bg-[var(--surface-muted)] text-[var(--text-secondary)] px-1.5 py-0.5 rounded border border-[var(--border)]">
              {badge}
            </span>
          )}
        </div>
        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{description}</p>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && onChange && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          disabled ? 'opacity-50 cursor-not-allowed bg-[var(--border)]' : checked ? 'bg-[#FF5A1F]' : 'bg-[var(--border-strong)]'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

function SegmentedControl({ 
  value, 
  options, 
  onChange 
}: { 
  value: string; 
  options: { label: string; value: string }[]; 
  onChange: (val: string) => void; 
}) {
  return (
    <div className="flex items-center bg-[var(--surface-muted)] p-1 rounded-xl gap-1 shrink-0 border border-[var(--border)]">
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isSelected 
                ? 'bg-[var(--surface)] text-[var(--accent)] shadow-xs' 
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function SelectControl({
  label,
  description,
  value,
  options,
  unit,
  onChange
}: {
  label: string;
  description: string;
  value: string;
  options: string[];
  unit?: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b last:border-0 border-[var(--border)] gap-2">
      <div>
        <label className="text-xs font-bold text-[var(--text-primary)]">{label}</label>
        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{description}</p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-[var(--surface)] border border-[var(--border-strong)] text-[var(--text-primary)] text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#FF5A1F] focus:ring-2 focus:ring-[#FF5A1F]/20 transition-colors cursor-pointer shadow-xs"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {unit && <span className="text-xs font-mono font-bold text-[var(--text-muted)]">{unit}</span>}
      </div>
    </div>
  );
}

function SliderControl({
  label,
  description,
  value,
  min,
  max,
  step,
  unit,
  onChange
}: {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (val: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2 py-2 border-b last:border-0 border-[var(--border)]">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-[var(--text-primary)]">{label}</label>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{description}</p>
        </div>
        <span className="text-xs font-mono font-bold text-[var(--accent)] bg-[var(--accent)]/10 dark:bg-[var(--accent)]/20 px-2 py-0.5 rounded-lg border border-[var(--accent)]/30">
          {value} {unit}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-[#FF5A1F] bg-[var(--border-strong)] h-1.5 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
}

function TextInputControl({
  label,
  description,
  value,
  onChange,
  icon: Icon
}: {
  label: string;
  description: string;
  value: string;
  onChange: (val: string) => void;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b last:border-0 border-[var(--border)] gap-2">
      <div>
        <label className="text-xs font-bold text-[var(--text-primary)]">{label}</label>
        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{description}</p>
      </div>

      <div className="relative shrink-0 w-full sm:w-56">
        {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-[var(--surface)] border border-[var(--border-strong)] text-[var(--text-primary)] text-xs font-mono font-bold rounded-xl py-1.5 pr-3 ${Icon ? 'pl-8' : 'pl-3'} focus:outline-none focus:border-[#FF5A1F] focus:ring-2 focus:ring-[#FF5A1F]/20 shadow-xs`}
        />
      </div>
    </div>
  );
}

function IntegrationCard({
  title,
  description,
  connected,
  onToggle,
  statusText
}: {
  title: string;
  description: string;
  connected: boolean;
  onToggle: (val: boolean) => void;
  statusText: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between gap-4 shadow-xs">
      <div>
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-bold text-[var(--text-primary)]">{title}</h4>
          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
            connected ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-[var(--surface-muted)] text-[var(--text-muted)]'
          }`}>
            {connected ? 'CONNECTED' : 'DISCONNECTED'}
          </span>
        </div>
        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{description}</p>
        <span className="text-[10px] font-mono text-[var(--text-muted)] mt-1 block">{statusText}</span>
      </div>

      <button
        onClick={() => onToggle(!connected)}
        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          connected
            ? 'bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:bg-red-50 hover:text-red-600'
            : 'bg-[#FF5A1F] text-white hover:bg-[#E04D18]'
        }`}
      >
        {connected ? 'Disconnect' : 'Connect Node'}
      </button>
    </div>
  );
}

function BuildingCodeIcon(props: any) {
  return <Server {...props} />;
}
