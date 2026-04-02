import { useStore } from '../store/useStore';
import { formatINR } from '../utils/formatCurrency';
import { ArrowUpRight, ArrowDownRight, Activity, Landmark, CreditCard } from 'lucide-react';
import './Dashboard.css';

export const Dashboard = () => {
  const { transactions, getNetWorth, getStats } = useStore();
  const netWorth = getNetWorth();
  const { totalIncome, totalExpenses } = getStats();

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="dashboard animate-fade-in">
      <header className="dashboard-header">
        <h1 className="title">Overview</h1>
        <div className="net-worth-card glass-card">
          <p className="label">Total Net Worth</p>
          <h2 className="amount">{formatINR(netWorth)}</h2>
          <div className="stats-row">
            <div className="stat income">
              <ArrowUpRight size={16} />
              <span>{formatINR(totalIncome)}</span>
            </div>
            <div className="stat expense">
              <ArrowDownRight size={16} />
              <span>{formatINR(totalExpenses)}</span>
            </div>
          </div>
        </div>
      </header>

      <section className="transactions-section">
        <div className="section-header">
          <h3>Recent Activity</h3>
        </div>
        
        {recentTransactions.length === 0 ? (
          <div className="empty-state glass-card">
            <Activity className="text-secondary mb-2" size={32} />
            <p className="text-secondary text-sm">No transactions yet.</p>
          </div>
        ) : (
          <div className="transaction-list">
            {recentTransactions.map(t => (
              <div key={t.id} className="transaction-item glass-card animate-slide-up">
                <div className="t-info">
                  <div className={`t-icon bg-${t.type}-alpha`}>
                    {t.type === 'income' && <ArrowUpRight className="text-income" />}
                    {t.type === 'expense' && <ArrowDownRight className="text-expense" />}
                    {t.type === 'asset' && <Landmark className="text-asset" />}
                    {t.type === 'liability' && <CreditCard className="text-liability" />}
                  </div>
                  <div>
                    <h4 className="t-category">{t.category}</h4>
                    <p className="t-date">{t.date}</p>
                  </div>
                </div>
                <div className={`t-amount text-${t.type}`}>
                  {t.type === 'income' || t.type === 'asset' ? '+' : '-'}{formatINR(t.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
