import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  try {
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
  } catch (error) {
    console.error("Error fetching vendors:", error)
    res.status(500).json({ 
      message: "Failed to fetch vendors",
      error: error.message 
    })
  }
}
