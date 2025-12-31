import { defineLink } from "@medusajs/framework/utils"
import CustomerModule from "@medusajs/medusa/customer"
import VendorModule from "../modules/vendor"

/**
 * Link Customers to Vendors (one-to-one)
 * A customer can also be a vendor (seller) in the marketplace
 */
export default defineLink(
  CustomerModule.linkable.customer,
  VendorModule.linkable.vendor
)
