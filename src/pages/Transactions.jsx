import { useStore } from '../store/useStore';
import { formatINR } from '../utils/formatCurrency';
import { ArrowUpRight, ArrowDownRight, Trash2, Edit2, Landmark, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Transactions.css';

export const Transactions = () => {
  const { transactions, deleteTransaction } = useStore();
  const navigate = useNavigate();

  return (
    <div className="transactions-page animate-fade-in">
      <header className="page-header">
        <h1 className="title">All Activities</h1>
      </header>

      {transactions.length === 0 ? (
        <div className="empty-state glass-card">
          <p className="text-secondary text-sm">No transactions found.</p>
        </div>
      ) : (
        <div className="full-transaction-list">
          {transactions.map(t => (
            <div key={t.id} className="transaction-card glass-card animate-slide-up">
              <div className="t-card-header">
                <div className="t-info">
                  <div className={`t-icon bg-${t.type}-alpha`}>
                    {t.type === 'income' && <ArrowUpRight className="text-income" />}
                    {t.type === 'expense' && <ArrowDownRight className="text-expense" />}
                    {t.type === 'asset' && <Landmark className="text-asset" />}
                    {t.type === 'liability' && <CreditCard className="text-liability" />}
                  </div>
                  <div>
                    <h3 className="t-category">{t.category}</h3>
                    <p className="t-date">{t.date}</p>
                  </div>
                </div>
                <div className={`t-amount-large text-${t.type}`}>
                  {t.type === 'income' || t.type === 'asset' ? '+' : '-'}{formatINR(t.amount)}
                </div>
              </div>
              
              {t.note && <p className="t-note">{t.note}</p>}
              
              <div className="t-actions">
                <button 
                  className="btn btn-ghost action-btn"
                  onClick={() => navigate(`/edit/${t.id}`)}
                >
                  <Edit2 size={16} /> Edit
                </button>
                <button 
                  className="btn btn-ghost action-btn text-expense"
                  onClick={() => deleteTransaction(t.id)}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
