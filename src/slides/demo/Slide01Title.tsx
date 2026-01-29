import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import { TrendingUp, DollarSign, Users } from 'lucide-react';

const keyMetrics = [
  { icon: DollarSign, value: '$2.1T', label: 'AUM' },
  { icon: TrendingUp, value: '+18.4%', label: 'YTD Return' },
  { icon: Users, value: '15M+', label: 'Clients' },
];

export default function Slide01Title() {
  return (
    <MSSlideLayout variant="dark">
      <div className="flex flex-col justify-center h-full px-20 py-16">
        {/* Main title area */}
        <div className="max-w-4xl">
          <h1 className="text-6xl font-light tracking-tight text-white mb-6 leading-tight">
            Global Investment
            <br />
            <span className="font-semibold">Outlook 2025</span>
          </h1>
          
          <div className="w-24 h-1 bg-ms-blue mb-8" />
          
          <p className="text-xl text-white/80 font-light max-w-2xl leading-relaxed mb-12">
            Strategic insights and market perspectives for the year ahead
          </p>
          
          {/* Key metrics row */}
          <div className="flex gap-12">
            {keyMetrics.map((metric, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-ms-blue/20 flex items-center justify-center">
                  <metric.icon className="w-5 h-5 text-ms-blue" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">{metric.value}</p>
                  <p className="text-xs text-white/60">{metric.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer info */}
        <div className="absolute bottom-12 left-20">
          <p className="text-sm text-white/60 font-light">
            January 2025 | Wealth Management
          </p>
        </div>
      </div>
    </MSSlideLayout>
  );
}
