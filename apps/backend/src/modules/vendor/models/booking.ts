import { model } from "@medusajs/framework/utils"
import { Listing } from "./listing"

/**
 * Booking model - represents reservations/rentals
 * Linked to Medusa Order for payment processing
 * 
 * Used for:
 * - Vehicle rentals
 * - Storage space bookings
 * - Equipment rentals
 */
export const Booking = model.define("booking", {
  id: model.id().primaryKey(),
  
  // Booking code for easy reference
  booking_code: model.text().unique(), // e.g., BKG-2025-00456
  
  // Listing relationship
  listing: model.belongsTo(() => Listing, {
    mappedBy: "bookings"
  }),
  
  // Booking period
  start_date: model.dateTime(),
  end_date: model.dateTime(),
  duration_hours: model.number().nullable(), // Calculated duration
  
  // Pricing
  total_amount: model.bigNumber(), // Total in cents
  currency_code: model.text().default("usd"),
  
  // Deposit/security
  deposit_amount: model.bigNumber().nullable(),
  deposit_status: model.enum([
    "pending",
    "held",
    "released",
    "forfeited"
  ]).nullable(),
  
  // Status tracking
  booking_status: model.enum([
    "pending",
    "confirmed",
    "active",
    "completed",
    "cancelled",
    "disputed"
  ]).default("pending"),
  
  // Confirmation
  confirmed_at: model.dateTime().nullable(),
  confirmed_by: model.text().nullable(), // Vendor ID who confirmed
  
  // Pickup/delivery details
  pickup_location: model.json().nullable(),
  delivery_location: model.json().nullable(),
  pickup_time: model.dateTime().nullable(),
  delivery_time: model.dateTime().nullable(),
  
  // Proof of transaction
  pickup_proof: model.json().nullable(), // {images, signature, timestamp}
  delivery_proof: model.json().nullable(),
  
  // Cancellation
  cancelled_at: model.dateTime().nullable(),
  cancellation_reason: model.text().nullable(),
  
  // Notes
  customer_notes: model.text().nullable(),
  vendor_notes: model.text().nullable(),
  
  // Metadata
  metadata: model.json().nullable(),
})

export default Booking
