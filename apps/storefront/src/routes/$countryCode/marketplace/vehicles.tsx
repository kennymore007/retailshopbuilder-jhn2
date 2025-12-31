import { createFileRoute } from "@tanstack/react-router"
import VehiclesMarketplace from "@/pages/marketplace/vehicles"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$countryCode/marketplace/vehicles")({
  component: VehiclesMarketplace,
  loader: async () => {
    const response: any = await sdk.client.fetch("/store/listings?listing_type=vehicle")
    return { listings: response.listings || [] }
  },
  head: () => ({
    meta: [
      {
        title: "Vehicle Rentals - Rent Transport Vehicles | AgriMarket",
      },
      {
        name: "description",
        content: "Rent vehicles for agricultural transport and logistics. Browse trucks, vans, and pickups from verified gig workers.",
      },
    ],
  }),
})
