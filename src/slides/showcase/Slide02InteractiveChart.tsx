import React, { useState } from 'react';
import { SlideLayout } from '@/components/slides/SlideLayout';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, 
  Tooltip, Cell 
} from 'recharts';

const initialData = [
  { name: 'React', value: 85, color: '#6366f1' },
  { name: 'Vue', value: 62, color: '#8b5cf6' },
  { name: 'Angular', value: 48, color: '#a855f7' },
  { name: 'Svelte', value: 35, color: '#d946ef' },
  { name: 'Solid', value: 22, color: '#ec4899' },
];

export default function Slide02InteractiveChart() {
  const [data, setData] = useState(initialData);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const randomize = () => {
    setData(data.map(item => ({
      ...item,
      value: Math.floor(Math.random() * 80) + 20,
    })));
  };

  const resetData = () => {
    setData(initialData);
  };

  return (
    <SlideLayout variant="default">
      <div className="flex flex-col h-full px-20 py-16">
        {/* Header */}
        <div className="mb-8">
          <p className="text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-2">
            Interactive Demo
          </p>
          <h2 className="text-4xl font-bold text-slate-900 mb-2">
            Click to Interact
          </h2>
          <p className="text-lg text-slate-500 font-light">
            Hover over bars and use the buttons below
          </p>
        </div>

        {/* Chart */}
        <div className="flex-1 bg-slate-50 rounded-2xl p-6 border border-slate-200">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#64748b', fontSize: 14 }} 
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#1e293b',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
              />
              <Bar 
                dataKey="value" 
                radius={[8, 8, 0, 0]}
                onMouseEnter={(_, index) => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    opacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.4}
                    style={{ 
                      transition: 'opacity 0.2s ease',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={randomize}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
          >
            Randomize Data
          </button>
          <button
            onClick={resetData}
            className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors border border-slate-200"
          >
            Reset
          </button>
        </div>
      </div>
    </SlideLayout>
  );
}
