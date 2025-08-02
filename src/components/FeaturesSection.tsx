import React from 'react';
import type { Feature } from '../types';

interface FeatureCardProps extends Feature {}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 transition-all duration-300 hover:border-sky-500 hover:bg-slate-800/70 transform hover:-translate-y-1 h-full">
    <div className="flex items-start mb-4">
      <div className="bg-slate-700 p-3 rounded-lg mr-4 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-slate-400 mt-2">
          {description}
        </p>
      </div>
    </div>
  </div>
);

interface FeaturesSectionProps {
    id: string;
    title: string;
    subtitle: string;
    features: Feature[];
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ id, title, subtitle, features }) => {
  return (
    <section id={id} className="py-20 bg-slate-900/70 backdrop-blur-lg border-t border-b border-slate-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Features of <span className="gradient-text">{title}</span>
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-slate-400">
            {subtitle}
          </p>
        </div>
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;