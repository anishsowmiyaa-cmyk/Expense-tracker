import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ArrowLeft, Save } from 'lucide-react';
import './AddTransaction.css'; // Reusing CSS from AddTransaction

const getCategoriesByType = (type) => (
  type === 'expense' ? ['Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Others'] :
  type === 'income' ? ['Salary', 'Freelance', 'Investments', 'Gift', 'Others'] :
  type === 'asset' ? ['Home', 'Land', 'Gold', 'Vehicle', 'Stocks', 'Bank Balance', 'Others'] :
  ['Home Loan', 'Car Loan', 'Personal Loan', 'Credit Card', 'Others']
);

export const EditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { transactions, deleteTransaction, addTransaction } = useStore();
  
  const existingTransaction = transactions.find(t => t.id === id);
  
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  useEffect(() => {
    if (existingTransaction) {
      const defaultCategories = getCategoriesByType(existingTransaction.type);
      const isPresetCategory = defaultCategories.includes(existingTransaction.category);

      setType(existingTransaction.type);
      setAmount(existingTransaction.amount);
      setCategory(isPresetCategory ? existingTransaction.category : '');
      setDate(existingTransaction.date);
      setNote(existingTransaction.note || '');
      setUseCustomCategory(!isPresetCategory);
      setCustomCategory(isPresetCategory ? '' : existingTransaction.category);
    } else {
      navigate('/stats');
    }
  }, [existingTransaction, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalCategory = useCustomCategory ? customCategory.trim() : category;
    if (!amount || !finalCategory) return;
    
    // Simplest edit: delete old, add new but keep the same ID implicitly or generate new.
    // Actually, delete the old one and add a new one is fine, but it changes the order.
    // Wait, Zustand doesn't have an `updateTransaction` in my store yet.
    // I can just call delete and add (with a new ID, but order will change).
    // Let's add updateTransaction to the store later.
    // For now:
    deleteTransaction(id);
    addTransaction({
      type,
      amount: parseFloat(amount),
      category: finalCategory,
      date,
      note
    });
    
    navigate(-1);
  };

  if (!existingTransaction) return null;

  const categories = getCategoriesByType(type);

  const handleTypeChange = (nextType) => {
    setType(nextType);
    setCategory('');
    setUseCustomCategory(false);
    setCustomCategory('');
  };

  return (
    <div className="add-transaction animate-slide-up">
      <header className="page-header">
        <button className="btn btn-ghost icon-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="title">Edit Activity</h1>
        <div style={{ width: 24 }}></div>
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
          <label className="form-label">Note</label>
          <input 
            type="text" 
            className="input-base" 
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="form-actions mt-6">
          <button type="button" className="btn btn-ghost secondary-action-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary submit-btn">
            <Save size={20} />
            <span>Update Activity</span>
          </button>
        </div>
      </form>
    </div>
  );
};
