import { createFileRoute } from '@tanstack/react-router'
import VehicleDetailPage from '@/pages/marketplace/vehicle-detail'
import { sdk } from '@/lib/utils/sdk'

export const Route = createFileRoute('/$countryCode/marketplace/vehicles/$vehicleId')({
  loader: async ({ params }) => {
    try {
      const response: any = await sdk.client.fetch(`/store/listings/${params.vehicleId}`)
      
      if (!response || !response.listing) {
        return { listing: null }
      }

      return { listing: response.listing }
    } catch (error) {
      console.error('Error loading vehicle:', error)
      return { listing: null }
    }
  },
  component: VehicleDetailPage,
})
