import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Trash2, PlusCircle, LogOut } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { formatINR } from '../utils/formatCurrency';
import './Settings.css';

export const Settings = () => {
  const { assets, liabilities, addAsset, deleteAsset, addLiability, deleteLiability } = useStore();
  
  const [assetName, setAssetName] = useState('');
  const [assetValue, setAssetValue] = useState('');
  
  const [liabilityName, setLiabilityName] = useState('');
  const [liabilityValue, setLiabilityValue] = useState('');

  const handleAddAsset = (e) => {
    e.preventDefault();
    if (!assetName || !assetValue) return;
    addAsset({ name: assetName, value: parseFloat(assetValue) });
    setAssetName('');
    setAssetValue('');
  };

  const handleAddLiability = (e) => {
    e.preventDefault();
    if (!liabilityName || !liabilityValue) return;
    addLiability({ name: liabilityName, value: parseFloat(liabilityValue) });
    setLiabilityName('');
    setLiabilityValue('');
  };

  return (
    <div className="settings-page animate-fade-in">
      <header className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 className="title" style={{ margin: 0 }}>Settings</h1>
        <button 
          className="btn btn-ghost text-expense"
          style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={() => {
             signOut(auth);
          }}
        >
          <LogOut size={20} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Sign Out</span>
        </button>
      </header>

      <div className="config-section">
        <div className="section-header">
          <h3>Assets</h3>
          <p className="text-secondary text-sm">Add fixed assets like bank balance, investments, property.</p>
        </div>
        
        <form onSubmit={handleAddAsset} className="add-inline-form mb-4">
          <input 
            type="text" 
            className="input-base" 
            placeholder="Asset Name (e.g. HDFC Bank)" 
            value={assetName}
            onChange={e => setAssetName(e.target.value)}
          />
          <input 
            type="number" 
            className="input-base" 
            placeholder="Value (₹)" 
            value={assetValue}
            onChange={e => setAssetValue(e.target.value)}
            step="0.01"
            min="0"
          />
          <button type="submit" className="btn btn-primary btn-sm">
            <PlusCircle size={20} />
          </button>
        </form>

        <div className="items-list">
          {assets.map(a => (
            <div key={a.id} className="config-item glass-card animate-slide-up">
              <div>
                <h4 className="config-name">{a.name}</h4>
                <p className="config-val text-income">+{formatINR(a.value)}</p>
              </div>
              <button 
                className="btn btn-ghost text-expense btn-icon"
                onClick={() => deleteAsset(a.id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {assets.length === 0 && <p className="text-secondary text-sm">No assets added.</p>}
        </div>
      </div>

      <div className="config-section mt-6">
        <div className="section-header">
          <h3>Liabilities</h3>
          <p className="text-secondary text-sm">Add debts like loans, credit card balances.</p>
        </div>
        
        <form onSubmit={handleAddLiability} className="add-inline-form mb-4">
          <input 
            type="text" 
            className="input-base" 
            placeholder="Liability Name (e.g. Car Loan)" 
            value={liabilityName}
            onChange={e => setLiabilityName(e.target.value)}
          />
          <input 
            type="number" 
            className="input-base" 
            placeholder="Amount (₹)" 
            value={liabilityValue}
            onChange={e => setLiabilityValue(e.target.value)}
            step="0.01"
            min="0"
          />
          <button type="submit" className="btn btn-primary btn-sm btn-danger">
            <PlusCircle size={20} />
          </button>
        </form>

        <div className="items-list">
          {liabilities.map(l => (
            <div key={l.id} className="config-item glass-card animate-slide-up">
              <div>
                <h4 className="config-name">{l.name}</h4>
                <p className="config-val text-expense">-{formatINR(l.value)}</p>
              </div>
              <button 
                className="btn btn-ghost text-expense btn-icon"
                onClick={() => deleteLiability(l.id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {liabilities.length === 0 && <p className="text-secondary text-sm">No liabilities added.</p>}
        </div>
      </div>
      
    </div>
  );
};
