import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createVendorWorkflow } from "../../../workflows/vendor/create-vendor"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  const { email } = req.query
  
  const filters: any = {}
  if (email) {
    filters.email = email
  }
  
  const { data: vendors } = await query.graph({
    entity: "vendor",
    fields: ["*"],
    filters,
  })

  res.json({ vendors })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { result } = await createVendorWorkflow(req.scope).run({
    input: req.body,
  })

  res.json({ vendor: result })
}
