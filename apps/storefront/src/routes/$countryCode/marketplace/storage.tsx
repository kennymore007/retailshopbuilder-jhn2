import { createFileRoute } from "@tanstack/react-router"
import StorageMarketplace from "@/pages/marketplace/storage"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$countryCode/marketplace/storage")({
  component: StorageMarketplace,
  loader: async () => {
    const response: any = await sdk.client.fetch("/store/listings?listing_type=storage")
    return { listings: response.listings || [] }
  },
  head: () => ({
    meta: [
      {
        title: "Storage Space Rentals - Warehouse & Cold Storage | AgriMarket",
      },
      {
        name: "description",
        content: "Book warehouse and cold storage facilities for agricultural produce. Verified storage operators with capacity management.",
      },
    ],
  }),
})
