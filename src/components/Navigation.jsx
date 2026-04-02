import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, Settings, PieChart, TrendingUp, Wallet } from 'lucide-react';
import './Navigation.css';

export const Navigation = () => {
  return (
    <nav className="bottom-nav glass-card">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Home size={22} />
        <span>Worth</span>
      </NavLink>
      <NavLink to="/expenses" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Wallet size={22} />
        <span>Spend</span>
      </NavLink>
      <NavLink to="/add" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <div className="fab">
          <PlusCircle size={32} />
        </div>
      </NavLink>
      <NavLink to="/stats" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <PieChart size={22} />
        <span>List</span>
      </NavLink>
      <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <TrendingUp size={22} />
        <span>Charts</span>
      </NavLink>
      <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Settings size={22} />
        <span>Settings</span>
      </NavLink>
    </nav>
  );
};
