import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve("query")

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
      "metadata",
      "created_at",
      "updated_at",
    ],
  })

  res.json({ vendors })
}
