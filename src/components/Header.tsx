import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-900/70 backdrop-blur-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-white">
            <a href="#">brainy<span className="text-sky-400">.ae</span></a>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#products" className="text-slate-300 hover:text-sky-400 transition-colors duration-300">Products</a>
            <a href="#pricing" className="text-slate-300 hover:text-sky-400 transition-colors duration-300">Pricing</a>
            <a href="mailto:sales@brainy.ae" className="text-slate-300 hover:text-sky-400 transition-colors duration-300">Contact</a>
          </div>
          <div className="hidden md:block">
            <a href="#pricing" className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
              Start Free Trial
            </a>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-200 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden mt-4">
            <a href="#products" onClick={() => setIsOpen(false)} className="block py-2 px-4 text-sm text-slate-300 hover:bg-slate-800 rounded">Products</a>
            <a href="#pricing" onClick={() => setIsOpen(false)} className="block py-2 px-4 text-sm text-slate-300 hover:bg-slate-800 rounded">Pricing</a>
             <a href="mailto:sales@brainy.ae" onClick={() => setIsOpen(false)} className="block py-2 px-4 text-sm text-slate-300 hover:bg-slate-800 rounded">Contact</a>
            <a href="#pricing" onClick={() => setIsOpen(false)} className="mt-2 block w-full text-center bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md">
              Start Free Trial
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;