import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query")
  
  const { data: vendors } = await query.graph({
    entity: "vendor",
    fields: ["id", "name", "email", "status", "created_at"],
  })
  
  res.json({ vendors })
}
