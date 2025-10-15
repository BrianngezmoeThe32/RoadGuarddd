import { Timestamp, FieldValue } from 'firebase/firestore';
import type { ServiceType } from './provider';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'partially_refunded'
  | 'disputed';

export type PaymentMethod = 
  | 'card'
  | 'cash'
  | 'wallet'
  | 'bank_transfer'
  | 'mobile_money';

export type PaymentProvider = 
  | 'stripe'
  | 'paypal'
  | 'razorpay'
  | 'flutterwave'
  | 'cash';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'KES' | 'NGN' | 'GHS' | 'ZAR';

export type CardBrand = 
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'discover'
  | 'diners'
  | 'jcb'
  | 'unionpay'
  | 'unknown';

export type RefundReason = 
  | 'service_cancelled'
  | 'customer_request'
  | 'duplicate_charge'
  | 'fraudulent'
  | 'service_not_provided'
  | 'other';

export interface Payment {
  id: string;
  userId: string;
  providerId?: string;
  serviceRequestId: string;
  
  // Payment Details
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  
  // Payment Method
  paymentMethod: {
    type: PaymentMethod;
    provider: PaymentProvider;
    last4?: string; // for cards
    brand?: CardBrand;
    expiryMonth?: number;
    expiryYear?: number;
    walletType?: 'apple_pay' | 'google_pay' | 'samsung_pay';
  };
  
  // External Payment Info
  externalPaymentId?: string; // Stripe payment intent ID, etc.
  clientSecret?: string; // For Stripe
  paymentMethodId?: string;
  
  // Fee Breakdown
  breakdown: {
    subtotal: number;
    tax: number;
    serviceFee: number;
    convenienceFee: number;
    discount: number;
    total: number;
  };
  
  // Provider Payout
  payout?: {
    amount: number;
    processedAt?: Timestamp;
    payoutId?: string;
    status: 'pending' | 'processing' | 'paid' | 'failed';
  };
  
  // Refunds
  refunds?: Array<{
    id: string;
    amount: number;
    reason: RefundReason;
    reasonDescription?: string;
    processedAt: Timestamp;
    refundId?: string; // External refund ID
  }>;
  
  // Dispute Information
  dispute?: {
    id: string;
    status: 'needs_response' | 'under_review' | 'won' | 'lost';
    reason: string;
    evidence?: any;
    dueBy?: Timestamp;
  };
  
  // Metadata
  description?: string;
  metadata?: Record<string, any>;
  
  // Timestamps
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  paidAt?: Timestamp;
  failedAt?: Timestamp;
  refundedAt?: Timestamp;
}

export interface PaymentWrite extends Omit<Payment, 'id' | 'createdAt' | 'updatedAt'> {
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: Currency;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
  clientSecret: string;
  paymentMethodTypes: string[];
  metadata: {
    userId: string;
    serviceRequestId: string;
    type: 'service_payment';
  };
}

export interface CardDetails {
  number: string;
  expMonth: number;
  expYear: number;
  cvc: string;
  name: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export interface WalletBalance {
  userId: string;
  available: number;
  pending: number;
  currency: Currency;
  lastUpdated: Timestamp;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit' | 'refund' | 'payout';
  amount: number;
  currency: Currency;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  referenceId?: string; // Payment ID or external reference
  metadata?: Record<string, any>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Payout {
  id: string;
  providerId: string;
  amount: number;
  currency: Currency;
  status: 'pending' | 'processing' | 'paid' | 'failed' | 'canceled';
  method: 'bank_transfer' | 'mobile_money' | 'wallet';
  destination?: {
    bank?: {
      accountNumber: string;
      routingNumber?: string;
      bankName: string;
    };
    mobileMoney?: {
      provider: string;
      phoneNumber: string;
    };
    wallet?: {
      type: string;
    };
  };
  fees: {
    processing: number;
    total: number;
  };
  arrivalDate?: Timestamp;
  externalPayoutId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserPaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethod;
  isDefault: boolean;
  
  // Card specific
  card?: {
    brand: CardBrand;
    last4: string;
    expMonth: number;
    expYear: number;
    name: string;
  };
  
  // Bank account specific
  bank?: {
    bankName: string;
    last4: string;
    routingNumber?: string;
  };
  
  // Mobile money specific
  mobileMoney?: {
    provider: string;
    phoneNumber: string;
  };
  
  // Metadata
  externalId?: string; // Stripe payment method ID, etc.
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TaxRate {
  id: string;
  jurisdiction: string;
  percentage: number;
  inclusive: boolean;
  description: string;
  active: boolean;
}

export interface PricingConfiguration {
  baseFees: {
    [key in keyof ServiceType]: number;
  };
  distanceRate: number; // per km
  emergencyFee: number;
  serviceFee: {
    percentage: number;
    minimum: number;
  };
  taxRates: TaxRate[];
  minimumOrder: number;
  currency: Currency;
}