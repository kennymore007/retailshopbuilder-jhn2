import { Link, useLocation, useRouteContext } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { useState, useMemo } from "react"
import { Route } from "@/routes/$countryCode/marketplace/vehicles"

const VehiclesMarketplace = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const { listings = [] } = Route.useLoaderData()
  
  const [typeFilter, setTypeFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [sortBy, setSortBy] = useState("price-low")
  
  const filteredListings = useMemo(() => {
    let filtered = [...listings]
    if (typeFilter !== "all") filtered = filtered.filter((v: any) => v.metadata?.type === typeFilter)
    if (locationFilter !== "all") filtered = filtered.filter((v: any) => v.location === locationFilter)
    
    switch (sortBy) {
      case "price-high": filtered.sort((a: any, b: any) => b.price - a.price); break
      case "capacity": filtered.sort((a: any, b: any) => parseInt(b.metadata?.capacity || "0") - parseInt(a.metadata?.capacity || "0")); break
      default: filtered.sort((a: any, b: any) => a.price - b.price)
    }
    return filtered
  }, [listings, typeFilter, locationFilter, sortBy])

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-blue-900 text-white py-12">
        <div className="content-container">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-5xl">🚚</span>
            <h1 className="text-4xl font-bold">Vehicle Rentals</h1>
          </div>
          <p className="text-blue-100 text-lg max-w-2xl">
            Rent vehicles for transport and logistics. All vehicles are verified with GPS tracking and insurance.
          </p>
        </div>
      </div>

      <div className="bg-white border-b border-stone-200 py-6">
        <div className="content-container">
          <div className="flex flex-wrap gap-4">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-4 py-2 border border-stone-300 bg-white">
              <option value="all">All Vehicle Types</option>
              <option value="Truck">Truck</option>
              <option value="Pickup">Pickup</option>
              <option value="Van">Van</option>
            </select>
            <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="px-4 py-2 border border-stone-300 bg-white">
              <option value="all">All Locations</option>
              <option value="Nairobi">Nairobi</option>
              <option value="Kiambu">Kiambu</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 border border-stone-300 bg-white">
              <option value="price-low">Sort by: Daily Rate (Low)</option>
              <option value="price-high">Daily Rate (High)</option>
              <option value="capacity">Capacity</option>
            </select>
            <div className="flex items-center px-4 py-2 bg-stone-100 text-stone-700 font-mono text-sm">
              {filteredListings.length} {filteredListings.length === 1 ? 'vehicle' : 'vehicles'}
            </div>
          </div>
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((vehicle: any) => (
            <div
              key={vehicle.id}
              className="bg-white border border-stone-200 hover:border-blue-400 hover:shadow-lg transition-all"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <span className="text-6xl">🚚</span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 text-xs font-semibold ${
                    vehicle.status === "active" ? "bg-green-100 text-green-800" : "bg-stone-100 text-stone-600"
                  }`}>
                    {vehicle.status === "active" ? "Available" : "Booked"}
                  </span>
                  <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800">
                    {vehicle.metadata?.type || "Vehicle"}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-stone-900 mb-2">
                  {vehicle.title}
                </h3>

                <div className="mb-4">
                  <span className="text-2xl font-bold text-blue-700">
                    ${vehicle.price}
                  </span>
                  <span className="text-stone-600 text-sm">/day</span>
                </div>

                <div className="space-y-2 text-sm text-stone-600 mb-4">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-[80px]">Capacity:</span>
                    <span>{vehicle.metadata?.capacity || "N/A"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-[80px]">Location:</span>
                    <span>{vehicle.location}</span>
                  </div>
                  {vehicle.metadata?.features && (
                    <div className="flex items-start gap-2">
                      <span className="font-semibold min-w-[80px]">Features:</span>
                      <span>{vehicle.metadata.features}</span>
                    </div>
                  )}
                </div>

                <a
                  href={`/${countryCode}/marketplace/vehicles/${vehicle.id}`}
                  className="block bg-blue-700 text-white text-center py-3 font-semibold hover:bg-blue-800 transition-colors"
                >
                  View & Book
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VehiclesMarketplace
