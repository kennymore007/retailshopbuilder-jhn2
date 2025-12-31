import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VENDOR_MODULE } from "../../../modules/vendor"
import type VendorModuleService from "../../../modules/vendor/service"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const vendorModuleService: VendorModuleService = req.scope.resolve(VENDOR_MODULE)
  
  const vendors = await vendorModuleService.listVendors()
  
  res.json({ vendors })
}
