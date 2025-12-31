import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import VendorModuleService from "../../../../../modules/vendor/service"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const vendorModuleService: VendorModuleService = 
    req.scope.resolve("vendorModuleService")
  const { id } = req.params

  const [vendor] = await vendorModuleService.updateVendors({
    id,
    verification_status: "rejected",
    is_active: false,
  })

  res.json({ vendor })
}
