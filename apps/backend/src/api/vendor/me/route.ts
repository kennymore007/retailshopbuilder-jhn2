import { 
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

/**
 * GET /vendor/me
 * Get authenticated vendor's details
 * Requires vendor authentication
 */
export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const query = req.scope.resolve("query")
  const vendorId = req.auth_context?.actor_id

  const { data: [vendor] } = await query.graph({
    entity: "vendor",
    fields: ["*", "listings.*"],
    filters: {
      id: vendorId,
    },
  }, {
    throwIfKeyNotFound: true,
  })

  res.json({ vendor })
}

/**
 * PUT /vendor/me
 * Update authenticated vendor's details
 */
export async function PUT(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const vendorModuleService = req.scope.resolve("vendorModuleService")
  const vendorId = req.auth_context?.actor_id

  const vendor = await vendorModuleService.updateVendors(vendorId, req.body)

  res.json({ vendor })
}
