import type { BillingSubscription, CheckoutSession, TryOnJob, User, WardrobeItem } from '../types';
import { ServiceError } from '../types';
import { getSupabaseClient, supabaseAdapter } from '../services/supabaseAdapter';
import type {
  BillingRepository,
  TryOnJobRepository,
  UsageRepository,
  UserRepository,
  WardrobeRepository,
} from './repositoryTypes';

function mapProfile(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    image: row.image_url ?? '',
    plan: row.plan,
    tryOnsUsedThisMonth: row.try_ons_used_this_month ?? 0,
  };
}

function mapWardrobeItem(row: any): WardrobeItem {
  return {
    id: row.id,
    title: row.title,
    selfie: {
      id: `${row.id}-selfie`,
      type: 'selfie',
      image: row.selfie_image_url,
      label: 'Selfie',
      source: 'upload',
    },
    clothing: {
      id: `${row.id}-clothing`,
      type: 'clothing',
      image: row.clothing_image_url,
      label: row.title,
      source: 'upload',
      brand: row.clothing_brand ?? undefined,
      category: row.clothing_category ?? undefined,
      price: row.clothing_price ?? undefined,
    },
    resultImage: row.result_image_url,
    createdAt: row.created_at,
    isFavorite: row.is_favorite,
  };
}

function mapTryOnJob(row: any): TryOnJob {
  return {
    id: row.id,
    userId: row.user_id,
    status: row.status,
    request: {
      userId: row.user_id,
      selfie: {
        id: `${row.id}-selfie`,
        type: 'selfie',
        image: row.selfie_image_url,
        label: 'Selfie',
        source: 'upload',
      },
      clothing: {
        id: `${row.id}-clothing`,
        type: 'clothing',
        image: row.clothing_image_url,
        label: 'Clothing item',
        source: 'upload',
      },
    },
    resultId: row.result_image_url ?? undefined,
    error: row.error ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapSubscription(row: any): BillingSubscription {
  return {
    id: row.id,
    userId: row.user_id,
    plan: row.plan,
    status: row.status,
    currentPeriodEnd: row.current_period_end,
    stripeCustomerId: row.stripe_customer_id ?? undefined,
    stripeSubscriptionId: row.stripe_subscription_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const supabaseUserRepository: UserRepository = {
  async getCurrentUser() {
    const client = getSupabaseClient();
    const { data: authData, error: authError } = await client.auth.getUser();
    if (authError || !authData.user) return null;

    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (error) throw error;
    if (data) return mapProfile(data);

    const user: User = {
      id: authData.user.id,
      name: authData.user.user_metadata?.name ?? authData.user.email?.split('@')[0] ?? 'Fitly User',
      email: authData.user.email ?? '',
      image: authData.user.user_metadata?.avatar_url ?? '',
      plan: 'free',
      tryOnsUsedThisMonth: 0,
    };

    return this.upsertUser(user);
  },

  async upsertUser(user) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('profiles')
      .upsert({
        id: user.id,
        name: user.name,
        email: user.email,
        image_url: user.image,
        plan: user.plan,
        try_ons_used_this_month: user.tryOnsUsedThisMonth,
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) throw error;
    return mapProfile(data);
  },

  async clearCurrentUser() {
    await supabaseAdapter.signOut();
  },
};

export const supabaseUsageRepository: UsageRepository = {
  async getMonthlyUsage(userId, month) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('usage_records')
      .select('*')
      .eq('user_id', userId)
      .eq('month', month)
      .maybeSingle();

    if (error) throw error;
    return {
      id: data?.id ?? `${userId}-${month}`,
      userId,
      month,
      tryOnsUsed: data?.try_ons_used ?? 0,
      updatedAt: data?.updated_at ?? new Date().toISOString(),
    };
  },

  async incrementMonthlyUsage(userId, month) {
    const current = await this.getMonthlyUsage(userId, month);
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('usage_records')
      .upsert({
        user_id: userId,
        month,
        try_ons_used: current.tryOnsUsed + 1,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,month' })
      .select('*')
      .single();

    if (error) throw error;
    return {
      id: data.id,
      userId: data.user_id,
      month: data.month,
      tryOnsUsed: data.try_ons_used,
      updatedAt: data.updated_at,
    };
  },
};

export const supabaseWardrobeRepository: WardrobeRepository = {
  async listByUser(userId) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('wardrobe_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []).map(mapWardrobeItem);
  },

  async saveForUser(userId, item) {
    const client = getSupabaseClient();
    const { error } = await client.from('wardrobe_items').insert({
      user_id: userId,
      title: item.title,
      selfie_image_url: item.selfie.image,
      clothing_image_url: item.clothing.image,
      result_image_url: item.resultImage,
      clothing_brand: item.clothing.brand,
      clothing_category: item.clothing.category,
      clothing_price: item.clothing.price,
      is_favorite: item.isFavorite,
    });

    if (error) throw error;
    return this.listByUser(userId);
  },
};

export const supabaseTryOnJobRepository: TryOnJobRepository = {
  async createJob(request) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('try_on_jobs')
      .insert({
        user_id: request.userId,
        status: 'queued',
        selfie_image_url: request.selfie.image,
        clothing_image_url: request.clothing.image,
      })
      .select('*')
      .single();

    if (error) throw error;
    return mapTryOnJob(data);
  },

  async updateJob(jobId, updates) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('try_on_jobs')
      .update({
        status: updates.status,
        result_image_url: updates.resultId,
        error: updates.error,
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId)
      .select('*')
      .single();

    if (error) throw error;
    return mapTryOnJob(data);
  },

  async getJob(jobId) {
    const client = getSupabaseClient();
    const { data, error } = await client.from('try_on_jobs').select('*').eq('id', jobId).maybeSingle();
    if (error) throw error;
    return data ? mapTryOnJob(data) : null;
  },
};

export const supabaseBillingRepository: BillingRepository = {
  async getSubscription(userId) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('billing_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data ? mapSubscription(data) : null;
  },

  async createCheckoutSession() {
    throw new ServiceError('integration_not_configured', 'Stripe checkout must be created by a backend endpoint.');
  },

  async completeCheckoutSession() {
    throw new ServiceError('integration_not_configured', 'Stripe checkout completion must be handled by a webhook.');
  },
};
