import { appConfig } from '../config/env';
import { mockBillingRepository } from '../repositories/mockBillingRepository';
import { mockTryOnJobRepository } from '../repositories/mockTryOnJobRepository';
import { mockUsageRepository } from '../repositories/mockUsageRepository';
import { mockUserRepository } from '../repositories/mockUserRepository';
import { mockWardrobeRepository } from '../repositories/mockWardrobeRepository';
import {
  supabaseBillingRepository,
  supabaseTryOnJobRepository,
  supabaseUsageRepository,
  supabaseUserRepository,
  supabaseWardrobeRepository,
} from '../repositories/supabaseRepositories';
import { mockTryOnApi } from './mockTryOnApi';
import { remoteTryOnApi } from './remoteTryOnApi';

const useRemoteRepositories = appConfig.serviceMode === 'remote';

export const serviceRegistry = {
  tryOnApi: appConfig.serviceMode === 'remote' && appConfig.enableRemoteAi ? remoteTryOnApi : mockTryOnApi,
  userRepository: useRemoteRepositories ? supabaseUserRepository : mockUserRepository,
  usageRepository: useRemoteRepositories ? supabaseUsageRepository : mockUsageRepository,
  wardrobeRepository: useRemoteRepositories ? supabaseWardrobeRepository : mockWardrobeRepository,
  tryOnJobRepository: useRemoteRepositories ? supabaseTryOnJobRepository : mockTryOnJobRepository,
  billingRepository: useRemoteRepositories ? supabaseBillingRepository : mockBillingRepository,
};
