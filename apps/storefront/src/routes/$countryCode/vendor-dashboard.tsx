import { createFileRoute, redirect } from '@tanstack/react-router'
import VendorDashboardPage from '@/pages/vendor-dashboard'
import { sdk } from '@/lib/utils/sdk'

export const Route = createFileRoute('/$countryCode/vendor-dashboard')({
  beforeLoad: async () => {
    // Check if vendor email is stored (logged in)
    if (typeof window !== 'undefined') {
      const vendorEmail = localStorage.getItem('vendor_email')
      if (!vendorEmail) {
        throw redirect({ to: '/$countryCode/vendor-login', params: { countryCode: 'ng' } })
      }
    }
  },
  loader: async () => {
    try {
      // Get vendor email from localStorage
      const vendorEmail = typeof window !== 'undefined' ? localStorage.getItem('vendor_email') : null
      
      if (!vendorEmail) {
        return { vendor: null, listings: [] }
      }

      // Fetch vendor profile by email
      const response = await sdk.client.fetch<{ vendors: any[] }>(`/store/vendors?email=${vendorEmail}`)
      
      if (!response.vendors || response.vendors.length === 0) {
        return { vendor: null, listings: [] }
      }

      const vendor = response.vendors[0]

      // Fetch vendor's listings
      const listingsResponse = await sdk.client.fetch<{ listings: any[] }>(`/store/listings?vendor_id=${vendor.id}`)
      
      return { vendor, listings: listingsResponse.listings || [] }
    } catch (error) {
      console.error('Error loading vendor data:', error)
      return { vendor: null, listings: [] }
    }
  },
  component: VendorDashboardPage,
})
