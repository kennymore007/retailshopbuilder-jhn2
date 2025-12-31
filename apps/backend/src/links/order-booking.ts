import { defineLink } from "@medusajs/framework/utils"
import OrderModule from "@medusajs/medusa/order"
import VendorModule from "../modules/vendor"

/**
 * Link Orders to Bookings (one-to-one)
 * When a booking is created, an order is also created for payment processing
 */
export default defineLink(
  OrderModule.linkable.order,
  VendorModule.linkable.booking
)
