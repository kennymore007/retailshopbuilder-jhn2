import { useState } from "react"
import { useLocation, useNavigate } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { sdk } from "@/lib/utils/sdk"

type ActorType = "farmer" | "buyer" | "gig_worker" | "storage_operator" | "equipment_owner" | "logistics_provider" | "agent"

const actorTypeOptions: { value: ActorType; label: string; description: string; icon: string }[] = [
  {
    value: "farmer",
    label: "Farmer",
    description: "Sell your harvest batches directly to buyers",
    icon: "🌾",
  },
  {
    value: "buyer",
    label: "Buyer",
    description: "Purchase agricultural products and supplies",
    icon: "🛒",
  },
  {
    value: "gig_worker",
    label: "Gig Worker",
    description: "Offer transportation and delivery services",
    icon: "🚚",
  },
  {
    value: "storage_operator",
    label: "Storage Operator",
    description: "List your storage facilities for rent",
    icon: "🏭",
  },
  {
    value: "equipment_owner",
    label: "Equipment Owner",
    description: "Rent out farming equipment",
    icon: "🚜",
  },
  {
    value: "logistics_provider",
    label: "Logistics Provider",
    description: "Provide logistics and supply chain services",
    icon: "📦",
  },
  {
    value: "agent",
    label: "Agent",
    description: "Represent multiple vendors or facilitate transactions",
    icon: "🤝",
  },
]

export const RegisterPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    actor_type: "farmer" as ActorType,
    business_name: "",
    location: "",
    description: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = (await sdk.client.fetch("/store/vendors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })) as Response

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to register")
      }

      setSuccess(true)
      
      // Redirect to marketplace after 2 seconds
      setTimeout(() => {
        navigate({ to: `${baseHref}/marketplace/harvest` })
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (success) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-900 mb-2">
            Registration Successful!
          </h2>
          <p className="text-stone-600">
            Welcome to AgriMarket. Redirecting you to the marketplace...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-900 mb-3">
            Become a Vendor
          </h1>
          <p className="text-lg text-stone-600">
            Join AgriMarket and connect with buyers, sellers, and service providers across Kenya
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Actor Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-stone-900 mb-3">
                I want to register as a:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {actorTypeOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.actor_type === option.value
                        ? "border-green-600 bg-green-50"
                        : "border-stone-200 hover:border-green-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="actor_type"
                      value={option.value}
                      checked={formData.actor_type === option.value}
                      onChange={handleChange}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{option.icon}</span>
                        <span className="font-semibold text-stone-900">
                          {option.label}
                        </span>
                      </div>
                      <p className="text-sm text-stone-600">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Personal Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-stone-900 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="John Kamau"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+254 700 000 000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Nairobi, Kenya"
                  />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-stone-900 mb-4">
                Business Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Business Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Kamau Farms Ltd"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tell us about your business, experience, and what you'll be offering on AgriMarket..."
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate({ to: baseHref || "/" })}
                className="flex-1 px-6 py-3 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Registering..." : "Complete Registration"}
              </button>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-8 text-center text-sm text-stone-600">
          <p>
            Already have an account?{" "}
            <a
              href={`${baseHref}/login`}
              className="text-green-700 font-semibold hover:underline"
            >
              Log in here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
