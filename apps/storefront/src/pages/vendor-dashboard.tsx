import { useNavigate } from "@tanstack/react-router"
import { Route } from "@/routes/$countryCode/vendor-dashboard"
import { sdk } from "@/lib/utils/sdk"

export const VendorDashboardPage = () => {
  const navigate = useNavigate()
  const { vendor, listings = [] } = Route.useLoaderData() as { vendor: any, listings: any[] }

  const handleLogout = async () => {
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vendor_email')
    }
    await sdk.auth.logout()
    navigate({ to: '/$countryCode/vendor-login', params: { countryCode: 'ng' } })
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Loading...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-green-900 text-white py-8">
        <div className="content-container">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Vendor Dashboard</h1>
              <p className="text-green-100">Welcome back, {vendor.business_name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white text-green-900 font-semibold rounded-lg hover:bg-stone-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="content-container py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-stone-600 text-sm font-semibold mb-2">Account Type</h3>
            <p className="text-2xl font-bold text-stone-900 capitalize">{vendor.actor_type}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-stone-600 text-sm font-semibold mb-2">Status</h3>
            <p className="text-2xl font-bold text-green-700 capitalize">{vendor.verification_status}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-stone-600 text-sm font-semibold mb-2">Total Listings</h3>
            <p className="text-2xl font-bold text-stone-900">{listings.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-stone-900 mb-4">Account Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-stone-600 mb-1">Business Name</p>
              <p className="font-semibold">{vendor.business_name}</p>
            </div>
            <div>
              <p className="text-sm text-stone-600 mb-1">Email</p>
              <p className="font-semibold">{vendor.email}</p>
            </div>
            <div>
              <p className="text-sm text-stone-600 mb-1">Phone</p>
              <p className="font-semibold">{vendor.phone_number || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-stone-600 mb-1">Location</p>
              <p className="font-semibold">{vendor.location || "Not provided"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-stone-900">My Listings</h2>
            <button className="px-4 py-2 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors">
              Create New Listing
            </button>
          </div>
          
          {listings.length === 0 ? (
            <div className="text-center py-12 text-stone-600">
              <p className="text-lg mb-2">No listings yet</p>
              <p className="text-sm">Create your first listing to start selling on AgriMarket</p>
            </div>
          ) : (
            <div className="space-y-4">
              {listings.map((listing: any) => (
                <div key={listing.id} className="border border-stone-200 rounded-lg p-4 hover:border-green-400 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-stone-900">{listing.title}</h3>
                      <p className="text-stone-600 text-sm mt-1">{listing.listing_type}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      listing.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {listing.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VendorDashboardPage
