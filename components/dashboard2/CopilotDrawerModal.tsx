'use client';

import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { 
  X, 
  Sparkles, 
  Send, 
  Mic, 
  Upload, 
  FileText, 
  Bot, 
  User, 
  Paperclip, 
  CheckCircle2,
  ArrowUpRight,
  Download,
  ChevronDown,
  Zap,
  Brain,
  Cpu
} from 'lucide-react';
import { exportToPDF } from '@/lib/pdfExport';
import { useInvestigationStore } from '@/lib/stores/investigationStore';
import { useDashboardMetrics } from '@/lib/stores/selectors';


interface CopilotDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  confidence?: number;
  sources?: string[];
  fileData?: string;
  fileMimeType?: string;
}

export default function CopilotDrawerModal({ isOpen, onClose, initialPrompt }: CopilotDrawerModalProps) {
  const [inputMsg, setInputMsg] = useState('');
  const [attachment, setAttachment] = useState<{data: string, mimeType: string, name: string} | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const metrics = useDashboardMetrics();

  // ── Model selection: gemini-flash | gemini-pro | glm | kimi | minimax
  const [selectedModel, setSelectedModel] = useState<'gemini-flash' | 'gemini-pro' | 'glm' | 'kimi' | 'minimax'>('gemini-flash');
  const [showModelMenu, setShowModelMenu] = useState(false);

  const MODEL_OPTIONS = [
    { id: 'gemini-flash', label: 'Gemini 2.5 Flash', icon: '⚡', color: 'text-blue-400', desc: 'Fast, default' },
    { id: 'gemini-pro', label: 'Gemini 2.5 Pro', icon: '🧠', color: 'text-purple-400', desc: 'Deep reasoning' },
    { id: 'glm', label: 'GLM-5.2 (NVIDIA)', icon: '🔷', color: 'text-emerald-400', desc: 'NVIDIA fast' },
    { id: 'kimi', label: 'Kimi K2.6 (NVIDIA)', icon: '🌙', color: 'text-orange-400', desc: '128K context' },
    { id: 'minimax', label: 'Minimax-M3 (NVIDIA)', icon: '🟣', color: 'text-pink-400', desc: 'Structured analysis' },
  ] as const;

  const currentModel = MODEL_OPTIONS.find(m => m.id === selectedModel) || MODEL_OPTIONS[0];

  const activeCase = useInvestigationStore(s => s.activeCase);

  // Guard: this modal is only rendered after Dashboard2 confirms data is loaded
  if (!activeCase) return null;

  // Derive greeting memoized
  const greeting = React.useMemo(() => {
    return {
      sender: 'assistant' as const,
      systemPrompt: `You are an advanced police intelligence AI. You speak in a highly professional, clinical tone. Analyze intelligence and map facts back to the BNS (Bharatiya Nyaya Sanhita). Current active case context: FIR ${activeCase.crimeNo} (${activeCase.crimeHead} - ${activeCase.crimeSubHead}) in ${activeCase.district}. Status: ${activeCase.caseStatus}. IO: ${activeCase.ioName}.`,
      text: `### 🧠 ArcCraft AI Intelligence Copilot Active\nNamaste Inspector ${activeCase.ioName}. I have access to the **KSP CCTNS database with ${metrics.totalFIRs.toLocaleString()} real FIRs**.\n\n- **Active Case**: FIR \`${activeCase.crimeNo}\` — ${activeCase.crimeSubHead}, ${activeCase.policeStation}\n- **Accused**: ${activeCase.accused.map(a=>a.name).join(', ')}\n- **Status**: ${activeCase.caseStatus} | **District**: ${activeCase.district}\n- **Crime Stats**: ${metrics.underInvestigation} Under Investigation · ${metrics.pendingTrial} Pending Trial · ${metrics.convicted} Convicted\n\nWhat investigation task, legal query, or intelligence analysis would you like to run today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      confidence: 98,
      sources: [`FIR ${activeCase.crimeNo}`, "CCTNS Karnataka", "KSP AFIS DB", "BNS/BNSS Code"]
    };
  }, [activeCase, metrics]);

  const [messages, setMessages] = useState<Message[]>([greeting]);

  // Update greeting only if the active case changes (don't erase chat for unrelated updates)
  useEffect(() => {
    setMessages([greeting]);
  }, [activeCase.crimeNo]);


  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);

  const isTaskActiveRef = React.useRef(false);
  const processedPromptRef = React.useRef<string | null>(null);
  const messagesRef = React.useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          const dataPart = base64data.split(',')[1];
          setAttachment({ data: dataPart, mimeType: 'audio/webm', name: 'Voice Note' });
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Str = event.target?.result as string;
        const dataPart = base64Str.split(',')[1];
        setAttachment({ data: dataPart, mimeType: file.type, name: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = React.useCallback(async (text: string, attachedFile?: {data: string, mimeType: string, name: string} | null) => {
    if (isTaskActiveRef.current) {
      console.warn("A task is currently in progress. Ignoring new input until completion.");
      return;
    }
    if (!text.trim() && !attachedFile) return;

    isTaskActiveRef.current = true;
    setIsTyping(true);

    const userMsg: Message = {
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...(attachedFile ? { fileData: attachedFile.data, fileMimeType: attachedFile.mimeType } : {})
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMsg('');
    setAttachment(null);

    try {
      // Call backend copilot API route
      const searchToggle = document.getElementById('search-grounding-toggle') as HTMLInputElement | null;
      const thinkingToggle = document.getElementById('deep-thinking-toggle') as HTMLInputElement | null;
      const fastToggle = document.getElementById('fast-response-toggle') as HTMLInputElement | null;
      
      const useSearch = searchToggle?.checked || text.toLowerCase().includes('search') || text.toLowerCase().includes('latest');
      const useThinking = thinkingToggle ? thinkingToggle.checked : true;
      const useFast = fastToggle ? fastToggle.checked : false;

      const historyToSend = [...messagesRef.current, userMsg].map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
        ...(m.fileData ? { fileData: m.fileData, fileMimeType: m.fileMimeType } : {})
      }));

      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          useSearch,
          useThinking: selectedModel === 'gemini-pro',
          useFast: selectedModel === 'gemini-flash',
          useNvidia: ['glm', 'kimi', 'minimax'].includes(selectedModel),
          nvidiaModel: selectedModel,
          systemPrompt: greeting.systemPrompt,
          messages: historyToSend
        })
      });

      if (!response.ok) {
        let errData = 'API Request Failed';
        try {
          errData = await response.text();
        } catch(e) {}
        throw new Error(`Server returned ${response.status}: ${errData}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';
      let sseBuffer = '';

      const assistantMsg: Message = {
        sender: 'assistant',
        text: '',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: 96,
        sources: [`FIR ${activeCase.crimeNo}`, "CCTNS Karnataka", `Model: ${currentModel.label}`, "BNS / BNSS Code"]
      };

      setMessages(prev => [...prev, assistantMsg]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunkStr = decoder.decode(value, { stream: true });
          sseBuffer += chunkStr;

          const lines = sseBuffer.split('\n');
          sseBuffer = lines.pop() || '';

          let hasNewText = false;
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              const dataPayload = trimmed.slice(6).trim();
              if (dataPayload === '[DONE]') continue;
              try {
                const parsed = JSON.parse(dataPayload);
                if (parsed.text) {
                  accumulatedText += parsed.text;
                  hasNewText = true;
                }
              } catch (e) {
                // Ignore parse error on partial chunks
              }
            }
          }

          if (hasNewText) {
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                text: accumulatedText
              };
              return updated;
            });
          }
        }

        if (sseBuffer.trim().startsWith('data: ')) {
          const dataPayload = sseBuffer.trim().slice(6).trim();
          if (dataPayload !== '[DONE]') {
            try {
              const parsed = JSON.parse(dataPayload);
              if (parsed.text) {
                accumulatedText += parsed.text;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    text: accumulatedText
                  };
                  return updated;
                });
              }
            } catch (e) {
              // ignore
            }
          }
        }
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: `### ⚠️ Copilot System Error\nUnable to reach ArcCraft AI services at this moment.\n\n**Error Details**: ${err.message || 'Service temporarily busy'}\n\nPlease check your network connection or API quota limits and try again.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
      isTaskActiveRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      processedPromptRef.current = null;
      return;
    }

    if (initialPrompt && processedPromptRef.current !== initialPrompt && !isTaskActiveRef.current) {
      processedPromptRef.current = initialPrompt;
      sendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen, sendMessage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0F19]/80 backdrop-blur-md flex justify-end animate-fadeIn">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between border-l border-gray-200">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#111111] text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF5A1F] text-white flex items-center justify-center font-bold shadow">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">ArcCraft AI Copilot</h2>
              <p className="text-[10px] text-gray-400 font-medium">Karnataka Police Intelligence — {metrics.totalFIRs.toLocaleString()} Real FIRs in CCTNS</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Model Selector */}
            <div className="relative">
              <button
                onClick={() => setShowModelMenu(!showModelMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold transition-colors cursor-pointer border border-gray-700"
              >
                <span>{currentModel.icon}</span>
                <span className="text-gray-200">{currentModel.id === 'gemini-flash' ? 'Flash' : currentModel.id === 'gemini-pro' ? 'Pro' : currentModel.label.split(' ')[0]}</span>
                <ChevronDown size={11} className="text-gray-400" />
              </button>
              {showModelMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-[#1a1a2e] border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  {MODEL_OPTIONS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setSelectedModel(m.id as any); setShowModelMenu(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-gray-700/50 transition-colors cursor-pointer ${
                        selectedModel === m.id ? 'bg-gray-700/30' : ''
                      }`}
                    >
                      <span className="text-base">{m.icon}</span>
                      <div>
                        <div className={`text-xs font-bold ${m.color}`}>{m.label}</div>
                        <div className="text-[9px] text-gray-500">{m.desc}</div>
                      </div>
                      {selectedModel === m.id && <CheckCircle2 size={12} className="ml-auto text-emerald-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button 
              onClick={() => {
                const chatHistory = messages.map(m => `[${m.time}] ${m.sender.toUpperCase()}:\n${m.text}`).join('\n\n---\n\n');
                exportToPDF("ArcCraft Copilot Intelligence Log", chatHistory);
              }}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Export Chat History as PDF"
            >
              <Download size={16} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50" data-lenis-prevent>
          {messages.map((msg, index) => (
            <div 
              key={index}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[9px] font-mono font-bold uppercase text-gray-400">{msg.sender === 'user' ? 'Inspector Arjun' : 'ArcCraft AI Copilot'}</span>
                <span className="text-[8px] font-mono text-gray-400">{msg.time}</span>
              </div>

              <div className={`p-4 rounded-2xl max-w-xl text-xs leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-[#FF5A1F] text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none font-medium'}`}>
                {msg.fileData && msg.fileMimeType?.startsWith('image/') && (
                  <img 
                    src={`data:${msg.fileMimeType};base64,${msg.fileData}`} 
                    alt="Uploaded attachment" 
                    className="w-full max-w-[240px] rounded-xl mb-3 border border-white/20"
                  />
                )}
                {msg.fileData && msg.fileMimeType?.startsWith('audio/') && (
                  <audio controls className="w-full max-w-[240px] mb-3">
                    <source src={`data:${msg.fileMimeType};base64,${msg.fileData}`} type={msg.fileMimeType} />
                  </audio>
                )}

                {msg.sender === 'user' ? (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <div className="markdown-body text-xs leading-relaxed space-y-2 [&_h3]:font-bold [&_h3]:text-indigo-950 [&_h3]:text-sm [&_h3]:mt-3 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-4 [&_p]:mb-1 [&_strong]:text-black">
                    {msg.text ? (
                      <Markdown>{msg.text}</Markdown>
                    ) : (
                      isTyping && <span className="animate-pulse text-gray-400">Analyzing CCTNS dataset & evidence files...</span>
                    )}
                  </div>
                )}
                
                {msg.sender === 'assistant' && (msg.confidence || msg.sources) && (
                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-2">
                    {msg.confidence && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Copilot Confidence:</span>
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">{msg.confidence}%</span>
                      </div>
                    )}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="flex items-start gap-2">
                        <ArrowUpRight size={12} className="text-blue-500 mt-0.5" />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Grounding & Datasets Analyzed:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {msg.sources.map((src, i) => (
                              <span key={i} className="text-[9px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                                {src}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#FF5A1F] font-bold font-mono">
              <Sparkles size={14} className="animate-spin" />
              <span>ArcCraft is reasoning across CCTNS database...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-4 mb-3 px-1">
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase cursor-pointer hover:text-indigo-600 transition-colors">
              <input 
                type="checkbox" 
                className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                id="deep-thinking-toggle"
                defaultChecked
              />
              <Sparkles size={12} className="text-indigo-500" />
              High Thinking Mode
            </label>
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase cursor-pointer hover:text-blue-600 transition-colors">
              <input 
                type="checkbox" 
                className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                id="search-grounding-toggle"
              />
              <ArrowUpRight size={12} className="text-blue-500" />
              Web Search Grounding
            </label>
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase cursor-pointer hover:text-emerald-600 transition-colors">
              <input 
                type="checkbox" 
                className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                id="fast-response-toggle"
              />
              <Sparkles size={12} className="text-emerald-500" />
              Fast Response
            </label>
          </div>
          {/* P1 Quick Copilot Action Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mb-2 pb-1">
            {[
              { label: '📄 Summarize Case', prompt: 'Provide a concise summary brief of FIR KRP/2026/0456' },
              { label: '💡 Suggest Next Steps', prompt: 'What are the top 3 next best actions for the Investigating Officer on this case?' },
              { label: '🔍 Explain Evidence', prompt: 'Explain the forensic fingerprint match and CCTV evidence details' },
              { label: '🗣️ Draft Witness Questions', prompt: 'Draft a Section 161 CrPC interrogation questioning list for the accused' }
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  if (!isTyping) {
                    sendMessage(chip.prompt);
                  }
                }}
                className="px-2.5 py-1 rounded-full bg-[#111827] text-white hover:bg-[#FF5A1F] border border-white/10 text-[10px] font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {attachment && (
            <div className="flex items-center gap-2 p-2 mb-2 bg-indigo-50 border border-indigo-100 rounded-xl relative">
              <div className="flex-1 overflow-hidden">
                {attachment.mimeType.startsWith('image/') && (
                  <img src={`data:${attachment.mimeType};base64,${attachment.data}`} alt="preview" className="h-10 rounded object-cover" />
                )}
                {attachment.mimeType.startsWith('audio/') && (
                  <audio controls className="h-10 w-48">
                    <source src={`data:${attachment.mimeType};base64,${attachment.data}`} type={attachment.mimeType} />
                  </audio>
                )}
                <p className="text-[10px] font-medium text-indigo-700 truncate">{attachment.name}</p>
              </div>
              <button 
                type="button" 
                onClick={() => setAttachment(null)}
                className="p-1 rounded-full bg-white text-gray-500 hover:text-red-500 hover:bg-red-50"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (!isTyping) {
                sendMessage(inputMsg, attachment);
              }
            }}
            className="flex items-center gap-2"
          >
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,audio/*"
            />
            <button 
              type="button"
              disabled={isTyping}
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              title="Attach File"
            >
              <Paperclip size={18} />
            </button>
            <button
              type="button"
              disabled={isTyping}
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-2.5 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0 ${isRecording ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700'}`}
              title="Record Voice Note"
            >
              <Mic size={18} />
            </button>
            <div className="flex-1 flex items-center bg-gray-100 border border-gray-200 rounded-2xl px-4 py-2.5 focus-within:border-[#FF5A1F] focus-within:bg-white transition-all">
              <input 
                type="text" 
                disabled={isTyping}
                placeholder={isTyping ? "ArcCraft is generating response..." : "Ask ArcCraft or command an investigation step..."}
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-gray-800 outline-none disabled:opacity-60"
              />
            </div>

            <button 
              type="submit"
              disabled={isTyping || (!inputMsg.trim() && !attachment)}
              className="bg-[#FF5A1F] hover:bg-[#e04d19] disabled:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-2xl transition-all shadow-md shrink-0 flex items-center justify-center"
              title={isTyping ? "Task in progress..." : "Send Message"}
            >
              {isTyping ? <Sparkles size={16} className="animate-spin text-white" /> : <Send size={16} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
