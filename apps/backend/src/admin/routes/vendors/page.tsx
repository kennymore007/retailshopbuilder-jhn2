import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Badge, Table, Button } from "@medusajs/ui"
import { PencilSquare, Trash, CheckCircleSolid, XCircleSolid } from "@medusajs/icons"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

type Vendor = {
  id: string
  handle: string
  name: string
  description: string | null
  status: "pending" | "approved" | "rejected" | "suspended"
  created_at: string
  updated_at: string
  metadata: {
    business_email?: string
    business_phone?: string
    business_address?: string
  }
}

const VendorsPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected" | "suspended">("all")

  const { data: vendors, isLoading } = useQuery({
    queryKey: ["vendors", filter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filter !== "all") {
        params.append("status", filter)
      }
      const response = await fetch(`/admin/vendors?${params.toString()}`, {
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to fetch vendors")
      const data = await response.json()
      return data.vendors as Vendor[]
    },
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

  const suspendMutation = useMutation({
    mutationFn: async (vendorId: string) => {
      const response = await fetch(`/admin/vendors/${vendorId}/suspend`, {
        method: "POST",
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to suspend vendor")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (vendorId: string) => {
      const response = await fetch(`/admin/vendors/${vendorId}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to delete vendor")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] })
    },
  })

  const getStatusBadge = (status: Vendor["status"]) => {
    const variants = {
      pending: { color: "orange" as const, label: "Pending" },
      approved: { color: "green" as const, label: "Approved" },
      rejected: { color: "red" as const, label: "Rejected" },
      suspended: { color: "grey" as const, label: "Suspended" },
    }
    const { color, label } = variants[status]
    return <Badge color={color}>{label}</Badge>
  }

  const pendingCount = vendors?.filter(v => v.status === "pending").length || 0

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Heading level="h1">Vendor Management</Heading>
          <p className="text-ui-fg-subtle mt-1">
            Manage vendor applications and accounts
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-ui-border-base">
        {(["all", "pending", "approved", "rejected", "suspended"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              filter === f
                ? "text-ui-fg-base border-b-2 border-ui-fg-base"
                : "text-ui-fg-muted hover:text-ui-fg-subtle"
            }`}
          >
            {f}
            {f === "pending" && pendingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-orange-500 text-white rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Vendors Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-ui-fg-subtle">Loading vendors...</p>
        </div>
      ) : vendors && vendors.length > 0 ? (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Vendor</Table.HeaderCell>
              <Table.HeaderCell>Handle</Table.HeaderCell>
              <Table.HeaderCell>Contact</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Created</Table.HeaderCell>
              <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {vendors.map((vendor) => (
              <Table.Row
                key={vendor.id}
                className="cursor-pointer hover:bg-ui-bg-subtle-hover"
                onClick={() => navigate(`/vendors/${vendor.id}`)}
              >
                <Table.Cell>
                  <div>
                    <p className="font-medium">{vendor.name}</p>
                    {vendor.description && (
                      <p className="text-sm text-ui-fg-subtle line-clamp-1">
                        {vendor.description}
                      </p>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <code className="text-sm text-ui-fg-subtle">
                    {vendor.handle}
                  </code>
                </Table.Cell>
                <Table.Cell>
                  <div className="text-sm">
                    {vendor.metadata?.business_email && (
                      <p>{vendor.metadata.business_email}</p>
                    )}
                    {vendor.metadata?.business_phone && (
                      <p className="text-ui-fg-subtle">
                        {vendor.metadata.business_phone}
                      </p>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>{getStatusBadge(vendor.status)}</Table.Cell>
                <Table.Cell>
                  <span className="text-sm text-ui-fg-subtle">
                    {new Date(vendor.created_at).toLocaleDateString()}
                  </span>
                </Table.Cell>
                <Table.Cell className="text-right">
                  <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    {vendor.status === "pending" && (
                      <>
                        <Button
                          size="small"
                          variant="transparent"
                          onClick={() => approveMutation.mutate(vendor.id)}
                          disabled={approveMutation.isPending}
                        >
                          <CheckCircleSolid className="text-green-500" />
                        </Button>
                        <Button
                          size="small"
                          variant="transparent"
                          onClick={() => rejectMutation.mutate(vendor.id)}
                          disabled={rejectMutation.isPending}
                        >
                          <XCircleSolid className="text-red-500" />
                        </Button>
                      </>
                    )}
                    {vendor.status === "approved" && (
                      <Button
                        size="small"
                        variant="transparent"
                        onClick={() => suspendMutation.mutate(vendor.id)}
                        disabled={suspendMutation.isPending}
                      >
                        <XCircleSolid className="text-orange-500" />
                      </Button>
                    )}
                    <Button
                      size="small"
                      variant="transparent"
                      onClick={() => navigate(`/vendors/${vendor.id}`)}
                    >
                      <PencilSquare />
                    </Button>
                    <Button
                      size="small"
                      variant="transparent"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${vendor.name}?`)) {
                          deleteMutation.mutate(vendor.id)
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash className="text-red-500" />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-ui-fg-subtle mb-2">No vendors found</p>
          <p className="text-sm text-ui-fg-muted">
            {filter !== "all" 
              ? `No ${filter} vendors at the moment` 
              : "Vendors will appear here once they register"}
          </p>
        </div>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Vendors",
  icon: <CheckCircleSolid />,
})

export default VendorsPage
