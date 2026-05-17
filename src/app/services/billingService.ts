import { billingPlans, FREE_TRY_ON_LIMIT } from '../constants';
import type { BillingPlan, User } from '../types';
import { ServiceError } from '../types';
import { authService } from './authService';
import { serviceRegistry } from './serviceRegistry';

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export const billingService = {
  getPlans(): BillingPlan[] {
    return billingPlans;
  },

  getRemainingTryOns(user: User | null) {
    if (!user) return 0;
    if (user.plan === 'premium') return 'unlimited' as const;
    return Math.max(0, FREE_TRY_ON_LIMIT - user.tryOnsUsedThisMonth);
  },

  canUseTryOn(user: User | null) {
    return Boolean(user && (user.plan === 'premium' || user.tryOnsUsedThisMonth < FREE_TRY_ON_LIMIT));
  },

  getCurrentMonth() {
    return new Date().toISOString().slice(0, 7);
  },

  async consumeTryOnCredit(user: User | null) {
    if (!user) {
      throw new ServiceError('missing_user', 'Please log in before generating a try-on.');
    }

    if (!this.canUseTryOn(user)) {
      throw new ServiceError('usage_limit_reached', 'You used your 5 free try-ons this month.');
    }

    await serviceRegistry.usageRepository.incrementMonthlyUsage(user.id, this.getCurrentMonth());
    const nextUser = { ...user, tryOnsUsedThisMonth: user.tryOnsUsedThisMonth + 1 };
    return authService.saveUser(nextUser);
  },

  async upgradeToPremium(user: User | null) {
    if (!user) {
      throw new ServiceError('missing_user', 'Please log in before upgrading.');
    }

    const checkoutSession = await serviceRegistry.billingRepository.createCheckoutSession(user.id, 'premium');
    await wait(650);
    await serviceRegistry.billingRepository.completeCheckoutSession(checkoutSession.id);
    return authService.saveUser({ ...user, plan: 'premium' });
  },

  async getSubscription(user: User | null) {
    if (!user) return null;
    return serviceRegistry.billingRepository.getSubscription(user.id);
  },

  async createCheckoutSession(user: User | null) {
    if (!user) {
      throw new ServiceError('missing_user', 'Please log in before upgrading.');
    }

    return serviceRegistry.billingRepository.createCheckoutSession(user.id, 'premium');
  },
};
