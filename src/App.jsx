import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useStore } from './store/useStore';

import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { AddTransaction } from './pages/AddTransaction';
import { Transactions } from './pages/Transactions';
import { Analytics } from './pages/Analytics';
import { EditTransaction } from './pages/EditTransaction';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';

const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        useStore.getState().initFirebaseSync();
      } else {
        useStore.getState().cleanup();
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        
        <Route path="/" element={
          <ProtectedRoute user={user}>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="stats" element={<Transactions />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        <Route path="/add" element={
          <ProtectedRoute user={user}>
            <AddTransaction />
          </ProtectedRoute>
        } />
        
        <Route path="/edit/:id" element={
          <ProtectedRoute user={user}>
            <EditTransaction />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
