import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  const { id } = req.params
  
  const { data: vendors } = await query.graph({
    entity: "vendor",
    fields: ["*", "listings.*"],
    filters: { id },
  })

  if (!vendors || vendors.length === 0) {
    return res.status(404).json({ message: "Vendor not found" })
  }

  res.json({ vendor: vendors[0] })
}
