import React, { useState, useMemo } from 'react';
import { SlideLayout } from '@/components/slides/SlideLayout';
import { XAxis, YAxis, CartesianGrid, ReferenceLine, ReferenceDot, ResponsiveContainer, ComposedChart, Line } from 'recharts';
import { TrendingUp, DollarSign, Package, Percent } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

// Exponential demand: P = A * e^(-k*Q) + shift
// Exponential supply: P = B * (1 - e^(-m*Q)) + base + shift
const generateCurveData = (demandShift: number, supplyShift: number) => {
  const points = [];
  const demandA = 120;
  const demandK = 0.025;
  const supplyBase = 15;
  const supplyB = 100;
  const supplyM = 0.03;

  for (let q = 0; q <= 100; q += 1) {
    const demandPrice = Math.max(0, demandA * Math.exp(-demandK * q) + demandShift);
    const supplyPrice = Math.max(0, supplyBase + supplyB * (1 - Math.exp(-supplyM * q)) + supplyShift);
    points.push({
      quantity: q,
      demand: demandPrice,
      supply: supplyPrice
    });
  }
  return points;
};

const calculateEquilibrium = (demandShift: number, supplyShift: number) => {
  const demandA = 120;
  const demandK = 0.025;
  const supplyBase = 15;
  const supplyB = 100;
  const supplyM = 0.03;

  let q = 50;
  for (let i = 0; i < 20; i++) {
    const demand = demandA * Math.exp(-demandK * q) + demandShift;
    const supply = supplyBase + supplyB * (1 - Math.exp(-supplyM * q)) + supplyShift;
    const diff = demand - supply;
    if (Math.abs(diff) < 0.01) break;

    const dDemand = -demandA * demandK * Math.exp(-demandK * q);
    const dSupply = supplyB * supplyM * Math.exp(-supplyM * q);
    const dDiff = dDemand - dSupply;
    q = q - diff / dDiff;
    q = Math.max(0, Math.min(100, q));
  }
  const equilibriumP = supplyBase + supplyB * (1 - Math.exp(-supplyM * q)) + supplyShift;
  return {
    quantity: Math.max(0, Math.min(100, q)),
    price: Math.max(0, equilibriumP)
  };
};

