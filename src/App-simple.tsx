import React from 'react';

const App: React.FC = () => {
  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center">
        🚀 Brainy.ae - AI-Powered Tools for Your Business
      </h1>
      <p className="text-xl text-center mt-4">
        Welcome to the future of AI-powered business solutions!
      </p>
      <div className="text-center mt-8">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default App; 