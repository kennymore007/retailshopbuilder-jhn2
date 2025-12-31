import { createFileRoute } from '@tanstack/react-router'
import VendorLoginPage from '@/pages/vendor-login'

export const Route = createFileRoute('/$countryCode/vendor-login')({
  component: VendorLoginPage,
})
