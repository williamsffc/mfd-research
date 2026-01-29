import React, { useState, useMemo } from 'react';
import { SlideLayout } from '@/components/slides/SlideLayout';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ReferenceLine,
  ReferenceDot,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { TrendingUp, DollarSign, Package, Percent } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

// Generate curve data points
const generateCurveData = (demandShift: number, supplyShift: number) => {
  const points = [];
  for (let q = 0; q <= 100; q += 2) {
    // Demand: P = 120 - Q + demandShift (downward sloping)
    const demandPrice = Math.max(0, 120 - q + demandShift);
    // Supply: P = 20 + 0.8Q + supplyShift (upward sloping)
    const supplyPrice = Math.max(0, 20 + 0.8 * q + supplyShift);
    
    points.push({
      quantity: q,
      demand: demandPrice,
      supply: supplyPrice,
    });
  }
  return points;
};

// Calculate equilibrium point
const calculateEquilibrium = (demandShift: number, supplyShift: number) => {
  // Demand: P = 120 - Q + demandShift
  // Supply: P = 20 + 0.8Q + supplyShift
  // At equilibrium: 120 - Q + demandShift = 20 + 0.8Q + supplyShift
  // 100 + demandShift - supplyShift = 1.8Q
  // Q = (100 + demandShift - supplyShift) / 1.8
  
  const equilibriumQ = (100 + demandShift - supplyShift) / 1.8;
  const equilibriumP = 20 + 0.8 * equilibriumQ + supplyShift;
  
  return {
    quantity: Math.max(0, Math.min(100, equilibriumQ)),
    price: Math.max(0, equilibriumP),
  };
};

// Calculate economic metrics
const calculateMetrics = (eq: { quantity: number; price: number }, demandShift: number, supplyShift: number) => {
  const { quantity, price } = eq;
  
  // Unit cost (supply price at Q=0 is the base cost)
  const unitCost = 20 + supplyShift;
  
  // Total Revenue = P × Q
  const revenue = price * quantity;
  
  // Total Cost (area under supply curve from 0 to Q)
  // Integral of (20 + 0.8Q + supplyShift) from 0 to Q = (20 + supplyShift)Q + 0.4Q²
  const totalCost = (20 + supplyShift) * quantity + 0.4 * quantity * quantity;
  
  // Profit = Revenue - Cost
  const profit = revenue - totalCost;
  
  // Consumer Surplus = area between demand curve and price line
  // = 0.5 × (maxPrice - eqPrice) × quantity
  const maxDemandPrice = 120 + demandShift;
  const consumerSurplus = 0.5 * (maxDemandPrice - price) * quantity;
  
  // Producer Surplus = area between price line and supply curve
  const producerSurplus = 0.5 * (price - unitCost) * quantity;
  
  // Profit margin
  const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
  
  return {
    quantity: Math.round(quantity * 10) / 10,
    price: Math.round(price * 100) / 100,
    revenue: Math.round(revenue),
    totalCost: Math.round(totalCost),
    profit: Math.round(profit),
    consumerSurplus: Math.round(consumerSurplus),
    producerSurplus: Math.round(producerSurplus),
    profitMargin: Math.round(profitMargin * 10) / 10,
    unitCost: Math.round(unitCost * 100) / 100,
  };
};

