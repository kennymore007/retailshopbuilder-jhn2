import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const listingModule = req.scope.resolve("listing")
  const vendorModule = req.scope.resolve("vendor")
  
  // Get auth identity from token
  const authIdentity = req.auth_context?.auth_identity
  
  if (!authIdentity) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  // Find vendor by email
  const vendors = await vendorModule.listVendors({
    email: authIdentity.entity_id
  })

  if (vendors.length === 0) {
    return res.status(404).json({ message: "Vendor not found" })
  }

  // Get vendor's listings
  const listings = await listingModule.listListings({
    vendor_id: vendors[0].id
  })

  res.json({ listings })
}
