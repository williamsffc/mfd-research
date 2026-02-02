import React from 'react';
import { SlideLayout } from '@/components/slides/SlideLayout';
import { ArrowRight } from 'lucide-react';

export default function Slide06CTA() {
  return (
    <SlideLayout variant="default">
      <div className="flex flex-col justify-center items-center h-full px-20 py-16 text-center">
        {/* Main heading */}
        <h1 className="type-display text-slide-gray-900 mb-6">
          Ready to build?
        </h1>
        
        <p className="type-body-lg text-slide-gray-500 max-w-2xl mb-12">
          Use this template to get started
        </p>

        {/* CTA Button */}
        <button className="group flex items-center gap-3 px-8 py-4 bg-slide-accent text-white rounded-full type-body font-semibold shadow-lg hover:opacity-90 transition-all hover:shadow-xl">
          Get Started
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </SlideLayout>
  );
}
