import { Link } from "react-router-dom";
import LegalPageLayout, { LegalSection } from "../../components/legal/LegalPageLayout";

const PrivacyPolicyPage = () => {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="How MedAImart collects, uses, and protects your personal information."
      lastUpdated="July 19, 2026"
    >
      <LegalSection title="1. Introduction">
        <p>
          MedAImart (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates a platform that connects buyers,
          sellers, and delivery partners for verified medicine resale. This Privacy Policy explains
          what information we collect, how we use it, and the choices you have regarding your data.
        </p>
        <p>
          By using MedAImart, you agree to the collection and use of information in accordance with
          this policy.
        </p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <p>We may collect the following types of information:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-foreground">Account information:</strong> name, email address,
            phone number, and password credentials.
          </li>
          <li>
            <strong className="text-foreground">Identity and verification data:</strong> documents
            submitted for seller, buyer, or rider KYC verification, including government-issued IDs
            and related compliance records.
          </li>
          <li>
            <strong className="text-foreground">Transaction data:</strong> order history, wallet
            balances, payment details, withdrawal requests, and dispute records.
          </li>
          <li>
            <strong className="text-foreground">Listing information:</strong> medicine details,
            images, batch identifiers, and seller-provided descriptions.
          </li>
          <li>
            <strong className="text-foreground">Usage data:</strong> IP address, browser type,
            device information, and activity logs related to your use of the platform.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. How We Use Your Information">
        <p>We use collected information to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Provide, maintain, and improve the MedAImart platform.</li>
          <li>Verify user identities and medicine listings for safety and compliance.</li>
          <li>Process orders, payments, escrow releases, and wallet transactions.</li>
          <li>Facilitate delivery logistics and rider assignments.</li>
          <li>Respond to disputes, support requests, and legal obligations.</li>
          <li>Send service-related notifications, including OTP verification and order updates.</li>
          <li>Detect, prevent, and address fraud, abuse, or security issues.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Information Sharing">
        <p>
          We do not sell your personal information. We may share data only when necessary:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>With other users involved in a transaction (e.g., buyer, seller, or assigned rider).</li>
          <li>With payment processors and service providers who assist in platform operations.</li>
          <li>With administrators for verification, dispute resolution, and compliance review.</li>
          <li>When required by law, regulation, or valid legal process.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Data Security">
        <p>
          We implement administrative, technical, and organizational measures to protect your data,
          including encrypted storage for sensitive verification documents. However, no method of
          transmission or storage is completely secure, and we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="6. Data Retention">
        <p>
          We retain personal information for as long as your account is active or as needed to
          provide services, comply with legal obligations, resolve disputes, and enforce our
          agreements. KYC and transaction records may be retained for regulatory compliance even
          after account closure.
        </p>
      </LegalSection>

      <LegalSection title="7. Your Rights">
        <p>You may have the right to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Access and update your account information through your profile settings.</li>
          <li>Request correction of inaccurate personal data.</li>
          <li>Request deletion of your account, subject to legal and compliance retention requirements.</li>
          <li>Withdraw consent for optional communications where applicable.</li>
        </ul>
        <p>
          To exercise these rights, contact us using the support channels available on the platform.
        </p>
      </LegalSection>

      <LegalSection title="8. Cookies and Tracking">
        <p>
          We use cookies and similar technologies to maintain sessions, remember preferences, and
          analyze platform usage. You can control cookies through your browser settings, though some
          features may not function properly if cookies are disabled.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Material changes will be posted on
          this page with an updated &quot;Last updated&quot; date. Continued use of MedAImart after
          changes constitutes acceptance of the revised policy.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact Us">
        <p>
          If you have questions about this Privacy Policy or how your data is handled, please
          contact MedAImart support through the platform or your registered account email. For
          platform usage rules, see our{" "}
          <Link to="/terms" className="text-foreground underline underline-offset-2 hover:text-primary transition-colors">
            Terms of Service
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
};

export default PrivacyPolicyPage;
