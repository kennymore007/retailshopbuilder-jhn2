import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Badge, Button } from "@medusajs/ui"
import { CheckCircleSolid, XCircleSolid, ArrowUpRightOnBox } from "@medusajs/icons"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

type Vendor = {
  id: string
  handle: string
  name: string
  description: string | null
  status: "pending" | "approved" | "rejected" | "suspended"
  created_at: string
  metadata: {
    business_email?: string
    business_phone?: string
  }
}

const PendingVendorsWidget = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: vendors, isLoading } = useQuery({
    queryKey: ["vendors", "pending"],
    queryFn: async () => {
      const response = await fetch("/admin/vendors?status=pending&limit=5", {
        credentials: "include",
      })
      if (!response.ok) return []
      const data = await response.json()
      return data.vendors as Vendor[]
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  const approveMutation = useMutation({
    mutationFn: async (vendorId: string) => {
      const response = await fetch(`/admin/vendors/${vendorId}/approve`, {
        method: "POST",
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to approve vendor")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: async (vendorId: string) => {
      const response = await fetch(`/admin/vendors/${vendorId}/reject`, {
        method: "POST",
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to reject vendor")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] })
    },
  })

  const pendingCount = vendors?.length || 0

  return (
    <Container>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Heading level="h2">Pending Vendor Applications</Heading>
          {pendingCount > 0 && (
            <Badge color="orange" className="text-sm">
              {pendingCount} pending
            </Badge>
          )}
        </div>
        <Button
          variant="transparent"
          onClick={() => navigate("/vendors?filter=pending")}
        >
          View All
          <ArrowUpRightOnBox />
        </Button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center">
          <p className="text-ui-fg-subtle">Loading vendors...</p>
        </div>
      ) : pendingCount === 0 ? (
        <div className="py-8 text-center">
          <p className="text-ui-fg-subtle">No pending applications</p>
          <p className="text-sm text-ui-fg-muted mt-1">
            New vendor applications will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {vendors?.map((vendor) => (
            <div
              key={vendor.id}
              className="flex items-center justify-between p-4 bg-ui-bg-subtle rounded-lg hover:bg-ui-bg-subtle-hover transition-colors cursor-pointer"
              onClick={() => navigate(`/vendors/${vendor.id}`)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium">{vendor.name}</p>
                  <Badge color="orange" size="small">
                    Pending
                  </Badge>
                </div>
                {vendor.description && (
                  <p className="text-sm text-ui-fg-subtle line-clamp-1 mb-1">
                    {vendor.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-ui-fg-muted">
                  {vendor.metadata?.business_email && (
                    <span>{vendor.metadata.business_email}</span>
                  )}
                  {vendor.metadata?.business_phone && (
                    <span>{vendor.metadata.business_phone}</span>
                  )}
                  <span>
                    Applied {new Date(vendor.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div
                className="flex items-center gap-2 ml-4"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => approveMutation.mutate(vendor.id)}
                  disabled={approveMutation.isPending}
                >
                  <CheckCircleSolid className="text-green-500" />
                  Approve
                </Button>
                <Button
                  size="small"
                  variant="danger"
                  onClick={() => rejectMutation.mutate(vendor.id)}
                  disabled={rejectMutation.isPending}
                >
                  <XCircleSolid />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "dashboard.top",
})

export default PendingVendorsWidget
