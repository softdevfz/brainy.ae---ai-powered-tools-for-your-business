import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-white">brainy<span className="text-sky-400">.ae</span></h3>
            <p className="text-slate-500 text-sm mt-1">A product by Soft Dev FZ LLC, Dubai, UAE</p>
          </div>
          <div className="flex space-x-6 text-slate-400">
            <a href="#products" className="hover:text-sky-400 transition-colors">Products</a>
            <a href="#pricing" className="hover:text-sky-400 transition-colors">Pricing</a>
            <a href="mailto:sales@brainy.ae" className="hover:text-sky-400 transition-colors">Contact</a>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Soft Dev FZ LLC. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;