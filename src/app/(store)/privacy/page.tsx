import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Privacy Policy',
  description:
    'Read the Privacy Policy for Exotic Fruits – how we collect, use, and protect your personal data.',
  url: 'https://exotic-fruits.com/privacy',
})

const LAST_UPDATED = 'March 1, 2025'

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-2 text-4xl font-bold text-navy">Privacy Policy</h1>
      <p className="mb-10 text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>

      <div className="space-y-10 text-gray-700">
        {/* 1. Introduction */}
        <section>
          <h2 className="mb-3 text-xl font-bold text-navy">1. Introduction</h2>
          <p>
            Exotic Fruits (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is
            committed to protecting your personal information and your right to
            privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you visit our website{' '}
            <a href="https://exotic-fruits.com" className="text-gold hover:underline">
              https://exotic-fruits.com
            </a>{' '}
            or make a purchase from us.
          </p>
          <p className="mt-3">
            Please read this policy carefully. If you disagree with its terms,
            please discontinue use of our site.
          </p>
        </section>

        {/* 2. Data We Collect */}
        <section>
          <h2 className="mb-3 text-xl font-bold text-navy">
            2. Data We Collect
          </h2>
          <p>
            We may collect personal information that you voluntarily provide to
            us when you:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>Register for an account</li>
            <li>Place an order</li>
            <li>Contact us via our contact form</li>
            <li>Subscribe to our newsletter</li>
          </ul>
          <p className="mt-3">
            The personal information we may collect includes:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>Name, email address, phone number</li>
            <li>Billing and delivery address</li>
            <li>Payment information (processed securely via third-party providers)</li>
            <li>
              Device information, IP address, and browsing data via cookies
            </li>
          </ul>
        </section>

        {/* 3. How We Use Your Data */}
        <section>
          <h2 className="mb-3 text-xl font-bold text-navy">
            3. How We Use Your Data
          </h2>
          <p>We use the information we collect to:</p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>Process and fulfil your orders</li>
            <li>Send order confirmations and delivery updates</li>
            <li>Respond to customer service requests</li>
            <li>Send promotional communications (with your consent)</li>
            <li>Improve our website and product offerings</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        {/* 4. Data Security */}
        <section>
          <h2 className="mb-3 text-xl font-bold text-navy">4. Data Security</h2>
          <p>
            We implement appropriate technical and organisational measures to
            protect your personal data against accidental loss, unauthorised
            access, alteration, and disclosure. All payment transactions are
            encrypted using SSL technology.
          </p>
          <p className="mt-3">
            However, no internet transmission or electronic storage is entirely
            secure. While we strive to use commercially acceptable means to
            protect your personal information, we cannot guarantee its absolute
            security.
          </p>
        </section>

        {/* 5. Changes to This Policy */}
        <section>
          <h2 className="mb-3 text-xl font-bold text-navy">
            5. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the &quot;Last updated&quot; date. You are advised to
            review this Privacy Policy periodically for any changes.
          </p>
        </section>

        {/* 6. Your Rights */}
        <section>
          <h2 className="mb-3 text-xl font-bold text-navy">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your personal data</li>
            <li>Object to or restrict the processing of your data</li>
            <li>Withdraw consent for marketing communications at any time</li>
          </ul>
          <p className="mt-3">
            To exercise these rights, please contact us at the details below.
          </p>
        </section>

        {/* 7. Contact Us */}
        <section>
          <h2 className="mb-3 text-xl font-bold text-navy">7. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy or our
            data practices, please contact us:
          </p>
          <ul className="mt-3 space-y-1">
            <li>
              Email:{' '}
              <a
                href="mailto:privacy@exoticfruits.com"
                className="text-gold hover:underline"
              >
                privacy@exoticfruits.com
              </a>
            </li>
            <li>
              Address: 123, Fruit Market Lane, Mumbai, Maharashtra 400001
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
