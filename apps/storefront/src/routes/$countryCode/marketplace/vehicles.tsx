import { createFileRoute } from "@tanstack/react-router"
import VehiclesMarketplace from "@/pages/marketplace/vehicles"

export const Route = createFileRoute("/$countryCode/marketplace/vehicles")({
  component: VehiclesMarketplace,
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
