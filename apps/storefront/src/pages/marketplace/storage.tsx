import { Link, useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { useState, useMemo } from "react"

const storageListings = [
  {
    id: "1",
    title: "Cold Storage Facility - 500 Cubic Meters",
    type: "Cold Storage",
    capacity: "500 m³",
    temperature: "-5°C to 10°C",
    dimensions: "20m x 10m x 2.5m",
    monthlyRate: 800,
    dailyRate: 30,
    currency: "USD",
    location: "Nairobi Industrial Area",
    operatorName: "ColdChain Kenya Ltd",
    available: true,
    features: ["24/7 Security", "Temperature Control", "Loading Bay"],
  },
  {
    id: "2",
    title: "Dry Warehouse - 1000 Cubic Meters",
    type: "Dry Warehouse",
    capacity: "1000 m³",
    temperature: "Ambient",
    dimensions: "40m x 10m x 2.5m",
    monthlyRate: 500,
    dailyRate: 20,
    currency: "USD",
    location: "Thika",
    operatorName: "AgriStore Solutions",
    available: true,
    features: ["24/7 Security", "Pest Control", "Ventilation"],
  },
]

const StorageMarketplace = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  
  const [typeFilter, setTypeFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [sortBy, setSortBy] = useState("price-low")
  
  const filteredListings = useMemo(() => {
    let filtered = [...storageListings]
    if (typeFilter !== "all") filtered = filtered.filter(s => s.type === typeFilter)
    if (locationFilter !== "all") filtered = filtered.filter(s => s.location === locationFilter)
    
    switch (sortBy) {
      case "price-high": filtered.sort((a, b) => b.dailyRate - a.dailyRate); break
      case "capacity": filtered.sort((a, b) => parseInt(b.capacity) - parseInt(a.capacity)); break
      default: filtered.sort((a, b) => a.dailyRate - b.dailyRate)
    }
    return filtered
  }, [typeFilter, locationFilter, sortBy])

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-amber-900 text-white py-12">
        <div className="content-container">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-5xl">🏭</span>
            <h1 className="text-4xl font-bold">Storage Space Rentals</h1>
          </div>
          <p className="text-amber-100 text-lg max-w-2xl">
            Book warehouse and cold storage facilities with 24/7 security and inventory management.
          </p>
        </div>
      </div>

      <div className="bg-white border-b border-stone-200 py-6">
        <div className="content-container">
          <div className="flex flex-wrap gap-4">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-4 py-2 border border-stone-300 bg-white">
              <option value="all">All Storage Types</option>
              <option value="Cold Storage">Cold Storage</option>
              <option value="Dry Warehouse">Dry Warehouse</option>
              <option value="Refrigerated">Refrigerated</option>
            </select>
            <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="px-4 py-2 border border-stone-300 bg-white">
              <option value="all">All Locations</option>
              <option value="Nairobi">Nairobi</option>
              <option value="Thika">Thika</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 border border-stone-300 bg-white">
              <option value="price-low">Sort by: Daily Rate (Low)</option>
              <option value="price-high">Daily Rate (High)</option>
              <option value="capacity">Capacity</option>
            </select>
            <div className="flex items-center px-4 py-2 bg-stone-100 text-stone-700 font-mono text-sm">
              {filteredListings.length} {filteredListings.length === 1 ? 'facility' : 'facilities'}
            </div>
          </div>
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((storage) => (
            <div
              key={storage.id}
              className="bg-white border border-stone-200 hover:border-amber-400 hover:shadow-lg transition-all"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
                <span className="text-6xl">🏭</span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 text-xs font-semibold ${
                    storage.available ? "bg-green-100 text-green-800" : "bg-stone-100 text-stone-600"
                  }`}>
                    {storage.available ? "Available" : "Full"}
                  </span>
                  <span className="px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-800">
                    {storage.type}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-stone-900 mb-2">
                  {storage.title}
                </h3>

                <div className="mb-4">
                  <span className="text-2xl font-bold text-amber-700">
                    ${storage.monthlyRate}
                  </span>
                  <span className="text-stone-600 text-sm">/month</span>
                </div>

                <div className="space-y-2 text-sm text-stone-600 mb-4">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-[100px]">Capacity:</span>
                    <span>{storage.capacity}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-[100px]">Temperature:</span>
                    <span>{storage.temperature}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-[100px]">Location:</span>
                    <span>{storage.location}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-[100px]">Features:</span>
                    <span>{storage.features.join(", ")}</span>
                  </div>
                </div>

                <a
                  href={`/${countryCode}/marketplace/storage/${storage.id}`}
                  className="block bg-amber-700 text-white text-center py-3 font-semibold hover:bg-amber-800 transition-colors"
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

export default StorageMarketplace
