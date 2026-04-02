import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';


export const Layout = () => {
  return (
    <div className="app-container" style={{ paddingBottom: '110px', paddingTop: 'env(safe-area-inset-top)' }}>
      <main className="container animate-fade-in">
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
};
