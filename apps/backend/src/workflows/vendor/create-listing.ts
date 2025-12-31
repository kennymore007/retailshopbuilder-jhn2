import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export type CreateListingInput = {
  vendor_id: string
  title: string
  description?: string
  listing_type: "harvest" | "vehicle" | "storage" | "equipment"
  status?: "active" | "inactive" | "sold" | "rented"
  price_amount: number
  price_currency: string
  quantity?: number
  unit?: string
  location?: string
  metadata?: Record<string, any>
}

const createListingStep = createStep(
  "create-listing-step",
  async (input: CreateListingInput, { container }) => {
    const vendorModule = container.resolve("vendor")
    
    const listing = await vendorModule.createListings({
      vendor_id: input.vendor_id,
      title: input.title,
      description: input.description,
      listing_type: input.listing_type,
      status: input.status || "active",
      price_amount: input.price_amount,
      price_currency: input.price_currency,
      quantity: input.quantity,
      unit: input.unit,
      location: input.location,
      metadata: input.metadata || {},
    })

    return new StepResponse(listing, listing.id)
  },
  async (listingId, { container }) => {
    if (!listingId) return
    
    const vendorModule = container.resolve("vendor")
    await vendorModule.deleteListings(listingId)
  }
)

export const createListingWorkflow = createWorkflow(
  "create-listing",
  (input: CreateListingInput) => {
    const listing = createListingStep(input)
    return new WorkflowResponse(listing)
  }
)
