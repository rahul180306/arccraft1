'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

const stats = [
  { value: '62%', label: 'Faster Case Resolution' },
  { value: '43%', label: 'Reduction in Manual Review' },
  { value: '89%', label: 'Improved Link Discovery' },
  { value: '96%', label: 'Officer Satisfaction' },
];

const testimonials = [
  {
    quote: "ArcCraft has completely changed the way we approach complex investigations. The ability to visualize connections and get explainable AI recommendations saves us hours of manual work.",
    author: "Inspector Ravi Kumar",
    role: "Cyber Crime Unit, Karnataka Police"
  },
  {
    quote: "Reducing cognitive bias is one of our biggest challenges in decision making. The Copilot prompts objective, evidence-first directions, ensuring higher audit accuracy.",
    author: "Chief Superintendent Sarah Jenkins",
    role: "Special Crimes Division"
  },
  {
    quote: "The speed at which the platform resolve entities and builds knowledge graphs is truly enterprise level. Connecting multiple case files has never been this seamless.",
    author: "Senior Analyst Mark Fletcher",
    role: "Intelligence & Analysis Unit"
  }
];

export default function ImpactProof() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelectorAll('.animate-on-scroll'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  return (
    <section ref={containerRef} className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full select-none border-t border-[#EAEAEA]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left Column: Stats & Results */}
        <div className="animate-on-scroll space-y-10">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#111111]">
              Real Impact. Measurable <span className="text-[#FF5A1F]">Results</span>.
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, i) => (
              <div 
                key={i}
                className="bg-white border border-[#EAEAEA] rounded-[20px] p-6 flex flex-col justify-between h-40 hover:border-[#FF5A1F] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
              >
                <div className="text-4xl md:text-5xl font-black text-[#FF5A1F] tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[12px] md:text-sm font-bold text-[#111111] uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#111111] hover:text-[#FF5A1F] transition-colors group">
            <span>View Research & Case Studies</span>
            <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        {/* Right Column: Testimonials */}
        <div className="animate-on-scroll space-y-8 lg:pl-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#111111]">
              Trusted by Investigators
            </h2>
          </div>

          <div className="relative bg-white border border-[#EAEAEA] rounded-[24px] p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.02)] min-h-[300px] flex flex-col justify-between">
            {/* Quote icon / mark */}
            <div className="text-6xl font-serif text-[#FF5A1F] leading-none select-none opacity-40">
              “
            </div>

            {/* Testimonial Quote */}
            <p className="text-sm md:text-base text-[#6B7280] font-medium leading-relaxed italic relative -top-4">
              {testimonials[activeTestimonial].quote}
            </p>

            {/* Testimonial Author */}
            <div className="border-t border-[#EAEAEA] pt-6 mt-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h4 className="font-bold text-sm text-[#111111] uppercase tracking-wider">
                  {testimonials[activeTestimonial].author}
                </h4>
                <p className="text-[11px] text-[#6B7280] font-semibold uppercase tracking-widest mt-1">
                  {testimonials[activeTestimonial].role}
                </p>
              </div>

              {/* Slider Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${i === activeTestimonial ? 'bg-[#FF5A1F]' : 'bg-[#EAEAEA]'}`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