export default function Slide02InteractiveChart() {
  const [demandShift, setDemandShift] = useState(0);
  const [supplyShift, setSupplyShift] = useState(0);
  
  const curveData = useMemo(() => generateCurveData(demandShift, supplyShift), [demandShift, supplyShift]);
  const equilibrium = useMemo(() => calculateEquilibrium(demandShift, supplyShift), [demandShift, supplyShift]);
  const metrics = useMemo(() => calculateMetrics(equilibrium, demandShift, supplyShift), [equilibrium, demandShift, supplyShift]);

  return (
    <SlideLayout variant="default">
      <div className="flex flex-col h-full px-16 py-12">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
            <h1 className="text-4xl font-bold text-slate-900">
              Supply & Demand Simulator
            </h1>
          </div>
          <p className="text-lg text-slate-500 ml-5">
            Adjust the curves to see real-time market equilibrium and economic outcomes
          </p>
        </div>

        {/* Main content */}
        <div className="flex-1 flex gap-6 min-h-0">
          {/* Left: Chart */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 p-4 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={curveData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="quantity" 
                    label={{ value: 'Quantity (units)', position: 'bottom', offset: 0 }}
                    tick={{ fontSize: 12, fill: '#64748B' }}
                    stroke="#CBD5E1"
                  />
                  <YAxis 
                    label={{ value: 'Price ($)', angle: -90, position: 'insideLeft', offset: 10 }}
                    tick={{ fontSize: 12, fill: '#64748B' }}
                    stroke="#CBD5E1"
                    domain={[0, 140]}
                  />
                  
                  {/* Supply curve */}
                  <Line 
                    type="monotone" 
                    dataKey="supply" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={false}
                    name="Supply"
                    isAnimationActive={false}
                  />
                  
                  {/* Demand curve */}
                  <Line 
                    type="monotone" 
                    dataKey="demand" 
                    stroke="#6366F1" 
                    strokeWidth={3}
                    dot={false}
                    name="Demand"
                    isAnimationActive={false}
                  />
                  
                  {/* Equilibrium reference lines */}
                  <ReferenceLine 
                    x={equilibrium.quantity} 
                    stroke="#F59E0B" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                  />
                  <ReferenceLine 
                    y={equilibrium.price} 
                    stroke="#F59E0B" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                  />
                  
                  {/* Equilibrium point */}
                  <ReferenceDot 
                    x={equilibrium.quantity} 
                    y={equilibrium.price}
                    r={8}
                    fill="#F59E0B"
                    stroke="#FFF"
                    strokeWidth={3}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            {/* Sliders */}
            <div className="mt-4 grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-600" />
                    Demand Shift
                  </label>
                  <span className="text-sm text-slate-500 font-mono">
                    {demandShift > 0 ? '+' : ''}{demandShift}
                  </span>
                </div>
                <Slider
                  value={[demandShift]}
                  onValueChange={(v) => setDemandShift(v[0])}
                  min={-40}
                  max={40}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-slate-400">
                  ← Less demand | More demand →
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    Supply Shift
                  </label>
                  <span className="text-sm text-slate-500 font-mono">
                    {supplyShift > 0 ? '+' : ''}{supplyShift}
                  </span>
                </div>
                <Slider
                  value={[supplyShift]}
                  onValueChange={(v) => setSupplyShift(v[0])}
                  min={-40}
                  max={40}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-slate-400">
                  ← Lower costs | Higher costs →
                </p>
              </div>
            </div>
          </div>

          {/* Right: Metrics Panel */}
          <div className="w-72 flex flex-col gap-3">
            {/* Equilibrium */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-amber-800 mb-3 uppercase tracking-wide">
                Market Equilibrium
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-amber-600 mb-0.5">Price</p>
                  <p className="text-xl font-bold text-amber-900">
                    ${metrics.price}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-amber-600 mb-0.5">Quantity</p>
                  <p className="text-xl font-bold text-amber-900">
                    {metrics.quantity}
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Metrics */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex-1">
              <h3 className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wide">
                Financial Outcomes
              </h3>
              
              <div className="space-y-3">
                <MetricRow 
                  icon={DollarSign}
                  label="Total Revenue"
                  value={`$${metrics.revenue.toLocaleString()}`}
                  color="text-indigo-600"
                />
                <MetricRow 
                  icon={Package}
                  label="Total Cost"
                  value={`$${metrics.totalCost.toLocaleString()}`}
                  color="text-slate-600"
                />
                <div className="border-t border-slate-100 pt-3">
                  <MetricRow 
                    icon={TrendingUp}
                    label="Profit"
                    value={`$${metrics.profit.toLocaleString()}`}
                    color={metrics.profit >= 0 ? "text-emerald-600" : "text-red-600"}
                    highlight
                  />
                </div>
                <MetricRow 
                  icon={Percent}
                  label="Profit Margin"
                  value={`${metrics.profitMargin}%`}
                  color={metrics.profitMargin >= 0 ? "text-emerald-600" : "text-red-600"}
                />
              </div>
            </div>

            {/* Surplus */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wide">
                Economic Surplus
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Consumer</span>
                  <span className="font-semibold text-indigo-600 text-sm">
                    ${metrics.consumerSurplus.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Producer</span>
                  <span className="font-semibold text-emerald-600 text-sm">
                    ${metrics.producerSurplus.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Total Welfare</span>
                  <span className="font-bold text-slate-900 text-sm">
                    ${(metrics.consumerSurplus + metrics.producerSurplus).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-indigo-600 rounded" />
            <span className="text-sm text-slate-600">Demand</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-emerald-500 rounded" />
            <span className="text-sm text-slate-600">Supply</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-sm text-slate-600">Equilibrium</span>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}

// Metric row component
function MetricRow({ 
  icon: Icon, 
  label, 
  value, 
  color,
  highlight = false
}: { 
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className={`text-sm ${highlight ? 'font-medium text-slate-800' : 'text-slate-600'}`}>
          {label}
        </span>
      </div>
      <span className={`font-semibold ${color} ${highlight ? 'text-base' : 'text-sm'}`}>
        {value}
      </span>
    </div>
  );
}