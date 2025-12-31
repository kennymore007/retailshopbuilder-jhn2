import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export type CreateBookingInput = {
  listing_id: string
  customer_id: string
  start_date: Date
  end_date: Date
  total_amount: number
  currency: string
  status?: "pending" | "confirmed" | "cancelled" | "completed"
  metadata?: Record<string, any>
}

const createBookingStep = createStep(
  "create-booking-step",
  async (input: CreateBookingInput, { container }) => {
    const vendorModule = container.resolve("vendor")
    
    const booking = await vendorModule.createBookings({
      listing_id: input.listing_id,
      customer_id: input.customer_id,
      start_date: input.start_date,
      end_date: input.end_date,
      total_amount: input.total_amount,
      currency: input.currency,
      status: input.status || "pending",
      metadata: input.metadata || {},
    })

    return new StepResponse(booking, booking.id)
  },
  async (bookingId, { container }) => {
    if (!bookingId) return
    
    const vendorModule = container.resolve("vendor")
    await vendorModule.deleteBookings(bookingId)
  }
)

export const createBookingWorkflow = createWorkflow(
  "create-booking",
  (input: CreateBookingInput) => {
    const booking = createBookingStep(input)
    return new WorkflowResponse(booking)
  }
)
