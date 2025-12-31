import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createBookingWorkflow } from "../../../workflows/vendor/create-booking"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  
  const { customer_id, listing_id, status } = req.query
  
  const filters: any = {}
  if (customer_id) filters.customer_id = customer_id
  if (listing_id) filters.listing_id = listing_id
  if (status) filters.status = status
  
  const { data: bookings } = await query.graph({
    entity: "booking",
    fields: ["*", "listing.*"],
    filters: Object.keys(filters).length > 0 ? filters : undefined,
  })

  res.json({ bookings })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { result } = await createBookingWorkflow(req.scope).run({
    input: req.body,
  })

  res.json({ booking: result })
}
