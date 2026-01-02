import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve("query")
  const { limit = 20, offset = 0, status } = req.query

  const filters: any = {}
  if (status) {
    filters.verification_status = status
  }

  const { data: vendors } = await query.graph({
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
      "created_at",
      "updated_at",
    ],
    filters: Object.keys(filters).length > 0 ? filters : undefined,
    pagination: {
      skip: Number(offset),
      take: Number(limit),
      order: { created_at: "DESC" },
    },
  })

  res.json({
    vendors,
    count: vendors.length,
    limit: Number(limit),
    offset: Number(offset),
  })
}
