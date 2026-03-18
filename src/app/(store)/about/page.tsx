import { Metadata } from 'next'
import { CheckCircle, Leaf, Users, Star } from 'lucide-react'
import Link from 'next/link'
import { generateMetadata } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: 'About Us',
  description:
    'Learn about Exotic Fruits – our mission, our team, and why we are the best choice for premium exotic fruits delivered fresh.',
  url: 'https://exotic-fruits.com/about',
})

const WHY_CHOOSE_US = [
  {
    icon: '🌿',
    title: '100% Organic',
    description:
      'Every fruit we source is certified organic, free from harmful pesticides and chemicals.',
  },
  {
    icon: '✈️',
    title: 'Global Sourcing',
    description:
      'We partner with trusted farms across Asia, South America, and Africa to bring you the rarest fruits.',
  },
  {
    icon: '🚚',
    title: 'Fast Delivery',
    description:
      'Our cold-chain logistics ensure your fruits arrive fresh within 24–48 hours of dispatch.',
  },
  {
    icon: '💯',
    title: 'Quality Guarantee',
    description:
      'Not satisfied? We offer a full refund or replacement – no questions asked.',
  },
]

const TEAM = [
  {
    name: 'Vimal Gandhi',
    role: 'Founder & CEO',
    bio: 'A passionate fruit enthusiast with over a decade of experience in sustainable agriculture and e-commerce.',
  },
  {
    name: 'Priya Sharma',
    role: 'Head of Sourcing',
    bio: 'Priya travels the globe to handpick the finest exotic fruits from local farmers.',
  },
  {
    name: 'Rahul Mehta',
    role: 'Logistics Manager',
    bio: 'Rahul ensures every order reaches you on time and in perfect condition.',
  },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-blue-900 py-20 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">About Us</h1>
          <p className="mt-6 text-lg text-gray-300">
            We are on a mission to bring the world&apos;s most exquisite exotic
            fruits directly to your doorstep – fresh, organic, and sustainably
            sourced.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold">
                <Leaf size={16} />
                Our Mission
              </div>
              <h2 className="text-3xl font-bold text-navy">
                Connecting You with Nature&apos;s Finest
              </h2>
              <p className="mt-4 text-gray-600">
                At Exotic Fruits, we believe everyone deserves access to
                premium-quality exotic fruits. Founded in 2020, we bridge the
                gap between small-scale sustainable farms around the world and
                fruit lovers in India.
              </p>
              <p className="mt-4 text-gray-600">
                From the lush rainforests of Brazil to the tropical valleys of
                Southeast Asia, every fruit in our catalogue has a story – and
                we are here to share it with you.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                {[
                  'Ethically sourced from family farms',
                  'Zero artificial preservatives',
                  'Eco-friendly packaging',
                  'Community-driven supply chain',
                ].map((point) => (
                  <div key={point} className="flex items-center gap-2">
                    <CheckCircle size={18} className="shrink-0 text-success" />
                    <span className="text-gray-700">{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-gold/20 to-navy/10 p-12">
              <span className="text-9xl">🥭</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-10 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold">
              <Star size={16} />
              Why Choose Us
            </div>
            <h2 className="text-3xl font-bold text-navy">
              The Exotic Fruits Difference
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {WHY_CHOOSE_US.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <span className="text-4xl">{item.icon}</span>
                <h3 className="mt-4 text-lg font-bold text-navy">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-10 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold">
              <Users size={16} />
              Our Team
            </div>
            <h2 className="text-3xl font-bold text-navy">Meet the People Behind the Fruits</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy text-2xl font-bold text-white">
                  {member.name[0]}
                </div>
                <h3 className="font-bold text-navy">{member.name}</h3>
                <p className="mt-1 text-sm font-medium text-gold">{member.role}</p>
                <p className="mt-3 text-sm text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16 text-white">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to Taste the Difference?</h2>
          <p className="mt-4 text-gray-300">
            Browse our curated collection of exotic fruits and experience
            freshness like never before.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/products"
              className="rounded-lg bg-gold px-8 py-3 font-semibold text-white transition-colors hover:bg-yellow-600"
            >
              Shop Now
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-navy"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
