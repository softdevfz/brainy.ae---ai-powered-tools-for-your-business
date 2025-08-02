
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative py-20 md:py-32 bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-800/20 [mask-image:linear-gradient(to_bottom,white_0%,transparent_100%)]"></div>
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4">
          AI Assistants for the Hard Parts
          <br />
          <span className="gradient-text">of Your Business</span>
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-400 mb-8">
          From messy kitchens and chaotic paperwork to total control. Brainy.ae builds smart tools that automate your work, so you can get back to what you love.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
          <a href="#pricing" className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
            Start Your Free Month
          </a>
          <a href="#products" className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
            View Products
          </a>
        </div>
        <div className="text-center">
          <p className="text-lg text-slate-300 mb-2">Try it now! Call or WhatsApp:</p>
          <a href="tel:+12314272469" className="text-2xl md:text-3xl font-bold text-sky-400 hover:text-sky-300 transition-colors duration-300">
            (231) 427-2469
          </a>
          <p className="text-sm text-slate-400 mt-1">+1-231-4BRAINY</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;