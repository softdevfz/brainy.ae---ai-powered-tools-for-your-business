import React from 'react';
import type { TechPillar } from '../types';
import { TECH_PILLARS } from '../constants';

const TechPillarCard: React.FC<TechPillar> = ({ icon, title, description }) => (
  <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
    <div className="flex items-center text-violet-400 mb-3">
      {icon}
      <h3 className="ml-3 text-lg font-bold text-white">{title}</h3>
    </div>
    <p className="text-slate-400 text-sm">
      {description}
    </p>
  </div>
);

const TechReadySection: React.FC = () => {
  return (
    <section id="ready" className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Enterprise-Grade Security & Privacy</h2>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-slate-400">Your business and financial data is sensitive. We've built our platform on Google's secure infrastructure to ensure it stays that way: safe, private, and always available to you.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TECH_PILLARS.map((pillar) => (
            <TechPillarCard key={pillar.title} {...pillar} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechReadySection;