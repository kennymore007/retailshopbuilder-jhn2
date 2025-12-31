import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import VendorModuleService from "../../../../modules/vendor/service"

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve("query")
  const { id } = req.params

  const { data: [vendor] } = await query.graph({
    entity: "vendor",
    fields: [
      "id",
      "business_name",
      "email",
      "phone_number",
      "actor_type",
      "location",
      "verification_status",
      "is_active",
      "metadata",
      "created_at",
      "updated_at",
    ],
    filters: { id },
  })

  if (!vendor) {
    return res.status(404).json({ message: "Vendor not found" })
  }

  res.json({ vendor })
}

export async function PUT(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const vendorModuleService: VendorModuleService = 
    req.scope.resolve("vendorModuleService")
  const { id } = req.params

  const vendor = await vendorModuleService.updateVendors(id, req.body)

  res.json({ vendor })
}

export async function DELETE(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const vendorModuleService: VendorModuleService = 
    req.scope.resolve("vendorModuleService")
  const { id } = req.params

  await vendorModuleService.deleteVendors(id)

  res.json({ id, deleted: true })
}
