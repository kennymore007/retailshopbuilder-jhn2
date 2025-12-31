import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export type CreateVendorInput = {
  email: string
  password: string
  business_name: string
  actor_type: "farmer" | "buyer" | "gig_worker" | "logistics_provider" | "storage_operator" | "agent" | "equipment_owner"
  phone_number?: string
  location?: string
  verification_status?: "pending" | "verified" | "rejected"
  metadata?: Record<string, any>
}

const createAuthIdentityStep = createStep(
  "create-auth-identity-step",
  async (input: CreateVendorInput, { container }) => {
    const authModule = container.resolve("auth_identity")
    
    // Create auth identity for vendor
    const authIdentity = await authModule.createAuthIdentities({
      entity_id: input.email,
      provider: "emailpass",
      provider_metadata: {
        password: input.password
      },
      app_metadata: {
        actor_type: "vendor"
      }
    })

    return new StepResponse(authIdentity, authIdentity.id)
  },
  async (authIdentityId, { container }) => {
    if (!authIdentityId) return
    
    const authModule = container.resolve("auth_identity")
    await authModule.deleteAuthIdentities(authIdentityId)
  }
)

const createVendorStep = createStep(
  "create-vendor-step",
  async (input: CreateVendorInput, { container }) => {
    const vendorModule = container.resolve("vendor")
    
    const vendor = await vendorModule.createVendors({
      email: input.email,
      business_name: input.business_name,
      actor_type: input.actor_type,
      phone_number: input.phone_number,
      location: input.location,
      verification_status: input.verification_status || "pending",
      metadata: input.metadata || {},
    })

    return new StepResponse(vendor, vendor.id)
  },
  async (vendorId, { container }) => {
    if (!vendorId) return
    
    const vendorModule = container.resolve("vendor")
    await vendorModule.deleteVendors(vendorId)
  }
)

export const createVendorWorkflow = createWorkflow(
  "create-vendor",
  (input: CreateVendorInput) => {
    const authIdentity = createAuthIdentityStep(input)
    const vendor = createVendorStep(input)
    return new WorkflowResponse({ vendor, authIdentity })
  }
)
