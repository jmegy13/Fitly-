import { STORAGE_KEYS } from '../constants';
import type { BillingSubscription, CheckoutSession } from '../types';
import { readStorage, writeStorage } from '../services/localStorageClient';
import type { BillingRepository } from './repositoryTypes';

const subscriptionKey = `${STORAGE_KEYS.user}.subscription`;
const checkoutKey = `${STORAGE_KEYS.user}.checkoutSessions`;

function readSubscriptions() {
  return readStorage<Record<string, BillingSubscription>>(subscriptionKey, {});
}

function readCheckoutSessions() {
  return readStorage<Record<string, CheckoutSession>>(checkoutKey, {});
}

function addOneYear(date: Date) {
  const nextDate = new Date(date);
  nextDate.setFullYear(nextDate.getFullYear() + 1);
  return nextDate.toISOString();
}

export const mockBillingRepository: BillingRepository = {
  async getSubscription(userId) {
    return readSubscriptions()[userId] ?? null;
  },

  async createCheckoutSession(userId, plan) {
    const session: CheckoutSession = {
      id: `checkout-${Date.now()}`,
      userId,
      plan,
      status: 'created',
      checkoutUrl: `/premium?checkout=${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    writeStorage(checkoutKey, { ...readCheckoutSessions(), [session.id]: session });
    return session;
  },

  async completeCheckoutSession(sessionId) {
    const sessions = readCheckoutSessions();
    const session = sessions[sessionId];

    if (!session) {
      throw new Error('Checkout session not found.');
    }

    const now = new Date();
    const subscription: BillingSubscription = {
      id: `sub-${Date.now()}`,
      userId: session.userId,
      plan: session.plan,
      status: 'active',
      currentPeriodEnd: addOneYear(now),
      stripeCustomerId: `cus_mock_${session.userId}`,
      stripeSubscriptionId: `sub_mock_${Date.now()}`,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    writeStorage(checkoutKey, {
      ...sessions,
      [sessionId]: { ...session, status: 'completed' },
    });
    writeStorage(subscriptionKey, { ...readSubscriptions(), [session.userId]: subscription });
    return subscription;
  },
};
