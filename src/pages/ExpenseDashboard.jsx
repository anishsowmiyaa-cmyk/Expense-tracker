import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { formatINR } from '../utils/formatCurrency';
import { ArrowDownRight, ArrowUpRight, Receipt, TrendingDown, TrendingUp } from 'lucide-react';
import './Dashboard.css';

export const ExpenseDashboard = () => {
  const { transactions, getStats } = useStore();
  const { totalIncome, totalExpenses } = getStats();

  const expenseTransactions = useMemo(
    () => transactions.filter((transaction) => transaction.type === 'expense'),
    [transactions],
  );

  const incomeTransactions = useMemo(
    () => transactions.filter((transaction) => transaction.type === 'income'),
    [transactions],
  );

  const topExpenseCategories = useMemo(() => {
    const categoryTotals = expenseTransactions.reduce((totals, transaction) => {
      const currentTotal = totals[transaction.category] || 0;
      totals[transaction.category] = currentTotal + Number(transaction.amount);
      return totals;
    }, {});

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, [expenseTransactions]);

  const recentCashFlow = useMemo(
    () =>
      transactions
        .filter((transaction) => transaction.type === 'income' || transaction.type === 'expense')
        .slice(0, 6),
    [transactions],
  );

  const balance = totalIncome - totalExpenses;

  return (
    <div className="dashboard animate-fade-in">
      <header className="dashboard-header">
        <div className="dashboard-heading">
          <div>
            <p className="eyebrow">Cash Flow Dashboard</p>
            <h1 className="title dashboard-title">Expenses</h1>
          </div>
          <Link to="/analytics" className="btn btn-ghost dashboard-link-btn">
            View Charts
          </Link>
        </div>

        <div className="net-worth-card glass-card expense-card">
          <p className="label">Total Expenses</p>
          <h2 className="amount">{formatINR(totalExpenses)}</h2>
          <div className="stats-row">
            <div className="stat expense">
              <ArrowDownRight size={16} />
              <span>{expenseTransactions.length} entries</span>
            </div>
            <div className={`stat ${balance >= 0 ? 'income' : 'expense'}`}>
              {balance >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{formatINR(Math.abs(balance))} {balance >= 0 ? 'surplus' : 'gap'}</span>
            </div>
          </div>
        </div>
      </header>

      <section className="dashboard-grid">
        <div className="summary-panel glass-card">
          <div className="section-header">
            <h3>Cash Summary</h3>
          </div>
          <div className="summary-list">
            <div className="summary-item">
              <span className="summary-label">Income</span>
              <span className="summary-value text-income">+{formatINR(totalIncome)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Expenses</span>
              <span className="summary-value text-expense">-{formatINR(totalExpenses)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Net Cash Flow</span>
              <span className={`summary-value ${balance >= 0 ? 'text-income' : 'text-expense'}`}>
                {balance >= 0 ? '+' : '-'}{formatINR(Math.abs(balance))}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Income Entries</span>
              <span className="summary-value">{incomeTransactions.length}</span>
            </div>
          </div>
        </div>

        <div className="summary-panel glass-card">
          <div className="section-header">
            <h3>Top Expense Categories</h3>
          </div>
          {topExpenseCategories.length === 0 ? (
            <div className="empty-state compact-empty-state">
              <Receipt className="text-secondary mb-2" size={28} />
              <p className="text-secondary text-sm">Add some expenses to see category trends.</p>
            </div>
          ) : (
            <div className="summary-list">
              {topExpenseCategories.map((entry) => (
                <div key={entry.category} className="summary-item">
                  <span className="summary-label">{entry.category}</span>
                  <span className="summary-value text-expense">-{formatINR(entry.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="transactions-section">
        <div className="section-header">
          <h3>Recent Cash Flow</h3>
          <Link to="/stats" className="dashboard-inline-link">See all</Link>
        </div>

        {recentCashFlow.length === 0 ? (
          <div className="empty-state glass-card">
            <Receipt className="text-secondary mb-2" size={32} />
            <p className="text-secondary text-sm">No income or expense activity yet.</p>
          </div>
        ) : (
          <div className="transaction-list">
            {recentCashFlow.map((transaction) => (
              <div key={transaction.id} className="transaction-item glass-card animate-slide-up">
                <div className="t-info">
                  <div className={`t-icon bg-${transaction.type}-alpha`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="text-income" />
                    ) : (
                      <ArrowDownRight className="text-expense" />
                    )}
                  </div>
                  <div>
                    <h4 className="t-category">{transaction.category}</h4>
                    <p className="t-date">{transaction.date}</p>
                  </div>
                </div>
                <div className={`t-amount text-${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatINR(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
