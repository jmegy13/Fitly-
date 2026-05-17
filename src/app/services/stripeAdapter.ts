import { hasStripeConfig } from '../config/env';
import { ServiceError } from '../types';

export function assertStripeConfigured() {
  if (!hasStripeConfig()) {
    throw new ServiceError('integration_not_configured', 'Stripe public key is not configured yet.');
  }
}

export const stripeAdapter = {
  createCheckoutSession() {
    assertStripeConfigured();
    throw new ServiceError('integration_not_configured', 'Stripe checkout is ready for backend session wiring.');
  },
};
