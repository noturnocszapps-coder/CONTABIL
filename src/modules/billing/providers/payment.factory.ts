import { PaymentProvider } from './payment.types';
import { MercadoPagoProvider } from './mercado-pago.provider';
import { AsaasProvider } from './asaas.provider';
import { StripeProvider } from './stripe.provider';

export type SupportedGateway = 'mercadopago' | 'asaas' | 'stripe';

export class PaymentGatewayFactory {
  static getProvider(gateway: SupportedGateway = 'mercadopago'): PaymentProvider {
    switch (gateway) {
      case 'asaas':
        return new AsaasProvider();
      case 'stripe':
        return new StripeProvider();
      case 'mercadopago':
      default:
        return new MercadoPagoProvider();
    }
  }
}
