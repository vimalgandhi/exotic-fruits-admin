const TEAM = [
  {
    name: 'Arjun Mehta',
    role: 'Founder & CEO',
    bio: "With 15+ years in the premium fruit trade, Arjun built Exotic Fruits to connect Indian consumers with the world's finest produce.",
    emoji: '👨‍💼',
  },
  {
    name: 'Priya Sharma',
    role: 'Head of Sourcing',
    bio: 'Priya travels the globe to personally select the freshest, highest-quality exotic fruits from trusted farms.',
    emoji: '🌏',
  },
  {
    name: 'Rahul Verma',
    role: 'Operations Director',
    bio: 'Rahul ensures every order reaches you in perfect condition through our cold-chain logistics network.',
    emoji: '🚚',
  },
  {
    name: 'Neha Kapoor',
    role: 'Customer Experience Lead',
    bio: 'Neha and her team are dedicated to making every interaction with Exotic Fruits delightful and memorable.',
    emoji: '⭐',
  },
]

const VALUES = [
  {
    icon: '🌿',
    title: 'Sustainability',
    description:
      'We work with farms that follow sustainable practices, minimising environmental impact and supporting local communities.',
  },
  {
    icon: '✅',
    title: 'Quality First',
    description:
      'Every fruit is inspected and graded before dispatch. We never compromise on quality or freshness.',
  },
  {
    icon: '🤝',
    title: 'Fair Trade',
    description:
      'We pay farmers fair prices and build long-term relationships that benefit growers and consumers alike.',
  },
  {
    icon: '💚',
    title: 'Customer Love',
    description:
      'Our customers are at the heart of everything we do. Your satisfaction is our success.',
  },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-blue-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">
            About <span className="text-gold">Exotic Fruits</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            We are passionate about bringing the world&#39;s most extraordinary
            fruits to your doorstep — fresh, organic, and full of flavour.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-bold text-navy">Our Mission</h2>
              <p className="mt-4 leading-relaxed text-gray-600">
                At Exotic Fruits, our mission is simple: make premium exotic
                fruits accessible to everyone in India. We believe that great
                food should be available to all, not just those who travel the
                world or shop at luxury stores.
              </p>
              <p className="mt-4 leading-relaxed text-gray-600">
                Founded in 2018, we started as a small import company with a
                handful of varieties. Today we stock over 60 exotic fruits sourced
                from 25 countries, delivered fresh to your home within 48 hours of
                harvest.
              </p>
            </div>
            <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-gold/10 to-navy/10 p-12 text-center">
              <div>
                <p className="text-6xl">🥭</p>
                <p className="mt-4 text-4xl font-bold text-navy">60+</p>
                <p className="text-gray-500">Exotic Varieties</p>
                <p className="mt-4 text-4xl font-bold text-navy">25</p>
                <p className="text-gray-500">Source Countries</p>
                <p className="mt-4 text-4xl font-bold text-navy">50K+</p>
                <p className="text-gray-500">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-10 text-center text-3xl font-bold text-navy">
            Our Values
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm"
              >
                <p className="text-4xl">{value.icon}</p>
                <h3 className="mt-4 font-semibold text-navy">{value.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-10 text-center text-3xl font-bold text-navy">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm"
              >
                <p className="text-5xl">{member.emoji}</p>
                <h3 className="mt-4 font-semibold text-navy">{member.name}</h3>
                <p className="text-sm font-medium text-gold">{member.role}</p>
                <p className="mt-2 text-sm text-gray-500">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
