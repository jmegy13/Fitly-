import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authService } from '../services/authService';
import { billingService } from '../services/billingService';
import type { AuthProviderId, BillingSubscription, User } from '../types';

type AuthContextValue = {
  isAuthLoading: boolean;
  isLoggedIn: boolean;
  user: User | null;
  subscription: BillingSubscription | null;
  remainingTryOns: number | 'unlimited';
  loginWithProvider: (provider: AuthProviderId) => Promise<void>;
  logout: () => Promise<void>;
  upgradeToPremium: () => Promise<void>;
  canUseTryOn: boolean;
  consumeTryOnCredit: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<BillingSubscription | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    authService.getCurrentUser().then((storedUser) => {
      if (!isMounted) return;
      setUser(storedUser);
      if (storedUser) {
        billingService.getSubscription(storedUser).then((storedSubscription) => {
          if (isMounted) setSubscription(storedSubscription);
        });
      }
      setIsAuthLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const remainingTryOns = useMemo(() => billingService.getRemainingTryOns(user), [user]);
  const canUseTryOn = billingService.canUseTryOn(user);

  const loginWithProvider = async (provider: AuthProviderId) => {
    setIsAuthLoading(true);
    const nextUser = await authService.login(provider);
    const nextSubscription = await billingService.getSubscription(nextUser);
    setUser(nextUser);
    setSubscription(nextSubscription);
    setIsAuthLoading(false);
  };

  const logout = async () => {
    setIsAuthLoading(true);
    await authService.logout();
    setUser(null);
    setSubscription(null);
    setIsAuthLoading(false);
  };

  const upgradeToPremium = async () => {
    const nextUser = await billingService.upgradeToPremium(user);
    const nextSubscription = await billingService.getSubscription(nextUser);
    setUser(nextUser);
    setSubscription(nextSubscription);
  };

  const consumeTryOnCredit = async () => {
    const nextUser = await billingService.consumeTryOnCredit(user);
    setUser(nextUser);
    return true;
  };

  const value: AuthContextValue = {
    isAuthLoading,
    isLoggedIn: Boolean(user),
    user,
    subscription,
    remainingTryOns,
    loginWithProvider,
    logout,
    upgradeToPremium,
    canUseTryOn,
    consumeTryOnCredit,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
