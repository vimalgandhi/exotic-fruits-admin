const TEAM = [
  {
    name: "Arjun Mehta",
    role: "Founder & CEO",
    bio: "With 15+ years in the premium fruit trade, Arjun built Exotic Fruits to connect Indian consumers with the world's finest produce.",
    emoji: "👨‍💼",
  },
  {
    name: "Priya Sharma",
    role: "Head of Sourcing",
    bio: "Priya travels the globe to personally select the freshest, highest-quality exotic fruits from trusted farms.",
    emoji: "🌏",
  },
  {
    name: "Rahul Verma",
    role: "Operations Director",
    bio: "Rahul ensures every order reaches you in perfect condition through our cold-chain logistics network.",
    emoji: "🚚",
  },
  {
    name: "Neha Kapoor",
    role: "Customer Experience Lead",
    bio: "Neha and her team are dedicated to making every interaction with Exotic Fruits delightful and memorable.",
    emoji: "⭐",
  },
];

const VALUES = [
  {
    icon: "🌿",
    title: "Sustainability",
    description:
      "We work with farms that follow sustainable practices, minimising environmental impact and supporting local communities.",
  },
  {
    icon: "✅",
    title: "Quality First",
    description:
      "Every fruit is inspected and graded before dispatch. We never compromise on quality or freshness.",
  },
  {
    icon: "🤝",
    title: "Fair Trade",
    description:
      "We pay farmers fair prices and build long-term relationships that benefit growers and consumers alike.",
  },
  {
    icon: "💚",
    title: "Customer Love",
    description:
      "Our customers are at the heart of everything we do. Your satisfaction is our success.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy-600 via-navy-700 to-navy-800 py-24 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-5xl font-bold md:text-6xl text-gray-200">
            About <span className="text-gold-500">Exotic Fruits</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-200">
            We are passionate about bringing the world&#39;s most extraordinary
            fruits to your doorstep — fresh, organic, and full of flavour.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white py-10">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-4xl font-bold text-navy-600">Our Mission</h2>
              <div className="mt-2 h-1 w-16 bg-gold-500"></div>
              <p className="mt-6 leading-relaxed text-gray-700">
                At Exotic Fruits, our mission is simple: make premium exotic
                fruits accessible to everyone in India. We believe that great
                food should be available to all, not just those who travel the
                world or shop at luxury stores.
              </p>
              <p className="mt-4 leading-relaxed text-gray-700">
                Founded in 2018, we started as a small import company with a
                handful of varieties. Today we stock over 60 exotic fruits
                sourced from 25 countries, delivered fresh to your home within
                48 hours of harvest.
              </p>
            </div>
            <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-gold-50 to-navy-50 p-8 text-center shadow-lg">
              <div>
                <p className="text-6xl">🥭</p>
                <div className="mt-8 space-y-6">
                  <div>
                    <p className="text-5xl font-bold text-gold-500">60+</p>
                    <p className="mt-1 text-sm font-medium text-navy-600">
                      Exotic Varieties
                    </p>
                  </div>
                  <div className="h-px bg-gold-200"></div>
                  <div>
                    <p className="text-5xl font-bold text-gold-500">25</p>
                    <p className="mt-1 text-sm font-medium text-navy-600">
                      Source Countries
                    </p>
                  </div>
                  <div className="h-px bg-gold-200"></div>
                  <div>
                    <p className="text-5xl font-bold text-gold-500">50K+</p>
                    <p className="mt-1 text-sm font-medium text-navy-600">
                      Happy Customers
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-navy-50 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-navy-600">
              Our Core Values
            </h2>
            <div className="mx-auto mt-3 h-1 w-16 bg-gold-500"></div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="group rounded-xl border border-gold-200 bg-white p-6 text-center shadow-md transition-all duration-300 hover:shadow-lg hover:border-gold-400 hover:-translate-y-1"
              >
                <p className="text-5xl transition-transform duration-300 group-hover:scale-110">
                  {value.icon}
                </p>
                <h3 className="mt-4 text-lg font-semibold text-navy-600">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-navy-600">Meet the Team</h2>
            <div className="mx-auto mt-3 h-1 w-16 bg-gold-500"></div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="group rounded-xl border border-gray-200 bg-gradient-to-br from-white to-navy-50 p-8 text-center shadow-md transition-all duration-300 hover:shadow-lg hover:border-gold-400 hover:-translate-y-1"
              >
                <div className="inline-block rounded-full bg-gold-50 p-3 transition-all duration-300 group-hover:bg-gold-500">
                  <p className="text-5xl transition-transform duration-300 group-hover:scale-110">
                    {member.emoji}
                  </p>
                </div>
                <h3 className="mt-5 text-lg font-bold text-navy-600">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-gold-500">
                  {member.role}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-navy-600 to-navy-700 py-16 text-center text-white">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-bold md:text-4xl text-gray-200">
            Ready to Experience Premium Exotic Fruits?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-200">
            Join thousands of customers who trust Exotic Fruits for the
            freshest, highest-quality produce delivered right to their door.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="/products"
              className="btn-secondary px-8 py-3 text-white bg-gold-500 hover:text-gold-500 hover:bg-white "
            >
              Shop Now
            </a>
            <a
              href="/contact"
              className="rounded-lg border-2 border-white px-8 py-3 font-semibold transition-colors bg-gray-200 text-navy-600 hover:text-white hover:bg-navy-600"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
