export type PlanType = 'free' | 'premium';

export type User = {
  id: string;
  name: string;
  email: string;
  image: string;
  plan: PlanType;
  tryOnsUsedThisMonth: number;
};

export type UserProfile = User & {
  createdAt: string;
  updatedAt: string;
};

export type AuthProviderId = 'apple' | 'google' | 'demo';

export type UploadImage = {
  id: string;
  type: 'selfie' | 'clothing';
  image: string;
  label: string;
  source: 'example' | 'upload' | 'catalog';
  brand?: string;
  category?: string;
  price?: string;
};

export type TryOnFlowStatus =
  | 'no_images_selected'
  | 'selfie_selected'
  | 'clothing_item_selected'
  | 'ready_to_generate'
  | 'generating'
  | 'result_ready'
  | 'saved_to_wardrobe';

export type TryOnRequest = {
  userId: string;
  selfie: UploadImage;
  clothing: UploadImage;
};

export type TryOnJobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export type TryOnJob = {
  id: string;
  userId: string;
  status: TryOnJobStatus;
  request: TryOnRequest;
  resultId?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
};

export type TryOnResult = {
  id: string;
  title: string;
  selfie: UploadImage;
  clothing: UploadImage;
  resultImage: string;
  createdAt: string;
  isFavorite: boolean;
};

export type WardrobeItem = TryOnResult;

export type UsageRecord = {
  id: string;
  userId: string;
  month: string;
  tryOnsUsed: number;
  updatedAt: string;
};

export type BillingPlan = {
  id: PlanType;
  name: string;
  price: string;
  period: string;
  benefits: string[];
};

export type SubscriptionStatus = 'none' | 'trialing' | 'active' | 'past_due' | 'canceled';

export type BillingSubscription = {
  id: string;
  userId: string;
  plan: Exclude<PlanType, 'free'>;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
};

export type CheckoutSession = {
  id: string;
  userId: string;
  plan: Exclude<PlanType, 'free'>;
  status: 'created' | 'completed' | 'expired';
  checkoutUrl: string;
  createdAt: string;
};

export type TryOnDraft = {
  status: TryOnFlowStatus;
  selfie: UploadImage | null;
  clothing: UploadImage | null;
  result: TryOnResult | null;
  error: string | null;
};

export type ServiceErrorCode =
  | 'missing_user'
  | 'usage_limit_reached'
  | 'upload_failed'
  | 'generation_failed'
  | 'storage_save_failed'
  | 'network_failed'
  | 'integration_not_configured';

export class ServiceError extends Error {
  code: ServiceErrorCode;

  constructor(code: ServiceErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}
