import { Link, useLocation, useLoaderData } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { useState, useMemo } from "react"

/**
 * Harvest Marketplace - Farm Produce
 * 
 * Buyers can browse verified harvest batches with:
 * - Crop type & grade (A/B)
 * - Farm GPS location
 * - Harvest date
 * - Traceability data
 * - Farmer details
 */

type Listing = {
  id: string
  title: string
  listing_type: string
  price_amount: number
  price_currency: string
  quantity?: number
  unit?: string
  location?: string
  metadata?: any
}

const placeholderListings = [
  {
    id: "1",
    title: "Premium Grade A Tomatoes",
    cropType: "Tomatoes",
    grade: "A",
    quantity: 500,
    unit: "kg",
    pricePerUnit: 2.50,
    currency: "USD",
    harvestDate: "2025-01-15",
    farmerName: "John Kamau",
    farmLocation: "Kiambu County",
    gps: { lat: -1.1715, lng: 36.6558 },
    status: "Ready for pickup",
    verifiedBy: "Agent #4523",
    images: [],
  },
  {
    id: "2",
    title: "Fresh Grade A Maize",
    cropType: "Maize",
    grade: "A",
    quantity: 1200,
    unit: "kg",
    pricePerUnit: 0.80,
    currency: "USD",
    harvestDate: "2025-01-10",
    farmerName: "Mary Wanjiku",
    farmLocation: "Nakuru County",
    gps: { lat: -0.3031, lng: 36.0800 },
    status: "Available",
    verifiedBy: "Agent #3421",
    images: [],
  },
  {
    id: "3",
    title: "Organic Grade B Cabbage",
    cropType: "Cabbage",
    grade: "B",
    quantity: 300,
    unit: "kg",
    pricePerUnit: 1.20,
    currency: "USD",
    harvestDate: "2025-01-18",
    farmerName: "Peter Ochieng",
    farmLocation: "Kisumu County",
    gps: { lat: -0.0917, lng: 34.7680 },
    status: "Available",
    verifiedBy: "Agent #5678",
    images: [],
  },
]

