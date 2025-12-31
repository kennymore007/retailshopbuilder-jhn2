import { MedusaService } from "@medusajs/framework/utils"
import Vendor from "./models/vendor"
import Listing from "./models/listing"
import Booking from "./models/booking"

/**
 * Vendor Module Service
 * 
 * Provides CRUD operations for:
 * - Vendors (farmers, gig workers, storage operators, equipment owners, logistics)
 * - Listings (harvest batches, vehicles, storage spaces, equipment)
 * - Bookings (rental reservations)
 */
class VendorModuleService extends MedusaService({
  Vendor,
  Listing,
  Booking,
}) {}

export default VendorModuleService
