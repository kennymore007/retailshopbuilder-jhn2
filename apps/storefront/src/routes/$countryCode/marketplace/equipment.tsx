import { createFileRoute } from "@tanstack/react-router"
import EquipmentMarketplace from "@/pages/marketplace/equipment"

export const Route = createFileRoute("/$countryCode/marketplace/equipment")({
  component: EquipmentMarketplace,
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
