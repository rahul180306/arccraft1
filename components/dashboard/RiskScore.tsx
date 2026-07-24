'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function RiskScore() {
  const needleRef = useRef<SVGPathElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    // Animate score counter
    const scoreObj = { val: 0 };
    gsap.to(scoreObj, {
      val: 78,
      duration: 2,
      ease: 'power3.out',
      delay: 1,
      onUpdate: () => {
        if (scoreRef.current) {
          scoreRef.current.innerText = Math.round(scoreObj.val).toString();
        }
      }
    });

    // Animate circular stroke
    if (circleRef.current) {
      const length = circleRef.current.getTotalLength();
      gsap.fromTo(circleRef.current, 
        { strokeDasharray: length, strokeDashoffset: length },
        { strokeDashoffset: length * (1 - 0.78), duration: 2, ease: 'power3.out', delay: 1 }
      );
    }

    // Animate needle rotation
    if (needleRef.current) {
      gsap.fromTo(needleRef.current,
        { rotation: -90, transformOrigin: 'bottom center' },
        { rotation: (180 * 0.78) - 90, duration: 2, ease: 'power3.out', delay: 1 }
      );
    }

  }, []);

  return (
    <div className="flex items-end justify-between mt-6">
      <div>
        <div className="flex items-baseline">
          <span ref={scoreRef} className="text-5xl font-black tracking-tighter text-[#111111]">0</span>
          <span className="text-sm font-bold text-[#6B7280] ml-1">/100</span>
        </div>
        <div className="text-[10px] font-bold text-[#FF5A1F] uppercase tracking-widest mt-1">
          High Risk
        </div>
      </div>
      <div className="relative w-24 h-12 overflow-hidden">
        <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
          {/* Background arc */}
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#EAEAEA" strokeWidth="12" strokeLinecap="round" />
          {/* Foreground arc (animated) */}
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#FF5A1F" strokeWidth="12" strokeLinecap="round" strokeDasharray="125.6" strokeDashoffset="125.6" ref={circleRef as any} />
          {/* Needle */}
          <g ref={needleRef as any} transform="translate(50, 50)">
            <path d="M -2 0 L 2 0 L 0 -35 Z" fill="#111111" />
            <circle cx="0" cy="0" r="4" fill="#111111" />
          </g>
        </svg>
      </div>
    </div>
  );
}
