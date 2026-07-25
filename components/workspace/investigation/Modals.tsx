import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';

interface ModalsProps {
  isDarkMode: boolean;
  cardBg: string;
  subCardBg: string;
  selectedEvidence: any;
  setSelectedEvidence: (evidence: any) => void;
  selectedPerson: any;
  setSelectedPerson: (person: any) => void;
  showNoteModal: boolean;
  setShowNoteModal: (show: boolean) => void;
  noteText: string;
  setNoteText: (text: string) => void;
  openCopilot: (prompt: string) => void;
  showToast: (msg: string) => void;
}

export default function Modals({
  isDarkMode,
  cardBg,
  subCardBg,
  selectedEvidence,
  setSelectedEvidence,
  selectedPerson,
  setSelectedPerson,
  showNoteModal,
  setShowNoteModal,
  noteText,
  setNoteText,
  openCopilot,
  showToast
}: ModalsProps) {
  return (
    <>
      {/* EVIDENCE LIGHTBOX MODAL */}
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
                <img src={selectedEvidence.url} alt={selectedEvidence.title} referrerPolicy="no-referrer" className="w-full h-full object-contain" />
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                <span>Type: {selectedEvidence.type}</span>
                <span>Size: {selectedEvidence.size}</span>
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

      {/* KEY PERSON MODAL */}
      <AnimatePresence>
        {selectedPerson && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-2xl border max-w-md w-full flex flex-col gap-4 relative ${cardBg}`}
            >
              <button
                onClick={() => setSelectedPerson(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full font-black text-sm flex items-center justify-center ${selectedPerson.color}`}>
                  {selectedPerson.initials}
                </div>
                <div>
                  <h3 className="text-lg font-black">{selectedPerson.name}</h3>
                  <p className="text-xs text-gray-400">{selectedPerson.role} • {selectedPerson.phone}</p>
                </div>
              </div>

              <div className={`p-3 rounded-xl border text-xs ${subCardBg}`}>
                <span className="font-bold block mb-1">Status / Statement:</span>
                <p className="text-gray-400">{selectedPerson.statement}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    openCopilot(`Draft interrogation or question list for ${selectedPerson.name}`);
                    setSelectedPerson(null);
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles size={14} /> AI Question Draft
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUICK NOTE MODAL */}
      <AnimatePresence>
        {showNoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-2xl border max-w-md w-full flex flex-col gap-4 relative ${cardBg}`}
            >
              <button
                onClick={() => setShowNoteModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="text-base font-black">Add Investigation Note</h3>

              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Type your official case note or observation..."
                rows={4}
                className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#FF5A1F] ${
                  isDarkMode ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-slate-50 border-gray-200 text-slate-900'
                }`}
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (noteText.trim()) {
                      showToast('Saved Note to Case Log');
                      setNoteText('');
                      setShowNoteModal(false);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-[#FF5A1F] text-white text-xs font-bold cursor-pointer"
                >
                  Save Note
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
