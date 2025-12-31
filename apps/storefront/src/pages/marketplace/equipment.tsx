import { Link, useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { useState, useMemo } from "react"
import { Route } from "@/routes/$countryCode/marketplace/equipment"

const EquipmentMarketplace = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const { listings } = Route.useLoaderData()
  
  const [typeFilter, setTypeFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [sortBy, setSortBy] = useState("price-low")
  
  const filteredListings = useMemo(() => {
    let filtered = [...listings]
    if (typeFilter !== "all") filtered = filtered.filter(e => e.metadata?.equipment_type === typeFilter)
    if (locationFilter !== "all") filtered = filtered.filter(e => e.location === locationFilter)
    
    switch (sortBy) {
      case "price-high": filtered.sort((a, b) => b.dailyRate - a.dailyRate); break
      default: filtered.sort((a, b) => a.dailyRate - b.dailyRate)
    }
    return filtered
  }, [typeFilter, locationFilter, sortBy])

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-orange-900 text-white py-12">
        <div className="content-container">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-5xl">🚜</span>
            <h1 className="text-4xl font-bold">Equipment Rentals</h1>
          </div>
          <p className="text-orange-100 text-lg max-w-2xl">
            Rent farm equipment and machinery. Access tractors, harvesters, and agricultural tools.
          </p>
        </div>
      </div>

      <div className="bg-white border-b border-stone-200 py-6">
        <div className="content-container">
          <div className="flex flex-wrap gap-4">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-4 py-2 border border-stone-300 bg-white">
              <option value="all">All Equipment Types</option>
              <option value="Tractor">Tractor</option>
              <option value="Tiller">Tiller</option>
              <option value="Harvester">Harvester</option>
              <option value="Planter">Planter</option>
            </select>
            <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="px-4 py-2 border border-stone-300 bg-white">
              <option value="all">All Locations</option>
              <option value="Lagos">Lagos</option>
              <option value="Abuja">Abuja</option>
              <option value="Ibadan">Ibadan</option>
              <option value="Port Harcourt">Port Harcourt</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 border border-stone-300 bg-white">
              <option value="price-low">Sort by: Daily Rate (Low)</option>
              <option value="price-high">Daily Rate (High)</option>
            </select>
            <div className="flex items-center px-4 py-2 bg-stone-100 text-stone-700 font-mono text-sm">
              {filteredListings.length} {filteredListings.length === 1 ? 'item' : 'items'}
            </div>
          </div>
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((equipment) => (
            <div
              key={equipment.id}
              className="bg-white border border-stone-200 hover:border-orange-400 hover:shadow-lg transition-all"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
                <span className="text-6xl">🚜</span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 text-xs font-semibold ${
                    equipment.metadata?.available ? "bg-green-100 text-green-800" : "bg-stone-100 text-stone-600"
                  }`}>
                    {equipment.metadata?.available ? "Available" : "Rented"}
                  </span>
                  <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-800">
                    {equipment.metadata?.equipment_type || "Equipment"}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-stone-900 mb-2">
                  {equipment.title}
                </h3>

                <div className="mb-4">
                  <span className="text-2xl font-bold text-orange-700">
                    ₦{(equipment.price_amount / 100).toFixed(2)}
                  </span>
                  <span className="text-stone-600 text-sm">/day</span>
                  {equipment.metadata?.weekly_rate && (
                    <span className="text-stone-400 text-sm ml-2">
                      (₦{(equipment.metadata.weekly_rate / 100).toFixed(2)}/week)
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm text-stone-600 mb-4">
                  {equipment.metadata?.brand && (
                    <div className="flex items-start gap-2">
                      <span className="font-semibold min-w-[80px]">Brand:</span>
                      <span>{equipment.metadata.brand}</span>
                    </div>
                  )}
                  {equipment.metadata?.condition && (
                    <div className="flex items-start gap-2">
                      <span className="font-semibold min-w-[80px]">Condition:</span>
                      <span>{equipment.metadata.condition}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-[80px]">Location:</span>
                    <span>{equipment.location}</span>
                  </div>
                  {equipment.metadata?.features && (
                    <div className="flex items-start gap-2">
                      <span className="font-semibold min-w-[80px]">Features:</span>
                      <span>{equipment.metadata.features.join(", ")}</span>
                    </div>
                  )}
                </div>

                <a
                  href={`/${countryCode}/marketplace/equipment/${equipment.id}`}
                  className="block bg-orange-700 text-white text-center py-3 font-semibold hover:bg-orange-800 transition-colors"
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

export default EquipmentMarketplace
