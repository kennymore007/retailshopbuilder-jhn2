import { createFileRoute } from "@tanstack/react-router"
import EquipmentMarketplace from "@/pages/marketplace/equipment"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$countryCode/marketplace/equipment")({
  component: EquipmentMarketplace,
  loader: async () => {
    const response: any = await sdk.client.fetch("/store/listings?listing_type=equipment")
    return { listings: response.listings || [] }
  },
  head: () => ({
    meta: [
      {
        title: "Equipment Rentals - Farm Machinery & Tools | AgriMarket",
      },
      {
        name: "description",
        content: "Rent farm equipment and machinery. Browse tractors, harvesters, tillers, and agricultural tools from verified owners.",
      },
    ],
  }),
})
