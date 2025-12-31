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
 */
export const Vendor = model.define("vendor", {
  id: model.id().primaryKey(),
  
  // Vendor identification
  vendor_code: model.text().unique(), // e.g., VND-2025-00123
  business_name: model.text(),
  vendor_type: model.enum([
    "farmer",
    "gig_worker",
    "storage_operator",
    "equipment_owner",
    "logistics_provider"
  ]),
  
  // Contact & location
  contact_person: model.text(),
  phone: model.text(),
  email: model.text(),
  
  // GPS location (stored as JSON: {lat, lng, address})
  location: model.json().nullable(),
  
  // Verification status
  is_verified: model.boolean().default(false),
  verification_date: model.dateTime().nullable(),
  
  // Business details
  registration_number: model.text().nullable(),
  tax_id: model.text().nullable(),
  
  // Financial
  bank_account: model.json().nullable(), // {account_name, account_number, bank_name, routing}
  
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
