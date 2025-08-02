
import React from 'react';

const PaperIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const SpreadsheetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2z" />
    </svg>
);

const QuestionMarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const ProblemSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Stop Drowning in Financial Paperwork</h2>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-slate-400">For most businesses, financial data is a chaotic mess. This leads to wasted hours, costly mistakes, and missed growth opportunities.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
            <PaperIcon />
            <h3 className="text-xl font-bold text-white mb-2">Piles of Documents</h3>
            <p className="text-slate-400">Your income and expenses are scattered across PDF bank statements, photo receipts, and various digital invoices with no connection.</p>
          </div>
          <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
            <SpreadsheetIcon />
            <h3 className="text-xl font-bold text-white mb-2">Complex Spreadsheets</h3>
            <p className="text-slate-400">Hours are spent on manual data entry into fragile spreadsheets. It's tedious, error-prone, and provides zero real-time insights.</p>
          </div>
          <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
            <QuestionMarkIcon />
            <h3 className="text-xl font-bold text-white mb-2">No Clear Picture</h3>
            <p className="text-slate-400">Are you actually profitable? Where can you cut costs? Without a clear, up-to-date view, you're just guessing.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;