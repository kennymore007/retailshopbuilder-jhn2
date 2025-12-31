import { createFileRoute, redirect } from '@tanstack/react-router'
import VendorDashboardPage from '@/pages/vendor-dashboard'
import { sdk } from '@/lib/utils/sdk'

export const Route = createFileRoute('/$countryCode/vendor-dashboard')({
  beforeLoad: async () => {
    try {
      // Check if vendor is authenticated
      const response = await sdk.client.fetch('/store/vendors/me', {
        method: 'GET',
      })
      
      if (!response) {
        throw new Error('Not authenticated')
      }
    } catch (error) {
      // Redirect to login if not authenticated
      throw redirect({ to: '/$countryCode/vendor-login', params: { countryCode: 'ng' } })
    }
  },
  loader: async () => {
    try {
      // Fetch vendor data
      const vendor = await sdk.client.fetch('/store/vendors/me', {
        method: 'GET',
      })
      
      // Fetch vendor's listings
      const listings = await sdk.client.fetch('/store/listings/my-listings', {
        method: 'GET',
      })
      
      return { vendor, listings: listings || [] }
    } catch (error) {
      console.error('Error loading vendor data:', error)
      return { vendor: null, listings: [] }
    }
  },
  component: VendorDashboardPage,
})
