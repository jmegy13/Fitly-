import type { BillingPlan, TryOnDraft, User } from './types';

export const FREE_TRY_ON_LIMIT = 5;

export const STORAGE_KEYS = {
  user: 'fitly.mockUser.v4',
  legacyUser: 'fitly.mockUser.v3',
  tryOnDraft: 'fitly.tryOnDraft.v4',
  legacyTryOnDraft: 'fitly.tryOnDraft.v2',
  wardrobe: 'fitly.wardrobe.v4',
  legacyWardrobe: 'fitly.wardrobe.v2',
};

export const demoUser: User = {
  id: 'demo-user',
  name: 'Sarah Johnson',
  email: 'sarah.j@email.com',
  image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=85',
  plan: 'free',
  tryOnsUsedThisMonth: 0,
};

export const emptyTryOnDraft: TryOnDraft = {
  status: 'no_images_selected',
  selfie: null,
  clothing: null,
  result: null,
  error: null,
};

export const loadingStepLabels = [
  'Analyzing your photo',
  'Detecting clothing shape',
  'Generating your fit',
  'Finalizing details',
];

export const billingPlans: BillingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'month',
    benefits: ['5 try-ons per month', 'Standard generations', 'Limited saved history'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$9.99',
    period: 'month',
    benefits: [
      'Unlimited try-ons',
      'HD generations',
      'Faster AI processing',
      'Saved outfit history',
      'Early access to new features',
    ],
  },
];
