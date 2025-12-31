import { Link, useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region"

/**
 * AgriTech Platform Landing Page
 * 
 * Multi-marketplace for agriculture:
 * - Harvest Batches
 * - Vehicle Rentals
 * - Storage Space
 * - Equipment Rentals
 */
const Home = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)

  const marketplaces = [
    {
      title: "Harvest Batches",
      description: "Buy verified farm produce directly from farmers",
      icon: "🌾",
      href: `/${countryCode}/marketplace/harvest`,
      color: "bg-green-50 border-green-200 hover:border-green-400",
    },
    {
      title: "Vehicle Rentals",
      description: "Rent vehicles for transport and logistics",
      icon: "🚚",
      href: `/${countryCode}/marketplace/vehicles`,
      color: "bg-blue-50 border-blue-200 hover:border-blue-400",
    },
    {
      title: "Storage Space",
      description: "Book warehouse and cold storage facilities",
      icon: "🏭",
      href: `/${countryCode}/marketplace/storage`,
      color: "bg-amber-50 border-amber-200 hover:border-amber-400",
    },
    {
      title: "Equipment Rentals",
      description: "Rent farm equipment and machinery",
      icon: "🚜",
      href: `/${countryCode}/marketplace/equipment`,
      color: "bg-orange-50 border-orange-200 hover:border-orange-400",
    },
  ]

  const actors = [
    { role: "Farmers", benefit: "Sell verified harvest batches with traceability", icon: "👨‍🌾" },
    { role: "Buyers", benefit: "Purchase quality produce with full transparency", icon: "🛒" },
    { role: "Gig Workers", benefit: "Rent vehicles & earn from labor opportunities", icon: "👷" },
    { role: "Logistics", benefit: "Access vehicles and manage deliveries", icon: "📦" },
    { role: "Storage Operators", benefit: "Rent warehouse space & manage inventory", icon: "🏢" },
    { role: "Agents", benefit: "Verify harvests and supervise operations", icon: "✅" },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-900 to-green-800 text-white py-24">
        <div className="content-container">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Farm-to-Future<br />Commerce Platform
            </h1>
            <p className="text-xl text-green-100 mb-8">
              A transparent multi-marketplace connecting farmers, buyers, logistics, and service providers with verified harvest tracking and GPS-enabled traceability.
            </p>
            <div className="flex gap-4">
              <a
                href={`/${countryCode}/marketplace/harvest`}
                className="bg-white text-green-900 px-8 py-4 font-semibold hover:bg-green-50 transition-colors"
              >
                Explore Harvest Batches
              </a>
              <a
                href={`/${countryCode}/register`}
                className="border-2 border-white text-white px-8 py-4 font-semibold hover:bg-white hover:text-green-900 transition-colors"
              >
                Join as Vendor
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplaces Grid */}
      <section className="py-16 bg-stone-50">
        <div className="content-container">
          <h2 className="text-3xl font-bold text-stone-900 mb-4">
            Four Integrated Marketplaces
          </h2>
          <p className="text-stone-600 mb-12 max-w-2xl">
            One platform, multiple commerce opportunities. Buy, sell, and rent across our connected ecosystem.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketplaces.map((market) => (
              <Link
                key={market.title}
                to={market.href}
                className={`${market.color} border-2 p-6 hover:shadow-lg transition-all duration-200 group`}
              >
                <div className="text-5xl mb-4">{market.icon}</div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">
                  {market.title}
                </h3>
                <p className="text-stone-700 text-sm">
                  {market.description}
                </p>
                <div className="mt-4 text-stone-900 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Browse <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="content-container">
          <h2 className="text-3xl font-bold text-stone-900 mb-12 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                📍
              </div>
              <h3 className="font-bold text-lg mb-2">GPS Verification</h3>
              <p className="text-stone-600 text-sm">
                Every harvest batch is verified on-farm with GPS coordinates and quality grading by certified agents.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                🔗
              </div>
              <h3 className="font-bold text-lg mb-2">Full Traceability</h3>
              <p className="text-stone-600 text-sm">
                Track your produce from farm to delivery with complete transparency on agents, logistics, and storage.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                💰
              </div>
              <h3 className="font-bold text-lg mb-2">Secure Payments</h3>
              <p className="text-stone-600 text-sm">
                Integrated payment processing with escrow protection for buyers and guaranteed payouts for vendors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Actor Benefits */}
      <section className="py-16 bg-stone-100">
        <div className="content-container">
          <h2 className="text-3xl font-bold text-stone-900 mb-4 text-center">
            Built For Every Actor
          </h2>
          <p className="text-stone-600 mb-12 text-center max-w-2xl mx-auto">
            Whether you grow, buy, transport, or store - our platform is designed for your success.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {actors.map((actor) => (
              <div
                key={actor.role}
                className="bg-white p-6 border border-stone-200 hover:border-green-400 transition-colors"
              >
                <div className="text-3xl mb-3">{actor.icon}</div>
                <h3 className="font-bold text-lg mb-2">{actor.role}</h3>
                <p className="text-stone-600 text-sm">{actor.benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-900 text-white">
        <div className="content-container text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Agriculture?
          </h2>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of farmers, buyers, and service providers building a transparent agricultural ecosystem.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href={`/${countryCode}/register`}
              className="bg-white text-green-900 px-8 py-4 text-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Get Started
            </a>
            <a
              href={`/${countryCode}/marketplace/harvest`}
              className="border-2 border-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-green-900 transition-colors"
            >
              Browse Marketplace
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
