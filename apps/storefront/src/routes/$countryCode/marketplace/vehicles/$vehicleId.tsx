import { createFileRoute } from '@tanstack/react-router'
import VehicleDetailPage from '@/pages/marketplace/vehicle-detail'
import { sdk } from '@/lib/utils/sdk'

export const Route = createFileRoute('/$countryCode/marketplace/vehicles/$vehicleId')({
  loader: async ({ params }) => {
    try {
      const query = sdk.store.product.list({
        fields: "*variants.*,*collection",
        id: [params.vehicleId],
        limit: 1,
      })

      const { products } = await query

      if (!products || products.length === 0) {
        return { listing: null }
      }

      return { listing: products[0] }
    } catch (error) {
      console.error('Error loading vehicle:', error)
      return { listing: null }
    }
  },
  component: VehicleDetailPage,
})
