import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { LogIn } from 'lucide-react';
import './Login.css';

export const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Ensure the user document exists in Firestore
      const userDocRef = doc(db, 'users', result.user.uid);
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
         await setDoc(userDocRef, {
             email: result.user.email,
             name: result.user.displayName,
             createdAt: new Date()
         });
      }
      
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Failed to sign in: ' + err.message);
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

        <button 
          className="btn btn-primary login-btn" 
          onClick={handleGoogleLogin} 
          disabled={loading}
        >
          {loading ? 'Authenticating...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
};
