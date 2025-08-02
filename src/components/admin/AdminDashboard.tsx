import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { Product } from '../../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { products, pricingPlans, updateProduct, updatePricing, resetToDefaults } = useAdmin();
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin');
  };

  const handlePriceUpdate = (productId: string, newPrice: number) => {
    updatePricing(productId, { price: newPrice });
    setEditingPrice(null);
  };

  const handleProductUpdate = (productId: string, updates: Partial<Product>) => {
    updateProduct(productId, updates);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <div className="flex gap-4">
              <a href="/" className="text-slate-300 hover:text-white">View Site</a>
              <button
                onClick={handleLogout}
                className="text-slate-300 hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Pricing Management</h2>
            <button
              onClick={resetToDefaults}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Reset to Defaults
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map(plan => (
              <div key={plan.productId} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-2">{plan.productName}</h3>
                <div className="mb-4">
                  {editingPrice === plan.productId ? (
                    <div className="flex items-center gap-2">
                      <span className="text-white">$</span>
                      <input
                        type="number"
                        defaultValue={plan.price}
                        className="w-20 px-2 py-1 bg-slate-700 text-white rounded"
                        onBlur={(e) => handlePriceUpdate(plan.productId, Number(e.target.value))}
                        autoFocus
                      />
                      <span className="text-slate-400">/ month</span>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer hover:text-sky-400"
                      onClick={() => setEditingPrice(plan.productId)}
                    >
                      <span className="text-2xl font-bold text-white">${plan.price}</span>
                      <span className="text-slate-400">/ month</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-slate-400">{plan.trial_days}-day free trial</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Product Management</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                {editingProduct === product.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      defaultValue={product.name}
                      className="w-full px-3 py-2 bg-slate-700 text-white rounded"
                      placeholder="Product Name"
                      onBlur={(e) => handleProductUpdate(product.id, { name: e.target.value })}
                    />
                    <input
                      type="text"
                      defaultValue={product.tagline}
                      className="w-full px-3 py-2 bg-slate-700 text-white rounded"
                      placeholder="Tagline"
                      onBlur={(e) => handleProductUpdate(product.id, { tagline: e.target.value })}
                    />
                    <textarea
                      defaultValue={product.description}
                      className="w-full px-3 py-2 bg-slate-700 text-white rounded h-24"
                      placeholder="Description"
                      onBlur={(e) => handleProductUpdate(product.id, { description: e.target.value })}
                    />
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Done Editing
                    </button>
                  </div>
                ) : (
                  <div
                    className="cursor-pointer hover:border-sky-500 transition-colors"
                    onClick={() => setEditingProduct(product.id)}
                  >
                    <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                    <p className="text-sky-400 mb-2">{product.tagline}</p>
                    <p className="text-slate-400 text-sm">{product.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg">
              Export Customer Data
            </button>
            <button className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg">
              View Analytics
            </button>
            <button className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg">
              Manage Features
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;