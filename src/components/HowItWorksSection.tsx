
import React from 'react';
import { UploadCloudIcon, SparklesIcon, ChartPieIcon } from '../constants';

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">From Chaos to Clarity in Minutes</h2>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-slate-400">
            Our process is designed to be incredibly simple and take minutes, not hours.
          </p>
        </div>

        <div className="relative">
          {/* Dotted line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-700/50">
            <div className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-slate-600"></div>
          </div>

          <div className="relative grid md:grid-cols-3 gap-12">
            
            {/* Step 1 */}
            <div className="relative text-center p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-sky-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl border-4 border-slate-900">1</div>
              <div className="mt-8">
                <UploadCloudIcon className="h-12 w-12 mx-auto text-sky-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Upload Anything</h3>
                <p className="text-slate-400">Securely upload financial documents in any format: PDFs from your bank, Excel/CSV files, text files, or even photos of receipts.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative text-center p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-sky-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl border-4 border-slate-900">2</div>
               <div className="mt-8">
                <SparklesIcon className="h-12 w-12 mx-auto text-sky-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">AI Does the Heavy Lifting</h3>
                <p className="text-slate-400">Our Gemini-powered AI reads and understands every transaction, automatically categorizing them and converting all currencies to your chosen base currency.</p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative text-center p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-sky-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl border-4 border-slate-900">3</div>
              <div className="mt-8">
                <ChartPieIcon className="h-12 w-12 mx-auto text-sky-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Get Your Interactive Dashboard</h3>
                <p className="text-slate-400">Instantly view your Total Income, Expenses, and Net Profit with rich charts and plain-English insights to guide your business decisions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
