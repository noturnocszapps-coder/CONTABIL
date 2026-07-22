import { PlanTier } from '../../../types/billing';

export interface SubscriptionResult {
  subscriptionId: string;
  status: 'active' | 'pending' | 'canceled' | 'trialing';
  checkoutUrl?: string;
  qrCodePix?: string;
  pixCopiaECola?: string;
  nextBillingDate?: string;
  rawResponse?: any;
}

export interface WebhookResult {
  eventType: string;
  userId?: string;
  planTier?: PlanTier;
  processed: boolean;
  message?: string;
}

export interface PaymentProvider {
  providerName: 'mercadopago' | 'asaas' | 'stripe' | 'mock';
  
  createSubscription(
    userId: string,
    planTier: PlanTier,
    customerData?: {
      email: string;
      name?: string;
      cpfCnpj?: string;
    }
  ): Promise<SubscriptionResult>;

  cancelSubscription(subscriptionId: string): Promise<boolean>;

  handleWebhook(eventPayload: any): Promise<WebhookResult>;
}
