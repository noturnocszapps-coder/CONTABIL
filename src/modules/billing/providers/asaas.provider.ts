import { PaymentProvider, SubscriptionResult, WebhookResult } from './payment.types';
import { PlanTier } from '../../../types/billing';

export class AsaasProvider implements PaymentProvider {
  providerName = 'asaas' as const;

  async createSubscription(
    userId: string,
    planTier: PlanTier,
    customerData?: { email: string; name?: string; cpfCnpj?: string }
  ): Promise<SubscriptionResult> {
    const mockSubId = `sub_asaas_${Date.now()}`;

    return {
      subscriptionId: mockSubId,
      status: 'active',
      checkoutUrl: `https://www.asaas.com/c/${mockSubId}`,
      pixCopiaECola: '00020126580014BR.GOV.BCB.PIX0136asaas-pix-code-example-123456789520400005303986540597.005802BR5913SplitReadyAI6009SAO_PAULO6304C10D',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      rawResponse: { provider: 'asaas', userId, planTier },
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    console.log(`[Asaas] Canceling subscription ${subscriptionId}`);
    return true;
  }

  async handleWebhook(eventPayload: any): Promise<WebhookResult> {
    return {
      eventType: eventPayload?.event || 'PAYMENT_RECEIVED',
      userId: eventPayload?.payment?.externalReference,
      processed: true,
      message: 'Asaas webhook processed',
    };
  }
}