const HarvestMarketplace = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const { listings: rawListings } = useLoaderData({ from: '/$countryCode/marketplace/harvest' })
  
  // Transform API data to component format
  const harvestListings = rawListings.map((listing: Listing) => ({
    id: listing.id,
    title: listing.title,
    cropType: listing.metadata?.crop_type || 'Unknown',
    grade: listing.metadata?.grade || 'N/A',
    quantity: listing.quantity || 0,
    unit: listing.unit || 'kg',
    pricePerUnit: (listing.price_amount / 100) / (listing.quantity || 1),
    currency: listing.price_currency?.toUpperCase() || 'KES',
    harvestDate: listing.metadata?.harvest_date || new Date().toISOString(),
    farmerName: listing.metadata?.farmer_name || 'Unknown Farmer',
    farmLocation: listing.location || 'Unknown Location',
    gps: { lat: 0, lng: 0 },
    status: listing.metadata?.status || 'Available',
    verifiedBy: listing.metadata?.verified_by || 'Agent',
    images: [],
  }))
  
  // Filter state
  const [cropFilter, setCropFilter] = useState("all")
  const [gradeFilter, setGradeFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [sortBy, setSortBy] = useState("latest")
  
  // Filtered and sorted listings
  const filteredListings = useMemo(() => {
    let filtered = [...harvestListings]
    
    // Apply filters
    if (cropFilter !== "all") {
      filtered = filtered.filter(l => l.cropType.toLowerCase() === cropFilter.toLowerCase())
    }
    if (gradeFilter !== "all") {
      filtered = filtered.filter(l => l.grade === gradeFilter)
    }
    if (locationFilter !== "all") {
      filtered = filtered.filter(l => l.farmLocation === locationFilter)
    }
    
    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.pricePerUnit - b.pricePerUnit)
        break
      case "price-high":
        filtered.sort((a, b) => b.pricePerUnit - a.pricePerUnit)
        break
      case "quantity":
        filtered.sort((a, b) => b.quantity - a.quantity)
        break
      case "latest":
      default:
        filtered.sort((a, b) => new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime())
    }
    
    return filtered
  }, [cropFilter, gradeFilter, locationFilter, sortBy])

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-green-900 text-white py-12">
        <div className="content-container">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-5xl">🌾</span>
            <h1 className="text-4xl font-bold">Harvest Batches</h1>
          </div>
          <p className="text-green-100 text-lg max-w-2xl">
            Browse verified farm produce with GPS tracking and full traceability. 
            Every harvest batch is verified by certified agents on-site.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-stone-200 py-6">
        <div className="content-container">
          <div className="flex flex-wrap gap-4">
            <select 
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="px-4 py-2 border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Crops</option>
              <option value="tomatoes">Tomatoes</option>
              <option value="maize">Maize</option>
              <option value="cabbage">Cabbage</option>
              <option value="potatoes">Potatoes</option>
            </select>
            
            <select 
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-4 py-2 border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Grades</option>
              <option value="A">Grade A</option>
              <option value="B">Grade B</option>
            </select>
            
            <select 
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-4 py-2 border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Locations</option>
              <option value="Lagos">Lagos</option>
              <option value="Abuja">Abuja</option>
              <option value="Ibadan">Ibadan</option>
              <option value="Port Harcourt">Port Harcourt</option>
            </select>

            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="latest">Sort by: Latest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="quantity">Quantity: High to Low</option>
            </select>
            
            {/* Results count */}
            <div className="flex items-center px-4 py-2 bg-stone-100 text-stone-700 font-mono text-sm">
              {filteredListings.length} {filteredListings.length === 1 ? 'listing' : 'listings'}
            </div>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="content-container py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white border border-stone-200 hover:border-green-400 hover:shadow-lg transition-all"
            >
              {/* Image placeholder */}
              <div className="aspect-[4/3] bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                <span className="text-6xl">{listing.cropType === "Tomatoes" ? "🍅" : listing.cropType === "Maize" ? "🌽" : "🥬"}</span>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Status badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 text-xs font-semibold ${
                    listing.status === "Available" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {listing.status}
                  </span>
                  <span className="px-2 py-1 text-xs font-semibold bg-stone-100 text-stone-700">
                    Grade {listing.grade}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-stone-900 mb-2">
                  {listing.title}
                </h3>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-2xl font-bold text-green-700">
                    ₦{listing.pricePerUnit.toFixed(2)}
                  </span>
                  <span className="text-stone-600 text-sm">/{listing.unit}</span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-stone-600 mb-4">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-[80px]">Quantity:</span>
                    <span>{listing.quantity} {listing.unit}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-[80px]">Harvested:</span>
                    <span>{new Date(listing.harvestDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-[80px]">Farmer:</span>
                    <span>{listing.farmerName}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-[80px]">Location:</span>
                    <span>{listing.farmLocation}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-[80px]">Verified:</span>
                    <span className="text-green-600">✓ {listing.verifiedBy}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <a
                    href={`/${countryCode}/marketplace/harvest/${listing.id}`}
                    className="flex-1 bg-green-700 text-white text-center py-3 font-semibold hover:bg-green-800 transition-colors"
                  >
                    View Details
                  </a>
                  <button className="px-4 py-3 border-2 border-green-700 text-green-700 hover:bg-green-50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state or pagination would go here */}
        {filteredListings.length === 0 && (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">🌾</span>
            <h3 className="text-xl font-bold text-stone-900 mb-2">
              No harvest batches found
            </h3>
            <p className="text-stone-600 mb-4">
              Try adjusting your filters or check back later for new listings.
            </p>
            <button 
              onClick={() => {
                setCropFilter("all")
                setGradeFilter("all")
                setLocationFilter("all")
                setSortBy("latest")
              }}
              className="px-6 py-2 bg-green-700 text-white font-semibold hover:bg-green-800 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HarvestMarketplace
