import { model } from "@medusajs/framework/utils"
import { Vendor } from "./vendor"

/**
 * Listing model - represents items/services for sale or rent
 * Can be linked to Medusa Product for inventory management
 * 
 * Listing types by marketplace:
 * - harvest: Farm produce batches
 * - vehicle: Rental vehicles
 * - storage: Storage space rental
 * - equipment: Farm equipment rental
 */
export const Listing = model.define("listing", {
  id: model.id().primaryKey(),
  
  // Listing type (which marketplace)
  listing_type: model.enum([
    "harvest",
    "vehicle",
    "storage",
    "equipment"
  ]),
  
  // Listing details
  title: model.text(),
  description: model.text().nullable(),
  
  // Vendor relationship
  vendor: model.belongsTo(() => Vendor, {
    mappedBy: "listings"
  }),
  
  // Pricing
  price_amount: model.number(),
  price_currency: model.text().default("kes"),
  
  // Availability/Status
  status: model.enum(["active", "inactive", "sold", "rented"]).default("active"),
  
  // Quantity (for harvest batches)
  quantity: model.number().nullable(),
  unit: model.text().nullable(), // kg, tons, liters, etc.
  
  // Location (city name or GPS)
  location: model.text().nullable(),
  
  // Metadata for specific marketplace data
  metadata: model.json().nullable(),
  
  // Relationships
  bookings: model.hasMany(() => require("./booking").Booking, {
    mappedBy: "listing"
  }),
})

export default Listing
