import { 
  defineMiddlewares,
  authenticate,
} from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    // Vendor registration - allow unregistered auth identities
    {
      matcher: "/vendor",
      method: "POST",
      middlewares: [
        authenticate("vendor", ["session", "bearer"], {
          allowUnregistered: true,
        }),
      ],
    },
    // Vendor authenticated routes - require registered vendors
    {
      matcher: "/vendor/me*",
      middlewares: [
        authenticate("vendor", ["session", "bearer"]),
      ],
    },
    // Store vendor registration - no auth required
    {
      matcher: "/store/vendor/register",
      method: "POST",
      middlewares: [],
    },
  ],
})
