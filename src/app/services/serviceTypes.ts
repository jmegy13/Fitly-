import type {
  AuthProviderId,
  BillingPlan,
  BillingSubscription,
  CheckoutSession,
  TryOnRequest,
  TryOnResult,
  User,
  WardrobeItem,
} from '../types';

export type TryOnProgressHandler = (step: string, index: number) => void;

export type GenerateTryOnOptions = {
  onProgress?: TryOnProgressHandler;
  shouldFail?: boolean;
};

export type AuthService = {
  getCurrentUser: () => Promise<User | null>;
  login: (provider: AuthProviderId) => Promise<User>;
  logout: () => Promise<void>;
  saveUser: (user: User) => Promise<User>;
};

export type BillingService = {
  getPlans: () => BillingPlan[];
  getRemainingTryOns: (user: User | null) => number | 'unlimited';
  canUseTryOn: (user: User | null) => boolean;
  consumeTryOnCredit: (user: User | null) => Promise<User>;
  upgradeToPremium: (user: User | null) => Promise<User>;
  getSubscription: (user: User | null) => Promise<BillingSubscription | null>;
  createCheckoutSession: (user: User | null) => Promise<CheckoutSession>;
};

export type StorageService = {
  uploadImage: (file: File) => Promise<string>;
};

export type WardrobeService = {
  listItems: (userId: string) => Promise<WardrobeItem[]>;
  saveItem: (userId: string, item: WardrobeItem) => Promise<WardrobeItem[]>;
};

export type TryOnApi = {
  generate: (request: TryOnRequest, options?: GenerateTryOnOptions) => Promise<TryOnResult>;
};
