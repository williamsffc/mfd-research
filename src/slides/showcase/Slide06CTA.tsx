import React from 'react';
import { SlideLayout } from '@/components/slides/SlideLayout';
import { ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';

const benefits = [
  { icon: Sparkles, text: 'AI-powered development' },
  { icon: Zap, text: 'Ship 10x faster' },
  { icon: Shield, text: 'Enterprise-ready security' },
];

export default function Slide06CTA() {
  return (
    <SlideLayout variant="default">
      <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-3xl opacity-20" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center px-20 text-center">
          {/* Badge */}
          <div className="mb-8 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-white/90 text-sm font-medium">
              ✨ Start building today
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-7xl font-bold text-white mb-6 leading-tight">
            Ready to build?
          </h1>
          
          <p className="text-2xl text-white/80 font-light max-w-2xl mb-12">
            Transform your ideas into production-ready applications with the power of AI
          </p>

          {/* Benefits */}
          <div className="flex items-center gap-8 mb-12">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 text-white/90">
                <benefit.icon className="w-5 h-5" />
                <span className="text-lg font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button className="group flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 rounded-full text-xl font-semibold shadow-2xl hover:shadow-white/25 transition-all hover:scale-105">
            Get Started Free
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Footer note */}
          <p className="mt-8 text-white/60 text-sm">
            No credit card required • Free tier available
          </p>
        </div>
      </div>
    </SlideLayout>
  );
}
