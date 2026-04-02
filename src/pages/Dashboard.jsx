import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { formatINR } from '../utils/formatCurrency';
import { ArrowUpRight, ArrowDownRight, Activity, Landmark, CreditCard, LogOut, Wallet } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './Dashboard.css';

export const Dashboard = () => {
  const { transactions, assets, liabilities, getNetWorth, getStats } = useStore();
  const netWorth = getNetWorth();
  const { totalIncome, totalExpenses } = getStats();
  const totalAssets = assets.reduce((sum, item) => sum + Number(item.value), 0);
  const totalLiabilities = liabilities.reduce((sum, item) => sum + Number(item.value), 0);

  const recentWorthActivity = useMemo(() => {
    const assetEntries = assets.map((asset) => ({
      id: asset.id,
      type: 'asset',
      category: asset.name || asset.category,
      amount: asset.value,
      date: asset.date || '',
    }));

    const liabilityEntries = liabilities.map((liability) => ({
      id: liability.id,
      type: 'liability',
      category: liability.name || liability.category,
      amount: liability.value,
      date: liability.date || '',
    }));

    const legacyTransactions = transactions.filter(
      (transaction) => transaction.type === 'asset' || transaction.type === 'liability',
    );

    return [...assetEntries, ...liabilityEntries, ...legacyTransactions]
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 5);
  }, [assets, liabilities, transactions]);

  return (
    <div className="dashboard animate-fade-in">
      <header className="dashboard-header">
        <div className="dashboard-heading">
          <div>
            <p className="eyebrow">Balance Sheet Dashboard</p>
            <h1 className="title dashboard-title">Net Worth</h1>
          </div>
          <div className="dashboard-actions">
            <Link to="/expenses" className="btn btn-ghost dashboard-link-btn">
              <Wallet size={18} />
              <span>Expense View</span>
            </Link>
            <button
              className="btn btn-ghost text-expense dashboard-link-btn"
              onClick={() => signOut(auth)}
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
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

      <section className="dashboard-grid">
        <div className="summary-panel glass-card">
          <div className="section-header">
            <h3>Balance Sheet</h3>
          </div>
          <div className="summary-list">
            <div className="summary-item">
              <span className="summary-label">Tracked Assets</span>
              <span className="summary-value text-asset">+{formatINR(totalAssets)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Tracked Liabilities</span>
              <span className="summary-value text-liability">-{formatINR(totalLiabilities)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Income Recorded</span>
              <span className="summary-value text-income">+{formatINR(totalIncome)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Expenses Recorded</span>
              <span className="summary-value text-expense">-{formatINR(totalExpenses)}</span>
            </div>
          </div>
        </div>

        <div className="summary-panel glass-card">
          <div className="section-header">
            <h3>Position Snapshot</h3>
          </div>
          <div className="summary-list">
            <div className="summary-item">
              <span className="summary-label">Asset Entries</span>
              <span className="summary-value">{assets.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Liability Entries</span>
              <span className="summary-value">{liabilities.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Wealth Activities</span>
              <span className="summary-value">{recentWorthActivity.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Overall Position</span>
              <span className={`summary-value ${netWorth >= 0 ? 'text-income' : 'text-expense'}`}>
                {netWorth >= 0 ? 'Positive' : 'Negative'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="transactions-section">
        <div className="section-header">
          <h3>Recent Net Worth Activity</h3>
          <Link to="/settings" className="dashboard-inline-link">Manage assets</Link>
        </div>
        
        {recentWorthActivity.length === 0 ? (
          <div className="empty-state glass-card">
            <Activity className="text-secondary mb-2" size={32} />
            <p className="text-secondary text-sm">No asset or liability activity yet.</p>
          </div>
        ) : (
          <div className="transaction-list">
            {recentWorthActivity.map(t => (
              <div key={t.id} className="transaction-item glass-card animate-slide-up">
                <div className="t-info">
                  <div className={`t-icon bg-${t.type}-alpha`}>
                    {t.type === 'asset' && <Landmark className="text-asset" />}
                    {t.type === 'liability' && <CreditCard className="text-liability" />}
                  </div>
                  <div>
                    <h4 className="t-category">{t.category}</h4>
                    <p className="t-date">{t.date}</p>
                  </div>
                </div>
                <div className={`t-amount text-${t.type}`}>
                  {t.type === 'asset' ? '+' : '-'}{formatINR(t.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
