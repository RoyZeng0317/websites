import { useState, useEffect } from 'react';
import { useAuth } from '../services/useAuth';
import {
  PLANS,
  createECpayOrder,
  getSubscriptionStatus,
  cancelSubscription,
  type Plan,
  type SubscriptionStatus,
} from '../services/payment';
import PayPalButton from './PayPalButton';
import './Pay.css';

type PaymentMethod = 'ecpay' | 'paypal' | null;

export default function Pay() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(null);
  const [loadingSub, setLoadingSub] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoadingSub(true); // eslint-disable-line react-hooks/set-state-in-effect
    getSubscriptionStatus()
      .then((s) => { if (!cancelled) setSubStatus(s); })
      .catch(() => { if (!cancelled) setSubStatus({ active: false, planId: null, nextBillingDate: null, cancelAtPeriodEnd: false }); })
      .finally(() => { if (!cancelled) setLoadingSub(false); });
    return () => { cancelled = true; };
  }, [user]);

  const resolvedSub = !user ? null : subStatus;
  const activePlan = resolvedSub?.active
    ? PLANS.find((p) => p.id === resolvedSub.planId) ?? null
    : null;

  const resetSelection = () => {
    setSelectedPlan(null);
    setPaymentMethod(null);
    setError('');
  };

  const handleECpay = async () => {
    if (!selectedPlan) return;
    setPaying(true);
    setError('');
    try {
      const { paymentUrl } = await createECpayOrder(selectedPlan.id);
      window.location.href = paymentUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setPaying(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;
    setError('');
    try {
      await cancelSubscription();
      setSubStatus((prev) => prev ? { ...prev, cancelAtPeriodEnd: true } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cancel failed');
    }
  };

  if (authLoading) {
    return <div className="pay-loading">Loading...</div>;
  }

  return (
    <div className="pay-container">
      <header className="pay-header">
        <h1>Upgrade Your Learning</h1>
        <p>Choose the plan that fits your goals</p>
      </header>

      {!user && (
        <section className="pay-auth-prompt">
          <p>Sign in to subscribe and unlock all features.</p>
          <button className="pay-btn pay-btn-google" onClick={signInWithGoogle}>
            Sign in with Google
          </button>
        </section>
      )}

      {error && <div className="pay-error">{error}</div>}

      {resolvedSub?.active && activePlan && (
        <section className="pay-current-plan">
          <h2>Your Current Plan</h2>
          <div className="pay-current-card">
            <h3>{activePlan.name}</h3>
            <p className="pay-price">NT${activePlan.price}/{activePlan.period === 'month' ? 'mo' : activePlan.period === 'quarter' ? '3mo' : 'yr'}</p>
            {resolvedSub.nextBillingDate && (
              <p>Next billing: {new Date(resolvedSub.nextBillingDate).toLocaleDateString()}</p>
            )}
            {resolvedSub.cancelAtPeriodEnd ? (
              <p className="pay-cancelled">Cancelled — access until billing period ends</p>
            ) : (
              <button className="pay-btn pay-btn-cancel" onClick={handleCancel}>
                Cancel Subscription
              </button>
            )}
          </div>
        </section>
      )}

      {selectedPlan ? (
        <section className="pay-payment-section">
          <button className="pay-btn-back" onClick={resetSelection}>← Back to plans</button>
          <h2>Complete Payment for {selectedPlan.name}</h2>
          <p className="pay-total">Total: NT${selectedPlan.price}</p>

          <div className="pay-methods">
            <button
              className={`pay-method-btn ${paymentMethod === 'ecpay' ? 'pay-method-active' : ''}`}
              onClick={() => setPaymentMethod('ecpay')}
            >
              <span className="pay-method-icon">💳</span>
              <span>Credit Card / ATM (ECpay)</span>
            </button>
            <button
              className={`pay-method-btn ${paymentMethod === 'paypal' ? 'pay-method-active' : ''}`}
              onClick={() => setPaymentMethod('paypal')}
            >
              <span className="pay-method-icon">🅿</span>
              <span>PayPal</span>
            </button>
          </div>

          {paymentMethod === 'ecpay' && (
            <button
              className="pay-btn pay-btn-subscribe pay-btn-full"
              disabled={paying}
              onClick={handleECpay}
            >
              {paying ? 'Redirecting to ECpay...' : `Pay NT$${selectedPlan.price} with ECpay`}
            </button>
          )}

          {paymentMethod === 'paypal' && (
            <div className="pay-paypal-wrapper">
              <PayPalButton />
              <p className="pay-paypal-note">A new tab will open for PayPal checkout. Return here once payment is complete.</p>
            </div>
          )}
        </section>
      ) : (
        <section className="pay-plans">
          {PLANS.map((plan) => {
            const isActive = resolvedSub?.active && resolvedSub.planId === plan.id;
            return (
              <div key={plan.id} className={`pay-plan-card ${isActive ? 'pay-plan-active' : ''}`}>
                {plan.id === 'yearly' && <span className="pay-badge">Best Value</span>}
                <h3>{plan.name}</h3>
                <p className="pay-price">
                  NT${plan.price}
                  <span className="pay-period">
                    /{plan.period === 'month' ? 'mo' : plan.period === 'quarter' ? '3mo' : 'yr'}
                  </span>
                </p>
                <ul className="pay-features">
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                {isActive ? (
                  <button className="pay-btn pay-btn-current" disabled>
                    Current Plan
                  </button>
                ) : (
                  <button
                    className="pay-btn pay-btn-subscribe"
                    disabled={!user}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    Subscribe
                  </button>
                )}
              </div>
            );
          })}
        </section>
      )}

      {loadingSub && <div className="pay-loading">Checking subscription...</div>}
    </div>
  );
}
