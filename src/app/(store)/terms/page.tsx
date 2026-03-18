import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Terms & Conditions',
  description:
    'Read the Terms and Conditions for using the Exotic Fruits website and services.',
  url: 'https://exotic-fruits.com/terms',
})

const LAST_UPDATED = 'March 1, 2025'

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-2 text-4xl font-bold text-navy">Terms &amp; Conditions</h1>
      <p className="mb-10 text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>

      <div className="space-y-10 text-gray-700">
        {/* 1. Introduction */}
        <section>
          <h2 className="mb-3 text-xl font-bold text-navy">1. Introduction</h2>
          <p>
            Welcome to Exotic Fruits (&quot;Company&quot;, &quot;we&quot;,
            &quot;our&quot;, &quot;us&quot;). These Terms and Conditions govern
            your use of our website located at{' '}
            <a href="https://exotic-fruits.com" className="text-gold hover:underline">
              https://exotic-fruits.com
            </a>{' '}
            and any related services provided by Exotic Fruits.
          </p>
          <p className="mt-3">
            By accessing and using our website, you accept and agree to be
            bound by these Terms. If you do not agree, please do not use our
            services.
          </p>
        </section>

        {/* 2. Use License */}
        <section>
          <h2 className="mb-3 text-xl font-bold text-navy">2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the
            materials (information or software) on Exotic Fruits&apos; website
            for personal, non-commercial transitory viewing only. This is the
            grant of a licence, not a transfer of title, and under this licence
            you may not:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>modify or copy the materials;</li>
            <li>
              use the materials for any commercial purpose or for any public
              display (commercial or non-commercial);
            </li>
            <li>
              attempt to decompile or reverse engineer any software contained
              on Exotic Fruits&apos; website;
            </li>
            <li>
              remove any copyright or other proprietary notations from the
              materials; or
            </li>
            <li>
              transfer the materials to another person or &quot;mirror&quot;
              the materials on any other server.
            </li>
          </ul>
          <p className="mt-3">
            This licence shall automatically terminate if you violate any of
            these restrictions and may be terminated by Exotic Fruits at any
            time.
          </p>
        </section>

        {/* 3. Disclaimer */}
        <section>
          <h2 className="mb-3 text-xl font-bold text-navy">3. Disclaimer</h2>
          <p>
            The materials on Exotic Fruits&apos; website are provided on an
            &quot;as is&quot; basis. Exotic Fruits makes no warranties,
            expressed or implied, and hereby disclaims and negates all other
            warranties including, without limitation, implied warranties or
            conditions of merchantability, fitness for a particular purpose, or
            non-infringement of intellectual property or other violation of
            rights.
          </p>
          <p className="mt-3">
            Further, Exotic Fruits does not warrant or make any representations
            concerning the accuracy, likely results, or reliability of the use
            of the materials on its website or otherwise relating to such
            materials or on any sites linked to this site.
          </p>
        </section>

        {/* 4. Limitations */}
        <section>
          <h2 className="mb-3 text-xl font-bold text-navy">4. Limitations</h2>
          <p>
            In no event shall Exotic Fruits or its suppliers be liable for any
            damages (including, without limitation, damages for loss of data or
            profit, or due to business interruption) arising out of the use or
            inability to use the materials on Exotic Fruits&apos; website, even
            if Exotic Fruits or a Exotic Fruits authorised representative has
            been notified orally or in writing of the possibility of such
            damage.
          </p>
        </section>

        {/* 5. Accuracy of Materials */}
        <section>
          <h2 className="mb-3 text-xl font-bold text-navy">
            5. Accuracy of Materials
          </h2>
          <p>
            The materials appearing on Exotic Fruits&apos; website could
            include technical, typographical, or photographic errors. Exotic
            Fruits does not warrant that any of the materials on its website
            are accurate, complete, or current. Exotic Fruits may make changes
            to the materials contained on its website at any time without
            notice.
          </p>
        </section>

        {/* 6. Links */}
        <section>
          <h2 className="mb-3 text-xl font-bold text-navy">6. Links</h2>
          <p>
            Exotic Fruits has not reviewed all of the sites linked to its
            website and is not responsible for the contents of any such linked
            site. The inclusion of any link does not imply endorsement by
            Exotic Fruits of the site. Use of any such linked website is at the
            user&apos;s own risk.
          </p>
        </section>

        {/* 7. Modifications */}
        <section>
          <h2 className="mb-3 text-xl font-bold text-navy">7. Modifications</h2>
          <p>
            Exotic Fruits may revise these Terms of Service for its website at
            any time without notice. By using this website you are agreeing to
            be bound by the then-current version of these Terms of Service.
          </p>
        </section>

        {/* 8. Governing Law */}
        <section>
          <h2 className="mb-3 text-xl font-bold text-navy">8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in
            accordance with the laws of India and you irrevocably submit to the
            exclusive jurisdiction of the courts in Mumbai, Maharashtra.
          </p>
        </section>

        {/* 9. Contact */}
        <section>
          <h2 className="mb-3 text-xl font-bold text-navy">9. Contact Us</h2>
          <p>
            If you have any questions about these Terms &amp; Conditions, please
            contact us:
          </p>
          <ul className="mt-3 space-y-1">
            <li>
              Email:{' '}
              <a
                href="mailto:legal@exoticfruits.com"
                className="text-gold hover:underline"
              >
                legal@exoticfruits.com
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
