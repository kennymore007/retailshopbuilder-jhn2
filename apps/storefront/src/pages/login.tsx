import { useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { sdk } from "@/lib/utils/sdk";

export default function LoginPage() {
  const { countryCode } = useParams({ strict: false });
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Fetch vendor by email
      const response = await sdk.client.fetch<{ vendors: any[] }>("/store/vendors", {
        method: "GET",
      });

      const vendor = response.vendors.find((v: any) => v.email === email);

      if (!vendor) {
        setError("No vendor account found with this email. Please register first.");
        setIsLoading(false);
        return;
      }

      // Store vendor session in localStorage
      localStorage.setItem("vendor_session", JSON.stringify({
        id: vendor.id,
        name: vendor.business_name,
        email: vendor.email,
        actor_type: vendor.actor_type,
        phone: vendor.phone_number,
      }));

      // Redirect to dashboard
      navigate({ to: `/${countryCode}/dashboard` });
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Login to access your vendor dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a href={`/${countryCode}/register`} className="text-green-600 hover:text-green-700 font-semibold">
                Become a Vendor
              </a>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Simplified authentication for development</p>
          <p className="mt-1">No password required - email lookup only</p>
        </div>
      </div>
    </div>
  );
}
