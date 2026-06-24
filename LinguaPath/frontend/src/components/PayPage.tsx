import { useState } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import LoginModal from './LoginModal';
import { useTheme } from '../hooks/useTheme';
import styles from './PayPage.module.css';

interface Plan {
  name: string;
  price: string;
  period: string;
  perLabel: string;
  features: string[];
  featured?: boolean;
  badge?: string;
}

const PLANS: Plan[] = [
  {
    name: 'Monthly',
    price: 'NT$299',
    period: 'Billed monthly',
    perLabel: '/mo',
    features: [
      'Full vocabulary access',
      'Daily word of the day',
      'Progress tracking',
      'Basic speaking exercises',
    ],
  },
  {
    name: 'Quarterly',
    price: 'NT$599',
    period: 'Billed every 3 months — save 33%',
    perLabel: '/3mo',
    features: [
      'Everything in Monthly',
      'Advanced grammar lessons',
      'Speech recognition',
      'Priority support',
    ],
  },
  {
    name: 'Yearly',
    price: 'NT$1,999',
    period: 'Billed annually — save 44%',
    perLabel: '/yr',
    featured: true,
    badge: 'Best Value',
    features: [
      'Everything in Quarterly',
      'AI-powered tutoring',
      'Unlimited practice tests',
      'Certificate of completion',
    ],
  },
];

const FAQS = [
  { q: 'Can I cancel anytime?', a: "Yes. You can cancel your subscription at any time. You'll retain access until the end of your current billing period." },
  { q: 'Which payment methods are accepted?', a: 'We accept PayPal, which supports credit cards, debit cards, and PayPal balance in most countries.' },
  { q: 'Is there a free trial?', a: "LinguaPath's core content — including all lessons and courses — is free forever. Premium plans unlock advanced features." },
  { q: 'What happens after I pay?', a: 'Once your PayPal payment is confirmed, your account is upgraded immediately. Progress tracking and premium features are activated on your next sign-in.' },
];

export default function PayPage() {
  const { icon, toggle } = useTheme();
  const [loginOpen, setLoginOpen] = useState(false);
  const [payModal, setPayModal] = useState<{ name: string; price: string } | null>(null);

  const openPay = (plan: Plan) => setPayModal({ name: plan.name, price: plan.price });

  return (
    <>
      <NavBar
        user={null}
        onSignIn={() => setLoginOpen(true)}
        onSignUp={() => setLoginOpen(true)}
        onSignOut={() => {}}
        onThemeToggle={toggle}
        themeIcon={icon}
      />

      <div className={styles.page}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.tag}>✦ Simple Pricing</div>
          <h1>Upgrade Your Learning</h1>
          <p>Choose the plan that fits your goals. Cancel anytime.</p>
        </div>

        {/* Plans grid */}
        <div className={styles.plansGrid}>
          {PLANS.map((plan) => (
            <div key={plan.name} className={`${styles.planCard} ${plan.featured ? styles.featured : ''}`}>
              {plan.badge && <div className={styles.planBadge}>{plan.badge}</div>}
              <div className={styles.planName}>{plan.name}</div>
              <div className={styles.planPrice}>
                {plan.price}<span>{plan.perLabel}</span>
              </div>
              <div className={styles.planPeriod}>{plan.period}</div>
              <ul className={styles.planFeatures}>
                {plan.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <button
                className={`${styles.planBtn} ${plan.featured ? '' : styles.ghost}`}
                onClick={() => openPay(plan)}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className={styles.faqSection}>
          <h2>Frequently Asked Questions</h2>
          {FAQS.map((faq) => (
            <details key={faq.q} className={styles.faqItem}>
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      <Footer />

      {/* Payment modal */}
      {payModal && (
        <div className={`${styles.payOverlay} ${styles.open}`} onClick={() => setPayModal(null)}>
          <div className={styles.payModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.payModalHeader}>
              <h3>Complete Payment</h3>
              <button className={styles.payModalClose} onClick={() => setPayModal(null)}>✕</button>
            </div>
            <div className={styles.payModalPlan}>
              <span>{payModal.name}</span>
              <span className={styles.payModalPrice}>{payModal.price}</span>
            </div>
            <div className={styles.payMethodLabel}>Pay securely with</div>
            <a
              href="https://www.paypal.com/ncp/payment/637B7RSLSZ78A"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.paypalBtn}
            >
              <span className={styles.paypalLogo}>PayPal</span>
              <span>— Pay Now</span>
            </a>
            <p className={styles.payNote}>Opens PayPal in a new tab. Return here once payment is complete.</p>
          </div>
        </div>
      )}

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onGoogleSignIn={async () => {}}
        onEmailSignIn={async () => {}}
        onEmailSignUp={async () => {}}
      />
    </>
  );
}
