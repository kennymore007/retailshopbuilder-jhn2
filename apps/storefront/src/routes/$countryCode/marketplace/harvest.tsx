import { createFileRoute } from "@tanstack/react-router"
import HarvestMarketplace from "@/pages/marketplace/harvest"

export const Route = createFileRoute("/$countryCode/marketplace/harvest")({
  component: HarvestMarketplace,
  head: () => ({
    meta: [
      {
        title: "Harvest Batches - Buy Farm Produce | AgriMarket",
      },
      {
        name: "description",
        content:
          "Browse verified harvest batches directly from farmers. GPS-tracked produce with full traceability from farm to delivery.",
      },
    ],
  }),
})
