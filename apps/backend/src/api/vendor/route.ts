import type { 
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { createVendorWorkflow } from "../../workflows/vendor/create-vendor"

type RequestBody = {
  business_name: string
  email: string
  password: string
  phone_number?: string
  actor_type: "farmer" | "buyer" | "gig_worker" | "logistics_provider" | "storage_operator" | "agent" | "equipment_owner"
  location?: string
  registration_number?: string
  tax_id?: string
  bank_account?: Record<string, any>
}

/**
 * POST /vendor
 * Create a new vendor account
 * Creates both auth identity and vendor record
 */
export async function POST(
  req: AuthenticatedMedusaRequest<RequestBody>, 
  res: MedusaResponse
) {
  const { result } = await createVendorWorkflow(req.scope)
    .run({
      input: req.body,
    })
  
  res.status(200).json({ vendor: result.vendor, auth: result.authIdentity })
}
