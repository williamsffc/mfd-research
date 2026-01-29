import React, { useState } from 'react';
import { SlideLayout } from '@/components/slides/SlideLayout';
import { cn } from '@/lib/utils';

const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'Product', 'Support'];
const capabilities = ['AI/ML', 'Automation', 'Analytics', 'Collaboration', 'Integration', 'Security'];

// Generate heatmap data
const generateData = () => {
  return departments.map(dept => ({
    department: dept,
    values: capabilities.map(() => Math.floor(Math.random() * 100)),
  }));
};

const getColor = (value: number) => {
  if (value >= 80) return 'bg-indigo-600';
  if (value >= 60) return 'bg-indigo-500';
  if (value >= 40) return 'bg-indigo-400';
  if (value >= 20) return 'bg-indigo-300';
  return 'bg-indigo-200';
};

const getTextColor = (value: number) => {
  if (value >= 60) return 'text-white';
  return 'text-indigo-900';
};

export default function Slide05Heatmap() {
  const [data, setData] = useState(generateData);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  return (
    <SlideLayout variant="default">
      <div className="flex flex-col h-full px-20 py-16">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-2">
              Data Visualization
            </p>
            <h2 className="text-4xl font-bold text-slate-900 mb-2">
              Feature Adoption Heatmap
            </h2>
            <p className="text-lg text-slate-500 font-light">
              Hover over cells to see adoption percentages
            </p>
          </div>
          <button
            onClick={() => setData(generateData())}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>

        {/* Heatmap */}
        <div className="flex-1 flex flex-col">
          {/* Column headers */}
          <div className="flex ml-36 mb-2">
            {capabilities.map((cap, i) => (
              <div 
                key={cap} 
                className={cn(
                  "flex-1 text-center text-sm font-medium transition-colors",
                  hoveredCell?.col === i ? "text-indigo-600" : "text-slate-500"
                )}
              >
                {cap}
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="flex-1 flex flex-col gap-2">
            {data.map((row, rowIndex) => (
              <div key={row.department} className="flex items-center gap-2 flex-1">
                {/* Row header */}
                <div 
                  className={cn(
                    "w-32 text-right pr-4 text-sm font-medium transition-colors",
                    hoveredCell?.row === rowIndex ? "text-indigo-600" : "text-slate-600"
                  )}
                >
                  {row.department}
                </div>

                {/* Cells */}
                <div className="flex-1 flex gap-2">
                  {row.values.map((value, colIndex) => (
                    <div
                      key={colIndex}
                      className={cn(
                        "flex-1 rounded-lg flex items-center justify-center transition-all cursor-pointer",
                        getColor(value),
                        hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex
                          ? "ring-2 ring-indigo-600 ring-offset-2 scale-105"
                          : "hover:scale-[1.02]"
                      )}
                      onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <span className={cn("text-lg font-semibold", getTextColor(value))}>
                        {value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-slate-200">
            <span className="text-sm text-slate-500">Adoption Level:</span>
            <div className="flex items-center gap-3">
              {[
                { label: '0-20%', color: 'bg-indigo-200' },
                { label: '20-40%', color: 'bg-indigo-300' },
                { label: '40-60%', color: 'bg-indigo-400' },
                { label: '60-80%', color: 'bg-indigo-500' },
                { label: '80-100%', color: 'bg-indigo-600' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className={cn("w-4 h-4 rounded", item.color)} />
                  <span className="text-xs text-slate-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}
