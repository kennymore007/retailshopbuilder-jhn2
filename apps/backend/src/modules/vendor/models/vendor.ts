import { model } from "@medusajs/framework/utils"

/**
 * Vendor model - represents sellers in marketplaces
 * Linked to Medusa Customer (one-to-one)
 * 
 * Vendor roles:
 * - farmer: Sells harvest batches
 * - gig_worker: Rents vehicles, provides labor
 * - storage_operator: Rents storage space
 * - equipment_owner: Rents farm equipment
 * - logistics_provider: Provides transport services
 * - buyer: Purchases harvest batches
 * - agent: Intermediary between vendors and buyers
 */
export const Vendor = model.define("vendor", {
  id: model.id().primaryKey(),
  
  // Business identification
  business_name: model.text(),
  email: model.text(),
  phone_number: model.text().nullable(),
  
  // Actor type (role in marketplace)
  actor_type: model.enum([
    "farmer",
    "gig_worker",
    "storage_operator",
    "equipment_owner",
    "logistics_provider",
    "buyer",
    "agent"
  ]),
  
  // Location (can be city name or GPS coordinates)
  location: model.text().nullable(),
  
  // Verification status
  verification_status: model.enum(["pending", "verified", "rejected"]).default("pending"),
  verification_date: model.dateTime().nullable(),
  
  // Business details
  registration_number: model.text().nullable(),
  tax_id: model.text().nullable(),
  
  // Financial
  bank_account: model.json().nullable(),
  
  // Status
  is_active: model.boolean().default(true),
  
  // Metadata for custom fields
  metadata: model.json().nullable(),
  
  // Relationships
  listings: model.hasMany(() => require("./listing").Listing, {
    mappedBy: "vendor"
  }),
})

export default Vendor
