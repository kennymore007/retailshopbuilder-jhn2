import { useState, useEffect } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { sdk } from "@/lib/utils/sdk";
import { Plus, XMark } from "@medusajs/icons";

interface VendorSession {
  id: string;
  name: string;
  email: string;
  actor_type: string;
  phone: string;
}

interface Listing {
  id: string;
  title: string;
  listing_type: string;
  price: number;
  quantity?: number;
  location: string;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const { countryCode } = useParams({ strict: false });
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<VendorSession | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sessionData = localStorage.getItem("vendor_session");
    if (!sessionData) {
      navigate({ to: `/${countryCode}/login` });
      return;
    }

    const session = JSON.parse(sessionData);
    setVendor(session);

    // Fetch vendor's listings
    const fetchListings = async () => {
      try {
        const response = await sdk.client.fetch<{ listings: Listing[] }>("/store/listings", {
          method: "GET",
        });

        // Filter listings by vendor ID
        const vendorListings = response.listings.filter((l: any) => l.vendor_id === session.id);
        setListings(vendorListings);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [countryCode, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("vendor_session");
    navigate({ to: `/${countryCode}/login` });
  };

  const getActorTypeIcon = (actorType: string) => {
    const iconClass = "w-5 h-5";
    const iconMap: Record<string, string> = {
      logistics_provider: "🚚",
      gig_worker: "👤",
      storage_operator: "🏢",
      equipment_owner: "🔧",
      farmer: "🌾",
      buyer: "🛒",
      agent: "📋"
    };
    return <span className={iconClass}>{iconMap[actorType] || "👤"}</span>;
  };

  const getActorTypeLabel = (actorType: string) => {
    return actorType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getListingTypeLabel = (listingType: string) => {
    return listingType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!vendor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                {getActorTypeIcon(vendor.actor_type)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{vendor.name}</h1>
                <p className="text-sm text-gray-600">{getActorTypeLabel(vendor.actor_type)}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <XMark className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Vendor Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 text-gray-600">
              <span className="text-gray-400">📧</span>
              <span>{vendor.email}</span>
            </div>
            {vendor.phone && (
              <div className="flex items-center space-x-3 text-gray-600">
                <span className="text-gray-400">📱</span>
                <span>{vendor.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Listings Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">My Listings</h2>
              <p className="text-sm text-gray-600 mt-1">Manage your marketplace offerings</p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Listing</span>
            </button>
          </div>

          <div className="p-6">
            {listings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
                <p className="text-gray-600 mb-6">Start by creating your first marketplace listing</p>
                <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Create Your First Listing
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div key={listing.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          listing.status === "available"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {listing.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{getListingTypeLabel(listing.listing_type)}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <span className="mr-2">📍</span>
                        {listing.location}
                      </div>
                      <div className="text-lg font-bold text-green-600">{formatPrice(listing.price)}</div>
                      {listing.quantity && (
                        <div className="text-sm text-gray-600">Quantity: {listing.quantity}</div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      Listed {new Date(listing.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
