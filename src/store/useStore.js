import { create } from 'zustand';
import { db, auth } from '../firebase';
import { doc, onSnapshot, setDoc, arrayUnion } from 'firebase/firestore';

export const useStore = create((set, get) => ({
  transactions: [],
  assets: [],
  liabilities: [],
  isLoaded: false,
  unsubscribe: null,

  // Setup Firestore listener
  initFirebaseSync: () => {
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);
    const unsub = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        set({
          transactions: data.transactions || [],
          assets: data.assets || [],
          liabilities: data.liabilities || [],
          isLoaded: true
        });
      } else {
        set({ isLoaded: true, transactions: [], assets: [], liabilities: [] });
      }
    });

    set({ unsubscribe: unsub });
  },

  cleanup: () => {
    const { unsubscribe } = get();
    if (unsubscribe) unsubscribe();
    set({ unsubscribe: null, isLoaded: false, transactions: [], assets: [], liabilities: [] });
  },

  // Actions automatically update Firestore
  addTransaction: async (transaction) => {
    const user = auth.currentUser;
    if (!user) return;
    
    // Optimistic local update isn't strictly needed if onSnapshot is fast, 
    // but the store will naturally update when Firestore broadcasts it back.
    const newTransaction = { ...transaction, id: crypto.randomUUID() };
    const userDocRef = doc(db, 'users', user.uid);
    
    await setDoc(userDocRef, {
      transactions: arrayUnion(newTransaction)
    }, { merge: true });
  },

  deleteTransaction: async (id) => {
    const user = auth.currentUser;
    if (!user) return;
    
    const { transactions } = get();
    const updatedTransactions = transactions.filter((t) => t.id !== id);
    
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      transactions: updatedTransactions
    }, { merge: true });
  },

  addAsset: async (asset) => {
    const user = auth.currentUser;
    if (!user) return;
    
    const newAsset = { ...asset, id: crypto.randomUUID() };
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      assets: arrayUnion(newAsset)
    }, { merge: true });
  },

  deleteAsset: async (id) => {
    const user = auth.currentUser;
    if (!user) return;
    
    const { assets } = get();
    const updated = assets.filter((a) => a.id !== id);
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, { assets: updated }, { merge: true });
  },

  addLiability: async (liability) => {
    const user = auth.currentUser;
    if (!user) return;
    
    const newLiability = { ...liability, id: crypto.randomUUID() };
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      liabilities: arrayUnion(newLiability)
    }, { merge: true });
  },

  deleteLiability: async (id) => {
    const user = auth.currentUser;
    if (!user) return;
    
    const { liabilities } = get();
    const updated = liabilities.filter((l) => l.id !== id);
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, { liabilities: updated }, { merge: true });
  },

  // Computed/Derived State via Getters
  getNetWorth: () => {
    const state = get();
    
    const totalAssets = state.assets.reduce((sum, item) => sum + Number(item.value), 0);
    const totalLiabilities = state.liabilities.reduce((sum, item) => sum + Number(item.value), 0);
    
    const totalIncome = state.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    const totalExpenses = state.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    const totalAddedAssets = state.transactions
      .filter(t => t.type === 'asset')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    const totalAddedLiabilities = state.transactions
      .filter(t => t.type === 'liability')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return (totalAssets + totalIncome + totalAddedAssets) - (totalLiabilities + totalExpenses + totalAddedLiabilities);
  },

  getStats: () => {
    const state = get();
    
    const totalIncome = state.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    const totalExpenses = state.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    return { totalIncome, totalExpenses };
  }
}));
