import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { LogIn } from 'lucide-react';
import './Login.css';

export const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    try {
      setLoading(true);
      setError(null);
      
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Ensure the user document exists in Firestore
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        await setDoc(userDocRef, {
            email: userCredential.user.email,
            name: userCredential.user.email.split('@')[0],
            createdAt: new Date()
        });
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Failed to ' + (isSignUp ? 'sign up' : 'sign in') + ': ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-card animate-slide-up">
        <div className="brand-logo bg-brand-alpha">
          <LogIn size={40} className="text-brand" />
        </div>
        <h1 className="login-title">Net Worth Tracker</h1>
        <p className="login-subtitle">Securely sync your finances across all your devices.</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="email" 
            className="input-base" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            className="input-base" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />
          <button 
            type="submit"
            className="btn btn-primary login-btn" 
            style={{ marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : (isSignUp ? 'Create Account' : 'Sign in')}
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button 
            type="button" 
            style={{ padding: '0', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent-brand)', fontSize: '0.875rem', fontWeight: '500' }}
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Log in' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
};
