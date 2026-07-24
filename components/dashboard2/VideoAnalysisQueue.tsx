'use create_file';
import React, { useState } from 'react';
import { 
  Video, 
  Play, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Sparkles,
  Layers
} from 'lucide-react';

interface VideoAnalysisQueueProps {
  onViewKeyframes: (videoName: string) => void;
}

export default function VideoAnalysisQueue({ onViewKeyframes }: VideoAnalysisQueueProps) {
  const [videoTasks] = useState([
    {
      id: 'v1',
      fileName: 'CCTV_ExitGate_Camera03.mp4',
      size: '240 MB',
      progress: 62,
      eta: '1 min 45 sec',
      status: 'Processing Keyframes',
      detections: ['Blue SUV KA-03-MN-4491', 'Helmetless Driver', 'Black Duffel Bag']
    },
    {
      id: 'v2',
      fileName: 'ATM_Surveillance_Cam1.mp4',
      size: '110 MB',
      progress: 100,
      eta: 'Completed',
      status: 'Analysis Complete',
      detections: ['Suspect Face Match (87%)', 'Crowbar Weapon Detected']
    }
  ]);

  return (
    <div className="bg-white border border-[#EBF0F5] rounded-[24px] p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Video size={16} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#111111] tracking-tight">
                CCTV Video Analysis Queue
              </h3>
              <p className="text-[10px] text-gray-400 font-medium">
                AI Vision Keyframe & Object Detection Engine
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Active Processing
          </span>
        </div>

        <div className="flex flex-col gap-4 my-4">
          {videoTasks.map((task) => (
            <div key={task.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video size={14} className="text-[#FF5A1F]" />
                  <span className="text-xs font-bold text-gray-900 font-mono">{task.fileName}</span>
                  <span className="text-[9px] text-gray-400 font-mono">({task.size})</span>
                </div>
                <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${task.progress === 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {task.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${task.progress === 100 ? 'bg-emerald-600' : 'bg-[#FF5A1F] animate-pulse'}`}
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-extrabold text-gray-800">{task.progress}%</span>
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <span className="text-gray-500 font-medium">ETA: {task.eta}</span>
                <button 
                  onClick={() => onViewKeyframes(task.fileName)}
                  className="text-[#FF5A1F] hover:underline font-bold flex items-center gap-1"
                >
                  <Eye size={12} />
                  <span>View Detections</span>
                </button>
              </div>

              {/* Detected Keyframes Chips */}
              <div className="flex flex-wrap gap-1 mt-1">
                {task.detections.map((det, idx) => (
                  <span key={idx} className="text-[9px] font-semibold bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded-md">
                    🎯 {det}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 text-[10px] text-gray-400 font-medium text-center">
        Extracts license plates, face embeddings, & object keyframes at 60 FPS.
      </div>
    </div>
  );
}
