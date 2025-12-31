import { createFileRoute } from "@tanstack/react-router";
import { sdk } from "@/lib/utils/sdk";
import HarvestDetail from "@/pages/marketplace/harvest-detail";

export const Route = createFileRoute("/$countryCode/marketplace/harvest/$listingId")({
  loader: async ({ params }) => {
    const { listingId } = params;
    
    const response = await sdk.client.fetch(`/store/listings/${listingId}`) as Response;
    const data = await response.json() as { listing: any };
    
    return { listing: data.listing };
  },
  component: HarvestDetail,
});
