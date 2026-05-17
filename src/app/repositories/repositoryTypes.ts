import type {
  BillingSubscription,
  CheckoutSession,
  TryOnJob,
  TryOnJobStatus,
  TryOnRequest,
  UsageRecord,
  User,
  WardrobeItem,
} from '../types';

export type UserRepository = {
  getCurrentUser: () => Promise<User | null>;
  upsertUser: (user: User) => Promise<User>;
  clearCurrentUser: () => Promise<void>;
};

export type UsageRepository = {
  getMonthlyUsage: (userId: string, month: string) => Promise<UsageRecord>;
  incrementMonthlyUsage: (userId: string, month: string) => Promise<UsageRecord>;
};

export type WardrobeRepository = {
  listByUser: (userId: string) => Promise<WardrobeItem[]>;
  saveForUser: (userId: string, item: WardrobeItem) => Promise<WardrobeItem[]>;
};

export type TryOnJobRepository = {
  createJob: (request: TryOnRequest) => Promise<TryOnJob>;
  updateJob: (jobId: string, updates: Partial<Pick<TryOnJob, 'resultId' | 'error'>> & { status: TryOnJobStatus }) => Promise<TryOnJob>;
  getJob: (jobId: string) => Promise<TryOnJob | null>;
};

export type BillingRepository = {
  getSubscription: (userId: string) => Promise<BillingSubscription | null>;
  createCheckoutSession: (userId: string, plan: BillingSubscription['plan']) => Promise<CheckoutSession>;
  completeCheckoutSession: (sessionId: string) => Promise<BillingSubscription>;
};
