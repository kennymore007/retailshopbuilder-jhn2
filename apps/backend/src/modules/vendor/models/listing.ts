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
  
  // Marketplace identification
  marketplace_type: model.enum([
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
  price_type: model.enum(["fixed", "hourly", "daily", "weekly", "monthly"]).default("fixed"),
  base_price: model.bigNumber(), // Base price in cents
  currency_code: model.text().default("usd"),
  
  // Availability
  is_available: model.boolean().default(true),
  availability_status: model.enum([
    "available",
    "reserved",
    "rented",
    "sold",
    "maintenance",
    "inactive"
  ]).default("available"),
  
  // Quantity (for harvest batches)
  quantity: model.number().nullable(),
  unit: model.text().nullable(), // kg, tons, bags, etc.
  
  // Location
  location: model.json().nullable(), // GPS coordinates
  
  // Harvest-specific fields (nullable for other types)
  harvest_data: model.json().nullable(), // {crop_type, grade, harvest_date, farm_gps, farmer_name}
  
  // Vehicle-specific fields
  vehicle_data: model.json().nullable(), // {type, capacity, make, model, year, plate_number}
  
  // Storage-specific fields
  storage_data: model.json().nullable(), // {capacity, temperature_control, dimensions}
  
  // Equipment-specific fields
  equipment_data: model.json().nullable(), // {equipment_type, brand, model, condition}
  
  // Media
  images: model.array().nullable(), // Array of image URLs
  
  // Traceability (for harvest)
  traceability_data: model.json().nullable(), // {agent_id, verification_date, quality_checks}
  
  // Status tracking
  status: model.enum([
    "draft",
    "published",
    "pending_verification",
    "archived"
  ]).default("draft"),
  
  published_at: model.dateTime().nullable(),
  
  // Metadata
  metadata: model.json().nullable(),
  
  // Relationships
  bookings: model.hasMany(() => require("./booking").Booking, {
    mappedBy: "listing"
  }),
})

export default Listing
