import { Link, useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { useState, useMemo } from "react"

const vehicleListings = [
  {
    id: "1",
    title: "Isuzu NQR Truck - 3 Ton Capacity",
    type: "Truck",
    capacity: "3 Tons",
    make: "Isuzu",
    model: "NQR",
    year: 2020,
    plateNumber: "KCA 123A",
    dailyRate: 50,
    hourlyRate: 8,
    currency: "USD",
    location: "Nairobi",
    ownerName: "James Mwangi",
    available: true,
    features: ["GPS Tracking", "Refrigerated", "Tail Lift"],
  },
  {
    id: "2",
    title: "Toyota Hilux Pickup - 1 Ton",
    type: "Pickup",
    capacity: "1 Ton",
    make: "Toyota",
    model: "Hilux",
    year: 2019,
    plateNumber: "KBZ 456B",
    dailyRate: 35,
    hourlyRate: 6,
    currency: "USD",
    location: "Kiambu",
    ownerName: "Sarah Njeri",
    available: true,
    features: ["4WD", "GPS Tracking"],
  },
]

const VehiclesMarketplace = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  
  const [typeFilter, setTypeFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [sortBy, setSortBy] = useState("price-low")
  
  const filteredListings = useMemo(() => {
    let filtered = [...vehicleListings]
    if (typeFilter !== "all") filtered = filtered.filter(v => v.type === typeFilter)
    if (locationFilter !== "all") filtered = filtered.filter(v => v.location === locationFilter)
    
    switch (sortBy) {
      case "price-high": filtered.sort((a, b) => b.dailyRate - a.dailyRate); break
      case "capacity": filtered.sort((a, b) => parseInt(b.capacity) - parseInt(a.capacity)); break
      default: filtered.sort((a, b) => a.dailyRate - b.dailyRate)
    }
    return filtered
  }, [typeFilter, locationFilter, sortBy])

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
          {filteredListings.map((vehicle) => (
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
                    vehicle.available ? "bg-green-100 text-green-800" : "bg-stone-100 text-stone-600"
                  }`}>
                    {vehicle.available ? "Available" : "Booked"}
                  </span>
                  <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800">
                    {vehicle.type}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-stone-900 mb-2">
                  {vehicle.title}
                </h3>

                <div className="mb-4">
                  <span className="text-2xl font-bold text-blue-700">
                    ${vehicle.dailyRate}
                  </span>
                  <span className="text-stone-600 text-sm">/day</span>
                  <span className="text-stone-400 text-sm ml-2">
                    (${vehicle.hourlyRate}/hr)
                  </span>
                </div>

                <div className="space-y-2 text-sm text-stone-600 mb-4">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-[80px]">Capacity:</span>
                    <span>{vehicle.capacity}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-[80px]">Location:</span>
                    <span>{vehicle.location}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-[80px]">Features:</span>
                    <span>{vehicle.features.join(", ")}</span>
                  </div>
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
