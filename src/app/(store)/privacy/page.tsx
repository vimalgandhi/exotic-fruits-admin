export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-navy">Privacy Policy</h1>
      <p className="mb-8 text-sm text-gray-500">Last updated: 1 January 2025</p>

      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-navy">
            1. Introduction
          </h2>
          <p>
            Exotic Fruits (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;)
            is committed to protecting your personal information. This Privacy
            Policy explains what data we collect, how we use it, and your rights
            regarding that data when you use our website (
            <strong>exoticfruits.in</strong>).
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-navy">
            2. Information We Collect
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Account information:</strong> name, email address, and
              password when you register.
            </li>
            <li>
              <strong>Order information:</strong> delivery address, phone number,
              and payment method details.
            </li>
            <li>
              <strong>Usage data:</strong> pages visited, time spent on the site,
              device type, and browser via cookies and analytics tools.
            </li>
            <li>
              <strong>Communications:</strong> messages you send us via the
              contact form or email.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-navy">
            3. How We Use Your Information
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>To process and fulfil your orders.</li>
            <li>To send order confirmations and delivery updates.</li>
            <li>
              To improve our website, products, and customer experience.
            </li>
            <li>
              To send promotional emails if you have opted in (you can
              unsubscribe at any time).
            </li>
            <li>To comply with legal obligations.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-navy">
            4. Data Sharing
          </h2>
          <p>
            We do not sell your personal information. We may share data with
            trusted third-party service providers (e.g., payment processors,
            logistics partners) solely to operate our business. These partners
            are contractually obligated to keep your data confidential and secure.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-navy">5. Cookies</h2>
          <p>
            We use cookies to maintain your session, remember cart contents, and
            analyse site traffic. You can control cookie settings through your
            browser. Disabling cookies may affect some website functionality.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-navy">
            6. Data Security
          </h2>
          <p>
            We implement industry-standard security measures including HTTPS
            encryption, secure password hashing, and regular security audits to
            protect your data. However, no internet transmission is 100% secure,
            and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-navy">
            7. Data Retention
          </h2>
          <p>
            We retain your personal data for as long as your account is active or
            as needed to provide services and comply with legal obligations. You
            may request deletion of your account and associated data by contacting
            us.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-navy">
            8. Your Rights
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your personal data.</li>
            <li>Opt out of marketing communications at any time.</li>
            <li>Lodge a complaint with a data protection authority.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-navy">
            9. Children&apos;s Privacy
          </h2>
          <p>
            Our services are not directed at children under the age of 13. We do
            not knowingly collect personal information from children. If you
            believe we have inadvertently collected such data, please contact us
            immediately.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-navy">
            10. Contact Us
          </h2>
          <p>
            For privacy-related enquiries or to exercise your rights, please
            contact our Data Protection Officer at{' '}
            <a
              href="mailto:privacy@exoticfruits.in"
              className="text-navy underline hover:text-gold"
            >
              privacy@exoticfruits.in
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
