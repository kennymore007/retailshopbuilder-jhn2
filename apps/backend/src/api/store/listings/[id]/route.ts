import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  const { id } = req.params
  
  const { data: listings } = await query.graph({
    entity: "listing",
    fields: ["*", "vendor.*", "bookings.*"],
    filters: { id },
  })

  if (!listings || listings.length === 0) {
    return res.status(404).json({ message: "Listing not found" })
  }

  res.json({ listing: listings[0] })
}
