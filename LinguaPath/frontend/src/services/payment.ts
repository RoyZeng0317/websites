const API_URL = 'http://localhost:5000/api';

export interface Plan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'quarter' | 'year';
  features: string[];
}

export interface SubscriptionStatus {
  active: boolean;
  planId: string | null;
  nextBillingDate: string | null;
  cancelAtPeriodEnd: boolean;
}

export const PLANS: Plan[] = [
  { id: 'monthly', name: 'Monthly', price: 299, period: 'month', features: ['Full vocabulary access', 'Daily word of the day', 'Progress tracking', 'Basic speaking exercises'] },
  { id: 'quarterly', name: 'Quarterly', price: 599, period: 'quarter', features: ['Everything in Monthly', 'Advanced grammar lessons', 'Speech recognition', 'Priority support'] },
  { id: 'yearly', name: 'Yearly', price: 1999, period: 'year', features: ['Everything in Quarterly', 'AI-powered tutoring', 'Unlimited practice tests', 'Certificate of completion'] },
];

async function getIdToken(): Promise<string | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const auth = (window as any).__firebase_auth__;
    if (auth?.currentUser) return auth.currentUser.getIdToken() as Promise<string>;
  } catch { /* no-op */ }
  return null;
}

export async function createECpayOrder(planId: string): Promise<{ paymentUrl: string }> {
  const token = await getIdToken();
  const res = await fetch(`${API_URL}/payment/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ planId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Payment failed' })) as { message: string };
    throw new Error(err.message || 'Payment failed');
  }
  return res.json() as Promise<{ paymentUrl: string }>;
}

export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  const token = await getIdToken();
  const res = await fetch(`${API_URL}/payment/subscription`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) return { active: false, planId: null, nextBillingDate: null, cancelAtPeriodEnd: false };
  return res.json() as Promise<SubscriptionStatus>;
}

export async function cancelSubscription(): Promise<void> {
  const token = await getIdToken();
  const res = await fetch(`${API_URL}/payment/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Cancel failed' })) as { message: string };
    throw new Error(err.message || 'Cancel failed');
  }
}
