import { useLoaderData } from "@tanstack/react-router";
import { Plus } from "@medusajs/icons";

interface Listing {
  id: string;
  title: string;
  description: string;
  listing_type: string;
  price_per_unit: number;
  unit_of_measure: string;
  quantity_available: number;
  location: string;
  metadata?: {
    crop_type?: string;
    grade?: string;
    harvest_date?: string;
    storage_conditions?: string;
    certifications?: string[];
  };
  vendor: {
    id: string;
    business_name: string;
    actor_type: string;
    location: string;
    phone_number?: string;
  };
  created_at: string;
}

const HarvestDetail = () => {
  const { listing } = useLoaderData({ from: "/$countryCode/marketplace/harvest/$listingId" }) as { listing: Listing };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-sm mb-2">
              <a href="/ng/marketplace/harvest" className="hover:underline">Harvest Marketplace</a>
              <span className="mx-2">/</span>
              <span>{listing.title}</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">{listing.title}</h1>
            <div className="flex items-center gap-4 text-green-100">
              <span className="px-3 py-1 bg-green-800/50 rounded-full text-sm">
                {listing.metadata?.crop_type || 'Harvest'}
              </span>
              {listing.metadata?.grade && (
                <span className="px-3 py-1 bg-green-800/50 rounded-full text-sm">
                  Grade {listing.metadata.grade}
                </span>
              )}
              <span>{listing.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pricing Card */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-3xl font-bold text-green-600">
                      {formatPrice(listing.price_per_unit)}
                      <span className="text-lg text-gray-600 font-normal">/{listing.unit_of_measure}</span>
                    </div>
                    <div className="text-gray-600 mt-2">
                      Available: <span className="font-semibold">{listing.quantity_available} {listing.unit_of_measure}</span>
                    </div>
                  </div>
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Request Quote
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">{listing.description}</p>
              </div>

              {/* Product Details */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Product Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  {listing.metadata?.crop_type && (
                    <div>
                      <div className="text-sm text-gray-600">Crop Type</div>
                      <div className="font-semibold">{listing.metadata.crop_type}</div>
                    </div>
                  )}
                  {listing.metadata?.grade && (
                    <div>
                      <div className="text-sm text-gray-600">Grade</div>
                      <div className="font-semibold">Grade {listing.metadata.grade}</div>
                    </div>
                  )}
                  {listing.metadata?.harvest_date && (
                    <div>
                      <div className="text-sm text-gray-600">Harvest Date</div>
                      <div className="font-semibold">{formatDate(listing.metadata.harvest_date)}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="font-semibold">{listing.location}</div>
                  </div>
                  {listing.metadata?.storage_conditions && (
                    <div className="col-span-2">
                      <div className="text-sm text-gray-600">Storage Conditions</div>
                      <div className="font-semibold">{listing.metadata.storage_conditions}</div>
                    </div>
                  )}
                </div>

                {listing.metadata?.certifications && listing.metadata.certifications.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm text-gray-600 mb-2">Certifications</div>
                    <div className="flex flex-wrap gap-2">
                      {listing.metadata.certifications.map((cert, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Vendor Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold mb-4">Vendor Information</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Business Name</div>
                    <div className="font-semibold">{listing.vendor.business_name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Type</div>
                    <div className="font-semibold capitalize">{listing.vendor.actor_type.replace('_', ' ')}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="font-semibold">{listing.vendor.location}</div>
                  </div>
                  {listing.vendor.phone_number && (
                    <div>
                      <div className="text-sm text-gray-600">Contact</div>
                      <div className="font-semibold">{listing.vendor.phone_number}</div>
                    </div>
                  )}
                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 mt-4">
                    Contact Vendor
                  </button>
                </div>
              </div>

              {/* Safety Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-blue-900">Safety Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Inspect products before payment</li>
                  <li>• Use secure payment methods</li>
                  <li>• Verify quality certificates</li>
                  <li>• Check weight measurements</li>
                </ul>
              </div>

              {/* Posted Date */}
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                Posted on {formatDate(listing.created_at)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HarvestDetail;