const calculateMetrics = (eq: { quantity: number; price: number }, demandShift: number, supplyShift: number) => {
  const { quantity, price } = eq;
  const demandA = 120;
  const demandK = 0.025;
  const supplyBase = 15;
  const supplyB = 100;
  const supplyM = 0.03;

  const unitCost = supplyBase + supplyShift;
  const revenue = price * quantity;

  let totalCost = 0;
  const step = 0.5;
  for (let q = 0; q < quantity; q += step) {
    const supplyPrice = supplyBase + supplyB * (1 - Math.exp(-supplyM * q)) + supplyShift;
    totalCost += supplyPrice * step;
  }

  const profit = revenue - totalCost;

  let consumerSurplus = 0;
  for (let q = 0; q < quantity; q += step) {
    const demandPrice = demandA * Math.exp(-demandK * q) + demandShift;
    consumerSurplus += Math.max(0, demandPrice - price) * step;
  }

  let producerSurplus = 0;
  for (let q = 0; q < quantity; q += step) {
    const supplyPrice = supplyBase + supplyB * (1 - Math.exp(-supplyM * q)) + supplyShift;
    producerSurplus += Math.max(0, price - supplyPrice) * step;
  }

  const profitMargin = revenue > 0 ? profit / revenue * 100 : 0;
  return {
    quantity: Math.round(quantity * 10) / 10,
    price: Math.round(price * 100) / 100,
    revenue: Math.round(revenue),
    totalCost: Math.round(totalCost),
    profit: Math.round(profit),
    consumerSurplus: Math.round(consumerSurplus),
    producerSurplus: Math.round(producerSurplus),
    profitMargin: Math.round(profitMargin * 10) / 10,
    unitCost: Math.round(unitCost * 100) / 100
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
            <div className="w-1.5 h-8 bg-slide-accent rounded-full" />
            <h1 className="type-h2 text-slide-gray-900">Interactive Simulations</h1>
          </div>
          <p className="type-body text-slide-gray-500 ml-5">
            Adjust the curves to see real-time market equilibrium
          </p>
        </div>

        {/* Main content */}
        <div className="flex-1 flex gap-6 min-h-0">
          {/* Left: Chart */}
          <div className="w-2/3 flex flex-col min-h-0">
            <div className="flex-1 bg-slide-gray-100 rounded-xl border border-slide-gray-200 p-4 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={curveData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--slide-gray-200))" />
                  <XAxis 
                    dataKey="quantity" 
                    label={{ value: 'Quantity (units)', position: 'bottom', offset: 0 }}
                    tick={{ fontSize: 14, fill: 'hsl(var(--slide-gray-500))' }}
                    stroke="hsl(var(--slide-gray-300))"
                  />
                  <YAxis 
                    label={{ value: 'Price ($)', angle: -90, position: 'insideLeft', offset: 10 }}
                    tick={{ fontSize: 14, fill: 'hsl(var(--slide-gray-500))' }}
                    stroke="hsl(var(--slide-gray-300))"
                    domain={[0, 140]}
                  />
                  
                  <Line type="monotone" dataKey="supply" stroke="hsl(var(--slide-success))" strokeWidth={3} dot={false} name="Supply" isAnimationActive={false} />
                  <Line type="monotone" dataKey="demand" stroke="hsl(var(--slide-accent))" strokeWidth={3} dot={false} name="Demand" isAnimationActive={false} />
                  
                  <ReferenceLine x={equilibrium.quantity} stroke="hsl(var(--slide-warning))" strokeDasharray="5 5" strokeWidth={2} />
                  <ReferenceLine y={equilibrium.price} stroke="hsl(var(--slide-warning))" strokeDasharray="5 5" strokeWidth={2} />
                  
                  <ReferenceDot x={equilibrium.quantity} y={equilibrium.price} r={8} fill="hsl(var(--slide-warning))" stroke="#FFF" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="mt-3 flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-slide-accent rounded" />
                <span className="type-caption text-slide-gray-600">Demand</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-slide-success rounded" />
                <span className="type-caption text-slide-gray-600">Supply</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slide-warning" />
                <span className="type-caption text-slide-gray-600">Equilibrium</span>
              </div>
            </div>
          </div>

          {/* Right: Controls & Metrics */}
          <div className="w-1/3 flex flex-col gap-4 overflow-y-auto">
            {/* Curve Controls */}
            <div className="bg-white border border-slide-gray-200 rounded-xl p-5">
              <h3 className="type-label text-slide-gray-700 mb-4">Curve Controls</h3>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="type-caption font-medium text-slide-gray-700 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-slide-accent" />
                      Demand Shift
                    </label>
                    <span className="type-caption text-slide-gray-500 type-mono bg-slide-gray-100 px-2 py-0.5 rounded">
                      {demandShift > 0 ? '+' : ''}{demandShift}
                    </span>
                  </div>
                  <Slider value={[demandShift]} onValueChange={v => setDemandShift(v[0])} min={-40} max={40} step={1} className="w-full" />
                  <p className="type-caption text-slide-gray-400">← Less demand | More demand →</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="type-caption font-medium text-slide-gray-700 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-slide-success" />
                      Supply Shift
                    </label>
                    <span className="type-caption text-slide-gray-500 type-mono bg-slide-gray-100 px-2 py-0.5 rounded">
                      {supplyShift > 0 ? '+' : ''}{supplyShift}
                    </span>
                  </div>
                  <Slider value={[supplyShift]} onValueChange={v => setSupplyShift(v[0])} min={-40} max={40} step={1} className="w-full" />
                  <p className="type-caption text-slide-gray-400">← Lower costs | Higher costs →</p>
                </div>
              </div>
            </div>
            
            {/* Equilibrium */}
            <div className="bg-slide-warning/10 border border-slide-warning/30 rounded-xl p-4">
              <h3 className="type-label text-slide-warning mb-3">Market Equilibrium</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="type-caption text-slide-warning/80 mb-0.5">Price</p>
                  <p className="type-h3 text-slide-gray-900">${metrics.price}</p>
                </div>
                <div>
                  <p className="type-caption text-slide-warning/80 mb-0.5">Quantity</p>
                  <p className="type-h3 text-slide-gray-900">{metrics.quantity}</p>
                </div>
              </div>
            </div>

            {/* Financial Metrics */}
            <div className="bg-white border border-slide-gray-200 rounded-xl p-4 flex-1">
              <h3 className="type-label text-slide-gray-700 mb-3">Financial Outcomes</h3>
              
              <div className="space-y-3">
                <MetricRow icon={DollarSign} label="Total Revenue" value={`$${metrics.revenue.toLocaleString()}`} color="text-slide-accent" />
                <MetricRow icon={Package} label="Total Cost" value={`$${metrics.totalCost.toLocaleString()}`} color="text-slide-gray-600" />
                <div className="border-t border-slide-gray-100 pt-3">
                  <MetricRow icon={TrendingUp} label="Profit" value={`$${metrics.profit.toLocaleString()}`} color={metrics.profit >= 0 ? "text-slide-success" : "text-slide-error"} highlight />
                </div>
                <MetricRow icon={Percent} label="Profit Margin" value={`${metrics.profitMargin}%`} color={metrics.profitMargin >= 0 ? "text-slide-success" : "text-slide-error"} />
              </div>
            </div>

            {/* Surplus */}
            <div className="bg-slide-gray-100 border border-slide-gray-200 rounded-xl p-4">
              <h3 className="type-label text-slide-gray-700 mb-3">Economic Surplus</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="type-caption text-slide-gray-600">Consumer</span>
                  <span className="type-caption font-semibold text-slide-accent">${metrics.consumerSurplus.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="type-caption text-slide-gray-600">Producer</span>
                  <span className="type-caption font-semibold text-slide-success">${metrics.producerSurplus.toLocaleString()}</span>
                </div>
                <div className="border-t border-slide-gray-200 pt-2 flex justify-between items-center">
                  <span className="type-caption font-medium text-slide-gray-700">Total Welfare</span>
                  <span className="type-body font-bold text-slide-gray-900">${(metrics.consumerSurplus + metrics.producerSurplus).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}

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
        <span className={`type-caption ${highlight ? 'font-medium text-slide-gray-800' : 'text-slide-gray-600'}`}>{label}</span>
      </div>
      <span className={`font-semibold ${color} ${highlight ? 'type-body' : 'type-caption'}`}>{value}</span>
    </div>
  );
}
