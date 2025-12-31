import { createFileRoute, redirect } from "@tanstack/react-router";
import DashboardPage from "@/pages/dashboard";

export const Route = createFileRoute("/$countryCode/dashboard")({
  beforeLoad: () => {
    // Check if vendor is logged in
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("vendor_session");
      if (!session) {
        throw redirect({
          to: "/$countryCode/login",
          params: { countryCode: "ng" },
        });
      }
    }
  },
  component: DashboardPage,
});
