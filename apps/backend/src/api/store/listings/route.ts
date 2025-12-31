import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createListingWorkflow } from "../../../workflows/vendor/create-listing"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  
  const { listing_type, location, status } = req.query
  
  const filters: any = {}
  if (listing_type) filters.listing_type = listing_type
  if (location) filters.location = location
  if (status) filters.status = status
  
  const { data: listings } = await query.graph({
    entity: "listing",
    fields: ["*", "vendor.*"],
    filters: Object.keys(filters).length > 0 ? filters : undefined,
  })

  res.json({ listings })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { result } = await createListingWorkflow(req.scope).run({
    input: req.body,
  })

  res.json({ listing: result })
}
