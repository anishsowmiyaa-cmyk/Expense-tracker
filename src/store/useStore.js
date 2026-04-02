import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { db, auth } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export const useStore = create(persist((set, get) => ({
  transactions: [],
  assets: [],
  liabilities: [],
  isLoaded: false,
  isSyncing: false,
  lastSyncError: null,
  unsubscribe: null,

  // Setup Firestore listener
  initFirebaseSync: () => {
    const user = auth.currentUser;
    if (!user) return;

     const { unsubscribe } = get();
     if (unsubscribe) unsubscribe();

    const userDocRef = doc(db, 'users', user.uid);
    const unsub = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        set({
          transactions: data.transactions || [],
          assets: data.assets || [],
          liabilities: data.liabilities || [],
          isLoaded: true,
          lastSyncError: null,
        });
      } else {
        set({ isLoaded: true, transactions: [], assets: [], liabilities: [], lastSyncError: null });
      }
    });

    set({ unsubscribe: unsub });
  },

  cleanup: () => {
    const { unsubscribe } = get();
    if (unsubscribe) unsubscribe();
    set({
      unsubscribe: null,
      isLoaded: false,
      isSyncing: false,
      lastSyncError: null,
      transactions: [],
      assets: [],
      liabilities: [],
    });
  },

  syncUserData: async () => {
    const user = auth.currentUser;
    if (!user) return;

    const { transactions, assets, liabilities } = get();
    const userDocRef = doc(db, 'users', user.uid);

    set({ isSyncing: true, lastSyncError: null });

    try {
      await setDoc(userDocRef, {
        transactions,
        assets,
        liabilities,
      }, { merge: true });
      set({ isSyncing: false, lastSyncError: null });
    } catch (error) {
      console.error('Firebase sync failed', error);
      set({
        isSyncing: false,
        lastSyncError: error?.message || 'Sync failed',
      });
    }
  },

  // Actions automatically update Firestore
  addTransaction: async (transaction) => {
    const user = auth.currentUser;
    if (!user) return;

    const newTransaction = { ...transaction, id: crypto.randomUUID() };
    const updatedTransactions = [...get().transactions, newTransaction];

    set({ transactions: updatedTransactions });
    await get().syncUserData();
  },

  deleteTransaction: async (id) => {
    const user = auth.currentUser;
    if (!user) return;
    
    const { transactions } = get();
    const updatedTransactions = transactions.filter((t) => t.id !== id);
    
    set({ transactions: updatedTransactions });
    await get().syncUserData();
  },

  addAsset: async (asset) => {
    const user = auth.currentUser;
    if (!user) return;

    const newAsset = { ...asset, id: crypto.randomUUID() };
    const updatedAssets = [...get().assets, newAsset];

    set({ assets: updatedAssets });
    await get().syncUserData();
  },

  deleteAsset: async (id) => {
    const user = auth.currentUser;
    if (!user) return;
    
    const { assets } = get();
    const updated = assets.filter((a) => a.id !== id);
    set({ assets: updated });
    await get().syncUserData();
  },

  addLiability: async (liability) => {
    const user = auth.currentUser;
    if (!user) return;

    const newLiability = { ...liability, id: crypto.randomUUID() };
    const updatedLiabilities = [...get().liabilities, newLiability];

    set({ liabilities: updatedLiabilities });
    await get().syncUserData();
  },

  deleteLiability: async (id) => {
    const user = auth.currentUser;
    if (!user) return;
    
    const { liabilities } = get();
    const updated = liabilities.filter((l) => l.id !== id);
    set({ liabilities: updated });
    await get().syncUserData();
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
}), {
  name: 'expense-tracker-store',
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    transactions: state.transactions,
    assets: state.assets,
    liabilities: state.liabilities,
  }),
}));
