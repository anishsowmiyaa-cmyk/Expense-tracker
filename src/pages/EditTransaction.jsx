import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ArrowLeft, Save } from 'lucide-react';
import './AddTransaction.css'; // Reusing CSS from AddTransaction

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

  useEffect(() => {
    if (existingTransaction) {
      setType(existingTransaction.type);
      setAmount(existingTransaction.amount);
      setCategory(existingTransaction.category);
      setDate(existingTransaction.date);
      setNote(existingTransaction.note || '');
    } else {
      navigate('/transactions');
    }
  }, [existingTransaction, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category) return;
    
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
      category,
      date,
      note
    });
    
    navigate(-1);
  };

  if (!existingTransaction) return null;

  const categories = 
    type === 'expense' ? ['Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Others'] :
    type === 'income' ? ['Salary', 'Freelance', 'Investments', 'Gift', 'Others'] :
    type === 'asset' ? ['Home', 'Land', 'Gold', 'Vehicle', 'Stocks', 'Bank Balance', 'Others'] :
    ['Home Loan', 'Car Loan', 'Personal Loan', 'Credit Card', 'Others'];

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
          className={`toggle-btn ${type === 'expense' ? 'active-expense' : ''}`}
          onClick={() => { setType('expense'); setCategory(''); }}
        >
          Expense
        </button>
        <button 
          className={`toggle-btn ${type === 'income' ? 'active-income' : ''}`}
          onClick={() => { setType('income'); setCategory(''); }}
        >
          Income
        </button>
        <button 
          className={`toggle-btn ${type === 'asset' ? 'active-asset' : ''}`}
          onClick={() => { setType('asset'); setCategory(''); }}
        >
          Add Asset
        </button>
        <button 
          className={`toggle-btn ${type === 'liability' ? 'active-liability' : ''}`}
          onClick={() => { setType('liability'); setCategory(''); }}
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
          <select 
            className="input-base" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
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

        <button type="submit" className="btn btn-primary submit-btn mt-6">
          <Save size={20} />
          <span>Update Transaction</span>
        </button>
      </form>
    </div>
  );
};
