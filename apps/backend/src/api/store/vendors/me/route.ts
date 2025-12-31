import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const vendorModule = req.scope.resolve("vendor")
  
  // Get auth identity from token
  const authIdentity = req.auth_context?.auth_identity
  
  if (!authIdentity) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  // Find vendor by email (entity_id from auth)
  const vendors = await vendorModule.listVendors({
    email: authIdentity.entity_id
  })

  if (vendors.length === 0) {
    return res.status(404).json({ message: "Vendor not found" })
  }

  res.json({ vendor: vendors[0] })
}
