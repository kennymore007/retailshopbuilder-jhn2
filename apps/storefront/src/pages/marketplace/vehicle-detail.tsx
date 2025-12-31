import { Link, useLocation, useNavigate } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { Route } from "@/routes/$countryCode/marketplace/vehicles/$vehicleId"

const VehicleDetailPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const { listing } = Route.useLoaderData()

  if (!listing) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Vehicle not found</h2>
          <button
            onClick={() => navigate({ to: '/$countryCode/marketplace/vehicles', params: { countryCode: countryCode || 'ng' } })}
            className="text-blue-700 hover:underline"
          >
            Back to vehicles
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="content-container py-12">
        <button
          onClick={() => navigate({ to: '/$countryCode/marketplace/vehicles', params: { countryCode: countryCode || 'ng' } })}
          className="inline-flex items-center text-blue-700 hover:text-blue-800 mb-6"
        >
          ← Back to Vehicles
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center rounded-lg">
            <span className="text-9xl">🚚</span>
          </div>

          <div className="bg-white p-8 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 text-sm font-semibold ${
                listing.status === "published" ? "bg-green-100 text-green-800" : "bg-stone-100 text-stone-600"
              }`}>
                {listing.status === "published" ? "Available" : "Not Available"}
              </span>
              <span className="px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-800">
                {(listing.metadata as any)?.type || "Vehicle"}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-stone-900 mb-4">
              {listing.title}
            </h1>

            <div className="mb-6">
              <span className="text-4xl font-bold text-blue-700">
                ₦{listing.variants?.[0]?.calculated_price?.calculated_amount ? 
                  (listing.variants[0].calculated_price.calculated_amount / 100).toFixed(2) : 
                  "N/A"}
              </span>
              <span className="text-stone-600 text-lg">/day</span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-stone-700">
                <span className="font-semibold w-24">Capacity:</span>
                <span>{(listing.metadata as any)?.capacity || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3 text-stone-700">
                <span className="font-semibold w-24">Location:</span>
                <span>{(listing.metadata as any)?.location || "N/A"}</span>
              </div>
              {(listing.metadata as any)?.features && (
                <div className="flex items-start gap-3 text-stone-700">
                  <span className="font-semibold w-24">Features:</span>
                  <span>{(listing.metadata as any).features}</span>
                </div>
              )}
            </div>

            {listing.description && (
              <div className="mb-6">
                <h3 className="font-semibold text-stone-900 mb-2">Description</h3>
                <p className="text-stone-600">{listing.description}</p>
              </div>
            )}

            <button className="w-full bg-blue-700 text-white py-4 font-semibold rounded-lg hover:bg-blue-800 transition-colors">
              Contact to Book
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleDetailPage
