'use client';

const stats = [
  { label: 'Active Cases', value: '128', trend: '+12%' },
  { label: 'Evidence Items', value: '1,842', trend: '+18%' },
  { label: 'Suspects Linked', value: '431', trend: '+9%' },
  { label: 'Risk Alerts', value: '27', trend: '+23%' },
];

export default function CaseOverview() {
  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      {stats.map((stat, i) => (
        <div key={i} className="border border-[#EAEAEA] rounded-xl p-4 flex flex-col gap-2 bg-white/50">
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#6B7280]">{stat.label}</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#111111]">{stat.value}</span>
            <span className="text-[10px] font-bold text-[#FF5A1F]">{stat.trend}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
