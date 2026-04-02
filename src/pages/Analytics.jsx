import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, CartesianGrid } from 'recharts';
import { formatINR } from '../utils/formatCurrency';
import './Analytics.css';

export const Analytics = () => {
  const { transactions } = useStore();

  const chartData = useMemo(() => {
    // Group transactions by Date
    const grouped = {};
    
    // We only want to plot actual income and expenses for the progression chart
    const filtered = transactions.filter(t => t.type === 'income' || t.type === 'expense');

    filtered.forEach(t => {
      if (!grouped[t.date]) {
        grouped[t.date] = { date: t.date, Income: 0, Expense: 0 };
      }
      if (t.type === 'income') {
        grouped[t.date].Income += t.amount;
      } else {
        grouped[t.date].Expense += t.amount;
      }
    });

    // Convert object to array and sort chronologically
    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip glass-card">
          <p className="tooltip-date">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, fontWeight: 'bold' }}>
              {entry.name}: {formatINR(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="analytics-page animate-fade-in">
      <header className="page-header">
        <h1 className="title">Analytics</h1>
      </header>

      {chartData.length === 0 ? (
        <div className="empty-state glass-card">
          <p className="text-secondary text-sm">Not enough data to display charts.</p>
        </div>
      ) : (
        <>
          <section className="chart-section mb-6">
            <h3 className="chart-title">Cash Flow Progression</h3>
            <p className="text-secondary text-sm mb-4">Daily comparison of your Income vs Expenses.</p>
            <div className="chart-container glass-card">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-income)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--accent-income)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-expense)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--accent-expense)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} width={50} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} iconType="circle"/>
                  <Area type="monotone" dataKey="Income" stroke="var(--accent-income)" fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="Expense" stroke="var(--accent-expense)" fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="chart-section mt-6">
            <h3 className="chart-title">Daily Summary Bar Chart</h3>
            <div className="chart-container glass-card mt-2">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} width={50} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                  <Bar dataKey="Income" fill="var(--accent-income)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Expense" fill="var(--accent-expense)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </>
      )}
    </div>
  );
};
