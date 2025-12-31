import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import VendorModule from "../modules/vendor"

/**
 * Link Products to Listings (one-to-one)
 * Listings can optionally be linked to Medusa products for inventory management
 */
export default defineLink(
  ProductModule.linkable.product,
  VendorModule.linkable.listing
)
