import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ArrowLeft, Save } from 'lucide-react';
import './AddTransaction.css';

const getCategoriesByType = (type) => (
  type === 'expense' ? ['Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Others'] :
  type === 'income' ? ['Salary', 'Freelance', 'Investments', 'Gift', 'Others'] :
  type === 'asset' ? ['Home', 'Land', 'Gold', 'Vehicle', 'Stocks', 'Bank Balance', 'Others'] :
  ['Home Loan', 'Car Loan', 'Personal Loan', 'Credit Card', 'Others']
);

export const AddTransaction = () => {
  const navigate = useNavigate();
  const { addTransaction, addAsset, addLiability } = useStore();
  
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalCategory = useCustomCategory ? customCategory.trim() : category;
    if (!amount || !finalCategory || isSubmitting) return;

    const parsedAmount = parseFloat(amount);
    setIsSubmitting(true);

    try {
      if (type === 'asset') {
        addAsset({
          name: finalCategory,
          value: parsedAmount,
          date,
          note
        });
      } else if (type === 'liability') {
        addLiability({
          name: finalCategory,
          value: parsedAmount,
          date,
          note
        });
      } else {
        addTransaction({
          type,
          amount: parsedAmount,
          category: finalCategory,
          date,
          note
        });
      }

      navigate('/', { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = getCategoriesByType(type);

  const handleTypeChange = (nextType) => {
    setType(nextType);
    setCategory('');
    setUseCustomCategory(false);
    setCustomCategory('');
  };

  const saveLabel =
    type === 'asset' ? 'Save Asset' :
    type === 'liability' ? 'Save Debt' :
    type === 'income' ? 'Save Income' :
    'Save Expense';

  return (
    <div className="add-transaction animate-slide-up">
      <header className="page-header">
        <button className="btn btn-ghost icon-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="title">Add Activity</h1>
        <div style={{ width: 24 }}></div> {/* Spacer */}
      </header>

      <div className="type-toggle glass-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        <button 
          type="button"
          className={`toggle-btn ${type === 'expense' ? 'active-expense' : ''}`}
          onClick={() => handleTypeChange('expense')}
        >
          Expense
        </button>
        <button 
          type="button"
          className={`toggle-btn ${type === 'income' ? 'active-income' : ''}`}
          onClick={() => handleTypeChange('income')}
        >
          Income
        </button>
        <button 
          type="button"
          className={`toggle-btn ${type === 'asset' ? 'active-asset' : ''}`}
          onClick={() => handleTypeChange('asset')}
        >
          Add Asset
        </button>
        <button 
          type="button"
          className={`toggle-btn ${type === 'liability' ? 'active-liability' : ''}`}
          onClick={() => handleTypeChange('liability')}
        >
          Add Debt
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form-card glass-card mt-4">
        <div className="form-group amount-group">
          <label className="form-label">Amount (₹)</label>
          <div className="amount-input-wrapper">
            <span className="currency-symbol">₹</span>
            <input 
              type="number" 
              className="input-base large-input" 
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          {!useCustomCategory ? (
            <>
              <select 
                className="input-base" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                required={!useCustomCategory}
              >
                <option value="" disabled>Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-ghost inline-text-btn"
                onClick={() => {
                  setUseCustomCategory(true);
                  setCategory('');
                }}
              >
                Add category manually
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                className="input-base"
                placeholder="Enter custom category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-ghost inline-text-btn"
                onClick={() => {
                  setUseCustomCategory(false);
                  setCustomCategory('');
                }}
              >
                Choose from list instead
              </button>
            </>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Date</label>
          <input 
            type="date" 
            className="input-base" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Note (Optional)</label>
          <input 
            type="text" 
            className="input-base" 
            placeholder="What was this for?" 
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="form-actions mt-6">
          <button type="button" className="btn btn-ghost secondary-action-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary submit-btn" disabled={isSubmitting}>
            <Save size={20} />
            <span>{isSubmitting ? 'Saving...' : saveLabel}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
