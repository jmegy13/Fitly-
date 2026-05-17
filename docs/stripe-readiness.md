# Fitly Stripe Readiness

Phase 8 keeps billing mocked, but the code now follows a Stripe-shaped flow.

## Current Mock Flow

1. User taps `Upgrade to Premium`.
2. `billingService.upgradeToPremium` creates a mock checkout session.
3. The mock checkout session is completed immediately.
4. A mock subscription is persisted locally.
5. The user plan is updated to `premium`.

## Real Stripe Flow Later

1. Frontend calls a backend endpoint to create a Stripe Checkout Session.
2. Backend returns the hosted checkout URL.
3. User completes payment on Stripe.
4. Stripe webhook receives `checkout.session.completed`.
5. Backend writes or updates `billing_subscriptions`.
6. Frontend reloads the user profile and subscription.

## Required Webhooks

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`

## Database Target

The `billing_subscriptions` table is defined in `supabase/schema.sql`.
