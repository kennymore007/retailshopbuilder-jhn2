import { createFileRoute } from "@tanstack/react-router"
import StorageMarketplace from "@/pages/marketplace/storage"

export const Route = createFileRoute("/$countryCode/marketplace/storage")({
  component: StorageMarketplace,
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
