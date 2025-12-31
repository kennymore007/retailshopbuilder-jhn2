import { createFileRoute } from "@tanstack/react-router"
import HarvestMarketplace from "@/pages/marketplace/harvest"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$countryCode/marketplace/harvest")({
  component: HarvestMarketplace,
  loader: async () => {
    const data = await sdk.client.fetch(`/store/listings?listing_type=harvest`, {
      method: 'GET',
    }) as { listings: any[] }
    return { listings: data.listings || [] }
  },
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
