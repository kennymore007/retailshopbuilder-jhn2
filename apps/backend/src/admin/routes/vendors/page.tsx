import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Badge, Table, Button, Tabs } from "@medusajs/ui"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

type Vendor = {
  id: string
  business_name: string
  email: string
  phone_number: string | null
  actor_type: "farmer" | "gig_worker" | "storage_operator" | "equipment_owner" | "logistics_provider" | "buyer" | "agent"
  location: string | null
  verification_status: "pending" | "verified" | "rejected"
  is_active: boolean
  metadata: {
    description?: string
    city?: string
    state?: string
    country?: string
  } | null
}

const VendorsPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState("all")

  const { data: vendors, isLoading } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const response = await fetch(`/admin/vendors`, {
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to fetch vendors")
      const data = await response.json()
      return data.vendors as Vendor[]
    },
  })

  const verifyMutation = useMutation({
    mutationFn: async (vendorId: string) => {
      const response = await fetch(`/admin/vendors/${vendorId}/verify`, {
        method: "POST",
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to verify vendor")
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

  const getStatusBadge = (status: Vendor["verification_status"]) => {
    const variants = {
      pending: "orange" as const,
      verified: "green" as const,
      rejected: "red" as const,
    }
    return <Badge color={variants[status]}>{status}</Badge>
  }

  const getActorTypeBadge = (type: Vendor["actor_type"]) => {
    return <Badge color="blue">{type.replace("_", " ")}</Badge>
  }

  const filteredVendors = vendors?.filter((v) => {
    if (activeTab === "all") return true
    return v.verification_status === activeTab
  }) || []

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center h-64">
          <div className="text-ui-fg-subtle">Loading vendors...</div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Heading level="h1">Vendor Management</Heading>
          <p className="text-ui-fg-subtle mt-2">
            Manage vendor applications and accounts
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Trigger value="all">
            All
            {vendors && <Badge className="ml-2">{vendors.length}</Badge>}
          </Tabs.Trigger>
          <Tabs.Trigger value="pending">
            Pending
            {vendors && (
              <Badge className="ml-2" color="orange">
                {vendors.filter((v) => v.verification_status === "pending").length}
              </Badge>
            )}
          </Tabs.Trigger>
          <Tabs.Trigger value="verified">
            Verified
            {vendors && (
              <Badge className="ml-2" color="green">
                {vendors.filter((v) => v.verification_status === "verified").length}
              </Badge>
            )}
          </Tabs.Trigger>
          <Tabs.Trigger value="rejected">
            Rejected
            {vendors && (
              <Badge className="ml-2" color="red">
                {vendors.filter((v) => v.verification_status === "rejected").length}
              </Badge>
            )}
          </Tabs.Trigger>
        </Tabs.List>

        <div className="mt-6">
          {filteredVendors.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-ui-fg-subtle">
              <p>No vendors found</p>
              <p className="text-sm mt-2">Vendors will appear here once they register</p>
            </div>
          ) : (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Business Name</Table.HeaderCell>
                  <Table.HeaderCell>Type</Table.HeaderCell>
                  <Table.HeaderCell>Location</Table.HeaderCell>
                  <Table.HeaderCell>Contact</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Active</Table.HeaderCell>
                  <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredVendors.map((vendor) => (
                  <Table.Row
                    key={vendor.id}
                    className="cursor-pointer hover:bg-ui-bg-subtle-hover"
                    onClick={() => navigate(`/vendors/${vendor.id}`)}
                  >
                    <Table.Cell>
                      <div>
                        <div className="font-medium">{vendor.business_name}</div>
                        {vendor.metadata?.description && (
                          <div className="text-sm text-ui-fg-subtle line-clamp-1">
                            {vendor.metadata.description}
                          </div>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell>{getActorTypeBadge(vendor.actor_type)}</Table.Cell>
                    <Table.Cell>
                      <div className="text-sm">
                        {vendor.metadata?.city && vendor.metadata?.state
                          ? `${vendor.metadata.city}, ${vendor.metadata.state}`
                          : vendor.location || "N/A"}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="text-sm">
                        <div>{vendor.email}</div>
                        {vendor.phone_number && (
                          <div className="text-ui-fg-subtle">{vendor.phone_number}</div>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell>{getStatusBadge(vendor.verification_status)}</Table.Cell>
                    <Table.Cell>
                      <Badge color={vendor.is_active ? "green" : "grey"}>
                        {vendor.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        {vendor.verification_status === "pending" && (
                          <>
                            <Button
                              size="small"
                              variant="transparent"
                              onClick={() => verifyMutation.mutate(vendor.id)}
                            >
                              Verify
                            </Button>
                            <Button
                              size="small"
                              variant="transparent"
                              onClick={() => rejectMutation.mutate(vendor.id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {vendor.verification_status === "rejected" && (
                          <Button
                            size="small"
                            variant="transparent"
                            onClick={() => verifyMutation.mutate(vendor.id)}
                          >
                            Verify
                          </Button>
                        )}
                        <Button
                          size="small"
                          variant="transparent"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this vendor?")) {
                              deleteMutation.mutate(vendor.id)
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </div>
      </Tabs>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Vendors",
})

export default VendorsPage
