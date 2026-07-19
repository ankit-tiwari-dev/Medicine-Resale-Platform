import { Link } from "react-router-dom";
import LegalPageLayout, { LegalSection } from "../../components/legal/LegalPageLayout";

const TermsOfServicePage = () => {
  return (
    <LegalPageLayout
      title="Terms of Service"
      subtitle="The rules and conditions for using the MedAImart platform."
      lastUpdated="July 19, 2026"
    >
      <LegalSection title="1. Acceptance of Terms">
        <p>
          By accessing or using MedAImart, you agree to be bound by these Terms of Service
          (&quot;Terms&quot;). If you do not agree, you may not use the platform. These Terms apply
          to all users, including buyers, sellers, riders, and administrators.
        </p>
      </LegalSection>

      <LegalSection title="2. Platform Description">
        <p>
          MedAImart is a marketplace for buying and selling verified medicines and medical supplies.
          We facilitate connections between users, verify listings where applicable, and support
          order fulfillment through integrated payment and logistics workflows. MedAImart is not a
          pharmacy and does not provide medical advice.
        </p>
      </LegalSection>

      <LegalSection title="3. Eligibility and Accounts">
        <p>
          You must be at least 18 years old and legally capable of entering into binding agreements
          to use MedAImart. You are responsible for maintaining the confidentiality of your account
          credentials and for all activity under your account.
        </p>
        <p>
          You agree to provide accurate, current, and complete information during registration and
          verification. False or misleading information may result in account suspension or
          termination.
        </p>
      </LegalSection>

      <LegalSection title="4. Seller Responsibilities">
        <p>Sellers on MedAImart must:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Only list medicines that are legally eligible for resale and accurately described.</li>
          <li>Provide valid batch identifiers, expiry dates, and condition details.</li>
          <li>Complete required verification before listings are published.</li>
          <li>Honor confirmed orders and comply with platform handling standards.</li>
        </ul>
        <p>
          MedAImart reserves the right to review, reject, or remove listings that fail verification
          or violate applicable laws or platform policies.
        </p>
      </LegalSection>

      <LegalSection title="5. Buyer Responsibilities">
        <p>Buyers agree to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Purchase medicines only for lawful personal or authorized institutional use.</li>
          <li>Review listing details carefully before completing a purchase.</li>
          <li>Confirm delivery accurately and report issues through the dispute process.</li>
          <li>Not misuse the platform for fraudulent orders or chargeback abuse.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Payments, Wallet, and Escrow">
        <p>
          Transactions on MedAImart may use integrated payment processing and wallet features.
          Funds may be held in escrow until delivery is confirmed. Withdrawal requests are subject
          to verification, applicable fees, and processing timelines defined by the platform.
        </p>
        <p>
          You authorize MedAImart and its payment partners to process charges, refunds, and
          disbursements in connection with your account activity.
        </p>
      </LegalSection>

      <LegalSection title="7. Delivery and Riders">
        <p>
          Delivery may be fulfilled by independent riders or third-party logistics partners.
          Riders must complete KYC verification and comply with medical handling protocols.
          MedAImart is not liable for delays caused by factors outside reasonable platform control.
        </p>
      </LegalSection>

      <LegalSection title="8. Disputes">
        <p>
          Users may raise disputes for order-related issues through the platform&apos;s dispute
          workflow. MedAImart may review evidence from buyers, sellers, and riders to reach a
          resolution. Platform decisions regarding escrow release or refunds are made in accordance
          with documented policies and available evidence.
        </p>
      </LegalSection>

      <LegalSection title="9. Prohibited Conduct">
        <p>You may not:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>List counterfeit, expired, or illegally sourced medicines.</li>
          <li>Circumvent verification, payment, or security systems.</li>
          <li>Harass, impersonate, or defraud other users.</li>
          <li>Use automated tools to scrape data or disrupt platform operations.</li>
          <li>Violate any applicable healthcare, pharmaceutical, or consumer protection laws.</li>
        </ul>
      </LegalSection>

      <LegalSection title="10. Intellectual Property">
        <p>
          MedAImart and its branding, software, and content are protected by applicable intellectual
          property laws. You may not copy, modify, or distribute platform materials without prior
          written consent.
        </p>
      </LegalSection>

      <LegalSection title="11. Disclaimers">
        <p>
          MedAImart is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We do
          not guarantee uninterrupted service, error-free listings, or specific medical outcomes.
          Users are responsible for consulting qualified healthcare professionals before using any
          medicine purchased through the platform.
        </p>
      </LegalSection>

      <LegalSection title="12. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, MedAImart and its operators shall not be liable
          for indirect, incidental, special, or consequential damages arising from your use of the
          platform, including loss of profits, data, or goodwill.
        </p>
      </LegalSection>

      <LegalSection title="13. Termination">
        <p>
          We may suspend or terminate your account at any time for violations of these Terms,
          suspected fraud, or legal requirements. You may close your account through available
          platform settings, subject to completion of pending transactions and compliance obligations.
        </p>
      </LegalSection>

      <LegalSection title="14. Changes to Terms">
        <p>
          We may modify these Terms at any time. Updated Terms will be posted on this page with a
          revised &quot;Last updated&quot; date. Continued use of MedAImart after changes constitutes
          acceptance of the updated Terms.
        </p>
      </LegalSection>

      <LegalSection title="15. Privacy">
        <p>
          Your use of MedAImart is also governed by our{" "}
          <Link to="/privacy" className="text-foreground underline underline-offset-2 hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          , which describes how we collect and use personal information.
        </p>
      </LegalSection>

      <LegalSection title="16. Contact">
        <p>
          For questions about these Terms, contact MedAImart support through the platform or your
          registered account email.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
};

export default TermsOfServicePage;
