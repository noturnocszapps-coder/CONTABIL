import { PaymentProvider, SubscriptionResult, WebhookResult } from './payment.types';
import { PlanTier } from '../../../types/billing';

export class MercadoPagoProvider implements PaymentProvider {
  providerName = 'mercadopago' as const;

  async createSubscription(
    userId: string,
    planTier: PlanTier,
    customerData?: { email: string; name?: string; cpfCnpj?: string }
  ): Promise<SubscriptionResult> {
    const mockSubId = `sub_mp_${Date.now()}`;
    const amount = planTier === 'CONTADOR' ? '297.00' : '97.00';

    return {
      subscriptionId: mockSubId,
      status: 'active',
      checkoutUrl: `https://www.mercadopago.com.br/subscriptions/checkout?pref_id=${mockSubId}`,
      qrCodePix: '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540597.005802BR5913SplitReadyAI6009SAO_PAULO62070503***6304E2CA',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      rawResponse: { provider: 'mercadopago', userId, planTier, amount },
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    console.log(`[MercadoPago] Canceling subscription ${subscriptionId}`);
    return true;
  }

  async handleWebhook(eventPayload: any): Promise<WebhookResult> {
    const action = eventPayload?.action || 'subscription.created';
    return {
      eventType: action,
      userId: eventPayload?.data?.metadata?.user_id,
      planTier: eventPayload?.data?.metadata?.plan_tier as PlanTier,
      processed: true,
      message: 'MercadoPago webhook processed successfully',
    };
  }
}
