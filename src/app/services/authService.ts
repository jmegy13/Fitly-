import { demoUser } from '../constants';
import { appConfig } from '../config/env';
import type { AuthProviderId, User } from '../types';
import { serviceRegistry } from './serviceRegistry';
import { supabaseAdapter } from './supabaseAdapter';

export const authService = {
  async getCurrentUser() {
    return serviceRegistry.userRepository.getCurrentUser();
  },

  async login(provider: AuthProviderId) {
    if (appConfig.serviceMode === 'remote' && (provider === 'apple' || provider === 'google')) {
      await supabaseAdapter.signInWithOAuth(provider);
      const currentUser = await this.getCurrentUser();
      if (currentUser) return currentUser;
    }

    const providerName = provider === 'apple' ? 'Apple' : provider === 'google' ? 'Google' : 'Demo';
    const existingUser = await this.getCurrentUser();
    const user: User = {
      ...demoUser,
      ...existingUser,
      id: existingUser?.id ?? `${provider}-mock-user`,
      email: existingUser?.email ?? `${providerName.toLowerCase()}@fitly.demo`,
      name: existingUser?.name ?? `${providerName} User`,
    };

    return serviceRegistry.userRepository.upsertUser(user);
  },

  async logout() {
    return serviceRegistry.userRepository.clearCurrentUser();
  },

  async saveUser(user: User) {
    return serviceRegistry.userRepository.upsertUser(user);
  },
};
