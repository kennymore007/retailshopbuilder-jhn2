import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import VendorModuleService from "../../../modules/vendor/service"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const vendorModuleService: VendorModuleService = req.scope.resolve("vendorModuleService")

  const { limit = 20, offset = 0, status } = req.query

  const filters: any = {}
  if (status) {
    filters.verification_status = status
  }

  const [vendors, count] = await vendorModuleService.listAndCountVendors(filters, {
    skip: Number(offset),
    take: Number(limit),
    order: { created_at: "DESC" },
  })

  res.json({
    vendors,
    count,
    limit: Number(limit),
    offset: Number(offset),
  })
}
