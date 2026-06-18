const PAYPAL_NCP_URL = 'https://www.paypal.com/ncp/payment/637B7RSLSZ78A';

export default function PayPalButton() {
  return (
    <a
      href={PAYPAL_NCP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="pay-btn pay-btn-paypal"
    >
      <span className="paypal-logo">Pay with PayPal</span>
    </a>
  );
}
