import { PaymentProvider, SubscriptionResult, WebhookResult } from './payment.types';
import { PlanTier } from '../../../types/billing';

export class StripeProvider implements PaymentProvider {
  providerName = 'stripe' as const;

  async createSubscription(
    userId: string,
    planTier: PlanTier,
    customerData?: { email: string; name?: string; cpfCnpj?: string }
  ): Promise<SubscriptionResult> {
    const mockSubId = `sub_stripe_${Date.now()}`;

    return {
      subscriptionId: mockSubId,
      status: 'active',
      checkoutUrl: `https://checkout.stripe.com/c/pay/${mockSubId}`,
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      rawResponse: { provider: 'stripe', userId, planTier },
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    console.log(`[Stripe] Canceling subscription ${subscriptionId}`);
    return true;
  }

  async handleWebhook(eventPayload: any): Promise<WebhookResult> {
    return {
      eventType: eventPayload?.type || 'customer.subscription.created',
      userId: eventPayload?.data?.object?.metadata?.userId,
      processed: true,
      message: 'Stripe webhook processed',
    };
  }
}
