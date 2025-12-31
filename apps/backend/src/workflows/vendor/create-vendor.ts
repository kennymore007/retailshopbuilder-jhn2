import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { setAuthAppMetadataStep } from "@medusajs/medusa/core-flows"

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
    const authModuleService = container.resolve(Modules.AUTH)
    
    // Register vendor with email and password
    const authResponse = await authModuleService.register("emailpass", {
      body: {
        email: input.email,
        password: input.password,
      }
    } as any)

    return new StepResponse(authResponse, authResponse.auth_identity?.id)
  },
  async (authIdentityId, { container }) => {
    if (!authIdentityId) return
    
    const authModuleService = container.resolve(Modules.AUTH)
    await authModuleService.deleteAuthIdentities(authIdentityId)
  }
)

const createVendorStep = createStep(
  "create-vendor-step",
  async (input: CreateVendorInput, { container }) => {
    const vendorModule = container.resolve("vendorModuleService")
    
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
    
    const vendorModule = container.resolve("vendorModuleService")
    await vendorModule.deleteVendors(vendorId)
  }
)

export const createVendorWorkflow = createWorkflow(
  "create-vendor",
  (input: CreateVendorInput) => {
    const authIdentity = createAuthIdentityStep(input)
    const vendor = createVendorStep(input)
    
    // Link vendor to auth identity via app_metadata (Medusa recommended pattern)
    setAuthAppMetadataStep({
      authIdentityId: authIdentity.auth_identity.id,
      actorType: "vendor",
      value: vendor.id,
    })
    
    return new WorkflowResponse({ vendor, authIdentity })
  }
)
