import React from 'react';
import { PRODUCTS } from '../constants';
import { ChatIcon, ChartPieIcon } from '../constants';

const icons = {
    pos: <ChatIcon className="h-10 w-10 mb-4 text-sky-400" />,
    stooge: <ChartPieIcon className="h-10 w-10 mb-4 text-sky-400" />
};

const ProductsSection: React.FC = () => {
  return (
    <section id="products" className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Two Powerful AI Tools for Your Business</h2>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-slate-400">From point-of-sale to profit-and-loss, our AI assistants are designed to automate your work and give you back your time.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {PRODUCTS.map(product => (
            <div key={product.id} className="bg-slate-800 p-8 rounded-xl border border-slate-700 flex flex-col transition-all duration-300 hover:border-sky-500 hover:bg-slate-800/70 transform hover:-translate-y-1">
              {product.id === 'pos' ? icons.pos : icons.stooge}
              <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
              <p className="font-semibold text-sky-400 mb-4">{product.tagline}</p>
              <p className="text-slate-400 mb-6 flex-grow">{product.description}</p>
              <a href={`#${product.id}-features`} className="mt-auto text-center bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300">
                Learn More
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
